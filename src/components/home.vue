<template>
  <v-container fluid class="pa-0">
    <!-- Modern Hero Header -->
    <v-sheet class="hero-section" color="primary">
      <v-container>
        <v-row align="center" class="py-6 py-md-8">
          <v-col cols="12" class="text-center">
            <p class="text-h2 font-weight-bold mb-6 text-white">
              {{ $t('homePage.title') }}
              <v-chip color="white" text-color="primary" size="small" class="ml-2">
                .org
              </v-chip>
            </p>
            <p class="text-body-1 text-white opacity-90 mb-0">
              Your personalized college journey starts here
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <v-container class="py-8 py-md-12">
      <!-- Integrated AI Advisor Section -->
      <div class="mb-12">
        <v-row align="center" class="mb-6">
          <v-col cols="auto">
            <v-avatar color="primary" size="56" class="gradient-avatar">
              <v-icon size="32" color="white">mdi-robot-happy</v-icon>
            </v-avatar>
          </v-col>
          <v-col>
            <h2 class="text-h4 text-md-h3 font-weight-black">{{ $t('homePage.aiAdvisor') }}</h2>
            <p class="text-body-1 text-grey-darken-1 mb-0">Get instant personalized college advice powered by AI</p>
          </v-col>
        </v-row>

        <!-- Enhanced Input -->
        <v-text-field
          v-model="aiQuestion"
          :label="$t('homePage.askPlaceholder')"
          variant="outlined"
          clearable
          @keydown.enter="askAI"
          :loading="loadingAiResponse"
          :disabled="loadingAiResponse"
          class="mb-4"
          bg-color="grey-lighten-5"
          rounded="lg"
        >
          <template v-slot:append-inner>
            <v-btn
              icon="mdi-send"
              variant="flat"
              color="primary"
              @click="askAI"
              :loading="loadingAiResponse"
              :disabled="!aiQuestion"
              size="small"
              rounded="lg"
            />
          </template>
        </v-text-field>

        <!-- Quick Suggestions -->
        <div v-if="!aiResponse" class="mb-4">
          <p class="text-subtitle-2 text-grey-darken-2 mb-3">Quick questions to get started:</p>
          <v-chip-group>
            <v-chip
              v-for="(q, i) in quickQuestions"
              :key="i"
              @click="() => { aiQuestion = q; askAI(); }"
              color="primary"
              variant="tonal"
              size="small"
              rounded="lg"
              class="ma-1"
            >
              {{ q }}
            </v-chip>
          </v-chip-group>
        </div>

        <!-- AI Response -->
        <v-expand-transition>
          <v-card
            v-if="aiResponse"
            color="primary"
            variant="tonal"
            rounded="xl"
            class="mt-4"
            elevation="2"
          >
            <v-card-text class="pa-4">
              <div class="d-flex align-start mb-3">
                <v-avatar size="32" color="primary" class="mr-3">
                  <v-icon size="18" color="white">mdi-robot-happy</v-icon>
                </v-avatar>
                <div class="flex-grow-1">
                  <div v-html="formattedAiResponse"></div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-expand-transition>

        <!-- Error -->
        <v-alert
          v-if="aiError"
          type="error"
          variant="tonal"
          rounded="xl"
          class="mt-4"
          elevation="0"
        >
          {{ aiError }}
        </v-alert>
      </div>

      <!-- Enhanced Saved Colleges Section -->
      <div class="mb-6">
        <v-row align="center" class="mb-6">
          <v-col>
            <h2 class="text-h4 text-md-h3 font-weight-black">{{ $t('homePage.savedColleges') }}</h2>
            <p class="text-body-1 text-grey-darken-1 mb-0">Your personalized college shortlist</p>
          </v-col>
          <v-col cols="auto">
            <v-btn
              variant="tonal"
              color="primary"
              to="/explore"
              append-icon="mdi-arrow-right"
              rounded="lg"
              size="large"
            >
              {{ $t('homePage.manageList') }}
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <!-- Enhanced College Grid -->
      <v-row v-if="allSavedColleges.length > 0">
        <v-col
          v-for="college in allSavedColleges"
          :key="college.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card
            rounded="xl"
            hover
            @click="viewCollege(college)"
            class="college-card h-100"
            elevation="4"
          >
            <v-img
              :src="college.image"
              height="160"
              cover
              class="college-image"
            >
              <v-chip
                :color="college.isEarlyDecision ? 'error' : 'success'"
                size="small"
                class="ma-3 position-absolute"
                style="top: 0; right: 0;"
                variant="flat"
              >
                {{ college.isEarlyDecision ? 'ED' : 'RD' }}
              </v-chip>
            </v-img>
            
            <v-card-text class="pa-4">
              <h3 class="text-h6 font-weight-bold text-truncate mb-1">{{ college.name }}</h3>
              <p class="text-body-2 text-grey-darken-1 mb-3">{{ college.location }}</p>
              
              <div class="d-flex align-center gap-2 mb-3">
                <v-chip size="small" variant="tonal" color="primary">
                  <v-icon start size="small">mdi-percent</v-icon>
                  {{ college.acceptanceRate }}%
                </v-chip>
                <v-chip size="small" variant="tonal" color="secondary">
                  {{ college.collegeType === 'STEM-heavy' ? 'STEM' : 'Liberal Arts' }}
                </v-chip>
              </div>
              
              <v-rating
                :model-value="college.rating"
                color="amber"
                density="compact"
                size="small"
                readonly
                class="mb-2"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Enhanced Empty State -->
      <v-card
        v-else
        variant="outlined"
        rounded="xl"
        class="text-center pa-8 pa-md-12"
        elevation="0"
        color="grey-lighten-5"
      >
        <div class="empty-state-content">
          <v-icon size="80" color="grey-lighten-1" class="mb-6">mdi-school-outline</v-icon>
          <h3 class="text-h4 font-weight-bold mb-3" style="color: black">No colleges saved yet</h3>
          <p class="text-body-1 text-grey-darken-1 mb-8 mx-auto" style="max-width: 400px;">
            Start building your personalized college list by exploring our comprehensive database of universities
          </p>
          <v-btn 
            color="primary" 
            size="x-large" 
            to="/explore" 
            prepend-icon="mdi-compass"
            rounded="xl"
            variant="flat"
            class="px-8"
          >
            Explore Colleges
          </v-btn>
        </div>
      </v-card>
    </v-container>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { getGeneralAdvice } from '@/utils/profileRecommendationService';
import { colleges } from '@/data/colleges.js';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const userStore = useUserStore();
const router = useRouter();
const { t } = useI18n();

const aiQuestion = ref('');
const aiResponse = ref('');
const aiError = ref('');
const loadingAiResponse = ref(false);

const earlyDecisionColleges = ref([]);
const regularDecisionColleges = ref([]);

const quickQuestions = [
  '🎯 How do I write a compelling essay?',
  '🌟 What extracurriculars matter most?',
  '⚡ Should I apply early decision?',
  '📈 How can I improve my test scores?',
  '💰 How do I find scholarships?',
  '🎓 What major should I choose?'
];

const userProfile = computed(() => {
  const profile = userStore.profile;
  if (!profile || Object.keys(profile).length === 0) {
    try {
      const profileKey = userStore.isAuthenticated ? 'userProfileData' : 'guestProfileData';
      const saved = localStorage.getItem(profileKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }
  return profile;
});

const formattedAiResponse = computed(() => {
  return aiResponse.value.replace(/\n/g, '<br>');
});

const allSavedColleges = computed(() => {
  const all = [...earlyDecisionColleges.value, ...regularDecisionColleges.value];
  const unique = new Map();
  all.forEach(college => {
    if (college && college.name && !unique.has(college.name)) {
      unique.set(college.name, college);
    }
  });
  return Array.from(unique.values());
});

const askAI = async () => {
  if (!aiQuestion.value.trim()) return;
  
  loadingAiResponse.value = true;
  aiError.value = '';
  aiResponse.value = '';
  
  try {
    const result = await getGeneralAdvice(userProfile.value, aiQuestion.value);
    if (result?.success && result?.advice) {
      aiResponse.value = result.advice;
    } else {
      aiError.value = 'Unable to get a response. Please try again.';
    }
  } catch (error) {
    aiError.value = 'An error occurred. Please try again.';
  } finally {
    loadingAiResponse.value = false;
  }
};

const viewCollege = (college) => {
  router.push({ path: '/explore', query: { collegeId: college.id } });
};

onMounted(() => {
  // Use same profile key logic as other pages
  const profileKey = userStore.isAuthenticated ? 'userProfileData' : 'guestProfileData';
  const saved = localStorage.getItem(profileKey);
  if (saved) {
    try {
      const data = JSON.parse(saved);
      
      if (data.earlyDecisionColleges?.length) {
        earlyDecisionColleges.value = data.earlyDecisionColleges
          .map(c => ({
            ...colleges.find(col => col.name === c.name),
            isEarlyDecision: true
          }))
          .filter(Boolean);
      }
      
      if (data.regularDecisionColleges?.length) {
        regularDecisionColleges.value = data.regularDecisionColleges
          .map(c => ({
            ...colleges.find(col => col.name === c.name),
            isEarlyDecision: false
          }))
          .filter(Boolean);
      }
    } catch (e) {
      console.error('Error loading colleges:', e);
    }
  }
});
</script>

<style scoped>
/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, var(--v-theme-primary) 0%, var(--v-theme-primary-darken-1) 100%);
  overflow: hidden;
}

/* Enhanced Card Hover Effects */
.college-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid rgba(0,0,0,0.05);
}

.college-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}

.college-image {
  transition: transform 0.3s ease;
}

.college-card:hover .college-image {
  transform: scale(1.05);
}

/* Gradient Avatar */
.gradient-avatar {
  background: linear-gradient(135deg, var(--v-theme-primary) 0%, var(--v-theme-secondary) 100%);
}

/* Gap utility */
.gap-2 {
  gap: 0.5rem;
}

/* Empty state animations */
.empty-state-content {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Clean button styles */
.v-btn {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
}

/* Enhanced chip styles */
.v-chip {
  font-weight: 500;
}
</style>