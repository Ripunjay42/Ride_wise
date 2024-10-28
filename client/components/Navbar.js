import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Globe } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-black text-white fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold">RideWise</Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-gray-200">Ride</Link>
            <Link href="/" className="hover:text-gray-200">Drive</Link>
            <Link href="/" className="hover:text-gray-200">Business</Link>

            {/* Dropdown placeholder */}
            <div className="relative">
              <button className="hover:text-gray-200">About ▾</button>
              {/* Add dropdown menu here if needed */}
            </div>
          </div>

          {/* Right-side links */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="flex items-center text-white hover:text-gray-200">
              <Globe className="h-4 w-4 mr-1" /> EN
            </button>
            <Link href="/help" className="hover:text-gray-200">Help</Link>
            <Link href="/auth" className="hover:text-gray-200">Log in</Link>
            <Link href="/auth">
              <button className="px-4 py-2 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-colors">
                Sign up
              </button>
            </Link>
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
            <Link href="/" className="block px-4 py-2 text-white hover:bg-gray-900 rounded">Ride</Link>
            <Link href="/" className="block px-4 py-2 text-white hover:bg-gray-900 rounded">Drive</Link>
            <Link href="/" className="block px-4 py-2 text-white hover:bg-gray-900 rounded">Business</Link>
            <Link href="/" className="block px-4 py-2 text-white hover:bg-gray-900 rounded">About</Link>
            <Link href="/help" className="block px-4 py-2 text-white hover:bg-gray-900 rounded">Help</Link>
            <Link href="/auth" className="block px-4 py-2 text-white hover:bg-gray-900 rounded">Log in</Link>
            <Link href="/auth" className="block px-4 py-2 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
