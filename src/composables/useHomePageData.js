import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { colleges } from '@/data/colleges.js'

export function useHomePageData() {
  const userStore = useUserStore()
  const earlyDecisionColleges = ref([])
  const regularDecisionColleges = ref([])

  const allSavedColleges = computed(() => {
    const all = [...earlyDecisionColleges.value, ...regularDecisionColleges.value]
    const unique = new Map()
    
    all.forEach(college => {
      if (college && college.name && !unique.has(college.name)) {
        unique.set(college.name, college)
      }
    })
    
    return Array.from(unique.values())
  })

  const loadSavedColleges = () => {
    try {
      const profileKey = userStore.isAuthenticated ? 'userProfileData' : 'guestProfileData'
      const saved = localStorage.getItem(profileKey)
      
      if (!saved) return
      
      const data = JSON.parse(saved)
      
      if (data.earlyDecisionColleges?.length) {
        earlyDecisionColleges.value = data.earlyDecisionColleges
          .map(c => ({
            ...colleges.find(col => col.name === c.name),
            isEarlyDecision: true
          }))
          .filter(Boolean)
      }
      
      if (data.regularDecisionColleges?.length) {
        regularDecisionColleges.value = data.regularDecisionColleges
          .map(c => ({
            ...colleges.find(col => col.name === c.name),
            isEarlyDecision: false
          }))
          .filter(Boolean)
      }
    } catch (error) {
      console.error('Error loading colleges:', error)
    }
  }

  onMounted(() => {
    loadSavedColleges()
  })

  return {
    allSavedColleges,
    loadSavedColleges,
    earlyDecisionColleges,
    regularDecisionColleges
  }
}
