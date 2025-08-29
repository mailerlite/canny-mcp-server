import { z } from 'zod';
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
            throw new Error(`Failed to fetch categories: ${response.error}`);
        }
        if (!response.data || response.data.length === 0) {
            return `No categories found for board ${boardId}.`;
        }
        const categories = response.data.map(category => ({
            id: category.id,
            name: category.name,
            postCount: category.postCount || 0,
        }));
        return `Found ${categories.length} category(ies) in board:\n\n${categories
            .map(category => `**${category.name}** (ID: ${category.id})\n` +
            `  Posts: ${category.postCount}\n`)
            .join('\n')}`;
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
            throw new Error(`Failed to fetch comments: ${response.error}`);
        }
        if (!response.data?.comments || response.data.comments.length === 0) {
            return `No comments found for post ${postId}.`;
        }
        const comments = response.data.comments.map(comment => ({
            id: comment.id,
            author: comment.author.name,
            value: comment.value?.substring(0, 200) + (comment.value && comment.value.length > 200 ? '...' : ''),
            created: new Date(comment.created).toLocaleDateString(),
            isInternal: comment.internal || false,
        }));
        return `Found ${comments.length} comment(s) for post ${postId}:\n\n${comments
            .map((comment, index) => `${index + 1}. **${comment.author}** (${comment.created})${comment.isInternal ? ' [INTERNAL]' : ''}\n` +
            `   "${comment.value}"\n`)
            .join('\n')}${response.data.hasMore ? '\n(More comments available - increase limit or skip to see more)' : ''}`;
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
            throw new Error(`Failed to fetch users: ${response.error}`);
        }
        if (!response.data?.users || response.data.users.length === 0) {
            return 'No users found matching the criteria.';
        }
        const users = response.data.users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email || 'No email',
            isAdmin: user.isAdmin || false,
            created: new Date(user.created).toLocaleDateString(),
        }));
        return `Found ${users.length} user(s):\n\n${users
            .map((user, index) => `${index + 1}. **${user.name}**${user.isAdmin ? ' [ADMIN]' : ''}\n` +
            `   Email: ${user.email}\n` +
            `   Joined: ${user.created}\n`)
            .join('\n')}${response.data.hasMore ? '\n(More users available - increase limit or skip to see more)' : ''}`;
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
            throw new Error(`Failed to fetch tags: ${response.error}`);
        }
        if (!response.data?.tags || response.data.tags.length === 0) {
            return boardId ? `No tags found for board ${boardId}.` : 'No tags found.';
        }
        const tags = response.data.tags.map(tag => ({
            id: tag.id,
            name: tag.name,
            postCount: tag.postCount || 0,
        }));
        return `Found ${tags.length} tag(s):\n\n${tags
            .map(tag => `**${tag.name}** (ID: ${tag.id})\n` +
            `  Posts: ${tag.postCount}\n`)
            .join('\n')}`;
    },
};
//# sourceMappingURL=extended.js.map