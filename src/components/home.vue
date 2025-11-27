<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text-container">
          <h1 class="hero-title">
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
  background: #f8fafc;
}

/* Hero Section - Match Explore Page */
.hero-section {
  position: relative;
  background: linear-gradient(135deg,
    #8b5cf6 0%,
    #7c3aed 50%,
    #6d28d9 100%
  );
  padding: 2rem 2rem;
  overflow: hidden;
  color: white;
  z-index: 1;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  text-align: center;
}

.hero-title {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
  color: white;
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.65em;
  margin-left: 0.4rem;
  font-weight: 600;
  color: white;
}

.hero-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  font-weight: 300;
  color: white;
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
  font-size: 2rem;
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
    transform: translateY(-15px) rotate(8deg);
  }
}

/* Main Content */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Unified Content Platform */
.content-platform {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
}

/* Section Divider */
.section-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 2rem 0;
}

/* Override child component styles */
:deep(.ai-advisor-section) {
  background: transparent;
  padding: 0;
}

:deep(.saved-colleges-section) {
  background: transparent;
  padding: 0;
  border: none;
}

/* Make section headers smaller */
:deep(.section-title) {
  font-size: 1.5rem !important;
  font-weight: 600 !important;
}

:deep(.section-subtitle) {
  font-size: 0.875rem !important;
}

/* Make section header spacing smaller */
:deep(.section-header) {
  margin-bottom: 1.5rem !important;
}

/* Make avatar smaller */
:deep(.gradient-avatar) {
  width: 48px !important;
  height: 48px !important;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
}

:deep(.gradient-avatar .v-icon) {
  font-size: 24px !important;
}

/* Override purple colors with blue */
:deep(.send-button) {
  background: #3b82f6 !important;
}

:deep(.send-button:hover) {
  background: #2563eb !important;
}

:deep(.suggestion-chip) {
  background: rgba(59, 130, 246, 0.1) !important;
  color: #2563eb !important;
  border-color: rgba(59, 130, 246, 0.2) !important;
}

:deep(.response-avatar) {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
}

:deep(.response-label) {
  color: #2563eb !important;
  font-size: 0.875rem !important;
}

:deep(.manage-button) {
  background: #3b82f6 !important;
  box-shadow: none !important;
  height: 40px !important;
  font-size: 0.875rem !important;
}

:deep(.manage-button:hover) {
  background: #2563eb !important;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2) !important;
}

/* Make input field smaller */
:deep(.v-text-field .v-field) {
  border-color: #e5e7eb !important;
  background: #f9fafb !important;
  font-size: 0.875rem !important;
}

:deep(.v-text-field .v-field:hover) {
  border-color: #d1d5db !important;
}

:deep(.v-text-field .v-field__input) {
  min-height: 42px !important;
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}

/* Make suggestions smaller */
:deep(.suggestions-label) {
  font-size: 0.8rem !important;
  margin-bottom: 0.75rem !important;
}

:deep(.suggestion-chip) {
  font-size: 0.75rem !important;
}

/* Make response text smaller */
:deep(.response-content) {
  padding: 1.25rem !important;
}

:deep(.response-text) {
  font-size: 0.875rem !important;
  line-height: 1.6 !important;
}

/* Clean button styles */
:deep(.v-btn) {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    padding: 1.5rem 1rem;
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .hero-subtitle {
    font-size: 0.9rem;
  }

  .main-content {
    padding: 1.5rem 1rem;
  }

  .content-platform {
    padding: 1.5rem;
    border-radius: 0.5rem;
  }

  .section-divider {
    margin: 1.5rem 0;
  }

  :deep(.section-title) {
    font-size: 1.375rem !important;
  }

  :deep(.gradient-avatar) {
    width: 44px !important;
    height: 44px !important;
  }

  .floating-icon {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 1.25rem 1rem;
  }

  .hero-title {
    font-size: 1.375rem;
  }

  .hero-subtitle {
    font-size: 0.875rem;
  }

  .content-platform {
    padding: 1.25rem;
  }

  .section-divider {
    margin: 1.25rem 0;
  }

  :deep(.section-title) {
    font-size: 1.25rem !important;
  }

  .floating-icon {
    font-size: 1.25rem;
  }
}
</style>