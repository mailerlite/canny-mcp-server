import { CannyClient } from '../client/canny.js';
import { getBoardsTool } from './boards.js';
import { getPostsTool, getPostTool, searchPostsTool, createPostTool, updatePostTool } from './posts.js';
import { getCategoresTool, getCommentsTool, getUsersTool, getTagsTool } from './extended.js';
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
export { getBoardsTool, getPostsTool, getPostTool, searchPostsTool, createPostTool, updatePostTool, getCategoresTool, getCommentsTool, getUsersTool, getTagsTool, };
//# sourceMappingURL=index.d.ts.map