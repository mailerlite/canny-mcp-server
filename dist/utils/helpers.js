"use strict";
/**
 * Utility functions for the Canny MCP Server
 * Following CIQ's Efficient principle - maximize existing resources
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.CannyError = void 0;
exports.formatDate = formatDate;
exports.truncateText = truncateText;
exports.formatPostStatus = formatPostStatus;
exports.formatPostSummary = formatPostSummary;
exports.validateBoardId = validateBoardId;
exports.validatePostId = validatePostId;
exports.handleApiError = handleApiError;
function formatDate(dateString) {
    try {
        return new Date(dateString).toLocaleString();
    }
    catch {
        return dateString;
    }
}
function truncateText(text, maxLength = 200) {
    if (!text)
        return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}
function formatPostStatus(status) {
    // Capitalize and format status for better readability
    return status
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
function formatPostSummary(post) {
    return `**${post.title}** (ID: ${post.id})\n` +
        `Status: ${formatPostStatus(post.status)} | Votes: ${post.votes}\n` +
        `Author: ${post.author?.name || 'Unknown'}\n` +
        `Created: ${formatDate(post.createdAt)}\n` +
        `${post.details ? `Details: ${truncateText(post.details)}\n` : ''}` +
        `URL: ${post.url}`;
}
function validateBoardId(boardId) {
    return typeof boardId === 'string' && boardId.trim().length > 0;
}
function validatePostId(postId) {
    return typeof postId === 'string' && postId.trim().length > 0;
}
class CannyError extends Error {
    statusCode;
    cause;
    constructor(message, statusCode, cause) {
        super(message);
        this.statusCode = statusCode;
        this.cause = cause;
        this.name = 'CannyError';
        if (cause) {
            this.stack = `${this.stack}\nCaused by: ${cause.stack}`;
        }
    }
}
exports.CannyError = CannyError;
function handleApiError(error, context) {
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
exports.logger = {
    info: (message, data) => {
        console.error(`[INFO] ${message}`, data ? JSON.stringify(data, null, 2) : '');
    },
    error: (message, error) => {
        console.error(`[ERROR] ${message}`, error?.stack || error?.message || '');
    },
    warn: (message, data) => {
        console.error(`[WARN] ${message}`, data ? JSON.stringify(data, null, 2) : '');
    },
    debug: (message, data) => {
        if (process.env.DEBUG) {
            console.error(`[DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : '');
        }
    },
};
//# sourceMappingURL=helpers.js.map