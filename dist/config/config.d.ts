/**
 * Configuration management for Canny MCP Server
 * Handles environment variables and validates required settings
 */
interface Config {
    apiKey?: string;
    baseUrl: string;
    timeout: number;
    maxRetries: number;
    rateLimit: {
        requestsPerMinute: number;
        burstLimit: number;
    };
}
export declare const CONFIG: Config;
export declare const REQUIRED_ENV_VARS: readonly ["CANNY_API_KEY"];
export declare const OPTIONAL_ENV_VARS: readonly ["CANNY_BASE_URL", "CANNY_TIMEOUT", "CANNY_MAX_RETRIES", "CANNY_RATE_LIMIT_RPM", "CANNY_RATE_LIMIT_BURST"];
export {};
//# sourceMappingURL=config.d.ts.map