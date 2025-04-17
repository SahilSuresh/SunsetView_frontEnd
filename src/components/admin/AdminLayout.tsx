// components/admin/AdminLayout.tsx

import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/AppContext';
import SignOutButton from '../../components/auth/SignOutButton';
import { 
  HiHome, 
  HiUsers, 
  HiOfficeBuilding, 
  HiCalendar, 
  HiMenuAlt2, 
  HiX,
  HiChevronDown,
  HiChevronUp,
  HiExternalLink,
  HiInbox  
} from 'react-icons/hi';

const AdminLayout = () => {
  const { isAdmin } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Check if current path matches the given path
  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // If not admin, redirect to home
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Sidebar navigation items
  const navItems = [
    { 
      icon: <HiHome className="w-6 h-6" />, 
      label: 'Dashboard', 
      path: '/admin',
      active: isActivePath('/admin') && !isActivePath('/admin/users') && !isActivePath('/admin/hotels') && !isActivePath('/admin/bookings')
    },
    { 
      icon: <HiUsers className="w-6 h-6" />, 
      label: 'Users', 
      path: '/admin/users',
      active: isActivePath('/admin/users')
    },
    { 
      icon: <HiOfficeBuilding className="w-6 h-6" />, 
      label: 'Hotels', 
      path: '/admin/hotels',
      active: isActivePath('/admin/hotels')
    },
    { 
      icon: <HiCalendar className="w-6 h-6" />, 
      label: 'Bookings', 
      path: '/admin/bookings',
      active: isActivePath('/admin/bookings')
    },
    { 
        icon: <HiInbox className="w-6 h-6" />, 
        label: 'Messages', 
        path: '/admin/messages',
        active: isActivePath('/admin/messages'),
      }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Mobile header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-4 px-6 md:hidden flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white p-2 focus:outline-none"
          >
            {sidebarOpen ? <HiX className="w-6 h-6" /> : <HiMenuAlt2 className="w-6 h-6" />}
          </button>
          <span className="ml-2 text-white font-bold text-lg">Admin Panel</span>
        </div>
        <div className="relative">
          <button 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center text-white focus:outline-none"
          >
            <span className="mr-2">Admin</span>
            {userMenuOpen ? <HiChevronUp className="w-5 h-5" /> : <HiChevronDown className="w-5 h-5" />}
          </button>
          
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <Link 
                to="/"
                className="block px-4 py-2 text-gray-800 hover:bg-orange-50"
                onClick={() => setUserMenuOpen(false)}
              >
                Back to Website
              </Link>
              <div className="px-4 py-2">
                <SignOutButton className="w-full bg-white text-orange-600 px-4 py-1.5 font-bold text-sm hover:bg-orange-50 transition-colors rounded-full shadow-sm" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar - Mobile (Sliding panel) */}
      <div className={`fixed inset-0 z-20 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={() => setSidebarOpen(false)}></div>
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-orange-500 to-orange-600 transform transition-transform ease-in-out duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="px-4 pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-white font-bold text-2xl">SunsetView</span>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="text-white focus:outline-none"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>
            <div className="mt-8">
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center px-4 py-3 text-white rounded-lg ${item.active ? 'bg-white/20' : 'hover:bg-white/10'}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className={`mr-3 ${item.active ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                      {item.icon}
                    </div>
                    <span className={`text-base font-medium ${item.active ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                      {item.label}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          <div className="border-t border-white/20 px-4 py-4 mt-auto">
            <Link 
              to="/"
              className="flex items-center px-4 py-3 text-white hover:bg-white/10 rounded-lg"
              onClick={() => setSidebarOpen(false)}
            >
              <HiExternalLink className="mr-3 text-white/80" />
              <span className="text-base font-medium">Back to Website</span>
            </Link>
            <div className="px-4 py-2">
              <SignOutButton className="w-full bg-white text-orange-600 px-4 py-2 font-bold rounded-lg hover:bg-orange-50 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Desktop (Fixed) */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 z-10">
        <div className="flex-1 flex flex-col bg-gradient-to-b from-orange-500 to-orange-600">
          <div className="flex-1 flex flex-col pt-5 pb-4">
            <div className="flex items-center px-6">
              <span className="text-white font-bold text-2xl">SunsetView</span>
            </div>
            <div className="mt-8 flex-1">
              <nav className="px-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center px-4 py-3 text-white rounded-lg ${item.active ? 'bg-white/20' : 'hover:bg-white/10'}`}
                  >
                    <div className={`mr-3 ${item.active ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                      {item.icon}
                    </div>
                    <span className={`text-base font-medium ${item.active ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                      {item.label}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          <div className="border-t border-white/20 px-4 py-4">
            <Link 
              to="/"
              className="flex items-center px-4 py-3 text-white hover:bg-white/10 rounded-lg"
            >
              <HiExternalLink className="mr-3 text-white/80" />
              <span className="text-base font-medium">Back to Website</span>
            </Link>
            <div className="px-4 py-2">
              <SignOutButton className="w-full bg-white text-orange-600 px-4 py-2 font-bold rounded-lg hover:bg-orange-50 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:ml-64 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;