import { Student, Project, ProjectBooking, Job, Course, CourseEnrollment } from '../types';
import { MockDb } from '../../netlify/functions/_services/mockDb';
import { DirectSheetsClient } from './googleSheetsClient';

const API_BASE_URL = '/api';

async function request<T>(endpoint: string, options?: RequestInit, fallbackFn?: () => T | Promise<T>): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!res.ok) {
      if (res.status === 404 && fallbackFn) {
        return await fallbackFn();
      }
      throw new Error(`API Request failed with status ${res.status}`);
    }

    return (await res.json()) as T;
  } catch (error) {
    if (fallbackFn) {
      return await fallbackFn();
    }
    throw error;
  }
}

export const ApiService = {
  // Student API
  getStudentByGoogleId: async (googleId: string): Promise<Student | null> => {
    return request<Student | null>(
      `/student?google_id=${encodeURIComponent(googleId)}`,
      { method: 'GET' },
      () => MockDb.getStudentByGoogleId(googleId)
    );
  },

  getStudentById: async (studentId: string): Promise<Student | null> => {
    return request<Student | null>(
      `/student?student_id=${encodeURIComponent(studentId)}`,
      { method: 'GET' },
      () => MockDb.getStudentById(studentId)
    );
  },

  saveStudent: async (studentData: Partial<Student>): Promise<Student> => {
    return request<Student>(
      '/student',
      {
        method: 'POST',
        body: JSON.stringify(studentData),
      },
      () => MockDb.saveStudent(studentData)
    );
  },

  // Projects API
  getProjects: async (filters?: { branch?: string; type?: string; search?: string }): Promise<Project[]> => {
    const params = new URLSearchParams();
    if (filters?.branch && filters.branch !== 'All') params.set('branch', filters.branch);
    if (filters?.type && filters.type !== 'All') params.set('type', filters.type);
    if (filters?.search) params.set('search', filters.search);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request<Project[]>(
      `/projects${queryString}`,
      { method: 'GET' },
      async () => {
        const live = await DirectSheetsClient.fetchProjects(filters);
        return live && live.length > 0 ? live : MockDb.getProjects(filters);
      }
    );
  },

  getProjectById: async (id: string): Promise<Project | null> => {
    return request<Project | null>(
      `/projects/${id}`,
      { method: 'GET' },
      async () => {
        const live = await DirectSheetsClient.fetchProjectById(id);
        return live || MockDb.getProjectById(id);
      }
    );
  },

  // Project Bookings API
  createBooking: async (studentId: string, projectId: string): Promise<ProjectBooking> => {
    return request<ProjectBooking>(
      '/project-bookings',
      {
        method: 'POST',
        body: JSON.stringify({ student_id: studentId, project_id: projectId }),
      },
      () => MockDb.createBooking(studentId, projectId)
    );
  },

  getStudentBookings: async (studentId: string): Promise<(ProjectBooking & { project?: Project })[]> => {
    return request<(ProjectBooking & { project?: Project })[]>(
      `/project-bookings?student_id=${encodeURIComponent(studentId)}`,
      { method: 'GET' },
      () => MockDb.getBookingsByStudentId(studentId)
    );
  },

  // Jobs API
  getJobs: async (filters?: { branch?: string; job_type?: string; search?: string }): Promise<Job[]> => {
    const params = new URLSearchParams();
    if (filters?.branch && filters.branch !== 'All') params.set('branch', filters.branch);
    if (filters?.job_type && filters.job_type !== 'All') params.set('job_type', filters.job_type);
    if (filters?.search) params.set('search', filters.search);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request<Job[]>(
      `/jobs${queryString}`,
      { method: 'GET' },
      async () => {
        const live = await DirectSheetsClient.fetchJobs(filters);
        return live && live.length > 0 ? live : MockDb.getJobs(filters);
      }
    );
  },

  getJobById: async (id: string): Promise<Job | null> => {
    return request<Job | null>(
      `/jobs/${id}`,
      { method: 'GET' },
      async () => {
        const live = await DirectSheetsClient.fetchJobById(id);
        return live || MockDb.getJobById(id);
      }
    );
  },

  // Courses API
  getCourses: async (filters?: { category?: string; search?: string }): Promise<Course[]> => {
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== 'All') params.set('category', filters.category);
    if (filters?.search) params.set('search', filters.search);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request<Course[]>(
      `/courses${queryString}`,
      { method: 'GET' },
      async () => {
        const live = await DirectSheetsClient.fetchCourses(filters);
        return live && live.length > 0 ? live : MockDb.getCourses(filters);
      }
    );
  },

  getCourseById: async (id: string): Promise<Course | null> => {
    return request<Course | null>(
      `/courses/${id}`,
      { method: 'GET' },
      async () => {
        const live = await DirectSheetsClient.fetchCourseById(id);
        return live || MockDb.getCourseById(id);
      }
    );
  },

  createCourseEnrollment: async (studentId: string, courseId: string): Promise<CourseEnrollment> => {
    return request<CourseEnrollment>(
      '/course-enrollments',
      {
        method: 'POST',
        body: JSON.stringify({ student_id: studentId, course_id: courseId }),
      },
      () => MockDb.createCourseEnrollment(studentId, courseId)
    );
  },

  getStudentCourseEnrollments: async (studentId: string): Promise<(CourseEnrollment & { course?: Course })[]> => {
    return request<(CourseEnrollment & { course?: Course })[]>(
      `/course-enrollments?student_id=${encodeURIComponent(studentId)}`,
      { method: 'GET' },
      () => MockDb.getCourseEnrollmentsByStudentId(studentId)
    );
  },
};
