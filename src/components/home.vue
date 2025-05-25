<template>
  <v-container fluid class="pa-0">
    <!-- Simplified Header -->
    <v-sheet color="grey-lighten-4" class="py-6">
      <v-container>
        <h1 class="text-h2 font-weight-bold pt-5 text-center">
          {{ $t('homePage.title') }}
          <v-chip color="primary" size="small" class="ml-2">.org</v-chip>
        </h1>
      </v-container>
    </v-sheet>

    <v-container class="mt-4">
      <!-- Direct AI Advisor -->
      <v-card rounded="xl" elevation="3" class="mb-8">
        <v-card-text class="pa-6">
          <v-row align="center" class="mb-4">
            <v-col cols="auto">
              <v-avatar color="primary" size="48">
                <v-icon size="28">mdi-robot-happy</v-icon>
              </v-avatar>
            </v-col>
            <v-col>
              <h2 class="text-h5 font-weight-bold">{{ $t('homePage.aiAdvisor') }}</h2>
              <p class="text-body-2 text-grey-darken-1 mb-0">Get instant personalized college advice</p>
            </v-col>
          </v-row>

          <!-- Simplified Input -->
          <v-text-field
            v-model="aiQuestion"
            :label="$t('homePage.askPlaceholder')"
            variant="outlined"
            density="comfortable"
            clearable
            @keydown.enter="askAI"
            :loading="loadingAiResponse"
            :disabled="loadingAiResponse"
            rounded="lg"
            class="mb-3"
          >
            <template v-slot:append-inner>
              <v-btn
                icon="mdi-send"
                variant="text"
                color="primary"
                @click="askAI"
                :loading="loadingAiResponse"
                :disabled="!aiQuestion"
                size="small"
              />
            </template>
          </v-text-field>

          <!-- Quick Suggestions -->
          <v-chip-group v-if="!aiResponse">
            <v-chip
              v-for="(q, i) in quickQuestions"
              :key="i"
              @click="() => { aiQuestion = q; askAI(); }"
              color="primary"
              variant="outlined"
              size="small"
            >
              {{ q }}
            </v-chip>
          </v-chip-group>

          <!-- AI Response -->
          <v-expand-transition>
            <v-alert
              v-if="aiResponse"
              color="primary"
              variant="tonal"
              rounded="lg"
              class="mt-4"
            >
              <div v-html="formattedAiResponse"></div>
            </v-alert>
          </v-expand-transition>

          <!-- Error -->
          <v-alert
            v-if="aiError"
            type="error"
            variant="tonal"
            rounded="lg"
            class="mt-4"
          >
            {{ aiError }}
          </v-alert>
        </v-card-text>
      </v-card>

      <!-- Saved Colleges -->
      <v-row align="center" class="mb-4">
        <v-col>
          <h2 class="text-h5 font-weight-bold">{{ $t('homePage.savedColleges') }}</h2>
        </v-col>
        <v-col cols="auto">
          <v-btn
            variant="text"
            color="primary"
            to="/explore"
            append-icon="mdi-arrow-right"
          >
            {{ $t('homePage.manageList') }}
          </v-btn>
        </v-col>
      </v-row>

      <!-- College Grid -->
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
            rounded="lg"
            hover
            @click="viewCollege(college)"
            class="cursor-pointer"
          >
            <v-img
              :src="college.image"
              height="140"
              cover
            >
              <v-chip
                :color="college.isEarlyDecision ? 'error' : 'primary'"
                size="small"
                class="ma-2 position-absolute"
                style="top: 0; right: 0;"
              >
                {{ college.isEarlyDecision ? 'ED' : 'RD' }}
              </v-chip>
            </v-img>
            
            <v-card-text>
              <h3 class="text-subtitle-1 font-weight-bold text-truncate">{{ college.name }}</h3>
              <p class="text-caption text-grey-darken-1">{{ college.location }}</p>
              
              <div class="d-flex align-center gap-3 mt-2">
                <v-chip size="x-small" variant="tonal">
                  <v-icon start size="x-small">mdi-percent</v-icon>
                  {{ college.acceptanceRate }}%
                </v-chip>
                <v-chip size="x-small" variant="tonal">
                  {{ college.collegeType === 'STEM-heavy' ? 'STEM' : 'Liberal Arts' }}
                </v-chip>
              </div>
              
              <v-rating
                :model-value="college.rating"
                color="amber"
                density="compact"
                size="x-small"
                readonly
                class="mt-2"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Empty State -->
      <v-card
        v-else
        variant="outlined"
        rounded="xl"
        class="text-center pa-12"
      >
        <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-school-outline</v-icon>
        <h3 class="text-h5 mb-2">No colleges saved yet</h3>
        <p class="text-body-1 text-grey-darken-1 mb-6">Start building your college list today</p>
        <v-btn color="primary" size="large" to="/explore" prepend-icon="mdi-compass">
          Explore Colleges
        </v-btn>
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
  'How do I write a strong essay?',
  'What extracurriculars should I focus on?',
  'Should I apply early decision?',
  'How can I improve my SAT score?'
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
.cursor-pointer {
  cursor: pointer;
}

.gap-3 {
  gap: 0.75rem;
}
</style>