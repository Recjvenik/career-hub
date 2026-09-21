import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { APP_NAME } from '../../utils/constants';
import { Home, LayoutDashboard, Layers, Briefcase, User, LogOut, X, GraduationCap, ChevronRight, Sparkles } from 'lucide-react';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated, isRegistered, student, user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex justify-end">
      {/* Dark Translucent Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-gray-900 text-lg tracking-tight">{APP_NAME}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5">
          {/* User Info Card */}
          {isAuthenticated ? (
            <div className="p-4 bg-gradient-to-br from-brand-50 to-brand-100/50 rounded-2xl border border-brand-200/80 shadow-xs flex items-center gap-3">
              <Avatar
                src={student?.profile_image || user?.picture}
                name={student?.name || user?.name || 'Student'}
                size="lg"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold text-brand-950 truncate">
                    {student?.name || user?.name}
                  </p>
                </div>
                <p className="text-xs text-brand-700 truncate">{user?.email}</p>
                {student?.branch && (
                  <div className="mt-1 flex items-center gap-1">
                    <Badge variant="brand" size="sm" className="text-[10px] px-2 py-0">
                      {student.branch}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 text-center flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Sign in to unlocked personalized features</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Track applications, book projects & access career opportunities.</p>
              </div>
            </div>
          )}

          {/* Navigation Links Group */}
          <div className="flex flex-col gap-1">
            {isAuthenticated && isRegistered ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={onClose}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                    isActive('/dashboard')
                      ? 'bg-brand-600 text-white font-semibold shadow-xs'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold leading-none">Dashboard</p>
                      <p className={`text-[10px] mt-1 ${isActive('/dashboard') ? 'text-brand-100' : 'text-gray-400'}`}>
                        Career journey overview
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </Link>

                <Link
                  to="/jobs"
                  onClick={onClose}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                    isActive('/jobs')
                      ? 'bg-brand-600 text-white font-semibold shadow-xs'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold leading-none">Jobs & Opportunities</p>
                      <p className={`text-[10px] mt-1 ${isActive('/jobs') ? 'text-brand-100' : 'text-gray-400'}`}>
                        Internships & developer roles
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </Link>

                <Link
                  to="/courses"
                  onClick={onClose}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                    isActive('/courses')
                      ? 'bg-brand-600 text-white font-semibold shadow-xs'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold leading-none">Upskill Courses</p>
                      <p className={`text-[10px] mt-1 ${isActive('/courses') ? 'text-brand-100' : 'text-gray-400'}`}>
                        Practical skill-building programs
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </Link>

                <Link
                  to="/projects"
                  onClick={onClose}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                    isActive('/projects')
                      ? 'bg-brand-600 text-white font-semibold shadow-xs'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Layers className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold leading-none">Academic Projects</p>
                      <p className={`text-[10px] mt-1 ${isActive('/projects') ? 'text-brand-100' : 'text-gray-400'}`}>
                        Minor & Major project catalogue
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </Link>

                <Link
                  to="/profile"
                  onClick={onClose}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                    isActive('/profile')
                      ? 'bg-brand-600 text-white font-semibold shadow-xs'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold leading-none">Student Profile</p>
                      <p className={`text-[10px] mt-1 ${isActive('/profile') ? 'text-brand-100' : 'text-gray-400'}`}>
                        Academic & personal details
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  onClick={onClose}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                    isActive('/')
                      ? 'bg-brand-600 text-white font-semibold shadow-xs'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Home className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold leading-none">Home</p>
                      <p className={`text-[10px] mt-1 ${isActive('/') ? 'text-brand-100' : 'text-gray-400'}`}>
                        Welcome page & features
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </Link>

                <Link
                  to="/jobs"
                  onClick={onClose}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                    isActive('/jobs')
                      ? 'bg-brand-600 text-white font-semibold shadow-xs'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold leading-none">Jobs & Opportunities</p>
                      <p className={`text-[10px] mt-1 ${isActive('/jobs') ? 'text-brand-100' : 'text-gray-400'}`}>
                        Curated internships & roles
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </Link>

                <Link
                  to="/courses"
                  onClick={onClose}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                    isActive('/courses')
                      ? 'bg-brand-600 text-white font-semibold shadow-xs'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold leading-none">Upskill Courses</p>
                      <p className={`text-[10px] mt-1 ${isActive('/courses') ? 'text-brand-100' : 'text-gray-400'}`}>
                        Practical skill-building programs
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </Link>

                <Link
                  to="/projects"
                  onClick={onClose}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                    isActive('/projects')
                      ? 'bg-brand-600 text-white font-semibold shadow-xs'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Layers className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold leading-none">Academic Projects</p>
                      <p className={`text-[10px] mt-1 ${isActive('/projects') ? 'text-brand-100' : 'text-gray-400'}`}>
                        Hardware & software projects
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Drawer Footer Action */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          {isAuthenticated ? (
            <Button
              variant="danger"
              size="md"
              onClick={() => {
                onClose();
                signOut();
                navigate('/');
              }}
              icon={<LogOut className="w-4 h-4" />}
              className="w-full font-bold shadow-xs"
            >
              Logout Account
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                onClose();
                navigate('/login');
              }}
              className="w-full font-bold shadow-sm"
            >
              Sign In with Google
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export const MobileBottomBar: React.FC = () => {
  const { isAuthenticated, isRegistered } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 py-1.5 px-4 flex items-center justify-around shadow-lg">
      {isAuthenticated && isRegistered ? (
        <>
          <Link
            to="/dashboard"
            className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
              isActive('/dashboard') ? 'text-brand-600 font-bold' : 'text-gray-500'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            to="/jobs"
            className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
              isActive('/jobs') ? 'text-brand-600 font-bold' : 'text-gray-500'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            Jobs
          </Link>
          <Link
            to="/projects"
            className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
              isActive('/projects') ? 'text-brand-600 font-bold' : 'text-gray-500'
            }`}
          >
            <Layers className="w-5 h-5" />
            Projects
          </Link>
          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
              isActive('/profile') ? 'text-brand-600 font-bold' : 'text-gray-500'
            }`}
          >
            <User className="w-5 h-5" />
            Profile
          </Link>
        </>
      ) : (
        <>
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
              isActive('/') ? 'text-brand-600 font-bold' : 'text-gray-500'
            }`}
          >
            <Home className="w-5 h-5" />
            Home
          </Link>
          <Link
            to="/jobs"
            className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
              isActive('/jobs') ? 'text-brand-600 font-bold' : 'text-gray-500'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            Jobs
          </Link>
          <Link
            to="/projects"
            className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
              isActive('/projects') ? 'text-brand-600 font-bold' : 'text-gray-500'
            }`}
          >
            <Layers className="w-5 h-5" />
            Projects
          </Link>
          <Link
            to="/login"
            className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
              isActive('/login') ? 'text-brand-600 font-bold' : 'text-gray-500'
            }`}
          >
            <User className="w-5 h-5" />
            Sign In
          </Link>
        </>
      )}
    </div>
  );
};
