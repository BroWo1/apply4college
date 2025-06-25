// src/api/essayAnalysis.js
import { getOpenAIApiKey } from '@/utils/apiKeyService.js'

/**
 * Add line numbers to essay content for AI analysis
 * @param {string} content - Essay content
 * @returns {string} Content with line numbers
 */
const addLineNumbers = (content) => {
  if (!content) return ''
  
  const lines = content.split('\n')
  return lines
    .map((line, index) => `${index + 1}: ${line}`)
    .join('\n')
}

/**
 * Remove line numbers from content 
 * @param {string} numberedContent - Content with line numbers
 * @returns {string} Clean content without line numbers
 */
const removeLineNumbers = (numberedContent) => {
  if (!numberedContent) return ''
  
  return numberedContent
    .split('\n')
    .map(line => line.replace(/^\d+:\s?/, ''))
    .join('\n')
}

/**
 * Validate and enhance analysis result
 * @param {Object} analysis - Raw analysis from AI
 * @param {string} originalContent - Original essay content
 * @returns {Object} Enhanced analysis
 */
const validateAndEnhanceAnalysis = (analysis, originalContent) => {
  const contentLines = originalContent.split('\n')
  const totalLines = contentLines.length

  // Validate and fix line numbers in comments
  if (analysis.comments && Array.isArray(analysis.comments)) {
    analysis.comments = analysis.comments.map(comment => {
      // Ensure line number is within valid range
      if (comment.line && (comment.line < 1 || comment.line > totalLines)) {
        comment.line = Math.max(1, Math.min(comment.line, totalLines))
      }

      // If context is missing, try to extract it from the line
      if (!comment.context && comment.line && contentLines[comment.line - 1]) {
        const lineText = contentLines[comment.line - 1].trim()
        comment.context = lineText.length > 50 
          ? lineText.substring(0, 50) + '...'
          : lineText
      }

      return comment
    })
  }

  return analysis
}

/**
 * Analyze essay using OpenAI GPT
 * @param {Object} essayData - Essay data to analyze
 * @param {string} essayData.content - Essay content
 * @param {string} essayData.prompt - Essay prompt
 * @param {string} essayData.college - Target college name
 * @param {Object} essayData.studentProfile - Student profile data
 * @param {boolean} essayData.includeDebugInfo - Whether to include debug information
 * @returns {Promise<Object>} Analysis results
 */
export const analyzeEssayWithOpenAI = async (essayData) => {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    input: {},
    output: {},
    apiCall: {},
    error: null
  }

  try {
    const apiKey = await getOpenAIApiKey()
    if (!apiKey) {
      throw new Error('OpenAI API key not available')
    }

    const { content, prompt, college, studentProfile, includeDebugInfo = false } = essayData

    // Store input data for debugging
    debugInfo.input = {
      content,
      prompt,
      college,
      studentProfile,
      contentStats: {
        characters: content.length,
        words: content.trim().split(/\s+/).length,
        lines: content.split('\n').length
      }
    }

    // Create a comprehensive prompt for essay analysis
    const systemPrompt = `You are an expert college admissions essay coach. Analyze the provided essay and return a detailed JSON response with the following structure:

{
  "overallScore": number (0-100),
  "profileAlignment": number (0-100),
  "categories": [
    {
      "id": "structure",
      "title": "Structure & Organization",
      "score": number (0-10),
      "feedback": "detailed feedback",
      "suggestions": ["suggestion1", "suggestion2"]
    },
    {
      "id": "voice",
      "title": "Voice & Authenticity", 
      "score": number (0-10),
      "feedback": "detailed feedback",
      "suggestions": ["suggestion1", "suggestion2"]
    },
    {
      "id": "content",
      "title": "Content & Relevance",
      "score": number (0-10), 
      "feedback": "detailed feedback",
      "suggestions": ["suggestion1", "suggestion2"]
    },
    {
      "id": "grammar",
      "title": "Grammar & Style",
      "score": number (0-10),
      "feedback": "detailed feedback", 
      "suggestions": ["suggestion1", "suggestion2"]
    }
  ],
  "comments": [
    {
      "type": "suggestion|grammar|strength|question",
      "text": "specific comment",
      "line": line_number,
      "context": "relevant text excerpt where the comment applies"
    }
  ],
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"]
}

IMPORTANT INSTRUCTIONS:
1. Use EXACT line numbers from the numbered essay content provided
2. For each comment, include a "context" field with 3-10 words from the specific line being referenced
3. Provide at least 3-5 specific comments with accurate line numbers
4. Make comments actionable and specific to the exact text location
5. Focus on both strengths and areas for improvement
6. Consider college-specific alignment and prompt responsiveness

Focus on:
1. How well the essay answers the prompt
2. Authenticity and personal voice
3. College-specific alignment
4. Writing quality and mechanics
5. Compelling storytelling`

    const userPrompt = `Please analyze this college essay:

**Target College:** ${college || 'Not specified'}
**Essay Prompt:** ${prompt || 'Not specified'}
**Student Profile:** ${studentProfile ? JSON.stringify(studentProfile) : 'Not provided'}

**Essay Content (with line numbers):**
${addLineNumbers(content)}

When providing comments, use the exact line numbers shown above. Each comment should reference the specific line number where the issue or suggestion applies. Include a brief context excerpt in the "context" field to show which text you're referring to.

Provide a thorough analysis following the JSON structure specified in the system prompt.`

    const requestBody = {
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user', 
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    }

    // Store API call information for debugging
    debugInfo.apiCall = {
      url: 'https://api.openai.com/v1/chat/completions',
      method: 'POST',
      model: requestBody.model,
      temperature: requestBody.temperature,
      max_tokens: requestBody.max_tokens,
      messages: requestBody.messages,
      requestTimestamp: new Date().toISOString()
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    })

    debugInfo.apiCall.responseTimestamp = new Date().toISOString()
    debugInfo.apiCall.responseStatus = response.status
    debugInfo.apiCall.responseHeaders = Object.fromEntries(response.headers.entries())

    if (!response.ok) {
      const errorData = await response.json()
      const error = new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`)
      debugInfo.error = {
        status: response.status,
        statusText: response.statusText,
        errorData
      }
      throw error
    }

    const data = await response.json()
    
    // Store raw API response for debugging
    debugInfo.output.rawApiResponse = data
    
    const analysisText = data.choices[0]?.message?.content

    if (!analysisText) {
      const error = new Error('No analysis content received from OpenAI')
      debugInfo.error = {
        message: 'No analysis content received from OpenAI',
        apiResponse: data
      }
      throw error
    }

    // Parse the JSON response
    const analysis = JSON.parse(analysisText)
    debugInfo.output.parsedAnalysis = analysis

    // Validate and enhance the analysis result
    const enhancedAnalysis = validateAndEnhanceAnalysis(analysis, content)
    debugInfo.output.enhancedAnalysis = enhancedAnalysis

    // Validate and format the response
    const finalResult = {
      overallScore: enhancedAnalysis.overallScore || 0,
      profileAlignment: enhancedAnalysis.profileAlignment || 0,
      categories: enhancedAnalysis.categories || [],
      comments: enhancedAnalysis.comments || [],
      strengths: enhancedAnalysis.strengths || [],
      improvements: enhancedAnalysis.improvements || [],
      timestamp: new Date().toISOString()
    }

    // Include debug info if requested
    if (includeDebugInfo) {
      finalResult.debugInfo = debugInfo
    }

    return finalResult

  } catch (error) {
    debugInfo.error = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }
    
    console.error('Error analyzing essay with OpenAI:', error)
    
    // Still include debug info in the error for debugging purposes
    error.debugInfo = debugInfo
    throw error
  }
}

/**
 * Get essay improvement suggestions
 * @param {string} essayContent - Essay content
 * @param {string} focusArea - Specific area to focus on (optional)
 * @returns {Promise<Array>} Array of suggestions
 */
export const getEssayImprovementSuggestions = async (essayContent, focusArea = null) => {
  try {
    const apiKey = await getOpenAIApiKey()
    if (!apiKey) {
      throw new Error('OpenAI API key not available')
    }

    const focusPrompt = focusArea 
      ? `Focus specifically on ${focusArea} improvements.`
      : 'Provide general improvement suggestions.'

    const prompt = `As an expert college admissions essay coach, provide 5-7 specific, actionable improvement suggestions for this essay. ${focusPrompt}

Essay content:
${essayContent}

Return your response as a JSON array of strings, where each string is a specific suggestion.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 800,
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const suggestionsText = data.choices[0]?.message?.content
    
    if (!suggestionsText) {
      throw new Error('No suggestions received from OpenAI')
    }

    const suggestions = JSON.parse(suggestionsText)
    return Array.isArray(suggestions) ? suggestions : suggestions.suggestions || []

  } catch (error) {
    console.error('Error getting essay suggestions:', error)
    throw error
  }
}

/**
 * Check grammar and style issues
 * @param {string} essayContent - Essay content
 * @returns {Promise<Array>} Array of grammar/style issues
 */
export const checkEssayGrammar = async (essayContent) => {
  try {
    const apiKey = await getOpenAIApiKey()
    if (!apiKey) {
      throw new Error('OpenAI API key not available')
    }

    const prompt = `As a writing expert, identify grammar, punctuation, and style issues in this essay. Return a JSON array of objects with this structure:

[
  {
    "type": "grammar|punctuation|style|clarity",
    "issue": "description of the issue",
    "suggestion": "how to fix it",
    "line": line_number,
    "context": "text excerpt where the issue occurs",
    "severity": "low|medium|high"
  }
]

Essay content (with line numbers):
${addLineNumbers(essayContent)}

Use the exact line numbers shown above. Include the specific text where each issue occurs in the "context" field.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const issuesText = data.choices[0]?.message?.content
    
    if (!issuesText) {
      return []
    }

    const result = JSON.parse(issuesText)
    return Array.isArray(result) ? result : result.issues || []

  } catch (error) {
    console.error('Error checking essay grammar:', error)
    throw error
  }
}
