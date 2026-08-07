'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User, Menu, X, Bookmark, LogOut, PlayCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const { currentUser, watchlist, continueWatching, openAuthModal, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/search', label: 'Movies & Series' },
    { href: '/sports', label: '🏆 Sports' },
    { href: '/watchlist', label: 'My Watchlist' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled ? 'bg-[#0f0f11]/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="text-xl md:text-2xl font-extrabold tracking-tighter">
              <span className="text-red-600">CSCP</span>
              <span className="text-white">MOVIES</span>
            </Link>

            <nav className="hidden md:flex items-center gap-5 text-[13px] font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`transition-colors hover:text-white relative ${
                    pathname === link.href ? 'text-white font-bold' : 'text-gray-400'
                  }`}
                >
                  {link.label}
                  {link.href === '/watchlist' && watchlist.length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 bg-red-600 text-white text-[10px] font-bold rounded-full">
                      {watchlist.length}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4 text-white">
            <Link href="/search" className="hover:text-red-500 transition-colors">
              <Search className="w-5 h-5" />
            </Link>

            {/* Watchlist Quick Button */}
            <Link
              href="/watchlist"
              className="hover:text-red-500 transition-colors hidden sm:flex items-center gap-1.5 text-xs text-gray-300 relative"
              title="My Watchlist"
            >
              <Bookmark className="w-5 h-5 text-gray-300" />
              {watchlist.length > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-red-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                  {watchlist.length}
                </span>
              )}
            </Link>

            {/* User Auth Section */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full border border-white/10 transition-all text-xs font-semibold"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white text-[11px] font-bold uppercase">
                    {currentUser.substring(0, 1)}
                  </div>
                  <span className="capitalize text-white hidden sm:inline max-w-[100px] truncate">
                    {currentUser}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#141416] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-white/5">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Signed in as</p>
                      <p className="text-xs font-bold text-white truncate capitalize">{currentUser}</p>
                    </div>

                    <Link
                      href="/watchlist"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <Bookmark className="w-4 h-4 text-red-500" />
                      <span>My Watchlist ({watchlist.length})</span>
                    </Link>

                    {continueWatching.length > 0 && (
                      <Link
                        href="/#continue-watching"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <PlayCircle className="w-4 h-4 text-blue-400" />
                        <span>Continue Watching ({continueWatching.length})</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left border-t border-white/5 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-md shadow-red-600/20 active:scale-95"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="fixed inset-0 z-40 bg-[#0f0f11]/98 pt-20 px-6 md:hidden">
          <nav className="flex flex-col gap-4 text-lg font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenu(false)}
                className="text-gray-300 hover:text-white py-3 border-b border-white/5 flex items-center justify-between"
              >
                <span>{link.label}</span>
                {link.href === '/watchlist' && watchlist.length > 0 && (
                  <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full">
                    {watchlist.length}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
