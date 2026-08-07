'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, User, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'login') {
      const res = login(username, password);
      if (!res.success) {
        setError(res.message);
      } else {
        setSuccessMsg(res.message);
        setTimeout(() => {
          closeAuthModal();
          setUsername('');
          setPassword('');
          setSuccessMsg('');
        }, 500);
      }
    } else {
      const res = register(username, password);
      if (!res.success) {
        setError(res.message);
      } else {
        setSuccessMsg(res.message);
        setTimeout(() => {
          closeAuthModal();
          setUsername('');
          setPassword('');
          setSuccessMsg('');
        }, 500);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#141416] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-500 mx-auto">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-gray-400">
            {mode === 'login'
              ? 'Sign in to access your Watchlist & playback progress'
              : 'Enter a username and password to start your personal Watchlist'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'login' ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'register' ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3.5 py-2.5 rounded-xl text-center">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3.5 py-2.5 rounded-xl flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {successMsg}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1 font-medium">Username</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                />
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1 font-medium">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                />
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-red-600/25 active:scale-95"
          >
            <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-white/5 text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Local Account Only — Saved 100% on your local browser</span>
        </div>
      </div>
    </div>
  );
}
