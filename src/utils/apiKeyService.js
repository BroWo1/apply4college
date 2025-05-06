// src/utils/apiKeyService.js
import axios from 'axios';

// API server URL - change this to your actual server URL
const API_SERVER = 'https://server.gpeclub.com:1000';

// Create a client secret - in production, this should be stored more securely
const CLIENT_SECRET = 'ILoveGPEClub';

// Cache the API key to avoid excessive requests
let cachedApiKey = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Get the OpenAI API key from the server
 * @returns {Promise<string|null>} The API key or null if unavailable
 */
export const getOpenAIApiKey = async () => {
  // Check if we have a valid cached key
  const now = Date.now();
  if (cachedApiKey && now - cacheTimestamp < CACHE_DURATION) {
    return cachedApiKey;
  }

  try {
    // Request the API key from the server
    const response = await axios.get(`${API_SERVER}/api/config`, {
      headers: {
        'X-Client-Secret': CLIENT_SECRET
      }
    });

    // Check if the request was successful and authenticated
    if (response.data && response.data.authenticated) {
      // Cache the API key and update timestamp
      cachedApiKey = response.data.apiKeys.openai;
      cacheTimestamp = now;
      return cachedApiKey;
    }

    // If server responds without authentication, try localStorage as fallback
    const localKey = localStorage.getItem('openai_api_key');
    if (localKey) {
      return localKey;
    }

    console.error('Failed to get API key: Not authenticated');
    return null;
  } catch (error) {
    console.error('Error retrieving API key from server:', error);

    // Fallback to localStorage if server request fails
    const localKey = localStorage.getItem('openai_api_key');
    if (localKey) {
      return localKey;
    }

    return null;
  }
};
