#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannyMCPServer = void 0;
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const canny_js_1 = require("./client/canny.js");
const config_js_1 = require("./config/config.js");
const index_js_2 = require("./tools/index.js");
const validation_js_1 = require("./utils/validation.js");
class CannyMCPServer {
    server;
    cannyClient;
    constructor() {
        this.server = new index_js_1.Server({
            name: 'canny-mcp-server',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        // Validate environment and initialize client
        const validation = (0, validation_js_1.validateEnvironment)();
        if (!validation.isValid) {
            throw new Error(`Configuration error: ${validation.errors.join(', ')}`);
        }
        this.cannyClient = new canny_js_1.CannyClient(config_js_1.CONFIG.apiKey, config_js_1.CONFIG.baseUrl);
        this.setupToolHandlers();
    }
    setupToolHandlers() {
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => ({
            tools: index_js_2.tools.map(tool => ({
                name: tool.name,
                description: tool.description,
                inputSchema: tool.inputSchema,
            })),
        }));
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            const tool = index_js_2.tools.find(t => t.name === name);
            if (!tool) {
                throw new types_js_1.McpError(types_js_1.ErrorCode.MethodNotFound, `Tool "${name}" not found`);
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
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                throw new types_js_1.McpError(types_js_1.ErrorCode.InternalError, `Tool execution failed: ${errorMessage}`);
            }
        });
    }
    async run() {
        const transport = new stdio_js_1.StdioServerTransport();
        await this.server.connect(transport);
        console.error('Canny MCP Server running on stdio');
    }
}
exports.CannyMCPServer = CannyMCPServer;
// Start the server
async function main() {
    try {
        const server = new CannyMCPServer();
        await server.run();
    }
    catch (error) {
        console.error('Failed to start Canny MCP Server:', error);
        process.exit(1);
    }
}
if (typeof require !== 'undefined' && require.main === module) {
    main().catch((error) => {
        console.error('Unhandled error:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=server.js.map