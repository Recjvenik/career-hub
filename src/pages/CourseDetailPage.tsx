import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ApiService } from '../services/api';
import { Course } from '../types';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { formatCurrency } from '../utils/formatters';
import { ArrowLeft, Clock, Target, CheckCircle2, Award, UserCheck, AlertCircle, BookmarkPlus } from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    const loadCourse = async () => {
      if (!id) return;
      setLoading(true);
      setNotFound(false);
      try {
        const found = await ApiService.getCourseById(id);
        if (found) {
          setCourse(found);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Error loading course details:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col gap-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32" />
        <div className="h-40 bg-gray-200 rounded-3xl" />
        <div className="h-64 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  if (notFound || !course) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Course Not Found</h2>
        <p className="text-sm text-gray-500">The requested upskilling course is no longer available.</p>
        <Button variant="primary" onClick={() => navigate('/courses')}>
          Back to Courses Catalogue
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Back Button */}
      <Link
        to="/courses"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Courses Catalogue
      </Link>

      {/* Hero Header Card */}
      <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-brand-950 text-white rounded-3xl p-6 sm:p-10 shadow-md flex flex-col gap-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="brand" size="sm" className="bg-white/15 text-white border-white/20">
            {course.category}
          </Badge>
          <span className="text-xs font-semibold bg-white/10 text-brand-200 px-3 py-1 rounded-pill">
            {course.level} Level
          </span>
          <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-200 px-3 py-1 rounded-pill border border-emerald-500/30 flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            Job-Ready Certificate
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {course.title}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-brand-100 leading-relaxed max-w-3xl">
            {course.description}
          </p>
        </div>

        {/* Focus Area & Outcome Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-300 block">Focus Area</span>
            <p className="text-white font-semibold mt-0.5">{course.focus_area}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">Student Outcome</span>
            <p className="text-emerald-100 font-semibold mt-0.5">{course.student_outcome}</p>
          </div>
        </div>

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-semibold text-brand-300 uppercase tracking-wider mr-2">Skills Covered:</span>
          {course.technologies.map((tech) => (
            <span key={tech} className="text-xs font-semibold bg-white/10 text-white px-3 py-1 rounded-lg border border-white/10">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Specifications & Enrollment Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 p-6 flex flex-col gap-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Program Curriculum & Details
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Duration</span>
              <span className="text-sm font-extrabold text-gray-800 mt-0.5 block">{course.duration}</span>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Level</span>
              <span className="text-sm font-extrabold text-gray-800 mt-0.5 block">{course.level}</span>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Category</span>
              <span className="text-sm font-extrabold text-gray-800 mt-0.5 block">{course.category}</span>
            </div>
          </div>

          {course.instructor && (
            <div className="p-4 bg-brand-50/60 rounded-xl border border-brand-100 flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-brand-600 shrink-0" />
              <div>
                <span className="text-[11px] font-bold text-brand-900 uppercase tracking-wider block">Course Mentor / Instructor</span>
                <p className="text-xs font-bold text-brand-800 mt-0.5">{course.instructor}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">What Students Gain Upon Completion:</h3>
            <ul className="text-xs text-gray-600 flex flex-col gap-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{course.student_outcome}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hands-on practical projects for resume enhancement</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified digital completion certificate</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct integration with student career dashboard</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Pricing & Enrollment Card */}
        <Card className="p-6 flex flex-col justify-between border-brand-200 bg-brand-50/20 shadow-md">
          <div className="flex flex-col gap-4">
            <div className="border-b border-brand-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Course Fee</span>
              <div className="text-3xl font-extrabold text-brand-700 mt-1">
                {formatCurrency(course.cost)}
              </div>
              <span className="text-[11px] text-gray-500 mt-0.5 block">Includes training, projects & certification</span>
            </div>

            <div className="flex flex-col gap-2.5 text-xs text-gray-600">
              <div className="flex items-center justify-between">
                <span>Duration:</span>
                <strong className="text-gray-900 font-bold">{course.duration}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Skill Level:</span>
                <strong className="text-gray-900 font-bold">{course.level}</strong>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(`/courses/${course.course_id}/enroll`)}
              icon={<BookmarkPlus className="w-5 h-5" />}
              className="w-full text-base font-bold shadow-md"
            >
              Enroll Now
            </Button>
            <p className="text-[11px] text-center text-gray-500">
              Instant enrollment confirmation & dashboard access.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
