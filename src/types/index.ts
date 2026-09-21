export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export type Branch = 
  | 'CSE / IT'
  | 'ECE / EC'
  | 'Electrical / EEE'
  | 'Mechanical'
  | 'Civil'
  | 'Other';

export type ProjectType = 'Minor' | 'Major';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type Availability = 'Available' | 'Limited' | 'Booked';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type JobType = 'Internship' | 'Full-time' | 'Part-time';

export type EnrollmentStatus = 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Student {
  student_id: string;
  google_id: string;
  email: string;
  name: string;
  mobile: string;
  location: string;
  gender: Gender | string;
  college: string;
  branch: Branch | string;
  year: string;
  semester: string;
  profile_image: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  project_id: string;
  title: string;
  description: string;
  branch: Branch | string;
  project_type: ProjectType;
  technologies: string[];
  difficulty: Difficulty;
  duration: string;
  cost: number;
  availability: Availability;
  capacity: number;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectBooking {
  booking_id: string;
  student_id: string;
  project_id: string;
  status: BookingStatus;
  booked_at: string;
  updated_at: string;
  project?: Project;
}

export interface Job {
  job_id: string;
  company: string;
  role: string;
  job_type: JobType;
  description: string;
  eligibility: string;
  location: string;
  skills: string[];
  experience: string;
  deadline: string;
  apply_url: string;
  company_logo?: string;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  application_id: string;
  student_id: string;
  job_id: string;
  status: string;
  applied_at: string;
}

export interface Course {
  course_id: string;
  title: string;
  focus_area: string;
  student_outcome: string;
  description: string;
  technologies: string[];
  duration: string;
  level: Difficulty;
  category: string;
  cost: number;
  instructor?: string;
  created_at: string;
  updated_at: string;
}

export interface CourseEnrollment {
  enrollment_id: string;
  student_id: string;
  course_id: string;
  status: EnrollmentStatus;
  enrolled_at: string;
  updated_at: string;
  course?: Course;
}

export interface GoogleAuthUser {
  google_id: string;
  email: string;
  name: string;
  picture: string;
}

export interface RegistrationFormData {
  name: string;
  mobile: string;
  location: string;
  gender: string;
  college: string;
  branch: string;
  year: string;
  semester: string;
}
