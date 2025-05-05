<template>
  <v-container fluid style="max-width: 1200px">
    <v-row class="text-center py-6">
      <v-col cols="12">
        <h1 class="text-h2 font-weight-bold mb-6 pt-5">Apply 4 College <span class="text-body-1 font-weight-bold bg-primary white--text px-2 py-1 rounded">.org</span></h1>
      
      </v-col>
    </v-row>

    <!-- AI Question Section -->
    <v-row justify="center">
      <v-col cols="12" md="8">
        <!-- Input Field Row -->
        <v-row align="center" class="mt-2 mb-1">
          <v-col cols="11" class="pa-1">
            <v-text-field
              v-model="aiQuestion"
              label="Ask the AI Advisor"
              variant="outlined" 
              flat
              hide-details
              clearable
              @keydown.enter="askAI"
              class="text-h6"
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
                v-for="(suggestion, i) in suggestedQuestions"
                :key="i"
                @click="askSuggestedQuestion(suggestion)"
                size="small"
                variant="outlined"
                color="primary"
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
          class="mt-4 pa-3"
          elevation="2"
        >
          <v-card-text>
            <div v-html="formattedAiResponse"></div>
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
        <v-card class="pa-4" rounded="lg">
          <v-card-title class="text-h6 d-flex align-center">
            Your Saved Colleges
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              color="primary"
              to="/explore"
              size="small"
            >
              Manage List
            </v-btn>
          </v-card-title>
          <v-divider class="my-2"></v-divider>

          <!-- Early Decision Colleges -->
          <div class="mb-6">
            <h3 class="text-subtitle-1 font-weight-medium mb-2">Early Decision</h3>
            <v-row v-if="earlyDecisionColleges.length > 0">
              <v-col
                v-for="(college, i) in earlyDecisionColleges"
                :key="`ed-${i}`"
                cols="12" sm="6" md="4"
              >
                <v-card class="h-100" variant="outlined" hover>
                  <v-img :src="college.image" height="140" cover class="mb-2"></v-img>
                  <v-card-title class="text-subtitle-1 font-weight-bold">{{ college.name }}</v-card-title>
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
                    <v-spacer></v-spacer>
                    <v-rating
                      :model-value="college.rating"
                      color="amber"
                      density="compact"
                      size="x-small"
                      readonly
                    ></v-rating>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
            <v-alert
              v-else
              type="info"
              variant="tonal"
              border="start"
              density="compact"
            >
              No colleges saved under Early Decision yet. Visit the <router-link to="/explore">Explore</router-link> page.
            </v-alert>
          </div>

          <!-- Regular Decision Colleges -->
          <div>
            <h3 class="text-subtitle-1 font-weight-medium mb-2">Regular Decision</h3>
            <v-row v-if="regularDecisionColleges.length > 0">
              <v-col
                v-for="(college, i) in regularDecisionColleges"
                :key="`rd-${i}`"
                cols="12" sm="6" md="4"
              >
                <v-card class="h-100" variant="outlined" hover>
                  <v-img :src="college.image" height="140" cover class="mb-2"></v-img>
                  <v-card-title class="text-subtitle-1 font-weight-bold">{{ college.name }}</v-card-title>
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
                    <v-spacer></v-spacer>
                    <v-rating
                      :model-value="college.rating"
                      color="amber"
                      density="compact"
                      size="x-small"
                      readonly
                    ></v-rating>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
            <v-alert
              v-else
              type="info"
              variant="tonal"
              border="start"
              density="compact"
            >
              No colleges saved under Regular Decision yet. Visit the <router-link to="/explore">Explore</router-link> page.
            </v-alert>
          </div>

        </v-card>
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

// Removed savedCollegesDetails computed property

// --- Methods ---
const askAI = async () => {
  if (!aiQuestion.value) return;

  loadingAiResponse.value = true;
  aiError.value = '';
  aiResponse.value = '';

  try {
    // First attempt to use the getGeneralAdvice function
    const result = await getGeneralAdvice(userProfile.value || {}, aiQuestion.value);

    if (result && result.success && result.advice) {
      aiResponse.value = result.advice;
    } else {
      // Fallback to a generic response if API call fails
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
      aiResponse.value = generateFallbackResponse();
    }
  } catch (error) {
    console.error('Error asking AI:', error);
    // Fallback response
    aiResponse.value = generateFallbackResponse();
  } finally {
    loadingAiResponse.value = false;
  }
};

// Method to handle suggested question clicks
const askSuggestedQuestion = (question) => {
  aiQuestion.value = question;
  askAI();
};

const generateFallbackResponse = () => {
  const profile = userProfile.value || {};
  const totalSAT = (profile.satReading || 0) + (profile.satMath || 0);
  const responses = [
    `Based on your profile with ${totalSAT > 0 ? `SAT score of ${totalSAT}` : 'your test scores'} and ${profile.gpa || 'your'} GPA, I recommend focusing on colleges that match your academic profile. Consider creating a balanced list with reach, match, and safety schools.`,
    `Your question about "${aiQuestion.value}" is important. I recommend discussing this with your guidance counselor who can provide personalized advice for your specific situation.`,
    `To improve your college applications, focus on maintaining strong grades, participating in meaningful extracurriculars, and crafting compelling essays that showcase your unique qualities.`
  ];

  // Clear the input after generating fallback
  // aiQuestion.value = '';

  return responses[Math.floor(Math.random() * responses.length)];
};

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
          .map(savedCollege => colleges.find(c => c.name === savedCollege.name))
          .filter(college => !!college); // Filter out nulls
      }

      // Load Regular Decision colleges
      if (profileData.regularDecisionColleges && Array.isArray(profileData.regularDecisionColleges)) {
        regularDecisionColleges.value = profileData.regularDecisionColleges
          .map(savedCollege => colleges.find(c => c.name === savedCollege.name))
          .filter(college => !!college); // Filter out nulls
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
</style>
