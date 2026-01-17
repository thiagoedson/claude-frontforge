/**
 * Extract component name from prompt
 */
export function extractComponentName(prompt: string): string {
  // Look for quoted names first (higher priority)
  const quotedMatch = prompt.match(/["'](\w+)["']/);
  if (quotedMatch && quotedMatch[1]) {
    return capitalizeFirst(quotedMatch[1]);
  }

  // Try to find a component name in the prompt
  const match = prompt.match(/(?:create|generate|build|make)\s+(?:a\s+)?(\w+)/i);
  if (match && match[1]) {
    return capitalizeFirst(match[1]);
  }

  // Default to Component
  return 'Component';
}

/**
 * Capitalize first letter of a string
 */
export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate a filename from component name
 */
export function generateFileName(componentName: string, extension = 'tsx'): string {
  return `${componentName}.${extension}`;
}

/**
 * Format timestamp for logging
 */
export function formatTimestamp(date = new Date()): string {
  return date.toISOString().replace('T', ' ').substring(0, 19);
}
