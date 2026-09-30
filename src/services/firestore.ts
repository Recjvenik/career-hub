import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
  QueryConstraint,
  collectionGroup,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Student, Project, ProjectBooking, Job, Course, CourseEnrollment } from '../types';
import { INITIAL_PROJECTS } from '../data/mockProjects';
import { INITIAL_JOBS } from '../data/mockJobs';
import { INITIAL_COURSES } from '../data/mockCourses';

// ---------------------------------------------------------------------------
// Helper: Convert Firestore Timestamp fields to ISO strings for our types
// ---------------------------------------------------------------------------
function tsToStr(val: unknown): string {
  if (!val) return new Date().toISOString();
  if (val instanceof Timestamp) return val.toDate().toISOString();
  if (typeof val === 'string') return val;
  return new Date().toISOString();
}

// ---------------------------------------------------------------------------
// USERS / STUDENTS
// ---------------------------------------------------------------------------

/** Map a Firestore /users/{uid} document into our Student type */
function docToStudent(uid: string, data: Record<string, unknown>): Student {
  const profile = (data.profile as Record<string, unknown>) || {};
  return {
    student_id: uid,
    google_id: uid,
    email: (data.email as string) || '',
    name: (data.displayName as string) || '',
    mobile: (profile.mobile as string) || '',
    location: (profile.location as string) || '',
    gender: (profile.gender as string) || 'Male',
    college: (profile.college as string) || '',
    branch: (profile.branch as string) || 'CSE / IT',
    year: (profile.year as string) || '1st Year',
    semester: (profile.semester as string) || 'Semester 1',
    profile_image: (data.photoURL as string) || '',
    role: (data.role as 'admin' | 'user') || 'user',
    created_at: tsToStr(data.createdAt),
    updated_at: tsToStr(data.updatedAt),
  };
}

export const FirestoreService = {
  // -------------------------------------------------------------------------
  // Students
  // -------------------------------------------------------------------------
  getAllUsers: async (): Promise<Student[]> => {
    try {
      const snap = await getDocs(collection(db, 'users'));
      return snap.docs.map((d) => docToStudent(d.id, d.data() as Record<string, unknown>));
    } catch (err) {
      console.error('Firestore getAllUsers error:', err);
      return [];
    }
  },

  getStudentByGoogleId: async (googleId: string): Promise<Student | null> => {
    try {
      const snap = await getDoc(doc(db, 'users', googleId));
      if (!snap.exists()) return null;
      return docToStudent(snap.id, snap.data() as Record<string, unknown>);
    } catch (err) {
      console.error('Firestore getStudentByGoogleId error:', err);
      return null;
    }
  },

  getStudentById: async (studentId: string): Promise<Student | null> => {
    // student_id == google_id == Firebase Auth UID in our schema
    return FirestoreService.getStudentByGoogleId(studentId);
  },

  saveStudent: async (studentData: Partial<Student>): Promise<Student> => {
    const uid = studentData.google_id || studentData.student_id;
    if (!uid) throw new Error('saveStudent: google_id is required');

    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    const now = serverTimestamp();

    const profilePayload = {
      mobile: studentData.mobile ?? '',
      location: studentData.location ?? '',
      gender: studentData.gender ?? 'Male',
      college: studentData.college ?? '',
      branch: studentData.branch ?? 'CSE / IT',
      year: studentData.year ?? '1st Year',
      semester: studentData.semester ?? 'Semester 1',
    };

    if (snap.exists()) {
      await updateDoc(userRef, {
        displayName: studentData.name ?? snap.data().displayName,
        photoURL: studentData.profile_image ?? snap.data().photoURL,
        profile: profilePayload,
        isProfileComplete: true,
        updatedAt: now,
      });
    } else {
      await setDoc(userRef, {
        uid,
        email: studentData.email ?? '',
        displayName: studentData.name ?? '',
        photoURL: studentData.profile_image ?? '',
        profile: profilePayload,
        isProfileComplete: Boolean(studentData.college),
        createdAt: now,
        updatedAt: now,
      });
    }

    const updated = await getDoc(userRef);
    return docToStudent(uid, updated.data() as Record<string, unknown>);
  },

  createUserIfNotExists: async (uid: string, email: string, displayName: string, photoURL: string): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid,
        email,
        displayName,
        photoURL,
        role: 'user',
        profile: null,
        isProfileComplete: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  },

  setAdminStatus: async (studentId: string, isAdmin: boolean): Promise<void> => {
    const userRef = doc(db, 'users', studentId);
    await updateDoc(userRef, {
      role: isAdmin ? 'admin' : 'user',
      updatedAt: serverTimestamp(),
    });
  },

  // -------------------------------------------------------------------------
  // Projects
  // -------------------------------------------------------------------------
  createProject: async (projectData: Partial<Project>): Promise<Project> => {
    const projectRef = collection(db, 'projects');
    const newDoc = await addDoc(projectRef, {
      title: projectData.title ?? '',
      description: projectData.description ?? '',
      branch: projectData.branch ?? '',
      projectType: projectData.project_type ?? 'Minor',
      technologies: projectData.technologies ?? [],
      difficulty: projectData.difficulty ?? 'Intermediate',
      duration: projectData.duration ?? '',
      originalCost: projectData.original_cost ?? 0,
      discountedCost: projectData.discounted_cost ?? 0,
      availability: projectData.availability ?? 'Available',
      capacity: projectData.capacity ?? 0,
      imageUrl: projectData.image ?? '',
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    const snap = await getDoc(newDoc);
    const data = snap.data()!;
    return {
      project_id: newDoc.id,
      title: data.title,
      description: data.description,
      branch: data.branch,
      project_type: data.projectType,
      technologies: data.technologies,
      difficulty: data.difficulty,
      duration: data.duration,
      original_cost: data.originalCost,
      discounted_cost: data.discountedCost,
      availability: data.availability,
      capacity: data.capacity,
      image: data.imageUrl,
      created_at: tsToStr(data.createdAt),
      updated_at: tsToStr(data.updatedAt),
    } as Project;
  },

  updateProject: async (projectId: string, projectData: Partial<Project>): Promise<void> => {
    const projectRef = doc(db, 'projects', projectId);
    const updatePayload: Record<string, any> = { updatedAt: serverTimestamp() };
    
    if (projectData.title !== undefined) updatePayload.title = projectData.title;
    if (projectData.description !== undefined) updatePayload.description = projectData.description;
    if (projectData.branch !== undefined) updatePayload.branch = projectData.branch;
    if (projectData.project_type !== undefined) updatePayload.projectType = projectData.project_type;
    if (projectData.technologies !== undefined) updatePayload.technologies = projectData.technologies;
    if (projectData.difficulty !== undefined) updatePayload.difficulty = projectData.difficulty;
    if (projectData.duration !== undefined) updatePayload.duration = projectData.duration;
    if (projectData.original_cost !== undefined) updatePayload.originalCost = projectData.original_cost;
    if (projectData.discounted_cost !== undefined) updatePayload.discountedCost = projectData.discounted_cost;
    if (projectData.availability !== undefined) updatePayload.availability = projectData.availability;
    if (projectData.capacity !== undefined) updatePayload.capacity = projectData.capacity;
    if (projectData.image !== undefined) updatePayload.imageUrl = projectData.image;

    await updateDoc(projectRef, updatePayload);
  },

  deleteProject: async (projectId: string): Promise<void> => {
    // Soft delete
    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, { isActive: false, updatedAt: serverTimestamp() });
  },

  getProjects: async (filters?: { branch?: string; type?: string; search?: string }): Promise<Project[]> => {
    try {
      const constraints: QueryConstraint[] = [where('isActive', '==', true)];

      if (filters?.branch && filters.branch !== 'All') {
        constraints.push(where('branch', '==', filters.branch));
      }
      if (filters?.type && filters.type !== 'All') {
        constraints.push(where('projectType', '==', filters.type));
      }

      const q = query(collection(db, 'projects'), ...constraints);
      const snap = await getDocs(q);

      let projects: Project[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          project_id: d.id,
          title: data.title ?? '',
          description: data.description ?? '',
          branch: data.branch ?? '',
          project_type: data.projectType ?? 'Minor',
          technologies: data.technologies ?? [],
          difficulty: data.difficulty ?? 'Intermediate',
          duration: data.duration ?? '',
          original_cost: data.originalCost ?? (data.cost ? data.cost * 2.5 : 0),
          discounted_cost: data.discountedCost ?? (data.cost ? data.cost * 2.5 * 0.8 : 0),
          availability: data.availability ?? 'Available',
          capacity: data.capacity ?? 0,
          image: data.imageUrl ?? '',
          created_at: tsToStr(data.createdAt),
          updated_at: tsToStr(data.updatedAt),
        } as Project;
      });

      // Client-side text search (Firestore doesn't support LIKE queries)
      if (filters?.search) {
        const q2 = filters.search.toLowerCase();
        projects = projects.filter(
          (p) =>
            p.title.toLowerCase().includes(q2) ||
            p.description.toLowerCase().includes(q2) ||
            p.technologies.some((t) => t.toLowerCase().includes(q2))
        );
      }

      return projects.length > 0 ? projects : INITIAL_PROJECTS;
    } catch (err) {
      console.error('Firestore getProjects error:', err);
      return INITIAL_PROJECTS;
    }
  },

  getProjectById: async (id: string): Promise<Project | null> => {
    try {
      const snap = await getDoc(doc(db, 'projects', id));
      if (!snap.exists()) return null;
      const data = snap.data();
      return {
        project_id: snap.id,
        title: data.title ?? '',
        description: data.description ?? '',
        branch: data.branch ?? '',
        project_type: data.projectType ?? 'Minor',
        technologies: data.technologies ?? [],
        difficulty: data.difficulty ?? 'Intermediate',
        duration: data.duration ?? '',
        original_cost: data.originalCost ?? (data.cost ? data.cost * 2.5 : 0),
        discounted_cost: data.discountedCost ?? (data.cost ? data.cost * 2.5 * 0.8 : 0),
        availability: data.availability ?? 'Available',
        capacity: data.capacity ?? 0,
        image: data.imageUrl ?? '',
        created_at: tsToStr(data.createdAt),
        updated_at: tsToStr(data.updatedAt),
      } as Project;
    } catch (err) {
      console.error('Firestore getProjectById error:', err);
      return null;
    }
  },

  // -------------------------------------------------------------------------
  // Project Bookings (subcollection: /users/{uid}/bookings)
  // -------------------------------------------------------------------------
  createBooking: async (studentId: string, projectId: string): Promise<ProjectBooking> => {
    const bookingsRef = collection(db, 'users', studentId, 'bookings');

    // Duplicate check
    const existing = await getDocs(
      query(bookingsRef, where('projectId', '==', projectId), where('status', '!=', 'CANCELLED'))
    );
    if (!existing.empty) {
      const d = existing.docs[0];
      const data = d.data();
      return {
        booking_id: d.id,
        student_id: studentId,
        project_id: projectId,
        status: data.status,
        booked_at: tsToStr(data.bookedAt),
        updated_at: tsToStr(data.updatedAt),
      };
    }

    // Fetch project for denormalization
    const project = await FirestoreService.getProjectById(projectId);

    const newDoc = await addDoc(bookingsRef, {
      projectId,
      projectTitle: project?.title ?? '',
      projectBranch: project?.branch ?? '',
      projectType: project?.project_type ?? '',
      projectCost: project?.discounted_cost ?? 0,
      status: 'PENDING',
      bookedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      booking_id: newDoc.id,
      student_id: studentId,
      project_id: projectId,
      status: 'PENDING',
      booked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      project: project ?? undefined,
    };
  },

  getBookingsByStudentId: async (studentId: string): Promise<(ProjectBooking & { project?: Project })[]> => {
    try {
      const bookingsRef = collection(db, 'users', studentId, 'bookings');
      const snap = await getDocs(query(bookingsRef, orderBy('bookedAt', 'desc')));

      return Promise.all(
        snap.docs.map(async (d) => {
          const data = d.data();
          const project = await FirestoreService.getProjectById(data.projectId);
          return {
            booking_id: d.id,
            student_id: studentId,
            project_id: data.projectId,
            status: data.status,
            booked_at: tsToStr(data.bookedAt),
            updated_at: tsToStr(data.updatedAt),
            project: project ?? undefined,
          } as ProjectBooking & { project?: Project };
        })
      );
    } catch (err) {
      console.error('Firestore getBookingsByStudentId error:', err);
      return [];
    }
  },

  getAllBookingsWithStudents: async (): Promise<any[]> => {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      
      // Fetch bookings for each user individually to avoid requiring a Collection Group Index
      const allBookingsPromises = usersSnap.docs.map(async (userDoc) => {
        const student = docToStudent(userDoc.id, userDoc.data());
        const bookingsRef = collection(db, 'users', userDoc.id, 'bookings');
        const bookingsSnap = await getDocs(bookingsRef);
        
        return bookingsSnap.docs.map(d => {
          const data = d.data();
          return {
            booking_id: d.id,
            student_id: userDoc.id,
            student_name: student?.name || 'Unknown',
            student_mobile: student?.mobile || 'N/A',
            project_id: data.projectId,
            project_title: data.projectTitle,
            status: data.status,
            booked_at: tsToStr(data.bookedAt),
          };
        });
      });

      const allBookingsArrays = await Promise.all(allBookingsPromises);
      // Flatten the array of arrays
      const flatBookings = allBookingsArrays.flat();
      
      return flatBookings.sort((a, b) => new Date(b.booked_at).getTime() - new Date(a.booked_at).getTime());
    } catch (err) {
      console.error('Error fetching all bookings:', err);
      return [];
    }
  },

  // -------------------------------------------------------------------------
  // Jobs
  // -------------------------------------------------------------------------
  createJob: async (jobData: Partial<Job>): Promise<Job> => {
    const jobRef = collection(db, 'jobs');
    const newDoc = await addDoc(jobRef, {
      company: jobData.company ?? '',
      role: jobData.role ?? '',
      jobType: jobData.job_type ?? 'Internship',
      description: jobData.description ?? '',
      eligibilityBranches: jobData.eligibility ? jobData.eligibility.split('·').map(s => s.trim()) : [],
      location: jobData.location ?? '',
      skills: jobData.skills ?? [],
      experience: jobData.experience ?? 'Fresher',
      deadline: jobData.deadline ? new Date(jobData.deadline) : null,
      applyUrl: jobData.apply_url ?? '#',
      companyLogo: jobData.company_logo ?? '',
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    const snap = await getDoc(newDoc);
    const data = snap.data()!;
    return {
      job_id: newDoc.id,
      company: data.company,
      role: data.role,
      job_type: data.jobType,
      description: data.description,
      eligibility: (data.eligibilityBranches ?? []).join(' · '),
      location: data.location,
      skills: data.skills,
      experience: data.experience,
      deadline: data.deadline ? data.deadline.toDate().toISOString().split('T')[0] : '',
      apply_url: data.applyUrl,
      company_logo: data.companyLogo,
      created_at: tsToStr(data.createdAt),
      updated_at: tsToStr(data.updatedAt),
    } as Job;
  },

  updateJob: async (jobId: string, jobData: Partial<Job>): Promise<void> => {
    const jobRef = doc(db, 'jobs', jobId);
    const updatePayload: Record<string, any> = { updatedAt: serverTimestamp() };
    
    if (jobData.company !== undefined) updatePayload.company = jobData.company;
    if (jobData.role !== undefined) updatePayload.role = jobData.role;
    if (jobData.job_type !== undefined) updatePayload.jobType = jobData.job_type;
    if (jobData.description !== undefined) updatePayload.description = jobData.description;
    if (jobData.eligibility !== undefined) updatePayload.eligibilityBranches = jobData.eligibility.split('·').map(s => s.trim());
    if (jobData.location !== undefined) updatePayload.location = jobData.location;
    if (jobData.skills !== undefined) updatePayload.skills = jobData.skills;
    if (jobData.experience !== undefined) updatePayload.experience = jobData.experience;
    if (jobData.deadline !== undefined) updatePayload.deadline = jobData.deadline ? new Date(jobData.deadline) : null;
    if (jobData.apply_url !== undefined) updatePayload.applyUrl = jobData.apply_url;
    if (jobData.company_logo !== undefined) updatePayload.companyLogo = jobData.company_logo;

    await updateDoc(jobRef, updatePayload);
  },

  deleteJob: async (jobId: string): Promise<void> => {
    // Soft delete
    const jobRef = doc(db, 'jobs', jobId);
    await updateDoc(jobRef, { isActive: false, updatedAt: serverTimestamp() });
  },

  getJobs: async (filters?: { branch?: string; job_type?: string; search?: string }): Promise<Job[]> => {
    try {
      const constraints: QueryConstraint[] = [where('isActive', '==', true)];

      if (filters?.job_type && filters.job_type !== 'All') {
        constraints.push(where('jobType', '==', filters.job_type));
      }
      if (filters?.branch && filters.branch !== 'All') {
        constraints.push(where('eligibilityBranches', 'array-contains', filters.branch));
      }

      const q = query(collection(db, 'jobs'), ...constraints);
      const snap = await getDocs(q);

      let jobs: Job[] = snap.docs.map((d) => {
        const data = d.data();
        const deadline = data.deadline instanceof Timestamp
          ? data.deadline.toDate().toISOString().split('T')[0]
          : (data.deadline ?? '');
        return {
          job_id: d.id,
          company: data.company ?? '',
          role: data.role ?? '',
          job_type: data.jobType ?? 'Internship',
          description: data.description ?? '',
          eligibility: (data.eligibilityBranches ?? []).join(' · '),
          location: data.location ?? '',
          skills: data.skills ?? [],
          experience: data.experience ?? 'Fresher',
          deadline,
          apply_url: data.applyUrl ?? '#',
          company_logo: data.companyLogo ?? '',
          created_at: tsToStr(data.createdAt),
          updated_at: tsToStr(data.updatedAt),
        } as Job;
      });

      if (filters?.search) {
        const q2 = filters.search.toLowerCase();
        jobs = jobs.filter(
          (j) =>
            j.company.toLowerCase().includes(q2) ||
            j.role.toLowerCase().includes(q2) ||
            j.skills.some((s) => s.toLowerCase().includes(q2))
        );
      }

      return jobs.length > 0 ? jobs : INITIAL_JOBS;
    } catch (err) {
      console.error('Firestore getJobs error:', err);
      return INITIAL_JOBS;
    }
  },

  getJobById: async (id: string): Promise<Job | null> => {
    try {
      const snap = await getDoc(doc(db, 'jobs', id));
      if (!snap.exists()) return null;
      const data = snap.data();
      const deadline = data.deadline instanceof Timestamp
        ? data.deadline.toDate().toISOString().split('T')[0]
        : (data.deadline ?? '');
      return {
        job_id: snap.id,
        company: data.company ?? '',
        role: data.role ?? '',
        job_type: data.jobType ?? 'Internship',
        description: data.description ?? '',
        eligibility: (data.eligibilityBranches ?? []).join(' · '),
        location: data.location ?? '',
        skills: data.skills ?? [],
        experience: data.experience ?? 'Fresher',
        deadline,
        apply_url: data.applyUrl ?? '#',
        company_logo: data.companyLogo ?? '',
        created_at: tsToStr(data.createdAt),
        updated_at: tsToStr(data.updatedAt),
      } as Job;
    } catch (err) {
      console.error('Firestore getJobById error:', err);
      return null;
    }
  },

  // -------------------------------------------------------------------------
  // Courses
  // -------------------------------------------------------------------------
  createCourse: async (courseData: Partial<Course>): Promise<Course> => {
    const courseRef = collection(db, 'courses');
    const newDoc = await addDoc(courseRef, {
      title: courseData.title ?? '',
      focusArea: courseData.focus_area ?? '',
      studentOutcome: courseData.student_outcome ?? '',
      description: courseData.description ?? '',
      technologies: courseData.technologies ?? [],
      duration: courseData.duration ?? '',
      level: courseData.level ?? 'Intermediate',
      category: courseData.category ?? '',
      cost: courseData.cost ?? 0,
      instructor: courseData.instructor ?? '',
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    const snap = await getDoc(newDoc);
    const data = snap.data()!;
    return {
      course_id: newDoc.id,
      title: data.title,
      focus_area: data.focusArea,
      student_outcome: data.studentOutcome,
      description: data.description,
      technologies: data.technologies,
      duration: data.duration,
      level: data.level,
      category: data.category,
      cost: data.cost,
      instructor: data.instructor,
      created_at: tsToStr(data.createdAt),
      updated_at: tsToStr(data.updatedAt),
    } as Course;
  },

  updateCourse: async (courseId: string, courseData: Partial<Course>): Promise<void> => {
    const courseRef = doc(db, 'courses', courseId);
    const updatePayload: Record<string, any> = { updatedAt: serverTimestamp() };
    
    if (courseData.title !== undefined) updatePayload.title = courseData.title;
    if (courseData.focus_area !== undefined) updatePayload.focusArea = courseData.focus_area;
    if (courseData.student_outcome !== undefined) updatePayload.studentOutcome = courseData.student_outcome;
    if (courseData.description !== undefined) updatePayload.description = courseData.description;
    if (courseData.technologies !== undefined) updatePayload.technologies = courseData.technologies;
    if (courseData.duration !== undefined) updatePayload.duration = courseData.duration;
    if (courseData.level !== undefined) updatePayload.level = courseData.level;
    if (courseData.category !== undefined) updatePayload.category = courseData.category;
    if (courseData.cost !== undefined) updatePayload.cost = courseData.cost;
    if (courseData.instructor !== undefined) updatePayload.instructor = courseData.instructor;

    await updateDoc(courseRef, updatePayload);
  },

  deleteCourse: async (courseId: string): Promise<void> => {
    // Soft delete
    const courseRef = doc(db, 'courses', courseId);
    await updateDoc(courseRef, { isActive: false, updatedAt: serverTimestamp() });
  },

  getCourses: async (filters?: { category?: string; search?: string }): Promise<Course[]> => {
    try {
      const constraints: QueryConstraint[] = [where('isActive', '==', true)];

      if (filters?.category && filters.category !== 'All') {
        constraints.push(where('category', '==', filters.category));
      }

      const q = query(collection(db, 'courses'), ...constraints);
      const snap = await getDocs(q);

      let courses: Course[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          course_id: d.id,
          title: data.title ?? '',
          focus_area: data.focusArea ?? '',
          student_outcome: data.studentOutcome ?? '',
          description: data.description ?? '',
          technologies: data.technologies ?? [],
          duration: data.duration ?? '',
          level: data.level ?? 'Intermediate',
          category: data.category ?? '',
          cost: data.cost ?? 0,
          instructor: data.instructor ?? '',
          created_at: tsToStr(data.createdAt),
          updated_at: tsToStr(data.updatedAt),
        } as Course;
      });

      if (filters?.search) {
        const q2 = filters.search.toLowerCase();
        courses = courses.filter(
          (c) =>
            c.title.toLowerCase().includes(q2) ||
            c.focus_area.toLowerCase().includes(q2) ||
            c.description.toLowerCase().includes(q2)
        );
      }

      return courses.length > 0 ? courses : INITIAL_COURSES;
    } catch (err) {
      console.error('Firestore getCourses error:', err);
      return INITIAL_COURSES;
    }
  },

  getCourseById: async (id: string): Promise<Course | null> => {
    try {
      const snap = await getDoc(doc(db, 'courses', id));
      if (!snap.exists()) return null;
      const data = snap.data();
      return {
        course_id: snap.id,
        title: data.title ?? '',
        focus_area: data.focusArea ?? '',
        student_outcome: data.studentOutcome ?? '',
        description: data.description ?? '',
        technologies: data.technologies ?? [],
        duration: data.duration ?? '',
        level: data.level ?? 'Intermediate',
        category: data.category ?? '',
        cost: data.cost ?? 0,
        instructor: data.instructor ?? '',
        created_at: tsToStr(data.createdAt),
        updated_at: tsToStr(data.updatedAt),
      } as Course;
    } catch (err) {
      console.error('Firestore getCourseById error:', err);
      return null;
    }
  },

  // -------------------------------------------------------------------------
  // Course Enrollments (subcollection: /users/{uid}/enrollments)
  // -------------------------------------------------------------------------
  createCourseEnrollment: async (studentId: string, courseId: string): Promise<CourseEnrollment> => {
    const enrollmentsRef = collection(db, 'users', studentId, 'enrollments');

    // Duplicate check
    const existing = await getDocs(
      query(enrollmentsRef, where('courseId', '==', courseId), where('status', '!=', 'CANCELLED'))
    );
    if (!existing.empty) {
      const d = existing.docs[0];
      const data = d.data();
      return {
        enrollment_id: d.id,
        student_id: studentId,
        course_id: courseId,
        status: data.status,
        enrolled_at: tsToStr(data.enrolledAt),
        updated_at: tsToStr(data.updatedAt),
      };
    }

    const course = await FirestoreService.getCourseById(courseId);

    const newDoc = await addDoc(enrollmentsRef, {
      courseId,
      courseTitle: course?.title ?? '',
      courseCategory: course?.category ?? '',
      courseDuration: course?.duration ?? '',
      courseLevel: course?.level ?? '',
      status: 'ENROLLED',
      progress: 0,
      enrolledAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      enrollment_id: newDoc.id,
      student_id: studentId,
      course_id: courseId,
      status: 'ENROLLED',
      enrolled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      course: course ?? undefined,
    };
  },

  getCourseEnrollmentsByStudentId: async (studentId: string): Promise<(CourseEnrollment & { course?: Course })[]> => {
    try {
      const enrollmentsRef = collection(db, 'users', studentId, 'enrollments');
      const snap = await getDocs(query(enrollmentsRef, orderBy('enrolledAt', 'desc')));

      return Promise.all(
        snap.docs.map(async (d) => {
          const data = d.data();
          const course = await FirestoreService.getCourseById(data.courseId);
          return {
            enrollment_id: d.id,
            student_id: studentId,
            course_id: data.courseId,
            status: data.status,
            enrolled_at: tsToStr(data.enrolledAt),
            updated_at: tsToStr(data.updatedAt),
            course: course ?? undefined,
          } as CourseEnrollment & { course?: Course };
        })
      );
    } catch (err) {
      console.error('Firestore getCourseEnrollmentsByStudentId error:', err);
      return [];
    }
  },

  getAllEnrollmentsWithStudents: async (): Promise<any[]> => {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      
      // Fetch enrollments for each user individually to avoid requiring a Collection Group Index
      const allEnrollmentsPromises = usersSnap.docs.map(async (userDoc) => {
        const student = docToStudent(userDoc.id, userDoc.data());
        const enrollmentsRef = collection(db, 'users', userDoc.id, 'enrollments');
        const enrollmentsSnap = await getDocs(enrollmentsRef);
        
        return enrollmentsSnap.docs.map(d => {
          const data = d.data();
          return {
            enrollment_id: d.id,
            student_id: userDoc.id,
            student_name: student?.name || 'Unknown',
            student_mobile: student?.mobile || 'N/A',
            course_id: data.courseId,
            course_title: data.courseTitle,
            status: data.status,
            enrolled_at: tsToStr(data.enrolledAt),
          };
        });
      });

      const allEnrollmentsArrays = await Promise.all(allEnrollmentsPromises);
      // Flatten the array of arrays
      const flatEnrollments = allEnrollmentsArrays.flat();

      return flatEnrollments.sort((a, b) => new Date(b.enrolled_at).getTime() - new Date(a.enrolled_at).getTime());
    } catch (err) {
      console.error('Error fetching all enrollments:', err);
      return [];
    }
  },

  getStudentsWithoutBookings: async (): Promise<Student[]> => {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      
      const results = await Promise.all(usersSnap.docs.map(async (userDoc) => {
        const bookingsRef = collection(db, 'users', userDoc.id, 'bookings');
        const bookingsSnap = await getDocs(bookingsRef);
        
        if (bookingsSnap.empty) {
          return docToStudent(userDoc.id, userDoc.data());
        }
        return null;
      }));

      return results.filter((student): student is Student => student !== null).sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } catch (err) {
      console.error('Error fetching students without bookings:', err);
      return [];
    }
  },
};
