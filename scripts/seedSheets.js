import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

// Load .env file manually if exists
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

if (!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
  console.error('❌ Error: Missing Google Sheets credentials in .env file!');
  console.error('Please ensure GOOGLE_SHEETS_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, and GOOGLE_PRIVATE_KEY are set.');
  process.exit(1);
}

const auth = new google.auth.JWT({
  email: SERVICE_ACCOUNT_EMAIL,
  key: PRIVATE_KEY,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Seed Datasets
const PROJECTS_DATA = [
  ['project_id', 'title', 'description', 'branch', 'project_type', 'technologies', 'difficulty', 'duration', 'cost', 'availability', 'capacity', 'image', 'created_at', 'updated_at'],
  ['proj-ece-01', 'Automatic Street Light System', 'An energy-efficient smart street lighting solution using LDR sensors and microcontrollers.', 'ECE / EC', 'Minor', 'Arduino, LDR Sensor, Relay Module, Embedded C', 'Beginner', '3–4 weeks', '3400', 'Available', '20', '', '2026-01-15T00:00:00Z', '2026-01-15T00:00:00Z'],
  ['proj-ece-02', 'Obstacle Avoiding Robot', 'Autonomous mobile robot equipped with ultrasonic sensors navigating complex indoor environments.', 'ECE / EC', 'Minor', 'Arduino Uno, Ultrasonic HC-SR04, L298N Driver, Robotics', 'Intermediate', '4–5 weeks', '3900', 'Available', '15', '', '2026-01-15T00:00:00Z', '2026-01-15T00:00:00Z'],
  ['proj-ece-03', 'Line Following Robot', 'Automated guided vehicle (AGV) using infrared array sensors to trace specific paths.', 'ECE / EC', 'Minor', 'IR Sensors, Arduino Nano, DC Gear Motors, PWM Speed Control', 'Beginner', '3–4 weeks', '3300', 'Available', '25', '', '2026-01-15T00:00:00Z', '2026-01-15T00:00:00Z'],
  ['proj-ece-04', 'RFID Door Lock System', 'Secure contactless access control mechanism with microcontroller processing and solenoid latch.', 'ECE / EC', 'Minor', 'RC522 RFID, Arduino, 16x2 LCD Display, Solenoid Lock', 'Intermediate', '4–5 weeks', '3800', 'Available', '18', '', '2026-01-15T00:00:00Z', '2026-01-15T00:00:00Z'],
  ['proj-ece-05', 'Smart Dustbin System', 'Touchless waste management unit featuring automated lid opening via ultrasonic proximity detection.', 'ECE / EC', 'Minor', 'Servo Motor, Ultrasonic Sensor, ATmega328P, Hardware Enclosure', 'Beginner', '2–3 weeks', '2900', 'Available', '30', '', '2026-01-15T00:00:00Z', '2026-01-15T00:00:00Z'],
  ['proj-ece-06', 'Temperature & Humidity Monitoring', 'IoT environmental telemetry node transmitting ambient room conditions to a cloud dashboard.', 'ECE / EC', 'Minor', 'DHT11/DHT22, ESP8266 Wi-Fi, Blynk Cloud API, C++', 'Intermediate', '3–4 weeks', '3500', 'Available', '22', '', '2026-01-15T00:00:00Z', '2026-01-15T00:00:00Z'],
  ['proj-ece-07', 'Solar EV Car Prototype', 'Clean energy electric vehicle prototype with PV panels, MPPT charge controller, and lithium battery.', 'ECE / EC', 'Major', 'Solar PV Array, BLDC Motor Driver, LiFePO4 BMS, Power Electronics', 'Advanced', '8–10 weeks', '4500', 'Available', '10', '', '2026-01-15T00:00:00Z', '2026-01-15T00:00:00Z'],
  ['proj-ece-08', 'Dual-Axis Solar Tracking System', 'Active light-tracking solar panel mount maximizing energy yield using dual-axis servo positioning.', 'ECE / EC', 'Major', 'Dual Servo Actuators, LDR Bridge, Solar Inverter Logic, Arduino', 'Intermediate', '6–8 weeks', '3400', 'Available', '12', '', '2026-01-15T00:00:00Z', '2026-01-15T00:00:00Z'],
  ['proj-ece-09', 'Wireless Digital Notice Board', 'Remote message display system enabling instant campus announcements via Bluetooth or GSM SMS.', 'ECE / EC', 'Major', 'GSM SIM800L, P10 LED Matrix, Microcontroller, Serial Protocol', 'Intermediate', '5–6 weeks', '3600', 'Available', '15', '', '2026-01-15T00:00:00Z', '2026-01-15T00:00:00Z'],
  ['proj-ece-10', 'Smart Irrigation System', 'Precision agricultural system evaluating soil moisture and weather parameters to trigger water pumps.', 'ECE / EC', 'Major', 'Soil Moisture Sensor, ESP32 Wi-Fi/BT, Submersible Pump, IoT Dashboard', 'Intermediate', '6–8 weeks', '3800', 'Available', '15', '', '2026-01-15T00:00:00Z', '2026-01-15T00:00:00Z'],
  ['proj-ece-11', 'Solar Tree Power Generator', 'Biomimetic solar power structure arranging mini solar panels in tree-branch pattern.', 'ECE / EC', 'Major', 'Solar Micro-Panels, Charge Regulation, USB Output Hub, CAD Design', 'Intermediate', '6–8 weeks', '3300', 'Available', '14', '', '2026-01-15T00:00:00Z', '2026-01-15T00:00:00Z'],
  ['proj-cse-01', 'AI Resume & ATS Screening System', 'NLP platform analyzing candidate resumes against job descriptions, outputting match scores.', 'CSE / IT', 'Major', 'Python, FastAPI, spaCy NLP, React, Tailwind CSS', 'Advanced', '8–10 weeks', '4200', 'Available', '15', '', '2026-01-15T00:00:00Z', '2026-01-15T00:00:00Z'],
  ['proj-cse-02', 'Campus Food Delivery & Order Portal', 'Real-time food ordering and tracking web application for college canteens.', 'CSE / IT', 'Minor', 'Node.js, Express, React, MongoDB, Socket.io', 'Intermediate', '4–6 weeks', '3100', 'Available', '20', '', '2026-01-15T00:00:00Z', '2026-01-15T00:00:00Z'],
  ['proj-eee-01', 'Smart Energy Metering Monitor', 'Digital power analyzer measuring RMS voltage, current, active power with GSM alerts.', 'Electrical / EEE', 'Major', 'Current Transformer CT, Voltage Sensor, PIC Microcontroller, GSM Module', 'Advanced', '6–8 weeks', '4100', 'Available', '12', '', '2026-01-15T00:00:00Z', '2026-01-15T00:00:00Z'],
  ['proj-mech-01', 'Pneumatic Bending Machine', 'Compact semi-automated pneumatic press for precise V-bending of light gauge sheet metal.', 'Mechanical', 'Major', 'Pneumatic Actuators, Solenoid Valves, CAD SolidWorks, Structural Steel', 'Intermediate', '6–8 weeks', '4600', 'Available', '10', '', '2026-01-15T00:00:00Z', '2026-01-15T00:00:00Z'],
  ['proj-civil-01', 'Eco-Bricks from Plastic Waste', 'Sustainable construction material development using processed PET plastic waste and fly ash.', 'Civil', 'Minor', 'Material Testing, Compressive Strength UTM, Waste Recycling, Mix Design', 'Beginner', '4–5 weeks', '2800', 'Available', '20', '', '2026-01-15T00:00:00Z', '2026-01-15T00:00:00Z']
];

const JOBS_DATA = [
  ['job_id', 'company', 'role', 'job_type', 'description', 'eligibility', 'location', 'skills', 'experience', 'deadline', 'apply_url', 'company_logo', 'created_at', 'updated_at'],
  ['job-01', 'TechWave Solutions', 'Backend Developer Intern', 'Internship', 'Join our cloud team to build RESTful microservices, optimize database queries, and design APIs.', 'CSE / IT · 3rd Year / Final Year', 'Gurugram · Hybrid', 'Python, Django, SQL, Git, REST APIs', 'Fresher / Student', '2026-10-15', 'https://example.com/careers/techwave-backend-intern', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80', '2026-02-01T00:00:00Z', '2026-02-01T00:00:00Z'],
  ['job-02', 'Apex Embedded Labs', 'Junior Firmware Engineer', 'Full-time', 'Work on IoT hardware products, developing low-level drivers in C/C++ and testing board prototypes.', 'ECE / EC · Electrical / EEE · Final Year', 'Bengaluru · On-site', 'Embedded C, STM32, RTOS, Circuit Testing, Microcontrollers', 'Fresher (0–1 Yrs)', '2026-11-01', 'https://example.com/careers/apex-firmware-engineer', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=120&auto=format&fit=crop&q=80', '2026-02-05T00:00:00Z', '2026-02-05T00:00:00Z'],
  ['job-03', 'DataMetrics AI', 'Data Analyst Trainee', 'Internship', 'Analyze operational metrics, create interactive business dashboards in PowerBI, and run SQL queries.', 'All Branches · 3rd Year / Final Year', 'Noida · Remote', 'Excel, SQL, Python, Power BI, Data Visualization', 'Fresher', '2026-10-30', 'https://example.com/careers/datametrics-trainee', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&auto=format&fit=crop&q=80', '2026-02-10T00:00:00Z', '2026-02-10T00:00:00Z'],
  ['job-04', 'Nexus Robotics & Automation', 'Robotics Software Trainee', 'Internship', 'Develop trajectory algorithms for automated guided vehicles and work with ROS2 simulation packages.', 'ECE / EC · Mechanical · CSE / IT', 'Pune · Hybrid', 'ROS2, C++, Python, Kinematics, Gazebo', 'Fresher', '2026-11-15', 'https://example.com/careers/nexus-robotics-trainee', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=120&auto=format&fit=crop&q=80', '2026-02-12T00:00:00Z', '2026-02-12T00:00:00Z'],
  ['job-05', 'GreenGrid Power Systems', 'Graduate Engineer Trainee (GET)', 'Full-time', 'Assist senior electrical engineers in solar grid integration, transformer testing, and telemetry.', 'Electrical / EEE · Final Year', 'Hyderabad · On-site', 'Power Systems, MATLAB / Simulink, Electrical Testing, AutoCAD Electrical', 'Fresher', '2026-10-25', 'https://example.com/careers/greengrid-get-power', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=120&auto=format&fit=crop&q=80', '2026-02-14T00:00:00Z', '2026-02-14T00:00:00Z'],
  ['job-06', 'PixelCraft Creative Studio', 'Frontend UI/UX Intern', 'Internship', 'Build responsive web components using React and Tailwind CSS, converting Figma designs to UI.', 'All Branches · 2nd / 3rd / Final Year', 'Remote', 'React, TypeScript, Tailwind CSS, Figma, HTML/CSS', 'Fresher', '2026-10-20', 'https://example.com/careers/pixelcraft-frontend-intern', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=120&auto=format&fit=crop&q=80', '2026-02-15T00:00:00Z', '2026-02-15T00:00:00Z'],
  ['job-07', 'BuildCon Infrastructure', 'Site Engineer Intern', 'Internship', 'Perform structural layout verification, inspect concrete curing quality, and coordinate daily site reports.', 'Civil · 3rd Year / Final Year', 'Ahmedabad · On-site', 'AutoCAD, Surveying, Structural Analysis, Concrete Technology', 'Fresher', '2026-11-10', 'https://example.com/careers/buildcon-site-intern', 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=120&auto=format&fit=crop&q=80', '2026-02-16T00:00:00Z', '2026-02-16T00:00:00Z'],
  ['job-08', 'CloudScale Technologies', 'DevOps & Cloud Associate', 'Full-time', 'Deploy containerized applications using Docker and Kubernetes, and monitor AWS infrastructure.', 'CSE / IT · ECE / EC · Final Year', 'Bengaluru · Hybrid', 'Linux, Docker, AWS, Bash, CI/CD Pipelines', 'Fresher (0–1 Yrs)', '2026-11-20', 'https://example.com/careers/cloudscale-devops-associate', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=120&auto=format&fit=crop&q=80', '2026-02-18T00:00:00Z', '2026-02-18T00:00:00Z']
];

const COURSES_DATA = [
  ['course_id', 'title', 'focus_area', 'student_outcome', 'description', 'technologies', 'duration', 'level', 'category', 'cost', 'instructor', 'created_at', 'updated_at'],
  ['course-01', 'Data Analytics', 'Excel, SQL, data analysis, dashboards, business analytics', 'Job-ready analytics foundation', 'Master practical data analytics from raw data processing to executive dashboard creation.', 'Excel, SQL, Data Analytics, Dashboards, Business Analytics', '6–8 weeks', 'Beginner', 'Data & Analytics', '2900', 'Dr. Rajesh Sharma (Senior Data Strategist)', '2026-01-10T00:00:00Z', '2026-01-10T00:00:00Z'],
  ['course-02', 'Backend Development', 'Python / backend fundamentals, APIs, databases, deployment basics', 'Build APIs and backend applications', 'Learn scalable server-side programming using Python and modern web frameworks.', 'Python, FastAPI, REST APIs, PostgreSQL, Cloud Deployment', '8–10 weeks', 'Intermediate', 'Software Engineering', '3400', 'Neha Gupta (Lead Backend Architect)', '2026-01-10T00:00:00Z', '2026-01-10T00:00:00Z'],
  ['course-03', 'Frontend Development', 'HTML, CSS, JavaScript and modern frontend fundamentals', 'Build responsive web interfaces', 'Build interactive user experiences using HTML5, modern CSS3 styling, JavaScript ES6+, and React.', 'HTML5, CSS3, JavaScript ES6+, React, Tailwind CSS', '6–8 weeks', 'Beginner', 'Software Engineering', '3200', 'Ankit Verma (Frontend UI Specialist)', '2026-01-10T00:00:00Z', '2026-01-10T00:00:00Z'],
  ['course-04', 'Advanced Excel', 'Formulas, Pivot Tables, dashboards, data cleaning and reporting', 'Workplace-ready reporting skills', 'Comprehensive practical training on advanced spreadsheet capabilities including nested lookup functions and dashboards.', 'Excel Formulas, Pivot Tables, Data Cleaning, VLOOKUP / XLOOKUP, Reporting', '4 weeks', 'Beginner', 'Business & Office Productivity', '1900', 'Priya Nair (Corporate Excel Consultant)', '2026-01-10T00:00:00Z', '2026-01-10T00:00:00Z'],
  ['course-05', 'MATLAB for Engineers', 'Programming, numerical computing, simulations and engineering applications', 'Engineering / technical computing skills', 'Hands-on numerical computing and engineering simulation course tailored for engineering students.', 'MATLAB, Simulink, Numerical Computing, Signal Processing, Simulations', '6 weeks', 'Intermediate', 'Core Engineering', '3100', 'Prof. Vikramaditya Rao (Control Systems Expert)', '2026-01-10T00:00:00Z', '2026-01-10T00:00:00Z'],
  ['course-06', 'Microsoft Dynamics 365', 'CRM / ERP fundamentals and practical platform exposure', 'Enterprise business application exposure', 'Gain enterprise-level exposure to Microsoft Dynamics 365 CRM & ERP platform architecture.', 'Microsoft Dynamics 365, CRM Fundamentals, ERP Basics, Power Platform, Enterprise Workflows', '6 weeks', 'Intermediate', 'Enterprise Solutions', '3800', 'Siddharth Patel (Certified Dynamics 365 Architect)', '2026-01-10T00:00:00Z', '2026-01-10T00:00:00Z']
];

const STUDENTS_HEADERS = [['student_id', 'google_id', 'email', 'name', 'mobile', 'location', 'gender', 'college', 'branch', 'year', 'semester', 'profile_image', 'created_at', 'updated_at']];
const BOOKINGS_HEADERS = [['booking_id', 'student_id', 'project_id', 'status', 'booked_at', 'updated_at']];
const ENROLLMENTS_HEADERS = [['enrollment_id', 'student_id', 'course_id', 'status', 'enrolled_at', 'updated_at']];

async function seedTab(range, values) {
  console.log(`⏳ Seeding tab range: ${range}...`);
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });
  console.log(`✅ Tab range ${range} seeded successfully!`);
}

async function runSeed() {
  console.log('🚀 Starting Google Sheets database seeding script...');
  try {
    await seedTab('Projects!A1:N', PROJECTS_DATA);
    await seedTab('Jobs!A1:N', JOBS_DATA);
    await seedTab('Courses!A1:M', COURSES_DATA);
    await seedTab('Students!A1:N', STUDENTS_HEADERS);
    await seedTab('ProjectBookings!A1:F', BOOKINGS_HEADERS);
    await seedTab('CourseEnrollments!A1:F', ENROLLMENTS_HEADERS);
    console.log('🎉 ALL 6 GOOGLE SHEET TABS HAVE BEEN SEEDED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Error during Google Sheets seeding:', err);
    process.exit(1);
  }
}

runSeed();
