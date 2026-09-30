import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { FirestoreService } from '../../services/firestore';
import { User, Phone, Calendar, BookOpen, FolderKanban, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Student } from '../../types';

const ITEMS_PER_PAGE = 10;

export const AdminStudentData: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [unbooked, setUnbooked] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'enrollments' | 'unbooked'>('bookings');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bookingsData, enrollmentsData, unbookedData] = await Promise.all([
          FirestoreService.getAllBookingsWithStudents(),
          FirestoreService.getAllEnrollmentsWithStudents(),
          FirestoreService.getStudentsWithoutBookings()
        ]);
        setBookings(bookingsData);
        setEnrollments(enrollmentsData);
        setUnbooked(unbookedData);
      } catch (err) {
        console.error("Failed to fetch student data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Reset pagination when switching tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const getPaginatedData = () => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    if (activeTab === 'bookings') return { data: bookings.slice(start, end), total: bookings.length };
    if (activeTab === 'enrollments') return { data: enrollments.slice(start, end), total: enrollments.length };
    return { data: unbooked.slice(start, end), total: unbooked.length };
  };

  const { data: currentData, total: totalItems } = getPaginatedData();
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Students & Bookings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor student subscriptions, project bookings, and find students who haven't booked yet.
        </p>
      </div>

      <div className="flex gap-4 border-b border-gray-200 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'bookings'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          Project Bookings
          <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
            {bookings.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('enrollments')}
          className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'enrollments'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Course Subscriptions
          <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
            {enrollments.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('unbooked')}
          className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'unbooked'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Unbooked Students
          <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
            {unbooked.length}
          </span>
        </button>
      </div>

      <Card className="overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">Student</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/5">Contact</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">
                  {activeTab === 'bookings' ? 'Project' : activeTab === 'enrollments' ? 'Course' : 'College Details'}
                </th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/6">
                  {activeTab === 'unbooked' ? 'Joined' : 'Date'}
                </th>
                {activeTab !== 'unbooked' && (
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/6">Status</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentData.length > 0 ? (
                currentData.map((item: any, idx) => (
                  <tr key={item.booking_id || item.enrollment_id || item.student_id || idx} className="hover:bg-gray-50 transition-colors">
                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {item.profile_image ? (
                          <img src={item.profile_image} alt="" className="w-6 h-6 rounded-full" />
                        ) : (
                          <User className="w-5 h-5 text-gray-400" />
                        )}
                        <span className="font-semibold text-gray-900 truncate max-w-[150px]">
                          {item.student_name || item.name}
                        </span>
                      </div>
                    </td>
                    
                    {/* Contact Info */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                          <Phone className="w-3.5 h-3.5 text-gray-500" />
                          {item.student_mobile || item.mobile || 'N/A'}
                        </div>
                        {activeTab === 'unbooked' && (
                          <span className="text-xs text-gray-500 truncate mt-0.5">{item.email}</span>
                        )}
                      </div>
                    </td>
                    
                    {/* Item Details (Project/Course/College) */}
                    <td className="py-3 px-4">
                      {activeTab === 'bookings' ? (
                        <span className="text-sm font-medium text-gray-900">{item.project_title}</span>
                      ) : activeTab === 'enrollments' ? (
                        <span className="text-sm font-medium text-gray-900">{item.course_title}</span>
                      ) : (
                        <div className="flex flex-col text-sm">
                          <span className="font-medium text-gray-900 truncate">{item.college || 'No college'}</span>
                          <span className="text-xs text-gray-500">{item.branch} · {item.year}</span>
                        </div>
                      )}
                    </td>
                    
                    {/* Date */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(item.booked_at || item.enrolled_at || item.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    
                    {/* Status (Only for bookings and enrollments) */}
                    {activeTab !== 'unbooked' && (
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'CONFIRMED' || item.status === 'COMPLETED' || item.status === 'ENROLLED' ? 'bg-green-100 text-green-800' :
                          item.status === 'PENDING' || item.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={activeTab === 'unbooked' ? 4 : 5} className="py-12 text-center text-gray-500 text-sm">
                    No records found for this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalItems > 0 && (
          <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between bg-white sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}</span> of <span className="font-medium">{totalItems}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-brand-50 border-brand-500 text-brand-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
            
            {/* Mobile Pagination */}
            <div className="flex items-center justify-between w-full sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
