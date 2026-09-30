import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { FirestoreService } from '../../services/firestore';
import { Student } from '../../types';
import { Shield, ShieldAlert, User, Check, X, Search, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const AdminStaff: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; studentId: string; isRevoke: boolean } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await FirestoreService.getAllUsers();
      setUsers(allUsers);
    } catch (err) {
      console.error("Failed to fetch staff data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleToggleRole = async (studentId: string, currentRole: string | undefined) => {
    // Prevent the master admin from removing their own privileges
    if (studentId === currentUser?.google_id || (users.find(u => u.student_id === studentId)?.email === 'gotechplace@gmail.com')) {
      setToast({ message: "Cannot modify super admin privileges.", type: 'error' });
      return;
    }

    const isCurrentlyAdmin = currentRole === 'admin';
    
    // Open the custom confirmation modal instead of window.confirm
    setConfirmModal({
      isOpen: true,
      studentId,
      isRevoke: isCurrentlyAdmin
    });
  };

  const executeToggleRole = async () => {
    if (!confirmModal) return;
    
    const { studentId, isRevoke } = confirmModal;
    setConfirmModal(null);
    setProcessingId(studentId);
    try {
      await FirestoreService.setAdminStatus(studentId, !isRevoke);
      await fetchUsers(); // Refresh the list
      setToast({ message: `Successfully ${isRevoke ? 'revoked' : 'granted'} admin privileges.`, type: 'success' });
    } catch (err) {
      console.error("Failed to update admin status", err);
      setToast({ message: "Failed to update user role. Please ensure you have permission.", type: 'error' });
    } finally {
      setProcessingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) || 
      (u.email && u.email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Custom Confirmation Modal */}
      {confirmModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setConfirmModal(null)}></div>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${confirmModal.isRevoke ? 'bg-red-100 text-red-600' : 'bg-brand-100 text-brand-600'}`}>
                {confirmModal.isRevoke ? <ShieldAlert className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {confirmModal.isRevoke ? 'Revoke Privileges?' : 'Grant Privileges?'}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to {confirmModal.isRevoke ? 'revoke' : 'grant'} admin privileges for this user? {confirmModal.isRevoke ? 'They will lose access to the CMS Panel.' : 'They will gain access to the CMS Panel.'}
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeToggleRole}
                  className={`flex-1 px-4 py-2 text-white rounded-xl text-sm font-semibold transition-colors ${
                    confirmModal.isRevoke ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-600 hover:bg-brand-700'
                  }`}
                >
                  {confirmModal.isRevoke ? 'Yes, Revoke' : 'Yes, Grant'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Staff Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage team members and grant access to the CMS Panel.
        </p>
      </div>

      {toast && (
        <div className={`p-4 rounded-xl flex items-center justify-between shadow-sm border ${
          toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 
          toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 
          'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <div className="flex items-center gap-3">
            {toast.type === 'success' ? <Check className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            <span className="font-medium text-sm">{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="p-1 hover:bg-black/5 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-gray-900">All Registered Users</h2>
          
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-80 focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Current Role</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => {
                    const isAdmin = u.role === 'admin' || u.email === 'gotechplace@gmail.com';
                    const isSuperAdmin = u.email === 'gotechplace@gmail.com';
                    const isProcessing = processingId === u.student_id;

                    return (
                      <tr key={u.student_id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {u.profile_image ? (
                              <img src={u.profile_image} alt="" className="w-8 h-8 rounded-full" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-500" />
                              </div>
                            )}
                            <span className="font-semibold text-gray-900">{u.name || 'Unnamed User'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            {u.email}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {isSuperAdmin ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                              <ShieldAlert className="w-3.5 h-3.5" /> Super Admin
                            </span>
                          ) : isAdmin ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-800">
                              <Shield className="w-3.5 h-3.5" /> Staff Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              Standard User
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isSuperAdmin ? (
                            <span className="text-xs text-gray-400 italic">Unmodifiable</span>
                          ) : (
                            <button
                              onClick={() => handleToggleRole(u.student_id, u.role)}
                              disabled={isProcessing}
                              className={`inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${
                                isAdmin 
                                  ? 'bg-red-50 text-red-700 hover:bg-red-100' 
                                  : 'bg-green-50 text-green-700 hover:bg-green-100'
                              }`}
                            >
                              {isProcessing ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : isAdmin ? (
                                <>
                                  <X className="w-4 h-4" /> Revoke Access
                                </>
                              ) : (
                                <>
                                  <Check className="w-4 h-4" /> Grant Admin
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-500">
                      No users found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
