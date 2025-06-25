# College Essay API Implementation Guide

This document provides detailed instructions for implementing the backend API functionality for the interactive college essay page.

## Overview

The essay page now includes OpenAI-powered essay analysis capabilities. This document covers both the implemented frontend features and the backend requirements.

## ✅ IMPLEMENTED: OpenAI Essay Analysis

### Frontend Implementation Complete

The following features have been implemented on the frontend:

- **Real-time Essay Analysis**: Integrated with OpenAI GPT-4 API
- **Comprehensive Scoring**: Overall score, category breakdown, profile alignment
- **Smart Analysis**: Debounced auto-analysis with content change detection
- **Detailed Feedback**: Comments, suggestions, and improvement recommendations
- **Error Handling**: Graceful error handling and user feedback

### Files Implemented:
- `src/api/essayAnalysis.js` - OpenAI API integration
- `src/composables/useEssayAnalysis.js` - Vue composable for analysis state
- `src/pages/essay.vue` - Updated essay editor with AI analysis
- `src/docs/ESSAY_ANALYSIS_API.md` - Complete documentation

## Required Backend API Endpoints (Still Needed)

### 1. Essay Management

#### `POST /api/essays`
Create a new essay draft
```json
{
  "collegeId": "string",
  "promptId": "string", 
  "content": "string",
  "title": "string (optional)"
}
```

#### `PUT /api/essays/:id`
Update existing essay
```json
{
  "content": "string",
  "collegeId": "string",
  "promptId": "string"
}
```

#### `GET /api/essays/:id`
Retrieve essay by ID

#### `GET /api/essays/user/:userId`
Get all essays for a user

#### `DELETE /api/essays/:id`
Delete an essay

### 2. College and Prompt Management

#### `GET /api/colleges/:id/prompts`
Get essay prompts specific to a college
```json
{
  "prompts": [
    {
      "id": "string",
      "text": "string",
      "wordLimit": "number",
      "category": "string",
      "required": "boolean"
    }
  ]
}
```

#### `GET /api/prompts/common`
Get common application essay prompts

### 3. AI Analysis Engine

#### `POST /api/ai/analyze-essay`
Main AI analysis endpoint
```json
{
  "essayContent": "string",
  "collegeId": "string", 
  "promptId": "string",
  "userId": "string"
}
```

**Response:**
```json
{
  "overallScore": "number (0-100)",
  "profileAlignment": "number (0-100)",
  "categories": [
    {
      "id": "string",
      "title": "string",
      "score": "number (0-10)",
      "feedback": "string",
      "suggestions": ["string"]
    }
  ],
  "comments": [
    {
      "id": "string",
      "type": "suggestion|grammar|strength|question",
      "line": "number",
      "text": "string",
      "severity": "low|medium|high"
    }
  ],
  "wordCount": "number",
  "readabilityScore": "number",
  "sentiment": "positive|neutral|negative"
}
```

#### `POST /api/ai/real-time-feedback`
Real-time feedback as user types (debounced)
```json
{
  "content": "string",
  "cursorPosition": "number",
  "collegeId": "string",
  "promptId": "string"
}
```

### 4. User Profile Integration

#### `GET /api/users/:id/profile`
Get user profile for personalized analysis
```json
{
  "academics": {
    "gpa": "number",
    "testScores": "object",
    "coursework": "array",
    "academicInterests": "array"
  },
  "extracurriculars": "array",
  "demographics": "object",
  "goals": "object",
  "writingStyle": "object"
}
```

## AI Analysis Implementation Details

### 1. Content Analysis Categories

#### Structure & Organization (0-10)
- **Metrics to analyze:**
  - Paragraph structure and flow
  - Transition quality
  - Introduction/conclusion strength
  - Logical progression of ideas
- **Implementation:** Use NLP libraries to analyze sentence structure, paragraph breaks, and coherence

#### Voice & Authenticity (0-10)
- **Metrics to analyze:**
  - Personal anecdote usage
  - Authentic voice detection
  - Specificity of examples
  - Emotional resonance
- **Implementation:** Sentiment analysis, personal pronoun usage, specificity scoring

#### Content & Relevance (0-10)
- **Metrics to analyze:**
  - Prompt adherence
  - College-specific references
  - Relevant experiences
  - Goal alignment
- **Implementation:** Keyword matching, topic modeling, college database cross-reference

#### Grammar & Style (0-10)
- **Metrics to analyze:**
  - Grammar errors
  - Sentence variety
  - Word choice
  - Readability
- **Implementation:** Grammar checking APIs (Grammarly API, LanguageTool), readability algorithms

### 2. Profile Alignment Algorithm

Calculate how well the essay aligns with:
- User's stated goals and interests
- College's values and culture
- Program-specific requirements
- Demonstrated experiences

**Algorithm:**
```javascript
function calculateProfileAlignment(essay, userProfile, college) {
  const factors = {
    goalAlignment: calculateGoalMatch(essay, userProfile.goals),
    experienceRelevance: calculateExperienceMatch(essay, userProfile.experiences),
    collegeValueAlignment: calculateCollegeMatch(essay, college.values),
    academicFit: calculateAcademicMatch(essay, userProfile.academics, college.programs)
  };
  
  return weightedAverage(factors, {
    goalAlignment: 0.3,
    experienceRelevance: 0.3,
    collegeValueAlignment: 0.25,
    academicFit: 0.15
  });
}
```

### 3. Real-time Comment Generation

#### Comment Types:
1. **Suggestions** - Improvement recommendations
2. **Grammar** - Language and style corrections  
3. **Strengths** - Positive reinforcement
4. **Questions** - Prompts for deeper reflection

#### Implementation Strategy:
```javascript
// Debounced analysis trigger
const debouncedAnalysis = debounce(async (content, context) => {
  const analysis = await analyzeEssayContent(content, context);
  return generateInlineComments(analysis, content);
}, 2000);
```

## Database Schema

### Essays Table
```sql
CREATE TABLE essays (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  college_id UUID REFERENCES colleges(id),
  prompt_id UUID REFERENCES prompts(id),
  title VARCHAR(255),
  content TEXT,
  word_count INTEGER,
  status ENUM('draft', 'submitted', 'reviewed'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  submitted_at TIMESTAMP
);
```

### Analysis Results Table
```sql
CREATE TABLE essay_analyses (
  id UUID PRIMARY KEY,
  essay_id UUID REFERENCES essays(id),
  overall_score INTEGER,
  profile_alignment INTEGER,
  category_scores JSONB,
  comments JSONB,
  generated_at TIMESTAMP
);
```

### Prompts Table
```sql
CREATE TABLE essay_prompts (
  id UUID PRIMARY KEY,
  college_id UUID REFERENCES colleges(id),
  text TEXT NOT NULL,
  word_limit INTEGER,
  category VARCHAR(100),
  is_required BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true
);
```

## Integration Points

### 1. Frontend Event Handlers

Update the Vue component methods to call actual APIs:

```javascript
// In essay.vue
const onEssayChange = debounce(async () => {
  if (essayContent.value.trim().length > 50) {
    const analysis = await $api.analyzeEssay({
      content: essayContent.value,
      collegeId: selectedCollege.value,
      promptId: selectedPrompt.value,
      userId: user.id
    });
    updateAnalysisDisplay(analysis);
  }
}, 2000);

const saveEssay = async () => {
  saving.value = true;
  try {
    await $api.saveEssay({
      id: currentEssayId.value,
      content: essayContent.value,
      collegeId: selectedCollege.value,
      promptId: selectedPrompt.value
    });
  } finally {
    saving.value = false;
  }
};
```

### 2. Store Integration

Create Pinia store for essay management:

```javascript
// stores/essay.js
export const useEssayStore = defineStore('essay', {
  state: () => ({
    currentEssay: null,
    essays: [],
    analysis: null,
    loading: false
  }),
  
  actions: {
    async loadEssay(id) {
      this.loading = true;
      this.currentEssay = await $api.getEssay(id);
      this.loading = false;
    },
    
    async saveEssay(essayData) {
      const saved = await $api.saveEssay(essayData);
      this.currentEssay = saved;
      return saved;
    }
  }
});
```

## Performance Considerations

### 1. Caching Strategy
- Cache AI analysis results for 10 minutes
- Cache college prompts for 1 hour
- Use Redis for session-based caching

### 2. Rate Limiting
- Limit AI analysis requests to 10 per minute per user
- Implement exponential backoff for failed requests

### 3. Optimization
- Lazy load analysis components
- Implement virtual scrolling for long comment lists
- Use WebSocket for real-time collaboration features

## Security & Privacy

### 1. Data Protection
- Encrypt essay content at rest
- Implement proper access controls
- Log all essay access/modifications

### 2. API Security
- Require authentication for all endpoints
- Implement role-based access control
- Rate limit based on user tier

## Testing Strategy

### 1. Unit Tests
- Test AI analysis algorithms
- Test profile alignment calculations
- Test comment generation logic

### 2. Integration Tests
- Test API endpoint responses
- Test database operations
- Test real-time analysis pipeline

### 3. Performance Tests
- Load test AI analysis endpoints
- Test concurrent user scenarios
- Monitor response times

## Deployment Notes

### 1. Environment Variables
```bash
OPENAI_API_KEY=your_openai_key
GRAMMARLY_API_KEY=your_grammarly_key
DATABASE_URL=your_database_url
REDIS_URL=your_redis_url
```

### 2. Scaling Considerations
- Use message queues for AI processing
- Implement horizontal scaling for analysis workers
- Consider CDN for static assets

This implementation guide provides a comprehensive roadmap for building the backend functionality to support the interactive essay editing experience.
