'use server';

import crypto from 'node:crypto';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import {
  clearAdminSession,
  isAdminAuthenticated,
  setAdminSession,
  verifyAdminPassword,
} from '@/lib/session';
import { validateSiswaInput, type SiswaFieldErrors } from '@/lib/validation';

export interface AdminLoginState {
  error?: string;
}

export async function loginAdminAction(
  _prevState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const password = String(formData.get('password') ?? '');

  if (!password) {
    return { error: 'Kata sandi admin wajib diisi.' };
  }

  if (!verifyAdminPassword(password)) {
    return { error: 'Kata sandi admin tidak valid.' };
  }

  await setAdminSession();
  redirect('/admin');
}

export async function logoutAdminAction(): Promise<void> {
  await clearAdminSession();
  redirect('/login');
}

export interface ReviewJurnalState {
  error?: string;
  success?: string;
}

export async function reviewJurnalAction(
  jurnalId: number,
  _prevState: ReviewJurnalState,
  formData: FormData
): Promise<ReviewJurnalState> {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    redirect('/login');
  }

  if (!Number.isInteger(jurnalId) || jurnalId <= 0) {
    return { error: 'ID jurnal tidak valid.' };
  }

  const keputusan = String(formData.get('keputusan') ?? '').trim();
  const catatan = String(formData.get('catatan') ?? '').trim();

  if (keputusan !== 'disetujui' && keputusan !== 'revisi') {
    return { error: 'Pilih tindakan Setujui atau Revisi.' };
  }

  if (keputusan === 'revisi' && catatan.length < 5) {
    return {
      error: 'Catatan revisi wajib diisi minimal 5 karakter saat memilih status Revisi.',
    };
  }

  const supabase = getSupabaseAdmin();
  const updatePayload =
    keputusan === 'disetujui'
      ? { status: 'disetujui', catatan: null }
      : { status: 'revisi', catatan };

  const { error } = await supabase
    .from('jurnal')
    .update(updatePayload)
    .eq('id', jurnalId);

  if (error) {
    return { error: 'Gagal memperbarui status jurnal di basis data.' };
  }

  revalidatePath('/admin');
  revalidatePath('/jurnal');
  return {
    success:
      keputusan === 'disetujui'
        ? 'Jurnal berhasil disetujui.'
        : 'Status jurnal diubah menjadi revisi dengan catatan.',
  };
}

export interface SiswaActionState {
  error?: string;
  success?: string;
  generatedCode?: string;
  errors?: SiswaFieldErrors;
  values?: {
    nama: string;
    kelas: string;
    tempat_pkl: string;
    pembimbing: string;
  };
}

function generateKodeSiswa(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(8);
  let suffix = '';
  for (let i = 0; i < bytes.length; i++) {
    suffix += chars[bytes[i] % chars.length];
  }
  return `PKL-${suffix}`;
}

export async function tambahSiswaAction(
  _prevState: SiswaActionState,
  formData: FormData
): Promise<SiswaActionState> {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    redirect('/login');
  }

  const rawValues = {
    nama: String(formData.get('nama') ?? ''),
    kelas: String(formData.get('kelas') ?? ''),
    tempat_pkl: String(formData.get('tempat_pkl') ?? ''),
    pembimbing: String(formData.get('pembimbing') ?? ''),
  };

  const validation = validateSiswaInput(rawValues);
  if (!validation.valid) {
    return {
      error: 'Periksa kembali isian data siswa.',
      errors: validation.errors,
      values: rawValues,
    };
  }

  const supabase = getSupabaseAdmin();

  for (let attempt = 0; attempt < 5; attempt++) {
    const kode = generateKodeSiswa();
    const { error } = await supabase.from('siswa').insert({
      nama: validation.data.nama,
      kelas: validation.data.kelas,
      tempat_pkl: validation.data.tempat_pkl,
      pembimbing: validation.data.pembimbing,
      kode,
    });

    if (!error) {
      revalidatePath('/admin');
      revalidatePath('/admin/siswa');
      return {
        success: `Siswa ${validation.data.nama} berhasil ditambahkan.`,
        generatedCode: kode,
      };
    }

    if (error.code !== '23505') {
      return {
        error: 'Gagal menambahkan data siswa. Pastikan isian sesuai aturan.',
        values: rawValues,
      };
    }
  }

  return {
    error: 'Gagal membuat kode unik siswa. Silakan coba lagi.',
    values: rawValues,
  };
}

export async function hapusSiswaAction(
  siswaId: number
): Promise<{ error?: string; success?: string }> {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    redirect('/login');
  }

  if (!Number.isInteger(siswaId) || siswaId <= 0) {
    return { error: 'ID siswa tidak valid.' };
  }

  const supabase = getSupabaseAdmin();

  const { count, error: countError } = await supabase
    .from('jurnal')
    .select('id', { count: 'exact', head: true })
    .eq('siswa_id', siswaId);

  if (countError) {
    return { error: 'Gagal memeriksa riwayat jurnal siswa.' };
  }

  if ((count ?? 0) > 0) {
    return {
      error: 'Siswa tidak dapat dihapus karena sudah memiliki data jurnal.',
    };
  }

  const { error: deleteError } = await supabase
    .from('siswa')
    .delete()
    .eq('id', siswaId);

  if (deleteError) {
    return {
      error: 'Gagal menghapus siswa karena masih terhubung dengan data lain.',
    };
  }

  revalidatePath('/admin');
  revalidatePath('/admin/siswa');
  return { success: 'Data siswa berhasil dihapus.' };
}