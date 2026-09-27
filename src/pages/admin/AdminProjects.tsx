import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { FirestoreService } from '../../services/firestore';
import { Project } from '../../types';
import { Plus, Edit2, Trash2, X, Calculator, Image as ImageIcon } from 'lucide-react';
import { BRANCHES } from '../../utils/constants';

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    branch: 'ECE / EC',
    project_type: 'Minor',
    technologies: [],
    difficulty: 'Intermediate',
    duration: '',
    original_cost: 0,
    discounted_cost: 0,
    availability: 'Available',
    capacity: 10,
  });

  // Price Calculator State
  const [basePrice, setBasePrice] = useState<number>(0);
  const [markupPercent, setMarkupPercent] = useState<number>(150); // +150% = 250% total
  const [discountPercent, setDiscountPercent] = useState<number>(20);

  const fetchProjects = async () => {
    setLoading(true);
    const data = await FirestoreService.getProjects();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData(project);
      setBasePrice(Math.round(project.original_cost / 2.5)); // Reverse calculation for demo
      setMarkupPercent(150);
      setDiscountPercent(20);
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        branch: 'ECE / EC',
        project_type: 'Minor',
        technologies: [],
        difficulty: 'Intermediate',
        duration: '',
        original_cost: 0,
        discounted_cost: 0,
        availability: 'Available',
        capacity: 10,
      });
      setBasePrice(0);
      setMarkupPercent(150);
      setDiscountPercent(20);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setImageFile(null);
  };

  const calculatePrices = () => {
    // If base price is 1000, markup of 150% means +1500 = 2500
    const original = basePrice + (basePrice * markupPercent) / 100;
    const discounted = original - (original * discountPercent) / 100;
    
    setFormData(prev => ({
      ...prev,
      original_cost: original,
      discounted_cost: discounted
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = formData.image;

      if (imageFile) {
        const storageRef = ref(storage, `projects/${Date.now()}-${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const finalData = { ...formData, image: imageUrl };

      if (editingProject) {
        await FirestoreService.updateProject(editingProject.project_id, finalData);
      } else {
        await FirestoreService.createProject(finalData);
      }
      handleCloseModal();
      fetchProjects();
    } catch (err) {
      console.error("Error saving project", err);
      alert("Failed to save project.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await FirestoreService.deleteProject(id);
      fetchProjects();
    }
  };

  return (
    <div className="flex flex-col gap-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Manage Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Create, update, and manage project listings and pricing.</p>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()} icon={<Plus className="w-4 h-4" />}>
          Add Project
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Listed Price</th>
                <th className="px-6 py-4">Final Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading projects...</td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No projects found.</td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.project_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{project.title}</td>
                    <td className="px-6 py-4">{project.branch}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${project.project_type === 'Major' ? 'bg-brand-100 text-brand-700' : 'bg-blue-100 text-blue-700'}`}>
                        {project.project_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 line-through">₹{project.original_cost}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">₹{project.discounted_cost}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => handleOpenModal(project)} className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(project.project_id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form id="project-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Project Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <Select
                    label="Branch"
                    value={formData.branch as string}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    options={BRANCHES.map(b => ({ value: b, label: b }))}
                  />
                  <Select
                    label="Project Type"
                    value={formData.project_type as string}
                    onChange={(e) => setFormData({ ...formData, project_type: e.target.value as any })}
                    options={[{ value: 'Minor', label: 'Minor' }, { value: 'Major', label: 'Major' }]}
                  />
                  <Select
                    label="Difficulty"
                    value={formData.difficulty as string}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    options={[
                      { value: 'Beginner', label: 'Beginner' },
                      { value: 'Intermediate', label: 'Intermediate' },
                      { value: 'Advanced', label: 'Advanced' }
                    ]}
                  />
                  <Input
                    label="Duration (e.g. 3-4 weeks)"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                  <Input
                    label="Technologies (comma separated)"
                    value={formData.technologies?.join(', ')}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value.split(',').map(s => s.trim()) })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">Project Image</label>
                  <div className="flex items-center gap-4">
                    {formData.image && !imageFile && (
                      <img src={formData.image} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-gray-200 shadow-sm" />
                    )}
                    {imageFile && (
                      <div className="w-16 h-16 rounded-xl bg-brand-50 border border-brand-200 flex flex-col items-center justify-center text-[10px] text-brand-700 font-bold p-1 overflow-hidden shadow-sm">
                        <ImageIcon className="w-4 h-4 mb-1" />
                        Selected
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImageFile(e.target.files[0]);
                        }
                      }}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-brand-50 file:text-brand-700
                        hover:file:bg-brand-100 transition-all cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm resize-none"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  ></textarea>
                </div>

                {/* Pricing Calculator Section */}
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4 text-emerald-800 font-bold">
                    <Calculator className="w-5 h-5" />
                    Dynamic Pricing Calculator
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Input
                      label="Base Cost (₹)"
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                    />
                    <Input
                      label="Markup % (e.g. 150 for 250% total)"
                      type="number"
                      value={markupPercent}
                      onChange={(e) => setMarkupPercent(Number(e.target.value))}
                    />
                    <Input
                      label="Discount %"
                      type="number"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <Button type="button" variant="outline" size="sm" onClick={calculatePrices}>
                      Calculate & Apply Prices
                    </Button>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 line-through">Listed: ₹{formData.original_cost}</div>
                      <div className="text-lg font-extrabold text-emerald-600">Final: ₹{formData.discounted_cost}</div>
                    </div>
                  </div>
                </div>
                
                {/* Manual Price Override */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  <Input
                    label="Manual Override: Listed Price (Strikethrough) ₹"
                    type="number"
                    value={formData.original_cost}
                    onChange={(e) => setFormData({ ...formData, original_cost: Number(e.target.value) })}
                    required
                  />
                  <Input
                    label="Manual Override: Final Discounted Price ₹"
                    type="number"
                    value={formData.discounted_cost}
                    onChange={(e) => setFormData({ ...formData, discounted_cost: Number(e.target.value) })}
                    required
                  />
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <Button variant="ghost" onClick={handleCloseModal} disabled={uploading}>Cancel</Button>
              <Button variant="primary" type="submit" form="project-form" disabled={uploading}>
                {uploading ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
