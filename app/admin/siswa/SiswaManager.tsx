'use client';

import { useActionState, useState, useTransition } from 'react';
import {
  hapusSiswaAction,
  tambahSiswaAction,
  type SiswaActionState,
} from '@/app/actions/admin';

interface SiswaRow {
  id: number;
  nama: string;
  kelas: string;
  tempat_pkl: string;
  pembimbing: string;
  kode: string;
  jumlah_jurnal: number;
}

const initialState: SiswaActionState = {};

export default function SiswaManager({ initialSiswa }: { initialSiswa: SiswaRow[] }) {
  const [state, formAction, isPending] = useActionState(tambahSiswaAction, initialState);
  const [deleteMessage, setDeleteMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(
    null
  );
  const [isDeleting, startTransition] = useTransition();

  function handleHapus(siswaId: number, nama: string) {
    setDeleteMessage(null);
    startTransition(async () => {
      const res = await hapusSiswaAction(siswaId);
      if (res.error) {
        setDeleteMessage({ type: 'error', text: res.error });
      } else if (res.success) {
        setDeleteMessage({ type: 'success', text: `${nama}: ${res.success}` });
      }
    });
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Tambah Siswa Baru</h2>

        {state.error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {state.error}
          </div>
        )}

        {state.success && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <p>{state.success}</p>
            {state.generatedCode && (
              <p className="mt-1 font-mono text-xs">
                Kode siswa otomatis: <strong>{state.generatedCode}</strong> (salin untuk diberikan ke siswa)
              </p>
            )}
          </div>
        )}

        <form action={formAction} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-slate-700 mb-1">
              Nama Lengkap (3–40 huruf)
            </label>
            <input
              id="nama"
              name="nama"
              type="text"
              required
              minLength={3}
              maxLength={40}
              defaultValue={state.values?.nama ?? ''}
              placeholder="Contoh: Bima Saputra"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900"
            />
            {state.errors?.nama && (
              <p className="mt-1 text-xs text-red-600">{state.errors.nama}</p>
            )}
          </div>

          <div>
            <label htmlFor="kelas" className="block text-sm font-medium text-slate-700 mb-1">
              Kelas
            </label>
            <input
              id="kelas"
              name="kelas"
              type="text"
              required
              defaultValue={state.values?.kelas ?? ''}
              placeholder="Contoh: XII RPL 1"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900"
            />
            {state.errors?.kelas && (
              <p className="mt-1 text-xs text-red-600">{state.errors.kelas}</p>
            )}
          </div>

          <div>
            <label htmlFor="tempat_pkl" className="block text-sm font-medium text-slate-700 mb-1">
              Tempat PKL
            </label>
            <input
              id="tempat_pkl"
              name="tempat_pkl"
              type="text"
              required
              defaultValue={state.values?.tempat_pkl ?? ''}
              placeholder="Contoh: CV Nusantara Digital"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900"
            />
            {state.errors?.tempat_pkl && (
              <p className="mt-1 text-xs text-red-600">{state.errors.tempat_pkl}</p>
            )}
          </div>

          <div>
            <label htmlFor="pembimbing" className="block text-sm font-medium text-slate-700 mb-1">
              Pembimbing
            </label>
            <input
              id="pembimbing"
              name="pembimbing"
              type="text"
              required
              defaultValue={state.values?.pembimbing ?? ''}
              placeholder="Contoh: Bu Ratna Sari"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900"
            />
            {state.errors?.pembimbing && (
              <p className="mt-1 text-xs text-red-600">{state.errors.pembimbing}</p>
            )}
          </div>

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60 transition cursor-pointer"
            >
              {isPending ? 'Menyimpan...' : 'Tambah Siswa & Buat Kode'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Daftar Siswa Terdaftar</h2>
        </div>

        {deleteMessage && (
          <div
            role="alert"
            className={`mx-6 mt-4 rounded-lg border px-4 py-3 text-sm ${
              deleteMessage.type === 'error'
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-emerald-200 bg-emerald-50 text-emerald-800'
            }`}
          >
            {deleteMessage.text}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
              <tr>
                <th className="py-3 px-6">Nama</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Tempat PKL</th>
                <th className="py-3 px-4">Pembimbing</th>
                <th className="py-3 px-4">Kode Siswa</th>
                <th className="py-3 px-4 text-center">Jurnal</th>
                <th className="py-3 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {initialSiswa.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-6 font-medium text-slate-900">{s.nama}</td>
                  <td className="py-3 px-4 text-slate-600">{s.kelas}</td>
                  <td className="py-3 px-4 text-slate-600">{s.tempat_pkl}</td>
                  <td className="py-3 px-4 text-slate-600">{s.pembimbing}</td>
                  <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-800">
                    {s.kode}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-700">{s.jumlah_jurnal}</td>
                  <td className="py-3 px-6 text-right">
                    <button
                      type="button"
                      disabled={isDeleting || s.jumlah_jurnal > 0}
                      onClick={() => handleHapus(s.id, s.nama)}
                      title={
                        s.jumlah_jurnal > 0
                          ? 'Siswa sudah memiliki jurnal sehingga tidak bisa dihapus'
                          : 'Hapus siswa'
                      }
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}