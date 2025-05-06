<template>
  <v-container fluid style="max-width: 1200px">
    <v-row class="text-center py-6">
      <v-col cols="12">
        <h1 class="text-h2 font-weight-bold mb-6 pt-5">Apply 4 College <span class="text-body-1 font-weight-bold bg-primary white--text px-2 py-1 rounded">.org</span></h1>

      </v-col>
    </v-row>

    <!-- AI Question Section -->
    <!-- AI Question Section -->
    <v-row justify="center" class="my-8">
      <v-col cols="12" md="10" lg="9">
        <!-- AI Advisor Header -->
        <div class="d-flex align-center mb-4">
          <v-avatar color="primary" class="mr-3" size="42">
            <v-icon icon="mdi-robot" color="white"></v-icon>
          </v-avatar>
          <h2 class="text-h5 font-weight-bold">AI College Advisor</h2>
        </div>

        <!-- Input Field Row -->
        <v-row align="center" class="mt-2 mb-1">
          <v-col cols="11" class="pa-1">
            <v-text-field
              v-model="aiQuestion"
              label="Ask about college admissions"
              variant="solo-filled"
              hide-details
              clearable
              @keydown.enter="askAI"
              class="ai-input"
              density="comfortable"
            ></v-text-field>
          </v-col>
          <v-col cols="1" class="pa-1 text-center">
            <v-btn
              icon="mdi-send"
              color="primary"
              @click="askAI"
              :loading="loadingAiResponse"
              :disabled="!aiQuestion || loadingAiResponse"
              size="large"
            >
            </v-btn>
          </v-col>
        </v-row>

        <!-- Suggested Questions -->
        <v-row class="mt-3 mb-3">
          <v-col cols="12">
            <v-chip-group column>
              <v-chip
                v-for="(suggestion, i) in personalizedSuggestions"
                :key="i"
                @click="askSuggestedQuestion(suggestion)"
                color="primary"
                size="small"
                class="ma-1"
              >
                {{ suggestion }}
              </v-chip>
            </v-chip-group>
          </v-col>
        </v-row>

        <!-- Loading Indicator -->
        <v-progress-linear
          v-if="loadingAiResponse"
          indeterminate
          color="primary"
          class="mt-3"
        ></v-progress-linear>

        <!-- AI Response Card -->
        <v-card
          v-if="aiResponse"
          variant="tonal"
          color="info"
          class="mt-4 pa-4 elevation-3"
          rounded="lg"
        >
          <v-card-text>
            <div class="d-flex align-center mb-3" v-if="Object.keys(userProfile).length > 0">
              <v-chip size="small" color="primary" class="mr-2">Personalized</v-chip>
              <span class="text-caption">Based on your profile</span>
            </div>
            <div v-html="formattedAiResponse" class="ai-response-text"></div>
          </v-card-text>
        </v-card>

        <!-- Error Alert -->
        <v-alert
          v-if="aiError"
          type="error"
          variant="tonal"
          class="mt-4"
          border="start"
          density="compact"
        >
          {{ aiError }}
        </v-alert>
      </v-col>
    </v-row>

    <!-- User's Saved Colleges Section -->
    <v-row class="mt-8">
      <v-col cols="12">
        <div class="d-flex align-center mb-4">
          <h2 class="text-h6 font-weight-bold">Your Saved Colleges</h2>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            color="primary"
            to="/explore"
            size="small"
          >
            Manage List
          </v-btn>
        </div>

        <!-- Combined ED/RD Colleges Horizontal Scroll -->
        <div v-if="allSavedColleges.length > 0" class="saved-colleges-scroll">
          <div class="d-flex overflow-x-auto py-2">
            <v-card
              v-for="(college, i) in allSavedColleges"
              :key="`college-${i}`"
              hover
              class="college-card flex-shrink-0 me-4"
              width="280"
            >
              <div class="d-flex align-center px-2 pt-2">
                <v-chip
                  size="x-small"
                  :color="college.isEarlyDecision ? 'error' : 'primary'"
                  class="text-caption"
                >
                  {{ college.isEarlyDecision ? 'ED' : 'RD' }}
                </v-chip>
                <v-spacer></v-spacer>
                <v-rating
                  :model-value="college.rating"
                  color="amber"
                  density="compact"
                  size="x-small"
                  readonly
                ></v-rating>
              </div>
              <v-img :src="college.image" height="120" cover class="mb-2"></v-img>
              <v-card-title class="text-subtitle-1 font-weight-bold pt-0">{{ college.name }}</v-card-title>
              <v-card-subtitle>{{ college.location }}</v-card-subtitle>
              <v-card-text class="pb-0">
                <div class="d-flex align-center mb-2">
                  <v-chip :color="getAcceptanceRateColor(college.acceptanceRate)" size="small" class="mr-2">
                    {{ college.acceptanceRate }}% Acceptance
                  </v-chip>
                  <v-chip :color="college.collegeType === 'STEM-heavy' ? 'info' : 'success'" size="small">
                    {{ college.collegeType }}
                  </v-chip>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn variant="text" color="primary" @click="viewCollege(college)">View Details</v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </div>

        <!-- Empty state message if no colleges -->
        <v-alert
          v-else
          type="info"
          variant="tonal"
          border="start"
          density="compact"
        >
          You haven't saved any colleges yet. Visit the <router-link to="/explore">Explore</router-link> page to add colleges to your list.
        </v-alert>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { getGeneralAdvice } from '@/utils/profileRecommendationService';
import { colleges } from '@/data/colleges.js';
import { useRouter } from 'vue-router';
import a4cIcon from '@/assets/logo.svg';

const userStore = useUserStore();
const router = useRouter();

const aiQuestion = ref('');
const aiResponse = ref('');
const aiError = ref('');
const loadingAiResponse = ref(false);

// Refs for saved colleges
const earlyDecisionColleges = ref([]);
const regularDecisionColleges = ref([]);

// Suggested questions for the AI
const suggestedQuestions = ref([
  'What are common essay topics?',
  'How important are extracurriculars?',
  'Tips for SAT/ACT prep?',
  'Difference between Early Action and Early Decision?',
]);

// --- Computed Properties ---
const userProfile = computed(() => {
  // Get profile from localStorage if not in store
  if (Object.keys(userStore.profile || {}).length === 0) {
    try {
      const savedData = localStorage.getItem('userProfileData');
      if (savedData) return JSON.parse(savedData);
    } catch (e) {
      console.error('Error loading profile from localStorage:', e);
    }
  }
  return userStore.profile;
});

const formattedAiResponse = computed(() => {
  if (!aiResponse.value) return '';
  // Basic formatting, can be enhanced
  return aiResponse.value.replace(/\n/g, '<br>');
});

// Combined computed property for all saved colleges
const allSavedColleges = computed(() => {
  // Combine both arrays and ensure no duplicates
  const combined = [...earlyDecisionColleges.value, ...regularDecisionColleges.value];
  const uniqueColleges = Array.from(new Set(combined.map(college => college.name)))
    .map(name => combined.find(college => college.name === name));
  return uniqueColleges;
});

const askAI = async () => {
  if (!aiQuestion.value) return;

  loadingAiResponse.value = true;
  aiError.value = '';
  aiResponse.value = '';

  try {
    // Get the user's profile data and pass it along with the question
    const result = await getGeneralAdvice(userProfile.value || {}, aiQuestion.value);

    if (result && result.success && result.advice) {
      aiResponse.value = result.advice;
    } else {
      // Fallback to a generic response if API call fails
      aiError.value = result?.error || 'Unable to get a response. Please try again.';

      // Simulate delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));

      // If no specific error message, provide a fallback response
      if (!aiError.value) {
        aiResponse.value = "I couldn't process your question with your profile information. Please try a different question or check your profile details.";
      }
    }
  } catch (error) {
    console.error('Error asking AI:', error);
    aiError.value = 'An unexpected error occurred. Please try again.';
  } finally {
    loadingAiResponse.value = false;
  }
};

// Method to handle suggested question clicks
const askSuggestedQuestion = (question) => {
  aiQuestion.value = question;
  askAI();
};

const personalizedSuggestions = computed(() => {
  const profile = userProfile.value || {};
  const suggestions = [...suggestedQuestions.value]; // Start with default suggestions

  // Add personalized suggestions based on profile
  if (profile.intendedMajor === 'STEM') {
    suggestions.push('How to showcase STEM projects?');
    suggestions.push('Best STEM scholarships?');
  } else if (profile.intendedMajor === 'Liberal Arts') {
    suggestions.push('How to highlight humanities interests?');
    suggestions.push('Liberal Arts scholarship opportunities?');
  }

  // Add suggestions based on test scores
  if ((profile.satMath + profile.satReading) < 1200) {
    suggestions.push('Colleges that focus less on SAT scores?');
  }

  // If they have AP classes
  if (profile.apClasses && profile.apClasses.length > 0) {
    suggestions.push('How AP scores affect admissions?');
  }

  return suggestions.slice(0, 6); // Limit to 6 suggestions
});

// Get color for acceptance rate chip (copied from explorePage)
const getAcceptanceRateColor = (rate) => {
  if (rate < 10) return 'error';
  if (rate < 20) return 'warning';
  if (rate < 40) return 'info';
  return 'success';
};

// Removed fetchRecommendations and related states/logic

const viewCollege = (college) => {
  // Navigate to explore page with this college or show details dialog
  // Pass college ID as a query parameter to potentially highlight it on the explore page
  router.push({ path: '/explore', query: { collegeId: college.id } });
};

// --- Lifecycle Hooks ---
onMounted(() => {
  // Load saved colleges from localStorage
  const savedData = localStorage.getItem('userProfileData');
  if (savedData) {
    try {
      const profileData = JSON.parse(savedData);

      // Load Early Decision colleges
      if (profileData.earlyDecisionColleges && Array.isArray(profileData.earlyDecisionColleges)) {
        earlyDecisionColleges.value = profileData.earlyDecisionColleges
          .map(savedCollege => {
            const college = colleges.find(c => c.name === savedCollege.name);
            if (college) {
              // Explicitly set isEarlyDecision to true for ED colleges
              return { ...college, isEarlyDecision: true };
            }
            return null;
          })
          .filter(college => !!college);
      }

      // Load Regular Decision colleges
      if (profileData.regularDecisionColleges && Array.isArray(profileData.regularDecisionColleges)) {
        regularDecisionColleges.value = profileData.regularDecisionColleges
          .map(savedCollege => {
            const college = colleges.find(c => c.name === savedCollege.name);
            if (college) {
              // Explicitly set isEarlyDecision to false for RD colleges
              return { ...college, isEarlyDecision: false };
            }
            return null;
          })
          .filter(college => !!college);
      }

      console.log('Home: Loaded ED/RD colleges from localStorage');
    } catch (e) {
      console.error('Home: Error parsing saved profile data:', e);
      // Optionally clear localStorage if corrupt
      // localStorage.removeItem('userProfileData');
    }
  }
});
</script>

<style scoped>
.v-card {
  transition: box-shadow 0.3s ease-in-out, transform 0.2s;
}
.v-card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

/* Style for the input field */
.v-text-field.text-h6 >>> .v-field__input {
  font-size: 1.1rem; /* Adjust size as needed */
  padding-top: 12px; /* Adjust vertical padding */
  padding-bottom: 12px;
}

/* Style suggested question chips */
.v-chip {
  cursor: pointer;
}

/* Custom styles for the saved colleges section */
.saved-colleges-scroll {
  padding: 8px 0;
}

.college-card {
  width: 280px; /* Fixed width for cards in horizontal scroll */
}
/* AI Advisor specific styles */
.ai-input >>> .v-field__input {

  min-height: 56px;
}

.ai-response-text {
  font-size: 1.05rem;
  line-height: 1.6;
}

/* For the AI Advisor section */
.v-chip-group {
  flex-wrap: wrap;
}

.v-chip {
  margin: 4px;
}
</style>
