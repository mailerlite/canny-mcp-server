import axios from 'axios';
import { CONFIG } from '../config/config.js';
/**
 * Canny API Client
 * Implements Customer-Centric approach by providing reliable API access
 * Following Efficiency principle by implementing proper error handling and retries
 */
export class CannyClient {
    apiKey;
    baseUrl;
    client;
    rateLimitTracker = new Map();
    constructor(apiKey, baseUrl = CONFIG.baseUrl) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.client = axios.create({
            baseURL: this.baseUrl,
            timeout: CONFIG.timeout,
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
        if (validRequests.length >= CONFIG.rateLimit.requestsPerMinute) {
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
            if (axios.isAxiosError(error)) {
                const axiosError = error;
                return {
                    error: axiosError.response?.data?.error || axiosError.response?.data?.message || axiosError.message,
                    status: axiosError.response?.status || 500,
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
        const response = await this.makeRequest({
            method: 'POST',
            url: '/boards/list',
        });
        if (response.data?.boards) {
            return {
                data: response.data.boards,
                status: response.status,
            };
        }
        return {
            data: [],
            status: response.status,
            error: response.error,
        };
    }
    /**
     * Get posts from a specific board
     */
    async getPosts(boardId, options) {
        return this.makeRequest({
            method: 'POST',
            url: '/posts/list',
            data: {
                boardID: boardId,
                limit: options?.limit,
                skip: options?.skip,
                status: options?.status,
                search: options?.search,
                sort: options?.sort,
                tagIDs: options?.tagIDs,
                categoryIDs: options?.categoryIDs,
            },
        });
    }
    /**
     * Get a specific post by ID
     */
    async getPost(postId) {
        return this.makeRequest({
            method: 'POST',
            url: '/posts/retrieve',
            data: { id: postId },
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
            url: '/posts/update',
            data: { postID: postId, ...data },
        });
    }
    /**
     * Search posts across all accessible boards
     */
    async searchPosts(query, options) {
        return this.makeRequest({
            method: 'POST',
            url: '/posts/list',
            data: {
                search: query,
                boardIDs: options?.boardIDs,
                limit: options?.limit,
                status: options?.status,
                skip: options?.skip,
            },
        });
    }
    /**
     * Get categories from a specific board
     */
    async getCategories(boardId) {
        const response = await this.makeRequest({
            method: 'POST',
            url: '/categories/list',
            data: {
                boardID: boardId,
            },
        });
        if (response.data?.categories) {
            return {
                data: response.data.categories,
                status: response.status,
            };
        }
        return {
            data: [],
            status: response.status,
            error: response.error,
        };
    }
    /**
     * Get comments from a specific post
     */
    async getComments(postId, options) {
        return this.makeRequest({
            method: 'POST',
            url: '/comments/list',
            data: {
                postID: postId,
                limit: options?.limit,
                skip: options?.skip,
            },
        });
    }
    /**
     * Get users from your Canny instance
     */
    async getUsers(options) {
        return this.makeRequest({
            method: 'POST',
            url: '/users/list',
            data: {
                limit: options?.limit,
                skip: options?.skip,
                search: options?.search,
            },
        });
    }
    /**
     * Get tags from boards
     */
    async getTags(options) {
        return this.makeRequest({
            method: 'POST',
            url: '/tags/list',
            data: {
                boardID: options?.boardId,
                limit: options?.limit,
            },
        });
    }
}
//# sourceMappingURL=canny.js.map