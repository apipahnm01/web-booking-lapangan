import { createClient } from '@supabase/supabase-js';
import { issueSession, setSessionCookie, clearSessionCookie, hasAdminSession } from './_auth.js';

function getAdminEmails() {
  const configured = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '';
  return [...new Set(configured.split(',').map(email => email.trim().toLowerCase()).filter(Boolean))];
}

export default async function handler(req, res) {
  const match = (req.headers.authorization || '').match(/^Bearer\s+(.+)$/i);

  if (req.method === 'GET') {
    if (!match) return res.status(200).json({ authenticated: hasAdminSession(req) });
    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return res.status(500).json({ error: 'Konfigurasi Supabase belum lengkap.' });
    try {
      const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
      const { data, error } = await client.auth.getUser(match[1]);
      if (error || !data.user) return res.status(401).json({ error: 'Sesi Google tidak valid.' });
      const email = data.user.email?.trim().toLowerCase() || '';
      return res.status(200).json({ isAdmin: getAdminEmails().includes(email) });
    } catch {
      return res.status(401).json({ error: 'Gagal memverifikasi akun Google.' });
    }
  }

  if (req.method === 'DELETE') {
    clearSessionCookie(res);
    return res.status(200).json({ ok: true });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Login admin hanya melalui Google.' });

  if (!match) return res.status(401).json({ error: 'Token Google tidak ditemukan. Silakan login ulang.' });
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || getAdminEmails().length === 0 || !process.env.ADMIN_SESSION_SECRET) {
    return res.status(500).json({ error: 'Konfigurasi autentikasi admin di server belum lengkap.' });
  }
  try {
    const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await client.auth.getUser(match[1]);
    if (error || !data.user) return res.status(401).json({ error: 'Sesi Google tidak valid.' });
    const email = data.user.email?.trim().toLowerCase() || '';
    if (!getAdminEmails().includes(email)) {
      clearSessionCookie(res);
      return res.status(403).json({ error: 'Akun Google ini tidak memiliki akses admin.' });
    }
    setSessionCookie(res, issueSession());
    return res.status(200).json({ ok: true, authenticated: true });
  } catch {
    return res.status(401).json({ error: 'Gagal memverifikasi akun Google.' });
  }
}
