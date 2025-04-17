// Updated Header.tsx with Admin Link

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../contexts/AppContext";
import SignOutButton from "../auth/SignOutButton";
import { HiMenu, HiX, HiUser, HiShieldCheck } from "react-icons/hi";

const Header = () => {
  const { isLoggedIn, isAdmin } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent body scrolling when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  // Clean up body overflow when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className={`bg-gradient-to-r from-orange-300 to-orange-500 py-3 px-4 sm:py-4 sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? "shadow-lg" : "shadow-md"
    }`}>
      <div className="container mx-auto flex items-center justify-between max-w-7xl">
        {/* Logo and Mobile Navigation Group */}
        <div className="flex items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl text-white font-bold mr-2 sm:mr-6">
            SunsetView.com
          </Link>

          {/* Desktop Primary Navigation - For larger screens, always visible */}
          <div className="hidden md:flex space-x-1 lg:space-x-3">
            <Link to="/hotels" className="text-white px-2 py-1 text-sm lg:text-base hover:bg-white/10 rounded-lg transition-colors">
              All Hotels
            </Link>
            <Link to="/featured" className="text-white px-2 py-1 text-sm lg:text-base hover:bg-white/10 rounded-lg transition-colors">
              Featured Stays
            </Link>
            <Link to="/trending" className="text-white px-2 py-1 text-sm lg:text-base hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap">
              Trending Destinations
            </Link>
            <Link to="/about" className="text-white px-2 py-1 text-sm lg:text-base hover:bg-white/10 rounded-lg transition-colors">
              About Us
            </Link>
            
            {/* Admin Panel Link - Only shown for admin users */}
            {isAdmin && (
              <Link 
                to="/admin" 
                className="text-white px-2 py-1 text-sm lg:text-base bg-black/20 hover:bg-black/30 rounded-lg transition-colors flex items-center"
              >
                <HiShieldCheck className="mr-1" />
                Admin Panel
              </Link>
            )}
          </div>
        </div>

        {/* User Navigation - Login/Auth actions */}
        <div className="flex items-center">
          {/* Desktop User Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                {/* User icon button */}
                <button 
                  onClick={toggleUserMenu}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-orange-500 hover:bg-orange-50 transition-colors"
                  aria-label="User menu"
                >
                  <HiUser size={24} />
                </button>
                
                {/* Dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link 
                      to="/my-bookings"
                      className="block px-4 py-2 text-gray-800 hover:bg-orange-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Link 
                      to="/my-hotel"
                      className="block px-4 py-2 text-gray-800 hover:bg-orange-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Hotels
                    </Link>
                    {/* Admin Panel Link in dropdown */}
                    {isAdmin && (
                      <Link 
                        to="/admin"
                        className="block px-4 py-2 text-gray-800 hover:bg-orange-50 font-medium flex items-center"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <HiShieldCheck className="mr-2 text-orange-500" />
                        Admin Panel
                      </Link>
                    )}
                    <div className="px-4 py-2">
                      <SignOutButton className="w-full bg-white text-orange-600 px-4 py-1.5 font-bold text-sm lg:text-base hover:bg-orange-50 transition-colors rounded-full shadow-sm" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/sign-in" className="bg-white text-orange-600 px-4 py-1.5 font-bold text-sm lg:text-base hover:bg-orange-50 transition-colors rounded-full shadow-sm">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white p-2 focus:outline-none menu-button" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu - Full screen overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Full orange background */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500">
            {/* Menu header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/20">
              <h2 className="text-white font-bold text-xl">Menu</h2>
              <button 
                onClick={toggleMenu}
                className="text-white hover:bg-white/10 p-1 rounded-full"
              >
                <HiX size={24} />
              </button>
            </div>
            
            {/* Menu content */}
            <div className="overflow-y-auto h-[calc(100%-64px)] pb-20">
              {/* Main Navigation Links */}
              <div className="pt-4 px-6">
                <h3 className="text-white/80 text-sm font-bold uppercase tracking-wider mb-2">
                  EXPLORE
                </h3>
                <div className="space-y-1">
                  <Link 
                    to="/hotels" 
                    className="block text-white py-3 px-4 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors"
                    onClick={toggleMenu}
                  >
                    All Hotels
                  </Link>
                  <Link 
                    to="/featured" 
                    className="block text-white py-3 px-4 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors"
                    onClick={toggleMenu}
                  >
                    Featured Stays
                  </Link>
                  <Link 
                    to="/trending" 
                    className="block text-white py-3 px-4 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors"
                    onClick={toggleMenu}
                  >
                    Trending Destinations
                  </Link>
                  <Link 
                    to="/about" 
                    className="block text-white py-3 px-4 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors"
                    onClick={toggleMenu}
                  >
                    About Us
                  </Link>
                  
                  {/* Admin Panel Link - Mobile version */}
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="flex items-center text-white py-3 px-4 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
                      onClick={toggleMenu}
                    >
                      <HiShieldCheck className="mr-2" />
                      Admin Panel
                    </Link>
                  )}
                </div>
              </div>
              
              {/* User Account Links */}
              {isLoggedIn ? (
                <div className="mt-8 px-6">
                  <h3 className="text-white/80 text-sm font-bold uppercase tracking-wider mb-2">
                    YOUR ACCOUNT
                  </h3>
                  <div className="space-y-1">
                    <Link 
                      to="/my-bookings" 
                      className="block text-white py-3 px-4 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors"
                      onClick={toggleMenu}
                    >
                      My Bookings
                    </Link>
                    <Link 
                      to="/my-hotel" 
                      className="block text-white py-3 px-4 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors"
                      onClick={toggleMenu}
                    >
                      My Hotels
                    </Link>
                  </div>
                  
                  <div className="mt-8 px-4">
                    <SignOutButton 
                      className="w-full bg-white text-orange-600 py-3 px-4 rounded-lg font-bold hover:bg-orange-50 transition-colors"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-8 px-6">
                  <h3 className="text-white/80 text-sm font-bold uppercase tracking-wider mb-2">
                    ACCOUNT
                  </h3>
                  <div className="px-4">
                    <Link 
                      to="/sign-in" 
                      className="block w-full bg-white text-orange-600 py-3 px-4 rounded-lg text-center font-bold hover:bg-orange-50 transition-colors"
                      onClick={toggleMenu}
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;