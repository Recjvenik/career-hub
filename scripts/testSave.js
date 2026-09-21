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

const auth = new google.auth.JWT({
  email: SERVICE_ACCOUNT_EMAIL,
  key: PRIVATE_KEY,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function testSaveStudent() {
  console.log('🧪 Testing Student Profile save to Google Sheets...');
  const now = new Date().toISOString();
  const testStudent = {
    student_id: `std-test-${Date.now()}`,
    google_id: `google-test-${Date.now()}`,
    email: 'test.student@example.edu',
    name: 'Test Student Profile',
    mobile: '9876543210',
    location: 'Gurugram, Haryana',
    gender: 'Male',
    college: 'Delhi Technological University',
    branch: 'ECE / EC',
    year: 'Final Year',
    semester: 'Semester 7',
    profile_image: '',
    created_at: now,
    updated_at: now,
  };

  const rowValues = [
    testStudent.student_id,
    testStudent.google_id,
    testStudent.email,
    testStudent.name,
    testStudent.mobile,
    testStudent.location,
    testStudent.gender,
    testStudent.college,
    testStudent.branch,
    testStudent.year,
    testStudent.semester,
    testStudent.profile_image,
    testStudent.created_at,
    testStudent.updated_at,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Students!A:N',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [rowValues] },
  });

  console.log('✅ Student profile saved to Students tab successfully!');

  const check = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Students!A2:N',
  });

  const rows = check.data.values || [];
  console.log(`📊 Total Student Rows in Google Sheets: ${rows.length}`);
  console.log(`Latest Saved Student: ${rows[rows.length - 1][3]} (${rows[rows.length - 1][2]})`);
}

testSaveStudent();
