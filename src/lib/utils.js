/**
 * Utility functions for Dhanda Bhatta Company
 */

/**
 * Conditionally joins class names together.
 * Lightweight alternative to clsx/tailwind-merge without extra bloated deps.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format Indian numbering system for brick counts (e.g., 25,000 or 1,00,000)
 */
export function formatBrickCount(count) {
  if (typeof count !== "number") return count;
  return new Intl.NumberFormat("en-IN").format(count);
}
