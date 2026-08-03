export interface PasswordStrength {
  score: number; // 0 to 100
  label: 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong';
  color: string;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

/**
 * Validates email with standard RFC 5322 pattern
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email address is required' };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address (e.g. alex@example.com)' };
  }
  return { isValid: true };
}

/**
 * Calculates real-time password strength
 */
export function getPasswordStrength(password: string): PasswordStrength {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  let points = 0;
  if (password.length >= 8) points += 20;
  if (password.length >= 12) points += 10;
  if (hasUppercase) points += 20;
  if (hasLowercase) points += 15;
  if (hasNumber) points += 15;
  if (hasSpecialChar) points += 20;

  let label: PasswordStrength['label'] = 'Very Weak';
  let color = '#ba1a1a'; // Red

  if (points >= 80) {
    label = 'Very Strong';
    color = '#006d3c'; // Green
  } else if (points >= 60) {
    label = 'Strong';
    color = '#2563eb'; // Blue
  } else if (points >= 40) {
    label = 'Medium';
    color = '#d97706'; // Amber
  } else if (points >= 20) {
    label = 'Weak';
    color = '#ea580c'; // Orange
  }

  return {
    score: points,
    label,
    color,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
  };
}

/**
 * Validates URL format
 */
export function validateUrl(url: string, required = false): { isValid: boolean; error?: string } {
  if (!url || url.trim() === '') {
    if (required) return { isValid: false, error: 'URL is required' };
    return { isValid: true };
  }
  try {
    const formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    new URL(formattedUrl);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL (e.g., https://company.com/jobs/123)' };
  }
}

/**
 * Validates text inputs with min/max length
 */
export function validateText(
  text: string,
  fieldName: string,
  options: { required?: boolean; minLength?: number; maxLength?: number } = {}
): { isValid: boolean; error?: string } {
  const { required = true, minLength = 2, maxLength = 100 } = options;
  const trimmed = (text || '').trim();

  if (required && !trimmed) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  if (trimmed && minLength && trimmed.length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }
  if (trimmed && maxLength && trimmed.length > maxLength) {
    return { isValid: false, error: `${fieldName} must be less than ${maxLength} characters` };
  }

  return { isValid: true };
}

/**
 * Validates application salary text input
 */
export function validateSalary(salary: string): { isValid: boolean; error?: string } {
  if (!salary || salary.trim() === '') return { isValid: true };
  const hasNumber = /\d/.test(salary);
  if (!hasNumber) {
    return { isValid: false, error: 'Salary should include numbers (e.g. $120,000 - $150,000)' };
  }
  return { isValid: true };
}
