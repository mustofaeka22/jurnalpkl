'use client';

import { useActionState } from 'react';
import { loginAdminAction, type AdminLoginState } from '@/app/actions/admin';

const initialState: AdminLoginState = {};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdminAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
          Kata Sandi Admin
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Masukkan kata sandi admin"
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60 transition cursor-pointer"
      >
        {isPending ? 'Memverifikasi...' : 'Masuk Admin'}
      </button>
    </form>
  );
}