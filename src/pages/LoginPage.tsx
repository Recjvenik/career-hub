import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { APP_NAME } from '../utils/constants';
import { ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithGoogle, loginWithGoogleMock, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleMainSignIn = async () => {
    setIsSigningIn(true);
    try {
      const hasFirebaseConfig = Boolean(import.meta.env.VITE_FIREBASE_API_KEY);
      let existingStudent;

      if (hasFirebaseConfig) {
        // Real Firebase Google Sign-In popup
        existingStudent = await signInWithGoogle();
      } else {
        // Dev fallback: mock existing user
        existingStudent = await loginWithGoogleMock();
      }

      if (existingStudent) {
        navigate((location.state as any)?.from?.pathname || '/dashboard', { replace: true });
      } else {
        navigate('/register', { replace: true });
      }
    } catch (err) {
      console.error('Sign-in failed:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleDemoSignIn = async (userPreset?: 'new' | 'existing') => {
    setIsSigningIn(true);
    try {
      let existingStudent;
      if (userPreset === 'new') {
        const newGoogleUser = {
          google_id: `google-new-${Date.now()}`,
          email: 'new.student@college.edu',
          name: 'Aarav Mehta',
          picture: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
        };
        existingStudent = await loginWithGoogleMock(newGoogleUser);
      } else {
        existingStudent = await loginWithGoogleMock();
      }

      if (existingStudent) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/register', { replace: true });
      }
    } catch (err) {
      console.error('Sign-in failed:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-lg border-gray-200/80">
          <div className="text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <Lock className="w-6 h-6" />
            </div>

            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Sign in to {APP_NAME}
            </h1>
            <p className="text-xs text-gray-500 max-w-xs">
              Use your Google account to access your personalized dashboard, project booking, and job opportunities.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={handleMainSignIn}
              isLoading={isSigningIn || loading}
              icon={
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              }
              className="w-full bg-white text-gray-800 hover:bg-gray-50 border border-gray-300 shadow-xs flex items-center justify-center gap-3 text-sm font-semibold whitespace-nowrap"
            >
              Sign in with Google
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-400 font-medium">Demo Quick Sign-In</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoSignIn('existing')}
                disabled={isSigningIn || loading}
                className="text-xs"
              >
                Existing Student
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoSignIn('new')}
                disabled={isSigningIn || loading}
                className="text-xs"
              >
                New Student Register
              </Button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-2.5 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Identity verified safely via Google OAuth</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
              <span>No password storage required</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
