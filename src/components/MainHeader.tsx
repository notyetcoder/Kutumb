'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, LogIn, Home, Compass, Trees, Settings } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';

interface MainHeaderProps {
  user?: any;
}

export default function MainHeader({ user }: MainHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity"
            >
              <span className="text-2xl">🌳</span>
              <span className="hidden sm:inline text-gray-900">Kutumb</span>
            </Link>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {/* Home */}
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                title="Home"
              >
                <Home className="w-4 h-4" />
                <span className="hidden lg:inline">Home</span>
              </Link>

              {/* Explore */}
              <Link
                href="/explore"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                title="Explore"
              >
                <Compass className="w-4 h-4" />
                <span className="hidden lg:inline">Explore</span>
              </Link>

              {/* Relationships */}
              <Link
                href="/relationships"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-green-50 hover:text-green-700 transition-colors duration-200"
                title="Relationships"
              >
                <Trees className="w-4 h-4" />
                <span className="hidden lg:inline">Relationships</span>
              </Link>

              {/* Admin */}
              {user && (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                  title="Admin"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden lg:inline">Admin</span>
                </Link>
              )}
            </nav>
          </div>

          {/* Right: Language & User */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <LanguageSelector />

            {/* User Info / Login */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={`/profile/${user.id}`}
                  className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200"
                  title="View your profile"
                >
                  <span className="hidden sm:inline">Profile</span>
                  <span className="sm:hidden">👤</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/register"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                title="Register or Login"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex flex-wrap gap-2 pb-3 pt-2 border-t border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 rounded hover:bg-gray-100"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
          <Link
            href="/explore"
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 rounded hover:bg-gray-100"
          >
            <Compass className="w-3.5 h-3.5" />
            Explore
          </Link>
          <Link
            href="/relationships"
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 rounded hover:bg-green-50 hover:text-green-700"
          >
            <Trees className="w-3.5 h-3.5" />
            Relationships
          </Link>
          {user && (
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 rounded hover:bg-gray-100"
            >
              <Settings className="w-3.5 h-3.5" />
              Admin
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
