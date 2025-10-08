import { z } from 'zod';
import { formatDate } from '../utils/helpers.js';
import { buildError, buildSuccess } from '../utils/response.js';
import { validateToolInput } from '../utils/validation.js';
const GetPostsSchema = z.object({
    boardId: z.string().min(1, 'Board ID is required'),
    limit: z.number().min(1).max(50).optional().default(10),
    skip: z.number().min(0).optional().default(0),
    status: z.enum(['open', 'under review', 'planned', 'in progress', 'complete', 'closed']).optional(),
    search: z.string().optional(),
    sort: z.enum(['newest', 'oldest', 'relevance', 'trending']).optional(),
    tagIds: z.array(z.string()).optional(),
    categoryIds: z.array(z.string()).optional(),
});
const GetPostSchema = z.object({
    postId: z.string().min(1, 'Post ID is required'),
});
const SearchPostsSchema = z.object({
    query: z.string().min(1, 'Search query is required'),
    boardIds: z.array(z.string()).optional(),
    limit: z.number().min(1).max(50).optional().default(20),
    skip: z.number().min(0).optional().default(0),
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
            limit: { type: 'number', minimum: 1, maximum: 50, description: 'Number of posts to retrieve' },
            skip: { type: 'number', minimum: 0, description: 'Number of posts to skip for pagination' },
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
            tagIds: {
                type: 'array',
                description: 'Optional tag IDs to filter posts',
                items: { type: 'string' },
            },
            categoryIds: {
                type: 'array',
                description: 'Optional category IDs to filter posts',
                items: { type: 'string' },
            },
        },
        required: ['boardId'],
        additionalProperties: false,
    },
    handler: async (args, client) => {
        const { boardId, limit, skip, status, search, sort, tagIds, categoryIds } = validateToolInput(args, GetPostsSchema);
        const response = await client.getPosts(boardId, {
            limit,
            skip,
            status,
            search,
            sort,
            tagIDs: tagIds,
            categoryIDs: categoryIds,
        });
        if (response.error) {
            throw new Error(`Failed to fetch posts: ${response.error}`);
        }
        const posts = (response.data?.posts ?? []).map(normalizePost);
        return buildSuccess({
            boardId,
            posts,
            pagination: {
                hasMore: response.data?.hasMore ?? false,
                next: response.data?.next ?? null,
                skip: skip ?? 0,
                limit,
            },
        });
    },
};
function normalizePost(post) {
    const createdAt = post.createdAt || post.created;
    const updatedAt = post.updatedAt || post.updated;
    const rawVoteCount = typeof post.voteCount === 'number' ? post.voteCount : post.votes ?? 0;
    return {
        id: post.id,
        title: post.title,
        status: post.status,
        details: post.details ?? null,
        votes: rawVoteCount,
        voteCount: typeof post.voteCount === 'number' ? post.voteCount : post.votes,
        board: {
            id: post.board?.id,
            name: post.board?.name,
            url: post.board?.url,
            isPrivate: post.board?.isPrivate,
            postCount: post.board?.postCount,
        },
        author: {
            id: post.author?.id,
            name: post.author?.name,
            email: post.author?.email,
            url: post.author?.url,
            userID: post.author?.userID,
            isAdmin: post.author?.isAdmin,
        },
        category: post.category
            ? {
                id: post.category.id,
                name: post.category.name,
                url: post.category.url,
            }
            : null,
        tags: (post.tags || []).map(tag => ({
            id: tag.id,
            name: tag.name,
            color: tag.color,
        })),
        url: post.url,
        score: post.score,
        commentCount: post.commentCount,
        eta: post.eta ?? null,
        imageURLs: post.imageURLs || [],
        originURL: post.originURL ?? null,
        assignedAdmins: (post.assignedAdmins || []).map(admin => ({
            id: admin.id,
            name: admin.name,
            email: admin.email,
            url: admin.url,
        })),
        customFields: post.customFields ?? null,
        createdAt,
        createdAtLocal: formatDate(createdAt),
        updatedAt,
        updatedAtLocal: formatDate(updatedAt),
    };
}
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
    handler: async (args, client) => {
        const { postId } = validateToolInput(args, GetPostSchema);
        const response = await client.getPost(postId);
        if (response.error) {
            return buildError('API_ERROR', `Failed to fetch post: ${response.error}`);
        }
        if (!response.data) {
            return buildError('NOT_FOUND', `Post with ID ${postId} not found`);
        }
        const post = normalizePost(response.data);
        return buildSuccess(post);
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
            skip: { type: 'number', minimum: 0, default: 0, description: 'Number of posts to skip for pagination' },
        },
        required: ['query'],
        additionalProperties: false,
    },
    handler: async (args, client) => {
        const { query, boardIds, limit, status, skip } = validateToolInput(args, SearchPostsSchema);
        const response = await client.searchPosts(query, { boardIDs: boardIds, limit, status, skip });
        if (response.error) {
            return buildError('API_ERROR', `Failed to search posts: ${response.error}`);
        }
        const posts = (response.data?.posts ?? []).map(normalizePost);
        return buildSuccess({
            query,
            posts,
            pagination: {
                hasMore: response.data?.hasMore ?? false,
                next: response.data?.next ?? null,
                skip: skip ?? 0,
                limit,
            },
        });
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
    handler: async (args, client) => {
        const { authorId, boardId, title, details, categoryId, customFields } = validateToolInput(args, CreatePostSchema);
        const response = await client.createPost({
            authorID: authorId,
            boardID: boardId,
            title,
            details,
            categoryID: categoryId,
            customFields,
        });
        if (response.error) {
            return buildError('API_ERROR', `Failed to create post: ${response.error}`);
        }
        if (!response.data) {
            return buildError('EMPTY_RESPONSE', 'Post creation failed - no data returned');
        }
        const post = normalizePost(response.data);
        return buildSuccess({
            message: 'Post created successfully',
            post,
        });
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
    handler: async (args, client) => {
        const { postId, title, details, categoryId, customFields, status } = validateToolInput(args, UpdatePostSchema);
        const response = await client.updatePost(postId, {
            title,
            details,
            categoryID: categoryId,
            customFields,
            status,
        });
        if (response.error) {
            return buildError('API_ERROR', `Failed to update post: ${response.error}`);
        }
        if (!response.data) {
            return buildError('EMPTY_RESPONSE', 'Post update failed - no data returned');
        }
        const post = normalizePost(response.data);
        return buildSuccess({
            message: 'Post updated successfully',
            post,
        });
    },
};
//# sourceMappingURL=posts.js.map