import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Navbar Atas */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <span className="block text-sm font-semibold tracking-tight text-slate-900">
                Jurnal Harian PKL
              </span>
              <span className="block text-xs text-slate-500">
                Sistem Pencatatan &amp; Monitoring Praktik Kerja Lapangan
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/masuk"
              className="rounded-lg px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
            >
              Masuk Murid
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50 transition"
            >
              Portal Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-6 pt-12 pb-16 sm:pt-16">
          {/* Hero */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50 px-3.5 py-1 text-xs font-medium text-blue-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              Praktik Kerja Lapangan (PKL)
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Catat progres PKL lebih tertib dan terpantau pembimbing.
            </h1>

            <p className="mt-3.5 text-base leading-relaxed text-slate-600">
              Catat aktivitas harian Praktik Kerja Lapangan secara daring, pantau akumulasi jam,
              serta cek status persetujuan dan catatan revisi dari guru pembimbing dalam satu tempat.
            </p>
          </div>

          {/* Alur Singkat 3 Langkah */}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200/90 bg-white px-4 py-3.5">
              <span className="text-xs font-semibold text-blue-600">01 · MASUK</span>
              <p className="mt-1 text-sm font-medium text-slate-800">Gunakan kode pribadi siswa</p>
              <p className="mt-0.5 text-xs text-slate-500">
                Akses halaman jurnal tanpa ribet pendaftaran.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white px-4 py-3.5">
              <span className="text-xs font-semibold text-blue-600">02 · CATAT JURNAL</span>
              <p className="mt-1 text-sm font-medium text-slate-800">Isi kegiatan &amp; durasi jam</p>
              <p className="mt-0.5 text-xs text-slate-500">
                Lengkapi kompetensi harian dan perbarui jika ada revisi.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white px-4 py-3.5">
              <span className="text-xs font-semibold text-blue-600">03 · VERIFIKASI</span>
              <p className="mt-1 text-sm font-medium text-slate-800">Pantau status dari pembimbing</p>
              <p className="mt-0.5 text-xs text-slate-500">
                Pembimbing memeriksa, menyetujui, atau memberi catatan.
              </p>
            </div>
          </div>

          {/* Kartu Portal Peran */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Portal Murid */}
            <div className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs hover:border-blue-300 hover:shadow-sm transition">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    Siswa
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-semibold text-slate-900">Portal Murid PKL</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Masuk menggunakan kode pribadi siswa untuk menulis jurnal harian, melihat total
                  jam, dan memperbarui jurnal yang perlu revisi.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/masuk"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
                >
                  Masuk dengan Kode Siswa
                </Link>
                <Link
                  href="/jurnal"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Buka Jurnal Saya
                </Link>
              </div>
            </div>

            {/* Portal Pembimbing / Admin */}
            <div className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs hover:border-slate-300 hover:shadow-sm transition">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    Pembimbing
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-semibold text-slate-900">
                  Portal Guru Pembimbing / Admin
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Pantau rekap jurnal per siswa, saring status atau siswa, beri persetujuan atau
                  catatan revisi, serta kelola data siswa.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition"
                >
                  Login Admin
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-5">
        <div className="mx-auto max-w-5xl px-6 text-center text-xs text-slate-500">
          Aplikasi Jurnal Harian PKL
        </div>
      </footer>
    </div>
  );
}