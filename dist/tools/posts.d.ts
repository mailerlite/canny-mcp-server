import { CannyClient } from '../client/canny.js';
/**
 * Tool to get posts from a specific board
 * Customer-Centric: Provides detailed post information with filtering options
 */
export declare const getPostsTool: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            boardId: {
                type: string;
                description: string;
            };
            limit: {
                type: string;
                minimum: number;
                maximum: number;
                default: number;
                description: string;
            };
            skip: {
                type: string;
                minimum: number;
                default: number;
                description: string;
            };
            status: {
                type: string;
                enum: string[];
                description: string;
            };
            search: {
                type: string;
                description: string;
            };
            sort: {
                type: string;
                enum: string[];
                description: string;
            };
        };
        required: string[];
        additionalProperties: boolean;
    };
    handler: (args: unknown, client: CannyClient) => Promise<string>;
};
/**
 * Tool to get a specific post by ID
 * Customer-Centric: Provides complete post details for thorough analysis
 */
export declare const getPostTool: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            postId: {
                type: string;
                description: string;
            };
        };
        required: string[];
        additionalProperties: boolean;
    };
    handler: (args: unknown, client: CannyClient) => Promise<string>;
};
/**
 * Tool to search posts across boards
 * Efficient: Searches across multiple boards with a single query
 */
export declare const searchPostsTool: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            query: {
                type: string;
                description: string;
            };
            boardIds: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            limit: {
                type: string;
                minimum: number;
                maximum: number;
                default: number;
                description: string;
            };
            status: {
                type: string;
                enum: string[];
                description: string;
            };
        };
        required: string[];
        additionalProperties: boolean;
    };
    handler: (args: unknown, client: CannyClient) => Promise<string>;
};
/**
 * Tool to create a new post
 * Customer-Centric: Enables easy creation of feedback posts
 */
export declare const createPostTool: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            authorId: {
                type: string;
                description: string;
            };
            boardId: {
                type: string;
                description: string;
            };
            title: {
                type: string;
                description: string;
            };
            details: {
                type: string;
                description: string;
            };
            categoryId: {
                type: string;
                description: string;
            };
            customFields: {
                type: string;
                description: string;
                additionalProperties: boolean;
            };
        };
        required: string[];
        additionalProperties: boolean;
    };
    handler: (args: unknown, client: CannyClient) => Promise<string>;
};
/**
 * Tool to update an existing post
 * Dedicated: Committed to maintaining post accuracy and status
 */
export declare const updatePostTool: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            postId: {
                type: string;
                description: string;
            };
            title: {
                type: string;
                description: string;
            };
            details: {
                type: string;
                description: string;
            };
            categoryId: {
                type: string;
                description: string;
            };
            customFields: {
                type: string;
                description: string;
                additionalProperties: boolean;
            };
            status: {
                type: string;
                enum: string[];
                description: string;
            };
        };
        required: string[];
        additionalProperties: boolean;
    };
    handler: (args: unknown, client: CannyClient) => Promise<string>;
};
//# sourceMappingURL=posts.d.ts.map