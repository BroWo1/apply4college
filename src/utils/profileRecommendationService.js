// profileRecommendationService.js
// Service to get AI-powered recommendations based on student profiles

// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
let apiKey = ''; // Will be set through setApiKey method

/**
 * Set the OpenAI API key
 * @param {string} key - OpenAI API key
 */
export const setApiKey = (key) => {
  apiKey = key;
  localStorage.setItem('openai_api_key', key);
};

/**
 * Check if API key is configured
 * @returns {boolean} - Whether API key is configured
 */
export const isApiKeyConfigured = () => {
  // First check if the key is already set in memory
  if (apiKey) {
    return true;
  }

  // If not in memory, try to load from localStorage
  const storedKey = localStorage.getItem('openai_api_key');
  if (storedKey) {
    apiKey = storedKey;
    return true;
  }

  return false;
};

/**
 * Format student profile data for the AI prompt
 * @param {Object} studentProfile - The student profile data
 * @returns {string} - Formatted prompt for the AI
 */
const formatProfileForPrompt = (studentProfile) => {
  // Extract key information
  const {
    satReading,
    satMath,
    gpa,
    apClasses,
    extracurriculars,
    intendedMajor,
    recScore,
    isLegacy,
    nationality,
    gender,
    demoScore
  } = studentProfile;

  // Format AP classes
  const apClassesText = apClasses.length > 0
    ? apClasses.map(ap => `- ${ap.name} (Score: ${ap.score})`).join('\n')
    : 'No AP classes listed';

  // Format extracurricular activities
  const ecText = extracurriculars.length > 0
    ? extracurriculars.map(ec => `- ${ec.name} (Level: ${ec.level}/4)`).join('\n')
    : 'No extracurricular activities listed';

  // Create the prompt
  return `
Student Profile:
- SAT Score: ${satReading + satMath} (Reading: ${satReading}, Math: ${satMath})
- GPA: ${gpa}
- Intended Major: ${intendedMajor || 'Undecided'}
- Recommendation Letters: ${recScore}/3 (${recScore === 1 ? 'Basic' : recScore === 2 ? 'Strong' : 'Outstanding'})
- Legacy Status: ${isLegacy ? 'Yes' : 'No'}
- Nationality: ${nationality}
- Gender: ${gender}

AP Classes:
${apClassesText}

Extracurricular Activities:
${ecText}

Based on this student profile, please provide:
1. A personalized college application strategy recommendation (200-300 words)
2. 3-5 specific ways the student could strengthen their profile
3. Suggestions for college types that would be good matches (reach, target, and safety schools)

Focus on actionable advice that considers the student's academic strengths, intended major (${intendedMajor || 'undecided'}), and extracurricular profile. Be specific and realistic.
`;
};

/**
 * Get college recommendations from ChatGPT/OpenAI
 * @param {Object} studentProfile - The student profile data
 * @returns {Promise<Object>} - Response with recommendation data
 */
export const getProfileRecommendations = async (studentProfile) => {
  if (!isApiKeyConfigured()) {
    throw new Error('OpenAI API key not set. Use setApiKey() method first.');
  }

  try {
    const prompt = formatProfileForPrompt(studentProfile);

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini', // Can be changed to gpt-3.5-turbo for lower cost
        messages: [
          {
            role: 'system',
            content: 'You are a college admissions advisor with 20 years of experience. Provide personalized, strategic advice to students based on their academic profile. Be specific, practical, and encouraging, while being realistic about college prospects.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      recommendation: data.choices[0].message.content,
      success: true
    };
  } catch (error) {
    console.error('Error getting AI recommendation:', error);
    return {
      recommendation: null,
      error: error.message,
      success: false
    };
  }
};

/**
 * Get quick college match recommendations
 * @param {Object} studentProfile - The student profile data
 * @param {Object} college - The college to evaluate
 * @returns {Promise<Object>} - Response with match analysis
 */
export const getCollegeMatchAnalysis = async (studentProfile, college) => {
  if (!isApiKeyConfigured()) {
    throw new Error('OpenAI API key not set. Use setApiKey() method first.');
  }

  try {
    const prompt = `
Student Profile:
- SAT Score: ${studentProfile.satReading + studentProfile.satMath}
- GPA: ${studentProfile.gpa}
- Intended Major: ${studentProfile.intendedMajor || 'Undecided'}
- AP Classes Count: ${studentProfile.apClasses.length}
- Extracurriculars Count: ${studentProfile.extracurriculars.length}

College Information:
- Name: ${college.name}
- Type: ${college.collegeType}
- Average SAT: ${college.averageSAT}
- Average GPA: ${college.averageGPA}
- Top Majors: ${college.topMajors?.join(', ') || 'Various'}

Analyze how good of a match this college is for this student. Consider academic fit, whether the student's intended major aligns with the college's strengths, and any other relevant factors. Provide a 2-3 sentence specific recommendation about whether the student should apply Early Decision, Regular Decision, or consider other options.
`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Using the faster, less expensive model for quick analysis
        messages: [
          {
            role: 'system',
            content: 'You are a college admissions advisor. Provide brief, specific match analysis between student profiles and colleges.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      analysis: data.choices[0].message.content,
      success: true
    };
  } catch (error) {
    console.error('Error getting college match analysis:', error);
    return {
      analysis: null,
      error: error.message,
      success: false
    };
  }
};

/**
 * Get essay topic suggestions based on student profile
 * @param {Object} studentProfile - The student profile data
 * @returns {Promise<Object>} - Response with essay topic suggestions
 */
export const getEssayTopicSuggestions = async (studentProfile) => {
  if (!isApiKeyConfigured()) {
    throw new Error('OpenAI API key not set. Use setApiKey() method first.');
  }

  // Extract student interests from extracurriculars
  const interests = studentProfile.extracurriculars.map(ec => ec.name);

  try {
    const prompt = `
Student Profile:
- Intended Major: ${studentProfile.intendedMajor || 'Undecided'}
- Key Interests: ${interests.join(', ') || 'Not specified'}
- Extracurricular Activities: ${studentProfile.extracurriculars.map(ec => ec.name).join(', ') || 'None listed'}
- AP Classes: ${studentProfile.apClasses.map(ap => ap.name).join(', ') || 'None listed'}

Based on this student's profile, suggest 5 personal essay topic ideas that would highlight their strengths, showcase their unique qualities, and align well with college application expectations. For each suggestion, provide:
1. The topic/title
2. Why this topic would work well for this specific student
3. A possible angle or approach to take

Make the suggestions personal and tailored to this specific student's interests and experiences.
`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4', // Using GPT-4 for more creative and personalized suggestions
        messages: [
          {
            role: 'system',
            content: 'You are a college essay consultant who has helped hundreds of students get into top universities. Provide creative, personalized essay topic suggestions that will help students stand out in the application process.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      topics: data.choices[0].message.content,
      success: true
    };
  } catch (error) {
    console.error('Error getting essay topic suggestions:', error);
    return {
      topics: null,
      error: error.message,
      success: false
    };
  }
};
