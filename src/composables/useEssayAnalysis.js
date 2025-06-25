// src/composables/useEssayAnalysis.js
import { ref, computed } from 'vue'
import { analyzeEssayWithOpenAI, getEssayImprovementSuggestions, checkEssayGrammar } from '@/api/essayAnalysis.js'

export function useEssayAnalysis() {
  // State
  const analyzing = ref(false)
  const analysisResult = ref(null)
  const analysisError = ref(null)
  const lastAnalyzedContent = ref('')
  const debugInfo = ref(null)

  // Computed
  const hasAnalysis = computed(() => analysisResult.value !== null)
  const isAnalyzing = computed(() => analyzing.value)
  
  const overallScore = computed(() => analysisResult.value?.overallScore || 0)
  const profileAlignment = computed(() => analysisResult.value?.profileAlignment || 0)
  const categories = computed(() => analysisResult.value?.categories || [])
  const comments = computed(() => analysisResult.value?.comments || [])
  const strengths = computed(() => analysisResult.value?.strengths || [])
  const improvements = computed(() => analysisResult.value?.improvements || [])

  // Methods
  const analyzeEssay = async (essayData, includeDebugInfo = false) => {
    if (!essayData.content?.trim()) {
      throw new Error('Essay content is required')
    }

    analyzing.value = true
    analysisError.value = null
    debugInfo.value = null

    try {
      const result = await analyzeEssayWithOpenAI({
        ...essayData,
        includeDebugInfo
      })
      
      analysisResult.value = result
      lastAnalyzedContent.value = essayData.content
      
      // Store debug info if available
      if (result.debugInfo) {
        debugInfo.value = result.debugInfo
      }
      
      return result
    } catch (error) {
      analysisError.value = error.message
      
      // Store debug info from error if available
      if (error.debugInfo) {
        debugInfo.value = error.debugInfo
      }
      
      console.error('Essay analysis failed:', error)
      throw error
    } finally {
      analyzing.value = false
    }
  }

  const getSuggestions = async (essayContent, focusArea = null) => {
    try {
      return await getEssayImprovementSuggestions(essayContent, focusArea)
    } catch (error) {
      console.error('Failed to get suggestions:', error)
      throw error
    }
  }

  const checkGrammar = async (essayContent) => {
    try {
      return await checkEssayGrammar(essayContent)
    } catch (error) {
      console.error('Failed to check grammar:', error)
      throw error
    }
  }

  const clearAnalysis = () => {
    analysisResult.value = null
    analysisError.value = null
    lastAnalyzedContent.value = ''
    debugInfo.value = null
  }

  const needsReanalysis = (currentContent) => {
    if (!analysisResult.value) return true
    if (!currentContent?.trim()) return false
    
    // Check if content has changed significantly
    const wordsDiff = Math.abs(
      currentContent.trim().split(/\s+/).length - 
      lastAnalyzedContent.value.trim().split(/\s+/).length
    )
    
    return wordsDiff > 10 // Reanalyze if word count changed by more than 10
  }

  return {
    // State
    analyzing,
    analysisResult,
    analysisError,
    debugInfo,
    
    // Computed
    hasAnalysis,
    isAnalyzing,
    overallScore,
    profileAlignment,
    categories,
    comments,
    strengths,
    improvements,
    
    // Methods
    analyzeEssay,
    getSuggestions,
    checkGrammar,
    clearAnalysis,
    needsReanalysis
  }
}
