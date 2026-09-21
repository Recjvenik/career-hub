import { Student } from '../types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function getInitials(name: string): string {
  if (!name) return 'ST';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function calculateProfileCompletion(student: Partial<Student> | null): number {
  if (!student) return 0;
  const fields: (keyof Student)[] = [
    'name',
    'email',
    'mobile',
    'location',
    'gender',
    'college',
    'branch',
    'year',
    'semester',
  ];
  let filled = 0;
  for (const field of fields) {
    if (student[field] && String(student[field]).trim().length > 0) {
      filled++;
    }
  }
  return Math.round((filled / fields.length) * 100);
}
