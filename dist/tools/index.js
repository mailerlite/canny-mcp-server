"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostTool = exports.createPostTool = exports.searchPostsTool = exports.getPostTool = exports.getPostsTool = exports.getBoardsTool = exports.tools = void 0;
const boards_js_1 = require("./boards.js");
Object.defineProperty(exports, "getBoardsTool", { enumerable: true, get: function () { return boards_js_1.getBoardsTool; } });
const posts_js_1 = require("./posts.js");
Object.defineProperty(exports, "getPostsTool", { enumerable: true, get: function () { return posts_js_1.getPostsTool; } });
Object.defineProperty(exports, "getPostTool", { enumerable: true, get: function () { return posts_js_1.getPostTool; } });
Object.defineProperty(exports, "searchPostsTool", { enumerable: true, get: function () { return posts_js_1.searchPostsTool; } });
Object.defineProperty(exports, "createPostTool", { enumerable: true, get: function () { return posts_js_1.createPostTool; } });
Object.defineProperty(exports, "updatePostTool", { enumerable: true, get: function () { return posts_js_1.updatePostTool; } });
/**
 * All available Canny MCP tools
 * Following CIQ's Excellence principle - comprehensive toolset for customer feedback management
 */
exports.tools = [
    // Board management
    boards_js_1.getBoardsTool,
    // Post management
    posts_js_1.getPostsTool,
    posts_js_1.getPostTool,
    posts_js_1.searchPostsTool,
    posts_js_1.createPostTool,
    posts_js_1.updatePostTool,
];
//# sourceMappingURL=index.js.map