import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { AdminProtectedRoute } from '../components/layout/AdminProtectedRoute';
import { AdminLayout } from '../layouts/AdminLayout';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminProjects } from '../pages/admin/AdminProjects';
import { AdminJobs } from '../pages/admin/AdminJobs';
import { AdminCourses } from '../pages/admin/AdminCourses';
import { AdminStudentData } from '../pages/admin/AdminStudentData';
import { AdminStaff } from '../pages/admin/AdminStaff';

// Lazy load pages for better performance (LCP/FCP)
const HomePage = lazy(() => import('../pages/HomePage').then(module => ({ default: module.HomePage })));
const LoginPage = lazy(() => import('../pages/LoginPage').then(module => ({ default: module.LoginPage })));
const RegistrationPage = lazy(() => import('../pages/RegistrationPage').then(module => ({ default: module.RegistrationPage })));
const DashboardPage = lazy(() => import('../pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage').then(module => ({ default: module.ProjectsPage })));
const ProjectDetailPage = lazy(() => import('../pages/ProjectDetailPage').then(module => ({ default: module.ProjectDetailPage })));
const ProjectBookingPage = lazy(() => import('../pages/ProjectBookingPage').then(module => ({ default: module.ProjectBookingPage })));
const JobsPage = lazy(() => import('../pages/JobsPage').then(module => ({ default: module.JobsPage })));
const JobDetailPage = lazy(() => import('../pages/JobDetailPage').then(module => ({ default: module.JobDetailPage })));
const CoursesPage = lazy(() => import('../pages/CoursesPage').then(module => ({ default: module.CoursesPage })));
const CourseDetailPage = lazy(() => import('../pages/CourseDetailPage').then(module => ({ default: module.CourseDetailPage })));
const CourseEnrollmentPage = lazy(() => import('../pages/CourseEnrollmentPage').then(module => ({ default: module.CourseEnrollmentPage })));
const ProfilePage = lazy(() => import('../pages/ProfilePage').then(module => ({ default: module.ProfilePage })));

// Loading fallback for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />

          {/* Unprotected Onboarding Route */}
          <Route path="/register" element={<RegistrationPage />} />

          {/* Protected Authenticated Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id/book"
            element={
              <ProtectedRoute>
                <ProjectBookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id/enroll"
            element={
              <ProtectedRoute>
                <CourseEnrollmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Admin CMS Routes */}
          <Route
            path="/cms"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudentData />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="staff" element={<AdminStaff />} />
          </Route>

          {/* Fallback 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
