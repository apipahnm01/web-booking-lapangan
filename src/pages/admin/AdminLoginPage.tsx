import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { ADMIN_ACCESS_CODE } from '@/lib/constants';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (code === ADMIN_ACCESS_CODE) {
      sessionStorage.setItem('sf_admin_authed', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Kode akses salah. Silakan coba lagi.');
    }
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
          <p className="text-white/50 text-sm mt-1">Masukkan kode akses untuk masuk</p>
        </div>

        <form onSubmit={handleLogin} className="card">
          <div className="mb-4">
            <label className="label-field">Kode Akses</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="password"
                value={code}
                onChange={(e) => { setCode(e.target.value); setError(''); }}
                placeholder="Masukkan kode akses"
                className="input-field pl-11 text-center text-lg tracking-widest"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button type="submit" disabled={!code} className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed">
            Masuk <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="text-center text-white/30 text-xs mt-6">
          Kode akses default: 202520
        </p>
      </div>
    </div>
  );
}
