import { CannyClient } from '../client/canny.js';
/**
 * Tool to list all accessible Canny boards
 * Customer-Centric: Provides clear overview of available boards
 */
export declare const getBoardsTool: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {};
        additionalProperties: boolean;
    };
    handler: (args: unknown, client: CannyClient) => Promise<string>;
};
//# sourceMappingURL=boards.d.ts.map