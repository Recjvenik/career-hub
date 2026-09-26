import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { FirestoreService } from './firestore';
import { Student, GoogleAuthUser } from '../types';

interface AuthContextType {
  user: GoogleAuthUser | null;
  student: Student | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isRegistered: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<Student | null>;
  loginWithGoogleMock: (demoUser?: Partial<GoogleAuthUser>) => Promise<Student | null>;
  setGoogleAuthUser: (authUser: GoogleAuthUser) => Promise<Student | null>;
  saveStudentProfile: (profileData: Partial<Student>) => Promise<Student>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<GoogleAuthUser | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // -------------------------------------------------------------------------
  // Firebase Auth state listener — single source of truth
  // -------------------------------------------------------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      try {
        if (fbUser) {
          setFirebaseUser(fbUser);

          const authUser: GoogleAuthUser = {
            google_id: fbUser.uid,
            email: fbUser.email ?? '',
            name: fbUser.displayName ?? '',
            picture: fbUser.photoURL ?? '',
          };
          setUser(authUser);

          // Ensure user document exists in Firestore
          await FirestoreService.createUserIfNotExists(
            fbUser.uid,
            fbUser.email ?? '',
            fbUser.displayName ?? '',
            fbUser.photoURL ?? ''
          );

          // Load student profile
          const foundStudent = await FirestoreService.getStudentByGoogleId(fbUser.uid);
          setStudent(foundStudent);
        } else {
          setFirebaseUser(null);
          setUser(null);
          setStudent(null);
        }
      } catch (e) {
        console.error('Auth state change error:', e);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // -------------------------------------------------------------------------
  // Real Google Sign-In via Firebase popup
  // -------------------------------------------------------------------------
  const signInWithGoogle = async (): Promise<Student | null> => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      await FirestoreService.createUserIfNotExists(
        fbUser.uid,
        fbUser.email ?? '',
        fbUser.displayName ?? '',
        fbUser.photoURL ?? ''
      );

      const foundStudent = await FirestoreService.getStudentByGoogleId(fbUser.uid);
      setStudent(foundStudent);
      return foundStudent;
    } catch (err) {
      console.error('Google Sign-In failed:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Legacy / Developer mock sign-in (kept for dev without Firebase config)
  // -------------------------------------------------------------------------
  const setGoogleAuthUser = async (authUser: GoogleAuthUser): Promise<Student | null> => {
    setLoading(true);
    try {
      setUser(authUser);
      await FirestoreService.createUserIfNotExists(
        authUser.google_id,
        authUser.email,
        authUser.name,
        authUser.picture
      );
      const foundStudent = await FirestoreService.getStudentByGoogleId(authUser.google_id);
      setStudent(foundStudent);
      return foundStudent;
    } catch {
      return null;
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
    return setGoogleAuthUser(defaultMock);
  };

  // -------------------------------------------------------------------------
  // Save / update student registration profile
  // -------------------------------------------------------------------------
  const saveStudentProfile = async (profileData: Partial<Student>): Promise<Student> => {
    setLoading(true);
    try {
      const payload: Partial<Student> = {
        ...profileData,
        google_id: user?.google_id || profileData.google_id || `google-${Date.now()}`,
        email: user?.email || profileData.email || '',
        name: profileData.name || user?.name || 'Student Name',
        profile_image: user?.picture || profileData.profile_image || '',
      };

      const saved = await FirestoreService.saveStudent(payload);
      setStudent(saved);
      return saved;
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Sign out
  // -------------------------------------------------------------------------
  const signOut = async () => {
    try {
      // Sign out from Firebase if a real Firebase user is logged in
      if (firebaseUser) {
        await firebaseSignOut(auth);
      }
    } finally {
      setFirebaseUser(null);
      setUser(null);
      setStudent(null);
      // Clean up any legacy localStorage keys
      localStorage.removeItem('gotechplace_google_user');
      localStorage.removeItem('gotechplace_student');
      localStorage.removeItem('careerpath_google_user');
      localStorage.removeItem('careerpath_student');
    }
  };

  // -------------------------------------------------------------------------
  // Refresh profile from Firestore
  // -------------------------------------------------------------------------
  const refreshProfile = async () => {
    if (user?.google_id) {
      const updated = await FirestoreService.getStudentByGoogleId(user.google_id);
      if (updated) setStudent(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        firebaseUser,
        isAuthenticated: Boolean(user),
        isRegistered: Boolean(student?.college),
        loading,
        signInWithGoogle,
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
