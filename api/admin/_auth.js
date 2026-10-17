import { createClient } from '@supabase/supabase-js';

export function adminDb() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Konfigurasi database server belum lengkap.');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function requireAdmin(req, res) {
  const match = (req.headers.authorization || '').match(/^Bearer\s+(.+)$/i);
  if (!match) {
    res.status(401).json({ error: 'Silakan login dengan Google.' });
    return false;
  }
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  if (!url || !key || !adminEmail) {
    res.status(500).json({ error: 'Konfigurasi autentikasi admin belum lengkap.' });
    return false;
  }
  try {
    const authClient = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await authClient.auth.getUser(match[1]);
    if (error || !data.user || data.user.email?.toLowerCase() !== adminEmail) {
      res.status(403).json({ error: 'Akun Google ini tidak memiliki akses admin.' });
      return false;
    }
    return true;
  } catch {
    res.status(401).json({ error: 'Sesi Google tidak valid. Silakan login kembali.' });
    return false;
  }
}
