import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSiswaSessionId } from '@/lib/session';
import JurnalForm from '@/app/jurnal/JurnalForm';

function getDateBounds(): { minDate: string; maxDate: string } {
  const now = new Date();
  const maxDate = now.toISOString().slice(0, 10);
  const min = new Date(now);
  min.setDate(min.getDate() - 30);
  const minDate = min.toISOString().slice(0, 10);
  return { minDate, maxDate };
}

async function TambahJurnalContent() {
  const siswaId = await getSiswaSessionId();
  if (!siswaId) {
    redirect('/masuk');
  }

  const { minDate, maxDate } = getDateBounds();

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <Link href="/jurnal" className="text-xs font-medium text-blue-600 hover:underline">
          ← Kembali ke Daftar Jurnal
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Tambah Jurnal Harian PKL</h1>
        <p className="mt-1 text-sm text-slate-600">
          Isi aktivitas harian PKL dengan lengkap dan jujur. Setiap hari maksimal satu entri jurnal.
        </p>
      </div>

      <JurnalForm
        mode="create"
        minDate={minDate}
        maxDate={maxDate}
        submitLabel="Kirim Jurnal"
        pendingLabel="Mengirim jurnal..."
      />
    </div>
  );
}

export default function TambahJurnalPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Suspense
          fallback={
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-sm text-slate-500">
              Memuat form jurnal...
            </div>
          }
        >
          <TambahJurnalContent />
        </Suspense>
      </div>
    </main>
  );
}