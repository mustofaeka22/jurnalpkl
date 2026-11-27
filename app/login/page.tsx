import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/session';
import LoginForm from './LoginForm';

async function LoginContent() {
  const authed = await isAdminAuthenticated();
  if (authed) {
    redirect('/admin');
  }

  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
        <div className="mb-6">
          <Link href="/" className="text-xs font-medium text-slate-600 hover:underline">
            ← Kembali ke Beranda
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-slate-900">Login Admin / Pembimbing</h1>
          <p className="mt-1 text-sm text-slate-600">
            Masuk untuk memeriksa jurnal harian PKL dan mengelola data siswa.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="py-4 text-sm text-slate-500">Memeriksa sesi admin...</div>
          }
        >
          <LoginContent />
        </Suspense>
      </div>
    </main>
  );
}