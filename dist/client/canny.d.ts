import { CannyApiResponse, CannyBoard, CannyCategory, CannyListCommentsResponse, CannyListPostsResponse, CannyListTagsResponse, CannyListUsersResponse, CannyPost } from './types.js';
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
        tagIDs?: string[];
        categoryIDs?: string[];
    }): Promise<CannyApiResponse<CannyListPostsResponse>>;
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
        customFields?: Record<string, unknown>;
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
        skip?: number;
    }): Promise<CannyApiResponse<CannyListPostsResponse>>;
    /**
     * Get categories from a specific board
     */
    getCategories(boardId: string): Promise<CannyApiResponse<CannyCategory[]>>;
    /**
     * Get comments from a specific post
     */
    getComments(postId: string, options?: {
        limit?: number;
        skip?: number;
    }): Promise<CannyApiResponse<CannyListCommentsResponse>>;
    /**
     * Get users from your Canny instance
     */
    getUsers(options?: {
        limit?: number;
        skip?: number;
        search?: string;
    }): Promise<CannyApiResponse<CannyListUsersResponse>>;
    /**
     * Get tags from boards
     */
    getTags(options?: {
        boardId?: string;
        limit?: number;
    }): Promise<CannyApiResponse<CannyListTagsResponse>>;
}
//# sourceMappingURL=canny.d.ts.map