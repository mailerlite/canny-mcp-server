import { CannyClient } from '../client/canny.js';
import { getBoardsTool } from './boards.js';
import { getCategoresTool, getCommentsTool, getTagsTool, getUsersTool } from './extended.js';
import { createPostTool, getPostsTool, getPostTool, searchPostsTool, updatePostTool } from './posts.js';
export interface Tool {
    name: string;
    description: string;
    inputSchema: any;
    handler: (args: unknown, client: CannyClient) => Promise<string>;
}
/**
 * All available Canny MCP tools
 * Following CIQ's Excellence principle - comprehensive toolset for customer feedback management
 */
export declare const tools: Tool[];
export { createPostTool, getBoardsTool, getCategoresTool, getCommentsTool, getPostsTool, getPostTool, getTagsTool, getUsersTool, searchPostsTool, updatePostTool };
//# sourceMappingURL=index.d.ts.map