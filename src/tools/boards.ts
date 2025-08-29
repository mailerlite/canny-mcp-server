import { z } from 'zod';
import { CannyClient } from '../client/canny.js';
import { validateToolInput } from '../utils/validation.js';

const GetBoardsSchema = z.object({});
type GetBoardsInput = z.infer<typeof GetBoardsSchema>;

/**
 * Tool to list all accessible Canny boards
 * Customer-Centric: Provides clear overview of available boards
 */
export const getBoardsTool = {
  name: 'get_boards',
  description: 'List all Canny boards accessible with the current API key',
  inputSchema: {
    type: 'object',
    properties: {},
    additionalProperties: false,
  },
  handler: async (args: unknown, client: CannyClient) => {
    validateToolInput<GetBoardsInput>(args, GetBoardsSchema);
    
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
      .map(board => 
        `**${board.name}** (ID: ${board.id})\n` +
        `  - URL: ${board.url}\n` +
        `  - Posts: ${board.postCount}\n` +
        `  - Private: ${board.isPrivate ? 'Yes' : 'No'}\n`
      )
      .join('\n')}`;
  },
};
