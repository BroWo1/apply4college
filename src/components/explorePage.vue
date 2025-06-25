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
      ></v-btn>
    </div>

    <!-- Desktop panel toggle buttons -->
    <v-btn
      :color="rightPanelDesktopOpen ? 'secondary' : 'surface-variant'"
      :icon="rightPanelDesktopOpen ? 'mdi-chevron-right' : 'mdi-bookmark'"
      fab
      size="small"
      class="right-toggle d-none d-md-flex"
      @click="rightPanelDesktopOpen = !rightPanelDesktopOpen"
      :title="rightPanelDesktopOpen ? 'Hide Saved Colleges' : 'Show Saved Colleges'"
    ></v-btn>

    <v-btn
      color="success"
      fab
      size="large"
      class="floating-map-btn d-none d-md-flex"
      @click="openMapModal"
      elevation="4"
    >
      <v-icon>mdi-map</v-icon>
    </v-btn>

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
            <v-card class="pa-4" rounded="xl">
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

        <!-- Desktop Left Panel -->
        <transition name="slide-left">
          <v-col 
            v-if="leftPanelDesktopOpen" 
            cols="12" 
            md="3" 
            class="pa-3 hidden-sm-and-down sticky-panel desktop-panel"
          >
            <ProfileSummaryComponent
              :satReading="satReading"
              :satMath="satMath"
              :gpa="gpa"
              :intendedMajor="intendedMajor"
              :apClasses="apClasses"
              :extracurriculars="extracurriculars"
            />
          </v-col>
        </transition>

        <v-col cols="12" :md="getMainColumnSize" class="pa-3 main-column">

          <v-card class="mb-4" variant="flat" color="transparent" rounded="lg">
            <v-card-title>
              <v-row align="center">
                <v-col cols="12" sm="auto" class="me-sm-auto">
                  <span class="text-h6">{{ $t('explorePage.collegesCount') }} ({{ displayedColleges.length }})</span>
                </v-col>
                <v-col cols="6" sm="4" md="3" lg="2">
                  <v-select
                    v-model="filterBy"
                    :items="filterOptions"
                    :label="$t('explorePage.filter')"
                    hide-details
                    density="compact"
                    class="my-1 custom-select"
                    variant="outlined"
                    rounded="lg"
                    :menu-props="{ transition: 'slide-y-transition' }"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item 
                        v-bind="props" 
                        :title="item.title" 
                        rounded="lg"
                        class="custom-select-item"
                      ></v-list-item>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="6" sm="4" md="3" lg="2">
                  <v-select
                    v-model="sortBy"
                    :items="sortOptions"
                    :label="$t('explorePage.sort')"
                    hide-details
                    density="compact"
                    class="my-1 custom-select"
                    variant="outlined"
                    rounded="lg"
                    :menu-props="{ transition: 'slide-y-transition' }"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item 
                        v-bind="props" 
                        :title="item.title" 
                        rounded="lg"
                        class="custom-select-item"
                      ></v-list-item>
                    </template>
                  </v-select>
                </v-col>
              </v-row>
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
          >
            <v-row class="ma-0">
              <v-col sm="4" class="pa-0 d-none d-sm-block" @click="navigateToCollegeProfilePage(college)" style="cursor: pointer;">
                <v-img
                  :src="college.image"
                  height="100%"
                  cover
                  class="rounded-l-lg"
                ></v-img>
              </v-col>
              <v-col cols="12" sm="8" class="pa-4">
                <div class="d-flex justify-space-between align-start" @click="navigateToCollegeProfilePage(college)" style="cursor: pointer;">
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

                <div class="d-flex flex-wrap my-3" @click="navigateToCollegeProfilePage(college)" style="cursor: pointer;">
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
                  <div class="d-flex align-center" @click="navigateToCollegeProfilePage(college)" style="cursor: pointer;">
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
                  
                  <v-menu
                    location="bottom end"
                    transition="slide-y-transition"
                  >
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon="mdi-dots-vertical"
                        variant="text"
                        density="comfortable"
                      >
                      </v-btn>
                    </template>
                    <v-card min-width="250" rounded="xl" elevation="4">
                      <v-list nav density="compact">
                        <v-list-item
                          v-for="(item, index) in collegeActionItems"
                          :key="index"
                          :value="index"
                          @click="handleCollegeAction(item.action, college)"
                          rounded="lg"
                        >
                          <template v-slot:prepend>
                            <v-icon :icon="item.icon" size="small" class="me-3"></v-icon>
                          </template>
                          <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-card>
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

        <!-- Desktop Right Panel -->
        <transition name="slide-right">
          <v-col 
            v-if="rightPanelDesktopOpen" 
            cols="12" 
            md="3" 
            class="pa-3 hidden-sm-and-down sticky-panel desktop-panel"
          >
            <v-card class="pa-4" rounded="xl">
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
        </transition>
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
import { useUserStore } from '@/stores/user';

const { t } = useI18n();
const userStore = useUserStore();

const isDevEnvironment = computed(() => import.meta.env.DEV);

const leftPanelOpen = ref(false);
const rightPanelOpen = ref(false);
const leftPanelDesktopOpen = ref(true);
const rightPanelDesktopOpen = ref(true);

const router = useRouter();

const handleResize = () => {
  if (window.innerWidth >= 960) {
    leftPanelOpen.value = false;
    rightPanelOpen.value = false;
  }
};

const searchQuery = ref('');
const filterBy = ref('All');
const sortBy = ref('acceptanceRate');
const page = ref(1);
const itemsPerPage = 8;
const selectedCollege = ref(null);
const admitChanceModalOpen = ref(false);

const promotionModalOpen = ref(false);
const collegeClickCount = ref(0);

const mapModalOpen = ref(false);

const filterOptions = [
  'All',
  'Elite (< 10%)',
  'Target (10-20%)',
  'Safety (> 20%)',
  'STEM-focused',
  'Liberal Arts'
];

const sortOptions = [
  { title: 'Acceptance Rate', value: 'acceptanceRate' },
  { title: 'College Name', value: 'name' },
  { title: 'Rating', value: 'rating' },
  { title: 'Tuition', value: 'tuition' }
];

const savedColleges = ref([]);
const recentlyViewed = ref([]);

const satReading = ref(500);
const satMath = ref(500);
const gpa = ref(3.0);
const apClasses = ref([]);
const extracurriculars = ref([]);
const intendedMajor = ref("");
const recScore = ref(2);
const isLegacy = ref(false);
const demoScore = ref(0);
const nationality = ref('United States');
const gender = ref('Prefer not to say');
const enableBitterByCoffee = ref(false);

const applyProfileData = (profileData) => {
  satReading.value = profileData.satReading || 500;
  satMath.value = profileData.satMath || 500;
  gpa.value = profileData.gpa || 3.0;

  if (profileData.apClasses && Array.isArray(profileData.apClasses)) {
    apClasses.value = profileData.apClasses;
  }

  if (profileData.extracurriculars && Array.isArray(profileData.extracurriculars)) {
    extracurriculars.value = profileData.extracurriculars;
  }

  intendedMajor.value = profileData.intendedMajor || "";
  recScore.value = profileData.recScore || 2;
  isLegacy.value = profileData.isLegacy || false;
  demoScore.value = profileData.demoScore || 0;
  
  if (profileData.nationality) nationality.value = profileData.nationality;
  if (profileData.gender) gender.value = profileData.gender;
  if (profileData.hasOwnProperty('enableBitterByCoffee')) {
    enableBitterByCoffee.value = profileData.enableBitterByCoffee;
  }

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

const loadProfileData = () => {
  const profileKey = userStore.isAuthenticated ? 'userProfileData' : 'guestProfileData';
  
  const savedData = localStorage.getItem(profileKey);
  if (savedData) {
    try {
      const profileData = JSON.parse(savedData);
      applyProfileData(profileData);
    } catch (e) {
      console.error('Error parsing saved profile data:', e);
    }
  }

  const persistentData = localStorage.getItem('persistentProfileData');
  if (persistentData) {
    try {
      const persistentProfileData = JSON.parse(persistentData);
      
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

onMounted(() => {
  window.addEventListener('resize', handleResize);
  loadProfileData();
  loadClickCount();
  
  if (!userStore.isAuthenticated && collegeClickCount.value >= 3){
    promotionModalOpen.value = true;
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const resetPromotionTracking = () => {
  if (import.meta.env.DEV) {
    localStorage.removeItem('collegeClickCount');
    collegeClickCount.value = 0;
    localStorage.removeItem('promotionDismissedDate');
    alert('DEV: Promotion tracking has been reset.');
  }
};

const filteredColleges = computed(() => {
  let filtered = [];

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
      filtered = [...colleges];
  }

  if (searchQuery.value) {
    const lowerSearchQuery = searchQuery.value.toLowerCase();
    filtered = filtered.filter(college =>
      college.name.toLowerCase().includes(lowerSearchQuery) ||
      college.location.toLowerCase().includes(lowerSearchQuery)
    );
  }

  return sortCollegesBy(filtered, sortBy.value);
});

const displayedColleges = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredColleges.value.slice(start, end);
});

watch([filterBy, sortBy, searchQuery], () => {
  page.value = 1;
});

const getAcceptanceRateColor = (rate) => {
  if (rate < 10) return 'error';
  if (rate < 20) return 'warning';
  if (rate < 40) return 'info';
  return 'success';
};

const resetFilters = () => {
  filterBy.value = 'All';
  sortBy.value = 'acceptanceRate';
  searchQuery.value = '';
};

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

// Computed property to dynamically set main column size based on panel visibility
const getMainColumnSize = computed(() => {
  const leftOpen = leftPanelDesktopOpen.value;
  const rightOpen = rightPanelDesktopOpen.value;
  
  if (leftOpen && rightOpen) return 6;
  if (leftOpen || rightOpen) return 9;
  return 12;
});

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

const collegeActionItems = [
  { title: 'View Details', action: 'view', icon: 'mdi-eye-outline' },
  { title: 'Save to Regular Decision', action: 'saveRegular', icon: 'mdi-bookmark-outline' },
  { title: 'Save to Early Decision', action: 'saveEarly', icon: 'mdi-bookmark' },
];

const openAdmitChanceModal = (college) => {
  selectedCollege.value = college;
  admitChanceModalOpen.value = true;
  leftPanelOpen.value = false;
  rightPanelOpen.value = false;
};

const navigateToCollegeProfilePage = (college) => {
  if (!userStore.isAuthenticated) {
    trackCollegeClick();
  }
  router.push({ path: `/college/${encodeURIComponent(college.name)}` });
  leftPanelOpen.value = false;
  rightPanelOpen.value = false;
};

const closeAdmitChanceModal = () => {
  admitChanceModalOpen.value = false;
  selectedCollege.value = null;
};

const handleCollegeAction = (action, college) => {
  switch(action) {
    case 'view':
      navigateToCollegeProfilePage(college);
      break;
    case 'saveRegular':
      handleSaveToRegular({ college, action: 'add' });
      break;
    case 'saveEarly':
      handleSaveToEarly({ college, action: 'add' });
      break;
  }
};

const handleSaveToEarly = ({ college, action, index }) => {
  if (action === 'add') {
    if (!savedColleges.value.some(c => c.name === college.name)) {
      savedColleges.value.unshift(college);
    }
  } else if (action === 'remove' && index !== undefined) {
    savedColleges.value.splice(index, 1);
  }
};

const handleSaveToRegular = ({ college, action, index }) => {
  if (action === 'add') {
    if (!recentlyViewed.value.some(c => c.name === college.name)) {
      recentlyViewed.value.unshift(college);
    }
  } else if (action === 'remove' && index !== undefined) {
    recentlyViewed.value.splice(index, 1);
  }
};

const removeSavedCollege = (index) => {
  savedColleges.value.splice(index, 1);
};

const removeRecentlyViewedCollege = (index) => {
  recentlyViewed.value.splice(index, 1);
};

const getAdmissionChance = (college) => {
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
    isEarlyDecision: false
  });
  const chanceResult = calculateAdmissionChance(studentData, college);
  return chanceResult.probability || 0;
};

const trackCollegeClick = () => {
  const today = new Date().toDateString();
  const dismissedToday = localStorage.getItem('promotionDismissedDate');
  
  if (dismissedToday === today) {
    return;
  }

  const storedCount = localStorage.getItem('collegeClickCount');
  collegeClickCount.value = storedCount ? parseInt(storedCount) + 1 : 1;
  
  localStorage.setItem('collegeClickCount', collegeClickCount.value.toString());
  
  if (collegeClickCount.value >= 3) {
    promotionModalOpen.value = true;
  }
};

const dismissPromotionModal = () => {
  promotionModalOpen.value = false;
  localStorage.setItem('collegeClickCount', '0');
  collegeClickCount.value = 0;
};

const dismissPromotionModalForDay = () => {
  promotionModalOpen.value = false;
  const today = new Date().toDateString();
  localStorage.setItem('promotionDismissedDate', today);
  localStorage.setItem('collegeClickCount', '0');
  collegeClickCount.value = 0;
};

const navigateToLogin = () => {
  promotionModalOpen.value = false;
  router.push({ path: '/login' });
};

const loadClickCount = () => {
  const storedCount = localStorage.getItem('collegeClickCount');
  if (storedCount) {
    collegeClickCount.value = parseInt(storedCount);
  }
};

const requireAuth = (to, from, next) => {
  const isAuthenticated = userStore.isAuthenticated;
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
};

const openMapModal = () => {
  setTimeout(() => {
    mapModalOpen.value = true;
  }, 100);
};

const closeMapModal = () => {
  mapModalOpen.value = false;
};

const handleKeydown = (event) => {
  if (event.key === 'Escape' && mapModalOpen.value) {
    closeMapModal();
  }
};

watch(mapModalOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleKeydown);
  } else {
    document.removeEventListener('keydown', handleKeydown);
  }
});

router.beforeEach((to, from, next) => {
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
  border: 1px solid rgba(0,0,0,0.08);
  max-width: 800px;
  margin: 0 auto 1rem auto;
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

/* Desktop floating map button */
.floating-map-btn {
  position: fixed;
  bottom: 60px;
  right: 30px;
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.floating-map-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(76, 175, 80, 0.3);
}

.floating-map-btn:active {
  transform: translateY(-2px);
  transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
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

/* Desktop panel toggle buttons */
.left-toggle {
  position: fixed;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.right-toggle {
  position: fixed;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.left-toggle:hover,
.right-toggle:hover {
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

/* Desktop panel transitions */
.desktop-panel {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-column {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Slide animations for panels */
.slide-left-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
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
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

:deep(.v-btn) {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
}

/* Glass effect for search field */
.search-field :deep(.v-field) {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
</style>