import { CannyClient } from '../client/canny.js';
/**
 * Tool to get categories from a specific board
 */
export declare const getCategoresTool: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            boardId: {
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
 * Tool to get comments from a specific post
 */
export declare const getCommentsTool: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            postId: {
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
        };
        required: string[];
        additionalProperties: boolean;
    };
    handler: (args: unknown, client: CannyClient) => Promise<string>;
};
/**
 * Tool to get users/authors from Canny
 */
export declare const getUsersTool: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
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
            search: {
                type: string;
                description: string;
            };
        };
        additionalProperties: boolean;
    };
    handler: (args: unknown, client: CannyClient) => Promise<string>;
};
/**
 * Tool to get tags from boards
 */
export declare const getTagsTool: {
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
        };
        additionalProperties: boolean;
    };
    handler: (args: unknown, client: CannyClient) => Promise<string>;
};
//# sourceMappingURL=extended.d.ts.map