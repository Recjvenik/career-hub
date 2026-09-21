import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ApiService } from '../services/api';
import { Project } from '../types';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { formatCurrency } from '../utils/formatters';
import { ArrowLeft, Clock, Cpu, ShieldCheck, CheckCircle2, AlertCircle, BookmarkPlus } from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    const loadProject = async () => {
      if (!id) return;
      setLoading(true);
      setNotFound(false);
      try {
        const found = await ApiService.getProjectById(id);
        if (found) {
          setProject(found);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Error fetching project detail:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col gap-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32" />
        <div className="h-40 bg-gray-200 rounded-3xl" />
        <div className="h-64 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Project Not Found</h2>
        <p className="text-sm text-gray-500">The requested academic project does not exist or may have been removed.</p>
        <Button variant="primary" onClick={() => navigate('/projects')}>
          Back to Projects Marketplace
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Back Button */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects Catalogue
      </Link>

      {/* Hero Header Card */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-950 text-white rounded-3xl p-6 sm:p-10 shadow-md flex flex-col gap-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={project.project_type === 'Major' ? 'brand' : 'accent'} size="sm" className="bg-white/15 text-white border-white/20">
            {project.project_type} Project
          </Badge>
          <span className="text-xs font-semibold bg-white/10 text-brand-200 px-3 py-1 rounded-pill">
            {project.branch}
          </span>
          <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-200 px-3 py-1 rounded-pill border border-emerald-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {project.availability}
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {project.title}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-brand-100 leading-relaxed max-w-3xl">
            {project.description}
          </p>
        </div>

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-semibold text-brand-300 uppercase tracking-wider mr-2">Components & Tech:</span>
          {project.technologies.map((tech) => (
            <span key={tech} className="text-xs font-semibold bg-white/10 text-white px-3 py-1 rounded-lg border border-white/10">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Specification & Price Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details Card */}
        <Card className="md:col-span-2 p-6 flex flex-col gap-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Project Technical Specifications
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Branch</span>
              <span className="text-sm font-extrabold text-gray-800 mt-0.5 block">{project.branch}</span>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Category</span>
              <span className="text-sm font-extrabold text-gray-800 mt-0.5 block">{project.project_type}</span>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Duration</span>
              <span className="text-sm font-extrabold text-gray-800 mt-0.5 block">{project.duration}</span>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Difficulty</span>
              <span className="text-sm font-extrabold text-gray-800 mt-0.5 block">{project.difficulty}</span>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Capacity</span>
              <span className="text-sm font-extrabold text-gray-800 mt-0.5 block">{project.capacity} Teams</span>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Status</span>
              <span className="text-sm font-extrabold text-emerald-600 mt-0.5 block">{project.availability}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">What is Included in This Project Package?</h3>
            <ul className="text-xs text-gray-600 flex flex-col gap-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Complete hardware components kit & microcontroller board</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Source code, circuit schematic diagram & assembly guide</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Comprehensive project documentation / report format</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Viva presentation preparation assistance</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Pricing & Booking Action Card */}
        <Card className="p-6 flex flex-col justify-between border-brand-200 bg-brand-50/20 shadow-md">
          <div className="flex flex-col gap-4">
            <div className="border-b border-brand-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Listed Price</span>
              <div className="text-3xl font-extrabold text-brand-700 mt-1">
                {formatCurrency(project.cost)}
              </div>
              <span className="text-[11px] text-gray-500 mt-0.5 block">Includes components & documentation</span>
            </div>

            <div className="flex flex-col gap-2.5 text-xs text-gray-600">
              <div className="flex items-center justify-between">
                <span>Availability:</span>
                <strong className="text-emerald-700 font-bold">{project.availability}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Category:</span>
                <strong className="text-gray-900">{project.project_type} Project</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Branch:</span>
                <strong className="text-gray-900">{project.branch}</strong>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(`/projects/${project.project_id}/book`)}
              icon={<BookmarkPlus className="w-5 h-5" />}
              className="w-full text-base font-bold shadow-md"
            >
              Book This Project
            </Button>
            <p className="text-[11px] text-center text-gray-500">
              Instant booking confirmation with PENDING status tracking.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
