/**
 * seedFirebase.cjs
 * ----------------
 * One-time script to seed GoTechPlace data into Firebase Firestore.
 * Uses CommonJS (.cjs) to bypass "type":"module" in package.json.
 *
 * Run: npm run seed:firebase
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');

// Read service account key
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'serviceAccountKey.json'), 'utf-8')
);

// ---------------------------------------------------------------------------
// Firebase Admin Init (v12+ API)
// ---------------------------------------------------------------------------
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// ---------------------------------------------------------------------------
// Helper: batch write with Firestore's 500 doc limit
// ---------------------------------------------------------------------------
async function batchWrite(collectionName, docs) {
  const batches = [];
  let batch = db.batch();
  let count = 0;

  for (const { id, data } of docs) {
    const ref = id
      ? db.collection(collectionName).doc(id)
      : db.collection(collectionName).doc();
    batch.set(ref, {
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    count++;

    if (count === 499) {
      batches.push(batch.commit());
      batch = db.batch();
      count = 0;
    }
  }
  if (count > 0) batches.push(batch.commit());
  await Promise.all(batches);
}

// ---------------------------------------------------------------------------
// Projects Data
// ---------------------------------------------------------------------------
const PROJECTS = [
  { id: 'proj-ece-01', title: 'Automatic Street Light System', description: 'An energy-efficient smart street lighting solution that uses LDR sensors and microcontrollers to automatically switch lights based on ambient illumination and motion detection.', branch: 'ECE / EC', projectType: 'Minor', technologies: ['Arduino', 'LDR Sensor', 'Relay Module', 'Embedded C'], difficulty: 'Beginner', duration: '3–4 weeks', cost: 3400, availability: 'Available', capacity: 20, imageUrl: '', isActive: true },
  { id: 'proj-ece-02', title: 'Obstacle Avoiding Robot', description: 'Autonomous mobile robot equipped with ultrasonic sensors and motor drivers to navigate complex indoor environments and detect barriers in real-time.', branch: 'ECE / EC', projectType: 'Minor', technologies: ['Arduino Uno', 'Ultrasonic HC-SR04', 'L298N Driver', 'Robotics'], difficulty: 'Intermediate', duration: '4–5 weeks', cost: 3900, availability: 'Available', capacity: 15, imageUrl: '', isActive: true },
  { id: 'proj-ece-03', title: 'Line Following Robot', description: 'Precision automated guided vehicle (AGV) using infrared array sensors to trace specific paths on floor surfaces for industrial logistics applications.', branch: 'ECE / EC', projectType: 'Minor', technologies: ['IR Sensors', 'Arduino Nano', 'DC Gear Motors', 'PWM Speed Control'], difficulty: 'Beginner', duration: '3–4 weeks', cost: 3300, availability: 'Available', capacity: 25, imageUrl: '', isActive: true },
  { id: 'proj-ece-04', title: 'RFID Door Lock System', description: 'Secure contactless access control mechanism with micro-controller processing, solenoid latch driver, and LCD status indicator for smart homes and offices.', branch: 'ECE / EC', projectType: 'Minor', technologies: ['RC522 RFID', 'Arduino', '16x2 LCD Display', 'Solenoid Lock'], difficulty: 'Intermediate', duration: '4–5 weeks', cost: 3800, availability: 'Available', capacity: 18, imageUrl: '', isActive: true },
  { id: 'proj-ece-05', title: 'Smart Dustbin System', description: 'Touchless waste management unit featuring automated lid opening via ultrasonic proximity detection and bin fill level telemetry indicators.', branch: 'ECE / EC', projectType: 'Minor', technologies: ['Servo Motor', 'Ultrasonic Sensor', 'ATmega328P', 'Hardware Enclosure'], difficulty: 'Beginner', duration: '2–3 weeks', cost: 2900, availability: 'Available', capacity: 30, imageUrl: '', isActive: true },
  { id: 'proj-ece-06', title: 'Temperature & Humidity Monitoring', description: 'IoT environmental telemetry node transmitting ambient room conditions to a cloud dashboard or localized digital display using DHT series sensors.', branch: 'ECE / EC', projectType: 'Minor', technologies: ['DHT11/DHT22', 'ESP8266 Wi-Fi', 'Blynk Cloud API', 'C++'], difficulty: 'Intermediate', duration: '3–4 weeks', cost: 3500, availability: 'Available', capacity: 22, imageUrl: '', isActive: true },
  { id: 'proj-ece-07', title: 'Solar EV Car Prototype', description: 'Clean energy electric vehicle prototype with high-efficiency PV panels, MPPT charge controller, lithium battery storage, and regenerative motor drive controller.', branch: 'ECE / EC', projectType: 'Major', technologies: ['Solar PV Array', 'BLDC Motor Driver', 'LiFePO4 BMS', 'Power Electronics'], difficulty: 'Advanced', duration: '8–10 weeks', cost: 4500, availability: 'Available', capacity: 10, imageUrl: '', isActive: true },
  { id: 'proj-ece-08', title: 'Dual-Axis Solar Tracking System', description: 'Active light-tracking solar panel mount maximizing energy yield using dual-axis servo positioning based on differential LDR sensor array inputs.', branch: 'ECE / EC', projectType: 'Major', technologies: ['Dual Servo Actuators', 'LDR Bridge', 'Solar Inverter Logic', 'Arduino'], difficulty: 'Intermediate', duration: '6–8 weeks', cost: 3400, availability: 'Available', capacity: 12, imageUrl: '', isActive: true },
  { id: 'proj-ece-09', title: 'Wireless Digital Notice Board', description: 'Remote message display system enabling instant campus announcements via Bluetooth or GSM SMS gateway directly onto matrix LED matrix screens.', branch: 'ECE / EC', projectType: 'Major', technologies: ['GSM SIM800L', 'P10 LED Matrix', 'Microcontroller', 'Serial Protocol'], difficulty: 'Intermediate', duration: '5–6 weeks', cost: 3600, availability: 'Available', capacity: 15, imageUrl: '', isActive: true },
  { id: 'proj-ece-10', title: 'Smart Irrigation System', description: 'Closed-loop precision agricultural system evaluating soil moisture, rainfall intensity, and weather parameters to trigger automated water pumps via IoT connectivity.', branch: 'ECE / EC', projectType: 'Major', technologies: ['Soil Moisture Sensor', 'ESP32 Wi-Fi/BT', 'Submersible Pump', 'IoT Dashboard'], difficulty: 'Intermediate', duration: '6–8 weeks', cost: 3800, availability: 'Available', capacity: 15, imageUrl: '', isActive: true },
  { id: 'proj-ece-11', title: 'Solar Tree Power Generator', description: 'Biomimetic solar power generation structure arranging mini solar panels in tree-branch pattern to optimize spatial energy density for public charging hubs.', branch: 'ECE / EC', projectType: 'Major', technologies: ['Solar Micro-Panels', 'Charge Regulation', 'USB Output Hub', 'Cad Design'], difficulty: 'Intermediate', duration: '6–8 weeks', cost: 3300, availability: 'Available', capacity: 14, imageUrl: '', isActive: true },
  { id: 'proj-cse-01', title: 'AI Resume & ATS Screening System', description: 'Natural language processing platform analyzing candidate resumes against job descriptions, outputting match scores and keyword optimization suggestions.', branch: 'CSE / IT', projectType: 'Major', technologies: ['Python', 'FastAPI', 'spaCy NLP', 'React', 'Tailwind CSS'], difficulty: 'Advanced', duration: '8–10 weeks', cost: 4200, availability: 'Available', capacity: 15, imageUrl: '', isActive: true },
  { id: 'proj-cse-02', title: 'Campus Food Delivery & Order Portal', description: 'Real-time ordering and tracking web application for college canteens with interactive menu selection, queue status updates, and digital payment receipts.', branch: 'CSE / IT', projectType: 'Minor', technologies: ['Node.js', 'Express', 'React', 'MongoDB', 'Socket.io'], difficulty: 'Intermediate', duration: '4–6 weeks', cost: 3100, availability: 'Available', capacity: 20, imageUrl: '', isActive: true },
  { id: 'proj-eee-01', title: 'Smart Energy Metering & Power Factor Monitor', description: 'Digital power analyzer measuring RMS voltage, current, active power, and power factor with real-time overload trips and GSM usage alerts.', branch: 'Electrical / EEE', projectType: 'Major', technologies: ['Current Transformer CT', 'Voltage Sensor', 'PIC Microcontroller', 'GSM Module'], difficulty: 'Advanced', duration: '6–8 weeks', cost: 4100, availability: 'Available', capacity: 12, imageUrl: '', isActive: true },
  { id: 'proj-mech-01', title: 'Pneumatic Sheet Metal Bending Machine', description: 'Compact semi-automated pneumatic press for precise V-bending of light gauge sheet metal using directional control valves and double-acting cylinders.', branch: 'Mechanical', projectType: 'Major', technologies: ['Pneumatic Actuators', 'Solenoid Valves', 'CAD SolidWorks', 'Structural Steel'], difficulty: 'Intermediate', duration: '6–8 weeks', cost: 4600, availability: 'Available', capacity: 10, imageUrl: '', isActive: true },
  { id: 'proj-civil-01', title: 'Low-Cost Eco-Bricks from Plastic Waste', description: 'Sustainable construction material development using processed PET plastic waste and fly ash aggregate, evaluated for compressive strength and thermal insulation.', branch: 'Civil', projectType: 'Minor', technologies: ['Material Testing', 'Compressive Strength UTM', 'Waste Recycling', 'Mix Design'], difficulty: 'Beginner', duration: '4–5 weeks', cost: 2800, availability: 'Available', capacity: 20, imageUrl: '', isActive: true },
];

// ---------------------------------------------------------------------------
// Jobs Data
// ---------------------------------------------------------------------------
const JOBS = [
  { id: 'job-01', company: 'TechWave Solutions', companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80', role: 'Backend Developer Intern', jobType: 'Internship', description: 'Join our cloud infrastructure team to build RESTful microservices, optimize database queries, and assist in designing scalable API endpoints.', eligibilityBranches: ['CSE / IT'], eligibilityYears: ['3rd Year', 'Final Year'], location: 'Gurugram · Hybrid', locationType: 'Hybrid', skills: ['Python', 'Django', 'SQL', 'Git', 'REST APIs'], experience: 'Fresher / Student', deadline: '2026-10-15', applyUrl: 'https://example.com/careers/techwave-backend-intern', isActive: true },
  { id: 'job-02', company: 'Apex Embedded Labs', companyLogo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=120&auto=format&fit=crop&q=80', role: 'Junior Firmware Engineer', jobType: 'Full-time', description: 'Work on cutting-edge IoT hardware products, developing low-level drivers in C/C++, debugging SPI/I2C communication, and testing board prototypes.', eligibilityBranches: ['ECE / EC', 'Electrical / EEE'], eligibilityYears: ['Final Year'], location: 'Bengaluru · On-site', locationType: 'On-site', skills: ['Embedded C', 'STM32', 'RTOS', 'Circuit Testing', 'Microcontrollers'], experience: 'Fresher (0–1 Yrs)', deadline: '2026-11-01', applyUrl: 'https://example.com/careers/apex-firmware-engineer', isActive: true },
  { id: 'job-03', company: 'DataMetrics AI', companyLogo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&auto=format&fit=crop&q=80', role: 'Data Analyst Trainee', jobType: 'Internship', description: 'Analyze operational metrics, create interactive business dashboards in Tableau/PowerBI, and run SQL queries to extract insights for client reports.', eligibilityBranches: ['CSE / IT', 'ECE / EC', 'Electrical / EEE', 'Mechanical', 'Civil'], eligibilityYears: ['3rd Year', 'Final Year'], location: 'Noida · Remote', locationType: 'Remote', skills: ['Excel', 'SQL', 'Python', 'Power BI', 'Data Visualization'], experience: 'Fresher', deadline: '2026-10-30', applyUrl: 'https://example.com/careers/datametrics-trainee', isActive: true },
  { id: 'job-04', company: 'Nexus Robotics & Automation', companyLogo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=120&auto=format&fit=crop&q=80', role: 'Robotics Software Trainee', jobType: 'Internship', description: 'Develop trajectory algorithms for automated guided vehicles, work with ROS2 simulation packages, and assist with sensor fusion on hardware testbeds.', eligibilityBranches: ['ECE / EC', 'Mechanical', 'CSE / IT'], eligibilityYears: ['3rd Year', 'Final Year'], location: 'Pune · Hybrid', locationType: 'Hybrid', skills: ['ROS2', 'C++', 'Python', 'Kinematics', 'Gazebo'], experience: 'Fresher', deadline: '2026-11-15', applyUrl: 'https://example.com/careers/nexus-robotics-trainee', isActive: true },
  { id: 'job-05', company: 'GreenGrid Power Systems', companyLogo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=120&auto=format&fit=crop&q=80', role: 'Graduate Engineer Trainee (GET)', jobType: 'Full-time', description: 'Assist senior electrical engineers in solar grid integration, transformer testing, SCADA telemetry verification, and renewable energy site surveys.', eligibilityBranches: ['Electrical / EEE'], eligibilityYears: ['Final Year'], location: 'Hyderabad · On-site', locationType: 'On-site', skills: ['Power Systems', 'MATLAB / Simulink', 'Electrical Testing', 'AutoCAD Electrical'], experience: 'Fresher', deadline: '2026-10-25', applyUrl: 'https://example.com/careers/greengrid-get-power', isActive: true },
  { id: 'job-06', company: 'PixelCraft Creative Studio', companyLogo: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=120&auto=format&fit=crop&q=80', role: 'Frontend UI/UX Intern', jobType: 'Internship', description: 'Build responsive web components using React and Tailwind CSS, participate in user research, and convert Figma wireframes into modern web experiences.', eligibilityBranches: ['CSE / IT', 'ECE / EC', 'Electrical / EEE', 'Mechanical', 'Civil'], eligibilityYears: ['2nd Year', '3rd Year', 'Final Year'], location: 'Remote', locationType: 'Remote', skills: ['React', 'TypeScript', 'Tailwind CSS', 'Figma', 'HTML/CSS'], experience: 'Fresher', deadline: '2026-10-20', applyUrl: 'https://example.com/careers/pixelcraft-frontend-intern', isActive: true },
  { id: 'job-07', company: 'BuildCon Infrastructure', companyLogo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=120&auto=format&fit=crop&q=80', role: 'Site Engineer Intern', jobType: 'Internship', description: 'Perform structural layout verification, inspect concrete curing quality, and coordinate daily site progress reports with project managers.', eligibilityBranches: ['Civil'], eligibilityYears: ['3rd Year', 'Final Year'], location: 'Ahmedabad · On-site', locationType: 'On-site', skills: ['AutoCAD', 'Surveying', 'Structural Analysis', 'Concrete Technology'], experience: 'Fresher', deadline: '2026-11-10', applyUrl: 'https://example.com/careers/buildcon-site-intern', isActive: true },
  { id: 'job-08', company: 'CloudScale Technologies', companyLogo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=120&auto=format&fit=crop&q=80', role: 'DevOps & Cloud Associate', jobType: 'Full-time', description: 'Deploy containerized web applications using Docker and Kubernetes, write CI/CD pipeline automation scripts, and monitor AWS server health.', eligibilityBranches: ['CSE / IT', 'ECE / EC'], eligibilityYears: ['Final Year'], location: 'Bengaluru · Hybrid', locationType: 'Hybrid', skills: ['Linux', 'Docker', 'AWS', 'Bash', 'CI/CD Pipelines'], experience: 'Fresher (0–1 Yrs)', deadline: '2026-11-20', applyUrl: 'https://example.com/careers/cloudscale-devops-associate', isActive: true },
];

// ---------------------------------------------------------------------------
// Courses Data
// ---------------------------------------------------------------------------
const COURSES = [
  { id: 'course-01', title: 'Data Analytics', focusArea: 'Excel, SQL, data analysis, dashboards, business analytics', studentOutcome: 'Job-ready analytics foundation', description: 'Master practical data analytics from raw data processing to executive dashboard creation. Learn advanced Excel formulas, relational database querying with SQL, and business reporting metrics.', technologies: ['Excel', 'SQL', 'Data Analytics', 'Dashboards', 'Business Analytics'], duration: '6–8 weeks', level: 'Beginner', category: 'Data & Analytics', cost: 2900, instructor: 'Dr. Rajesh Sharma (Senior Data Strategist)', imageUrl: '', isActive: true },
  { id: 'course-02', title: 'Backend Development', focusArea: 'Python / backend fundamentals, APIs, databases, deployment basics', studentOutcome: 'Build APIs and backend applications', description: 'Learn scalable server-side programming using Python and modern web frameworks. Construct RESTful APIs, interface with relational SQL & NoSQL databases, and deploy cloud applications.', technologies: ['Python', 'FastAPI', 'REST APIs', 'PostgreSQL', 'Cloud Deployment'], duration: '8–10 weeks', level: 'Intermediate', category: 'Software Engineering', cost: 3400, instructor: 'Neha Gupta (Lead Backend Architect)', imageUrl: '', isActive: true },
  { id: 'course-03', title: 'Frontend Development', focusArea: 'HTML, CSS, JavaScript and modern frontend fundamentals', studentOutcome: 'Build responsive web interfaces', description: 'Build interactive user experiences using HTML5, modern CSS3 styling, JavaScript ES6+, and React component architecture. Master mobile-responsive UI patterns and component state design.', technologies: ['HTML5', 'CSS3', 'JavaScript ES6+', 'React', 'Tailwind CSS'], duration: '6–8 weeks', level: 'Beginner', category: 'Software Engineering', cost: 3200, instructor: 'Ankit Verma (Frontend UI Specialist)', imageUrl: '', isActive: true },
  { id: 'course-04', title: 'Advanced Excel', focusArea: 'Formulas, Pivot Tables, dashboards, data cleaning and reporting', studentOutcome: 'Workplace-ready reporting skills', description: 'Comprehensive practical training on advanced spreadsheet capabilities including nested lookup functions, dynamic array formulas, PivotTable data modeling, and automated report generation.', technologies: ['Excel Formulas', 'Pivot Tables', 'Data Cleaning', 'VLOOKUP / XLOOKUP', 'Reporting'], duration: '4 weeks', level: 'Beginner', category: 'Business & Office Productivity', cost: 1900, instructor: 'Priya Nair (Corporate Excel Consultant)', imageUrl: '', isActive: true },
  { id: 'course-05', title: 'MATLAB for Engineers', focusArea: 'Programming, numerical computing, simulations and engineering applications', studentOutcome: 'Engineering / technical computing skills', description: 'Hands-on numerical computing and engineering simulation course tailored for ECE, EEE, Mechanical, and Civil engineering students using MATLAB and Simulink packages.', technologies: ['MATLAB', 'Simulink', 'Numerical Computing', 'Signal Processing', 'Simulations'], duration: '6 weeks', level: 'Intermediate', category: 'Core Engineering', cost: 3100, instructor: 'Prof. Vikramaditya Rao (Control Systems Expert)', imageUrl: '', isActive: true },
  { id: 'course-06', title: 'Microsoft Dynamics 365', focusArea: 'CRM / ERP fundamentals and practical platform exposure', studentOutcome: 'Enterprise business application exposure', description: 'Gain enterprise-level exposure to Microsoft Dynamics 365 CRM & ERP platform architecture, business process management, customer data pipelines, and enterprise application workflows.', technologies: ['Microsoft Dynamics 365', 'CRM Fundamentals', 'ERP Basics', 'Power Platform', 'Enterprise Workflows'], duration: '6 weeks', level: 'Intermediate', category: 'Enterprise Solutions', cost: 3800, instructor: 'Siddharth Patel (Certified Dynamics 365 Architect)', imageUrl: '', isActive: true },
];

// ---------------------------------------------------------------------------
// Main Seed Function
// ---------------------------------------------------------------------------
async function seed() {
  console.log('🔥 Starting Firebase Firestore seed...\n');

  console.log(`📦 Seeding ${PROJECTS.length} projects...`);
  await batchWrite('projects', PROJECTS.map(({ id, ...data }) => ({ id, data })));
  console.log('   ✅ Projects seeded.\n');

  console.log(`💼 Seeding ${JOBS.length} jobs...`);
  await batchWrite('jobs', JOBS.map(({ id, ...data }) => ({ id, data })));
  console.log('   ✅ Jobs seeded.\n');

  console.log(`🎓 Seeding ${COURSES.length} courses...`);
  await batchWrite('courses', COURSES.map(({ id, ...data }) => ({ id, data })));
  console.log('   ✅ Courses seeded.\n');

  console.log('🎉 All data successfully seeded to Firestore!');
  console.log('\nNext steps:');
  console.log('  1. Open Firebase Console → Firestore to verify the data');
  console.log('  2. Run: npm run dev\n');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
