// Utilities for search and filtering
export const processSearchQuery = (query: string): string => {
  if (!query || typeof query !== "string") {
    return "";
  }

  // Remove special characters and normalize whitespace
  const sanitized = query
    .trim()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();

  // Split into words and filter out empty strings
  const words = sanitized.split(" ").filter(Boolean);

  // Join with PostgreSQL full-text search operator
  return words.join(" & ");
};

// Build Prisma where clause for tag-based filtering
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

// Build Prisma where clause for post search
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

// Validate search query parameters
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
