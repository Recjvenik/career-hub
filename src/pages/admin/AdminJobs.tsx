import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { FirestoreService } from '../../services/firestore';
import { Job } from '../../types';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export const AdminJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Job>>({
    company: '',
    role: '',
    job_type: 'Internship',
    description: '',
    eligibility: '',
    location: '',
    skills: [],
    experience: 'Fresher',
    deadline: '',
    apply_url: '',
    company_logo: '',
  });

  const fetchJobs = async () => {
    setLoading(true);
    const data = await FirestoreService.getJobs();
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleOpenModal = (job?: Job) => {
    if (job) {
      setEditingJob(job);
      setFormData(job);
    } else {
      setEditingJob(null);
      setFormData({
        company: '',
        role: '',
        job_type: 'Internship',
        description: '',
        eligibility: '',
        location: '',
        skills: [],
        experience: 'Fresher',
        deadline: '',
        apply_url: '',
        company_logo: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await FirestoreService.updateJob(editingJob.job_id, formData);
      } else {
        await FirestoreService.createJob(formData);
      }
      handleCloseModal();
      fetchJobs();
    } catch (err) {
      console.error("Error saving job", err);
      alert("Failed to save job.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      await FirestoreService.deleteJob(id);
      fetchJobs();
    }
  };

  return (
    <div className="flex flex-col gap-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Manage Jobs</h1>
          <p className="text-sm text-gray-500 mt-1">Create, update, and manage job & internship listings.</p>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()} icon={<Plus className="w-4 h-4" />}>
          Add Job
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading jobs...</td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No jobs found.</td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.job_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      {job.company_logo && <img src={job.company_logo} alt="Logo" className="w-8 h-8 rounded-full border border-gray-200" />}
                      {job.company}
                    </td>
                    <td className="px-6 py-4">{job.role}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${job.job_type === 'Internship' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                        {job.job_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{job.deadline || 'No deadline'}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => handleOpenModal(job)} className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(job.job_id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingJob ? 'Edit Job' : 'Add New Job'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form id="job-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Company Name"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                  <Input
                    label="Role/Title"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                  />
                  <Select
                    label="Job Type"
                    value={formData.job_type as string}
                    onChange={(e) => setFormData({ ...formData, job_type: e.target.value as any })}
                    options={[
                      { value: 'Internship', label: 'Internship' },
                      { value: 'Full-time', label: 'Full-time' },
                      { value: 'Part-time', label: 'Part-time' }
                    ]}
                  />
                  <Input
                    label="Location (e.g. Remote, Hybrid)"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                  <Input
                    label="Eligibility (separated by '·')"
                    value={formData.eligibility}
                    onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                    placeholder="e.g. CSE / IT · 3rd Year"
                  />
                  <Input
                    label="Experience (e.g. Fresher)"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  />
                  <Input
                    label="Skills (comma separated)"
                    value={formData.skills?.join(', ')}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()) })}
                  />
                  <Input
                    label="Deadline (YYYY-MM-DD)"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                  <Input
                    label="Apply URL"
                    value={formData.apply_url}
                    onChange={(e) => setFormData({ ...formData, apply_url: e.target.value })}
                    placeholder="https://"
                  />
                  <Input
                    label="Company Logo URL"
                    value={formData.company_logo}
                    onChange={(e) => setFormData({ ...formData, company_logo: e.target.value })}
                    placeholder="https://"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm resize-none"
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  ></textarea>
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <Button variant="ghost" onClick={handleCloseModal}>Cancel</Button>
              <Button variant="primary" type="submit" form="job-form">
                {editingJob ? 'Update Job' : 'Create Job'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
