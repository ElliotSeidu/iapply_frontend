/**
 * Calculates real-time password strength
 */
export function getPasswordStrength(password) {
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
    let label = "Very Weak";
    let color = "#ba1a1a"; // Red

    if (points >= 80) {
        label = "Very Strong";
        color = "#006d3c"; // Green
    } else if (points >= 60) {
        label = "Strong";
        color = "#2563eb"; // Blue
    } else if (points >= 40) {
        label = "Medium";
        color = "#d97706"; // Amber
    } else if (points >= 20) {
        label = "Weak";
        color = "#ea580c"; // Orange
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
