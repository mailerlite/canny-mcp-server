#!/usr/bin/env node

/**
 * Debug script to test the get_boards API call specifically
 * This will help us identify the exact issue with the boards endpoint
 */

const { CannyClient } = require('../dist/client/canny.js');
const { CONFIG } = require('../dist/config/config.js');

async function debugBoardsAPI() {
  console.log('🔍 Debugging Canny Boards API...\n');

  // Initialize client
  const client = new CannyClient(CONFIG.apiKey, CONFIG.baseUrl);
  
  console.log(`📡 API Base URL: ${CONFIG.baseUrl}`);
  console.log(`🔑 API Key: ${CONFIG.apiKey?.substring(0, 8)}...`);
  
  try {
    console.log('\n🧪 Testing getBoards() method...');
    const boardsResponse = await client.getBoards();
    
    console.log(`📊 Response Status: ${boardsResponse.status}`);
    
    if (boardsResponse.error) {
      console.log(`❌ Error: ${boardsResponse.error}`);
    } else {
      console.log(`✅ Success! Found ${boardsResponse.data?.length || 0} boards`);
      
      if (boardsResponse.data && boardsResponse.data.length > 0) {
        console.log('\n📋 Boards found:');
        boardsResponse.data.forEach((board, index) => {
          console.log(`  ${index + 1}. ${board.name} (ID: ${board.id})`);
        });
      }
    }
    
  } catch (error) {
    console.log(`💥 Exception thrown: ${error.message}`);
    console.log(`📚 Stack trace: ${error.stack}`);
  }

  // For comparison, let's also test search_posts which we know works
  try {
    console.log('\n🧪 Testing searchPosts() for comparison...');
    const searchResponse = await client.searchPosts('test', { limit: 1 });
    
    console.log(`📊 Search Response Status: ${searchResponse.status}`);
    
    if (searchResponse.error) {
      console.log(`❌ Search Error: ${searchResponse.error}`);
    } else {
      console.log(`✅ Search Success! Found ${searchResponse.data?.posts?.length || 0} posts`);
    }
    
  } catch (error) {
    console.log(`💥 Search Exception: ${error.message}`);
  }
}

// Run the debug
debugBoardsAPI().catch(console.error);
