import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ApiService } from '../services/api';
import { Course, CourseEnrollment } from '../types';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ArrowLeft, CheckCircle2, BookmarkCheck, User, GraduationCap, Clock, AlertCircle } from 'lucide-react';

export const CourseEnrollmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { student } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState<CourseEnrollment | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadCourseData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const found = await ApiService.getCourseById(id);
        if (found) {
          setCourse(found);
        } else {
          setErrorMessage('Course not found');
        }
      } catch (err) {
        console.error('Failed to load course details for enrollment:', err);
        setErrorMessage('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    loadCourseData();
  }, [id]);

  const handleConfirmEnrollment = async () => {
    if (!student?.student_id || !course?.course_id) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const result = await ApiService.createCourseEnrollment(student.student_id, course.course_id);
      setEnrollmentSuccess(result);
    } catch (err: any) {
      console.error('Enrollment failed:', err);
      setErrorMessage(err.message || 'Failed to submit enrollment request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="h-48 bg-gray-200 rounded-2xl" />
        <div className="h-48 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  if (enrollmentSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="p-8 text-center flex flex-col items-center gap-6 border-emerald-200 bg-emerald-50/20 shadow-lg">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Enrollment Confirmed</span>
            <h1 className="text-2xl font-extrabold text-gray-900 mt-1">Enrolled Successfully</h1>
            <p className="text-xs text-gray-600 mt-1">
              You are now enrolled in {course?.title}. Access your training materials and schedule directly from your student dashboard.
            </p>
          </div>

          <div className="w-full bg-white p-5 rounded-2xl border border-gray-200 text-left flex flex-col gap-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Enrollment ID:</span>
              <strong className="font-mono text-gray-900 font-bold">{enrollmentSuccess.enrollment_id}</strong>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Course Program:</span>
              <strong className="text-gray-900 font-bold">{course?.title}</strong>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Student Name:</span>
              <strong className="text-gray-900 font-bold">{student?.name}</strong>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Enrollment Date:</span>
              <strong className="text-gray-900 font-bold">{formatDate(enrollmentSuccess.enrolled_at)}</strong>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Status:</span>
              <Badge variant="success" size="sm" className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {enrollmentSuccess.status}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-2">
            <Button
              variant="primary"
              onClick={() => navigate('/dashboard')}
              className="w-full"
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/courses')}
              className="w-full"
            >
              Browse More Courses
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-lg font-bold text-gray-900">Course Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/courses')} className="mt-4">
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      <Link
        to={`/courses/${course.course_id}`}
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Course Details
      </Link>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Course Checkout</span>
        <h1 className="text-2xl font-extrabold text-gray-900 mt-0.5">Confirm Course Enrollment</h1>
        <p className="text-xs text-gray-500 mt-1">
          Review program details and student profile before confirming your enrollment.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-xs text-red-900">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Course Summary Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap className="w-4 h-4 text-brand-600" />
          <h2 className="text-sm font-bold text-gray-900">Program Summary</h2>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">{course.title}</h3>
            <Badge variant="brand" size="sm">
              {course.category}
            </Badge>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{course.description}</p>
          <div className="mt-2 flex flex-wrap items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
            <span>Duration: <strong>{course.duration}</strong></span>
            <span>Skill Level: <strong>{course.level}</strong></span>
            <span>Course Fee: <strong className="text-brand-700 text-sm">{formatCurrency(course.cost)}</strong></span>
          </div>
        </div>
      </Card>

      {/* Student Details Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <User className="w-4 h-4 text-brand-600" />
          <h2 className="text-sm font-bold text-gray-900">Enrolled Student Profile</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-gray-400 block font-medium">Name</span>
            <span className="font-semibold text-gray-800">{student?.name}</span>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-gray-400 block font-medium">Email</span>
            <span className="font-semibold text-gray-800">{student?.email}</span>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-gray-400 block font-medium">College</span>
            <span className="font-semibold text-gray-800">{student?.college}</span>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-gray-400 block font-medium">Branch & Year</span>
            <span className="font-semibold text-gray-800">{student?.branch} · {student?.year}</span>
          </div>
        </div>
      </Card>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <span className="text-xs font-semibold text-gray-500 block">Total Course Fee</span>
          <span className="text-2xl font-extrabold text-brand-700">{formatCurrency(course.cost)}</span>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleConfirmEnrollment}
          isLoading={isSubmitting}
          icon={<BookmarkCheck className="w-5 h-5" />}
          className="w-full sm:w-auto"
        >
          Confirm Enrollment
        </Button>
      </div>
    </div>
  );
};
