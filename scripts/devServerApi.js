import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const equalsIdx = trimmed.indexOf('=');
      if (equalsIdx > 0) {
        const key = trimmed.substring(0, equalsIdx).trim();
        let val = trimmed.substring(equalsIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    }
  });
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

function getSheetsClient() {
  if (!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) return null;
  const auth = new google.auth.JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

export async function handleDevApi(req, res) {
  const sheets = getSheetsClient();
  if (!sheets) return false;

  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  const cleanPath = urlObj.pathname.replace('/api', '');

  try {
    // 1. Student API
    if (cleanPath === '/student' || cleanPath.startsWith('/student')) {
      if (req.method === 'GET') {
        const googleId = urlObj.searchParams.get('google_id');
        const studentId = urlObj.searchParams.get('student_id');

        const resSheet = await sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: 'Students!A2:N',
        });
        const rows = resSheet.data.values || [];
        const match = rows.find(
          (r) => (googleId && r[1] === googleId) || (studentId && r[0] === studentId)
        );

        if (match) {
          const student = {
            student_id: match[0],
            google_id: match[1],
            email: match[2],
            name: match[3],
            mobile: match[4],
            location: match[5],
            gender: match[6],
            college: match[7],
            branch: match[8],
            year: match[9],
            semester: match[10],
            profile_image: match[11],
            created_at: match[12],
            updated_at: match[13],
          };
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(student));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Student not found' }));
        }
        return true;
      }

      if (req.method === 'POST' || req.method === 'PUT') {
        let bodyStr = '';
        req.on('data', (chunk) => {
          bodyStr += chunk;
        });
        await new Promise((resolve) => req.on('end', resolve));

        const payload = JSON.parse(bodyStr || '{}');
        const now = new Date().toISOString();

        const resSheet = await sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: 'Students!A2:N',
        });
        const rows = resSheet.data.values || [];
        const existingIndex = rows.findIndex(
          (r) =>
            (payload.google_id && r[1] === payload.google_id) ||
            (payload.student_id && r[0] === payload.student_id)
        );
        const existing = existingIndex >= 0 ? rows[existingIndex] : null;

        const student = {
          student_id: existing ? existing[0] : payload.student_id || `std-${Date.now()}`,
          google_id: payload.google_id || (existing ? existing[1] : ''),
          email: payload.email || (existing ? existing[2] : ''),
          name: payload.name || (existing ? existing[3] : ''),
          mobile: payload.mobile || (existing ? existing[4] : ''),
          location: payload.location || (existing ? existing[5] : ''),
          gender: payload.gender || (existing ? existing[6] : 'Male'),
          college: payload.college || (existing ? existing[7] : ''),
          branch: payload.branch || (existing ? existing[8] : 'CSE / IT'),
          year: payload.year || (existing ? existing[9] : '1st Year'),
          semester: payload.semester || (existing ? existing[10] : 'Semester 1'),
          profile_image: payload.profile_image || (existing ? existing[11] : ''),
          created_at: existing ? existing[12] : now,
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

        if (existingIndex >= 0) {
          const rowNum = existingIndex + 2;
          await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `Students!A${rowNum}:N${rowNum}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [rowValues] },
          });
        } else {
          await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Students!A:N',
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [rowValues] },
          });
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(student));
        return true;
      }
    }

    // 2. Courses API
    if (cleanPath === '/courses' || cleanPath.startsWith('/courses')) {
      const parts = cleanPath.split('/').filter(Boolean);
      const resSheet = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Courses!A2:M',
      });
      const rows = resSheet.data.values || [];
      let courses = rows.map((r) => ({
        course_id: r[0] || '',
        title: r[1] || '',
        focus_area: r[2] || '',
        student_outcome: r[3] || '',
        description: r[4] || '',
        technologies: r[5] ? r[5].split(',').map((s) => s.trim()) : [],
        duration: r[6] || '',
        level: r[7] || 'Intermediate',
        category: r[8] || '',
        cost: Number(r[9]) || 0,
        instructor: r[10] || '',
        created_at: r[11] || '',
        updated_at: r[12] || '',
      }));

      if (parts.length === 2 && parts[0] === 'courses') {
        const id = parts[1];
        const match = courses.find((c) => c.course_id === id);
        res.writeHead(match ? 200 : 404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(match || { message: 'Course not found' }));
        return true;
      }

      const category = urlObj.searchParams.get('category');
      const search = urlObj.searchParams.get('search');
      if (category && category !== 'All') {
        courses = courses.filter((c) => c.category.toLowerCase().includes(category.toLowerCase()));
      }
      if (search) {
        const q = search.toLowerCase();
        courses = courses.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.focus_area.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q)
        );
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(courses));
      return true;
    }

    // 3. Projects API
    if (cleanPath === '/projects' || cleanPath.startsWith('/projects')) {
      const parts = cleanPath.split('/').filter(Boolean);
      const resSheet = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Projects!A2:N',
      });
      const rows = resSheet.data.values || [];
      let projects = rows.map((r) => ({
        project_id: r[0] || '',
        title: r[1] || '',
        description: r[2] || '',
        branch: r[3] || 'ECE / EC',
        project_type: r[4] || 'Minor',
        technologies: r[5] ? r[5].split(',').map((s) => s.trim()) : [],
        difficulty: r[6] || 'Intermediate',
        duration: r[7] || '4-6 weeks',
        cost: Number(r[8]) || 3000,
        availability: r[9] || 'Available',
        capacity: Number(r[10]) || 15,
        image: r[11] || '',
        created_at: r[12] || '',
        updated_at: r[13] || '',
      }));

      if (parts.length === 2 && parts[0] === 'projects') {
        const id = parts[1];
        const match = projects.find((p) => p.project_id === id);
        res.writeHead(match ? 200 : 404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(match || { message: 'Project not found' }));
        return true;
      }

      const branch = urlObj.searchParams.get('branch');
      const type = urlObj.searchParams.get('type');
      const search = urlObj.searchParams.get('search');
      if (branch && branch !== 'All') {
        projects = projects.filter((p) => p.branch.toLowerCase().includes(branch.toLowerCase()));
      }
      if (type && type !== 'All') {
        projects = projects.filter((p) => p.project_type.toLowerCase() === type.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        projects = projects.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(projects));
      return true;
    }

    // 4. Project Bookings API
    if (cleanPath === '/project-bookings' || cleanPath.startsWith('/project-bookings')) {
      if (req.method === 'POST') {
        let bodyStr = '';
        req.on('data', (chunk) => {
          bodyStr += chunk;
        });
        await new Promise((resolve) => req.on('end', resolve));
        const { student_id, project_id } = JSON.parse(bodyStr || '{}');
        const now = new Date().toISOString();
        const booking = {
          booking_id: `bk-${Date.now()}`,
          student_id,
          project_id,
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
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(booking));
        return true;
      }

      if (req.method === 'GET') {
        const studentId = urlObj.searchParams.get('student_id');
        const resSheet = await sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: 'ProjectBookings!A2:F',
        });
        const rows = resSheet.data.values || [];
        const bookings = rows
          .filter((r) => r[1] === studentId)
          .map((r) => ({
            booking_id: r[0],
            student_id: r[1],
            project_id: r[2],
            status: r[3],
            booked_at: r[4],
            updated_at: r[5],
          }));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(bookings));
        return true;
      }
    }

    // 5. Jobs API
    if (cleanPath === '/jobs' || cleanPath.startsWith('/jobs')) {
      const parts = cleanPath.split('/').filter(Boolean);
      const resSheet = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Jobs!A2:N',
      });
      const rows = resSheet.data.values || [];
      let jobs = rows.map((r) => ({
        job_id: r[0] || '',
        company: r[1] || '',
        role: r[2] || '',
        job_type: r[3] || 'Internship',
        description: r[4] || '',
        eligibility: r[5] || '',
        location: r[6] || '',
        skills: r[7] ? r[7].split(',').map((s) => s.trim()) : [],
        experience: r[8] || 'Fresher',
        deadline: r[9] || '',
        apply_url: r[10] || '#',
        company_logo: r[11] || '',
        created_at: r[12] || '',
        updated_at: r[13] || '',
      }));

      if (parts.length === 2 && parts[0] === 'jobs') {
        const id = parts[1];
        const match = jobs.find((j) => j.job_id === id);
        res.writeHead(match ? 200 : 404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(match || { message: 'Job not found' }));
        return true;
      }

      const job_type = urlObj.searchParams.get('job_type');
      const search = urlObj.searchParams.get('search');
      if (job_type && job_type !== 'All') {
        jobs = jobs.filter((j) => j.job_type.toLowerCase() === job_type.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        jobs = jobs.filter((j) => j.company.toLowerCase().includes(q) || j.role.toLowerCase().includes(q));
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(jobs));
      return true;
    }

    // 6. Course Enrollments API
    if (cleanPath === '/course-enrollments' || cleanPath.startsWith('/course-enrollments')) {
      if (req.method === 'POST') {
        let bodyStr = '';
        req.on('data', (chunk) => {
          bodyStr += chunk;
        });
        await new Promise((resolve) => req.on('end', resolve));
        const { student_id, course_id } = JSON.parse(bodyStr || '{}');
        const now = new Date().toISOString();
        const enrollment = {
          enrollment_id: `enr-${Date.now()}`,
          student_id,
          course_id,
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
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(enrollment));
        return true;
      }

      if (req.method === 'GET') {
        const studentId = urlObj.searchParams.get('student_id');
        const resSheet = await sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: 'CourseEnrollments!A2:F',
        });
        const rows = resSheet.data.values || [];
        const enrollments = rows
          .filter((r) => r[1] === studentId)
          .map((r) => ({
            enrollment_id: r[0],
            student_id: r[1],
            course_id: r[2],
            status: r[3],
            enrolled_at: r[4],
            updated_at: r[5],
          }));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(enrollments));
        return true;
      }
    }
  } catch (err) {
    console.error('Dev API Error:', err);
  }

  return false;
}
