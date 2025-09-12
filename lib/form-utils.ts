import { z } from "zod";

// Format Zod validation errors for display
export const formatValidationErrors = (error: any): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};

  if (error.errors && Array.isArray(error.errors)) {
    error.errors.forEach((err: any) => {
      const field = err.path.join(".");
      if (field) {
        formattedErrors[field] = err.message;
      }
    });
  }

  return formattedErrors;
};

// Sanitize input strings
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "");
};

// Validate and sanitize a URL
export const validateAndSanitizeUrl = (url: string): string | null => {
  try {
    const sanitized = sanitizeInput(url);
    if (!sanitized) return null;

    // Check if it's a valid URL
    new URL(sanitized);

    // Only allow http, https, and relative URLs
    if (
      sanitized.startsWith("http://") ||
      sanitized.startsWith("https://") ||
      sanitized.startsWith("/")
    ) {
      return sanitized;
    }

    return null;
  } catch {
    return null;
  }
};
