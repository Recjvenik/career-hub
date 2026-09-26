import React from 'react';
import { Course } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { formatCurrency } from '../../utils/formatters';
import { Clock, BookOpen, ArrowRight, Target, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, isEnrolled }) => {
  const navigate = useNavigate();

  return (
    <Card hoverable onClick={() => navigate(`/courses/${course.course_id}`)} className="flex flex-col justify-between h-full group">
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <Badge variant="brand" size="sm">
            {course.category}
          </Badge>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-pill">
            {course.level}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
          {course.title}
        </h3>

        {/* Focus Area & Outcome */}
        <div className="mt-3 flex flex-col gap-2 text-xs">
          <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-gray-400 font-bold block uppercase tracking-wider text-[10px]">Focus Area</span>
            <p className="text-gray-700 font-medium line-clamp-2 mt-0.5">{course.focus_area}</p>
          </div>

          <div className="p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100 text-emerald-900 flex items-start gap-2">
            <Target className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-[10px] uppercase tracking-wider text-emerald-700">Student Outcome</span>
              <p className="font-semibold text-xs line-clamp-1">{course.student_outcome}</p>
            </div>
          </div>
        </div>

        {/* Tech Stack Chips */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {course.technologies.slice(0, 4).map((tech) => (
            <span key={tech} className="text-[11px] font-medium text-gray-600 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded">
              {tech}
            </span>
          ))}
          {course.technologies.length > 4 && (
            <span className="text-[11px] font-medium text-gray-400 px-1">
              +{course.technologies.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer Info & CTA */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            {course.duration}
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-brand-700">
            <Award className="w-3.5 h-3.5 text-brand-500" />
            Certificate Included
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Course Fee</span>
            <span className="text-lg font-extrabold text-brand-700">{formatCurrency(course.cost)}</span>
          </div>

          <Button
            variant={isEnrolled ? 'outline' : 'outline'}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/courses/${course.course_id}`);
            }}
            icon={!isEnrolled && <ArrowRight className="w-3.5 h-3.5" />}
            className={isEnrolled 
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-bold" 
              : "group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition-colors"
            }
          >
            {isEnrolled ? 'Enrolled' : 'View Course'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
