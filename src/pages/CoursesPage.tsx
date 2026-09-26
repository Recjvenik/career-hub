import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ApiService } from '../services/api';
import { Course } from '../types';
import { CourseCard } from '../components/courses/CourseCard';
import { CourseFilters } from '../components/courses/CourseFilters';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSEO } from '../hooks/useSEO';

export const CoursesPage: React.FC = () => {
  useSEO({
    title: 'Upskilling Courses',
    description: 'Explore industry-aligned training programs to build your job-ready foundation.'
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category') || 'All';
  const searchParam = searchParams.get('search') || '';

  const [courses, setCourses] = useState<Course[]>([]);
  const [studentEnrollments, setStudentEnrollments] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const { student } = useAuth();

  const fetchCourses = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await ApiService.getCourses({
        category: categoryParam,
        search: searchParam,
      });
      setCourses(data);

      if (student?.student_id) {
        const enrollments = await ApiService.getStudentCourseEnrollments(student.student_id);
        setStudentEnrollments(enrollments.map(e => e.course_id));
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [categoryParam, searchParam, student?.student_id]);

  const updateFilters = (newCategory?: string, newSearch?: string) => {
    const params = new URLSearchParams(searchParams);
    if (newCategory !== undefined) {
      if (newCategory === 'All') params.delete('category');
      else params.set('category', newCategory);
    }
    if (newSearch !== undefined) {
      if (!newSearch) params.delete('search');
      else params.set('search', newSearch);
    }
    setSearchParams(params);
  };

  const handleReset = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-brand-50 text-brand-700 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            Practical Skill Programs
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Upskilling & Career Courses
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Explore industry-aligned training programs designed to give engineering students a job-ready foundation.
          </p>
        </div>

        <div className="text-xs text-gray-500 font-semibold bg-white border border-gray-200 px-3.5 py-2 rounded-pill shadow-xs shrink-0">
          Showing <span className="text-brand-600 font-bold">{courses.length}</span> Practical Programs
        </div>
      </div>

      {/* Filters Bar */}
      <CourseFilters
        search={searchParam}
        onSearchChange={(val) => updateFilters(undefined, val)}
        selectedCategory={categoryParam}
        onCategoryChange={(cat) => updateFilters(cat, undefined)}
        onReset={handleReset}
      />

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState onRetry={fetchCourses} />
      ) : courses.length === 0 ? (
        <EmptyState
          title="No courses match your search criteria"
          message="Try selecting a different category or clearing active search keywords."
          onAction={handleReset}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard 
              key={course.course_id} 
              course={course} 
              isEnrolled={studentEnrollments.includes(course.course_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
