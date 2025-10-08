/**
 * Utility functions for the Canny MCP Server
 * Following CIQ's Efficient principle - maximize existing resources
 */

export function formatDate(dateString?: string | null): string | undefined {
  if (!dateString) {
    return undefined;
  }

  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) {
    return dateString ?? undefined;
  }

  return parsed.toLocaleString();
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
