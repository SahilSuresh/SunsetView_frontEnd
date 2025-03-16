import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";
import { HiMenu, HiX } from "react-icons/hi";

const Header = () => {
  const { isLoggedIn } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-orange-600 py-4 px-4 sm:py-6 sm:px-6 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex flex-wrap items-center justify-between max-w-7xl">
        {/* Logo */}
        <span className="text-2xl sm:text-3xl text-white font-bold">
          <Link to="/">SunsetView.com</Link>
        </span>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-white p-2 focus:outline-none" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:space-x-2">
          {isLoggedIn ? (
            <>
              <Link
                to="/my-bookings"
                className="flex items-center text-white px-4 py-2 font-bold hover:bg-orange-500 transition-colors rounded-full"
              >
                My Bookings
              </Link>
              <Link
                to="/my-hotel"
                className="flex items-center text-white px-4 py-2 font-bold hover:bg-orange-500 transition-colors rounded-full"
              >
                My Hotels
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="flex bg-white items-center text-orange-600 px-4 py-2 font-bold hover:bg-orange-500 hover:text-white transition-colors rounded-full"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="w-full md:hidden mt-4 bg-orange-700 rounded-lg overflow-hidden">
            {isLoggedIn ? (
              <div className="flex flex-col">
                <Link
                  to="/my-bookings"
                  className="text-white px-4 py-3 font-bold hover:bg-orange-600 border-b border-orange-600"
                  onClick={toggleMenu}
                >
                  My Bookings
                </Link>
                <Link
                  to="/my-hotel"
                  className="text-white px-4 py-3 font-bold hover:bg-orange-600 border-b border-orange-600"
                  onClick={toggleMenu}
                >
                  My Hotels
                </Link>
                <div className="px-4 py-3">
                  <SignOutButton />
                </div>
              </div>
            ) : (
              <Link
                to="/sign-in"
                className="block text-white px-4 py-3 font-bold hover:bg-orange-600"
                onClick={toggleMenu}
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;