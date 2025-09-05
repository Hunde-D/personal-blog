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

// Get the first error message for a field
export const getFieldError = (
  errors: Record<string, string> | undefined,
  field: string,
): string | undefined => {
  if (!errors) return undefined;
  return errors[field];
};

// Does a field have an error?
export const hasFieldError = (
  errors: Record<string, string> | undefined,
  field: string,
): boolean => {
  return !!getFieldError(errors, field);
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

// Truncate text to a specified length with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

// Generate a slug from a string
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

// Validate image file upload
export const validateImageFile = (
  file: File,
): { isValid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024;
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (file.size > maxSize) {
    return { isValid: false, error: "File size must be less than 5MB" };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Only JPEG, PNG, WebP, and GIF images are allowed",
    };
  }

  return { isValid: true };
};

// Debounce a function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle a function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Format a date for display
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
};

// Format a relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  return formatDate(dateObj);
};
