import { google } from 'googleapis';
import { Student, Project, ProjectBooking, Job, Course, CourseEnrollment } from '../../../src/types/index';
import { MockDb } from './mockDb';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

function isConfigured(): boolean {
  return Boolean(SPREADSHEET_ID && SERVICE_ACCOUNT_EMAIL && PRIVATE_KEY);
}

function getSheetsClient() {
  if (!isConfigured()) return null;
  const auth = new google.auth.JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

export const GoogleSheetsService = {
  getStudentByGoogleId: async (googleId: string): Promise<Student | null> => {
    if (!isConfigured()) return MockDb.getStudentByGoogleId(googleId);
    try {
      const sheets = getSheetsClient();
      if (!sheets) return MockDb.getStudentByGoogleId(googleId);
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Students!A2:N',
      });
      const rows = res.data.values || [];
      const match = rows.find(r => r[1] === googleId);
      if (!match) return null;
      return mapRowToStudent(match);
    } catch (err) {
      return MockDb.getStudentByGoogleId(googleId);
    }
  },

  getStudentById: async (studentId: string): Promise<Student | null> => {
    if (!isConfigured()) return MockDb.getStudentById(studentId);
    try {
      const sheets = getSheetsClient();
      if (!sheets) return MockDb.getStudentById(studentId);
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Students!A2:N',
      });
      const rows = res.data.values || [];
      const match = rows.find(r => r[0] === studentId);
      if (!match) return null;
      return mapRowToStudent(match);
    } catch (err) {
      return MockDb.getStudentById(studentId);
    }
  },

  saveStudent: async (studentData: Partial<Student>): Promise<Student> => {
    if (!isConfigured()) return MockDb.saveStudent(studentData);
    try {
      const sheets = getSheetsClient();
      if (!sheets) return MockDb.saveStudent(studentData);

      const existing = studentData.google_id 
        ? await GoogleSheetsService.getStudentByGoogleId(studentData.google_id)
        : null;

      const now = new Date().toISOString();
      const student: Student = {
        student_id: existing?.student_id || studentData.student_id || `std-${Date.now()}`,
        google_id: existing?.google_id || studentData.google_id || '',
        email: existing?.email || studentData.email || '',
        name: studentData.name || existing?.name || '',
        mobile: studentData.mobile || existing?.mobile || '',
        location: studentData.location || existing?.location || '',
        gender: studentData.gender || existing?.gender || 'Male',
        college: studentData.college || existing?.college || '',
        branch: studentData.branch || existing?.branch || 'CSE / IT',
        year: studentData.year || existing?.year || '1st Year',
        semester: studentData.semester || existing?.semester || 'Semester 1',
        profile_image: studentData.profile_image || existing?.profile_image || '',
        created_at: existing?.created_at || now,
        updated_at: now,
      };

      const rowValues = [
        student.student_id,
        student.google_id,
        student.email,
        student.name,
        student.mobile,
        student.location,
        student.gender,
        student.college,
        student.branch,
        student.year,
        student.semester,
        student.profile_image,
        student.created_at,
        student.updated_at,
      ];

      if (existing) {
        const res = await sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: 'Students!A2:A',
        });
        const rows = res.data.values || [];
        const rowIndex = rows.findIndex(r => r[0] === student.student_id);
        if (rowIndex >= 0) {
          const rowNum = rowIndex + 2;
          await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `Students!A${rowNum}:N${rowNum}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [rowValues] },
          });
        }
      } else {
        await sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: 'Students!A:N',
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [rowValues] },
        });
      }

      return student;
    } catch (err) {
      return MockDb.saveStudent(studentData);
    }
  },

  getProjects: async (filters?: { branch?: string; type?: string; search?: string }): Promise<Project[]> => {
    if (!isConfigured()) return MockDb.getProjects(filters);
    try {
      const sheets = getSheetsClient();
      if (!sheets) return MockDb.getProjects(filters);
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Projects!A2:N',
      });
      const rows = res.data.values || [];
      let projects = rows.map(mapRowToProject);
      if (filters?.branch && filters.branch !== 'All') {
        projects = projects.filter(p => p.branch.toLowerCase().includes(filters.branch!.toLowerCase()));
      }
      if (filters?.type && filters.type !== 'All') {
        projects = projects.filter(p => p.project_type.toLowerCase() === filters.type!.toLowerCase());
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        projects = projects.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      return projects.length > 0 ? projects : MockDb.getProjects(filters);
    } catch (err) {
      return MockDb.getProjects(filters);
    }
  },

  getProjectById: async (id: string): Promise<Project | null> => {
    if (!isConfigured()) return MockDb.getProjectById(id);
    try {
      const projects = await GoogleSheetsService.getProjects();
      return projects.find(p => p.project_id === id) || MockDb.getProjectById(id);
    } catch {
      return MockDb.getProjectById(id);
    }
  },

  createBooking: async (studentId: string, projectId: string): Promise<ProjectBooking> => {
    if (!isConfigured()) return MockDb.createBooking(studentId, projectId);
    try {
      const sheets = getSheetsClient();
      if (!sheets) return MockDb.createBooking(studentId, projectId);

      const now = new Date().toISOString();
      const booking: ProjectBooking = {
        booking_id: `bk-${Date.now()}`,
        student_id: studentId,
        project_id: projectId,
        status: 'PENDING',
        booked_at: now,
        updated_at: now,
      };

      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'ProjectBookings!A:F',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[booking.booking_id, booking.student_id, booking.project_id, booking.status, booking.booked_at, booking.updated_at]],
        },
      });

      return booking;
    } catch {
      return MockDb.createBooking(studentId, projectId);
    }
  },

  getBookingsByStudentId: async (studentId: string): Promise<(ProjectBooking & { project?: Project })[]> => {
    if (!isConfigured()) return MockDb.getBookingsByStudentId(studentId);
    try {
      const sheets = getSheetsClient();
      if (!sheets) return MockDb.getBookingsByStudentId(studentId);
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'ProjectBookings!A2:F',
      });
      const rows = res.data.values || [];
      const bookings = rows
        .filter(r => r[1] === studentId)
        .map(r => ({
          booking_id: r[0],
          student_id: r[1],
          project_id: r[2],
          status: r[3] as any,
          booked_at: r[4],
          updated_at: r[5],
        }));

      const projects = await GoogleSheetsService.getProjects();
      return bookings.map(b => ({
        ...b,
        project: projects.find(p => p.project_id === b.project_id),
      }));
    } catch {
      return MockDb.getBookingsByStudentId(studentId);
    }
  },

  getJobs: async (filters?: { branch?: string; job_type?: string; search?: string }): Promise<Job[]> => {
    if (!isConfigured()) return MockDb.getJobs(filters);
    try {
      const sheets = getSheetsClient();
      if (!sheets) return MockDb.getJobs(filters);
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Jobs!A2:N',
      });
      const rows = res.data.values || [];
      let jobs = rows.map(mapRowToJob);
      if (filters?.job_type && filters.job_type !== 'All') {
        jobs = jobs.filter(j => j.job_type.toLowerCase() === filters.job_type!.toLowerCase());
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        jobs = jobs.filter(j => j.company.toLowerCase().includes(q) || j.role.toLowerCase().includes(q));
      }
      return jobs.length > 0 ? jobs : MockDb.getJobs(filters);
    } catch {
      return MockDb.getJobs(filters);
    }
  },

  getJobById: async (id: string): Promise<Job | null> => {
    if (!isConfigured()) return MockDb.getJobById(id);
    try {
      const jobs = await GoogleSheetsService.getJobs();
      return jobs.find(j => j.job_id === id) || MockDb.getJobById(id);
    } catch {
      return MockDb.getJobById(id);
    }
  },

  // Courses API
  getCourses: async (filters?: { category?: string; search?: string }): Promise<Course[]> => {
    if (!isConfigured()) return MockDb.getCourses(filters);
    try {
      const sheets = getSheetsClient();
      if (!sheets) return MockDb.getCourses(filters);
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Courses!A2:M',
      });
      const rows = res.data.values || [];
      let courses = rows.map(mapRowToCourse);
      if (filters?.category && filters.category !== 'All') {
        courses = courses.filter(c => c.category.toLowerCase().includes(filters.category!.toLowerCase()));
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        courses = courses.filter(c => c.title.toLowerCase().includes(q) || c.focus_area.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
      }
      return courses.length > 0 ? courses : MockDb.getCourses(filters);
    } catch {
      return MockDb.getCourses(filters);
    }
  },

  getCourseById: async (id: string): Promise<Course | null> => {
    if (!isConfigured()) return MockDb.getCourseById(id);
    try {
      const courses = await GoogleSheetsService.getCourses();
      return courses.find(c => c.course_id === id) || MockDb.getCourseById(id);
    } catch {
      return MockDb.getCourseById(id);
    }
  },

  createCourseEnrollment: async (studentId: string, courseId: string): Promise<CourseEnrollment> => {
    if (!isConfigured()) return MockDb.createCourseEnrollment(studentId, courseId);
    try {
      const sheets = getSheetsClient();
      if (!sheets) return MockDb.createCourseEnrollment(studentId, courseId);

      const now = new Date().toISOString();
      const enrollment: CourseEnrollment = {
        enrollment_id: `enr-${Date.now()}`,
        student_id: studentId,
        course_id: courseId,
        status: 'ENROLLED',
        enrolled_at: now,
        updated_at: now,
      };

      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'CourseEnrollments!A:F',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[enrollment.enrollment_id, enrollment.student_id, enrollment.course_id, enrollment.status, enrollment.enrolled_at, enrollment.updated_at]],
        },
      });

      return enrollment;
    } catch {
      return MockDb.createCourseEnrollment(studentId, courseId);
    }
  },

  getCourseEnrollmentsByStudentId: async (studentId: string): Promise<(CourseEnrollment & { course?: Course })[]> => {
    if (!isConfigured()) return MockDb.getCourseEnrollmentsByStudentId(studentId);
    try {
      const sheets = getSheetsClient();
      if (!sheets) return MockDb.getCourseEnrollmentsByStudentId(studentId);
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'CourseEnrollments!A2:F',
      });
      const rows = res.data.values || [];
      const enrollments = rows
        .filter(r => r[1] === studentId)
        .map(r => ({
          enrollment_id: r[0],
          student_id: r[1],
          course_id: r[2],
          status: r[3] as any,
          enrolled_at: r[4],
          updated_at: r[5],
        }));

      const courses = await GoogleSheetsService.getCourses();
      return enrollments.map(e => ({
        ...e,
        course: courses.find(c => c.course_id === e.course_id),
      }));
    } catch {
      return MockDb.getCourseEnrollmentsByStudentId(studentId);
    }
  }
};

function mapRowToStudent(r: string[]): Student {
  return {
    student_id: r[0] || '',
    google_id: r[1] || '',
    email: r[2] || '',
    name: r[3] || '',
    mobile: r[4] || '',
    location: r[5] || '',
    gender: r[6] || 'Male',
    college: r[7] || '',
    branch: r[8] || 'CSE / IT',
    year: r[9] || '1st Year',
    semester: r[10] || 'Semester 1',
    profile_image: r[11] || '',
    created_at: r[12] || '',
    updated_at: r[13] || '',
  };
}

function mapRowToProject(r: string[]): Project {
  return {
    project_id: r[0] || '',
    title: r[1] || '',
    description: r[2] || '',
    branch: r[3] || 'ECE / EC',
    project_type: (r[4] || 'Minor') as any,
    technologies: r[5] ? r[5].split(',').map(s => s.trim()) : [],
    difficulty: (r[6] || 'Intermediate') as any,
    duration: r[7] || '4-6 weeks',
    cost: Number(r[8]) || 3000,
    availability: (r[9] || 'Available') as any,
    capacity: Number(r[10]) || 15,
    image: r[11] || '',
    created_at: r[12] || '',
    updated_at: r[13] || '',
  };
}

function mapRowToJob(r: string[]): Job {
  return {
    job_id: r[0] || '',
    company: r[1] || '',
    role: r[2] || '',
    job_type: (r[3] || 'Internship') as any,
    description: r[4] || '',
    eligibility: r[5] || '',
    location: r[6] || '',
    skills: r[7] ? r[7].split(',').map(s => s.trim()) : [],
    experience: r[8] || 'Fresher',
    deadline: r[9] || '',
    apply_url: r[10] || '#',
    company_logo: r[11] || '',
    created_at: r[12] || '',
    updated_at: r[13] || '',
  };
}

function mapRowToCourse(r: string[]): Course {
  return {
    course_id: r[0] || '',
    title: r[1] || '',
    focus_area: r[2] || '',
    student_outcome: r[3] || '',
    description: r[4] || '',
    technologies: r[5] ? r[5].split(',').map(s => s.trim()) : [],
    duration: r[6] || '',
    level: (r[7] || 'Intermediate') as any,
    category: r[8] || '',
    cost: Number(r[9]) || 0,
    instructor: r[10] || '',
    created_at: r[11] || '',
    updated_at: r[12] || '',
  };
}
