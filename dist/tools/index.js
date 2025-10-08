import { getBoardsTool } from './boards.js';
import { getCategoresTool, getCommentsTool, getTagsTool, getUsersTool, } from './extended.js';
import { createPostTool, getPostsTool, getPostTool, searchPostsTool, updatePostTool, } from './posts.js';
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
    // Extended functionality
    getCategoresTool,
    getCommentsTool,
    getUsersTool,
    getTagsTool,
];
// Export individual tools for testing
export { createPostTool, getBoardsTool, getCategoresTool, getCommentsTool, getPostsTool, getPostTool, getTagsTool, getUsersTool, searchPostsTool, updatePostTool };
//# sourceMappingURL=index.js.map