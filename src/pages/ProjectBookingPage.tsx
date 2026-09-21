import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ApiService } from '../services/api';
import { Project, ProjectBooking } from '../types';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ArrowLeft, CheckCircle2, BookmarkCheck, ShieldCheck, User, Layers, Clock, AlertCircle } from 'lucide-react';

export const ProjectBookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { student } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<ProjectBooking | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadBookingData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const found = await ApiService.getProjectById(id);
        if (found) {
          setProject(found);
        } else {
          setErrorMessage('Project not found');
        }
      } catch (err) {
        console.error('Failed to load project details for booking:', err);
        setErrorMessage('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };
    loadBookingData();
  }, [id]);

  const handleConfirmBooking = async () => {
    if (!student?.student_id || !project?.project_id) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const result = await ApiService.createBooking(student.student_id, project.project_id);
      setBookingSuccess(result);
    } catch (err: any) {
      console.error('Booking failed:', err);
      setErrorMessage(err.message || 'Failed to submit booking request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="h-48 bg-gray-200 rounded-2xl" />
        <div className="h-48 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="p-8 text-center flex flex-col items-center gap-6 border-emerald-200 bg-emerald-50/20 shadow-lg">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Booking Complete</span>
            <h1 className="text-2xl font-extrabold text-gray-900 mt-1">Project Booked Successfully</h1>
            <p className="text-xs text-gray-600 mt-1">
              Your booking request has been registered and is currently under review by the academic allocation team.
            </p>
          </div>

          <div className="w-full bg-white p-5 rounded-2xl border border-gray-200 text-left flex flex-col gap-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Booking ID:</span>
              <strong className="font-mono text-gray-900 font-bold">{bookingSuccess.booking_id}</strong>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Project Title:</span>
              <strong className="text-gray-900 font-bold">{project?.title}</strong>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Student Name:</span>
              <strong className="text-gray-900 font-bold">{student?.name}</strong>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Booking Date:</span>
              <strong className="text-gray-900 font-bold">{formatDate(bookingSuccess.booked_at)}</strong>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Initial Status:</span>
              <Badge variant="warning" size="sm" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {bookingSuccess.status}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-2">
            <Button
              variant="primary"
              onClick={() => navigate('/dashboard')}
              className="w-full"
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/projects')}
              className="w-full"
            >
              Browse More Projects
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-lg font-bold text-gray-900">Project Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/projects')} className="mt-4">
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      <Link
        to={`/projects/${project.project_id}`}
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Project Details
      </Link>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Checkout</span>
        <h1 className="text-2xl font-extrabold text-gray-900 mt-0.5">Confirm Project Booking</h1>
        <p className="text-xs text-gray-500 mt-1">
          Review project details and student information before confirming your booking.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-xs text-red-900">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Project Summary Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-brand-600" />
          <h2 className="text-sm font-bold text-gray-900">Project Summary</h2>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">{project.title}</h3>
            <Badge variant={project.project_type === 'Major' ? 'brand' : 'accent'} size="sm">
              {project.project_type}
            </Badge>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{project.description}</p>
          <div className="mt-2 flex flex-wrap items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
            <span>Branch: <strong>{project.branch}</strong></span>
            <span>Duration: <strong>{project.duration}</strong></span>
            <span>Cost: <strong className="text-brand-700 text-sm">{formatCurrency(project.cost)}</strong></span>
          </div>
        </div>
      </Card>

      {/* Student Details Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <User className="w-4 h-4 text-brand-600" />
          <h2 className="text-sm font-bold text-gray-900">Student Booking Profile</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-gray-400 block font-medium">Name</span>
            <span className="font-semibold text-gray-800">{student?.name}</span>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-gray-400 block font-medium">Email</span>
            <span className="font-semibold text-gray-800">{student?.email}</span>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-gray-400 block font-medium">College</span>
            <span className="font-semibold text-gray-800">{student?.college}</span>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-gray-400 block font-medium">Branch & Year</span>
            <span className="font-semibold text-gray-800">{student?.branch} · {student?.year}</span>
          </div>
        </div>
      </Card>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <span className="text-xs font-semibold text-gray-500 block">Total Amount Due</span>
          <span className="text-2xl font-extrabold text-brand-700">{formatCurrency(project.cost)}</span>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleConfirmBooking}
          isLoading={isSubmitting}
          icon={<BookmarkCheck className="w-5 h-5" />}
          className="w-full sm:w-auto"
        >
          Confirm Booking
        </Button>
      </div>
    </div>
  );
};
