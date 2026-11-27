import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { getSiswaSessionId } from '@/lib/session';
import { logoutMuridAction } from '@/app/actions/murid';

interface JurnalRow {
  id: number;
  tanggal: string;
  kegiatan: string;
  kompetensi: string;
  durasi_jam: number;
  status: 'diajukan' | 'disetujui' | 'revisi';
  catatan: string | null;
  dibuat: string;
}

function StatusBadge({ status }: { status: JurnalRow['status'] }) {
  if (status === 'disetujui') {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
        Disetujui
      </span>
    );
  }
  if (status === 'revisi') {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-medium text-amber-800">
        Revisi
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-medium text-blue-700">
      Diajukan
    </span>
  );
}

async function JurnalContent() {
  const siswaId = await getSiswaSessionId();
  if (!siswaId) {
    redirect('/masuk');
  }

  const supabase = getSupabaseAdmin();
  const [{ data: siswa }, { data: jurnalList }] = await Promise.all([
    supabase
      .from('siswa')
      .select('id, nama, kelas, tempat_pkl, pembimbing')
      .eq('id', siswaId)
      .single(),
    supabase
      .from('jurnal')
      .select('id, tanggal, kegiatan, kompetensi, durasi_jam, status, catatan, dibuat')
      .eq('siswa_id', siswaId)
      .order('tanggal', { ascending: false }),
  ]);

  if (!siswa) {
    redirect('/masuk');
  }

  const rows = (jurnalList ?? []) as JurnalRow[];
  const totalJam = rows.reduce((sum, item) => sum + item.durasi_jam, 0);
  const jumlahDisetujui = rows.filter((item) => item.status === 'disetujui').length;
  const jumlahRevisi = rows.filter((item) => item.status === 'revisi').length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-blue-600">Profil Peserta PKL</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">{siswa.nama}</h1>
            <p className="mt-1 text-sm text-slate-600">
              {siswa.kelas} • Tempat PKL: <strong>{siswa.tempat_pkl}</strong> • Pembimbing:{' '}
              <strong>{siswa.pembimbing}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/jurnal/baru"
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              + Tambah Jurnal
            </Link>
            <form action={logoutMuridAction}>
              <button
                type="submit"
                className="rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
            <p className="text-xs text-slate-500">Total Jam PKL</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{totalJam} jam</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
            <p className="text-xs text-slate-500">Total Jurnal</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{rows.length}</p>
          </div>
          <div className="rounded-lg bg-emerald-50/70 p-4 border border-emerald-100">
            <p className="text-xs text-emerald-700">Disetujui</p>
            <p className="mt-1 text-2xl font-bold text-emerald-800">{jumlahDisetujui}</p>
          </div>
          <div className="rounded-lg bg-amber-50/70 p-4 border border-amber-100">
            <p className="text-xs text-amber-800">Perlu Revisi</p>
            <p className="mt-1 text-2xl font-bold text-amber-900">{jumlahRevisi}</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Riwayat Jurnal Harian</h2>
          <Link href="/" className="text-xs font-medium text-slate-600 hover:underline">
            ← Beranda
          </Link>
        </div>

        {rows.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
            <p className="text-sm text-slate-600">Anda belum mengisi jurnal harian PKL.</p>
            <Link
              href="/jurnal/baru"
              className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Tulis Jurnal Pertama
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {rows.map((item) => {
              const bisaDiubah = item.status !== 'disetujui';
              return (
                <article
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-semibold text-slate-900">{item.tanggal}</span>
                      <span className="text-xs rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                        {item.kompetensi}
                      </span>
                      <span className="text-xs font-medium text-slate-600">
                        {item.durasi_jam} jam
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge status={item.status} />
                      {bisaDiubah ? (
                        <Link
                          href={`/jurnal/${item.id}/ubah`}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                        >
                          Ubah Jurnal
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-400">Terkunci (disetujui)</span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {item.kegiatan}
                  </p>

                  {item.catatan && (
                    <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-900">
                      <span className="font-semibold">Catatan Pembimbing:</span> {item.catatan}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default function JurnalPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Suspense
        fallback={
          <div className="max-w-5xl mx-auto px-6 py-12 text-sm text-slate-500">
            Memuat jurnal harian...
          </div>
        }
      >
        <JurnalContent />
      </Suspense>
    </main>
  );
}