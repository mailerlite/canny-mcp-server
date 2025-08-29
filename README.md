# Canny MCP Server

A Model Context Protocol (MCP) server that integrates with Canny.io for customer feedback management. Built following CIQ's CODE2 principles to deliver Customer-Centric, Optimistic, Dedicated, Efficient, and Excellent solutions.

## Features

### Customer-Centric
- **Board Management**: List and access all available Canny boards
- **Post Retrieval**: Get detailed post information with flexible filtering
- **Search Capability**: Find posts across boards using powerful search
- **Content Management**: Create and update posts seamlessly

### Efficient & Excellent
- **Rate Limiting**: Built-in protection against API rate limits
- **Error Handling**: Robust error handling with detailed feedback
- **Validation**: Input validation using Zod schemas
- **Type Safety**: Full TypeScript implementation

## Installation

### Prerequisites
- Node.js 18 or higher
- Canny.io API key

### Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   export CANNY_API_KEY="your_api_key_here"
   export CANNY_BASE_URL="https://canny.io/api/v1"  # Optional
   ```

3. **Build the server:**
   ```bash
   npm run build
   ```

4. **Run in development mode:**
   ```bash
   npm run dev
   ```

## Environment Variables

### Required
- `CANNY_API_KEY`: Your Canny.io API key

### Optional
- `CANNY_BASE_URL`: API base URL (default: https://canny.io/api/v1)
- `CANNY_TIMEOUT`: Request timeout in ms (default: 30000)
- `CANNY_MAX_RETRIES`: Max retry attempts (default: 3)
- `CANNY_RATE_LIMIT_RPM`: Requests per minute limit (default: 60)
- `CANNY_RATE_LIMIT_BURST`: Burst limit (default: 10)

## Available Tools

### Board Tools
- `get_boards`: List all accessible Canny boards

### Post Tools
- `get_posts`: Get posts from a specific board with filtering options
- `get_post`: Get detailed information about a specific post
- `search_posts`: Search for posts across boards
- `create_post`: Create a new post in a board
- `update_post`: Update an existing post

## Usage Examples

### Get All Boards
```json
{
  "name": "get_boards",
  "arguments": {}
}
```

### Get Posts from a Board
```json
{
  "name": "get_posts",
  "arguments": {
    "boardId": "board_123",
    "limit": 10,
    "status": "open",
    "sort": "newest"
  }
}
```

### Search Posts
```json
{
  "name": "search_posts",
  "arguments": {
    "query": "feature request",
    "limit": 20,
    "status": "open"
  }
}
```

### Create a Post
```json
{
  "name": "create_post",
  "arguments": {
    "authorId": "user_123",
    "boardId": "board_123",
    "title": "New Feature Request",
    "details": "Detailed description of the feature"
  }
}
```

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Building
```bash
npm run build
```

## Configuration with Claude

Add to your Claude MCP configuration:

```json
{
  "mcpServers": {
    "canny": {
      "command": "node",
      "args": ["/path/to/canny-mcp-server/dist/server.js"],
      "env": {
        "CANNY_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Error Handling

The server implements comprehensive error handling:
- API rate limiting protection
- Input validation with detailed error messages
- Network error recovery with retries
- Graceful handling of API failures

## Contributing

Following CIQ's CODE2 principles:

1. **Customer-Centric**: Focus on user value in every contribution
2. **Optimistic**: Approach challenges as opportunities
3. **Dedicated**: Own your contributions fully
4. **Efficient**: Leverage existing solutions and automate where possible
5. **Excellent**: Maintain high standards and continuous improvement

## License

MIT License
