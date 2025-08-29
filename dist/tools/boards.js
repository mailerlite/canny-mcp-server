"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoardsTool = void 0;
const zod_1 = require("zod");
const validation_js_1 = require("../utils/validation.js");
const GetBoardsSchema = zod_1.z.object({});
/**
 * Tool to list all accessible Canny boards
 * Customer-Centric: Provides clear overview of available boards
 */
exports.getBoardsTool = {
    name: 'get_boards',
    description: 'List all Canny boards accessible with the current API key',
    inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
    },
    handler: async (args, client) => {
        (0, validation_js_1.validateToolInput)(args, GetBoardsSchema);
        const response = await client.getBoards();
        if (response.error) {
            throw new Error(`Failed to fetch boards: ${response.error}`);
        }
        if (!response.data || response.data.length === 0) {
            return 'No boards found or you do not have access to any boards.';
        }
        const boards = response.data.map(board => ({
            id: board.id,
            name: board.name,
            url: board.url,
            postCount: board.postCount,
            isPrivate: board.isPrivate,
        }));
        return `Found ${boards.length} board(s):\n\n${boards
            .map(board => `**${board.name}** (ID: ${board.id})\n` +
            `  - URL: ${board.url}\n` +
            `  - Posts: ${board.postCount}\n` +
            `  - Private: ${board.isPrivate ? 'Yes' : 'No'}\n`)
            .join('\n')}`;
    },
};
//# sourceMappingURL=boards.js.map