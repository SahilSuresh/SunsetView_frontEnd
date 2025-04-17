// pages/admin/Dashboard.tsx

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import * as apiClient from '../../api-client';
import { HiUsers, HiOfficeBuilding, HiCalendar, HiCurrencyPound } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Fetch dashboard stats
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: apiClient.getAdminDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="mt-4 text-lg text-gray-700">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
        <h3 className="text-lg font-bold mb-2">Error Loading Dashboard</h3>
        <p>There was a problem loading the dashboard data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Users Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <HiUsers className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.totalUsers || 0}</p>
            </div>
          </div>
          <Link to="/admin/users" className="text-blue-500 text-sm mt-4 inline-block hover:underline">
            View all users →
          </Link>
        </div>

        {/* Hotels Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <HiOfficeBuilding className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Hotels</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.totalHotels || 0}</p>
            </div>
          </div>
          <Link to="/admin/hotels" className="text-green-500 text-sm mt-4 inline-block hover:underline">
            View all hotels →
          </Link>
        </div>

        {/* Bookings Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <HiCalendar className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.totalBookings || 0}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.recentBookings || 0} new in last 30 days
              </p>
            </div>
          </div>
          <Link to="/admin/bookings" className="text-purple-500 text-sm mt-4 inline-block hover:underline">
            View all bookings →
          </Link>
        </div>

        {/* Revenue Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-full mr-4">
              <HiCurrencyPound className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">
                £{stats?.totalRevenue ? stats.totalRevenue.toFixed(2) : "0.00"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link 
            to="/admin/users" 
            className="px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center justify-center"
          >
            <HiUsers className="w-5 h-5 mr-2" />
            <span>Manage Users</span>
          </Link>
          <Link 
            to="/admin/hotels" 
            className="px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 flex items-center justify-center"
          >
            <HiOfficeBuilding className="w-5 h-5 mr-2" />
            <span>Manage Hotels</span>
          </Link>
          <Link 
            to="/admin/bookings" 
            className="px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 flex items-center justify-center"
          >
            <HiCalendar className="w-5 h-5 mr-2" />
            <span>View Bookings</span>
          </Link>
        </div>
      </div>

      {/* Admin guide section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Admin Guide</h2>
        <div className="text-gray-600 space-y-3">
          <p>Welcome to the SunsetView admin panel. From here you can:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>View and manage user accounts</li>
            <li>Browse all hotels in the system</li>
            <li>Review all bookings made through the platform</li>
            <li>Monitor overall platform performance</li>
          </ul>
          <p className="mt-4 text-sm bg-blue-50 p-4 rounded-lg border border-blue-100">
            For security reasons, please remember to log out when you've finished your admin session.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;