/**
 * Utility functions for the Canny MCP Server
 * Following CIQ's Efficient principle - maximize existing resources
 */

export function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return dateString;
  }
}

export function truncateText(text: string, maxLength: number = 200): string {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

export function formatPostStatus(status: string): string {
  // Capitalize and format status for better readability
  return status
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatPostSummary(post: any): string {
  return `**${post.title}** (ID: ${post.id})\n` +
    `Status: ${formatPostStatus(post.status)} | Votes: ${post.votes}\n` +
    `Author: ${post.author?.name || 'Unknown'}\n` +
    `Created: ${formatDate(post.createdAt)}\n` +
    `${post.details ? `Details: ${truncateText(post.details)}\n` : ''}` +
    `URL: ${post.url}`;
}

export function validateBoardId(boardId: string): boolean {
  return typeof boardId === 'string' && boardId.trim().length > 0;
}

export function validatePostId(postId: string): boolean {
  return typeof postId === 'string' && postId.trim().length > 0;
}

export class CannyError extends Error {
  constructor(message: string, public statusCode?: number, public cause?: Error) {
    super(message);
    this.name = 'CannyError';
    
    if (cause) {
      this.stack = `${this.stack}\nCaused by: ${cause.stack}`;
    }
  }
}

export function handleApiError(error: any, context: string): never {
  if (error instanceof CannyError) {
    throw error;
  }
  
  const message = error?.response?.data?.error || error?.message || 'Unknown error';
  const statusCode = error?.response?.status;
  
  throw new CannyError(`${context}: ${message}`, statusCode, error);
}

/**
 * Logger utility following CIQ's transparency principle
 */
export const logger = {
  info: (message: string, data?: any) => {
    console.error(`[INFO] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error?.stack || error?.message || '');
  },
  
  warn: (message: string, data?: any) => {
    console.error(`[WARN] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  
  debug: (message: string, data?: any) => {
    if (process.env.DEBUG) {
      console.error(`[DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
  },
};
