export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateRegistrationForm(data: {
  name: string;
  mobile: string;
  location: string;
  gender: string;
  college: string;
  branch: string;
  year: string;
  semester: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Please enter a valid full name.';
  }

  const phoneRegex = /^\d{10}$/;
  const cleanMobile = data.mobile ? data.mobile.replace(/[\s\-\+\(\)]/g, '') : '';
  if (!cleanMobile || !phoneRegex.test(cleanMobile)) {
    errors.mobile = 'Please enter a valid 10-digit mobile number.';
  }

  if (!data.location || data.location.trim().length < 2) {
    errors.location = 'Please enter your city and state.';
  }

  if (!data.gender) {
    errors.gender = 'Please select your gender.';
  }

  if (!data.college || data.college.trim().length < 2) {
    errors.college = 'Please enter your college or institution name.';
  }

  if (!data.branch) {
    errors.branch = 'Please select your academic branch.';
  }

  if (!data.year) {
    errors.year = 'Please select your current year.';
  }

  if (!data.semester) {
    errors.semester = 'Please select your current semester.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
