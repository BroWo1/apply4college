// src/utils/profileRecommendationService.js
import axios from 'axios';
import { getOpenAIApiKey } from './apiKeyService';

// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1';

// Store API key for the session
let apiKey = null;

/**
 * Set API key for OpenAI requests
 * @param {string} key - The API key
 */
export const setApiKey = async (key) => {
  apiKey = key;
};

/**
 * Get the current API key or retrieve from server
 * @returns {Promise<string|null>} The API key or null if unavailable
 */
export const getApiKey = async () => {
  if (apiKey) return apiKey;

  // Get API key from server
  const serverKey = await getOpenAIApiKey();
  if (serverKey) {
    apiKey = serverKey;
  }

  return apiKey;
};

/**
 * Get profile recommendations for a student
 * @param {Object} studentProfile - The student profile data
 * @returns {Promise<Object>} The recommendation result
 */
export const getProfileRecommendations = async (studentProfile) => {
  try {
    // Get API key
    const key = await getApiKey();
    if (!key) {
      return {
        success: false,
        error: 'API key not available'
      };
    }

    // Make request to OpenAI API directly (original method)
    const response = await axios.post(`${OPENAI_API_URL}/chat/completions`, {
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI college admissions counselor. Analyze the student profile and provide: 1. An application strategy, 2. Profile improvements, 3. College matches."
        },
        {
          role: "user",
          content: `Analyze this student profile: ${JSON.stringify(studentProfile)}`
        }
      ],
      max_tokens: 1000
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      }
    });

    return {
      success: true,
      recommendation: response.data.choices[0].message.content
    };
  } catch (error) {
    console.error('Profile recommendation error:', error);
    return {
      success: false,
      error: error?.response?.data?.error?.message || error?.message || 'Failed to get recommendations'
    };
  }
};

/**
 * Get essay topic suggestions for a student
 * @param {Object} studentProfile - The student profile data
 * @returns {Promise<Object>} The essay topic suggestions
 */
export const getEssayTopicSuggestions = async (studentProfile) => {
  try {
    // Get API key
    const key = await getApiKey();
    if (!key) {
      return {
        success: false,
        error: 'API key not available'
      };
    }

    // Make request to OpenAI API directly (original method)
    const response = await axios.post(`${OPENAI_API_URL}/chat/completions`, {
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI college admissions essay advisor. Generate 5 creative, personal essay topic ideas tailored to this student's profile, interests, and experiences."
        },
        {
          role: "user",
          content: `Generate essay topic suggestions for this student: ${JSON.stringify(studentProfile)}`
        }
      ],
      max_tokens: 1000
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      }
    });

    return {
      success: true,
      topics: response.data.choices[0].message.content
    };
  } catch (error) {
    console.error('Essay topic suggestion error:', error);
    return {
      success: false,
      error: error?.response?.data?.error?.message || error?.message || 'Failed to get essay topic suggestions'
    };
  }
};

/**
 * Get college match analysis for a student and college
 * @param {Object} studentProfile - The student profile data
 * @param {Object} college - The college data
 * @returns {Promise<Object>} The college match analysis
 */
export const getCollegeMatchAnalysis = async (studentProfile, college) => {
  try {
    // Get API key
    const key = await getApiKey();
    if (!key) {
      return {
        success: false,
        error: 'API key not available'
      };
    }

    // Make request to OpenAI API directly with simplified prompt for one-paragraph response
    const response = await axios.post(`${OPENAI_API_URL}/chat/completions`, {
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI college admissions counselor. Provide a concise, one-paragraph summary analyzing if this student is a good match for this college. Keep it brief but informative, focusing on key strengths, potential challenges, and a clear recommendation."
        },
        {
          role: "user",
          content: `Summarize in one paragraph if this student: ${JSON.stringify(studentProfile)} is a good match for this college: ${JSON.stringify(college)}`
        }
      ],
      max_tokens: 500  // Reduced from 1000 since we're requesting a shorter response
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      }
    });

    return {
      success: true,
      analysis: response.data.choices[0].message.content
    };
  } catch (error) {
    console.error('College match analysis error:', error);
    return {
      success: false,
      error: error?.response?.data?.error?.message || error?.message || 'Failed to get college match analysis'
    };
  }
};

/**
 * Get personalized college admission advice based on user profile
 * @param {Object} studentProfile - The student profile data
 * @param {String} question - The specific question asked by the user
 * @returns {Promise<Object>} The personalized advice
 */
export const getGeneralAdvice = async (studentProfile, question = '') => {
  try {
    // Get API key
    const key = await getApiKey();
    if (!key) {
      return {
        success: false,
        error: 'API key not available'
      };
    }

    // Make request to OpenAI API with the profile data and specific question
    const response = await axios.post(`${OPENAI_API_URL}/chat/completions`, {
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI college admissions counselor. Provide personalized, actionable advice for college applications based on the student's profile."
        },
        {
          role: "user",
          content: `Student Profile: ${JSON.stringify(studentProfile)}\n\nQuestion: ${question}`
        }
      ],
      max_tokens: 1000
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      }
    });

    return {
      success: true,
      advice: response.data.choices[0].message.content
    };
  } catch (error) {
    console.error('Personalized advice error:', error);
    return {
      success: false,
      error: error?.response?.data?.error?.message || error?.message || 'Failed to get personalized advice'
    };
  }
};
