#!/usr/bin/env node

/**
 * Advanced debug script to understand board access patterns
 */

const { CannyClient } = require('../dist/client/canny.js');
const { CONFIG } = require('../dist/config/config.js');

async function advancedDebug() {
  console.log('🔍 Advanced Canny API Analysis...\n');

  const client = new CannyClient(process.env.CANNY_API_KEY, CONFIG.baseUrl);
  
  try {
    // Test 1: Try to get posts from a known board
    console.log('🧪 Test 1: Get posts without boardID (see what happens)...');
    const allPostsResponse = await client.searchPosts('', { limit: 3 });
    
    if (allPostsResponse.data && allPostsResponse.data.posts.length > 0) {
      console.log('✅ Found posts! Analyzing board information...');
      
      const post = allPostsResponse.data.posts[0];
      console.log(`📋 Sample post board info:`);
      console.log(`   - Board Name: ${post.board?.name}`);
      console.log(`   - Board ID: ${post.board?.id}`);
      console.log(`   - URL: ${post.url}`);
      
      // Extract board ID and try to get posts from that specific board
      if (post.board && post.board.id) {
        console.log(`\n🧪 Test 2: Try getPosts with boardID: ${post.board.id}...`);
        const boardPostsResponse = await client.getPosts(post.board.id, { limit: 2 });
        
        console.log(`📊 Board Posts Response Status: ${boardPostsResponse.status}`);
        
        if (boardPostsResponse.error) {
          console.log(`❌ Board Posts Error: ${boardPostsResponse.error}`);
        } else {
          console.log(`✅ Board Posts Success! Found ${boardPostsResponse.data?.posts?.length || 0} posts`);
        }
      }
    }

    // Test 3: Try different board endpoints
    console.log('\n🧪 Test 3: Try different potential board endpoints...');
    
    const endpoints = [
      '/boards/list',
      '/boards',  
      '/board/list',
      '/boards/all'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await client.client.get(endpoint, {
          params: { apiKey: process.env.CANNY_API_KEY }
        });
        console.log(`✅ ${endpoint}: Status ${response.status}`);
        if (response.data) {
          console.log(`   Data type: ${Array.isArray(response.data) ? 'Array' : typeof response.data}`);
          console.log(`   Length/Keys: ${Array.isArray(response.data) ? response.data.length : Object.keys(response.data).length}`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint}: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
      }
    }

  } catch (error) {
    console.log(`💥 Exception: ${error.message}`);
  }
}

advancedDebug().catch(console.error);
