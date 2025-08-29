/**
 * Test setup file
 * Global test configuration and utilities
 */

// Mock console methods to avoid cluttering test output
global.console = {
  ...console,
  // Uncomment the next line if you want to silence console.log during tests
  // log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

// Global test timeout
jest.setTimeout(30000);

// Clean up environment after each test
afterEach(() => {
  jest.clearAllMocks();
});
