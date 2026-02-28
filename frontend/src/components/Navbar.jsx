'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHeroPage = pathname === '/';

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
              href="/jobs"
              className={`font-medium text-sm transition-colors hover:text-primary ${
                isHeroPage ? 'text-white/80 hover:text-white' : 'text-gray-600'
              }`}
            >
              Browse Companies
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button className={`font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors ${
              isHeroPage ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
            }`}>
              Login
            </button>
            <Link
              href="/admin"
              className="bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-lg ${isHeroPage ? 'text-white' : 'text-gray-700'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className={`md:hidden pb-4 flex flex-col gap-3 ${isHeroPage ? 'text-white' : 'text-gray-700'}`}>
            <Link href="/jobs" className="font-medium py-2 hover:text-primary" onClick={() => setMenuOpen(false)}>Find Jobs</Link>
            <Link href="/jobs" className="font-medium py-2 hover:text-primary" onClick={() => setMenuOpen(false)}>Browse Companies</Link>
            <Link href="/admin" className="font-medium py-2 hover:text-primary" onClick={() => setMenuOpen(false)}>Admin</Link>
            <div className="flex gap-3 pt-2">
              <button className="font-semibold text-sm px-5 py-2.5 rounded-lg border border-current">Login</button>
              <button className="bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-lg">Sign Up</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
