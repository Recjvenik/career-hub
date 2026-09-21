import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Sparkles, Layers, Briefcase, UserCheck, TrendingUp, ArrowRight, ShieldCheck, Award } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isRegistered } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated && isRegistered) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col gap-16 pb-12">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-950 via-brand-900 to-brand-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#36a9fa_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center gap-6">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl bg-gradient-to-r from-blue-200 via-sky-300 to-cyan-200 bg-clip-text text-transparent">
            Build your skills. Discover new job opportunities. Accelerate your career.
          </h1>

          <p className="text-base sm:text-xl text-brand-100 max-w-2xl font-normal leading-relaxed">
            One platform for career building, hands-on skill development, verified job listings, and internship opportunities for students.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              onClick={handleGetStarted}
              icon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto bg-white text-brand-900 hover:bg-brand-50 border-none shadow-lg text-base font-semibold"
            >
              Get Started with Google
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/jobs')}
              className="w-full sm:w-auto bg-white text-brand-900 border border-white hover:bg-brand-600 hover:text-white hover:border-brand-600 shadow-md text-base transition-all duration-200 font-semibold"
            >
              Explore Job Opportunities
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-brand-200 mt-6 pt-6 border-t border-white/10 w-full max-w-xl">
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-brand-400" />
              New Job & Internship Listings
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-brand-400" />
              Curated Career Paths
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              Verified College Projects
            </span>
          </div>
        </div>
      </section>

      {/* Feature Benefit Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="brand" size="sm" className="mb-2">Career & Skill Building</Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Everything you need for career success
          </h2>
          <p className="mt-3 text-sm text-gray-600">
            Designed specifically for engineering students looking to build job-ready skills, gain practical experience, and secure top opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">New Job Opportunities</h3>
              <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                Access curated internships, campus drives, and full-time developer openings matched to your branch and skills.
              </p>
            </div>
            <Link to="/jobs" className="mt-4 text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1">
              Explore Opportunities <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Career Growth & Skills</h3>
              <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                Build practical hardware and software credentials that stand out to recruiters and enhance your placement readiness.
              </p>
            </div>
            <Link to="/jobs" className="mt-4 text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
              Accelerate Growth <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Practical Projects</h3>
              <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                Select branch-wise Minor and Major academic projects with component lists, documentation, and expert guidance.
              </p>
            </div>
            <Link to="/projects" className="mt-4 text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Browse Projects <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Student Profile</h3>
              <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                Keep your college, department, semester, and technical credentials organized in a single student identity profile.
              </p>
            </div>
            <Link to="/login" className="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              Setup Profile <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="bg-white border-y border-gray-200/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-brand-600">150+</span>
            <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">Active Opportunities</p>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-brand-600">50,000+</span>
            <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">Students Supported</p>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-brand-600">1,200+</span>
            <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">Projects Guided</p>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-brand-600">98%</span>
            <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">Placement Boost Rate</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <div className="bg-brand-50 border border-brand-200 rounded-3xl p-8 sm:p-12 flex flex-col items-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-900">
            Ready to jumpstart your career and find your next opportunity?
          </h2>
          <p className="text-sm text-brand-700 max-w-xl">
            Sign in with your Google account to complete registration and access personalized career paths and job listings immediately.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={handleGetStarted}
            icon={<ArrowRight className="w-5 h-5" />}
            className="mt-2 font-bold"
          >
            Get Started Free
          </Button>
        </div>
      </section>
    </div>
  );
};
