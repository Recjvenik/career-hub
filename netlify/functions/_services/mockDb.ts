import { Student, Project, ProjectBooking, Job, JobApplication, Course, CourseEnrollment } from '../../../src/types/index';
import { INITIAL_PROJECTS } from '../../../src/data/mockProjects';
import { INITIAL_JOBS } from '../../../src/data/mockJobs';
import { INITIAL_COURSES } from '../../../src/data/mockCourses';

// In-memory data store for serverless execution
let studentsStore: Student[] = [
  {
    student_id: 'std-demo-101',
    google_id: 'google-demo-101',
    email: 'himanshu.student@example.edu',
    name: 'Himanshu Sharma',
    mobile: '9876543210',
    location: 'Gurugram, Haryana',
    gender: 'Male',
    college: 'Government Engineering College',
    branch: 'ECE / EC',
    year: 'Final Year',
    semester: 'Semester 7',
    profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

let projectsStore: Project[] = [...INITIAL_PROJECTS];
let bookingsStore: ProjectBooking[] = [
  {
    booking_id: 'book-demo-01',
    student_id: 'std-demo-101',
    project_id: 'proj-ece-10',
    status: 'PENDING',
    booked_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];
let jobsStore: Job[] = [...INITIAL_JOBS];
let applicationsStore: JobApplication[] = [];
let coursesStore: Course[] = [...INITIAL_COURSES];
let enrollmentsStore: CourseEnrollment[] = [
  {
    enrollment_id: 'enr-demo-01',
    student_id: 'std-demo-101',
    course_id: 'course-01',
    status: 'ENROLLED',
    enrolled_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const MockDb = {
  // Student API
  getStudentByGoogleId: (googleId: string): Student | null => {
    return studentsStore.find(s => s.google_id === googleId) || null;
  },

  getStudentById: (studentId: string): Student | null => {
    return studentsStore.find(s => s.student_id === studentId) || null;
  },

  saveStudent: (studentData: Partial<Student>): Student => {
    const existingIndex = studentsStore.findIndex(
      s => (studentData.student_id && s.student_id === studentData.student_id) ||
           (studentData.google_id && s.google_id === studentData.google_id)
    );

    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const updated: Student = {
        ...studentsStore[existingIndex],
        ...studentData,
        updated_at: now,
      };
      studentsStore[existingIndex] = updated;
      return updated;
    } else {
      const newStudent: Student = {
        student_id: studentData.student_id || `std-${Date.now()}`,
        google_id: studentData.google_id || `google-${Date.now()}`,
        email: studentData.email || '',
        name: studentData.name || '',
        mobile: studentData.mobile || '',
        location: studentData.location || '',
        gender: studentData.gender || 'Male',
        college: studentData.college || '',
        branch: studentData.branch || 'CSE / IT',
        year: studentData.year || '1st Year',
        semester: studentData.semester || 'Semester 1',
        profile_image: studentData.profile_image || '',
        created_at: now,
        updated_at: now,
      };
      studentsStore.push(newStudent);
      return newStudent;
    }
  },

  // Projects API
  getProjects: (filters?: { branch?: string; type?: string; search?: string }): Project[] => {
    let result = [...projectsStore];
    if (filters?.branch && filters.branch !== 'All') {
      result = result.filter(p => p.branch.toLowerCase().includes(filters.branch!.toLowerCase()) || filters.branch!.toLowerCase().includes(p.branch.toLowerCase()));
    }
    if (filters?.type && filters.type !== 'All') {
      result = result.filter(p => p.project_type.toLowerCase() === filters.type!.toLowerCase());
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.technologies.some((t: string) => t.toLowerCase().includes(q))
      );
    }
    return result;
  },

  getProjectById: (id: string): Project | null => {
    return projectsStore.find(p => p.project_id === id) || null;
  },

  // Bookings API
  createBooking: (studentId: string, projectId: string): ProjectBooking => {
    const existing = bookingsStore.find(
      b => b.student_id === studentId && b.project_id === projectId && b.status !== 'CANCELLED'
    );
    if (existing) {
      return existing;
    }

    const now = new Date().toISOString();
    const newBooking: ProjectBooking = {
      booking_id: `bk-${Date.now()}`,
      student_id: studentId,
      project_id: projectId,
      status: 'PENDING',
      booked_at: now,
      updated_at: now,
    };
    bookingsStore.push(newBooking);
    return newBooking;
  },

  getBookingsByStudentId: (studentId: string): (ProjectBooking & { project?: Project })[] => {
    return bookingsStore
      .filter(b => b.student_id === studentId)
      .map(b => ({
        ...b,
        project: projectsStore.find(p => p.project_id === b.project_id),
      }));
  },

  // Jobs API
  getJobs: (filters?: { branch?: string; job_type?: string; search?: string }): Job[] => {
    let result = [...jobsStore];
    if (filters?.job_type && filters.job_type !== 'All') {
      result = result.filter(j => j.job_type.toLowerCase() === filters.job_type!.toLowerCase());
    }
    if (filters?.branch && filters.branch !== 'All') {
      result = result.filter(j => j.eligibility.toLowerCase().includes(filters.branch!.toLowerCase()) || j.eligibility.toLowerCase().includes('all'));
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(j => 
        j.company.toLowerCase().includes(q) || 
        j.role.toLowerCase().includes(q) ||
        j.skills.some((s: string) => s.toLowerCase().includes(q))
      );
    }
    return result;
  },

  getJobById: (id: string): Job | null => {
    return jobsStore.find(j => j.job_id === id) || null;
  },

  // Courses API
  getCourses: (filters?: { category?: string; search?: string }): Course[] => {
    let result = [...coursesStore];
    if (filters?.category && filters.category !== 'All') {
      result = result.filter(c => c.category.toLowerCase() === filters.category!.toLowerCase());
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.focus_area.toLowerCase().includes(q) ||
        c.student_outcome.toLowerCase().includes(q) ||
        c.technologies.some((t: string) => t.toLowerCase().includes(q))
      );
    }
    return result;
  },

  getCourseById: (id: string): Course | null => {
    return coursesStore.find(c => c.course_id === id) || null;
  },

  createCourseEnrollment: (studentId: string, courseId: string): CourseEnrollment => {
    const existing = enrollmentsStore.find(e => e.student_id === studentId && e.course_id === courseId && e.status !== 'CANCELLED');
    if (existing) return existing;

    const now = new Date().toISOString();
    const newEnrollment: CourseEnrollment = {
      enrollment_id: `enr-${Date.now()}`,
      student_id: studentId,
      course_id: courseId,
      status: 'ENROLLED',
      enrolled_at: now,
      updated_at: now,
    };
    enrollmentsStore.push(newEnrollment);
    return newEnrollment;
  },

  getCourseEnrollmentsByStudentId: (studentId: string): (CourseEnrollment & { course?: Course })[] => {
    return enrollmentsStore
      .filter(e => e.student_id === studentId)
      .map(e => ({
        ...e,
        course: coursesStore.find(c => c.course_id === e.course_id),
      }));
  },

  // Job Applications API
  createJobApplication: (studentId: string, jobId: string): JobApplication => {
    const existing = applicationsStore.find(a => a.student_id === studentId && a.job_id === jobId);
    if (existing) return existing;

    const newApp: JobApplication = {
      application_id: `app-${Date.now()}`,
      student_id: studentId,
      job_id: jobId,
      status: 'APPLIED',
      applied_at: new Date().toISOString(),
    };
    applicationsStore.push(newApp);
    return newApp;
  }
};
