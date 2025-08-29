# Claude MCP Configuration for Canny Server

## Configuration File Location

Add this to your Claude MCP configuration file (usually located at):
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

## Configuration

```json
{
  "mcpServers": {
    "canny": {
      "command": "node",
      "args": ["/Users/briandawson/workspace/canny-mcp-server/dist/server.js"],
      "env": {
        "CANNY_API_KEY": "YOUR_ACTUAL_CANNY_API_KEY_HERE"
      }
    }
  }
}
```

## Getting Your Canny API Key

1. **Log into your Canny account** at https://canny.io
2. **Go to Settings** → **API**  
3. **Generate an API key** if you don't have one
4. **Copy the API key** and replace `YOUR_ACTUAL_CANNY_API_KEY_HERE` above

## Testing the Integration

After configuration, restart Claude and try these commands:

### 1. Test Connection
```
"List all my Canny boards"
```

### 2. Get Posts  
```
"Show me the latest posts from my main feedback board"
```

### 3. Search Posts
```
"Search for posts about 'feature request' in my Canny boards"
```

### 4. Get Specific Post
```
"Get detailed information about post ID [your-post-id]"
```

## Troubleshooting

### Server Not Starting
- Verify the file path is correct: `/Users/briandawson/workspace/canny-mcp-server/dist/server.js`
- Ensure your Canny API key is valid
- Check Claude's console for error messages

### API Key Issues
- Make sure you're using the correct API key format
- Verify the key has proper permissions in your Canny account
- Test the key directly with Canny's API documentation

### Rate Limiting
- The server includes built-in rate limiting (60 requests/minute by default)
- Adjust `CANNY_RATE_LIMIT_RPM` environment variable if needed

## Advanced Configuration

For advanced users, you can add additional environment variables:

```json
{
  "mcpServers": {
    "canny": {
      "command": "node", 
      "args": ["/Users/briandawson/workspace/canny-mcp-server/dist/server.js"],
      "env": {
        "CANNY_API_KEY": "your_api_key",
        "CANNY_TIMEOUT": "45000",
        "CANNY_MAX_RETRIES": "5",
        "CANNY_RATE_LIMIT_RPM": "100",
        "DEBUG": "true"
      }
    }
  }
}
```

## Success Indicators

When properly configured, you should be able to:
- ✅ Ask Claude to list your Canny boards
- ✅ Search and retrieve posts from your boards  
- ✅ Get detailed information about specific posts
- ✅ Create and update posts through Claude

The server will provide detailed, formatted responses for all Canny operations! 🚀
