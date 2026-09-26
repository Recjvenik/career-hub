import React from 'react';
import { Project } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { formatCurrency } from '../../utils/formatters';
import { Clock, Cpu, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface ProjectCardProps {
  project: Project;
  onBookClick?: (project: Project) => void;
  isBooked?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, isBooked }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/projects/${project.project_id}`);
  };

  return (
    <Card hoverable onClick={handleCardClick} className="flex flex-col justify-between h-full group">
      <div>
        {/* Badges Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <Badge variant={project.project_type === 'Major' ? 'brand' : 'accent'} size="sm">
            {project.project_type} Project
          </Badge>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-pill">
            {project.branch}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
          {project.title}
        </h3>
        <p className="mt-2 text-xs text-gray-600 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        {/* Tech Stack Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech} className="text-[11px] font-medium text-gray-600 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded">
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="text-[11px] font-medium text-gray-400 px-1">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Meta Specs & CTA */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            {project.duration}
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
            <ShieldCheck className="w-3.5 h-3.5" />
            {project.availability}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Estimated Cost</span>
            <span className="text-lg font-extrabold text-brand-700">{formatCurrency(project.cost)}</span>
          </div>

          <Button
            variant={isBooked ? 'outline' : 'outline'}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/projects/${project.project_id}`);
            }}
            icon={!isBooked && <ArrowRight className="w-3.5 h-3.5" />}
            className={isBooked 
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-bold" 
              : "group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition-colors"
            }
          >
            {isBooked ? 'Already Booked' : 'View Project'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
