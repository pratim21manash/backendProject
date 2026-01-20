import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Award,
  CreditCard,
  Home,
  Coffee,
  Users,
  Settings,
  BarChart3,
  Bell,
  HelpCircle,
  LogOut,
  X,
  ChevronRight
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Students',
    icon: Users,
    path: '/students',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    title: 'Library',
    icon: BookOpen,
    path: '/library',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    title: 'Attendance',
    icon: Calendar,
    path: '/attendance',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    title: 'Results',
    icon: Award,
    path: '/results',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    title: 'Fees',
    icon: CreditCard,
    path: '/fees',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  },
  {
    title: 'Hostel',
    icon: Home,
    path: '/hostel',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50'
  },
  {
    title: 'Cafeteria',
    icon: Coffee,
    path: '/cafeteria',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    path: '/analytics',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50'
  },
  {
    title: 'Notifications',
    icon: Bell,
    path: '/notifications',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50'
  }
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-auto lg:z-auto
        flex flex-col bg-white border-r border-gray-200
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">SC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CampusPro</h1>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center justify-between px-4 py-3 rounded-lg
                transition-all duration-200 group
                ${isActive 
                  ? `${item.bgColor} ${item.color} font-semibold` 
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
              onClick={onClose}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${isActive ? item.bgColor : 'bg-gray-100'} group-hover:bg-opacity-80`}>
                  <item.icon size={20} className={isActive ? item.color : 'text-gray-500'} />
                </div>
                <span className="text-sm">{item.title}</span>
              </div>
              <ChevronRight 
                size={16} 
                className={`transition-transform ${isActive ? 'translate-x-0' : '-translate-x-1 opacity-0'} group-hover:translate-x-0 group-hover:opacity-100`}
              />
            </NavLink>
          ))}
        </nav>

        {/* User profile */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">AJ</span>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@campus.edu</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Settings size={18} />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;