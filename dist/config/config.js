"use strict";
/**
 * Configuration management for Canny MCP Server
 * Handles environment variables and validates required settings
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPTIONAL_ENV_VARS = exports.REQUIRED_ENV_VARS = exports.CONFIG = void 0;
exports.CONFIG = {
    apiKey: process.env.CANNY_API_KEY,
    baseUrl: process.env.CANNY_BASE_URL || 'https://canny.io/api/v1',
    timeout: parseInt(process.env.CANNY_TIMEOUT || '30000', 10),
    maxRetries: parseInt(process.env.CANNY_MAX_RETRIES || '3', 10),
    rateLimit: {
        requestsPerMinute: parseInt(process.env.CANNY_RATE_LIMIT_RPM || '60', 10),
        burstLimit: parseInt(process.env.CANNY_RATE_LIMIT_BURST || '10', 10),
    },
};
exports.REQUIRED_ENV_VARS = ['CANNY_API_KEY'];
exports.OPTIONAL_ENV_VARS = [
    'CANNY_BASE_URL',
    'CANNY_TIMEOUT',
    'CANNY_MAX_RETRIES',
    'CANNY_RATE_LIMIT_RPM',
    'CANNY_RATE_LIMIT_BURST'
];
//# sourceMappingURL=config.js.map