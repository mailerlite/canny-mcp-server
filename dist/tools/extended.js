import { z } from 'zod';
import { buildError, buildSuccess } from '../utils/response.js';
import { validateToolInput } from '../utils/validation.js';
const GetCategoriesSchema = z.object({
    boardId: z.string().min(1, 'Board ID is required'),
});
const GetCommentsSchema = z.object({
    postId: z.string().min(1, 'Post ID is required'),
    limit: z.number().min(1).max(50).optional().default(10),
    skip: z.number().min(0).optional().default(0),
});
const GetUsersSchema = z.object({
    limit: z.number().min(1).max(50).optional().default(10),
    skip: z.number().min(0).optional().default(0),
    search: z.string().optional(),
});
const GetTagsSchema = z.object({
    boardId: z.string().optional(),
    limit: z.number().min(1).max(50).optional().default(20),
});
/**
 * Tool to get categories from a specific board
 */
export const getCategoresTool = {
    name: 'get_categories',
    description: 'Get all categories from a specific Canny board',
    inputSchema: {
        type: 'object',
        properties: {
            boardId: { type: 'string', description: 'ID of the board to get categories from' },
        },
        required: ['boardId'],
        additionalProperties: false,
    },
    handler: async (args, client) => {
        const { boardId } = validateToolInput(args, GetCategoriesSchema);
        const response = await client.getCategories(boardId);
        if (response.error) {
            return buildError('API_ERROR', `Failed to fetch categories: ${response.error}`);
        }
        const categories = (response.data ?? []).map(category => ({
            id: category.id,
            name: category.name,
            postCount: category.postCount ?? 0,
            parentId: category.parentID ?? null,
            createdAt: category.created ?? null,
            url: category.board?.url ?? null,
        }));
        return buildSuccess({
            boardId,
            categories,
            count: categories.length,
        });
    },
};
/**
 * Tool to get comments from a specific post
 */
export const getCommentsTool = {
    name: 'get_comments',
    description: 'Get comments from a specific Canny post',
    inputSchema: {
        type: 'object',
        properties: {
            postId: { type: 'string', description: 'ID of the post to get comments from' },
            limit: { type: 'number', minimum: 1, maximum: 50, default: 10, description: 'Number of comments to retrieve' },
            skip: { type: 'number', minimum: 0, default: 0, description: 'Number of comments to skip for pagination' },
        },
        required: ['postId'],
        additionalProperties: false,
    },
    handler: async (args, client) => {
        const { postId, limit, skip } = validateToolInput(args, GetCommentsSchema);
        const response = await client.getComments(postId, { limit, skip });
        if (response.error) {
            return buildError('API_ERROR', `Failed to fetch comments: ${response.error}`);
        }
        const comments = (response.data?.comments ?? []).map(comment => ({
            id: comment.id,
            value: comment.value,
            createdAt: comment.created,
            createdAtLocal: comment.created ? new Date(comment.created).toLocaleString() : undefined,
            author: {
                id: comment.author?.id,
                name: comment.author?.name,
                email: comment.author?.email,
                isAdmin: comment.author?.isAdmin ?? false,
            },
            internal: comment.internal ?? false,
            url: comment.url ?? null,
        }));
        return buildSuccess({
            postId,
            comments,
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
 * Tool to get users/authors from Canny
 */
export const getUsersTool = {
    name: 'get_users',
    description: 'Get users/authors from your Canny instance',
    inputSchema: {
        type: 'object',
        properties: {
            limit: { type: 'number', minimum: 1, maximum: 50, default: 10, description: 'Number of users to retrieve' },
            skip: { type: 'number', minimum: 0, default: 0, description: 'Number of users to skip for pagination' },
            search: { type: 'string', description: 'Search term to filter users by name or email' },
        },
        additionalProperties: false,
    },
    handler: async (args, client) => {
        const { limit, skip, search } = validateToolInput(args, GetUsersSchema);
        const response = await client.getUsers({ limit, skip, search });
        if (response.error) {
            return buildError('API_ERROR', `Failed to fetch users: ${response.error}`);
        }
        const users = (response.data?.users ?? []).map(user => ({
            id: user.id,
            name: user.name,
            email: user.email ?? null,
            isAdmin: user.isAdmin ?? false,
            createdAt: user.created,
            createdAtLocal: user.created ? new Date(user.created).toLocaleString() : undefined,
            avatarUrl: user.avatarURL ?? null,
            userId: user.userID ?? null,
            url: user.url ?? null,
            lastSeen: user.lastSeen ?? null,
        }));
        return buildSuccess({
            users,
            pagination: {
                hasMore: response.data?.hasMore ?? false,
                next: response.data?.next ?? null,
                skip: skip ?? 0,
                limit,
            },
            total: users.length,
            search,
        });
    },
};
/**
 * Tool to get tags from boards
 */
export const getTagsTool = {
    name: 'get_tags',
    description: 'Get all tags from Canny boards (optionally filtered by board)',
    inputSchema: {
        type: 'object',
        properties: {
            boardId: { type: 'string', description: 'Optional: ID of specific board to get tags from' },
            limit: { type: 'number', minimum: 1, maximum: 50, default: 20, description: 'Number of tags to retrieve' },
        },
        additionalProperties: false,
    },
    handler: async (args, client) => {
        const { boardId, limit } = validateToolInput(args, GetTagsSchema);
        const response = await client.getTags({ boardId, limit });
        if (response.error) {
            return buildError('API_ERROR', `Failed to fetch tags: ${response.error}`);
        }
        const tags = (response.data?.tags ?? []).map(tag => ({
            id: tag.id,
            name: tag.name,
            color: tag.color ?? null,
            postCount: tag.postCount ?? 0,
            url: tag.url ?? null,
            createdAt: tag.created ?? null,
        }));
        return buildSuccess({
            boardId: boardId ?? null,
            tags,
            pagination: {
                hasMore: response.data?.hasMore ?? false,
                next: response.data?.next ?? null,
                limit,
            },
        });
    },
};
//# sourceMappingURL=extended.js.map