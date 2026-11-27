'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { setSiswaSession, clearSiswaSession, getSiswaSessionId } from '@/lib/session';

export interface MasukMuridState {
  error?: string;
  kode?: string;
}

export interface JurnalFormState {
  message?: string;
  errors?: {
    tanggal?: string;
    kegiatan?: string;
    kompetensi?: string;
    durasi_jam?: string;
  };
  values?: {
    tanggal?: string;
    kegiatan?: string;
    kompetensi?: string;
    durasi_jam?: string;
  };
}

export async function loginMuridAction(
  _prevState: MasukMuridState,
  formData: FormData
): Promise<MasukMuridState> {
  const rawKode = String(formData.get('kode') ?? '').trim().toUpperCase();

  if (!rawKode) {
    return { error: 'Kode siswa wajib diisi.', kode: rawKode };
  }

  try {
    const supabase = getSupabaseAdmin();

    // Cek seluruh kolom baris yang cocok agar tidak gagal kalau nama kolomnya 'kode' atau 'kode_siswa'
    let { data: siswa, error } = await supabase
      .from('siswa')
      .select('*')
      .eq('kode', rawKode)
      .maybeSingle();

    if (error && error.message.includes('kode')) {
      const retry = await supabase
        .from('siswa')
        .select('*')
        .eq('kode_siswa', rawKode)
        .maybeSingle();
      siswa = retry.data;
      error = retry.error;
    }

    if (error) {
      return {
        error: `Error DB (${error.code ?? 'DB'}): ${error.message}`,
        kode: rawKode,
      };
    }

    if (!siswa) {
      return {
        error: `Kode "${rawKode}" tidak ada di tabel siswa.`,
        kode: rawKode,
      };
    }

    await setSiswaSession(siswa.id);
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? `Error Sistem: ${err.message}`
          : `Error Sistem: ${String(err)}`,
      kode: rawKode,
    };
  }

  revalidatePath('/jurnal');
  redirect('/jurnal');
}

export async function logoutMuridAction(): Promise<void> {
  await clearSiswaSession();
  redirect('/masuk');
}

export async function ubahJurnalAction(
  jurnalId: number,
  _prevState: JurnalFormState,
  formData: FormData
): Promise<JurnalFormState> {
  const siswaId = await getSiswaSessionId();
  if (!siswaId) redirect('/masuk');

  const tanggal = String(formData.get('tanggal') ?? '').trim();
  const kompetensi = String(formData.get('kompetensi') ?? '').trim();
  const kegiatan = String(formData.get('kegiatan') ?? '').trim();
  const durasiRaw = String(formData.get('durasi_jam') ?? '').trim();
  const durasiJam = Number(durasiRaw);

  const values = { tanggal, kompetensi, kegiatan, durasi_jam: durasiRaw };
  const errors: JurnalFormState['errors'] = {};

  if (!tanggal) errors.tanggal = 'Tanggal jurnal wajib diisi.';
  if (kompetensi.length < 3 || kompetensi.length > 60) {
    errors.kompetensi = 'Kompetensi harus 3–60 huruf.';
  }
  if (kegiatan.length < 30 || kegiatan.length > 500) {
    errors.kegiatan = 'Uraian kegiatan harus 30–500 huruf.';
  }
  if (!Number.isInteger(durasiJam) || durasiJam < 1 || durasiJam > 10) {
    errors.durasi_jam = 'Durasi jam harus bilangan bulat antara 1 sampai 10.';
  }

  if (Object.keys(errors).length > 0) {
    return { message: 'Periksa kembali isian form jurnal Anda.', errors, values };
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: existing, error: fetchError } = await supabase
      .from('jurnal')
      .select('id, siswa_id, status')
      .eq('id', jurnalId)
      .single();

    if (fetchError || !existing) {
      return { message: 'Data jurnal tidak ditemukan.', values };
    }
    if (existing.siswa_id !== siswaId) {
      return { message: 'Anda tidak berhak mengubah jurnal ini.', values };
    }
    if (existing.status === 'disetujui') {
      return { message: 'Jurnal yang sudah disetujui tidak dapat diubah.', values };
    }

    const { error: updateError } = await supabase
      .from('jurnal')
      .update({ tanggal, kompetensi, kegiatan, durasi_jam: durasiJam, status: 'diajukan' })
      .eq('id', jurnalId)
      .eq('siswa_id', siswaId);

    if (updateError) {
      return { message: `Gagal menyimpan: ${updateError.message}`, values };
    }
  } catch (err) {
    return {
      message: err instanceof Error ? err.message : 'Terjadi gangguan saat menyimpan.',
      values,
    };
  }

  revalidatePath('/jurnal');
  revalidatePath('/admin');
  redirect('/jurnal');
}