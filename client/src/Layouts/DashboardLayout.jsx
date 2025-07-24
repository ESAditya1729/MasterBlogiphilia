import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
