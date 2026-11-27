export interface JurnalFieldErrors {
  tanggal?: string;
  kegiatan?: string;
  kompetensi?: string;
  durasi_jam?: string;
}

export interface ValidJurnalInput {
  tanggal: string;
  kegiatan: string;
  kompetensi: string;
  durasi_jam: number;
}

export function getTodayJakartaDateString(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function parseIsoDateUtc(dateStr: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== m - 1 ||
    dt.getUTCDate() !== d
  ) {
    return null;
  }
  return dt;
}

export function validateJurnalInput(raw: {
  tanggal: string;
  kegiatan: string;
  kompetensi: string;
  durasi_jam: string;
}): { valid: true; data: ValidJurnalInput } | { valid: false; errors: JurnalFieldErrors } {
  const errors: JurnalFieldErrors = {};

  const tanggal = raw.tanggal.trim();
  const kegiatan = raw.kegiatan.trim();
  const kompetensi = raw.kompetensi.trim();
  const durasiRaw = raw.durasi_jam.trim();

  // Validasi tanggal: tidak boleh di masa depan & paling jauh 7 hari ke belakang
  const parsedDate = parseIsoDateUtc(tanggal);
  const todayStr = getTodayJakartaDateString();
  const todayDate = parseIsoDateUtc(todayStr)!;

  if (!parsedDate) {
    errors.tanggal = 'Tanggal wajib diisi dengan format yang valid.';
  } else {
    const diffMs = todayDate.getTime() - parsedDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      errors.tanggal = 'Tanggal jurnal tidak boleh di masa depan.';
    } else if (diffDays > 7) {
      errors.tanggal = 'Tanggal jurnal paling jauh 7 hari ke belakang dari hari ini.';
    }
  }

  // Validasi kegiatan: 30-500 huruf
  if (kegiatan.length < 30 || kegiatan.length > 500) {
    errors.kegiatan = `Deskripsi kegiatan harus 30–500 karakter (saat ini ${kegiatan.length} karakter).`;
  }

  // Validasi kompetensi: 3-60 huruf
  if (kompetensi.length < 3 || kompetensi.length > 60) {
    errors.kompetensi = `Kompetensi harus 3–60 karakter (saat ini ${kompetensi.length} karakter).`;
  }

  // Validasi durasi_jam: 1-10 bilangan bulat
  const durasiNum = Number(durasiRaw);
  if (!durasiRaw || !Number.isInteger(durasiNum) || durasiNum < 1 || durasiNum > 10) {
    errors.durasi_jam = 'Durasi jam harus bilangan bulat antara 1 sampai 10.';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      tanggal,
      kegiatan,
      kompetensi,
      durasi_jam: durasiNum,
    },
  };
}

export interface SiswaFieldErrors {
  nama?: string;
  kelas?: string;
  tempat_pkl?: string;
  pembimbing?: string;
}

export function validateSiswaInput(raw: {
  nama: string;
  kelas: string;
  tempat_pkl: string;
  pembimbing: string;
}):
  | { valid: true; data: { nama: string; kelas: string; tempat_pkl: string; pembimbing: string } }
  | { valid: false; errors: SiswaFieldErrors } {
  const errors: SiswaFieldErrors = {};
  const nama = raw.nama.trim();
  const kelas = raw.kelas.trim();
  const tempat_pkl = raw.tempat_pkl.trim();
  const pembimbing = raw.pembimbing.trim();

  if (nama.length < 3 || nama.length > 40) {
    errors.nama = 'Nama siswa harus 3–40 karakter.';
  }
  if (!kelas) {
    errors.kelas = 'Kelas wajib diisi.';
  }
  if (!tempat_pkl) {
    errors.tempat_pkl = 'Tempat PKL wajib diisi.';
  }
  if (!pembimbing) {
    errors.pembimbing = 'Nama pembimbing wajib diisi.';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: { nama, kelas, tempat_pkl, pembimbing },
  };
}