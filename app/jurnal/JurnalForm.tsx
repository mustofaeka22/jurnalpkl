'use client';

import { useActionState } from 'react';
import { ubahJurnalAction, type JurnalFormState } from '@/app/actions/murid';

interface JurnalFormProps {
  mode?: 'create' | 'edit';
  jurnalId?: number;
  action?: (prevState: JurnalFormState, formData: FormData) => Promise<JurnalFormState>;
  initialValues?: {
    tanggal?: string;
    kegiatan?: string;
    kompetensi?: string;
    durasi_jam?: string;
  };
  minDate?: string;
  maxDate?: string;
  submitLabel?: string;
  pendingLabel?: string;
}

const emptyState: JurnalFormState = {};

function getDefaultDateBounds(): { minDate: string; maxDate: string } {
  const now = new Date();
  const maxDate = now.toISOString().slice(0, 10);
  const min = new Date(now);
  min.setDate(min.getDate() - 30);
  const minDate = min.toISOString().slice(0, 10);
  return { minDate, maxDate };
}

export default function JurnalForm({
  mode = 'create',
  jurnalId,
  action,
  initialValues,
  minDate,
  maxDate,
  submitLabel,
  pendingLabel,
}: JurnalFormProps) {
  const bounds = getDefaultDateBounds();
  const resolvedMinDate = minDate ?? bounds.minDate;
  const resolvedMaxDate = maxDate ?? bounds.maxDate;

  const resolvedAction =
    action ??
    (mode === 'edit' && typeof jurnalId === 'number'
      ? ubahJurnalAction.bind(null, jurnalId)
      : async () => ({ message: 'Aksi form belum dikonfigurasi.' }));

  const resolvedSubmitLabel =
    submitLabel ?? (mode === 'edit' ? 'Simpan Perubahan' : 'Kirim Jurnal');
  const resolvedPendingLabel =
    pendingLabel ?? (mode === 'edit' ? 'Menyimpan perubahan...' : 'Mengirim jurnal...');

  const [state, formAction, isPending] = useActionState(resolvedAction, emptyState);

  const values = {
    tanggal: state.values?.tanggal ?? initialValues?.tanggal ?? resolvedMaxDate,
    kegiatan: state.values?.kegiatan ?? initialValues?.kegiatan ?? '',
    kompetensi: state.values?.kompetensi ?? initialValues?.kompetensi ?? '',
    durasi_jam: state.values?.durasi_jam ?? initialValues?.durasi_jam ?? '6',
  };

  return (
    <form action={formAction} className="space-y-5">
      {state.message && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="tanggal" className="block text-sm font-medium text-slate-700 mb-1.5">
            Tanggal Jurnal
          </label>
          <input
            id="tanggal"
            name="tanggal"
            type="date"
            required
            min={resolvedMinDate}
            max={resolvedMaxDate}
            defaultValue={values.tanggal}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
          />
          <p className="mt-1 text-xs text-slate-500">
            Rentang {resolvedMinDate} s.d. {resolvedMaxDate} (maksimal 1 jurnal per hari).
          </p>
          {state.errors?.tanggal && (
            <p className="mt-1 text-xs font-medium text-red-600">{state.errors.tanggal}</p>
          )}
        </div>

        <div>
          <label htmlFor="durasi_jam" className="block text-sm font-medium text-slate-700 mb-1.5">
            Durasi Jam (1–10)
          </label>
          <input
            id="durasi_jam"
            name="durasi_jam"
            type="number"
            min={1}
            max={10}
            step={1}
            required
            defaultValue={values.durasi_jam}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
          />
          <p className="mt-1 text-xs text-slate-500">Bilangan bulat antara 1 sampai 10 jam.</p>
          {state.errors?.durasi_jam && (
            <p className="mt-1 text-xs font-medium text-red-600">{state.errors.durasi_jam}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="kompetensi" className="block text-sm font-medium text-slate-700 mb-1.5">
          Kompetensi
        </label>
        <input
          id="kompetensi"
          name="kompetensi"
          type="text"
          required
          minLength={3}
          maxLength={60}
          defaultValue={values.kompetensi}
          placeholder="Contoh: Pengembangan Antarmuka"
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
        />
        <p className="mt-1 text-xs text-slate-500">3–60 huruf.</p>
        {state.errors?.kompetensi && (
          <p className="mt-1 text-xs font-medium text-red-600">{state.errors.kompetensi}</p>
        )}
      </div>

      <div>
        <label htmlFor="kegiatan" className="block text-sm font-medium text-slate-700 mb-1.5">
          Uraian Kegiatan
        </label>
        <textarea
          id="kegiatan"
          name="kegiatan"
          rows={5}
          required
          minLength={30}
          maxLength={500}
          defaultValue={values.kegiatan}
          placeholder="Tuliskan kegiatan PKL yang Anda kerjakan hari ini (30–500 huruf)..."
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
        />
        <p className="mt-1 text-xs text-slate-500">30–500 huruf.</p>
        {state.errors?.kegiatan && (
          <p className="mt-1 text-xs font-medium text-red-600">{state.errors.kegiatan}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition cursor-pointer"
      >
        {isPending ? resolvedPendingLabel : resolvedSubmitLabel}
      </button>
    </form>
  );
}