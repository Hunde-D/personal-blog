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
  if (isTRPCClientError(error)) {
    return getErrorMessage(error);
  }

  if (error instanceof Error) {
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
