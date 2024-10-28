import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-black text-white fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="text-2xl font-bold">Ridewise</span>
            </a>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
            <Link href="/auth">
              <button className="px-4 py-2 text-white hover:text-gray-200">
                Help
              </button>
              </Link>
              <Link href="/auth">
              <button className="px-4 py-2 text-white hover:text-gray-200">
                Log in
              </button>
              </Link>
              <Link href="/auth">
              <button className="px-4 py-2 bg-white text-black font-medium rounded hover:bg-gray-100 transition-colors">
                Sign up
              </button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-black">
            <a
              href="/help"
              className="block px-4 py-2 text-white hover:bg-gray-900 rounded"
            >
              Help
            </a>
            <a
              href="/auth"
              className="block px-4 py-2 text-white hover:bg-gray-900 rounded"
            >
              Log in
            </a>
            <a
              href="/auth"
              className="block px-4 py-2 text-white hover:bg-gray-900 rounded"
            >
              Sign up
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;