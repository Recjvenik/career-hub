import { Handler } from '@netlify/functions';
import { GoogleSheetsService } from './_services/googleSheets';

export const handler: Handler = async (event) => {
  const { path, httpMethod, queryStringParameters, body } = event;
  const cleanPath = path.replace('/.netlify/functions/api', '').replace('/api', '');

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    // 1. Student API
    if (cleanPath === '/student' || cleanPath.startsWith('/student')) {
      if (httpMethod === 'GET') {
        const googleId = queryStringParameters?.google_id;
        const studentId = queryStringParameters?.student_id;

        if (googleId) {
          const student = await GoogleSheetsService.getStudentByGoogleId(googleId);
          return { statusCode: student ? 200 : 404, headers, body: JSON.stringify(student) };
        }
        if (studentId) {
          const student = await GoogleSheetsService.getStudentById(studentId);
          return { statusCode: student ? 200 : 404, headers, body: JSON.stringify(student) };
        }
        return { statusCode: 400, headers, body: JSON.stringify({ message: 'Missing google_id or student_id' }) };
      }

      if (httpMethod === 'POST' || httpMethod === 'PUT') {
        const payload = JSON.parse(body || '{}');
        const savedStudent = await GoogleSheetsService.saveStudent(payload);
        return { statusCode: 200, headers, body: JSON.stringify(savedStudent) };
      }
    }

    // 2. Projects API
    if (cleanPath === '/projects' || cleanPath.startsWith('/projects')) {
      const parts = cleanPath.split('/').filter(Boolean);
      
      if (httpMethod === 'GET') {
        if (parts.length === 2 && parts[0] === 'projects') {
          const projectId = parts[1];
          const project = await GoogleSheetsService.getProjectById(projectId);
          if (!project) {
            return { statusCode: 404, headers, body: JSON.stringify({ message: 'Project not found' }) };
          }
          return { statusCode: 200, headers, body: JSON.stringify(project) };
        }

        const branch = queryStringParameters?.branch;
        const type = queryStringParameters?.type;
        const search = queryStringParameters?.search;
        const projects = await GoogleSheetsService.getProjects({ branch, type, search });
        return { statusCode: 200, headers, body: JSON.stringify(projects) };
      }
    }

    // 3. Project Bookings API
    if (cleanPath === '/project-bookings' || cleanPath.startsWith('/project-bookings')) {
      if (httpMethod === 'POST') {
        const { student_id, project_id } = JSON.parse(body || '{}');
        if (!student_id || !project_id) {
          return { statusCode: 400, headers, body: JSON.stringify({ message: 'Missing student_id or project_id' }) };
        }
        const booking = await GoogleSheetsService.createBooking(student_id, project_id);
        return { statusCode: 201, headers, body: JSON.stringify(booking) };
      }

      if (httpMethod === 'GET') {
        const studentId = queryStringParameters?.student_id;
        if (!studentId) {
          return { statusCode: 400, headers, body: JSON.stringify({ message: 'Missing student_id' }) };
        }
        const bookings = await GoogleSheetsService.getBookingsByStudentId(studentId);
        return { statusCode: 200, headers, body: JSON.stringify(bookings) };
      }
    }

    // 4. Jobs API
    if (cleanPath === '/jobs' || cleanPath.startsWith('/jobs')) {
      const parts = cleanPath.split('/').filter(Boolean);

      if (httpMethod === 'GET') {
        if (parts.length === 2 && parts[0] === 'jobs') {
          const jobId = parts[1];
          const job = await GoogleSheetsService.getJobById(jobId);
          if (!job) {
            return { statusCode: 404, headers, body: JSON.stringify({ message: 'Job not found' }) };
          }
          return { statusCode: 200, headers, body: JSON.stringify(job) };
        }

        const branch = queryStringParameters?.branch;
        const job_type = queryStringParameters?.job_type;
        const search = queryStringParameters?.search;
        const jobs = await GoogleSheetsService.getJobs({ branch, job_type, search });
        return { statusCode: 200, headers, body: JSON.stringify(jobs) };
      }
    }

    // 5. Courses API
    if (cleanPath === '/courses' || cleanPath.startsWith('/courses')) {
      const parts = cleanPath.split('/').filter(Boolean);

      if (httpMethod === 'GET') {
        if (parts.length === 2 && parts[0] === 'courses') {
          const courseId = parts[1];
          const course = await GoogleSheetsService.getCourseById(courseId);
          if (!course) {
            return { statusCode: 404, headers, body: JSON.stringify({ message: 'Course not found' }) };
          }
          return { statusCode: 200, headers, body: JSON.stringify(course) };
        }

        const category = queryStringParameters?.category;
        const search = queryStringParameters?.search;
        const courses = await GoogleSheetsService.getCourses({ category, search });
        return { statusCode: 200, headers, body: JSON.stringify(courses) };
      }
    }

    // 6. Course Enrollments API
    if (cleanPath === '/course-enrollments' || cleanPath.startsWith('/course-enrollments')) {
      if (httpMethod === 'POST') {
        const { student_id, course_id } = JSON.parse(body || '{}');
        if (!student_id || !course_id) {
          return { statusCode: 400, headers, body: JSON.stringify({ message: 'Missing student_id or course_id' }) };
        }
        const enrollment = await GoogleSheetsService.createCourseEnrollment(student_id, course_id);
        return { statusCode: 201, headers, body: JSON.stringify(enrollment) };
      }

      if (httpMethod === 'GET') {
        const studentId = queryStringParameters?.student_id;
        if (!studentId) {
          return { statusCode: 400, headers, body: JSON.stringify({ message: 'Missing student_id' }) };
        }
        const enrollments = await GoogleSheetsService.getCourseEnrollmentsByStudentId(studentId);
        return { statusCode: 200, headers, body: JSON.stringify(enrollments) };
      }
    }

    // 404 Default
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: `Endpoint not found: ${cleanPath}` }),
    };

  } catch (error: any) {
    console.error('API Handler Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};
