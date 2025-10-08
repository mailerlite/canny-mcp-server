import { z } from 'zod';
import { CannyClient } from '../client/canny.js';
import { formatDate } from '../utils/helpers.js';
import { buildError, buildSuccess } from '../utils/response.js';
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
      return buildError('API_ERROR', `Failed to fetch boards: ${response.error}`);
    }

    const boards = (response.data ?? []).map(board => ({
      id: board.id,
      name: board.name,
      url: board.url,
      isPrivate: board.isPrivate ?? false,
      postCount: board.postCount ?? 0,
      privateComments: board.privateComments ?? false,
      createdAt: board.created ?? null,
      createdAtLocal: board.created ? formatDate(board.created) : undefined,
    }));

    return buildSuccess({
      boards,
      count: boards.length,
    });
  },
};
