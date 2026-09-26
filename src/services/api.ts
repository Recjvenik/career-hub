import { Student, Project, ProjectBooking, Job, Course, CourseEnrollment } from '../types';
import { FirestoreService } from './firestore';

/**
 * ApiService — now a thin wrapper around FirestoreService.
 * All data reads/writes go directly to Firebase Firestore via the Web SDK.
 * No Netlify Functions required for data operations.
 */
export const ApiService = {
  // Student API
  getStudentByGoogleId: (googleId: string): Promise<Student | null> =>
    FirestoreService.getStudentByGoogleId(googleId),

  getStudentById: (studentId: string): Promise<Student | null> =>
    FirestoreService.getStudentById(studentId),

  saveStudent: (studentData: Partial<Student>): Promise<Student> =>
    FirestoreService.saveStudent(studentData),

  // Projects API
  getProjects: (filters?: { branch?: string; type?: string; search?: string }): Promise<Project[]> =>
    FirestoreService.getProjects(filters),

  getProjectById: (id: string): Promise<Project | null> =>
    FirestoreService.getProjectById(id),

  // Project Bookings API
  createBooking: (studentId: string, projectId: string): Promise<ProjectBooking> =>
    FirestoreService.createBooking(studentId, projectId),

  getStudentBookings: (studentId: string): Promise<(ProjectBooking & { project?: Project })[]> =>
    FirestoreService.getBookingsByStudentId(studentId),

  // Jobs API
  getJobs: (filters?: { branch?: string; job_type?: string; search?: string }): Promise<Job[]> =>
    FirestoreService.getJobs(filters),

  getJobById: (id: string): Promise<Job | null> =>
    FirestoreService.getJobById(id),

  // Courses API
  getCourses: (filters?: { category?: string; search?: string }): Promise<Course[]> =>
    FirestoreService.getCourses(filters),

  getCourseById: (id: string): Promise<Course | null> =>
    FirestoreService.getCourseById(id),

  createCourseEnrollment: (studentId: string, courseId: string): Promise<CourseEnrollment> =>
    FirestoreService.createCourseEnrollment(studentId, courseId),

  getStudentCourseEnrollments: (studentId: string): Promise<(CourseEnrollment & { course?: Course })[]> =>
    FirestoreService.getCourseEnrollmentsByStudentId(studentId),
};
