import { createClient } from '@supabase/supabase-js';
import { issueSession, setSessionCookie, clearSessionCookie, hasAdminSession } from './_auth.js';

export default async function handler(req, res) {
  if (req.method === 'GET') return res.status(200).json({ authenticated: hasAdminSession(req) });
  if (req.method === 'DELETE') {
    clearSessionCookie(res);
    return res.status(200).json({ ok: true });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Login admin hanya melalui Google.' });

  const match = (req.headers.authorization || '').match(/^Bearer\s+(.+)$/i);
  if (!match) return res.status(401).json({ error: 'Token Google tidak ditemukan. Silakan login ulang.' });
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  if (!url || !key || !adminEmail || !process.env.ADMIN_SESSION_SECRET) {
    return res.status(500).json({ error: 'Konfigurasi autentikasi admin di server belum lengkap.' });
  }
  try {
    const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await client.auth.getUser(match[1]);
    if (error || !data.user) return res.status(401).json({ error: 'Sesi Google tidak valid.' });
    if (data.user.email?.toLowerCase() !== adminEmail) {
      clearSessionCookie(res);
      return res.status(403).json({ error: 'Akun Google ini tidak memiliki akses admin.' });
    }
    setSessionCookie(res, issueSession());
    return res.status(200).json({ ok: true, authenticated: true });
  } catch {
    return res.status(401).json({ error: 'Gagal memverifikasi akun Google.' });
  }
}
