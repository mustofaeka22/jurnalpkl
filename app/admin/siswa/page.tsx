import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { isAdminAuthenticated } from '@/lib/session';
import SiswaManager from './SiswaManager';

async function AdminSiswaContent() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    redirect('/login');
  }

  const supabase = getSupabaseAdmin();
  const [{ data: siswaRows }, { data: jurnalRows }] = await Promise.all([
    supabase
      .from('siswa')
      .select('id, nama, kelas, tempat_pkl, pembimbing, kode')
      .order('id', { ascending: true }),
    supabase.from('jurnal').select('siswa_id'),
  ]);

  const countMap = new Map<number, number>();
  for (const j of jurnalRows ?? []) {
    countMap.set(j.siswa_id, (countMap.get(j.siswa_id) ?? 0) + 1);
  }

  const listSiswa = (siswaRows ?? []).map((s) => ({
    ...s,
    jumlah_jurnal: countMap.get(s.id) ?? 0,
  }));

  return <SiswaManager initialSiswa={listSiswa} />;
}

export default function AdminSiswaPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/admin" className="text-xs font-medium text-slate-600 hover:underline">
              ← Kembali ke Dasbor Admin
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">Kelola Data Siswa PKL</h1>
            <p className="mt-1 text-sm text-slate-600">
              Tambah peserta PKL dengan kode akses otomatis atau hapus siswa yang belum memiliki
              jurnal.
            </p>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-sm text-slate-500">
              Memuat data siswa...
            </div>
          }
        >
          <AdminSiswaContent />
        </Suspense>
      </div>
    </main>
  );
}