"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnvironment = validateEnvironment;
exports.validateToolInput = validateToolInput;
const config_js_1 = require("../config/config.js");
/**
 * Validates the environment configuration
 * Following CIQ's Excellence principle - validate thoroughly before proceeding
 */
function validateEnvironment() {
    const errors = [];
    const warnings = [];
    // Check required environment variables
    for (const envVar of config_js_1.REQUIRED_ENV_VARS) {
        const value = process.env[envVar];
        if (!value || value.trim() === '') {
            errors.push(`Missing required environment variable: ${envVar}`);
        }
    }
    // Validate API key format (basic check)
    if (config_js_1.CONFIG.apiKey && !config_js_1.CONFIG.apiKey.match(/^[a-zA-Z0-9_-]+$/)) {
        warnings.push('API key format may be invalid - should contain only alphanumeric characters, dashes, and underscores');
    }
    // Validate timeout values
    if (config_js_1.CONFIG.timeout < 1000) {
        warnings.push('Timeout value is very low (< 1000ms) - may cause frequent timeouts');
    }
    if (config_js_1.CONFIG.timeout > 300000) {
        warnings.push('Timeout value is very high (> 300000ms) - may cause long waits');
    }
    // Validate rate limiting values
    if (config_js_1.CONFIG.rateLimit.requestsPerMinute > 300) {
        warnings.push('Rate limit is set very high - may exceed Canny API limits');
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}
/**
 * Validates input parameters for tools
 */
function validateToolInput(input, schema) {
    try {
        return schema.parse(input);
    }
    catch (error) {
        throw new Error(`Invalid input parameters: ${error instanceof Error ? error.message : 'Unknown validation error'}`);
    }
}
//# sourceMappingURL=validation.js.map