import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LayoutDashboard, Briefcase, GraduationCap, FolderKanban, LogOut } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { signOut, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Projects', path: '/admin/projects', icon: <FolderKanban className="w-5 h-5" /> },
    { name: 'Jobs', path: '/admin/jobs', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'Courses', path: '/admin/courses', icon: <GraduationCap className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-xl font-extrabold text-brand-700 tracking-tight">Admin Panel</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
                  isActive 
                    ? 'bg-brand-50 text-brand-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4 px-2">
            <img src={user?.picture} alt="Admin" className="w-8 h-8 rounded-full" />
            <div className="text-xs truncate">
              <p className="font-bold text-gray-900 truncate">{user?.name}</p>
              <p className="text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:hidden">
          <span className="text-lg font-bold text-brand-700">Admin Panel</span>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
