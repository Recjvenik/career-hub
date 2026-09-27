import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { FirestoreService } from '../../services/firestore';

export const AdminDashboard: React.FC = () => {
  const [counts, setCounts] = useState({ projects: 0, jobs: 0, courses: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [projects, jobs, courses] = await Promise.all([
          FirestoreService.getProjects(),
          FirestoreService.getJobs(),
          FirestoreService.getCourses(),
        ]);
        setCounts({
          projects: projects.length,
          jobs: jobs.length,
          courses: courses.length,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard counts", err);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome to the GoTechPlace CMS. Here you can manage all content.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-gray-900">Total Projects</h3>
          <p className="text-3xl font-extrabold text-brand-600 mt-2">{counts.projects}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold text-gray-900">Total Jobs</h3>
          <p className="text-3xl font-extrabold text-brand-600 mt-2">{counts.jobs}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold text-gray-900">Total Courses</h3>
          <p className="text-3xl font-extrabold text-brand-600 mt-2">{counts.courses}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Content Management Status</h2>
        <p className="text-sm text-gray-600">
          The Admin panel is fully functional. You can use the sidebar to navigate to Projects, Jobs, or Courses to perform full CRUD (Create, Read, Update, Delete) operations.
        </p>
      </Card>
    </div>
  );
};
