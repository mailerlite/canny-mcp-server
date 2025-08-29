import { getBoardsTool } from './boards.js';
import { getPostsTool, getPostTool, searchPostsTool, createPostTool, updatePostTool } from './posts.js';
/**
 * All available Canny MCP tools
 * Following CIQ's Excellence principle - comprehensive toolset for customer feedback management
 */
export const tools = [
    // Board management
    getBoardsTool,
    // Post management
    getPostsTool,
    getPostTool,
    searchPostsTool,
    createPostTool,
    updatePostTool,
    // Extended functionality - temporarily disabled for debugging
    // getCategoresTool,
    // getCommentsTool,
    // getUsersTool,
    // getTagsTool,
];
// Export individual tools for testing
export { getBoardsTool, getPostsTool, getPostTool, searchPostsTool, createPostTool, updatePostTool,
// getCategoresTool,
// getCommentsTool,
// getUsersTool,
// getTagsTool,
 };
//# sourceMappingURL=index.js.map