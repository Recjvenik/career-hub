import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading, user, student } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Only allow access to the specified admin email or users with the 'admin' role
  const isSuperAdmin = user?.email === 'gotechplace@gmail.com';
  const isStaffAdmin = student?.role === 'admin';

  if (!isSuperAdmin && !isStaffAdmin) {
    // If they are logged in but not an admin, redirect them to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
