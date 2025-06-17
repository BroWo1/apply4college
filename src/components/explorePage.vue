<template>
  <div class="explore-page">
    <section class="hero-section" aria-labelledby="hero-title">
      <div class="hero-content">
        <div class="hero-text-container">
          <h1 id="hero-title" class="hero-title">
            {{ $t('explorePage.title') }}
          </h1>
          <p class="hero-subtitle">
            {{ $t('explorePage.subtitle') }}
          </p>
          <v-text-field
            v-model="searchQuery"
            :label="$t('explorePage.searchPlaceholder')"
            variant="solo"
            prepend-inner-icon="mdi-magnify"
            clearable
            class="mx-auto py-2 search-field"
            style="max-width: 600px"
            rounded="lg"
          ></v-text-field>
        </div>
        <div class="hero-decoration">
          <div class="floating-icons">
            <v-icon class="floating-icon icon-1">mdi-school</v-icon>
            <v-icon class="floating-icon icon-2">mdi-star</v-icon>
            <v-icon class="floating-icon icon-3">mdi-lightbulb</v-icon>
          </div>
        </div>
      </div>
       <v-btn v-if="isDevEnvironment" @click="resetPromotionTracking" color="warning" class="mt-2" style="position: absolute; top: 10px; left: 10px; z-index: 10;">
        DEV: Reset
      </v-btn>
    </section>

    <div class="floating-buttons d-md-none">
      <v-btn
        color="primary"
        icon="mdi-account"
        fab
        size="small"
        class="mb-2"
        @click="leftPanelOpen = !leftPanelOpen"
      ></v-btn>
      <v-btn
        color="secondary"
        icon="mdi-bookmark"
        fab
        size="small"
        class="mb-2"
        @click="rightPanelOpen = !rightPanelOpen"
      ></v-btn>
      <v-btn
        color="success"
        icon="mdi-map"
        fab
        size="small"
        @click="openMapModal"
        class="map-btn-pulse"
      >
        <v-icon>mdi-map</v-icon>
      </v-btn>
    </div>

    <!-- Desktop floating map button -->
    <v-tooltip
      text="Open College Map"
      location="top"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          color="success"
          fab
          size="x-large"
          class="floating-map-btn d-none d-md-flex map-btn-pulse"
          @click="openMapModal"
          elevation="12"
        >
          <v-icon size="x-large">mdi-map-marker-radius</v-icon>
          <div class="map-btn-label">Map</div>
        </v-btn>
      </template>
    </v-tooltip>

    <!-- Map Modal Dialog -->
    <v-dialog
      v-model="mapModalOpen"
      max-width="95vw"
      max-height="95vh"
      transition="fade-transition"
      scrollable
      persistent
    >
      <v-card 
        class="map-modal-card"
        rounded="xl"
        elevation="24"
        @click:outside="mapModalOpen = false"
      >
        <v-card-title class="map-modal-header d-flex align-center">
          <v-icon class="mr-3" color="success" size="large">mdi-map-marker-radius</v-icon>
          <span class="text-h5 font-weight-bold">{{ $t('explorePage.collegeMap', 'College Map') }}</span>
          <v-spacer></v-spacer>
          <v-btn 
            icon="mdi-close" 
            variant="text" 
            size="large"
            @click="closeMapModal"
            class="close-modal-btn"
          ></v-btn>
        </v-card-title>
        
        <v-divider></v-divider>
        
        <v-card-text class="map-modal-content pa-0">
          <CollegeMap />
        </v-card-text>
      </v-card>
    </v-dialog>

    <main class="main-content">
      <v-row class="fill-height ma-0">
        <v-navigation-drawer
          v-model="leftPanelOpen"
          location="left"
          temporary
          width="300"
          class="d-md-none"
        >
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            class="close-btn"
            @click="leftPanelOpen = false"
          ></v-btn>
          <div class="pa-3">
            <ProfileSummaryComponent
              :satReading="satReading"
              :satMath="satMath"
              :gpa="gpa"
              :intendedMajor="intendedMajor"
              :apClasses="apClasses"
              :extracurriculars="extracurriculars"
            />
          </div>
        </v-navigation-drawer>

        <v-navigation-drawer
          v-model="rightPanelOpen"
          location="right"
          temporary
          width="300"
          class="d-md-none"
        >
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            class="close-btn"
            @click="rightPanelOpen = false"
          ></v-btn>
          <div class="pa-3">
            <v-card class="pa-4" rounded="lg">
              <v-card-title class="text-h6">{{ $t('explorePage.earlyDecision') }}</v-card-title>
              <v-divider class="my-2"></v-divider>

              <div v-if="savedColleges.length === 0" class="text-center py-8 text-medium-emphasis">
                <v-icon icon="mdi-bookmark-outline" size="large" class="mb-2"></v-icon>
                <div>{{ $t('explorePage.noSavedColleges') }}</div>
                <div class="text-caption">{{ $t('explorePage.savedCollegesDesc') }}</div>
              </div>

              <v-list v-else lines="two" density="compact">
                <v-list-item
                  v-for="(college, i) in savedColleges"
                  :key="`saved-${i}`"
                  :title="college.name"
                  :subtitle="college.location"
                  @click="navigateToCollegeProfilePage(college)"
                >
                  <template v-slot:prepend>
                    <v-avatar size="40">
                      <v-img :src="college.image" cover></v-img>
                    </v-avatar>
                  </template>
                  <template v-slot:append>
                    <v-btn icon="mdi-delete" size="small" variant="text"
                           @click.stop="removeSavedCollege(i)"
                    ></v-btn>
                  </template>
                  <div class="d-flex flex-wrap mt-2">
                    <v-chip
                      color="purple-lighten-1"
                      size="x-small"
                      prepend-icon="mdi-calendar-clock"
                      class="my-1"
                    >
                      Deadline: {{ college.deadlines?.earlyDecision}}
                    </v-chip>
                  </div>
                </v-list-item>
              </v-list>

              <v-divider class="my-4"></v-divider>

              <v-card-title class="text-h6">{{ $t('explorePage.regularDecision') }}</v-card-title>
              <div v-if="recentlyViewed.length === 0" class="text-center py-8 text-medium-emphasis">
                <v-icon icon="mdi-bookmark-outline" size="large" class="mb-2"></v-icon>
                <div>{{ $t('explorePage.noSavedColleges') }}</div>
                <div class="text-caption">{{ $t('explorePage.savedCollegesDesc') }}</div>
              </div>
              <v-list v-else lines="two" density="compact">
                <v-list-item
                  v-for="(college, i) in recentlyViewed"
                  :key="`recent-${i}`"
                  :title="college.name"
                  :subtitle="college.location"
                  @click="navigateToCollegeProfilePage(college)"
                >
                  <template v-slot:prepend>
                    <v-avatar size="40">
                      <v-img :src="college.image" cover></v-img>
                    </v-avatar>
                  </template>
                  <template v-slot:append>
                    <v-btn icon="mdi-delete" size="small" variant="text"
                           @click.stop="removeRecentlyViewedCollege(i)"
                    ></v-btn>
                  </template>
                  <div class="d-flex flex-wrap mt-2">
                    <v-chip
                      color="indigo-lighten-1"
                      size="x-small"
                      prepend-icon="mdi-calendar"
                      class="my-1"
                    >
                      Deadline: {{ college.deadlines?.regularDecision}}
                    </v-chip>
                  </div>
                </v-list-item>
              </v-list>
            </v-card>
          </div>
        </v-navigation-drawer>

        <v-dialog
          v-model="promotionModalOpen"
          max-width="500"
          persistent
        >
          <v-card rounded="xl" class="pa-4">
            <v-card-title class="text-center text-h5 mb-4">
              <v-icon icon="mdi-account-plus" size="x-large" color="primary" class="mb-2"></v-icon>
              <div>{{ $t('explorePage.promotionModal.title', 'Join Apply4College!') }}</div>
            </v-card-title>
            
            <v-card-text class="text-center">
              <p class="text-body-1 mb-4">
                {{ $t('explorePage.promotionModal.subtitle', 'Create an account to save your college lists, track deadlines, and get personalized recommendations!') }}
              </p>
              
              <v-list density="compact" class="mb-4 bg-transparent">
                <v-list-item prepend-icon="mdi-content-save" class="text-left">
                  <v-list-item-title>{{ $t('explorePage.promotionModal.feature1', 'Save colleges across devices') }}</v-list-item-title>
                </v-list-item>
                <v-list-item prepend-icon="mdi-calendar-clock" class="text-left">
                  <v-list-item-title>{{ $t('explorePage.promotionModal.feature2', 'Track application deadlines') }}</v-list-item-title>
                </v-list-item>
                <v-list-item prepend-icon="mdi-chart-line" class="text-left">
                  <v-list-item-title>{{ $t('explorePage.promotionModal.feature3', 'Get personalized recommendations') }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>

            <v-card-actions class="justify-center flex-column">
              <div class="d-flex gap-2 mb-3">
                <v-btn
                  color="primary"
                  variant="elevated"
                  size="large"
                  @click="navigateToLogin"
                  rounded="lg"
                  class="mr-4"
                >
                  {{ $t('explorePage.promotionModal.signUp', 'Sign Up') }}
                </v-btn>
                <v-btn
                  color="primary"
                  variant="outlined"
                  size="large"
                  @click="navigateToLogin"
                  rounded="lg"
                >
                  {{ $t('explorePage.promotionModal.login', 'Log In') }}
                </v-btn>
              </div>
              
              <div class="d-flex gap-2">
                <v-btn
                  variant="text"
                  size="small"
                  @click="dismissPromotionModal"
                >
                  {{ $t('explorePage.promotionModal.notNow', 'Not now') }}
                </v-btn>
                <v-btn
                  variant="text"
                  size="small"
                  @click="dismissPromotionModalForDay"
                >
                  {{ $t('explorePage.promotionModal.dontShowToday', "Don't show for rest of day") }}
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-col cols="12" md="3" class="pa-3 hidden-sm-and-down sticky-panel">
          <ProfileSummaryComponent
            :satReading="satReading"
            :satMath="satMath"
            :gpa="gpa"
            :intendedMajor="intendedMajor"
            :apClasses="apClasses"
            :extracurriculars="extracurriculars"
          />
        </v-col>

        <v-col cols="12" md="6" class="pa-3">

          <v-card class="mb-4" variant="flat" color="transparent" rounded="lg">
            <v-card-title class="d-flex align-center flex-wrap">
              <span class="text-h6 me-auto">{{ $t('explorePage.collegesCount') }} ({{ displayedColleges.length }})</span>
              <v-select
                v-model="filterBy"
                :items="filterOptions"
                :label="$t('explorePage.filter')"
                hide-details
                density="compact"
                style="max-width: 150px"
                class="mx-2 my-1"
                variant="outlined"
              ></v-select>
              <v-select
                v-model="sortBy"
                :items="sortOptions"
                :label="$t('explorePage.sort')"
                hide-details
                density="compact"
                style="max-width: 150px"
                class="my-1"
                variant="outlined"
              ></v-select>
            </v-card-title>
          </v-card>

          <AdmitChanceComponent
            v-if="selectedCollege"
            :college="selectedCollege"
            :studentProfile="studentProfile"
            :savedColleges="savedColleges"
            :recentlyViewed="recentlyViewed"
            v-model="admitChanceModalOpen"
            @saveToEarly="handleSaveToEarly"
            @saveToRegular="handleSaveToRegular"
            @close="closeAdmitChanceModal"
          />

          <v-card
            v-for="(college, i) in displayedColleges"
            :key="i"
            class="mb-4 college-card"
            rounded="lg"
            elevation="2"
            @click="navigateToCollegeProfilePage(college)"
          >
            <v-row class="ma-0">
              <v-col sm="4" class="pa-0 d-none d-sm-block">
                <v-img
                  :src="college.image"
                  height="100%"
                  cover
                  class="rounded-l-lg"
                ></v-img>
              </v-col>
              <v-col cols="12" sm="8" class="pa-4">
                <div class="d-flex justify-space-between align-start">
                  <div>
                    <h3 class="text-h6 font-weight-bold mb-1">{{ college.name }}</h3>
                    <div class="text-body-2 text-medium-emphasis mb-2">
                      {{ college.location }}
                    </div>
                  </div>
                  <div class="d-flex flex-column align-end">
                    <v-chip
                      :color="getAcceptanceRateColor(college.acceptanceRate)"
                      size="small"
                      class="mb-1"
                    >
                      {{ college.acceptanceRate }}% Acceptance
                    </v-chip>
                    <v-chip
                      :color="college.collegeType === 'STEM-heavy' ? 'info' : 'success'"
                      size="small"
                    >
                      {{ college.collegeType }}
                    </v-chip>
                  </div>
                </div>

                <div class="d-flex flex-wrap my-3">
                  <v-chip
                    color="purple-lighten-1"
                    size="small"
                    prepend-icon="mdi-calendar-clock"
                    class="mr-2 my-1"
                    label
                  >
                    ED: {{ college.deadlines?.earlyDecision || "Nov 1" }}
                  </v-chip>
                  <v-chip
                    color="indigo-lighten-1"
                    size="small"
                    prepend-icon="mdi-calendar"
                    class="my-1"
                    label
                  >
                    RD: {{ college.deadlines?.regularDecision || "Jan 1" }}
                  </v-chip>
                </div>

                <v-divider class="my-2"></v-divider>

                <div class="d-flex align-center justify-space-between mt-2">
                  <div class="d-flex align-center">
                    <v-chip
                      :color="getAdmissionChanceColor(getAdmissionChance(college))"
                      size="small"
                      class="mr-2"
                      label
                    >
                      {{ Math.round(getAdmissionChance(college) * 100) }}% {{ $t('explorePage.admissionChance') }}
                    </v-chip>
                    <span class="text-body-2">{{ getAdmissionChanceDescription(getAdmissionChance(college)) }}</span>
                  </div>
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        variant="text"
                        color="primary"
                        density="comfortable"
                      >
                        {{ $t('explorePage.options') }}
                        <v-icon end>mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="(item, index) in collegeActionItems"
                        :key="index"
                        :value="index"
                        @click.stop="handleCollegeAction(item.action, college)"
                      >
                        <template v-slot:prepend>
                          <v-icon :icon="item.icon" size="small" class="me-3"></v-icon>
                        </template>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </v-col>
            </v-row>
          </v-card>

          <v-card
            v-if="displayedColleges.length === 0"
            class="pa-6 text-center"
            rounded="lg"
            variant="tonal"
          >
            <v-icon icon="mdi-school-outline" size="x-large" class="mb-3"></v-icon>
            <h3 class="text-h6 mb-2">{{ $t('explorePage.noMatches') }}</h3>
            <p class="text-body-2">{{ $t('explorePage.adjustFilters') }}</p>
            <v-btn
              color="primary"
              class="mt-3"
              @click="resetFilters"
              rounded="lg"
            >
              {{ $t('explorePage.resetFilters') }}
            </v-btn>
          </v-card>

          <div v-if="displayedColleges.length > 0" class="d-flex justify-center mt-4">
            <v-pagination
              v-model="page"
              :length="Math.ceil(filteredColleges.length / itemsPerPage)"
              show-first-last-page
              :total-visible="7"
              rounded="circle"
            ></v-pagination>
          </div>
        </v-col>

        <v-col cols="12" md="3" class="pa-3 hidden-sm-and-down sticky-panel">
          <v-card class="pa-4" rounded="lg">
            <v-card-title class="text-h6">{{ $t('explorePage.earlyDecision') }}</v-card-title>
            <v-divider class="my-2"></v-divider>

            <div v-if="savedColleges.length === 0" class="text-center py-8 text-medium-emphasis">
              <v-icon icon="mdi-bookmark-outline" size="large" class="mb-2"></v-icon>
              <div>{{ $t('explorePage.noSavedColleges') }}</div>
              <div class="text-caption">{{ $t('explorePage.savedCollegesDesc') }}</div>
            </div>

            <v-list v-else lines="two" density="compact" class="bg-transparent">
              <v-list-item
                v-for="(college, i) in savedColleges"
                :key="`saved-${i}`"
                :title="college.name"
                :subtitle="college.location"
                @click="navigateToCollegeProfilePage(college)"
              >
                <template v-slot:prepend>
                  <v-avatar size="40">
                    <v-img :src="college.image" cover></v-img>
                  </v-avatar>
                </template>
                <template v-slot:append>
                  <v-btn icon="mdi-delete" size="small" variant="text"
                         @click.stop="removeSavedCollege(i)"
                  ></v-btn>
                </template>
                <div class="d-flex flex-wrap mt-2">
                  <v-chip
                    color="purple-lighten-1"
                    size="x-small"
                    prepend-icon="mdi-calendar-clock"
                    class="my-1"
                  >
                    Deadline: {{ college.deadlines?.earlyDecision || "Nov 1" }}
                  </v-chip>
                </div>
              </v-list-item>
            </v-list>

            <v-divider class="my-4"></v-divider>

            <v-card-title class="text-h6">{{ $t('explorePage.regularDecision') }}</v-card-title>
            <div v-if="recentlyViewed.length === 0" class="text-center py-8 text-medium-emphasis">
              <v-icon icon="mdi-bookmark-outline" size="large" class="mb-2"></v-icon>
              <div>{{ $t('explorePage.noSavedColleges') }}</div>
              <div class="text-caption">{{ $t('explorePage.savedCollegesDesc') }}</div>
            </div>
            <v-list v-else lines="two" density="compact" class="bg-transparent">
              <v-list-item
                v-for="(college, i) in recentlyViewed"
                :key="`recent-${i}`"
                :title="college.name"
                :subtitle="college.location"
                @click="navigateToCollegeProfilePage(college)"
              >
                <template v-slot:prepend>
                  <v-avatar size="40">
                    <v-img :src="college.image" cover></v-img>
                  </v-avatar>
                </template>
                <template v-slot:append>
                  <v-btn icon="mdi-delete" size="small" variant="text"
                         @click.stop="removeRecentlyViewedCollege(i)"
                  ></v-btn>
                </template>
                <div class="d-flex flex-wrap mt-2">
                  <v-chip
                    color="indigo-lighten-1"
                    size="x-small"
                    prepend-icon="mdi-calendar"
                    class="my-1"
                  >
                    Deadline: {{ college.deadlines?.regularDecision || "Jan 1" }}
                  </v-chip>
                </div>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import AdmitChanceComponent from './AdmitChanceComponent.vue';
import ProfileSummaryComponent from './ProfileSummaryComponent.vue';
import CollegeMap from './CollegeMap.vue';
import { colleges, getCollegesByType, getCollegesByAcceptanceRate, sortCollegesBy, searchColleges } from '../data/colleges.js';
import { majors, calculateFitScore, determineAPCourseCategory, determineActivityCategory } from '../utils/majorData';
import {
  getMajorMatchAssessment,
  getAdmissionChanceColor,
  getAdmissionChanceDescription,
  calculateAdmissionChance,
  prepareStudentData
} from '../utils/admitChanceCalculator';
import CollegeComparison from './CollegeComparison.vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/user'; // Added import

const { t } = useI18n();
const userStore = useUserStore(); // Initialize user store

// Computed property to check for development environment
const isDevEnvironment = computed(() => import.meta.env.DEV);

// State for responsive side panels
const leftPanelOpen = ref(false);
const rightPanelOpen = ref(false);

const router = useRouter();

// Close panels when screen size changes to desktop
const handleResize = () => {
  if (window.innerWidth >= 960) { // md breakpoint in Vuetify
    leftPanelOpen.value = false;
    rightPanelOpen.value = false;
  }
};

// Filtering and pagination
const searchQuery = ref('');
const filterBy = ref('All');
const sortBy = ref('acceptanceRate');
const page = ref(1);
const itemsPerPage = 8;
const selectedCollege = ref(null);
const admitChanceModalOpen = ref(false);

// Promotion modal state and tracking
const promotionModalOpen = ref(false);
const collegeClickCount = ref(0);

// Map modal state
const mapModalOpen = ref(false);

// Filter options
const filterOptions = [
  'All',
  'Elite (< 10%)',
  'Target (10-20%)',
  'Safety (> 20%)',
  'STEM-focused',
  'Liberal Arts'
];

// Sort options
const sortOptions = [
  { title: 'Acceptance Rate', value: 'acceptanceRate' },
  { title: 'College Name', value: 'name' },
  { title: 'Rating', value: 'rating' },
  { title: 'Tuition', value: 'tuition' }
];

// Saved and recently viewed colleges
const savedColleges = ref([]);
const recentlyViewed = ref([]);

// Student profile data
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

// Helper function to apply profile data
const applyProfileData = (profileData) => {
  // Load standardized scores
  satReading.value = profileData.satReading || 500;
  satMath.value = profileData.satMath || 500;
  gpa.value = profileData.gpa || 3.0;

  // Load AP classes
  if (profileData.apClasses && Array.isArray(profileData.apClasses)) {
    apClasses.value = profileData.apClasses;
  }

  // Load extracurriculars
  if (profileData.extracurriculars && Array.isArray(profileData.extracurriculars)) {
    extracurriculars.value = profileData.extracurriculars;
  }

  // Load additional factors
  intendedMajor.value = profileData.intendedMajor || "";
  recScore.value = profileData.recScore || 2;
  isLegacy.value = profileData.isLegacy || false;
  demoScore.value = profileData.demoScore || 0;
  
  // Load nationality, gender, and enableBitterByCoffee if present
  if (profileData.nationality) nationality.value = profileData.nationality;
  if (profileData.gender) gender.value = profileData.gender;
  if (profileData.hasOwnProperty('enableBitterByCoffee')) {
    enableBitterByCoffee.value = profileData.enableBitterByCoffee;
  }

  // Load college lists
  if (profileData.earlyDecisionColleges && Array.isArray(profileData.earlyDecisionColleges)) {
    savedColleges.value = profileData.earlyDecisionColleges.map(savedCollege => {
      const fullCollege = colleges.find(c => c.name === savedCollege.name);
      return fullCollege || savedCollege;
    }).filter(Boolean);
  }

  if (profileData.regularDecisionColleges && Array.isArray(profileData.regularDecisionColleges)) {
    recentlyViewed.value = profileData.regularDecisionColleges.map(savedCollege => {
      const fullCollege = colleges.find(c => c.name === savedCollege.name);
      return fullCollege || savedCollege;
    }).filter(Boolean);
  }
};

// Load profile data function
const loadProfileData = () => {
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
      console.error('Error parsing saved profile data:', e);
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
    } catch (e) {
      console.error('Error parsing persistent profile data:', e);
    }
  }
};

// Add window resize event listener and load profile data on mount
onMounted(() => {
  console.log('🚀 explorePage mounted');
  window.addEventListener('resize', handleResize);
  
  // Load profile data with same logic as profile page
  loadProfileData();
  
  // Load click count for promotion modal
  loadClickCount();
  
  console.log('🎯 Initial state - isAuthenticated:', userStore.isAuthenticated);
  console.log('🎯 Initial click count:', collegeClickCount.value);
  if (!userStore.isAuthenticated && collegeClickCount.value >= 3){
    console.log('👤 User not authenticated, showing promotion modal');
    promotionModalOpen.value = true;
  } else {
    console.log('✅ User authenticated or click count not reached, skipping promotion modal');
  }
});

// Remove event listener on component unmount
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// Function to reset promotion tracking for development
const resetPromotionTracking = () => {
  if (import.meta.env.DEV) {
    localStorage.removeItem('collegeClickCount');
    collegeClickCount.value = 0;
    localStorage.removeItem('promotionDismissedDate');
    alert('DEV: Promotion tracking has been reset.');
  }
};

// Computed for filtered colleges based on filter option
const filteredColleges = computed(() => {
  let filtered = [];

  // Apply filter
  switch(filterBy.value) {
    case 'Elite (< 10%)':
      filtered = getCollegesByAcceptanceRate(0, 10);
      break;
    case 'Target (10-20%)':
      filtered = getCollegesByAcceptanceRate(10, 20);
      break;
    case 'Safety (> 20%)':
      filtered = getCollegesByAcceptanceRate(20, 100);
      break;
    case 'STEM-focused':
      filtered = getCollegesByType('STEM-heavy');
      break;
    case 'Liberal Arts':
      filtered = getCollegesByType('Liberal-arts');
      break;
    default:
      filtered = [...colleges]; // Use a copy to avoid modifying the original array
  }

  // Apply search query
  if (searchQuery.value) {
    const lowerSearchQuery = searchQuery.value.toLowerCase();
    filtered = filtered.filter(college =>
      college.name.toLowerCase().includes(lowerSearchQuery) ||
      college.location.toLowerCase().includes(lowerSearchQuery)
    );
  }

  // Apply sorting
  return sortCollegesBy(filtered, sortBy.value);
});

// Computed for paginated colleges
const displayedColleges = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredColleges.value.slice(start, end);
});

// Reset to page 1 when filter changes
watch([filterBy, sortBy, searchQuery], () => {
  page.value = 1;
});

// Helper function to determine chip color based on acceptance rate
const getAcceptanceRateColor = (rate) => {
  if (rate < 10) return 'error';
  if (rate < 20) return 'warning';
  if (rate < 40) return 'info';
  return 'success';
};

// Reset filters
const resetFilters = () => {
  filterBy.value = 'All';
  sortBy.value = 'acceptanceRate';
  searchQuery.value = '';
};

// Computed student profile for admission calculations - Updated to include all fields
const studentProfile = computed(() => {
  return {
    satReading: satReading.value,
    satMath: satMath.value,
    gpa: gpa.value,
    apClasses: apClasses.value,
    extracurriculars: extracurriculars.value,
    intendedMajor: intendedMajor.value,
    recScore: recScore.value,
    isLegacy: isLegacy.value,
    demoScore: demoScore.value,
    nationality: nationality.value,
    gender: gender.value,
    enableBitterByCoffee: enableBitterByCoffee.value
  };
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

// College action items for dropdown
const collegeActionItems = [
  { title: 'View Details', action: 'view', icon: 'mdi-eye-outline' },
  { title: 'Save to Regular Decision', action: 'saveRegular', icon: 'mdi-bookmark-outline' },
  { title: 'Save to Early Decision', action: 'saveEarly', icon: 'mdi-bookmark' },
];

// Handle college selection to open admission chance modal
const openAdmitChanceModal = (college) => {
  selectedCollege.value = college;
  admitChanceModalOpen.value = true;

  // Close mobile panels when selecting a college
  leftPanelOpen.value = false;
  rightPanelOpen.value = false;
};

// Navigate to the dedicated college profile page
const navigateToCollegeProfilePage = (college) => {
  console.log('🎯 College card clicked:', college.name);
  console.log('🔐 User authenticated:', userStore.isAuthenticated);
  
  // Track college card clicks for promotion modal
  if (!userStore.isAuthenticated) {
    console.log('👤 User not authenticated, tracking click...');
    trackCollegeClick();
  } else {
    console.log('✅ User authenticated, skipping click tracking');
  }

  // Encode the college name to ensure it's URL-safe
  router.push({ path: `/college/${encodeURIComponent(college.name)}` });
  leftPanelOpen.value = false;
  rightPanelOpen.value = false;
};

// Close the admission chance modal
const closeAdmitChanceModal = () => {
  admitChanceModalOpen.value = false;
  selectedCollege.value = null; // Clear selected college
};

// Handle college action selections
const handleCollegeAction = (action, college) => {
  console.log(`Action: ${action} for college: ${college.name}`);

  // Implement action handling
  switch(action) {
    case 'view':
      navigateToCollegeProfilePage(college); // Navigate to full page instead of modal
      break;
    case 'saveRegular':
      handleSaveToRegular({ college, action: 'add' });
      break;
    case 'saveEarly':
      handleSaveToEarly({ college, action: 'add' });
      break;
    // Additional cases can be implemented as needed
  }
};

// Handle save to early decision
const handleSaveToEarly = ({ college, action, index }) => {
  if (action === 'add') {
    if (!savedColleges.value.some(c => c.name === college.name)) {
      savedColleges.value.unshift(college); // Add to the beginning of the list
    }
  } else if (action === 'remove' && index !== undefined) {
    savedColleges.value.splice(index, 1);
  }
};

// Handle save to regular decision
const handleSaveToRegular = ({ college, action, index }) => {
  if (action === 'add') {
    if (!recentlyViewed.value.some(c => c.name === college.name)) {
      recentlyViewed.value.unshift(college); // Add to the beginning of the list
    }
  } else if (action === 'remove' && index !== undefined) {
    recentlyViewed.value.splice(index, 1);
  }
};

// Function to remove a college from the saved list
const removeSavedCollege = (index) => {
  savedColleges.value.splice(index, 1);
};

// Function to remove a college from the recently viewed list
const removeRecentlyViewedCollege = (index) => {
  recentlyViewed.value.splice(index, 1);
};

// Function to calculate admission chance for a college
const getAdmissionChance = (college) => {
  // Create student profile from current values
  const studentData = prepareStudentData({
    satReading: satReading.value,
    satMath: satMath.value,
    gpa: gpa.value,
    apClasses: apClasses.value,
    extracurriculars: extracurriculars.value,
    intendedMajor: intendedMajor.value,
    recScore: recScore.value,
    isLegacy: isLegacy.value,
    demoScore: demoScore.value,
    isEarlyDecision: false // Default to Regular Decision in the listing
  });

  // Calculate chance
  const chanceResult = calculateAdmissionChance(studentData, college);
  return chanceResult.probability || 0;
};

// Promotion modal functions
const trackCollegeClick = () => {
  console.log('📊 trackCollegeClick() called');
  
  // Check if user dismissed for the day
  const today = new Date().toDateString();
  const dismissedToday = localStorage.getItem('promotionDismissedDate');
  
  console.log('📅 Today:', today);
  console.log('🚫 Dismissed date:', dismissedToday);
  
  if (dismissedToday === today) {
    console.log('⏭️  Modal dismissed for today, skipping...');
    return; // Don't show if dismissed for today
  }

  // Get current click count from localStorage or initialize
  const storedCount = localStorage.getItem('collegeClickCount');
  collegeClickCount.value = storedCount ? parseInt(storedCount) + 1 : 1;
  
  console.log('🔢 Previous click count:', storedCount);
  console.log('🔢 New click count:', collegeClickCount.value);
  
  // Save updated count
  localStorage.setItem('collegeClickCount', collegeClickCount.value.toString());
  console.log('💾 Saved click count to localStorage');
  
  // Show modal after 3 clicks
  if (collegeClickCount.value >= 3) {
    console.log('🎉 3 clicks reached! Showing promotion modal...');
    promotionModalOpen.value = true;
  } else {
    console.log(`⏳ Need ${3 - collegeClickCount.value} more clicks to show modal`);
  }
};

const dismissPromotionModal = () => {
  console.log('❌ Promotion modal dismissed (not now)');
  promotionModalOpen.value = false;
  localStorage.setItem('collegeClickCount', '0');
  collegeClickCount.value = 0; // Reset click count
};

const dismissPromotionModalForDay = () => {
  console.log('🚫 Promotion modal dismissed for the day');
  promotionModalOpen.value = false;
  const today = new Date().toDateString();
  localStorage.setItem('promotionDismissedDate', today);
  console.log('💾 Saved dismissal date:', today);
  // Reset click count so it can trigger again tomorrow
  localStorage.setItem('collegeClickCount', '0');
  collegeClickCount.value = 0;
  console.log('🔄 Reset click count to 0');
};

const navigateToLogin = () => {
  console.log('🔑 Navigating to login page');
  promotionModalOpen.value = false;
  // Navigate to login/register page - adjust route as needed
  router.push({ path: '/login' });
};

// Load click count on mount
const loadClickCount = () => {
  const storedCount = localStorage.getItem('collegeClickCount');
  console.log('🔄 Loading click count from localStorage:', storedCount);
  if (storedCount) {
    collegeClickCount.value = parseInt(storedCount);
    console.log('📊 Loaded click count:', collegeClickCount.value);
  } else {
    console.log('🆕 No stored click count, starting at 0');
  }
};

// Navigation guard to check authentication status
const requireAuth = (to, from, next) => {
  const isAuthenticated = userStore.isAuthenticated;
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login if not authenticated
    next({ name: 'login' });
  } else {
    next();
  }
};

// Function to open map modal
const openMapModal = () => {
  // Add a slight delay for smoother animation
  setTimeout(() => {
    mapModalOpen.value = true;
  }, 100);
};

// Function to close map modal
const closeMapModal = () => {
  mapModalOpen.value = false;
};

// Handle keyboard events for modal
const handleKeydown = (event) => {
  if (event.key === 'Escape' && mapModalOpen.value) {
    closeMapModal();
  }
};

// Add keyboard event listener when modal is open
watch(mapModalOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleKeydown);
  } else {
    document.removeEventListener('keydown', handleKeydown);
  }
});

// Global before guard
router.beforeEach((to, from, next) => {
  // Check authentication for protected routes
  requireAuth(to, from, next);
});
</script>

<style scoped>
.explore-page {
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
  z-index: 1;
}
.search-field{
  position: relative;
  z-index: 2;
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

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto 1.5rem;
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
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

.sticky-panel {
  position: sticky;
  top: 80px;
  align-self: start;
  height: calc(100vh - 100px);
  overflow-y: auto;
}

.college-card {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid rgba(0,0,0,0.08);
}

.college-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important;
}


/* Floating buttons styling */
.floating-buttons {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.floating-buttons .v-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.floating-buttons .v-btn:hover {
  transform: scale(1.1);
}

.floating-buttons .map-btn-pulse {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%) !important;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

/* Desktop floating map button */
.floating-map-btn {
  position: fixed;
  bottom: 30px;
  left: 40px;
  z-index: 100;
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%) !important;
  color: white !important;
  border: 3px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  width: 80px !important;
  height: 80px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
}

.map-btn-label {
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Pulsing animation for the map button */
.map-btn-pulse {
  animation: mapPulse 2s infinite;
  position: relative;
}

.map-btn-pulse::before {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  opacity: 0;
  animation: mapPulseRing 2s infinite;
  z-index: -1;
}

@keyframes mapPulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 
      0 8px 24px rgba(76, 175, 80, 0.3),
      0 0 0 0 rgba(76, 175, 80, 0.4);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 
      0 12px 32px rgba(76, 175, 80, 0.5),
      0 0 0 8px rgba(76, 175, 80, 0.1);
  }
}

@keyframes mapPulseRing {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.1;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

/* Map modal styling */
.map-modal-card {
  width: 95vw !important;
  height: 85vh !important;
  max-width: none !important;
  max-height: none !important;
  margin: auto;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.map-modal-header {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 24px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.map-modal-content {
  height: calc(85vh - 88px) !important; /* Account for header height */
  overflow: hidden !important;
}

.close-modal-btn {
  background: rgba(0, 0, 0, 0.04) !important;
  transition: all 0.3s ease !important;
}

.close-modal-btn:hover {
  background: rgba(0, 0, 0, 0.08) !important;
  transform: rotate(90deg);
}

/* Smooth fade transition for modal */
:deep(.fade-transition-enter-active),
:deep(.fade-transition-leave-active) {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.fade-transition-enter-from),
:deep(.fade-transition-leave-to) {
  opacity: 0;
  transform: scale(0.9);
}

/* Map modal content */
.map-modal-content {
  height: calc(100vh - 64px); /* Account for toolbar height */
  overflow: hidden;
}

/* Close button in mobile drawer */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
}

.v-navigation-drawer {
  z-index: 1000;
}

.rounded-l-lg {
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;
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


/* Deep styles for consistency */
:deep(.v-card) {
  border: none;
}

:deep(.v-btn) {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
}
</style>