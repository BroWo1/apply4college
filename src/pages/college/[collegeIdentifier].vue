<template>
  <v-container fluid style="max-width: 1200px; ;" class="py-8" >
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
      <div class="mb-6">
        <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between mb-2">
          <h1 class="text-h3 font-weight-bold">{{ college.name }}</h1>
          <v-btn 
            variant="outlined" 
            color="primary" 
            @click="$router.push({ path: '/explore' })"
            prepend-icon="mdi-chevron-left"
            class="back-btn mt-2 mt-sm-0"
          >
            Back to Explore
          </v-btn>
        </div>
        <div class="text-subtitle-1 mb-2">{{ college.location }} • {{ college.collegeType }}</div>
      </div>

      <v-card flat class="mb-6">
        <v-img :src="college.image" height="300px" cover class="rounded-t-lg"></v-img>
      </v-card>

      <v-card
        flat
        class="mb-4 pa-3"
        style="background: linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(156, 39, 176, 0.1)); border: 1px solid rgba(33, 150, 243, 0.2); border-radius: 12px;"
      >
        <v-row align="center" justify="space-between">
          <v-col>
            <v-tabs v-model="activeTab" slider-color="primary" class="nav-tabs">
              <v-tab value="overview" class="tab-item">
                <v-icon start>mdi-information-outline</v-icon>
                Overview
              </v-tab>
              <v-tab value="chancing" class="tab-item">
                <v-icon start>mdi-calculator</v-icon>
                Chancing
              </v-tab>
              <!-- <v-tab value="a4c-rating" class="tab-item">
                <v-icon start>mdi-star-outline</v-icon>
                Rating
              </v-tab> -->
            </v-tabs>
          </v-col>
          <v-col cols="auto">
            <v-menu
              v-model="saveMenu"
              :close-on-content-click="true"
              location="bottom end"
              transition="slide-y-transition"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  color="primary"
                  variant="elevated"
                  v-bind="props"
                  class="save-btn"
                >
                  <v-icon start>mdi-bookmark-plus</v-icon>
                  Save to List
                  <v-icon end>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-card min-width="240" rounded="xl" elevation="8" class="save-menu-card">
                <v-list nav density="compact" class="pa-2">
                  <v-list-item
                    prepend-icon="mdi-star"
                    title="Early Decision"
                    subtitle="Higher acceptance rate"
                    @click="handleSaveToEarly({ college: college, action: 'add' })"
                    rounded="lg"
                    class="menu-item"
                  >
                    <template v-slot:append>
                      <v-chip size="small" color="primary" variant="tonal">ED</v-chip>
                    </template>
                  </v-list-item>
                  <v-list-item
                    prepend-icon="mdi-content-save"
                    title="Regular Decision"
                    subtitle="Standard application"
                    @click="handleSaveToRegular({ college: college, action: 'add' })"
                    rounded="lg"
                    class="menu-item"
                  >
                    <template v-slot:append>
                      <v-chip size="small" color="secondary" variant="tonal">RD</v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </v-col>
        </v-row>
      </v-card>

      <v-divider class="mb-6"></v-divider>

      <v-btn
        :color="rightPanelOpen ? 'secondary' : 'primary'"
        :icon="rightPanelOpen ? 'mdi-chevron-right' : 'mdi-bookmark'"
        fab
        size="small"
        class="right-toggle d-none d-md-flex"
        @click="rightPanelOpen = !rightPanelOpen"
        :title="rightPanelOpen ? 'Hide Saved Colleges' : 'Show Saved Colleges'"
      ></v-btn>

      <v-navigation-drawer
        v-model="rightPanelOpen"
        location="right"
        temporary
        color="transparent"
        width="400"
        elevation="0"
        class="floating-drawer"
        border="none"
      >
        <div class="pa-3">
          <v-card class="pa-4" rounded="xl" elevation="12" style="margin-left: 20px;">
            <v-btn
              icon="mdi-close"
              variant="text"
              size="small"
              @click="rightPanelOpen = false"
              style="position: absolute; top: 12px; right: 12px; z-index: 1;"
            ></v-btn>
            <v-card-title class="text-h6">Early Decision</v-card-title>
            <v-divider class="my-2"></v-divider>

            <div v-if="savedColleges.length === 0" class="text-center py-8 text-medium-emphasis">
              <v-icon icon="mdi-bookmark-outline" size="large" class="mb-2"></v-icon>
              <div>No Saved Colleges</div>
              <div class="text-caption">Add colleges to this list!</div>
            </div>

            <v-list v-else lines="two" density="compact" class="bg-transparent">
              <v-list-item
                v-for="(savedItem, i) in savedColleges"
                :key="`saved-${i}`"
                :title="savedItem.name"
                :subtitle="savedItem.location"
                @click="navigateToCollegeProfilePage(savedItem)"
                class="saved-college-item"
              >
                <template v-slot:prepend>
                  <v-avatar size="40">
                    <v-img :src="savedItem.image" cover></v-img>
                  </v-avatar>
                </template>
                <template v-slot:append>
                  <v-btn icon="mdi-delete" size="small" variant="text"
                         @click.stop="handleSaveToEarly({ action: 'remove', index: i })"
                  ></v-btn>
                </template>
                <div class="d-flex flex-wrap mt-2">
                  <v-chip
                    color="purple-lighten-1"
                    size="x-small"
                    prepend-icon="mdi-calendar-clock"
                    class="my-1"
                  >
                    Deadline: {{ savedItem.deadlines?.earlyDecision || "Nov 1" }}
                  </v-chip>
                </div>
              </v-list-item>
            </v-list>

            <v-divider class="my-4"></v-divider>

            <v-card-title class="text-h6">Regular Decision</v-card-title>
             <div v-if="recentlyViewed.length === 0" class="text-center py-8 text-medium-emphasis">
                <v-icon icon="mdi-bookmark-outline" size="large" class="mb-2"></v-icon>
                <div>No Saved Colleges</div>
                <div class="text-caption">Add colleges to this list!</div>
              </div>
            <v-list v-else lines="two" density="compact" class="bg-transparent">
              <v-list-item
                v-for="(recentItem, i) in recentlyViewed"
                :key="`recent-${i}`"
                :title="recentItem.name"
                :subtitle="recentItem.location"
                @click="navigateToCollegeProfilePage(recentItem)"
                class="saved-college-item"
              >
                <template v-slot:prepend>
                  <v-avatar size="40">
                    <v-img :src="recentItem.image" cover></v-img>
                  </v-avatar>
                </template>
                <template v-slot:append>
                  <v-btn icon="mdi-delete" size="small" variant="text"
                         @click.stop="handleSaveToRegular({ action: 'remove', index: i })"
                  ></v-btn>
                </template>
                <div class="d-flex flex-wrap mt-2">
                  <v-chip
                    color="indigo-lighten-1"
                    size="x-small"
                    prepend-icon="mdi-calendar"
                    class="my-1"
                  >
                    Deadline: {{ recentItem.deadlines?.regularDecision || "Jan 1" }}
                  </v-chip>
                </div>
              </v-list-item>
            </v-list>
          </v-card>
        </div>
      </v-navigation-drawer>

      <v-window v-model="activeTab" class="mb-6">
        <v-window-item value="overview">
          <OverviewTab
            :college="college"
            :collegeChance="collegeChance"
            :studentProfile="studentProfile"
            :savedColleges="savedColleges"
            :recentlyViewed="recentlyViewed"
            :similarSchools="similarSchools"
            @navigateToChancing="handleNavigateToChancing"
            @saveToEarly="handleSaveToEarly"
            @saveToRegular="handleSaveToRegular"
          />
        </v-window-item>

        <v-window-item value="chancing">
          <ChancingTab
            :college="college"
            :student-profile="{
              gpa: studentProfile.gpa,
              satReading: studentProfile.satReading,
              satMath: studentProfile.satMath,
              apClasses: studentProfile.apClasses,        // Full array with name, score, status, fitScore
              extracurriculars: studentProfile.extracurriculars, // Full array with name, level, fitScore
              intendedMajor: studentProfile.intendedMajor,
              recScore: studentProfile.recScore,
              isLegacy: studentProfile.isLegacy,
              nationality: studentProfile.nationality,
              gender: studentProfile.gender,
              demoScore: studentProfile.demoScore,
              enableBitterByCoffee: studentProfile.enableBitterByCoffee
            }"
            :detailed-college-chance="detailedCollegeChance"
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

        <!-- <v-window-item value="a4c-rating">
          <A4CRatingTab :college="college" />
        </v-window-item> -->

        <v-window-item value="majors">
          <MajorsTab :collegeName="college ? college.name : 'this school'" />
        </v-window-item>
      </v-window>
    </div>

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
import OverviewTab from '../../components/college/tabs/OverviewTab.vue';
import ChancingTab from '../../components/college/tabs/ChancingTab.vue';
// import A4CRatingTab from '../../components/college/tabs/A4CRatingTab.vue';
import MajorsTab from '../../components/college/tabs/MajorsTab.vue';
import { colleges as allColleges } from '../../data/colleges.js';
import { getAdmissionChanceColor, getAdmissionChanceDescription, calculateAdmissionChance, prepareStudentData, getMajorMatchAssessment, adjustAcceptanceRateByMajor, adjustAcceptanceRateByStrategicFactors } from '../../utils/admitChanceCalculator';
import { getCollegeMatchAnalysis, getApiKey } from '../../utils/profileRecommendationService';
import { useUserStore } from '@/stores/user'; // Add this import

const route = useRoute();
const router = useRouter();
const userStore = useUserStore(); // Initialize user store

// Snackbar state
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

// Menu state
const saveMenu = ref(false);

const college = ref(null);
const loading = ref(true);
const activeTab = ref('overview');

// Right panel state for foldable list
const rightPanelOpen = ref(false);

// Student profile data - include ALL fields
const satReading = ref(500);
const satMath = ref(500);
const gpa = ref(3.0);
const apClasses = ref([]);
const extracurriculars = ref([]);
const intendedMajor = ref("");
const recScore = ref(2);
const isLegacy = ref(false);
const demoScore = ref(0);
const nationality = ref('United States'); // Added
const gender = ref('Prefer not to say'); // Added
const enableBitterByCoffee = ref(false); // Added

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
  alignmentBlock: 0,
  bitterByCoffeeFactor: '1.00'
});
const isEarlyDecision = ref(false);
const majorMatch = ref('neutral');

// Update studentProfile to include ALL fields
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
  nationality: nationality.value, // Added
  gender: gender.value, // Added
  enableBitterByCoffee: enableBitterByCoffee.value // Added
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

// Helper function to apply profile data
const applyProfileData = (profileData) => {
  satReading.value = profileData.satReading || 500;
  satMath.value = profileData.satMath || 500;
  gpa.value = profileData.gpa || 3.0;
  apClasses.value = (profileData.apClasses && Array.isArray(profileData.apClasses)) ? profileData.apClasses : [];
  extracurriculars.value = (profileData.extracurriculars && Array.isArray(profileData.extracurriculars)) ? profileData.extracurriculars : [];
  intendedMajor.value = profileData.intendedMajor || "";
  recScore.value = profileData.recScore || 2;
  isLegacy.value = profileData.isLegacy || false;
  nationality.value = profileData.nationality || 'United States';
  gender.value = profileData.gender || 'Prefer not to say';
  enableBitterByCoffee.value = profileData.enableBitterByCoffee || false;
  // demoScore is computed in profile page, but stored in profile data
  demoScore.value = profileData.demoScore || 0;

  // Load college lists
  if (profileData.earlyDecisionColleges && Array.isArray(profileData.earlyDecisionColleges)) {
    savedColleges.value = profileData.earlyDecisionColleges.map(savedCollege => {
      const fullCollege = allColleges.find(c => c.name === savedCollege.name);
      return fullCollege || savedCollege;
    }).filter(Boolean);
  }

  if (profileData.regularDecisionColleges && Array.isArray(profileData.regularDecisionColleges)) {
    recentlyViewed.value = profileData.regularDecisionColleges.map(savedCollege => {
      const fullCollege = allColleges.find(c => c.name === savedCollege.name);
      return fullCollege || savedCollege;
    }).filter(Boolean);
  }
};

// Updated loadProfileAndSavedColleges to match explore page logic
const loadProfileAndSavedColleges = () => {
  // Step 1: Determine which key to use based on authentication status
  const profileKey = userStore.isAuthenticated ? 'userProfileData' : 'guestProfileData';
  
  // Step 2: Load main profile data
  const savedData = localStorage.getItem(profileKey);
  if (savedData) {
    try {
      const profileData = JSON.parse(savedData);
      applyProfileData(profileData);
      console.log(`Profile data loaded from ${profileKey}`);
    } catch (e) {
      console.error('Error parsing saved profile data on college page:', e);
    }
  }

  // Step 3: Load and apply persistent data overrides
  const persistentData = localStorage.getItem('persistentProfileData');
  if (persistentData) {
    try {
      const persistentProfileData = JSON.parse(persistentData);
      console.log('Applying persistent local data:', persistentProfileData);
      
      // Override specific fields with persistent data
      if (persistentProfileData.hasOwnProperty('apClasses') && Array.isArray(persistentProfileData.apClasses)) {
        apClasses.value = persistentProfileData.apClasses;
      }
      if (persistentProfileData.hasOwnProperty('extracurriculars') && Array.isArray(persistentProfileData.extracurriculars)) {
        extracurriculars.value = persistentProfileData.extracurriculars;
      }
      if (persistentProfileData.hasOwnProperty('intendedMajor')) {
        intendedMajor.value = persistentProfileData.intendedMajor;
      }
      if (persistentProfileData.hasOwnProperty('nationality')) {
        nationality.value = persistentProfileData.nationality;
      }
      if (persistentProfileData.hasOwnProperty('gender')) {
        gender.value = persistentProfileData.gender;
      }
      if (persistentProfileData.hasOwnProperty('enableBitterByCoffee')) {
        enableBitterByCoffee.value = persistentProfileData.enableBitterByCoffee;
      }
      
      // Recalculate demoScore if nationality or gender were updated
      if (persistentProfileData.hasOwnProperty('nationality') || persistentProfileData.hasOwnProperty('gender')) {
        // Calculate demographic score same as profile page
        let scoreNationality = 0;
        let scoreGender = 0;
        if (nationality.value === 'China') scoreNationality = 0;
        else if (nationality.value === 'United States') scoreNationality = 0.5;
        else scoreNationality = 0.25;

        if (gender.value === 'Male') scoreGender = 0;
        else if (gender.value === 'Female') scoreGender = 0.25;
        else if (gender.value === 'Non-binary') scoreGender = 0.5;
        else scoreGender = 0;
        
        demoScore.value = Math.min(scoreNationality + scoreGender, 1.0);
      }
    } catch (e) {
      console.error('Error parsing persistent profile data:', e);
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

// Persist Early Decision (savedColleges) changes - use correct key
watch(savedColleges, (newVal) => {
  try {
    const profileKey = userStore.isAuthenticated ? 'userProfileData' : 'guestProfileData';
    const data = JSON.parse(localStorage.getItem(profileKey) || '{}');
    data.earlyDecisionColleges = newVal.map(c => ({ 
      name: c.name, 
      location: c.location, 
      image: c.image,
      deadlines: c.deadlines 
    }));
    localStorage.setItem(profileKey, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving early decision colleges:', e);
  }
}, { deep: true });

// Persist Regular Decision (recentlyViewed) changes - use correct key
watch(recentlyViewed, (newVal) => {
  try {
    const profileKey = userStore.isAuthenticated ? 'userProfileData' : 'guestProfileData';
    const data = JSON.parse(localStorage.getItem(profileKey) || '{}');
    data.regularDecisionColleges = newVal.map(c => ({ 
      name: c.name, 
      location: c.location, 
      image: c.image,
      deadlines: c.deadlines 
    }));
    localStorage.setItem(profileKey, JSON.stringify(data));
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

const navigateToCollegeProfilePage = (college) => {
  rightPanelOpen.value = false; // Close drawer on navigation
  router.push({ path: `/college/${encodeURIComponent(college.name)}` });
};

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

// const handleNavigateToA4CRating = () => {
//   activeTab.value = 'a4c-rating';
// };

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
      alignmentBlock: 0,
      bitterByCoffeeFactor: '1.00'
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
      alignmentBlock: 0,
      bitterByCoffeeFactor: '1.00'
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

/* Enhanced Navigation Bar Styles */
.nav-tabs .v-tab {
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-tabs .v-tab:hover {
  background-color: rgba(33, 150, 243, 0.1);
  transform: translateY(-1px);
}

.save-btn {
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3) !important;
  transition: all 0.3s ease;
}

.save-btn:hover {
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4) !important;
  transform: translateY(-2px);
}

.save-menu-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid rgba(33, 150, 243, 0.2);
}

.menu-item {
  transition: all 0.2s ease;
  margin: 2px 0;
}

.menu-item:hover {
  background-color: rgba(33, 150, 243, 0.1) !important;
  transform: translateX(4px);
}

.tab-item {
  border-radius: 8px;
  margin: 0 4px;
}

/* Back to Explore button styling */
.back-btn {
  transition: all 0.2s ease;
}

.back-btn:hover {
  transform: translateX(-2px);
}

@media (max-width: 768px) {
  .back-btn {
    margin-top: 8px;
  }
}

/* Floating button for saved list */
.right-toggle {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.right-toggle:hover {
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.saved-college-item {
  border-radius: 12px;
  transition: background-color 0.2s ease;
}

.saved-college-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

:deep(.v-navigation-drawer .v-overlay__scrim) {
  background: transparent;
}
</style>