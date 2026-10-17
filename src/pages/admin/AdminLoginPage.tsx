import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowRight, AlertCircle, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setError('Konfigurasi Supabase belum tersedia.');
      return;
    }
    setLoading(true);
    setError('');
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (authError || !data.user) {
      setError('Email atau password salah, atau akun belum terdaftar.');
      setLoading(false);
      return;
    }
    if (data.user.app_metadata?.role !== 'admin') {
      await supabase.auth.signOut();
      setError('Akun ini belum diberi akses admin. Minta pemilik proyek mengatur role admin di Supabase.');
      setLoading(false);
      return;
    }
    navigate('/admin/dashboard');
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900 px-4">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-500 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white">Admin Login</h1>
          <p className="text-white/50 text-sm mt-1">Masuk dengan akun admin yang terdaftar.</p>
        </div>
        <form onSubmit={handleLogin} className="card">
          <div className="mb-4">
            <label className="label-field">Email admin</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="admin@email.com" className="input-field pl-11" autoComplete="username" required />
            </div>
          </div>
          <div className="mb-4">
            <label className="label-field">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Masukkan password" className="input-field pl-11" autoComplete="current-password" required />
            </div>
          </div>
          {error && <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
          </div>}
          <button type="submit" disabled={!email || !password || loading} className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed">
            {loading ? 'Memeriksa akun...' : <>Masuk <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>
        <p className="text-center text-white/30 text-xs mt-6">Akses admin dilindungi oleh Supabase Auth.</p>
      </div>
    </div>
  );
}
