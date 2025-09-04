/**
 * Utility functions for search functionality
 */

/**
 * Sanitizes and processes search queries for PostgreSQL full-text search
 * @param query - Raw search query from user input
 * @returns Processed query string suitable for PostgreSQL full-text search
 */
export const processSearchQuery = (query: string): string => {
  if (!query || typeof query !== "string") {
    return "";
  }

  // Remove special characters and normalize whitespace
  const sanitized = query
    .trim()
    .replace(/[^\w\s]/g, " ") // Replace special chars with spaces
    .replace(/\s+/g, " ") // Normalize multiple spaces to single space
    .toLowerCase();

  // Split into words and filter out empty strings
  const words = sanitized.split(" ").filter(Boolean);

  // Join with PostgreSQL full-text search operator
  return words.join(" & ");
};

/**
 * Builds Prisma where clause for tag-based filtering
 * @param filters - Filter options including status, tags, and date range
 * @returns Prisma where clause object
 */
export const buildTagFilterWhere = (filters: {
  status?: "all" | "published" | "draft";
  tags?: Array<{ id?: string; name: string }>;
  dateRange?: { from?: Date; to?: Date };
}) => {
  const where: any = {};

  // Add status filter
  if (filters.status === "published") {
    where.published = true;
  } else if (filters.status === "draft") {
    where.published = false;
  }

  // Add tag filter
  if (filters.tags && filters.tags.length > 0) {
    where.tags = {
      some: {
        name: {
          in: filters.tags.map((tag) => tag.name),
        },
      },
    };
  }

  // Add date range filter
  if (filters.dateRange) {
    if (filters.dateRange.from) {
      where.createdAt = {
        ...where.createdAt,
        gte: filters.dateRange.from,
      };
    }
    if (filters.dateRange.to) {
      where.createdAt = {
        ...where.createdAt,
        lte: filters.dateRange.to,
      };
    }
  }

  return where;
};

/**
 * Builds Prisma where clause for post search
 * @param query - Search query string
 * @param publishedOnly - Whether to filter for published posts only
 * @returns Prisma where clause object
 */
export const buildPostSearchWhere = (query?: string, publishedOnly = false) => {
  const where: any = {};

  // Add published filter if needed
  if (publishedOnly) {
    where.published = true;
  }

  // Add search functionality if query is provided
  if (query && query.trim()) {
    const processedQuery = processSearchQuery(query);
    if (processedQuery) {
      where.OR = [
        { title: { search: processedQuery } },
        { excerpt: { search: processedQuery } },
        { content: { search: processedQuery } },
      ];
    }
  }

  return where;
};

/**
 * Validates search query parameters
 * @param query - Search query string
 * @param limit - Number of results to return
 * @returns Validation result with sanitized values
 */
export const validateSearchParams = (query?: string, limit?: number) => {
  const errors: string[] = [];

  if (query && query.length > 100) {
    errors.push("Search query is too long (max 100 characters)");
  }

  if (limit && (limit < 1 || limit > 50)) {
    errors.push("Limit must be between 1 and 50");
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedQuery: query?.trim(),
    sanitizedLimit: limit ? Math.max(1, Math.min(50, limit)) : 10,
  };
};
