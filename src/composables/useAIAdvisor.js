import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { getGeneralAdvice } from '@/utils/profileRecommendationService'

export function useAIAdvisor() {
  const userStore = useUserStore()
  
  const aiQuestion = ref('')
  const aiResponse = ref('')
  const aiError = ref('')
  const loadingAiResponse = ref(false)

  const quickQuestions = [
    '🎯 How do I write a compelling essay?',
    '🌟 What extracurriculars matter most?',
    '⚡ Should I apply early decision?',
    '📈 How can I improve my test scores?',
    '💰 How do I find scholarships?',
    '🎓 What major should I choose?'
  ]

  const userProfile = computed(() => {
    const profile = userStore.profile
    if (!profile || Object.keys(profile).length === 0) {
      try {
        const profileKey = userStore.isAuthenticated ? 'userProfileData' : 'guestProfileData'
        const saved = localStorage.getItem(profileKey)
        return saved ? JSON.parse(saved) : {}
      } catch {
        return {}
      }
    }
    return profile
  })

  const formattedAiResponse = computed(() => {
    return aiResponse.value.replace(/\n/g, '<br>')
  })

  const askAI = async (question = aiQuestion.value) => {
    if (!question?.trim()) return
    
    loadingAiResponse.value = true
    aiError.value = ''
    aiResponse.value = ''
    
    try {
      const result = await getGeneralAdvice(userProfile.value, question)
      
      if (result?.success && result?.advice) {
        aiResponse.value = result.advice
      } else {
        aiError.value = 'Unable to get a response. Please try again.'
      }
    } catch (error) {
      console.error('AI Advisor Error:', error)
      aiError.value = 'An error occurred. Please try again.'
    } finally {
      loadingAiResponse.value = false
    }
  }

  const clearAIResponse = () => {
    aiResponse.value = ''
    aiError.value = ''
  }

  const setQuestion = (question) => {
    aiQuestion.value = question
  }

  return {
    aiQuestion,
    aiResponse,
    aiError,
    loadingAiResponse,
    quickQuestions,
    formattedAiResponse,
    askAI,
    clearAIResponse,
    setQuestion
  }
}
