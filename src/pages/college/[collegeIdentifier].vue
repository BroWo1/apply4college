<template>
  <v-container fluid style="max-width: 1200px; ;" class="py-8" >
    <div class="mb-4 d-flex justify-start">
      <v-btn text color="primary" @click="router.push({ path: '/explore' })">
        <v-icon left>mdi-chevron-left</v-icon>
        Back to Explore
      </v-btn>
    </div>
    <div v-if="loading" class="text-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p class="mt-3">Loading college data...</p>
    </div>
    <div v-else-if="!college">
      <v-alert type="error" prominent border="start">
        College not found. It may have been removed or the link is incorrect.
      </v-alert>
      <div class="text-center mt-6">
        <v-btn color="primary" @click="$router.push({ path: '/' })">Go to Explore Page</v-btn>
      </div>
    </div>
    <div v-else>
      <!-- College Banner and Header -->
      <v-card flat class="mb-6">
        <v-img :src="college.image" height="300px" cover class="rounded-t-lg"></v-img>
      </v-card>

      <!-- College Title and Location -->
      <div class="mb-6">
        <h1 class="text-h3 font-weight-bold mb-2">{{ college.name }}</h1>
        <div class="text-subtitle-1 mb-2">{{ college.location }} • {{ college.collegeType }}</div>
      </div>

      <!-- Navigation Tabs -->
      <v-tabs v-model="activeTab" slider-color="primary" class="mb-6">
        <v-tab value="overview">Overview</v-tab>
        <v-tab value="chancing">Chancing</v-tab>
        <v-tab value="a4c-rating">Rating</v-tab>
      </v-tabs>

      <v-divider class="mb-6"></v-divider>

      <!-- Main Content Area -->
      <v-window v-model="activeTab" class="mb-6">
        <!-- Overview Tab -->
        <v-window-item value="overview">
          <OverviewTab
            :college="college"
            :collegeChance="collegeChance"
            :studentProfile="studentProfile"
            :savedColleges="savedColleges"
            :recentlyViewed="recentlyViewed"
            :similarSchools="similarSchools"
            @navigateToChancing="handleNavigateToChancing"
            @navigateToA4CRating="handleNavigateToA4CRating"
            @saveToEarly="handleSaveToEarly"
            @saveToRegular="handleSaveToRegular"
          />
        </v-window-item>

        <!-- Chancing Tab - We'll implement full content later -->
        <v-window-item value="chancing">
          <ChancingTab
            :college="college"
            :studentProfile="studentProfile"
            :detailedCollegeChance="detailedCollegeChance"
            v-model:isEarlyDecision="isEarlyDecision"
            v-model:isLegacy="isLegacy"
            :aiRecommendation="aiRecommendation"
            :aiError="aiError"
            :showNoApiKeyMessage="showNoApiKeyMessage"
            :loadingAiRec="loadingAiRec"
            :useAiRecommendation="useAiRecommendation"
            @calculateDetailedChance="calculateDetailedChance"
            @saveToEarly="handleSaveToEarly"
            @saveToRegular="handleSaveToRegular"
            @toggleAiRecommendation="toggleAiRecommendation"
          />
        </v-window-item>

        <!-- Cost & Scholarships Tab - We'll implement full content later -->
        <v-window-item value="a4c-rating">
          <A4CRatingTab :college="college" />
        </v-window-item>

        <!-- Majors Tab - We'll implement full content later -->
        <v-window-item value="majors">
          <MajorsTab :collegeName="college ? college.name : 'this school'" />
        </v-window-item>
      </v-window>
    </div>

    <!-- Add snackbar component -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
      location="top"
    >
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          icon="mdi-close"
          @click="snackbar = false"
        ></v-btn>
      </template>
    </v-snackbar>

  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdmitChanceComponent from '../../components/AdmitChanceComponent.vue';
import OverviewTab from '../../components/college/tabs/OverviewTab.vue';
import ChancingTab from '../../components/college/tabs/ChancingTab.vue';
import A4CRatingTab from '../../components/college/tabs/A4CRatingTab.vue';
import MajorsTab from '../../components/college/tabs/MajorsTab.vue';
import { colleges as allColleges } from '../../data/colleges.js';
import { getAdmissionChanceColor, getAdmissionChanceDescription, calculateAdmissionChance, prepareStudentData, getMajorMatchAssessment, adjustAcceptanceRateByMajor, adjustAcceptanceRateByStrategicFactors } from '../../utils/admitChanceCalculator';
import { getCollegeMatchAnalysis, getApiKey } from '../../utils/profileRecommendationService';

const route = useRoute();
const router = useRouter();

// Snackbar state
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

const college = ref(null);
const loading = ref(true);
const activeTab = ref('overview');

// Student profile data (loaded from localStorage)
const satReading = ref(500);
const satMath = ref(500);
const gpa = ref(3.0);
const apClasses = ref([]);
const extracurriculars = ref([]);
const intendedMajor = ref("");
const recScore = ref(2);
const isLegacy = ref(false);
const demoScore = ref(0);

const savedColleges = ref([]);
const recentlyViewed = ref([]);
const collegeChance = ref({ probabilityPercentage: 27 });

// Additional variables for detailed chancing
const detailedCollegeChance = ref({
  probabilityPercentage: 27,
  probability: 0.27,
  timesAverageApplicant: "1.0",
  zScores: { gpa: 0, sat: 0, ap: 0, ec: 0 },
  strengthBlock: 0,
  alignmentBlock: 0
});
const isEarlyDecision = ref(false);
const majorMatch = ref('neutral');

const studentProfile = computed(() => ({
  satReading: satReading.value,
  satMath: satMath.value,
  gpa: gpa.value,
  apClasses: apClasses.value,
  extracurriculars: extracurriculars.value,
  intendedMajor: intendedMajor.value,
  recScore: recScore.value,
  isLegacy: isLegacy.value,
  demoScore: demoScore.value,
}));

const loadCollegeData = () => {
  loading.value = true;
  const collegeIdentifier = route.params.collegeIdentifier;
  if (collegeIdentifier) {
    // Decode identifier if it was encoded (e.g., names with special characters)
    const decodedIdentifier = decodeURIComponent(collegeIdentifier);
    const foundCollege = allColleges.find(c => c.name.toLowerCase() === decodedIdentifier.toLowerCase());
    college.value = foundCollege || null;

    if (foundCollege) {
      // Generate similar schools based on type, location or acceptance rate
      similarSchools.value = allColleges
        .filter(c => c.name !== foundCollege.name &&
                   (c.collegeType === foundCollege.collegeType ||
                    Math.abs(c.acceptanceRate - foundCollege.acceptanceRate) < 10))
        .slice(0, 3);
    }
  } else {
    college.value = null;
  }
  loading.value = false;
};

const similarSchools = ref([]);

const chanceColor = computed(() => {
  if (!collegeChance.value) return 'grey';
  return getAdmissionChanceColor(collegeChance.value.probability || 0.27);
});

const chanceDescription = computed(() => {
  if (!collegeChance.value) return 'Calculating...';
  return getAdmissionChanceDescription(collegeChance.value.probability || 0.27);
});

const calculateChance = () => {
  if (!college.value || !studentProfile.value) {
    collegeChance.value = { probabilityPercentage: 27, probability: 0.27 };
    return;
  }

  const studentData = prepareStudentData({
    ...studentProfile.value,
    isLegacy: isLegacy.value,
    isEarlyDecision: false
  });

  try {
    collegeChance.value = calculateAdmissionChance(studentData, college.value);
  } catch (error) {
    console.error("Error calculating admission chance:", error);
    collegeChance.value = { probabilityPercentage: 27, probability: 0.27 };
  }
};

const loadProfileAndSavedColleges = () => {
  const savedData = localStorage.getItem('userProfileData');
  if (savedData) {
    try {
      const profileData = JSON.parse(savedData);
      satReading.value = profileData.satReading || 500;
      satMath.value = profileData.satMath || 500;
      gpa.value = profileData.gpa || 3.0;
      apClasses.value = profileData.apClasses || [];
      extracurriculars.value = profileData.extracurriculars || [];
      intendedMajor.value = profileData.intendedMajor || "";
      recScore.value = profileData.recScore || 2;
      isLegacy.value = profileData.isLegacy || false;
      demoScore.value = profileData.demoScore || 0;

      if (profileData.earlyDecisionColleges && Array.isArray(profileData.earlyDecisionColleges)) {
        savedColleges.value = profileData.earlyDecisionColleges.map(savedCollege => {
          const fullCollege = allColleges.find(c => c.name === savedCollege.name);
          return fullCollege || savedCollege; // Fallback to saved data if full object not found
        }).filter(Boolean);
      }
      if (profileData.regularDecisionColleges && Array.isArray(profileData.regularDecisionColleges)) {
        recentlyViewed.value = profileData.regularDecisionColleges.map(savedCollege => {
          const fullCollege = allColleges.find(c => c.name === savedCollege.name);
          return fullCollege || savedCollege;
        }).filter(Boolean);
      }
    } catch (e) {
      console.error('Error parsing saved profile data on college page:', e);
    }
  }
};

onMounted(() => {
  loadCollegeData();
  loadProfileAndSavedColleges();
  calculateChance();
  calculateDetailedChance();

  // Check for major match when component mounts
  if (college.value && intendedMajor.value) {
    majorMatch.value = getMajorMatchAssessment(intendedMajor.value, college.value.collegeType || 'Liberal Arts');
  }
});

watch(() => route.params.collegeIdentifier, () => {
  loadCollegeData();
  calculateChance();
  calculateDetailedChance();

  // Update major match when college changes
  if (college.value && intendedMajor.value) {
    majorMatch.value = getMajorMatchAssessment(intendedMajor.value, college.value.collegeType || 'Liberal Arts');
  }
});

// Persist Early Decision (savedColleges) changes
watch(savedColleges, (newVal) => {
  try {
    const data = JSON.parse(localStorage.getItem('userProfileData') || '{}');
    data.earlyDecisionColleges = newVal.map(c => ({ name: c.name, location: c.location, image: c.image }));
    localStorage.setItem('userProfileData', JSON.stringify(data));
  } catch (e) {
    console.error('Error saving early decision colleges:', e);
  }
}, { deep: true });

// Persist Regular Decision (recentlyViewed) changes
watch(recentlyViewed, (newVal) => {
  try {
    const data = JSON.parse(localStorage.getItem('userProfileData') || '{}');
    data.regularDecisionColleges = newVal.map(c => ({ name: c.name, location: c.location, image: c.image }));
    localStorage.setItem('userProfileData', JSON.stringify(data));
  } catch (e) {
    console.error('Error saving regular decision colleges:', e);
  }
}, { deep: true });

// Watch for changes in student profile data to update the major match
watch(intendedMajor, (newMajor) => {
  if (college.value && newMajor) {
    majorMatch.value = getMajorMatchAssessment(newMajor, college.value.collegeType || 'Liberal Arts');
  }
});

const handleSaveToEarly = ({ college: targetCollege, action, index }) => {
  if (action === 'add') {
    if (!savedColleges.value.some(c => c.name === targetCollege.name)) {
      savedColleges.value.push(targetCollege);
      // Show success notification
      snackbarColor.value = 'success';
      snackbarText.value = `${targetCollege.name} added to Early Decision list`;
      snackbar.value = true;
    } else {
      // College already in list - show info notification
      snackbarColor.value = 'info';
      snackbarText.value = `${targetCollege.name} is already in your Early Decision list`;
      snackbar.value = true;
    }
  } else if (action === 'remove' && index !== undefined) {
    const collegeName = savedColleges.value[index].name;
    savedColleges.value.splice(index, 1);
    // Show notification on removal
    snackbarColor.value = 'error';
    snackbarText.value = `${collegeName} removed from Early Decision list`;
    snackbar.value = true;
  }
};

const handleSaveToRegular = ({ college: targetCollege, action, index }) => {
  if (action === 'add') {
    if (!recentlyViewed.value.some(c => c.name === targetCollege.name)) {
      recentlyViewed.value.push(targetCollege);
      // Show success notification
      snackbarColor.value = 'success';
      snackbarText.value = `${targetCollege.name} added to Regular Decision list`;
      snackbar.value = true;
    } else {
      // College already in list - show info notification
      snackbarColor.value = 'info';
      snackbarText.value = `${targetCollege.name} is already in your Regular Decision list`;
      snackbar.value = true;
    }
  } else if (action === 'remove' && index !== undefined) {
    const collegeName = recentlyViewed.value[index].name;
    recentlyViewed.value.splice(index, 1);
    // Show notification on removal
    snackbarColor.value = 'error';
    snackbarText.value = `${collegeName} removed from Regular Decision list`;
    snackbar.value = true;
  }
};

const handleNavigateToChancing = () => {
  activeTab.value = 'chancing';
};

const handleNavigateToA4CRating = () => {
  activeTab.value = 'a4c-rating';
};

watch(activeTab, async (newTab, oldTab) => {
  // Preserve scroll position when navigating from Overview to Chancing/A4C-Rating
  // or from Chancing to A4C-Rating
  if (
    (oldTab === 'overview' && (newTab === 'chancing' || newTab === 'a4c-rating')) ||
    (oldTab === 'chancing' && newTab === 'a4c-rating')
  ) {
    const scrollYToRestore = window.scrollY;
    await nextTick(); // Wait for the DOM to update with the new tab's content
    window.scrollTo(0, scrollYToRestore); // Restore the scroll position
  }
});

const calculateDetailedChance = () => {
  if (!college.value || !studentProfile.value) {
    detailedCollegeChance.value = {
      probabilityPercentage: 27,
      probability: 0.27,
      timesAverageApplicant: "1.0",
      zScores: { gpa: 0, sat: 0, ap: 0, ec: 0 },
      strengthBlock: 0,
      alignmentBlock: 0
    };
    return;
  }

  const studentData = prepareStudentData({
    ...studentProfile.value,
    isLegacy: isLegacy.value,
    isEarlyDecision: isEarlyDecision.value
  });

  try {
    detailedCollegeChance.value = calculateAdmissionChance(studentData, college.value);

    // Calculate acceptance rate adjustments for display
    if (college.value) {
      const baseRate = parseFloat(college.value.acceptanceRate);

      // Major adjusted rate calculation
      const majorAdjusted = adjustAcceptanceRateByMajor(
        baseRate,
        intendedMajor.value,
        college.value.collegeType || 'Liberal Arts'
      );
      majorAdjustedRateForDisplay.value = majorAdjusted.toFixed(1);

      // Check if major makes it harder or easier
      isHarderMajor.value = majorAdjusted < baseRate * 0.9;
      isEasierMajor.value = majorAdjusted > baseRate * 1.1;

      // Final adjusted rate with strategic factors
      const finalAdjusted = adjustAcceptanceRateByStrategicFactors(
        majorAdjusted,
        isEarlyDecision.value,
        isLegacy.value
      );
      finalAdjustedRateForDisplay.value = finalAdjusted.toFixed(1);
    }
  } catch (error) {
    console.error("Error calculating detailed admission chance:", error);
    detailedCollegeChance.value = {
      probabilityPercentage: 27,
      probability: 0.27,
      timesAverageApplicant: "1.0",
      zScores: { gpa: 0, sat: 0, ap: 0, ec: 0 },
      strengthBlock: 0,
      alignmentBlock: 0
    };
  }
};

const useAiRecommendation = ref(false);
const loadingAiRec = ref(false);
const aiRecommendation = ref(null);
const aiError = ref(null);
const showNoApiKeyMessage = ref(false);

const toggleAiRecommendation = async () => {
  if (useAiRecommendation.value) {
    useAiRecommendation.value = false;
    return;
  }

  try {
    const key = await getApiKey();
    if (!key) {
      showNoApiKeyMessage.value = true;
      useAiRecommendation.value = false;
      return;
    }

    showNoApiKeyMessage.value = false;
    useAiRecommendation.value = true;

    if (!aiRecommendation.value) {
      loadingAiRec.value = true;
      aiError.value = '';

      const result = await getCollegeMatchAnalysis(studentProfile.value, college.value);

      if (result.success) {
        aiRecommendation.value = result.analysis;
      } else {
        aiError.value = result.error || 'Failed to get AI recommendation.';
        useAiRecommendation.value = false;
      }

      loadingAiRec.value = false;
    }
  } catch (error) {
    console.error('Error getting AI recommendation:', error);
    aiError.value = error.message || 'An unexpected error occurred.';
    showNoApiKeyMessage.value = true;
    useAiRecommendation.value = false;
    loadingAiRec.value = false;
  }
};

const isHarderMajor = ref(false);
const isEasierMajor = ref(false);
const majorAdjustedRateForDisplay = ref('');
const finalAdjustedRateForDisplay = ref('');

// Watch for changes in isEarlyDecision and isLegacy from parent to recalculate detailed chance
watch([isEarlyDecision, isLegacy], () => {
  calculateDetailedChance();
});
</script>

<style scoped>
.sticky-top-side {
  position: sticky;
  top: 80px; /* Adjust based on your header height */
  height: calc(100vh - 100px); /* Adjust based on your header and padding */
  overflow-y: auto;
}

.rounded-t-lg {
  border-top-left-radius: inherit !important; /* Ensure Vuetify specificity is overcome */
  border-top-right-radius: inherit !important;
}

/* Custom scrollbar for sticky component if needed */
.sticky-top-side::-webkit-scrollbar {
  width: 6px;
}
.sticky-top-side::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}
.sticky-top-side::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}
</style>
