import { CannyApiResponse, CannyPost, CannyBoard } from './types.js';
/**
 * Canny API Client
 * Implements Customer-Centric approach by providing reliable API access
 * Following Efficiency principle by implementing proper error handling and retries
 */
export declare class CannyClient {
    private apiKey;
    private baseUrl;
    private client;
    private rateLimitTracker;
    constructor(apiKey: string, baseUrl?: string);
    private checkRateLimit;
    private makeRequest;
    /**
     * Get all boards accessible to the API key
     */
    getBoards(): Promise<CannyApiResponse<CannyBoard[]>>;
    /**
     * Get posts from a specific board
     */
    getPosts(boardId: string, options?: {
        limit?: number;
        skip?: number;
        status?: string;
        search?: string;
        sort?: 'newest' | 'oldest' | 'relevance' | 'trending';
    }): Promise<CannyApiResponse<{
        posts: CannyPost[];
        hasMore: boolean;
    }>>;
    /**
     * Get a specific post by ID
     */
    getPost(postId: string): Promise<CannyApiResponse<CannyPost>>;
    /**
     * Create a new post
     */
    createPost(data: {
        authorID: string;
        boardID: string;
        title: string;
        details?: string;
        categoryID?: string;
        customFields?: Record<string, any>;
    }): Promise<CannyApiResponse<CannyPost>>;
    /**
     * Update an existing post
     */
    updatePost(postId: string, data: {
        title?: string;
        details?: string;
        categoryID?: string;
        customFields?: Record<string, any>;
        status?: string;
    }): Promise<CannyApiResponse<CannyPost>>;
    /**
     * Search posts across all accessible boards
     */
    searchPosts(query: string, options?: {
        boardIDs?: string[];
        limit?: number;
        status?: string;
    }): Promise<CannyApiResponse<{
        posts: CannyPost[];
        hasMore: boolean;
    }>>;
}
//# sourceMappingURL=canny.d.ts.map