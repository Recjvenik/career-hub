import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ProfileCard } from '../components/profile/ProfileCard';
import { StatCard } from '../components/profile/StatCard';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { BRANCHES, YEARS, SEMESTERS, GENDERS } from '../utils/constants';
import { validateRegistrationForm } from '../utils/validation';
import { User, GraduationCap, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { student, user, saveStudentProfile, loading } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: student?.name || user?.name || '',
    mobile: student?.mobile || '',
    location: student?.location || '',
    gender: student?.gender || 'Male',
    college: student?.college || '',
    branch: student?.branch || 'ECE / EC',
    year: student?.year || 'Final Year',
    semester: student?.semester || 'Semester 7',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleOpenEdit = () => {
    setFormData({
      name: student?.name || user?.name || '',
      mobile: student?.mobile || '',
      location: student?.location || '',
      gender: student?.gender || 'Male',
      college: student?.college || '',
      branch: student?.branch || 'ECE / EC',
      year: student?.year || 'Final Year',
      semester: student?.semester || 'Semester 7',
    });
    setErrors({});
    setSaveSuccess(false);
    setIsEditModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
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
      setSaveSuccess(true);
      setTimeout(() => {
        setIsEditModalOpen(false);
        setSaveSuccess(false);
      }, 1200);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!student) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Header Banner */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Student Account</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
          Student Profile
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Manage your personal information, academic branch details, and account settings.
        </p>
      </div>

      {/* Main Profile Card */}
      <ProfileCard student={student} onEditClick={handleOpenEdit} />

      {/* Account Overview Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Account Status"
          value="Verified"
          subtitle="Google OAuth Identity"
          icon={<ShieldCheck className="w-6 h-6" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Academic Branch"
          value={student.branch}
          subtitle={`${student.year} · ${student.semester}`}
          icon={<GraduationCap className="w-6 h-6" />}
          iconBg="bg-brand-50 text-brand-600"
        />

        <StatCard
          title="Registered Email"
          value={student.email.split('@')[0]}
          subtitle={`@${student.email.split('@')[1] || 'domain'}`}
          icon={<User className="w-6 h-6" />}
          iconBg="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Student Profile"
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Profile updated successfully!
            </div>
          )}

          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
          />

          <Input
            label="Read-Only Email"
            value={student.email}
            disabled
            helperText="Connected to your Google login."
          />

          <Input
            label="Mobile Number"
            type="tel"
            value={formData.mobile}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 10);
              setFormData({ ...formData, mobile: val });
            }}
            error={errors.mobile}
          />

          <Input
            label="Location (City, State)"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            error={errors.location}
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
                  onClick={() => setFormData({ ...formData, gender: g })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-pill border cursor-pointer transition-all ${
                    formData.gender === g
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="College Name"
            value={formData.college}
            onChange={(e) => setFormData({ ...formData, college: e.target.value })}
            error={errors.college}
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
                  onClick={() => setFormData({ ...formData, branch: b })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-pill border cursor-pointer transition-all ${
                    formData.branch === b
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              options={YEARS.map((y) => ({ value: y, label: y }))}
              error={errors.year}
            />

            <Select
              label="Semester"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              options={SEMESTERS.map((s) => ({ value: s, label: s }))}
              error={errors.semester}
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
