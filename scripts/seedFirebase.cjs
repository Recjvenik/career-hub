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
  {
    "id": "proj-ece-01",
    "title": "Automatic Waste Segregator",
    "description": "Dry, wet, and metal waste separation system utilizing an Arduino-based smart control system, ultrasonic sensor for detection, and a servo-controlled rotating sorting mechanism.",
    "branch": "ECE / EC",
    "projectType": "Minor",
    "technologies": [
      "Arduino",
      "Ultrasonic Sensor",
      "Servo Motor",
      "Relay Module"
    ],
    "difficulty": "Beginner",
    "duration": "3–4 weeks",
    "originalCost": 8500,
    "discountedCost": 6800,
    "availability": "Available",
    "capacity": 20,
    "imageUrl": "/images/projects/2.webp",
    "isActive": true
  },
  {
    "id": "proj-ece-02",
    "title": "Anti-Sleep Alarm with Driver Safety",
    "description": "Smart safety system for driving that detects drowsiness by monitoring eye blinks using an IR sensor, triggering an instant buzzer alarm and visual LED indication.",
    "branch": "ECE / EC",
    "projectType": "Minor",
    "technologies": [
      "Arduino UNO",
      "IR Sensor",
      "Buzzer",
      "LED Indicator"
    ],
    "difficulty": "Beginner",
    "duration": "3–4 weeks",
    "originalCost": 9750,
    "discountedCost": 7800,
    "availability": "Available",
    "capacity": 15,
    "imageUrl": "/images/projects/3.webp",
    "isActive": true
  },
  {
    "id": "proj-ece-03",
    "title": "Solar Wireless Car Charging Station",
    "description": "Eco-friendly wireless EV charging station powered by a solar panel, charge controller, and battery storage using an inductive wireless transmitter and receiver.",
    "branch": "ECE / EC",
    "projectType": "Major",
    "technologies": [
      "Solar Panel",
      "Charge Controller",
      "Wireless Charging Module",
      "Battery Storage"
    ],
    "difficulty": "Advanced",
    "duration": "8–10 weeks",
    "originalCost": 11250,
    "discountedCost": 9000,
    "availability": "Available",
    "capacity": 10,
    "imageUrl": "/images/projects/4.webp",
    "isActive": true
  },
  {
    "id": "proj-ece-04",
    "title": "RFID Car Parking System",
    "description": "Automated smart parking solution using RC522 RFID technology, a servo motor barrier gate, and a 16x2 LCD display to track parking availability.",
    "branch": "ECE / EC",
    "projectType": "Minor",
    "technologies": [
      "RC522 RFID",
      "Arduino UNO",
      "Servo Motor",
      "16x2 LCD Display"
    ],
    "difficulty": "Intermediate",
    "duration": "4–5 weeks",
    "originalCost": 9500,
    "discountedCost": 7600,
    "availability": "Available",
    "capacity": 18,
    "imageUrl": "/images/projects/5.webp",
    "isActive": true
  },
  {
    "id": "proj-ece-05",
    "title": "Gas Leakage Detection System",
    "description": "Early safety detection system using an MQ-2 gas sensor to identify LPG, natural gas, or smoke, activating a buzzer, exhaust fan, and LCD alert.",
    "branch": "ECE / EC",
    "projectType": "Minor",
    "technologies": [
      "MQ-2 Gas Sensor",
      "Arduino UNO",
      "DC Fan",
      "Buzzer",
      "16x2 LCD"
    ],
    "difficulty": "Beginner",
    "duration": "3–4 weeks",
    "originalCost": 8750,
    "discountedCost": 7000,
    "availability": "Available",
    "capacity": 22,
    "imageUrl": "/images/projects/6.webp",
    "isActive": true
  },
  {
    "id": "proj-ece-06",
    "title": "Obstacle Avoiding Robot",
    "description": "Autonomous mobile robot equipped with ultrasonic sensors and L293D motor drivers to scan surroundings and change direction automatically.",
    "branch": "ECE / EC",
    "projectType": "Minor",
    "technologies": [
      "Arduino UNO/Nano",
      "HC-SR04 Ultrasonic",
      "L293D Driver",
      "DC Gear Motors"
    ],
    "difficulty": "Intermediate",
    "duration": "4–5 weeks",
    "originalCost": 9750,
    "discountedCost": 7800,
    "availability": "Available",
    "capacity": 15,
    "imageUrl": "/images/projects/7.webp",
    "isActive": true
  },
  {
    "id": "proj-ece-07",
    "title": "4 in 1 8x8 Matrix Digital Display",
    "description": "Custom programmable display featuring an ESP32 controller, 4x8x8 LED matrices with MAX7219 drivers, and a 3D-printed enclosure for scrolling text and clocks.",
    "branch": "ECE / EC",
    "projectType": "Major",
    "technologies": [
      "ESP32",
      "MAX7219",
      "8x8 LED Matrix",
      "3D Printed Enclosure"
    ],
    "difficulty": "Advanced",
    "duration": "6–8 weeks",
    "originalCost": 9000,
    "discountedCost": 7200,
    "availability": "Available",
    "capacity": 12,
    "imageUrl": "/images/projects/8.webp",
    "isActive": true
  },
  {
    "id": "proj-ece-08",
    "title": "RFID Door Lock System",
    "description": "Modern secure access control setup leveraging an RFID reader, Arduino, relay module, and a 12V electric door lock for automated unlocking.",
    "branch": "ECE / EC",
    "projectType": "Minor",
    "technologies": [
      "RC522 RFID",
      "Arduino UNO",
      "Relay Module",
      "Electric Door Lock"
    ],
    "difficulty": "Intermediate",
    "duration": "4–5 weeks",
    "originalCost": 9500,
    "discountedCost": 7600,
    "availability": "Available",
    "capacity": 18,
    "imageUrl": "/images/projects/9.webp",
    "isActive": true
  },
  {
    "id": "proj-ece-09",
    "title": "Line Following Robot",
    "description": "Precision automated guided vehicle using front-mounted IR line tracking sensors, an L298N motor driver, and differential drive to trace black lines.",
    "branch": "ECE / EC",
    "projectType": "Minor",
    "technologies": [
      "IR Line Sensors",
      "Arduino UNO",
      "L298N Motor Driver",
      "DC Motors"
    ],
    "difficulty": "Beginner",
    "duration": "3–4 weeks",
    "originalCost": 8250,
    "discountedCost": 6600,
    "availability": "Available",
    "capacity": 25,
    "imageUrl": "/images/projects/10.webp",
    "isActive": true
  },
  {
    "id": "proj-ece-10",
    "title": "Smart Dustbin",
    "description": "Hands-free automated waste container featuring an ultrasonic sensor for proximity object detection with a servo motor lid opening mechanism or status display.",
    "branch": "ECE / EC",
    "projectType": "Minor",
    "technologies": [
      "HC-SR04 Sensor",
      "Arduino UNO",
      "Servo Motor",
      "16x2 LCD Display"
    ],
    "difficulty": "Beginner",
    "duration": "2–3 weeks",
    "originalCost": 7250,
    "discountedCost": 5800,
    "availability": "Available",
    "capacity": 30,
    "imageUrl": "/images/projects/11.webp",
    "isActive": true
  },
  {
    "id": "proj-ece-11",
    "title": "Temperature & Humidity Monitoring",
    "description": "Real-time environmental monitoring system utilizing a DHT11 sensor and Arduino to display accurate ambient data on an I2C LCD screen.",
    "branch": "ECE / EC",
    "projectType": "Minor",
    "technologies": [
      "DHT11 Sensor",
      "Arduino UNO",
      "16x2 LCD Display"
    ],
    "difficulty": "Beginner",
    "duration": "3–4 weeks",
    "originalCost": 8750,
    "discountedCost": 7000,
    "availability": "Available",
    "capacity": 22,
    "imageUrl": "/images/projects/12.webp",
    "isActive": true
  },
  {
    "id": "proj-ece-12",
    "title": "Automatic Fan Control System",
    "description": "Smart thermal regulation model that triggers a cooling fan automatically via an NPN/MOSFET transistor when the DHT11 temperature crosses a preset limit.",
    "branch": "ECE / EC",
    "projectType": "Minor",
    "technologies": [
      "DHT11 Sensor",
      "Arduino UNO",
      "MOSFET/Transistor",
      "DC Fan"
    ],
    "difficulty": "Beginner",
    "duration": "3–4 weeks",
    "originalCost": 8500,
    "discountedCost": 6800,
    "availability": "Available",
    "capacity": 20,
    "imageUrl": "/images/projects/13.webp",
    "isActive": true
  },
  {
    "id": "proj-ece-13",
    "title": "Solar EV Car Using ESP32",
    "description": "Solar-powered electric vehicle prototype featuring a photovoltaic panel, charge controller, Li-ion battery, and wireless mobile/web control via ESP32 Wi-Fi.",
    "branch": "ECE / EC",
    "projectType": "Major",
    "technologies": [
      "ESP32",
      "Solar Panel",
      "L298N Driver",
      "Li-ion Battery"
    ],
    "difficulty": "Advanced",
    "duration": "8–10 weeks",
    "originalCost": 11250,
    "discountedCost": 9000,
    "availability": "Available",
    "capacity": 10,
    "imageUrl": "/images/projects/14.webp",
    "isActive": true
  },
  {
    "id": "proj-ece-14",
    "title": "Solar Tracking System",
    "description": "Active dual-axis solar positioning system using dual LDR light sensors and servo motors to track maximum sunlight intensity for enhanced efficiency.",
    "branch": "ECE / EC",
    "projectType": "Major",
    "technologies": [
      "LDR Sensors",
      "Arduino UNO",
      "Servo Motors",
      "Solar Panel"
    ],
    "difficulty": "Intermediate",
    "duration": "6–8 weeks",
    "originalCost": 8500,
    "discountedCost": 6800,
    "availability": "Available",
    "capacity": 12,
    "imageUrl": "/images/projects/15.webp",
    "isActive": true
  },
  {
    "id": "proj-ece-15",
    "title": "Smart Irrigation System",
    "description": "Automated agricultural watering system that monitors soil moisture levels and triggers a water pump through a relay module when irrigation is required.",
    "branch": "ECE / EC",
    "projectType": "Major",
    "technologies": [
      "Soil Moisture Sensor",
      "Arduino UNO",
      "Relay Module",
      "Water Pump"
    ],
    "difficulty": "Intermediate",
    "duration": "6–8 weeks",
    "originalCost": 9500,
    "discountedCost": 7600,
    "availability": "Available",
    "capacity": 15,
    "imageUrl": "/images/projects/16.webp",
    "isActive": true
  },
  {
    "id": "proj-ece-16",
    "title": "Solar Tree Power Generator",
    "description": "Biomimetic clean energy station using mini solar panels, an MPPT charge controller, battery storage, and a real-time digital voltmeter display.",
    "branch": "ECE / EC",
    "projectType": "Major",
    "technologies": [
      "Solar Panels",
      "MPPT Charge Controller",
      "Battery Storage",
      "Voltmeter"
    ],
    "difficulty": "Intermediate",
    "duration": "6–8 weeks",
    "originalCost": 8250,
    "discountedCost": 6600,
    "availability": "Available",
    "capacity": 14,
    "imageUrl": "/images/projects/17.webp",
    "isActive": true
  },
  {
    "id": "proj-ece-17",
    "title": "Alcohol Detector with Engine Locking System",
    "description": "Vehicle safety prototype using an MQ-3 alcohol sensor to detect driver intoxication, triggering a buzzer and locking engine ignition via a relay module.",
    "branch": "ECE / EC",
    "projectType": "Major",
    "technologies": [
      "MQ-3 Sensor",
      "Arduino UNO",
      "5V Relay Module",
      "DC Motor (Engine)"
    ],
    "difficulty": "Intermediate",
    "duration": "5–6 weeks",
    "originalCost": 9200,
    "discountedCost": 7400,
    "availability": "Available",
    "capacity": 15,
    "imageUrl": "/images/projects/18.webp",
    "isActive": true
  },
  {
    "id": "proj-ece-18",
    "title": "Laser Security System",
    "description": "Perimeter protection alarm system that detects beam interruptions between a 5V laser module and a photodiode receiver to trigger indicators and a buzzer.",
    "branch": "ECE / EC",
    "projectType": "Minor",
    "technologies": [
      "Laser Module",
      "Photodiode Module",
      "Arduino UNO",
      "Buzzer"
    ],
    "difficulty": "Beginner",
    "duration": "3–4 weeks",
    "originalCost": 7800,
    "discountedCost": 6200,
    "availability": "Available",
    "capacity": 20,
    "imageUrl": "/images/projects/19.webp",
    "isActive": true
  },
  {
    "id": "proj-ece-19",
    "title": "Smart Blind Stick with Vibrators",
    "description": "Assistive mobility aid for the visually impaired using an Arduino Nano and ultrasonic sensors to detect obstacles and provide directional haptic vibration feedback.",
    "branch": "ECE / EC",
    "projectType": "Minor",
    "technologies": [
      "Arduino Nano",
      "Ultrasonic Sensor",
      "Vibrator Motors",
      "Portable Battery"
    ],
    "difficulty": "Beginner",
    "duration": "3–4 weeks",
    "originalCost": 8000,
    "discountedCost": 6400,
    "availability": "Available",
    "capacity": 20,
    "imageUrl": "/images/projects/20.webp",
    "isActive": true
  },
  {
    "id": "proj-ece-20",
    "title": "Light Following Robot",
    "description": "Autonomous differential-drive robot prototype programmed to navigate and track light sources using dual LDR sensors and an L298N motor driver.",
    "branch": "ECE / EC",
    "projectType": "Minor",
    "technologies": [
      "LDR Sensors",
      "Arduino UNO",
      "L298N Driver",
      "DC Gear Motors"
    ],
    "difficulty": "Beginner",
    "duration": "3–4 weeks",
    "originalCost": 8250,
    "discountedCost": 6600,
    "availability": "Available",
    "capacity": 20,
    "imageUrl": "/images/projects/21.webp",
    "isActive": true
  },
  {
    "id": "proj-cse-01",
    "title": "IoT-Based 4 Channel Home Automation",
    "description": "Smart home system powered by an ESP32 and a 4-channel relay module enabling remote appliance control via a mobile app or web interface over Wi-Fi.",
    "branch": "CSE / IT",
    "projectType": "Minor",
    "technologies": [
      "ESP32",
      "4-Channel Relay",
      "Mobile App (Blynk)",
      "Wi-Fi Module"
    ],
    "difficulty": "Intermediate",
    "duration": "4–6 weeks",
    "originalCost": 8900,
    "discountedCost": 7100,
    "availability": "Available",
    "capacity": 25,
    "imageUrl": "/images/projects/22.webp",
    "isActive": true
  },
  {
    "id": "proj-ece-21",
    "title": "Solar Bus Project",
    "description": "Model transport prototype demonstrating solar-powered green mobility using a photovoltaic panel, charge controller, rechargeable battery, and LED headlights.",
    "branch": "ECE / EC",
    "projectType": "Minor",
    "technologies": [
      "Solar Panel",
      "3.7V Battery",
      "L298N Driver",
      "DC Motor"
    ],
    "difficulty": "Beginner",
    "duration": "3–4 weeks",
    "originalCost": 8400,
    "discountedCost": 6700,
    "availability": "Available",
    "capacity": 18,
    "imageUrl": "/images/projects/23.webp",
    "isActive": true
  },
  {
    "id": "proj-ece-22",
    "title": "Home Bulb / LED Light Automation",
    "description": "Energy-saving automated lighting system controlled by an ESP32 module combined with LDR light sensors or PIR motion detection inputs.",
    "branch": "ECE / EC",
    "projectType": "Minor",
    "technologies": [
      "ESP32",
      "1-Channel Relay",
      "LDR / PIR Sensor",
      "AC Bulb Holder"
    ],
    "difficulty": "Beginner",
    "duration": "3–4 weeks",
    "originalCost": 7500,
    "discountedCost": 6000,
    "availability": "Available",
    "capacity": 22,
    "imageUrl": "/images/projects/24.webp",
    "isActive": true
  },
  {
    "id": "proj-ece-23",
    "title": "Smart Tunnel Monitoring System",
    "description": "IoT-ready environmental safety setup tracking tunnel conditions via temperature/humidity sensors, gas detectors, LDR lighting control, and obstacle detection.",
    "branch": "ECE / EC",
    "projectType": "Major",
    "technologies": [
      "Arduino UNO",
      "DHT11",
      "MQ-2 Sensor",
      "HC-SR04",
      "LCD 16x2"
    ],
    "difficulty": "Advanced",
    "duration": "7–9 weeks",
    "originalCost": 10500,
    "discountedCost": 8400,
    "availability": "Available",
    "capacity": 12,
    "imageUrl": "/images/projects/25.webp",
    "isActive": true
  },
  {
    "id": "proj-ece-24",
    "title": "Automatic Escalator Using IR Sensor",
    "description": "Sensor-driven public infrastructure automation model that starts a motorized escalator forward when a person is detected and stops when empty.",
    "branch": "ECE / EC",
    "projectType": "Minor",
    "technologies": [
      "Arduino UNO",
      "IR Sensor Module",
      "L298N Driver",
      "DC Gear Motor"
    ],
    "difficulty": "Beginner",
    "duration": "3–4 weeks",
    "originalCost": 8500,
    "discountedCost": 6800,
    "availability": "Available",
    "capacity": 20,
    "imageUrl": "/images/projects/26.webp",
    "isActive": true
  },
  {
    "id": "proj-ece-25",
    "title": "Waste to Electricity Generator",
    "description": "Sustainable clean energy generation project converting thermal energy from a waste burner chamber into electricity via a turbine and DC generator system.",
    "branch": "ECE / EC",
    "projectType": "Major",
    "technologies": [
      "Burner Chamber",
      "Turbine DC Generator",
      "Power Inverter",
      "Control Circuit"
    ],
    "difficulty": "Advanced",
    "duration": "8–10 weeks",
    "originalCost": 12000,
    "discountedCost": 9600,
    "availability": "Available",
    "capacity": 8,
    "imageUrl": "/images/projects/27.webp",
    "isActive": true
  },
  {
    "id": "proj-cse-02",
    "title": "AI Resume & ATS Screening System",
    "description": "Natural language processing platform analyzing candidate resumes against job descriptions, outputting match scores and keyword optimization suggestions.",
    "branch": "CSE / IT",
    "projectType": "Major",
    "technologies": [
      "Python",
      "FastAPI",
      "spaCy NLP",
      "React",
      "Tailwind CSS"
    ],
    "difficulty": "Advanced",
    "duration": "8–10 weeks",
    "originalCost": 10500,
    "discountedCost": 8400,
    "availability": "Available",
    "capacity": 15,
    "imageUrl": "",
    "isActive": true
  }
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
  { id: 'course-01', title: 'Data Analytics', focusArea: 'Excel, SQL, data analysis, dashboards, business analytics', studentOutcome: 'Job-ready analytics foundation', description: 'Master practical data analytics from raw data processing to executive dashboard creation. Learn advanced Excel formulas, relational database querying with SQL, and business reporting metrics.', technologies: ['Excel', 'SQL', 'Data Analytics', 'Dashboards', 'Business Analytics'], duration: '6–8 weeks', level: 'Beginner', category: 'Data & Analytics', originalCost: 7250, discountedCost: 5800, instructor: 'Dr. Rajesh Sharma (Senior Data Strategist)', imageUrl: '', isActive: true },
  { id: 'course-02', title: 'Backend Development', focusArea: 'Python / backend fundamentals, APIs, databases, deployment basics', studentOutcome: 'Build APIs and backend applications', description: 'Learn scalable server-side programming using Python and modern web frameworks. Construct RESTful APIs, interface with relational SQL & NoSQL databases, and deploy cloud applications.', technologies: ['Python', 'FastAPI', 'REST APIs', 'PostgreSQL', 'Cloud Deployment'], duration: '8–10 weeks', level: 'Intermediate', category: 'Software Engineering', originalCost: 8500, discountedCost: 6800, instructor: 'Neha Gupta (Lead Backend Architect)', imageUrl: '', isActive: true },
  { id: 'course-03', title: 'Frontend Development', focusArea: 'HTML, CSS, JavaScript and modern frontend fundamentals', studentOutcome: 'Build responsive web interfaces', description: 'Build interactive user experiences using HTML5, modern CSS3 styling, JavaScript ES6+, and React component architecture. Master mobile-responsive UI patterns and component state design.', technologies: ['HTML5', 'CSS3', 'JavaScript ES6+', 'React', 'Tailwind CSS'], duration: '6–8 weeks', level: 'Beginner', category: 'Software Engineering', originalCost: 8000, discountedCost: 6400, instructor: 'Ankit Verma (Frontend UI Specialist)', imageUrl: '', isActive: true },
  { id: 'course-04', title: 'Advanced Excel', focusArea: 'Formulas, Pivot Tables, dashboards, data cleaning and reporting', studentOutcome: 'Workplace-ready reporting skills', description: 'Comprehensive practical training on advanced spreadsheet capabilities including nested lookup functions, dynamic array formulas, PivotTable data modeling, and automated report generation.', technologies: ['Excel Formulas', 'Pivot Tables', 'Data Cleaning', 'VLOOKUP / XLOOKUP', 'Reporting'], duration: '4 weeks', level: 'Beginner', category: 'Business & Office Productivity', originalCost: 4750, discountedCost: 3800, instructor: 'Priya Nair (Corporate Excel Consultant)', imageUrl: '', isActive: true },
  { id: 'course-05', title: 'MATLAB for Engineers', focusArea: 'Programming, numerical computing, simulations and engineering applications', studentOutcome: 'Engineering / technical computing skills', description: 'Hands-on numerical computing and engineering simulation course tailored for ECE, EEE, Mechanical, and Civil engineering students using MATLAB and Simulink packages.', technologies: ['MATLAB', 'Simulink', 'Numerical Computing', 'Signal Processing', 'Simulations'], duration: '6 weeks', level: 'Intermediate', category: 'Core Engineering', originalCost: 7750, discountedCost: 6200, instructor: 'Prof. Vikramaditya Rao (Control Systems Expert)', imageUrl: '', isActive: true },
  { id: 'course-06', title: 'Microsoft Dynamics 365', focusArea: 'CRM / ERP fundamentals and practical platform exposure', studentOutcome: 'Enterprise business application exposure', description: 'Gain enterprise-level exposure to Microsoft Dynamics 365 CRM & ERP platform architecture, business process management, customer data pipelines, and enterprise application workflows.', technologies: ['Microsoft Dynamics 365', 'CRM Fundamentals', 'ERP Basics', 'Power Platform', 'Enterprise Workflows'], duration: '6 weeks', level: 'Intermediate', category: 'Enterprise Solutions', originalCost: 9500, discountedCost: 7600, instructor: 'Siddharth Patel (Certified Dynamics 365 Architect)', imageUrl: '', isActive: true },
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
