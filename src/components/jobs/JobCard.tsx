import React from 'react';
import { Job } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { formatDate } from '../../utils/formatters';
import { MapPin, Calendar, GraduationCap, ArrowUpRight, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const navigate = useNavigate();

  return (
    <Card hoverable onClick={() => navigate(`/jobs/${job.job_id}`)} className="flex flex-col justify-between h-full group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center p-1">
              {job.company_logo ? (
                <img src={job.company_logo} alt={job.company} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Building2 className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                {job.role}
              </h3>
              <p className="text-xs font-semibold text-gray-600">{job.company}</p>
            </div>
          </div>

          <Badge variant={job.job_type === 'Internship' ? 'accent' : 'brand'} size="sm" className="shrink-0">
            {job.job_type}
          </Badge>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 mb-4 bg-gray-50/70 p-3 rounded-lg border border-gray-100">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{job.eligibility}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:col-span-2">
            <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>Deadline: <strong className="font-semibold text-gray-800">{formatDate(job.deadline)}</strong></span>
          </div>
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {job.skills.map((skill) => (
            <span key={skill} className="text-[11px] font-medium text-brand-800 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500 font-medium">
          {job.experience}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/jobs/${job.job_id}`);
          }}
          icon={<ArrowUpRight className="w-3.5 h-3.5" />}
          className="group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition-colors"
        >
          View Opportunity
        </Button>
      </div>
    </Card>
  );
};
