import { CannyClient } from '../client/canny.js';
import { getBoardsTool } from './boards.js';
import { 
  getPostsTool, 
  getPostTool, 
  searchPostsTool, 
  createPostTool, 
  updatePostTool 
} from './posts.js';

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
export const tools: Tool[] = [
  // Board management
  getBoardsTool,
  
  // Post management
  getPostsTool,
  getPostTool,
  searchPostsTool,
  createPostTool,
  updatePostTool,
];

// Export individual tools for testing
export {
  getBoardsTool,
  getPostsTool,
  getPostTool,
  searchPostsTool,
  createPostTool,
  updatePostTool,
};
