import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { isAdminAuthenticated } from '@/lib/session';
import { logoutAdminAction } from '@/app/actions/admin';
import ReviewJurnalCard from './ReviewJurnalCard';

interface SiswaItem {
  id: number;
  nama: string;
  kelas: string;
  tempat_pkl: string;
  pembimbing: string;
}

interface JurnalItem {
  id: number;
  siswa_id: number;
  tanggal: string;
  kegiatan: string;
  kompetensi: string;
  durasi_jam: number;
  status: 'diajukan' | 'disetujui' | 'revisi';
  catatan: string | null;
}

async function AdminDashboardContent({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; siswa?: string }>;
}) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    redirect('/login');
  }

  const sp = await searchParams;
  const statusFilter =
    sp.status === 'diajukan' || sp.status === 'disetujui' || sp.status === 'revisi'
      ? sp.status
      : 'semua';
  const siswaFilterId = sp.siswa && /^\d+$/.test(sp.siswa) ? Number(sp.siswa) : null;

  const supabase = getSupabaseAdmin();
  const [{ data: siswaRows }, { data: jurnalRows }] = await Promise.all([
    supabase
      .from('siswa')
      .select('id, nama, kelas, tempat_pkl, pembimbing')
      .order('nama', { ascending: true }),
    supabase
      .from('jurnal')
      .select('id, siswa_id, tanggal, kegiatan, kompetensi, durasi_jam, status, catatan')
      .order('tanggal', { ascending: false }),
  ]);

  const siswaList = (siswaRows ?? []) as SiswaItem[];
  const semuaJurnal = (jurnalRows ?? []) as JurnalItem[];

  const siswaMap = new Map<number, SiswaItem>();
  for (const s of siswaList) {
    siswaMap.set(s.id, s);
  }

  const rekapPerSiswa = siswaList.map((s) => {
    const milikSiswa = semuaJurnal.filter((j) => j.siswa_id === s.id);
    const totalJam = milikSiswa.reduce((sum, j) => sum + j.durasi_jam, 0);
    const jumlahJurnal = milikSiswa.length;
    const jumlahDisetujui = milikSiswa.filter((j) => j.status === 'disetujui').length;
    return {
      ...s,
      totalJam,
      jumlahJurnal,
      jumlahDisetujui,
    };
  });

  const jurnalTersaring = semuaJurnal
    .filter((j) => (statusFilter === 'semua' ? true : j.status === statusFilter))
    .filter((j) => (siswaFilterId ? j.siswa_id === siswaFilterId : true))
    .map((j) => {
      const infoSiswa = siswaMap.get(j.siswa_id);
      return {
        ...j,
        siswa_nama: infoSiswa?.nama ?? 'Siswa',
        siswa_kelas: infoSiswa?.kelas ?? '-',
        tempat_pkl: infoSiswa?.tempat_pkl ?? '-',
      };
    });

  return (
    <>
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500">Portal Admin / Pembimbing</p>
            <h1 className="text-xl font-bold text-slate-900">Rekap & Verifikasi Jurnal PKL</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/siswa"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition"
            >
              Kelola Siswa
            </Link>
            <form action={logoutAdminAction}>
              <button
                type="submit"
                className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-base font-semibold text-slate-900">Rekap Per Siswa</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-3 px-6">Nama Siswa</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4">Tempat PKL</th>
                  <th className="py-3 px-4 text-right">Jumlah Jurnal</th>
                  <th className="py-3 px-4 text-right">Disetujui</th>
                  <th className="py-3 px-6 text-right">Total Jam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rekapPerSiswa.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-6 font-medium text-slate-900">{row.nama}</td>
                    <td className="py-3 px-4 text-slate-600">{row.kelas}</td>
                    <td className="py-3 px-4 text-slate-600">{row.tempat_pkl}</td>
                    <td className="py-3 px-4 text-right text-slate-900">{row.jumlahJurnal}</td>
                    <td className="py-3 px-4 text-right text-emerald-700 font-medium">
                      {row.jumlahDisetujui}
                    </td>
                    <td className="py-3 px-6 text-right font-semibold text-slate-900">
                      {row.totalJam} jam
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-wrap items-end justify-between gap-4">
            <form method="GET" className="flex flex-wrap items-end gap-4">
              <div>
                <label htmlFor="status" className="block text-xs font-medium text-slate-700 mb-1">
                  Filter Status
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={statusFilter}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                >
                  <option value="semua">Semua Status</option>
                  <option value="diajukan">Diajukan</option>
                  <option value="disetujui">Disetujui</option>
                  <option value="revisi">Revisi</option>
                </select>
              </div>

              <div>
                <label htmlFor="siswa" className="block text-xs font-medium text-slate-700 mb-1">
                  Filter Siswa
                </label>
                <select
                  id="siswa"
                  name="siswa"
                  defaultValue={siswaFilterId ? String(siswaFilterId) : ''}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                >
                  <option value="">Semua Siswa</option>
                  {siswaList.map((s) => (
                    <option key={s.id} value={String(s.id)}>
                      {s.nama} ({s.kelas})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition cursor-pointer"
              >
                Terapkan Filter
              </button>

              {(statusFilter !== 'semua' || siswaFilterId) && (
                <Link
                  href="/admin"
                  className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Reset
                </Link>
              )}
            </form>

            <p className="text-xs text-slate-500">
              Menampilkan <strong>{jurnalTersaring.length}</strong> jurnal
            </p>
          </div>

          {jurnalTersaring.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-500">
              Tidak ada jurnal yang cocok dengan filter yang dipilih.
            </div>
          ) : (
            <div className="space-y-4">
              {jurnalTersaring.map((item) => (
                <ReviewJurnalCard key={item.id} jurnal={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; siswa?: string }>;
}) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Suspense
        fallback={
          <div className="max-w-6xl mx-auto px-6 py-12 text-sm text-slate-500">
            Memuat dasbor admin...
          </div>
        }
      >
        <AdminDashboardContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}