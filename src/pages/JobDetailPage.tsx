import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ApiService } from '../services/api';
import { Job } from '../types';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { formatDate } from '../utils/formatters';
import { ArrowLeft, MapPin, Calendar, GraduationCap, ExternalLink, Building2, ShieldCheck, AlertCircle, LogIn, Lock } from 'lucide-react';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isRegistered } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    const loadJob = async () => {
      if (!id) return;
      setLoading(true);
      setNotFound(false);
      try {
        const found = await ApiService.getJobById(id);
        if (found) {
          setJob(found);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Error loading job details:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [id]);

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
    } else if (!isRegistered) {
      navigate('/register');
    } else if (job?.apply_url) {
      window.open(job.apply_url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32" />
        <div className="h-40 bg-gray-200 rounded-3xl" />
        <div className="h-64 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Opportunity Not Found</h2>
        <p className="text-sm text-gray-500">The requested job or internship listing is no longer available.</p>
        <Button variant="primary" onClick={() => navigate('/jobs')}>
          Back to Jobs & Opportunities
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Back Button */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs Listings
      </Link>

      {/* Unauthenticated / Unregistered Notice Banner */}
      {(!isAuthenticated || !isRegistered) && (
        <div className="p-4 bg-brand-50/80 border border-brand-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-brand-900">
                {!isAuthenticated ? 'Sign in with Google required to apply' : 'Complete student registration required to apply'}
              </p>
              <p className="text-[11px] text-brand-700">
                {!isAuthenticated ? 'Verify your student identity to access direct application links.' : 'Complete your student details to unlock job applications.'}
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (!isAuthenticated) navigate('/login', { state: { from: location } });
              else navigate('/register');
            }}
            icon={<LogIn className="w-4 h-4" />}
            className="shrink-0 font-semibold"
          >
            {!isAuthenticated ? 'Sign In with Google' : 'Complete Registration'}
          </Button>
        </div>
      )}

      {/* Hero Card */}
      <Card className="p-6 sm:p-8 border-gray-200 shadow-md">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center p-1.5">
              {job.company_logo ? (
                <img src={job.company_logo} alt={job.company} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <Building2 className="w-8 h-8 text-gray-400" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={job.job_type === 'Internship' ? 'accent' : 'brand'} size="sm">
                  {job.job_type}
                </Badge>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-pill">
                  {job.experience}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 mt-2">{job.role}</h1>
              <p className="text-sm font-bold text-brand-700 mt-0.5">{job.company}</p>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleApplyClick}
            icon={isAuthenticated && isRegistered ? <ExternalLink className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
            className="w-full sm:w-auto text-base font-bold shadow-md"
          >
            {isAuthenticated && isRegistered ? 'Apply Now' : !isAuthenticated ? 'Sign In to Apply' : 'Complete Profile to Apply'}
          </Button>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 bg-gray-50/70 p-4 rounded-xl border border-gray-100 text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <div>
              <span className="text-gray-400 block font-medium">Location</span>
              <strong className="text-gray-900 font-bold">{job.location}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-gray-400 shrink-0" />
            <div>
              <span className="text-gray-400 block font-medium">Eligibility</span>
              <strong className="text-gray-900 font-bold">{job.eligibility}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <div>
              <span className="text-gray-400 block font-medium">Application Deadline</span>
              <strong className="text-gray-900 font-bold">{formatDate(job.deadline)}</strong>
            </div>
          </div>
        </div>

        {/* Role Description */}
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-bold text-gray-900">Job Description & Responsibilities</h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {job.description}
          </p>

          <h3 className="text-sm font-bold text-gray-900 mt-4">Required Technical Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <span key={skill} className="text-xs font-semibold text-brand-900 bg-brand-50 border border-brand-200 px-3 py-1 rounded-lg">
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified External Application Link
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={handleApplyClick}
              icon={isAuthenticated && isRegistered ? <ExternalLink className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            >
              {isAuthenticated && isRegistered ? 'Apply Now' : !isAuthenticated ? 'Sign In to Apply' : 'Complete Profile to Apply'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
