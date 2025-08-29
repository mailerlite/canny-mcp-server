#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { CannyClient } from './client/canny.js';
import { CONFIG } from './config/config.js';
import { tools } from './tools/index.js';
import { validateEnvironment } from './utils/validation.js';

class CannyMCPServer {
  private server: Server;
  private cannyClient: CannyClient;

  constructor() {
    this.server = new Server(
      {
        name: 'canny-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Validate environment and initialize client
    const validation = validateEnvironment();
    if (!validation.isValid) {
      throw new Error(`Configuration error: ${validation.errors.join(', ')}`);
    }

    this.cannyClient = new CannyClient(CONFIG.apiKey!, CONFIG.baseUrl);
    this.setupToolHandlers();
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      const tool = tools.find(t => t.name === name);
      if (!tool) {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Tool "${name}" not found`
        );
      }

      try {
        const result = await tool.handler(args, this.cannyClient);
        return {
          content: [
            {
              type: 'text',
              text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${errorMessage}`
        );
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Canny MCP Server running on stdio');
  }
}

// Start the server
async function main(): Promise<void> {
  try {
    const server = new CannyMCPServer();
    await server.run();
  } catch (error) {
    console.error('Failed to start Canny MCP Server:', error);
    process.exit(1);
  }
}

if (typeof require !== 'undefined' && require.main === module) {
  main().catch((error: Error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { CannyMCPServer };
