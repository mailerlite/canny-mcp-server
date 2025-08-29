import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { CONFIG } from '../config/config.js';
import { 
  CannyApiResponse, 
  CannyPost, 
  CannyBoard 
} from './types.js';

/**
 * Canny API Client
 * Implements Customer-Centric approach by providing reliable API access
 * Following Efficiency principle by implementing proper error handling and retries
 */
export class CannyClient {
  private client: AxiosInstance;
  private rateLimitTracker: Map<string, number[]> = new Map();

  constructor(private apiKey: string, private baseUrl: string = CONFIG.baseUrl) {
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for API key and rate limiting
    this.client.interceptors.request.use(
      (config) => {
        // Add API key to request
        if (config.method === 'get') {
          config.params = { ...config.params, apiKey: this.apiKey };
        } else {
          config.data = { ...config.data, apiKey: this.apiKey };
        }

        // Check rate limiting
        this.checkRateLimit(config.url || '');
        
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  private checkRateLimit(endpoint: string): void {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    
    if (!this.rateLimitTracker.has(endpoint)) {
      this.rateLimitTracker.set(endpoint, []);
    }
    
    const requests = this.rateLimitTracker.get(endpoint)!;
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= CONFIG.rateLimit.requestsPerMinute) {
      throw new Error(`Rate limit exceeded for endpoint: ${endpoint}`);
    }
    
    validRequests.push(now);
    this.rateLimitTracker.set(endpoint, validRequests);
  }

  private async makeRequest<T>(config: AxiosRequestConfig): Promise<CannyApiResponse<T>> {
    try {
      const response = await this.client.request<T>(config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
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
  async getBoards(): Promise<CannyApiResponse<CannyBoard[]>> {
    return this.makeRequest<CannyBoard[]>({
      method: 'GET',
      url: '/boards/list',
    });
  }

  /**
   * Get posts from a specific board
   */
  async getPosts(boardId: string, options?: {
    limit?: number;
    skip?: number;
    status?: string;
    search?: string;
    sort?: 'newest' | 'oldest' | 'relevance' | 'trending';
  }): Promise<CannyApiResponse<{ posts: CannyPost[]; hasMore: boolean }>> {
    return this.makeRequest<{ posts: CannyPost[]; hasMore: boolean }>({
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
  async getPost(postId: string): Promise<CannyApiResponse<CannyPost>> {
    return this.makeRequest<CannyPost>({
      method: 'GET',
      url: '/posts/retrieve',
      params: { id: postId },
    });
  }

  /**
   * Create a new post
   */
  async createPost(data: {
    authorID: string;
    boardID: string;
    title: string;
    details?: string;
    categoryID?: string;
    customFields?: Record<string, any>;
  }): Promise<CannyApiResponse<CannyPost>> {
    return this.makeRequest<CannyPost>({
      method: 'POST',
      url: '/posts/create',
      data,
    });
  }

  /**
   * Update an existing post
   */
  async updatePost(postId: string, data: {
    title?: string;
    details?: string;
    categoryID?: string;
    customFields?: Record<string, any>;
    status?: string;
  }): Promise<CannyApiResponse<CannyPost>> {
    return this.makeRequest<CannyPost>({
      method: 'POST',
      url: '/posts/change_status',
      data: { postID: postId, ...data },
    });
  }

  /**
   * Search posts across all accessible boards
   */
  async searchPosts(query: string, options?: {
    boardIDs?: string[];
    limit?: number;
    status?: string;
  }): Promise<CannyApiResponse<{ posts: CannyPost[]; hasMore: boolean }>> {
    return this.makeRequest<{ posts: CannyPost[]; hasMore: boolean }>({
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
