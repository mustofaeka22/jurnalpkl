'use client';

import { useActionState, useState } from 'react';
import { reviewJurnalAction, type ReviewJurnalState } from '@/app/actions/admin';

interface ReviewJurnalCardProps {
  jurnal: {
    id: number;
    tanggal: string;
    kegiatan: string;
    kompetensi: string;
    durasi_jam: number;
    status: 'diajukan' | 'disetujui' | 'revisi';
    catatan: string | null;
    siswa_nama: string;
    siswa_kelas: string;
    tempat_pkl: string;
  };
}

const initialState: ReviewJurnalState = {};

export default function ReviewJurnalCard({ jurnal }: ReviewJurnalCardProps) {
  const boundAction = reviewJurnalAction.bind(null, jurnal.id);
  const [state, formAction, isPending] = useActionState(boundAction, initialState);
  const [keputusan, setKeputusan] = useState<'disetujui' | 'revisi'>(
    jurnal.status === 'revisi' ? 'revisi' : 'disetujui'
  );

  const badgeClass =
    jurnal.status === 'disetujui'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
      : jurnal.status === 'revisi'
        ? 'bg-amber-50 border-amber-200 text-amber-800'
        : 'bg-blue-50 border-blue-200 text-blue-700';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900">{jurnal.siswa_nama}</h3>
            <span className="text-xs text-slate-500">
              ({jurnal.siswa_kelas} • {jurnal.tempat_pkl})
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tanggal: <strong>{jurnal.tanggal}</strong> • Durasi:{' '}
            <strong>{jurnal.durasi_jam} jam</strong> • Kompetensi:{' '}
            <strong>{jurnal.kompetensi}</strong>
          </p>
        </div>

        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${badgeClass}`}
        >
          {jurnal.status}
        </span>
      </div>

      <p className="text-sm text-slate-800 whitespace-pre-line bg-slate-50 rounded-lg p-3.5 border border-slate-100">
        {jurnal.kegiatan}
      </p>

      {jurnal.catatan && (
        <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-2">
          <strong>Catatan saat ini:</strong> {jurnal.catatan}
        </p>
      )}

      {state.error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-xs text-red-700"
        >
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs text-emerald-800">
          {state.success}
        </div>
      )}

      <form action={formAction} className="pt-2 border-t border-slate-100 space-y-3">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="keputusan"
              value="disetujui"
              checked={keputusan === 'disetujui'}
              onChange={() => setKeputusan('disetujui')}
            />
            <span>Setujui</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="keputusan"
              value="revisi"
              checked={keputusan === 'revisi'}
              onChange={() => setKeputusan('revisi')}
            />
            <span>Revisi</span>
          </label>
        </div>

        {keputusan === 'revisi' && (
          <div>
            <label
              htmlFor={`catatan-${jurnal.id}`}
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Catatan Revisi (wajib minimal 5 huruf)
            </label>
            <input
              id={`catatan-${jurnal.id}`}
              name="catatan"
              type="text"
              minLength={5}
              defaultValue={jurnal.catatan ?? ''}
              placeholder="Tuliskan alasan revisi atau perbaikan yang diperlukan..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-60 transition cursor-pointer"
        >
          {isPending ? 'Menyimpan...' : 'Simpan Keputusan'}
        </button>
      </form>
    </div>
  );
}