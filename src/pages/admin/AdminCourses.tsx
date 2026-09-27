import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { FirestoreService } from '../../services/firestore';
import { Course } from '../../types';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    focus_area: '',
    student_outcome: '',
    description: '',
    technologies: [],
    duration: '',
    level: 'Beginner',
    category: '',
    cost: 0,
    instructor: '',
  });

  const fetchCourses = async () => {
    setLoading(true);
    const data = await FirestoreService.getCourses();
    setCourses(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData(course);
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        focus_area: '',
        student_outcome: '',
        description: '',
        technologies: [],
        duration: '',
        level: 'Beginner',
        category: '',
        cost: 0,
        instructor: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await FirestoreService.updateCourse(editingCourse.course_id, formData);
      } else {
        await FirestoreService.createCourse(formData);
      }
      handleCloseModal();
      fetchCourses();
    } catch (err) {
      console.error("Error saving course", err);
      alert("Failed to save course.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      await FirestoreService.deleteCourse(id);
      fetchCourses();
    }
  };

  return (
    <div className="flex flex-col gap-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Manage Courses</h1>
          <p className="text-sm text-gray-500 mt-1">Create, update, and manage training courses.</p>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()} icon={<Plus className="w-4 h-4" />}>
          Add Course
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Cost</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading courses...</td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No courses found.</td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.course_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{course.title}</td>
                    <td className="px-6 py-4">{course.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                        course.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {course.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-emerald-600">₹{course.cost}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => handleOpenModal(course)} className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(course.course_id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form id="course-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Course Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <Input
                    label="Category (e.g. Software Engineering)"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                  <Select
                    label="Level"
                    value={formData.level as string}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                    options={[
                      { value: 'Beginner', label: 'Beginner' },
                      { value: 'Intermediate', label: 'Intermediate' },
                      { value: 'Advanced', label: 'Advanced' }
                    ]}
                  />
                  <Input
                    label="Duration (e.g. 8 weeks)"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                  <Input
                    label="Instructor Name"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    required
                  />
                  <Input
                    label="Cost (₹)"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                    required
                  />
                  <Input
                    label="Technologies (comma separated)"
                    value={formData.technologies?.join(', ')}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value.split(',').map(s => s.trim()) })}
                  />
                  <Input
                    label="Focus Area"
                    value={formData.focus_area}
                    onChange={(e) => setFormData({ ...formData, focus_area: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">Student Outcome</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm resize-none"
                    rows={2}
                    value={formData.student_outcome}
                    onChange={(e) => setFormData({ ...formData, student_outcome: e.target.value })}
                    required
                  ></textarea>
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
              </form>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <Button variant="ghost" onClick={handleCloseModal}>Cancel</Button>
              <Button variant="primary" type="submit" form="course-form">
                {editingCourse ? 'Update Course' : 'Create Course'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
