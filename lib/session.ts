import 'server-only';
import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { connection } from 'next/server';

const SISWA_COOKIE = 'pkl_siswa_session';
const ADMIN_COOKIE = 'pkl_admin_session';

interface SiswaSessionPayload {
  role: 'siswa';
  siswaId: number;
  exp: number;
}

interface AdminSessionPayload {
  role: 'admin';
  exp: number;
}

type SessionPayload = SiswaSessionPayload | AdminSessionPayload;

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET?.trim();
  if (!secret || secret.length < 16) {
    throw new Error('SESSION_SECRET belum diatur atau terlalu pendek.');
  }
  return secret;
}

function signValue(encodedPayload: string): string {
  return crypto
    .createHmac('sha256', getSessionSecret())
    .update(encodedPayload)
    .digest('base64url');
}

function encodeToken(payload: SessionPayload): string {
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = signValue(encoded);
  return `${encoded}.${signature}`;
}

function decodeToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encoded, signature] = parts;
  if (!encoded || !signature) return null;

  const expectedSignature = signValue(encoded);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);

  if (sigBuf.length !== expBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (!parsed || typeof parsed.exp !== 'number') return null;
    if (Date.now() > parsed.exp) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function setSiswaSession(siswaId: number): Promise<void> {
  await connection();
  const cookieStore = await cookies();
  const payload: SiswaSessionPayload = {
    role: 'siswa',
    siswaId,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
  };

  cookieStore.set(SISWA_COOKIE, encodeToken(payload), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSiswaSession(): Promise<void> {
  await connection();
  const cookieStore = await cookies();
  cookieStore.delete(SISWA_COOKIE);
}

export async function getSiswaSessionId(): Promise<number | null> {
  await connection();
  const cookieStore = await cookies();
  const raw = cookieStore.get(SISWA_COOKIE)?.value;
  const decoded = decodeToken(raw);
  if (!decoded || decoded.role !== 'siswa') return null;
  return decoded.siswaId;
}

export async function setAdminSession(): Promise<void> {
  await connection();
  const cookieStore = await cookies();
  const payload: AdminSessionPayload = {
    role: 'admin',
    exp: Date.now() + 1000 * 60 * 60 * 24,
  };

  cookieStore.set(ADMIN_COOKIE, encodeToken(payload), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24,
  });
}

export async function clearAdminSession(): Promise<void> {
  await connection();
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  await connection();
  const cookieStore = await cookies();
  const raw = cookieStore.get(ADMIN_COOKIE)?.value;
  const decoded = decodeToken(raw);
  return Boolean(decoded && decoded.role === 'admin');
}

export function verifyAdminPassword(inputPassword: string): boolean {
  const expected = process.env.ADMIN_PASSWORD?.trim();
  if (!expected) {
    throw new Error('ADMIN_PASSWORD belum diatur.');
  }

  const inputBuf = Buffer.from(inputPassword.trim(), 'utf8');
  const expectedBuf = Buffer.from(expected, 'utf8');

  if (inputBuf.length !== expectedBuf.length) return false;
  return crypto.timingSafeEqual(inputBuf, expectedBuf);
}