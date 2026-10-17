import { issueSession, setSessionCookie, clearSessionCookie } from './_auth.js';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { hasAdminSession } = require('./_auth.js');
    return res.status(200).json({ authenticated: hasAdminSession(req) });
  }
  if (req.method === 'DELETE') {
    clearSessionCookie(res);
    return res.status(200).json({ ok: true });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method tidak diizinkan.' });

  const { username, password } = req.body || {};
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPassword || !process.env.ADMIN_SESSION_SECRET) {
    return res.status(500).json({ error: 'Konfigurasi login admin di server belum lengkap.' });
  }
  if (typeof username !== 'string' || typeof password !== 'string' ||
      username !== expectedUser || password !== expectedPassword) {
    return res.status(401).json({ error: 'Username atau password salah.' });
  }
  setSessionCookie(res, issueSession());
  return res.status(200).json({ ok: true });
}
