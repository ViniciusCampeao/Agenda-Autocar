import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import logo from '../../public/logo.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const success = await login(email, password);
    if (!success) {
      setError('Email ou senha incorretos');
    }
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4 sm:p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-48 -top-48 h-[28rem] w-[28rem] rounded-full bg-cyan-500/20 blur-[120px]"></div>
        <div className="absolute -bottom-56 -left-44 h-[30rem] w-[30rem] rounded-full bg-violet-500/25 blur-[135px]"></div>
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[120px]"></div>
      </div>
      
      <div className="surface-card relative w-full max-w-md overflow-hidden p-7 shadow-2xl sm:p-9">
        <div className="absolute -right-16 top-0 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="relative mb-8 text-center sm:mb-9">
          <div className="mb-6 flex justify-center">
              <img src={logo} alt="Logo" className="h-20 w-auto rounded-2xl mb-6" />
          </div>
          <h1 className="surface-title mb-2 text-4xl font-black">
            AUTOCAR
          </h1>
          <p className="mt-1 font-semibold tracking-wide text-slate-300">
              VIDROS AUTOMOTIVOS
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Sistema de Agendamento
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                required
                disabled={loading}
                className="input-modern pl-12"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                required
                disabled={loading}
                className="input-modern pl-12"
                placeholder="Digite sua senha"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-400/50 bg-red-500/10 px-4 py-3 text-red-200">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="h-6 w-6 animate-spin rounded-full border-3 border-white border-t-transparent"></div>
                <span>Entrando...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Entrar</span>
              </>
            )}
          </button>
        </form>

        <div className="relative mt-7 text-center">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} AUTOCAR - Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
