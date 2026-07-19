'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/search', label: 'Movies' },
    { href: '/search', label: 'TV Shows' },
    { href: '/sports', label: '🏆 Sports' },
    { href: '/search', label: 'New & Popular' },
  ];

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#0f0f11]/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}>
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
                  className={`transition-colors hover:text-white ${
                    pathname === link.href ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4 text-white">
            <Link href="/search" className="hover:text-red-500 transition-colors">
              <Search className="w-5 h-5" />
            </Link>
            <button className="hover:text-red-500 transition-colors hidden md:block relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 ring-white/30 transition-all">
              <User className="w-4 h-4 text-white" />
            </div>
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
                className="text-gray-300 hover:text-white py-3 border-b border-white/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
