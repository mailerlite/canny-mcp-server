import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { CONFIG } from '../config/config.js';
import {
  CannyApiResponse,
  CannyBoard,
  CannyCategory,
  CannyListCommentsResponse,
  CannyListPostsResponse,
  CannyListTagsResponse,
  CannyListUsersResponse,
  CannyPost
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
        const axiosError = error as AxiosError<{ error?: string; message?: string }>;
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
  async getBoards(): Promise<CannyApiResponse<CannyBoard[]>> {
    const response = await this.makeRequest<{ boards?: CannyBoard[] }>({
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
  async getPosts(
    boardId: string,
    options?: {
      limit?: number;
      skip?: number;
      status?: string;
      search?: string;
      sort?: 'newest' | 'oldest' | 'relevance' | 'trending';
      tagIDs?: string[];
      categoryIDs?: string[];
    }
  ): Promise<CannyApiResponse<CannyListPostsResponse>> {
    return this.makeRequest<CannyListPostsResponse>({
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
  async getPost(postId: string): Promise<CannyApiResponse<CannyPost>> {
    return this.makeRequest<CannyPost>({
      method: 'POST',
      url: '/posts/retrieve',
      data: { id: postId },
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
    customFields?: Record<string, unknown>;
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
      url: '/posts/update',
      data: { postID: postId, ...data },
    });
  }

  /**
   * Search posts across all accessible boards
   */
  async searchPosts(
    query: string,
    options?: {
      boardIDs?: string[];
      limit?: number;
      status?: string;
      skip?: number;
    }
  ): Promise<CannyApiResponse<CannyListPostsResponse>> {
    return this.makeRequest<CannyListPostsResponse>({
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
  async getCategories(boardId: string): Promise<CannyApiResponse<CannyCategory[]>> {
    const response = await this.makeRequest<{ categories?: CannyCategory[] }>({
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
  async getComments(
    postId: string,
    options?: {
      limit?: number;
      skip?: number;
    }
  ): Promise<CannyApiResponse<CannyListCommentsResponse>> {
    return this.makeRequest<CannyListCommentsResponse>({
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
  async getUsers(
    options?: {
      limit?: number;
      skip?: number;
      search?: string;
    }
  ): Promise<CannyApiResponse<CannyListUsersResponse>> {
    return this.makeRequest<CannyListUsersResponse>({
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
  async getTags(
    options?: {
      boardId?: string;
      limit?: number;
    }
  ): Promise<CannyApiResponse<CannyListTagsResponse>> {
    return this.makeRequest<CannyListTagsResponse>({
      method: 'POST',
      url: '/tags/list',
      data: {
        boardID: options?.boardId,
        limit: options?.limit,
      },
    });
  }
}
