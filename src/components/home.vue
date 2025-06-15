<template>
  <div class="home-page">
    <!-- Modern Hero Section -->
    <section class="hero-section" aria-labelledby="hero-title">
      <div class="hero-content">
        <div class="hero-text-container">
          <h1 id="hero-title" class="hero-title">
            {{ $t('homePage.title') }}
            <span class="hero-badge">.org</span>
          </h1>
          <p class="hero-subtitle">
            Your personalized college journey starts here
          </p>
        </div>
        <div class="hero-decoration">
          <div class="floating-icons">
            <v-icon class="floating-icon icon-1">mdi-school</v-icon>
            <v-icon class="floating-icon icon-2">mdi-star</v-icon>
            <v-icon class="floating-icon icon-3">mdi-lightbulb</v-icon>
          </div>
        </div>
      </div>
    </section>
    <!-- Main Content -->
    <main class="main-content">
      <!-- AI Advisor Section -->
      <AIAdvisorSection 
        v-model:question="aiQuestion"
        :loading="loadingAiResponse"
        :response="aiResponse"
        :error="aiError"
        :quick-questions="quickQuestions"
        @ask="askAI"
      />

      <!-- Saved Colleges Section -->
      <SavedCollegesSection 
        :colleges="allSavedColleges"
        @view-college="viewCollege"
      />
    </main>
  </div>
</template>

<script setup>
import { useHomePageData } from '@/composables/useHomePageData'
import { useAIAdvisor } from '@/composables/useAIAdvisor'
import AIAdvisorSection from '@/components/home/AIAdvisorSection.vue'
import SavedCollegesSection from '@/components/home/SavedCollegesSection.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Composables for data management
const { allSavedColleges } = useHomePageData()
const { 
  aiQuestion, 
  aiResponse, 
  aiError, 
  loadingAiResponse, 
  quickQuestions, 
  askAI 
} = useAIAdvisor()

// Navigation methods
const viewCollege = (college) => {
  router.push({ 
    path: '/explore', 
    query: { collegeId: college.id } 
  })
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* Modern Hero Section */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, 
    #8b5cf6 0%, 
    #7c3aed 50%,
    #6d28d9 100%
  );
  padding: 4rem 2rem;
  overflow: hidden;
  color: white;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  text-align: center;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.6em;
  margin-left: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Floating Animation */
.hero-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  overflow: hidden;
}

.floating-icons {
  position: relative;
  width: 100%;
  height: 100%;
}

.floating-icon {
  position: absolute;
  opacity: 0.1;
  font-size: 3rem;
  animation: float 6s ease-in-out infinite;
}

.icon-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.icon-2 {
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.icon-3 {
  bottom: 30%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
  }
  50% { 
    transform: translateY(-20px) rotate(10deg); 
  }
}

/* Main Content */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    padding: 3rem 1rem;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.125rem;
  }
}

/* Modern card styles for consistency */
:deep(.v-card) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.v-card:hover) {
  transform: translateY(-2px);
}

/* Smooth animations */
* {
  transition: color 0.2s ease, background-color 0.2s ease;
}

/* Clean button styles */
:deep(.v-btn) {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
  box-shadow: none;
}

:deep(.v-btn:hover) {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>