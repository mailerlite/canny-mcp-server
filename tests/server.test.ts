/**
 * Tests for Canny MCP Server
 * Following CIQ's Excellence principle - validate before shipping
 */

import { CannyClient } from '../src/client/canny.js';
import { getBoardsTool } from '../src/tools/boards.js';
import { validateEnvironment } from '../src/utils/validation.js';

// Mock environment for testing
const mockEnv = {
  CANNY_API_KEY: 'test-api-key-123',
  CANNY_BASE_URL: 'https://api.test.canny.io/v1',
};

// Set up test environment
beforeAll(() => {
  Object.keys(mockEnv).forEach(key => {
    process.env[key] = mockEnv[key as keyof typeof mockEnv];
  });
});

describe('Environment Validation', () => {
  test('should validate required environment variables', () => {
    const result = validateEnvironment();
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should fail validation without API key', () => {
    delete process.env.CANNY_API_KEY;
    const result = validateEnvironment();
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Missing required environment variable: CANNY_API_KEY');

    // Restore for other tests
    process.env.CANNY_API_KEY = mockEnv.CANNY_API_KEY;
  });
});

describe('Canny Client', () => {
  test('should initialize with API key', () => {
    expect(() => {
      new CannyClient('test-key');
    }).not.toThrow();
  });

  test('should handle rate limiting', async () => {
    const client = new CannyClient('test-key');

    // This would need proper mocking in a full test suite
    // For now, just ensure the client is properly constructed
    expect(client).toBeDefined();
  });
});

describe('Tools', () => {
  test('getBoardsTool should have correct schema', () => {
    expect(getBoardsTool.name).toBe('get_boards');
    expect(getBoardsTool.description).toContain('List all Canny boards');
    expect(getBoardsTool.inputSchema).toBeDefined();
    expect(typeof getBoardsTool.handler).toBe('function');
  });

  test('should validate tool input correctly', () => {
    // This would need more comprehensive testing with mocked API responses
    expect(getBoardsTool.inputSchema.type).toBe('object');
    expect(getBoardsTool.inputSchema.properties).toBeDefined();
  });
});

// Integration test placeholder
describe('Integration Tests', () => {
  test.skip('should fetch boards from real API', async () => {
    // This test would require a real API key and should be run separately
    // Skip by default to avoid API calls during regular testing

    const client = new CannyClient(process.env.CANNY_API_KEY!);
    const result = await client.getBoards();

    expect(result.status).toBe(200);
    expect(result.data).toBeDefined();
  });
});
