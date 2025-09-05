import { TRPCClientError } from "@trpc/client";
import type { AppRouter } from "@/server/api/root";

/**
 * Extracts user-friendly error message from tRPC errors
 * @param error - tRPC client error
 * @returns User-friendly error message
 */
export const getErrorMessage = (error: TRPCClientError<AppRouter>): string => {
  // Handle specific error codes
  switch (error.data?.code) {
    case "BAD_REQUEST":
      return error.message || "Invalid request data";
    case "UNAUTHORIZED":
      return "You must be logged in to perform this action";
    case "FORBIDDEN":
      return "You do not have permission to perform this action";
    case "NOT_FOUND":
      return "The requested resource was not found";
    case "CONFLICT":
      return error.message || "This resource already exists";
    case "TOO_MANY_REQUESTS":
      return "Too many requests. Please try again later";
    case "INTERNAL_SERVER_ERROR":
      return "Something went wrong. Please try again later";
    default:
      return error.message || "An unexpected error occurred";
  }
};

/**
 * Checks if an error is a tRPC client error
 * @param error - Any error object
 * @returns True if it's a tRPC client error
 */
export const isTRPCClientError = (
  error: unknown,
): error is TRPCClientError<AppRouter> => {
  return error instanceof TRPCClientError;
};

/**
 * Formats error for display in UI
 * @param error - Any error object
 * @returns Formatted error message
 */
export const formatError = (error: unknown): string => {
  // Helper to extract messages if error.message contains a JSON array of issues
  const parseArrayMessage = (msg: unknown): string | null => {
    if (typeof msg !== "string") return null;
    const trimmed = msg.trim();
    if (!trimmed.startsWith("[")) return null;
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        const messages: string[] = [];
        for (const item of parsed) {
          if (Array.isArray(item)) {
            for (const sub of item) {
              if (sub && typeof sub.message === "string")
                messages.push(sub.message);
            }
          } else if (item && typeof item.message === "string") {
            messages.push(item.message);
          }
        }
        if (messages.length > 0) {
          return messages.join("; ");
        }
      }
    } catch {
      // fall through to default handling
    }
    return null;
  };

  if (isTRPCClientError(error)) {
    // If server included a JSON-array string of issues in message, parse it
    const parsed = parseArrayMessage((error as any)?.message);
    if (parsed) return parsed;

    // Attempt to extract zodError structure if provided
    const anyErr: any = error as any;
    const zodError = anyErr?.data?.zodError;
    if (zodError) {
      const fieldErrors: Record<string, string[]> | undefined =
        zodError.fieldErrors;
      const formErrors: string[] | undefined = zodError.formErrors;
      const messages: string[] = [];
      if (fieldErrors) {
        for (const key of Object.keys(fieldErrors)) {
          const list = fieldErrors[key];
          if (Array.isArray(list)) {
            for (const msg of list) {
              if (typeof msg === "string" && msg.trim().length > 0) {
                messages.push(msg);
              }
            }
          }
        }
      }
      if (Array.isArray(formErrors)) {
        for (const msg of formErrors) {
          if (typeof msg === "string" && msg.trim().length > 0) {
            messages.push(msg);
          }
        }
      }
      if (messages.length > 0) {
        return messages.join("; ");
      }
    }

    return getErrorMessage(error);
  }

  if (error instanceof Error) {
    const parsed = parseArrayMessage(error.message);
    if (parsed) return parsed;
    return error.message;
  }

  return "An unexpected error occurred";
};

/**
 * Logs error with context for debugging
 * @param error - Error object
 * @param context - Additional context information
 */
export const logError = (
  error: unknown,
  context?: Record<string, unknown>,
): void => {
  console.error("Error occurred:", {
    error,
    context,
    timestamp: new Date().toISOString(),
    userAgent:
      typeof window !== "undefined" ? window.navigator.userAgent : "server",
  });
};
