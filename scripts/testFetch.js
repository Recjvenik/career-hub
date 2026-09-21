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

console.log('Using Spreadsheet ID:', SPREADSHEET_ID);
console.log('Using Email:', SERVICE_ACCOUNT_EMAIL);

const auth = new google.auth.JWT({
  email: SERVICE_ACCOUNT_EMAIL,
  key: PRIVATE_KEY,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function checkCourses() {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Courses!A2:M',
    });
    const rows = res.data.values || [];
    console.log(`✅ Fetched ${rows.length} course rows from Google Sheets!`);
    rows.forEach((r, idx) => {
      console.log(`Course ${idx + 1}: ${r[1]} (${r[0]}) - ${r[8]}`);
    });
  } catch (err) {
    console.error('❌ Error fetching Courses tab:', err.message);
  }
}

checkCourses();
