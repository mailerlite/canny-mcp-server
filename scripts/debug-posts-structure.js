#!/usr/bin/env node

/**
 * Debug the posts response structure
 */

const axios = require('axios');

async function debugPostsStructure() {
  console.log('🔍 Debugging posts response structure...\n');

  try {
    const response = await axios.get('https://canny.io/api/v1/posts/list', {
      params: { 
        apiKey: process.env.CANNY_API_KEY,
        boardID: '6871a6a7a7a28986c9607e68',
        limit: 2
      }
    });
    
    console.log(`📊 Posts Response Status: ${response.status}`);
    console.log(`📦 Posts Data Type: ${typeof response.data}`);
    console.log(`🔍 Posts Structure:`, JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.log(`💥 Error: ${error.message}`);
    if (error.response) {
      console.log(`📊 Status: ${error.response.status}`);
      console.log(`📦 Data:`, error.response.data);
    }
  }
}

debugPostsStructure().catch(console.error);
