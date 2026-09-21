import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { APP_NAME } from '../../utils/constants';
import { GraduationCap, LogOut, User as UserIcon, Menu, X, ChevronDown, Layers, Briefcase, LayoutDashboard, Home } from 'lucide-react';

export interface HeaderProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { user, student, isAuthenticated, isRegistered, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm group-hover:bg-brand-700 transition-colors">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">
            {APP_NAME}
          </span>
        </Link>

        {/* Center Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {isAuthenticated && isRegistered ? (
            <>
              <Link
                to="/dashboard"
                className={`px-3.5 py-2 rounded-pill text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/dashboard') ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                to="/projects"
                className={`px-3.5 py-2 rounded-pill text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/projects') ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Layers className="w-4 h-4" />
                Projects
              </Link>
              <Link
                to="/jobs"
                className={`px-3.5 py-2 rounded-pill text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/jobs') ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Jobs
              </Link>
              <Link
                to="/courses"
                className={`px-3.5 py-2 rounded-pill text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/courses') ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Courses
              </Link>
              <Link
                to="/profile"
                className={`px-3.5 py-2 rounded-pill text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/profile') ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className={`px-3.5 py-2 rounded-pill text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/') ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link
                to="/jobs"
                className={`px-3.5 py-2 rounded-pill text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/jobs') ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Jobs
              </Link>
              <Link
                to="/courses"
                className={`px-3.5 py-2 rounded-pill text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/courses') ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Courses
              </Link>
              <Link
                to="/projects"
                className={`px-3.5 py-2 rounded-pill text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/projects') ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Layers className="w-4 h-4" />
                Projects
              </Link>
              <Link
                to="/jobs"
                className={`px-3.5 py-2 rounded-pill text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/jobs') ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Jobs
              </Link>
            </>
          )}
        </nav>

        {/* Right Navigation & Profile Dropdown */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-3 rounded-pill hover:bg-gray-100 border border-gray-200 transition-all cursor-pointer"
              >
                <span className="text-xs font-semibold text-gray-800 max-w-[120px] truncate">
                  {student?.name || user?.name || 'Student'}
                </span>
                <Avatar
                  src={student?.profile_image || user?.picture}
                  name={student?.name || user?.name || 'Student'}
                  size="sm"
                />
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 mr-1" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {student?.name || user?.name}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    My Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-gray-400" />
                    Dashboard
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && (
            <Avatar
              src={student?.profile_image || user?.picture}
              name={student?.name || user?.name || 'Student'}
              size="sm"
            />
          )}
          <button
            onClick={onToggleMobileMenu}
            className="p-2 text-gray-700 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all active:scale-95 cursor-pointer border border-transparent hover:border-brand-200"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-brand-600" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>
  );
};
