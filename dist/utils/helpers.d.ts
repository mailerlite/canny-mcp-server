/**
 * Utility functions for the Canny MCP Server
 * Following CIQ's Efficient principle - maximize existing resources
 */
export declare function formatDate(dateString: string): string;
export declare function truncateText(text: string, maxLength?: number): string;
export declare function formatPostStatus(status: string): string;
export declare function formatPostSummary(post: any): string;
export declare function validateBoardId(boardId: string): boolean;
export declare function validatePostId(postId: string): boolean;
export declare class CannyError extends Error {
    statusCode?: number | undefined;
    cause?: Error | undefined;
    constructor(message: string, statusCode?: number | undefined, cause?: Error | undefined);
}
export declare function handleApiError(error: any, context: string): never;
/**
 * Logger utility following CIQ's transparency principle
 */
export declare const logger: {
    info: (message: string, data?: any) => void;
    error: (message: string, error?: Error) => void;
    warn: (message: string, data?: any) => void;
    debug: (message: string, data?: any) => void;
};
//# sourceMappingURL=helpers.d.ts.map