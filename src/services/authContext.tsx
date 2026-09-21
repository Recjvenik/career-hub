import React, { createContext, useState, useEffect, useContext } from 'react';
import { GoogleAuthUser, Student } from '../types';
import { ApiService } from './api';

interface AuthContextType {
  user: GoogleAuthUser | null;
  student: Student | null;
  isAuthenticated: boolean;
  isRegistered: boolean;
  loading: boolean;
  loginWithGoogleMock: (demoUser?: Partial<GoogleAuthUser>) => Promise<Student | null>;
  setGoogleAuthUser: (authUser: GoogleAuthUser) => Promise<Student | null>;
  saveStudentProfile: (profileData: Partial<Student>) => Promise<Student>;
  signOut: () => void;
  refreshProfile: () => Promise<void>;
}

const STORAGE_KEY_USER = 'careerpath_google_user';
const STORAGE_KEY_STUDENT = 'careerpath_student';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<GoogleAuthUser | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth state from local storage or mock initial demo session
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedUserStr = localStorage.getItem(STORAGE_KEY_USER);
        if (savedUserStr) {
          const parsedUser: GoogleAuthUser = JSON.parse(savedUserStr);
          setUser(parsedUser);
          const foundStudent = await ApiService.getStudentByGoogleId(parsedUser.google_id);
          if (foundStudent) {
            setStudent(foundStudent);
          }
        }
      } catch (e) {
        console.error('Auth initialization error:', e);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const setGoogleAuthUser = async (authUser: GoogleAuthUser): Promise<Student | null> => {
    setLoading(true);
    try {
      setUser(authUser);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(authUser));

      const existingStudent = await ApiService.getStudentByGoogleId(authUser.google_id);
      if (existingStudent) {
        setStudent(existingStudent);
        localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(existingStudent));
        return existingStudent;
      } else {
        setStudent(null);
        localStorage.removeItem(STORAGE_KEY_STUDENT);
        return null;
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogleMock = async (demoUser?: Partial<GoogleAuthUser>): Promise<Student | null> => {
    const defaultMock: GoogleAuthUser = {
      google_id: demoUser?.google_id || 'google-demo-101',
      email: demoUser?.email || 'himanshu.student@example.edu',
      name: demoUser?.name || 'Himanshu Sharma',
      picture: demoUser?.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    };
    return await setGoogleAuthUser(defaultMock);
  };

  const saveStudentProfile = async (profileData: Partial<Student>): Promise<Student> => {
    setLoading(true);
    try {
      const payload: Partial<Student> = {
        ...profileData,
        google_id: user?.google_id || profileData.google_id || `google-${Date.now()}`,
        email: user?.email || profileData.email || 'student@example.edu',
        name: profileData.name || user?.name || 'Student Name',
        profile_image: user?.picture || profileData.profile_image || '',
      };

      const saved = await ApiService.saveStudent(payload);
      setStudent(saved);
      localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(saved));
      return saved;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    setStudent(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_STUDENT);
  };

  const refreshProfile = async () => {
    if (user?.google_id) {
      const updated = await ApiService.getStudentByGoogleId(user.google_id);
      if (updated) {
        setStudent(updated);
        localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(updated));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        isAuthenticated: Boolean(user),
        isRegistered: Boolean(student),
        loading,
        loginWithGoogleMock,
        setGoogleAuthUser,
        saveStudentProfile,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
