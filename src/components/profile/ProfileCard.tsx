import React from 'react';
import { Student } from '../../types';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { calculateProfileCompletion } from '../../utils/formatters';
import { MapPin, Mail, Phone, GraduationCap, Calendar, Edit3 } from 'lucide-react';

export interface ProfileCardProps {
  student: Student;
  onEditClick?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ student, onEditClick }) => {
  const completionPct = calculateProfileCompletion(student);

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs flex flex-col gap-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Avatar src={student.profile_image} name={student.name} size="xl" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
              <Badge variant="brand" size="sm">Student</Badge>
            </div>
            <p className="text-sm font-semibold text-brand-700 mt-0.5">{student.college}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {student.branch} · {student.year} ({student.semester})
            </p>
          </div>
        </div>

        {onEditClick && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEditClick}
            icon={<Edit3 className="w-4 h-4" />}
            className="shrink-0"
          >
            Edit Profile
          </Button>
        )}
      </div>

      {/* Completion Meter */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-gray-700 uppercase tracking-wider">Profile Strength</span>
          <span className="text-brand-700">{completionPct}% Complete</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-600 rounded-full transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {/* Detail Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg border border-gray-100">
          <Mail className="w-4 h-4 text-gray-400 shrink-0" />
          <div>
            <span className="text-gray-400 block font-medium">Email Address</span>
            <span className="font-semibold text-gray-800">{student.email}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg border border-gray-100">
          <Phone className="w-4 h-4 text-gray-400 shrink-0" />
          <div>
            <span className="text-gray-400 block font-medium">Mobile Number</span>
            <span className="font-semibold text-gray-800">{student.mobile || 'Not provided'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg border border-gray-100">
          <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
          <div>
            <span className="text-gray-400 block font-medium">Location</span>
            <span className="font-semibold text-gray-800">{student.location || 'Not provided'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg border border-gray-100">
          <GraduationCap className="w-4 h-4 text-gray-400 shrink-0" />
          <div>
            <span className="text-gray-400 block font-medium">Department / Branch</span>
            <span className="font-semibold text-gray-800">{student.branch}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg border border-gray-100">
          <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
          <div>
            <span className="text-gray-400 block font-medium">Academic Year</span>
            <span className="font-semibold text-gray-800">{student.year} · {student.semester}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg border border-gray-100">
          <span className="w-4 h-4 text-gray-400 shrink-0 flex items-center justify-center font-bold">G</span>
          <div>
            <span className="text-gray-400 block font-medium">Gender</span>
            <span className="font-semibold text-gray-800">{student.gender || 'Not specified'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
