import React from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../common/Cards/StatCard';
import RecentActivity from './components/RecentActivity';
import StudentPerformance from './components/StudentPerformance';
import QuickStats from './components/QuickStats';
import { useDashboard } from '../../../hooks/useDashboard';

const Dashboard = () => {
  const { stats, isLoading } = useDashboard();

  const statCards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      change: '+12%',
      icon: 'Users',
      color: 'blue',
      link: '/students'
    },
    {
      title: 'Books Issued',
      value: stats?.booksIssued || 0,
      change: '+8%',
      icon: 'BookOpen',
      color: 'green',
      link: '/library'
    },
    {
      title: 'Attendance Today',
      value: `${stats?.attendanceRate || 0}%`,
      change: '+2%',
      icon: 'Calendar',
      color: 'yellow',
      link: '/attendance'
    },
    {
      title: 'Fees Due',
      value: `$${stats?.feesDue?.toLocaleString() || 0}`,
      change: '-5%',
      icon: 'CreditCard',
      color: 'red',
      link: '/fees'
    },
    {
      title: 'Hostel Meals',
      value: stats?.mealsServed || 0,
      change: '+15%',
      icon: 'Home',
      color: 'purple',
      link: '/hostel'
    },
    {
      title: 'Cafeteria Sales',
      value: `$${stats?.salesToday?.toLocaleString() || 0}`,
      change: '+22%',
      icon: 'Coffee',
      color: 'orange',
      link: '/cafeteria'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, Admin! 👋</h1>
            <p className="text-blue-100 mt-1">
              Here's what's happening with your campus today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-sm text-blue-200">Last updated</p>
              <p className="font-medium">{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <Link to={stat.link} key={index}>
            <StatCard {...stat} />
          </Link>
        ))}
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Student Performance</h3>
                  <p className="text-sm text-gray-600">Monthly average scores</p>
                </div>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                  <option>Last year</option>
                </select>
              </div>
            </div>
            <div className="p-6">
              <StudentPerformance />
            </div>
          </div>
        </div>
        <div>
          <QuickStats />
        </div>
      </div>

      {/* Recent Activities and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {[
                { title: 'Parent-Teacher Meeting', date: 'Tomorrow, 10:00 AM', color: 'blue' },
                { title: 'Library Book Return', date: 'Jan 25, 2024', color: 'green' },
                { title: 'Fee Payment Deadline', date: 'Jan 30, 2024', color: 'red' },
                { title: 'Sports Day', date: 'Feb 5, 2024', color: 'purple' }
              ].map((event, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className={`w-2 h-2 mt-2 rounded-full bg-${event.color}-500`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-white border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <span className="block text-sm font-medium text-gray-900">Issue Book</span>
              </button>
              <button className="bg-white border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <span className="block text-sm font-medium text-gray-900">Mark Attendance</span>
              </button>
              <button className="bg-white border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <span className="block text-sm font-medium text-gray-900">Record Payment</span>
              </button>
              <button className="bg-white border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <span className="block text-sm font-medium text-gray-900">Add Meal</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;