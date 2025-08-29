"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannyClient = void 0;
const axios_1 = __importDefault(require("axios"));
const types_js_1 = require("./types.js");
class RateLimiter {
    tokens;
    lastRefill;
    maxTokens;
    refillRate; // tokens per second
    constructor(requestsPerMinute) {
        this.maxTokens = requestsPerMinute;
        this.refillRate = requestsPerMinute / 60; // convert to per second
        this.tokens = this.maxTokens;
        this.lastRefill = Date.now();
    }
    async wait() {
        this.refill();
        if (this.tokens >= 1) {
            this.tokens -= 1;
            return;
        }
        // Calculate wait time for next token
        const waitTime = (1 / this.refillRate) * 1000; // ms
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.wait();
    }
    refill() {
        const now = Date.now();
        const timePassed = (now - this.lastRefill) / 1000; // seconds
        const tokensToAdd = timePassed * this.refillRate;
        this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
        this.lastRefill = now;
    }
}
class CannyClient {
    client;
    rateLimiter;
    config;
    constructor(config) {
        this.config = {
            baseURL: 'https://canny.io/api/v1',
            timeout: 30000,
            rateLimitRpm: 100,
            enableWebhooks: false,
            webhookSecret: '',
            logLevel: 'info',
            ...config
        };
        this.rateLimiter = new RateLimiter(this.config.rateLimitRpm);
        this.client = axios_1.default.create({
            baseURL: this.config.baseURL,
            timeout: this.config.timeout,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Setup response interceptor for error handling
        this.client.interceptors.response.use((response) => response, (error) => this.handleError(error));
    }
    handleError(error) {
        if (error.response) {
            const { status, data } = error.response;
            if (status === 429) {
                const retryAfter = parseInt(error.response.headers['retry-after'] || '60');
                throw new types_js_1.RateLimitError(retryAfter);
            }
            if (status >= 400) {
                throw new types_js_1.CannyAPIError(data?.error || `HTTP ${status} error`, status, data?.code, status >= 500 || status === 429);
            }
        }
        throw new types_js_1.CannyAPIError(error.message || 'Unknown API error', undefined, undefined, true);
    }
}
exports.CannyClient = CannyClient;
//# sourceMappingURL=cannyClient.js.map