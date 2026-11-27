import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSiswaSessionId } from '@/lib/session';
import MasukForm from './MasukForm';

async function MasukContent() {
  const siswaId = await getSiswaSessionId();
  if (siswaId) {
    redirect('/jurnal');
  }

  return <MasukForm />;
}

export default function MasukPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
        <div className="mb-6">
          <Link href="/" className="text-xs font-medium text-blue-600 hover:underline">
            ← Kembali ke Beranda
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-slate-900">Masuk Murid PKL</h1>
          <p className="mt-1 text-sm text-slate-600">
            Masukkan kode unik siswa Anda untuk membuka jurnal harian PKL.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="py-4 text-sm text-slate-500">Memeriksa sesi...</div>
          }
        >
          <MasukContent />
        </Suspense>
      </div>
    </main>
  );
}