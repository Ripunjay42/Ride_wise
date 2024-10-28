import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`bg-black text-white fixed w-full top-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold">Ridewise</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth">
              <button className="px-4 py-2 text-white hover:text-gray-200">Ride</button>
            </Link>
            <Link href="/drive">
              <button className="px-4 py-2 text-white hover:text-gray-200">Drive</button>
            </Link>
            <Link href="/business">
              <button className="px-4 py-2 text-white hover:text-gray-200">Business</button>
            </Link>
            <Link href="/about">
              <button className="px-4 py-2 text-white hover:text-gray-200">About</button>
            </Link>
            <Link href="/help">
              <button className="px-4 py-2 text-white hover:text-gray-200">Help</button>
            </Link>
            <Link href="/auth">
              <button className="px-4 py-2 text-white hover:text-gray-200">Log in</button>
            </Link>
            <Link href="/signup">
              <button className="px-4 py-2 bg-white text-black font-medium rounded hover:bg-gray-100 transition-colors">Sign up</button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-black">
            <Link href="/auth">
              <a className="block px-4 py-2 text-white hover:bg-gray-900 rounded">Ride</a>
            </Link>
            <Link href="/drive">
              <a className="block px-4 py-2 text-white hover:bg-gray-900 rounded">Drive</a>
            </Link>
            <Link href="/business">
              <a className="block px-4 py-2 text-white hover:bg-gray-900 rounded">Business</a>
            </Link>
            <Link href="/about">
              <a className="block px-4 py-2 text-white hover:bg-gray-900 rounded">About</a>
            </Link>
            <Link href="/help">
              <a className="block px-4 py-2 text-white hover:bg-gray-900 rounded">Help</a>
            </Link>
            <Link href="/auth">
              <a className="block px-4 py-2 text-white hover:bg-gray-900 rounded">Log in</a>
            </Link>
            <Link href="/signup">
              <a className="block px-4 py-2 bg-white text-black font-medium rounded hover:bg-gray-100 transition-colors">Sign up</a>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;