import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumb from './Breadcrumb';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Breadcrumb */}
        <div className="px-6 pt-6">
          <Breadcrumb />
        </div>

        {/* Main content */}
        <main className="flex-1 px-6 pb-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              © {new Date().getFullYear()} Smart Campus. All rights reserved.
            </div>
            <div className="flex items-center space-x-4">
              <span>v1.0.0</span>
              <span className="h-1 w-1 rounded-full bg-gray-400"></span>
              <span>Admin Portal</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;