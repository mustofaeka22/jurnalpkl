'use client';

import { useActionState } from 'react';
import { loginMuridAction, type MasukMuridState } from '@/app/actions/murid';

const initialState: MasukMuridState = {};

export default function MasukForm() {
  const [state, formAction, isPending] = useActionState(loginMuridAction, initialState);

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
        <label htmlFor="kode" className="block text-sm font-medium text-slate-700 mb-1.5">
          Kode Siswa
        </label>
        <input
          id="kode"
          name="kode"
          type="text"
          required
          autoComplete="off"
          defaultValue={state.kode ?? ''}
          placeholder="CONTOH: PKLS-A1N1"
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 uppercase focus:border-blue-600 focus:outline-none"
        />
        <p className="mt-1.5 text-xs text-slate-500">
          Masukkan kode pribadi siswa (6–12 karakter) yang diberikan pembimbing.
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition cursor-pointer"
      >
        {isPending ? 'Memeriksa kode...' : 'Masuk'}
      </button>
    </form>
  );
}