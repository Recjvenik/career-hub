import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ApiService } from '../services/api';
import { Project } from '../types';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectFilters } from '../components/projects/ProjectFilters';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { Layers } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const ProjectsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const branchParam = searchParams.get('branch') || 'All';
  const typeParam = searchParams.get('type') || 'All';
  const searchParam = searchParams.get('search') || '';

  const [projects, setProjects] = useState<Project[]>([]);
  const [studentBookings, setStudentBookings] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const { student } = useAuth();

  const fetchProjects = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await ApiService.getProjects({
        branch: branchParam,
        type: typeParam,
        search: searchParam,
      });
      setProjects(data);

      if (student?.student_id) {
        const bookings = await ApiService.getStudentBookings(student.student_id);
        setStudentBookings(bookings.map(b => b.project_id));
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [branchParam, typeParam, searchParam, student?.student_id]);

  const updateFilters = (newBranch?: string, newType?: string, newSearch?: string) => {
    const params = new URLSearchParams(searchParams);
    if (newBranch !== undefined) {
      if (newBranch === 'All') params.delete('branch');
      else params.set('branch', newBranch);
    }
    if (newType !== undefined) {
      if (newType === 'All') params.delete('type');
      else params.set('type', newType);
    }
    if (newSearch !== undefined) {
      if (!newSearch) params.delete('search');
      else params.set('search', newSearch);
    }
    setSearchParams(params);
  };

  const handleReset = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-brand-50 text-brand-700 text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5" />
            Branch-Wise Marketplace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Academic Projects Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Browse hardware and software Minor and Major projects for your engineering curriculum.
          </p>
        </div>

        <div className="text-xs text-gray-500 font-semibold bg-white border border-gray-200 px-3.5 py-2 rounded-pill shadow-xs shrink-0">
          Showing <span className="text-brand-600 font-bold">{projects.length}</span> Verified Projects
        </div>
      </div>

      {/* Filters Bar */}
      <ProjectFilters
        search={searchParam}
        onSearchChange={(val) => updateFilters(undefined, undefined, val)}
        selectedBranch={branchParam}
        onBranchChange={(branch) => updateFilters(branch, undefined, undefined)}
        selectedType={typeParam}
        onTypeChange={(type) => updateFilters(undefined, type, undefined)}
        onReset={handleReset}
      />

      {/* Content Grid / Loading / Error / Empty States */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState onRetry={fetchProjects} />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects match your search criteria"
          message="Try selecting a different branch, clearing the search query, or switching between Minor and Major project types."
          onAction={handleReset}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard 
              key={project.project_id} 
              project={project} 
              isBooked={studentBookings.includes(project.project_id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
