/**
 * Utility functions for formatting data in resolvers
 */

/**
 * Converts Date objects to ISO strings
 */
export const formatDates = (obj: any) => {
  if (!obj) return obj;

  const formatted = { ...obj };

  if (formatted.createdAt instanceof Date) {
    formatted.createdAt = formatted.createdAt.toISOString();
  }
  if (formatted.updatedAt instanceof Date) {
    formatted.updatedAt = formatted.updatedAt.toISOString();
  }

  return formatted;
};

/**
 * Formats Prisma results with proper date handling
 */
export const formatPrismaResults = (results: any | any[]) => {
  if (Array.isArray(results)) {
    return results.map(formatDates);
  }
  return formatDates(results);
};
