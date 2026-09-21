import { Course, Project, Job } from '../types';

// Default to user spreadsheet ID or VITE_GOOGLE_SHEETS_ID env variable
const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_ID || '1EvDYHt1liagyhlhiSVMl_E80akqfzbl0_DasGStDPnk';

function parseCsv(csvText: string): string[][] {
  const lines = csvText.split(/\r?\n/);
  return lines
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    });
}

export const DirectSheetsClient = {
  fetchCourses: async (filters?: { category?: string; search?: string }): Promise<Course[] | null> => {
    if (!SPREADSHEET_ID) return null;
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=Courses`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const csvText = await res.text();
      const rows = parseCsv(csvText);
      if (rows.length <= 1) return null;

      // Skip header row
      let courses: Course[] = rows.slice(1).map((r) => ({
        course_id: r[0] || `course-${Math.random()}`,
        title: r[1] || '',
        focus_area: r[2] || '',
        student_outcome: r[3] || '',
        description: r[4] || '',
        technologies: r[5] ? r[5].split(',').map((s) => s.trim()) : [],
        duration: r[6] || '4–6 weeks',
        level: (r[7] || 'Intermediate') as any,
        category: r[8] || 'General',
        cost: Number(r[9]) || 0,
        instructor: r[10] || '',
        created_at: r[11] || new Date().toISOString(),
        updated_at: r[12] || new Date().toISOString(),
      }));

      if (filters?.category && filters.category !== 'All') {
        courses = courses.filter((c) => c.category.toLowerCase().includes(filters.category!.toLowerCase()));
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        courses = courses.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.focus_area.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q)
        );
      }
      return courses;
    } catch (err) {
      console.warn('Direct Google Sheets fetch error:', err);
      return null;
    }
  },

  fetchCourseById: async (id: string): Promise<Course | null> => {
    const courses = await DirectSheetsClient.fetchCourses();
    return courses ? courses.find((c) => c.course_id === id) || null : null;
  },

  fetchProjects: async (filters?: { branch?: string; type?: string; search?: string }): Promise<Project[] | null> => {
    if (!SPREADSHEET_ID) return null;
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=Projects`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const csvText = await res.text();
      const rows = parseCsv(csvText);
      if (rows.length <= 1) return null;

      let projects: Project[] = rows.slice(1).map((r) => ({
        project_id: r[0] || '',
        title: r[1] || '',
        description: r[2] || '',
        branch: r[3] || 'ECE / EC',
        project_type: (r[4] || 'Minor') as any,
        technologies: r[5] ? r[5].split(',').map((s) => s.trim()) : [],
        difficulty: (r[6] || 'Intermediate') as any,
        duration: r[7] || '4–6 weeks',
        cost: Number(r[8]) || 3000,
        availability: (r[9] || 'Available') as any,
        capacity: Number(r[10]) || 15,
        image: r[11] || '',
        created_at: r[12] || '',
        updated_at: r[13] || '',
      }));

      if (filters?.branch && filters.branch !== 'All') {
        projects = projects.filter((p) => p.branch.toLowerCase().includes(filters.branch!.toLowerCase()));
      }
      if (filters?.type && filters.type !== 'All') {
        projects = projects.filter((p) => p.project_type.toLowerCase() === filters.type!.toLowerCase());
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        projects = projects.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      return projects;
    } catch {
      return null;
    }
  },

  fetchProjectById: async (id: string): Promise<Project | null> => {
    const projects = await DirectSheetsClient.fetchProjects();
    return projects ? projects.find((p) => p.project_id === id) || null : null;
  },

  fetchJobs: async (filters?: { branch?: string; job_type?: string; search?: string }): Promise<Job[] | null> => {
    if (!SPREADSHEET_ID) return null;
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=Jobs`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const csvText = await res.text();
      const rows = parseCsv(csvText);
      if (rows.length <= 1) return null;

      let jobs: Job[] = rows.slice(1).map((r) => ({
        job_id: r[0] || '',
        company: r[1] || '',
        role: r[2] || '',
        job_type: (r[3] || 'Internship') as any,
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

      if (filters?.job_type && filters.job_type !== 'All') {
        jobs = jobs.filter((j) => j.job_type.toLowerCase() === filters.job_type!.toLowerCase());
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        jobs = jobs.filter((j) => j.company.toLowerCase().includes(q) || j.role.toLowerCase().includes(q));
      }
      return jobs;
    } catch {
      return null;
    }
  },

  fetchJobById: async (id: string): Promise<Job | null> => {
    const jobs = await DirectSheetsClient.fetchJobs();
    return jobs ? jobs.find((j) => j.job_id === id) || null : null;
  },
};
