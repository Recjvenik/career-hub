import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ApiService } from '../services/api';
import { Job } from '../types';
import { JobCard } from '../components/jobs/JobCard';
import { JobFilters } from '../components/jobs/JobFilters';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { Briefcase } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSEO } from '../hooks/useSEO';

export const JobsPage: React.FC = () => {
  useSEO({
    title: 'Jobs & Internships',
    description: 'Explore active recruitment drives, entry-level developer roles, and specialized technical internships.'
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const branchParam = searchParams.get('branch') || 'All';
  const typeParam = searchParams.get('type') || 'All';
  const searchParam = searchParams.get('search') || '';

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchJobs = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await ApiService.getJobs({
        branch: branchParam,
        job_type: typeParam,
        search: searchParam,
      });
      setJobs(data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [branchParam, typeParam, searchParam]);

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-purple-50 text-purple-700 text-xs font-semibold mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            Curated Career Opportunities
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Jobs & Internship Listings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Explore active recruitment drives, entry-level developer roles, and specialized technical internships.
          </p>
        </div>

        <div className="text-xs text-gray-500 font-semibold bg-white border border-gray-200 px-3.5 py-2 rounded-pill shadow-xs shrink-0">
          Showing <span className="text-purple-600 font-bold">{jobs.length}</span> Active Opportunities
        </div>
      </div>

      {/* Filters Bar */}
      <JobFilters
        search={searchParam}
        onSearchChange={(val) => updateFilters(undefined, undefined, val)}
        selectedBranch={branchParam}
        onBranchChange={(branch) => updateFilters(branch, undefined, undefined)}
        selectedJobType={typeParam}
        onJobTypeChange={(type) => updateFilters(undefined, type, undefined)}
        onReset={handleReset}
      />

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState onRetry={fetchJobs} />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No career opportunities found"
          message="Try adjusting your search criteria or switching eligibility and opportunity types."
          onAction={handleReset}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.job_id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};
