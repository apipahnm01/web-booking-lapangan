import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dumbbell, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAIL = 'apipahnm01@gmail.com';

export default function GoogleLoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isAdminPath = location.pathname.startsWith('/admin');
  const requested = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
  const destination = requested && requested !== '/login' && requested !== '/admin/login'
    ? requested : (isAdminPath ? '/admin/dashboard' : '/');

  useEffect(() => {
    let active = true;
    async function finishLogin() {
      if (!supabase) { setError('Konfigurasi Supabase belum lengkap.'); return; }
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) { setError(sessionError.message); return; }
      const session = data.session;
      if (!session) return;
      const isAdmin = session.user.email?.toLowerCase() === ADMIN_EMAIL;
      if (isAdmin) {
        const response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { Authorization: `Bearer ${session.access_token}` },
          credentials: 'same-origin',
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          if (active) setError(result.error || 'Gagal memverifikasi akses admin.');
          return;
        }
      }
      if (active) navigate(isAdmin ? (destination.startsWith('/admin') ? destination : (isAdminPath ? '/admin/dashboard' : '/')) : (destination.startsWith('/admin') ? '/' : destination), { replace: true });
    }
    void finishLogin().catch(err => { if (active) setError(err instanceof Error ? err.message : 'Login gagal.'); });
    return () => { active = false; };
  }, [navigate, isAdminPath, destination]);

  async function signIn() {
    if (!supabase) { setError('Konfigurasi Supabase belum lengkap.'); return; }
    setLoading(true); setError('');
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}${isAdminPath ? '/admin/login' : '/login'}`, queryParams: { prompt: 'select_account' } },
    });
    if (authError) { setError(authError.message); setLoading(false); }
  }

  return <div className="min-h-screen flex items-center justify-center bg-navy-900 px-4">
    <div className="relative w-full max-w-md text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-500 flex items-center justify-center mx-auto mb-4">
        {isAdminPath ? <Shield className="w-8 h-8 text-white" /> : <Dumbbell className="w-8 h-8 text-white" />}
      </div>
      <h1 className="text-2xl font-display font-bold text-white">{isAdminPath ? 'Login Admin' : 'Masuk ke SportFutsal'}</h1>
      <p className="text-white/50 text-sm mt-2 mb-7">Gunakan akun Google untuk melanjutkan. Semua pengguna wajib login.</p>
      <div className="card">
        {error && <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-300 text-sm mb-4 text-left"><AlertCircle className="w-4 h-4 flex-shrink-0" />{error}</div>}
        <button onClick={() => void signIn()} disabled={loading} className="w-full rounded-xl bg-white text-slate-800 font-semibold px-4 py-3 flex items-center justify-center gap-3 hover:bg-slate-100 disabled:opacity-60">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <svg viewBox="0 0 48 48" className="w-5 h-5" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.2 1.4 8.1 3.2l6-6C34.5 3.1 29.8 1 24 1 15 1 7.3 6.2 3.5 13.8l7 5.4C12.2 13.4 17.6 9.5 24 9.5z"/><path fill="#4285F4" d="M46 24.5c0-1.6-.2-3.1-.5-4.5H24v9h12.4c-.6 3-2.3 5.5-4.8 7.2l7.4 5.7C43.4 37.8 46 31.8 46 24.5z"/><path fill="#FBBC05" d="M10.5 28.8a14.5 14.5 0 0 1 0-9.6l-7-5.4a23 23 0 0 0 0 20.4l7-5.4z"/><path fill="#34A853" d="M24 47c6.2 0 11.4-2 15.2-5.6l-7.4-5.7c-2 1.3-4.5 2.1-7.8 2.1-6.4 0-11.8-3.9-13.5-9.5l-7 5.4C7.3 41.8 15 47 24 47z"/></svg>}
          {loading ? 'Mengalihkan ke Google...' : 'Lanjutkan dengan Google'}
        </button>
        <p className="text-white/30 text-xs mt-4">Login hanya melalui Google. Username dan password admin tidak digunakan.</p>
      </div>
    </div>
  </div>;
}
