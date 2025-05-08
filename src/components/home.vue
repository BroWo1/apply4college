<template>
  <v-container fluid style="max-width: 1200px">
    <v-row class="text-center py-6">
      <v-col cols="12">
        <h1 class="text-h2 font-weight-bold mb-6 pt-5">Apply 4 College <span class="text-body-1 font-weight-bold bg-primary white--text px-2 py-1 rounded">.org</span></h1>
      </v-col>
    </v-row>

    <v-row justify="center" class="my-8">
      <v-col cols="12" md="10" lg="9">
          <div class="d-flex align-center mb-5">
            <v-avatar color="primary" class="mr-3" size="42">
              <v-icon icon="mdi-robot" color="white"></v-icon>
            </v-avatar>
            <h2 class="text-h5 font-weight-bold">AI College Advisor</h2>
          </div>

          <v-row align="center" class="mt-2 mb-2">
            <v-col cols="11" class="pa-1 pe-2">
              <v-text-field
                v-model="aiQuestion"
                label="Ask about college admissions"
                variant="solo-filled" hide-details
                clearable
                @keydown.enter="askAI"
                class="ai-input"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="1" class="pa-1 ps-0 text-center">
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

          <v-row class="mt-3 mb-4">
            <v-col cols="12">
              <v-chip-group>
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

          <v-progress-linear
            v-if="loadingAiResponse"
            indeterminate
            color="primary"
            class="my-3"
          ></v-progress-linear>

          <v-card
            v-if="aiResponse"
            variant="tonal"
            color="info"
            class="mt-4 pa-4 elevation-2"
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

    <v-row class="mt-10">
      <v-col cols="12">
        <div class="d-flex align-center mb-4">
          <h2 class="text-h6 font-weight-bold">Your Saved Colleges</h2>
          <v-spacer></v-spacer>
          <v-btn
            variant="tonal"
            color="primary"
            to="/explore"
            size="small"
          >
            Manage List
          </v-btn>
        </div>

        <div v-if="allSavedColleges.length > 0" class="saved-colleges-scroll">
          <div class="d-flex overflow-x-auto py-3">
            <v-card
              v-for="college in allSavedColleges"
              :key="college.id || `college-${college.name}`"
              hover
              class="college-card flex-shrink-0 me-4"
              width="280"
              elevation="2"
            >
              <div class="d-flex align-center px-3 pt-3 pb-1">
                <v-chip
                  size="x-small"
                  :color="college.isEarlyDecision ? 'error' : 'primary'"
                  class="text-caption font-weight-medium"
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
                  class="pb-0"
                ></v-rating>
              </div>
              <v-img :src="college.image" height="120" cover class="mb-2"></v-img>
              <v-card-title class="text-subtitle-1 font-weight-bold pt-0 px-3">{{ college.name }}</v-card-title>
              <v-card-subtitle class="px-3">{{ college.location }}</v-card-subtitle>
              <v-card-text class="pb-2 px-3">
                <div class="d-flex align-center my-2">
                  <v-chip :color="getAcceptanceRateColor(college.acceptanceRate)" size="small" class="mr-2">
                    {{ college.acceptanceRate }}% Acceptance
                  </v-chip>
                  <v-chip :color="college.collegeType === 'STEM-heavy' ? 'info' : 'success'" size="small">
                    {{ college.collegeType }}
                  </v-chip>
                </div>
              </v-card-text>
              <v-card-actions class="px-3 pb-3 pt-0">
                <v-btn variant="text" color="primary" @click="viewCollege(college)" block>View Details</v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </div>

        <v-alert
          v-else
          type="info"
          variant="tonal"
          border="start"
          density="compact"
          class="py-3"
        >
          You haven't saved any colleges yet. Visit the <router-link to="/explore" class="text-primary font-weight-medium">Explore</router-link> page to add colleges to your list.
        </v-alert>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
// Script setup remains the same as the previous version
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { getGeneralAdvice } from '@/utils/profileRecommendationService';
import { colleges } from '@/data/colleges.js';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const aiQuestion = ref('');
const aiResponse = ref('');
const aiError = ref('');
const loadingAiResponse = ref(false);

const earlyDecisionColleges = ref([]);
const regularDecisionColleges = ref([]);

const suggestedQuestions = ref([
  'What are common essay topics?',
  'How important are extracurriculars?',
  'Tips for SAT/ACT prep?',
  'Difference between Early Action and Early Decision?',
]);

const userProfile = computed(() => {
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
  return aiResponse.value.replace(/\n/g, '<br>');
});

const allSavedColleges = computed(() => {
  const combined = [...earlyDecisionColleges.value, ...regularDecisionColleges.value];
  const uniqueColleges = Array.from(new Set(combined.map(college => college.name)))
    .map(name => {
      const foundCollege = combined.find(college => college.name === name);
      return foundCollege;
    })
    .filter(college => !!college);
  return uniqueColleges;
});


const askAI = async () => {
  if (!aiQuestion.value) return;
  loadingAiResponse.value = true;
  aiError.value = '';
  aiResponse.value = '';
  try {
    const result = await getGeneralAdvice(userProfile.value || {}, aiQuestion.value);
    if (result && result.success && result.advice) {
      aiResponse.value = result.advice;
    } else {
      aiError.value = result?.error || 'Unable to get a response. Please try again.';
      if (!result?.error && !result?.advice) {
        await new Promise(resolve => setTimeout(resolve, 800));
        aiResponse.value = "I couldn't process your question effectively right now. Please try rephrasing or ask a different question.";
        aiError.value = '';
      }
    }
  } catch (error) {
    console.error('Error asking AI:', error);
    aiError.value = 'An unexpected error occurred. Please try again.';
  } finally {
    loadingAiResponse.value = false;
  }
};

const askSuggestedQuestion = (question) => {
  aiQuestion.value = question;
  askAI();
};

const personalizedSuggestions = computed(() => {
  const profile = userProfile.value || {};
  const suggestions = [...suggestedQuestions.value];
  if (profile.intendedMajor === 'STEM') {
    suggestions.push('How to showcase STEM projects?');
    suggestions.push('Best STEM scholarships?');
  } else if (profile.intendedMajor === 'Liberal Arts') {
    suggestions.push('How to highlight humanities interests?');
    suggestions.push('Liberal Arts scholarship opportunities?');
  }
  if (profile.satMath && profile.satReading && (profile.satMath + profile.satReading) < 1200) {
    suggestions.push('Colleges that focus less on SAT scores?');
  }
  if (profile.apClasses && profile.apClasses.length > 0) {
    suggestions.push('How AP scores affect admissions?');
  }
  const finalSuggestions = Array.from(new Set(suggestions));
  return finalSuggestions.slice(0, 6);
});

const getAcceptanceRateColor = (rate) => {
  if (rate < 10) return 'error';
  if (rate < 20) return 'warning';
  if (rate < 40) return 'info';
  return 'success';
};

const viewCollege = (college) => {
  router.push({ path: '/explore', query: { collegeId: college.id } });
};

onMounted(() => {
  const savedData = localStorage.getItem('userProfileData');
  if (savedData) {
    try {
      const profileData = JSON.parse(savedData);
      if (profileData.earlyDecisionColleges && Array.isArray(profileData.earlyDecisionColleges)) {
        earlyDecisionColleges.value = profileData.earlyDecisionColleges
          .map(savedCollege => {
            const college = colleges.find(c => c.name === savedCollege.name);
            return college ? { ...college, id: college.id, isEarlyDecision: true } : null;
          })
          .filter(college => !!college);
      }
      if (profileData.regularDecisionColleges && Array.isArray(profileData.regularDecisionColleges)) {
        regularDecisionColleges.value = profileData.regularDecisionColleges
          .map(savedCollege => {
            const college = colleges.find(c => c.name === savedCollege.name);
            return college ? { ...college, id: college.id, isEarlyDecision: false } : null;
          })
          .filter(college => !!college);
      }
      console.log('Home: Loaded ED/RD colleges from localStorage');
    } catch (e) {
      console.error('Home: Error parsing saved profile data:', e);
    }
  }
});
</script>

<style scoped>

  .saved-colleges-scroll {
    padding-bottom: 8px;
  }

  .ai-input :deep(.v-field__input) {
    min-height: 56px;
    align-items: center;
  }

  .ai-response-text {
    font-size: 1.0rem;
    line-height: 1.65;
  }

  .v-chip.ma-1 {
    margin: 4px !important;
  }

  .v-alert .text-primary {
    text-decoration: none;
    font-weight: 500;
  }
  .v-alert .text-primary:hover {
    text-decoration: underline;
  }
</style>
