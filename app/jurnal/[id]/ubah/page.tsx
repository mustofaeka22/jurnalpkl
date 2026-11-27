import { Suspense } from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { getSiswaSessionId } from '@/lib/session';
import JurnalForm from '@/app/jurnal/JurnalForm';

async function UbahJurnalContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const siswaId = await getSiswaSessionId();
  if (!siswaId) {
    redirect('/masuk');
  }

  const { id } = await params;
  const jurnalId = Number(id);
  if (!Number.isInteger(jurnalId) || jurnalId <= 0) {
    notFound();
  }

  const supabase = getSupabaseAdmin();
  const { data: jurnal, error } = await supabase
    .from('jurnal')
    .select('id, siswa_id, tanggal, kegiatan, kompetensi, durasi_jam, status, catatan')
    .eq('id', jurnalId)
    .single();

  if (error || !jurnal) {
    notFound();
  }

  if (jurnal.siswa_id !== siswaId) {
    redirect('/jurnal');
  }

  if (jurnal.status === 'disetujui') {
    redirect('/jurnal');
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <Link href="/jurnal" className="text-xs font-medium text-blue-600 hover:underline">
          ← Kembali ke Daftar Jurnal
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Ubah Jurnal Harian PKL</h1>
        <p className="mt-1 text-sm text-slate-600">
          Perbarui isi jurnal sesuai kebutuhan atau catatan revisi dari pembimbing.
        </p>
      </div>

      {jurnal.catatan && (
        <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-900">
          <span className="font-semibold">Catatan Revisi Pembimbing:</span> {jurnal.catatan}
        </div>
      )}

      <JurnalForm
        mode="edit"
        jurnalId={jurnal.id}
        initialValues={{
          tanggal: jurnal.tanggal,
          kegiatan: jurnal.kegiatan,
          kompetensi: jurnal.kompetensi,
          durasi_jam: String(jurnal.durasi_jam),
        }}
      />
    </div>
  );
}

export default function UbahJurnalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Suspense
          fallback={
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-sm text-slate-500">
              Memuat data jurnal...
            </div>
          }
        >
          <UbahJurnalContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}