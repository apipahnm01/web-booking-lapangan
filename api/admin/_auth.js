import { createHmac, timingSafeEqual } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const COOKIE = 'admin_session';
const MAX_AGE = 60 * 60 * 8;

function signature(value) {
  return createHmac('sha256', process.env.ADMIN_SESSION_SECRET || '')
    .update(value).digest('base64url');
}

export function issueSession() {
  const payload = Buffer.from(JSON.stringify({ role: 'admin', exp: Math.floor(Date.now() / 1000) + MAX_AGE })).toString('base64url');
  return payload + '.' + signature(payload);
}

export function hasAdminSession(req) {
  const cookie = req.headers.cookie || '';
  const match = cookie.split(';').map(v => v.trim()).find(v => v.startsWith(COOKIE + '='));
  if (!match) return false;
  const token = decodeURIComponent(match.slice(COOKIE.length + 1));
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = signature(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.role === 'admin' && data.exp > Math.floor(Date.now() / 1000);
  } catch { return false; }
}

export function setSessionCookie(res, token) {
  res.setHeader('Set-Cookie', `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}`);
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
}

export function adminDb() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Konfigurasi database server belum lengkap.');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function requireAdmin(req, res) {
  if (!hasAdminSession(req)) {
    res.status(401).json({ error: 'Sesi admin tidak valid. Silakan masuk kembali.' });
    return false;
  }
  return true;
}
