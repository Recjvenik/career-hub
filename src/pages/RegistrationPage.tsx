import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Card } from '../components/common/Card';
import { Avatar } from '../components/common/Avatar';
import { BRANCHES, YEARS, SEMESTERS, GENDERS } from '../utils/constants';
import { validateRegistrationForm } from '../utils/validation';
import { CheckCircle2, User, GraduationCap, ArrowRight, ArrowLeft } from 'lucide-react';

export const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, saveStudentProfile, loading } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    mobile: '',
    location: '',
    gender: 'Male',
    college: '',
    branch: 'ECE / EC',
    year: 'Final Year',
    semester: 'Semester 7',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleNext = () => {
    // Basic validation for Step 1
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.mobile || !/^[6-9]\d{9}$/.test(formData.mobile.replace(/\s+/g, ''))) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number.';
    }
    if (!formData.location.trim()) newErrors.location = 'Location is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateRegistrationForm(formData);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    setIsSaving(true);
    try {
      await saveStudentProfile({
        name: formData.name,
        mobile: formData.mobile,
        location: formData.location,
        gender: formData.gender,
        college: formData.college,
        branch: formData.branch,
        year: formData.year,
        semester: formData.semester,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Card className="p-6 sm:p-8 shadow-md border-gray-200/80">
        {/* Header Title */}
        <div className="mb-6 border-b border-gray-100 pb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Student Onboarding</span>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-1">Complete Your Profile</h1>
          <p className="text-xs text-gray-500 mt-1">
            This information will be used to personalize projects, course recommendations, and job opportunities.
          </p>

          {/* Google Account Summary Banner */}
          <div className="mt-4 p-3 bg-brand-50/70 border border-brand-100 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar src={user?.picture} name={user?.name || 'Student'} size="md" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">{user?.name || 'Google User'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'email@example.com'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-pill shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified
            </div>
          </div>
        </div>

        {/* Step Progress Indicator */}
        <div className="flex items-center gap-2 mb-8">
          <div
            className={`flex-1 h-2 rounded-full transition-all duration-300 ${
              step >= 1 ? 'bg-brand-600' : 'bg-gray-200'
            }`}
          />
          <div
            className={`flex-1 h-2 rounded-full transition-all duration-300 ${
              step >= 2 ? 'bg-brand-600' : 'bg-gray-200'
            }`}
          />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {step === 1 && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 mb-2 text-sm font-bold text-gray-800">
                <User className="w-4 h-4 text-brand-600" />
                Step 1: Personal Information
              </div>

              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
                placeholder="Enter your full name"
              />

              <Input
                label="Read-only Email"
                value={user?.email || ''}
                disabled
                helperText="Email is permanently linked to your Google Account."
              />

              <Input
                label="Mobile Number"
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                error={errors.mobile}
                placeholder="10-digit mobile number (e.g. 9876543210)"
              />

              <Input
                label="Location (City, State)"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                error={errors.location}
                placeholder="e.g. Gurugram, Haryana"
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Gender
                </label>
                <div className="flex flex-wrap gap-2">
                  {GENDERS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleChange('gender', g)}
                      className={`px-4 py-2 text-xs font-semibold rounded-pill border cursor-pointer transition-all ${
                        formData.gender === g
                          ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleNext}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Next: Academic Details
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 mb-2 text-sm font-bold text-gray-800">
                <GraduationCap className="w-4 h-4 text-brand-600" />
                Step 2: Academic Details
              </div>

              <Input
                label="College / Institution Name"
                value={formData.college}
                onChange={(e) => handleChange('college', e.target.value)}
                error={errors.college}
                placeholder="e.g. Government Engineering College"
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Branch / Department
                </label>
                <div className="flex flex-wrap gap-2">
                  {BRANCHES.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => handleChange('branch', b)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-pill border cursor-pointer transition-all ${
                        formData.branch === b
                          ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
                {errors.branch && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.branch}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Academic Year"
                  value={formData.year}
                  onChange={(e) => handleChange('year', e.target.value)}
                  options={YEARS.map((y) => ({ value: y, label: y }))}
                  error={errors.year}
                />

                <Select
                  label="Current Semester"
                  value={formData.semester}
                  onChange={(e) => handleChange('semester', e.target.value)}
                  options={SEMESTERS.map((s) => ({ value: s, label: s }))}
                  error={errors.semester}
                />
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(1)}
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSaving || loading}
                  icon={<CheckCircle2 className="w-5 h-5" />}
                >
                  Create My Dashboard
                </Button>
              </div>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};
