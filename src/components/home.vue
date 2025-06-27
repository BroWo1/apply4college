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
      <div class="content-platform">
        <!-- AI Advisor Section -->
        <AIAdvisorSection 
          v-model:question="aiQuestion"
          :loading="loadingAiResponse"
          :response="aiResponse"
          :error="aiError"
          :quick-questions="quickQuestions"
          @ask="askAI"
        />

        <!-- Section Divider -->
        <div class="section-divider"></div>

        <!-- Saved Colleges Section -->
        <SavedCollegesSection 
          :colleges="allSavedColleges"
          @view-college="viewCollege"
        />
      </div>
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
  background: linear-gradient(135deg, #fafbfc 0%, #f4f6f8 50%, #e8eaf6 100%);
}

/* Modern Hero Section */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, 
    #667eea 0%, 
    #764ba2 50%,
    #8b5cf6 100%
  );
  padding: 3.5rem 2rem 4.5rem;
  overflow: hidden;
  color: white;
  margin-bottom: -2rem;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  text-align: center;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 3.75rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1rem;
  letter-spacing: -0.01em;
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  padding: 0.3rem 0.8rem;
  border-radius: 1.2rem;
  font-size: 0.65em;
  margin-left: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  font-weight: 600;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.92;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  font-weight: 400;
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
  padding: 3rem 2rem 2rem;
  position: relative;
  z-index: 1;
}

/* Unified Content Platform */
.content-platform {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 2rem;
  padding: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}


/* Section Divider */
.section-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.2) 20%, rgba(139, 92, 246, 0.4) 50%, rgba(139, 92, 246, 0.2) 80%, transparent 100%);
  margin: 3rem 0;
  position: relative;
}



/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    padding: 2.5rem 1rem 3.5rem;
    margin-bottom: -1.5rem;
  }
  
  .main-content {
    padding: 2rem 1rem 1rem;
  }
  
  .content-platform {
    padding: 2rem;
    border-radius: 1.5rem;
  }
  
  .section-divider {
    margin: 2rem 0;
  }
  
  .hero-title {
    font-size: 2.25rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .content-platform {
    padding: 1.5rem;
    border-radius: 1.25rem;
  }
  
  .section-divider {
    margin: 1.5rem 0;
  }
}

/* Remove card-like styling and create natural flat content sections */
:deep(.v-card) {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

/* Flat content section styling within the platform */
:deep(.ai-advisor-section),
:deep(.saved-colleges-section) {
  background: transparent !important;
  backdrop-filter: none !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  margin-bottom: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

/* Remove hover effects for flat design */
:deep(.ai-advisor-section:hover),
:deep(.saved-colleges-section:hover) {
  transform: none;
  box-shadow: none !important;
}

/* Smooth animations */
* {
  transition: color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}

/* Clean button styles */
:deep(.v-btn) {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
  border-radius: 0.75rem;
}

:deep(.v-btn:not(.v-btn--icon)) {
  padding: 0 1.5rem;
  height: 44px;
}

:deep(.v-btn--variant-tonal) {
  background: rgba(139, 92, 246, 0.08) !important;
  color: #7c3aed !important;
  border: 1px solid rgba(139, 92, 246, 0.15);
}

:deep(.v-btn--variant-tonal:hover) {
  background: rgba(139, 92, 246, 0.12) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.2);
}
</style>