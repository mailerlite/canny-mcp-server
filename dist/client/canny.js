"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannyClient = void 0;
const axios_1 = __importDefault(require("axios"));
const config_js_1 = require("../config/config.js");
/**
 * Canny API Client
 * Implements Customer-Centric approach by providing reliable API access
 * Following Efficiency principle by implementing proper error handling and retries
 */
class CannyClient {
    apiKey;
    baseUrl;
    client;
    rateLimitTracker = new Map();
    constructor(apiKey, baseUrl = config_js_1.CONFIG.baseUrl) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.client = axios_1.default.create({
            baseURL: this.baseUrl,
            timeout: config_js_1.CONFIG.timeout,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Add request interceptor for API key and rate limiting
        this.client.interceptors.request.use((config) => {
            // Add API key to request
            if (config.method === 'get') {
                config.params = { ...config.params, apiKey: this.apiKey };
            }
            else {
                config.data = { ...config.data, apiKey: this.apiKey };
            }
            // Check rate limiting
            this.checkRateLimit(config.url || '');
            return config;
        }, (error) => Promise.reject(error));
    }
    checkRateLimit(endpoint) {
        const now = Date.now();
        const windowMs = 60 * 1000; // 1 minute window
        if (!this.rateLimitTracker.has(endpoint)) {
            this.rateLimitTracker.set(endpoint, []);
        }
        const requests = this.rateLimitTracker.get(endpoint);
        // Remove old requests outside the window
        const validRequests = requests.filter(time => now - time < windowMs);
        if (validRequests.length >= config_js_1.CONFIG.rateLimit.requestsPerMinute) {
            throw new Error(`Rate limit exceeded for endpoint: ${endpoint}`);
        }
        validRequests.push(now);
        this.rateLimitTracker.set(endpoint, validRequests);
    }
    async makeRequest(config) {
        try {
            const response = await this.client.request(config);
            return {
                data: response.data,
                status: response.status,
            };
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                return {
                    error: error.response?.data?.error || error.message,
                    status: error.response?.status || 500,
                };
            }
            return {
                error: error instanceof Error ? error.message : 'Unknown error',
                status: 500,
            };
        }
    }
    /**
     * Get all boards accessible to the API key
     */
    async getBoards() {
        return this.makeRequest({
            method: 'GET',
            url: '/boards/list',
        });
    }
    /**
     * Get posts from a specific board
     */
    async getPosts(boardId, options) {
        return this.makeRequest({
            method: 'GET',
            url: '/posts/list',
            params: {
                boardID: boardId,
                limit: options?.limit || 10,
                skip: options?.skip || 0,
                ...(options?.status && { status: options.status }),
                ...(options?.search && { search: options.search }),
                ...(options?.sort && { sort: options.sort }),
            },
        });
    }
    /**
     * Get a specific post by ID
     */
    async getPost(postId) {
        return this.makeRequest({
            method: 'GET',
            url: '/posts/retrieve',
            params: { id: postId },
        });
    }
    /**
     * Create a new post
     */
    async createPost(data) {
        return this.makeRequest({
            method: 'POST',
            url: '/posts/create',
            data,
        });
    }
    /**
     * Update an existing post
     */
    async updatePost(postId, data) {
        return this.makeRequest({
            method: 'POST',
            url: '/posts/change_status',
            data: { postID: postId, ...data },
        });
    }
    /**
     * Search posts across all accessible boards
     */
    async searchPosts(query, options) {
        return this.makeRequest({
            method: 'GET',
            url: '/posts/list',
            params: {
                search: query,
                limit: options?.limit || 20,
                ...(options?.boardIDs && { boardIDs: options.boardIDs.join(',') }),
                ...(options?.status && { status: options.status }),
            },
        });
    }
}
exports.CannyClient = CannyClient;
//# sourceMappingURL=canny.js.map