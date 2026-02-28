'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { logout } from '../lib/api';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const isHeroPage = pathname === '/';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setMenuOpen(false);
    router.push('/');
  };

  return (
    <nav className={`w-full z-50 ${isHeroPage ? 'absolute top-0 left-0' : 'sticky top-0 bg-white shadow-sm border-b border-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="1.5" />
                <circle cx="9" cy="9" r="3" fill="white" />
              </svg>
            </div>
            <span className={`font-bold text-xl tracking-tight ${isHeroPage ? 'text-white' : 'text-dark'}`}>
              QuickHire
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/jobs"
              className={`font-medium text-sm transition-colors hover:text-primary ${
                isHeroPage ? 'text-white/80 hover:text-white' : 'text-gray-600'
              }`}
            >
              Find Jobs
            </Link>
            <Link
              href="/companies"
              className={`font-medium text-sm transition-colors hover:text-primary ${
                isHeroPage ? 'text-white/80 hover:text-white' : 'text-gray-600'
              }`}
            >
              Browse Companies
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${isHeroPage ? 'text-white' : 'text-gray-700'}`}>
                  {user.fullName}
                </span>
                <button
                  onClick={handleLogout}
                  className={`font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors ${
                    isHeroPage ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors ${
                    isHeroPage ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-lg transition-all ${isHeroPage ? 'text-white' : 'text-gray-700'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile Menu - Animated Slide Down */}
        {menuOpen && (
          <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out`}>
            <div className={`pb-4 flex flex-col gap-3 pt-4 border-t ${isHeroPage ? 'border-white/20 text-white' : 'border-gray-100 text-gray-700'} animate-in fade-in slide-in-from-top-2`}>
              <Link href="/jobs" className="font-medium py-2 hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>
                Find Jobs
              </Link>
              <Link href="/companies" className="font-medium py-2 hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>
                Browse Companies
              </Link>
              
              <div className="flex gap-3 pt-2 border-t" style={{ borderColor: isHeroPage ? 'rgba(255,255,255,0.2)' : 'rgb(209, 213, 219)' }}>
                {user ? (
                  <>
                    <div className="flex-1">
                      <p className="text-xs font-medium mb-2">Logged in as</p>
                      <p className="text-sm font-semibold">{user.fullName}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className={`flex-1 font-semibold text-sm px-4 py-2.5 rounded-lg border transition-colors ${
                        isHeroPage ? 'border-white/30 text-white hover:bg-white/10' : 'border-current text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="flex-1">
                      <button className={`w-full font-semibold text-sm px-4 py-2.5 rounded-lg border transition-colors ${
                        isHeroPage ? 'border-white/30 text-white hover:bg-white/10' : 'border-current text-gray-700 hover:bg-gray-100'
                      }`}>
                        Login
                      </button>
                    </Link>
                    <Link href="/signup" className="flex-1">
                      <button className="w-full bg-primary text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-primary-600 transition-colors">
                        Sign Up
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
