/**
 * Defense-in-depth sanitization for user text inputs.
 * React JSX auto-escapes rendered content, so the main goal here is
 * stripping HTML/script tags and enforcing length limits at the storage boundary.
 */

/** Remove HTML tags and enforce max length */
export function sanitizeInput(input: string, maxLen = 500): string {
  return input
    .trim()
    .replace(/<[^>]*>/g, "")
    .slice(0, maxLen);
}

/** Sanitize with longer limit (for multi-line questions) */
export function sanitizeLong(input: string, maxLen = 2000): string {
  return sanitizeInput(input, maxLen);
}

/** Validate Chinese mobile phone number */
export function isValidPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone);
}
