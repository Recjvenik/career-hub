import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ApiService } from '../services/api';
import { Project, Job, Course, ProjectBooking, CourseEnrollment } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ProjectCard } from '../components/projects/ProjectCard';
import { JobCard } from '../components/jobs/JobCard';
import { CourseCard } from '../components/courses/CourseCard';
import { DashboardSkeleton } from '../components/common/LoadingSkeleton';
import { calculateProfileCompletion, formatCurrency } from '../utils/formatters';
import { Layers, Briefcase, User, ArrowRight, Sparkles, Clock, GraduationCap, BookOpen, CheckCircle2 } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export const DashboardPage: React.FC = () => {
  useSEO({
    title: 'Student Dashboard',
    description: 'Track your career journey, view enrolled courses, and manage booked projects.'
  });

  const navigate = useNavigate();
  const { student, user } = useAuth();
  const [recommendedProjects, setRecommendedProjects] = useState<Project[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [studentBookings, setStudentBookings] = useState<(ProjectBooking & { project?: Project })[]>([]);
  const [studentEnrollments, setStudentEnrollments] = useState<(CourseEnrollment & { course?: Course })[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        if (student?.student_id) {
          const bookings = await ApiService.getStudentBookings(student.student_id);
          setStudentBookings(bookings);
          const enrollments = await ApiService.getStudentCourseEnrollments(student.student_id);
          setStudentEnrollments(enrollments);
        }

        const projects = await ApiService.getProjects({
          branch: student?.branch || 'ECE / EC',
        });
        setRecommendedProjects(projects.slice(0, 3));

        const jobs = await ApiService.getJobs({
          branch: student?.branch || 'All',
        });
        setRecommendedJobs(jobs.slice(0, 3));

        const courses = await ApiService.getCourses();
        setRecommendedCourses(courses.slice(0, 3));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [student]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DashboardSkeleton />
      </div>
    );
  }

  const firstName = student?.name ? student.name.split(' ')[0] : user?.name?.split(' ')[0] || 'Student';
  const profilePct = calculateProfileCompletion(student);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Welcome Greeting Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-white/10 text-brand-200 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-300" />
              Academic & Career Portal
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {firstName}
            </h1>
            <p className="mt-2 text-sm text-brand-100 max-w-xl">
              Here is what is happening with your career journey at {student?.college || 'your institution'}.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-brand-200">
              <span className="bg-white/15 px-3 py-1 rounded-pill font-medium">
                {student?.branch || 'CSE / IT'}
              </span>
              <span className="bg-white/15 px-3 py-1 rounded-pill font-medium">
                {student?.year || 'Final Year'} ({student?.semester || 'Semester 7'})
              </span>
            </div>
          </div>

          {/* Profile Strength Widget */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 shrink-0 min-w-[220px]">
            <div className="flex items-center justify-between text-xs font-semibold text-white mb-2">
              <span>Profile Completion</span>
              <span>{profilePct}%</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-brand-400 rounded-full transition-all duration-500"
                style={{ width: `${profilePct}%` }}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/profile')}
              className="w-full bg-white text-brand-900 border-none hover:bg-brand-50 text-xs font-semibold"
            >
              Update Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            hoverable
            onClick={() => navigate('/jobs')}
            className="flex items-center gap-4 bg-white border-purple-100 hover:border-purple-300 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-purple-600">Find a Job</h3>
              <p className="text-xs text-gray-500 mt-0.5">Explore Internships & Roles</p>
            </div>
          </Card>

          <Card
            hoverable
            onClick={() => navigate('/courses')}
            className="flex items-center gap-4 bg-white border-amber-100 hover:border-amber-300 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-amber-600">Upskill Courses</h3>
              <p className="text-xs text-gray-500 mt-0.5">Practical Skill Programs</p>
            </div>
          </Card>

          <Card
            hoverable
            onClick={() => navigate('/projects')}
            className="flex items-center gap-4 bg-white border-brand-100 hover:border-brand-300 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-colors">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-brand-600">Find a Project</h3>
              <p className="text-xs text-gray-500 mt-0.5">Minor & Major Projects</p>
            </div>
          </Card>

          <Card
            hoverable
            onClick={() => navigate('/profile')}
            className="flex items-center gap-4 bg-white border-emerald-100 hover:border-emerald-300 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-600">Update Profile</h3>
              <p className="text-xs text-gray-500 mt-0.5">Edit Academic Information</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Booked Projects Section */}
      {studentBookings.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Your Booked Projects</h2>
            <Link to="/projects" className="text-xs font-bold text-brand-600 hover:text-brand-700">
              Browse More Projects
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {studentBookings.map((booking) => (
              <Card key={booking.booking_id} className="p-5 border-brand-200 bg-brand-50/20">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge variant="success" size="sm" className="mb-2">
                      {booking.status}
                    </Badge>
                    <h3 className="text-base font-bold text-gray-900">{booking.project?.title || 'Academic Project'}</h3>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-1">{booking.project?.branch}</p>
                  </div>
                  <span className="text-xs font-semibold text-brand-700 bg-brand-100 px-2.5 py-1 rounded-pill shrink-0">
                    {booking.project?.project_type || 'Project'}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-brand-100 flex items-center justify-between text-xs text-gray-600">
                  <span>Difficulty: <strong className="text-brand-800">{booking.project?.difficulty || 'N/A'}</strong></span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Enrolled Courses Section */}
      {studentEnrollments.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Your Enrolled Courses</h2>
            <Link to="/courses" className="text-xs font-bold text-brand-600 hover:text-brand-700">
              Browse More Courses
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentEnrollments.map((enr) => (
              <Card key={enr.enrollment_id} className="p-5 border-emerald-200 bg-emerald-50/20">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge variant="success" size="sm" className="mb-2">
                      {enr.status}
                    </Badge>
                    <h3 className="text-base font-bold text-gray-900">{enr.course?.title || 'Course Program'}</h3>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-1">{enr.course?.focus_area}</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-pill shrink-0">
                    {enr.course?.duration}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs text-gray-600">
                  <span>Outcome: <strong className="text-emerald-800">{enr.course?.student_outcome}</strong></span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Latest Opportunities Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Latest Opportunities</h2>
            <p className="text-xs text-gray-500">Curated internships and entry-level positions</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/jobs')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            View All Jobs
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedJobs.map((job) => (
            <JobCard key={job.job_id} job={job} />
          ))}
        </div>
      </section>

      {/* Recommended Upskilling Courses */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Upskilling & Career Courses</h2>
            <p className="text-xs text-gray-500">Practical skill programs to build your job-ready foundation</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/courses')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            View All Courses
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedCourses.map((course) => (
            <CourseCard 
              key={course.course_id} 
              course={course} 
              isEnrolled={studentEnrollments.some(e => e.course_id === course.course_id)}
            />
          ))}
        </div>
      </section>

      {/* Recommended Projects Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recommended Projects for {student?.branch || 'You'}</h2>
            <p className="text-xs text-gray-500">Minor & Major academic projects catalogue</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/projects')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Explore Projects
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedProjects.map((project) => (
            <ProjectCard 
              key={project.project_id} 
              project={project} 
              isBooked={studentBookings.some(b => b.project_id === project.project_id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
