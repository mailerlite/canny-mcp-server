import { z } from 'zod';
import { CannyClient } from '../client/canny.js';
import { validateToolInput } from '../utils/validation.js';

const GetPostsSchema = z.object({
  boardId: z.string().min(1, 'Board ID is required'),
  limit: z.number().min(1).max(50).optional().default(10),
  skip: z.number().min(0).optional().default(0),
  status: z.enum(['open', 'under review', 'planned', 'in progress', 'complete', 'closed']).optional(),
  search: z.string().optional(),
  sort: z.enum(['newest', 'oldest', 'relevance', 'trending']).optional(),
});

const GetPostSchema = z.object({
  postId: z.string().min(1, 'Post ID is required'),
});

const SearchPostsSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  boardIds: z.array(z.string()).optional(),
  limit: z.number().min(1).max(50).optional().default(20),
  status: z.enum(['open', 'under review', 'planned', 'in progress', 'complete', 'closed']).optional(),
});

const CreatePostSchema = z.object({
  authorId: z.string().min(1, 'Author ID is required'),
  boardId: z.string().min(1, 'Board ID is required'),
  title: z.string().min(1, 'Title is required'),
  details: z.string().optional(),
  categoryId: z.string().optional(),
  customFields: z.record(z.any()).optional(),
});

const UpdatePostSchema = z.object({
  postId: z.string().min(1, 'Post ID is required'),
  title: z.string().optional(),
  details: z.string().optional(),
  categoryId: z.string().optional(),
  customFields: z.record(z.any()).optional(),
  status: z.enum(['open', 'under review', 'planned', 'in progress', 'complete', 'closed']).optional(),
});

type GetPostsInput = z.infer<typeof GetPostsSchema>;
type GetPostInput = z.infer<typeof GetPostSchema>;
type SearchPostsInput = z.infer<typeof SearchPostsSchema>;
type CreatePostInput = z.infer<typeof CreatePostSchema>;
type UpdatePostInput = z.infer<typeof UpdatePostSchema>;

/**
 * Tool to get posts from a specific board
 * Customer-Centric: Provides detailed post information with filtering options
 */
export const getPostsTool = {
  name: 'get_posts',
  description: 'Get posts from a specific Canny board with optional filtering',
  inputSchema: {
    type: 'object',
    properties: {
      boardId: { type: 'string', description: 'ID of the board to fetch posts from' },
      limit: { type: 'number', minimum: 1, maximum: 50, default: 10, description: 'Number of posts to retrieve' },
      skip: { type: 'number', minimum: 0, default: 0, description: 'Number of posts to skip for pagination' },
      status: { 
        type: 'string', 
        enum: ['open', 'under review', 'planned', 'in progress', 'complete', 'closed'],
        description: 'Filter by post status' 
      },
      search: { type: 'string', description: 'Search term to filter posts' },
      sort: { 
        type: 'string', 
        enum: ['newest', 'oldest', 'relevance', 'trending'],
        description: 'Sort order for posts' 
      },
    },
    required: ['boardId'],
    additionalProperties: false,
  },
  handler: async (args: unknown, client: CannyClient) => {
    const { boardId, limit, skip, status, search, sort } = validateToolInput<GetPostsInput>(args, GetPostsSchema);
    
    const response = await client.getPosts(boardId, { limit, skip, status, search, sort });
    
    if (response.error) {
      throw new Error(`Failed to fetch posts: ${response.error}`);
    }

    if (!response.data?.posts || response.data.posts.length === 0) {
      return 'No posts found matching the criteria.';
    }

    const posts = response.data.posts.map(post => ({
      id: post.id,
      title: post.title,
      details: post.details?.substring(0, 200) + (post.details && post.details.length > 200 ? '...' : ''),
      status: post.status,
      author: post.author.name,
      votes: post.votes,
      score: post.score,
      tags: post.tags.map(tag => tag.name),
      createdAt: new Date(post.createdAt).toLocaleDateString(),
      url: post.url,
    }));

    return `Found ${posts.length} post(s) in board ${boardId}:\n\n${posts
      .map((post, index) => 
        `${index + 1}. **${post.title}** (ID: ${post.id})\n` +
        `   Status: ${post.status} | Votes: ${post.votes} | Score: ${post.score}\n` +
        `   Author: ${post.author} | Created: ${post.createdAt}\n` +
        `   Tags: ${post.tags.length > 0 ? post.tags.join(', ') : 'None'}\n` +
        `   Details: ${post.details || 'No description'}\n` +
        `   URL: ${post.url}\n`
      )
      .join('\n')}${response.data.hasMore ? '\n(More posts available - increase limit or skip to see more)' : ''}`;
  },
};

/**
 * Tool to get a specific post by ID
 * Customer-Centric: Provides complete post details for thorough analysis
 */
export const getPostTool = {
  name: 'get_post',
  description: 'Get detailed information about a specific Canny post',
  inputSchema: {
    type: 'object',
    properties: {
      postId: { type: 'string', description: 'ID of the post to retrieve' },
    },
    required: ['postId'],
    additionalProperties: false,
  },
  handler: async (args: unknown, client: CannyClient) => {
    const { postId } = validateToolInput<GetPostInput>(args, GetPostSchema);
    
    const response = await client.getPost(postId);
    
    if (response.error) {
      throw new Error(`Failed to fetch post: ${response.error}`);
    }

    if (!response.data) {
      return `Post with ID ${postId} not found.`;
    }

    const post = response.data;
    return `**${post.title}**\n` +
      `ID: ${post.id}\n` +
      `Status: ${post.status}\n` +
      `Author: ${post.author.name} (${post.author.email || 'No email'})\n` +
      `Board: ${post.board.name}\n` +
      `Category: ${post.category?.name || 'None'}\n` +
      `Votes: ${post.votes} | Score: ${post.score}\n` +
      `Tags: ${post.tags.length > 0 ? post.tags.map(tag => tag.name).join(', ') : 'None'}\n` +
      `Created: ${new Date(post.createdAt).toLocaleString()}\n` +
      `Updated: ${new Date(post.updatedAt).toLocaleString()}\n` +
      `URL: ${post.url}\n\n` +
      `**Details:**\n${post.details || 'No description provided'}`;
  },
};

/**
 * Tool to search posts across boards
 * Efficient: Searches across multiple boards with a single query
 */
export const searchPostsTool = {
  name: 'search_posts',
  description: 'Search for posts across Canny boards',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query to find posts' },
      boardIds: { 
        type: 'array', 
        items: { type: 'string' },
        description: 'Optional array of board IDs to limit search scope' 
      },
      limit: { type: 'number', minimum: 1, maximum: 50, default: 20, description: 'Number of posts to retrieve' },
      status: { 
        type: 'string', 
        enum: ['open', 'under review', 'planned', 'in progress', 'complete', 'closed'],
        description: 'Filter by post status' 
      },
    },
    required: ['query'],
    additionalProperties: false,
  },
  handler: async (args: unknown, client: CannyClient) => {
    const { query, boardIds, limit, status } = validateToolInput<SearchPostsInput>(args, SearchPostsSchema);
    
    const response = await client.searchPosts(query, { boardIDs: boardIds, limit, status });
    
    if (response.error) {
      throw new Error(`Failed to search posts: ${response.error}`);
    }

    if (!response.data?.posts || response.data.posts.length === 0) {
      return `No posts found matching query: "${query}"`;
    }

    const posts = response.data.posts.map(post => ({
      id: post.id,
      title: post.title,
      board: post.board.name,
      status: post.status,
      author: post.author.name,
      votes: post.votes,
      score: post.score,
      createdAt: new Date(post.createdAt).toLocaleDateString(),
      url: post.url,
    }));

    return `Found ${posts.length} post(s) matching "${query}":\n\n${posts
      .map((post, index) => 
        `${index + 1}. **${post.title}** (ID: ${post.id})\n` +
        `   Board: ${post.board} | Status: ${post.status}\n` +
        `   Votes: ${post.votes} | Score: ${post.score}\n` +
        `   Author: ${post.author} | Created: ${post.createdAt}\n` +
        `   URL: ${post.url}\n`
      )
      .join('\n')}${response.data.hasMore ? '\n(More results available - increase limit to see more)' : ''}`;
  },
};

/**
 * Tool to create a new post
 * Customer-Centric: Enables easy creation of feedback posts
 */
export const createPostTool = {
  name: 'create_post',
  description: 'Create a new post in a Canny board',
  inputSchema: {
    type: 'object',
    properties: {
      authorId: { type: 'string', description: 'ID of the user creating the post' },
      boardId: { type: 'string', description: 'ID of the board to create the post in' },
      title: { type: 'string', description: 'Title of the post' },
      details: { type: 'string', description: 'Detailed description of the post (optional)' },
      categoryId: { type: 'string', description: 'ID of the category for the post (optional)' },
      customFields: { 
        type: 'object', 
        description: 'Custom field values as key-value pairs (optional)',
        additionalProperties: true 
      },
    },
    required: ['authorId', 'boardId', 'title'],
    additionalProperties: false,
  },
  handler: async (args: unknown, client: CannyClient) => {
    const { authorId, boardId, title, details, categoryId, customFields } = validateToolInput<CreatePostInput>(args, CreatePostSchema);
    
    const response = await client.createPost({
      authorID: authorId,
      boardID: boardId,
      title,
      details,
      categoryID: categoryId,
      customFields,
    });
    
    if (response.error) {
      throw new Error(`Failed to create post: ${response.error}`);
    }

    if (!response.data) {
      return 'Post creation failed - no data returned';
    }

    const post = response.data;
    return `Successfully created post!\n\n` +
      `**${post.title}** (ID: ${post.id})\n` +
      `Board: ${post.board.name}\n` +
      `Author: ${post.author.name}\n` +
      `Status: ${post.status}\n` +
      `Created: ${new Date(post.createdAt).toLocaleString()}\n` +
      `URL: ${post.url}`;
  },
};

/**
 * Tool to update an existing post
 * Dedicated: Committed to maintaining post accuracy and status
 */
export const updatePostTool = {
  name: 'update_post',
  description: 'Update an existing Canny post',
  inputSchema: {
    type: 'object',
    properties: {
      postId: { type: 'string', description: 'ID of the post to update' },
      title: { type: 'string', description: 'New title for the post (optional)' },
      details: { type: 'string', description: 'New description for the post (optional)' },
      categoryId: { type: 'string', description: 'New category ID for the post (optional)' },
      customFields: { 
        type: 'object', 
        description: 'Updated custom field values (optional)',
        additionalProperties: true 
      },
      status: { 
        type: 'string', 
        enum: ['open', 'under review', 'planned', 'in progress', 'complete', 'closed'],
        description: 'New status for the post (optional)' 
      },
    },
    required: ['postId'],
    additionalProperties: false,
  },
  handler: async (args: unknown, client: CannyClient) => {
    const { postId, title, details, categoryId, customFields, status } = validateToolInput<UpdatePostInput>(args, UpdatePostSchema);
    
    const response = await client.updatePost(postId, {
      title,
      details,
      categoryID: categoryId,
      customFields,
      status,
    });
    
    if (response.error) {
      throw new Error(`Failed to update post: ${response.error}`);
    }

    if (!response.data) {
      return 'Post update failed - no data returned';
    }

    const post = response.data;
    return `Successfully updated post!\n\n` +
      `**${post.title}** (ID: ${post.id})\n` +
      `Status: ${post.status}\n` +
      `Updated: ${new Date(post.updatedAt).toLocaleString()}\n` +
      `URL: ${post.url}`;
  },
};
