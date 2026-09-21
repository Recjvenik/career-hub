import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { MobileNavDrawer, MobileBottomBar } from '../components/layout/MobileNav';
import { APP_NAME, APP_TAGLINE } from '../utils/constants';
import { GraduationCap } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      <Header
        isMobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <MobileNavDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className="flex-1 pb-20 md:pb-12">
        <Outlet />
      </main>

      <MobileBottomBar />

      <footer className="hidden md:block bg-white border-t border-gray-200/80 py-8 mt-auto text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-gray-900 text-sm">{APP_NAME}</span>
            <span className="text-gray-400">|</span>
            <span>{APP_TAGLINE}</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/projects" className="hover:text-gray-900 transition-colors">Projects Marketplace</Link>
            <Link to="/jobs" className="hover:text-gray-900 transition-colors">Jobs & Internships</Link>
            <span className="text-gray-400">© 2026 {APP_NAME}. Built for College Students.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
