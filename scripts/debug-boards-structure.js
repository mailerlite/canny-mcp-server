#!/usr/bin/env node

/**
 * Debug the boards/list response structure
 */

const axios = require('axios');

async function debugBoardsStructure() {
  console.log('🔍 Debugging /boards/list response structure...\n');

  try {
    const response = await axios.get('https://canny.io/api/v1/boards/list', {
      params: { apiKey: process.env.CANNY_API_KEY }
    });
    
    console.log(`📊 Response Status: ${response.status}`);
    console.log(`📦 Response Data Type: ${typeof response.data}`);
    console.log(`🔍 Response Data:`, JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.log(`💥 Error: ${error.message}`);
    if (error.response) {
      console.log(`📊 Status: ${error.response.status}`);
      console.log(`📦 Data:`, error.response.data);
    }
  }
}

debugBoardsStructure().catch(console.error);
