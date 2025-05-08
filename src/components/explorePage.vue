<template>
  <v-container fluid class="" style="max-width: 2000px">
    <v-container class="text-center py-6">
      <h1 class="text-h2 font-weight-bold mb-4 pt-5">Explore Colleges</h1>
      <p class="text-body-1 mb-6">
        Discover colleges that match your profile and preferences.
      </p>
      <v-text-field
        v-model="searchQuery"
        label="Search Colleges"
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
        clearable
        class="mx-auto py-2"
        style="max-width: 600px"
        @update:modelValue="handleSearch"
      ></v-text-field>
    </v-container>

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
        @click="rightPanelOpen = !rightPanelOpen"
      ></v-btn>
    </div>

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
            <v-card-title class="text-h6">Early Decision</v-card-title>
            <v-divider class="my-2"></v-divider>

            <div v-if="savedColleges.length === 0" class="text-center py-8 text-medium-emphasis">
              <v-icon icon="mdi-bookmark-outline" size="large" class="mb-2"></v-icon>
              <div>No saved colleges yet</div>
              <div class="text-caption">Your saved colleges will appear here</div>
            </div>

            <v-list v-else lines="two" density="compact">
              <v-list-item
                v-for="(college, i) in savedColleges"
                :key="`saved-${i}`"
                :title="college.name"
                :subtitle="college.location"
                @click="selectCollege(college)"
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
              </v-list-item>
            </v-list>

            <v-divider class="my-4"></v-divider>

            <v-card-title class="text-h6">Regular Decision</v-card-title>
            <div v-if="recentlyViewed.length === 0" class="text-center py-8 text-medium-emphasis">
              <v-icon icon="mdi-bookmark-outline" size="large" class="mb-2"></v-icon>
              <div>No saved colleges yet</div>
              <div class="text-caption">Your saved colleges will appear here</div>
            </div>
            <v-list v-else lines="two" density="compact">
              <v-list-item
                v-for="(college, i) in recentlyViewed"
                :key="`recent-${i}`"
                :title="college.name"
                :subtitle="college.location"
                @click="selectCollege(college)"
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
              </v-list-item>
            </v-list>
          </v-card>
        </div>
      </v-navigation-drawer>

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

        <v-card class="mb-4 no-hover" variant="outlined" rounded="lg">
          <v-card-title class="d-flex align-center">
            <span class="text-h6">Colleges ({{ displayedColleges.length }})</span>
            <v-spacer></v-spacer>
            <v-select
              v-model="filterBy"
              :items="filterOptions"
              label="Filter"
              hide-details
              density="compact"
              style="max-width: 150px"
              class="mx-2"
            ></v-select>
            <v-select
              v-model="sortBy"
              :items="sortOptions"
              label="Sort"
              hide-details
              density="compact"
              style="max-width: 150px"
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
          class="mb-4"
          rounded="lg"
          :elevation="4"
          @click="selectCollege(college)"
        >
          <v-row class="ma-0">
            <v-col sm="4" class="pa-0 d-none d-sm-block">
              <v-img
                :src="college.image"
                height="225"
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
              <p class="text-body-2 mb-2">{{ college.description }}</p>
              <div class="d-flex align-center mt-auto">
                <v-rating
                  :model-value="college.rating"
                  color="amber"
                  density="compact"
                  size="small"
                  readonly
                ></v-rating>
                <span class="text-body-2 ml-2">({{ college.reviewCount }} reviews)</span>
                <v-spacer></v-spacer>
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      variant="text"
                      color="primary"
                      density="comfortable"
                    >
                      Options
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
                        <v-icon :icon="item.icon" size="small" class="ml-2"></v-icon>
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
        >
          <v-icon icon="mdi-school-outline" size="x-large" class="mb-3"></v-icon>
          <h3 class="text-h6 mb-2">No colleges match your criteria</h3>
          <p class="text-body-2">Try adjusting your filters or search term.</p>
          <v-btn
            color="primary"
            class="mt-3"
            @click="resetFilters"
          >
            Reset Filters
          </v-btn>
        </v-card>

        <div v-if="displayedColleges.length > 0" class="d-flex justify-center mt-4">
          <v-pagination
            v-model="page"
            :length="Math.ceil(filteredColleges.length / itemsPerPage)"
            show-first-last-page
            :total-visible="7"
          ></v-pagination>
        </div>
      </v-col>

      <v-col cols="12" md="3" class="pa-3 hidden-sm-and-down sticky-panel">
        <v-card class="pa-4" rounded="lg">
          <v-card-title class="text-h6">Early Decision</v-card-title>
          <v-divider class="my-2"></v-divider>

          <div v-if="savedColleges.length === 0" class="text-center py-8 text-medium-emphasis">
            <v-icon icon="mdi-bookmark-outline" size="large" class="mb-2"></v-icon>
            <div>No saved colleges yet</div>
            <div class="text-caption">Your saved colleges will appear here</div>
          </div>

          <v-list v-else lines="two" density="compact">
            <v-list-item
              v-for="(college, i) in savedColleges"
              :key="`saved-${i}`"
              :title="college.name"
              :subtitle="college.location"
              @click="selectCollege(college)"
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
            </v-list-item>
          </v-list>

          <v-divider class="my-4"></v-divider>

          <v-card-title class="text-h6">Regular Decision</v-card-title>
          <div v-if="recentlyViewed.length === 0" class="text-center py-8 text-medium-emphasis">
            <v-icon icon="mdi-bookmark-outline" size="large" class="mb-2"></v-icon>
            <div>No saved colleges yet</div>
            <div class="text-caption">Your saved colleges will appear here</div>
          </div>
          <v-list v-else lines="two" density="compact">
            <v-list-item
              v-for="(college, i) in recentlyViewed"
              :key="`recent-${i}`"
              :title="college.name"
              :subtitle="college.location"
              @click="selectCollege(college)"
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
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'; // Added onUnmounted
import AdmitChanceComponent from './AdmitChanceComponent.vue';
import ProfileSummaryComponent from './ProfileSummaryComponent.vue';
import { colleges, getCollegesByType, getCollegesByAcceptanceRate, sortCollegesBy, searchColleges } from '../data/colleges.js';
import { majors, calculateFitScore, determineAPCourseCategory, determineActivityCategory } from '../utils/majorData';
import { getMajorMatchAssessment } from '../utils/admitChanceCalculator';
import CollegeComparison from './CollegeComparison.vue';

// State for responsive side panels
const leftPanelOpen = ref(false);
const rightPanelOpen = ref(false);

// Close panels when screen size changes to desktop
const handleResize = () => {
  if (window.innerWidth >= 960) { // md breakpoint in Vuetify
    leftPanelOpen.value = false;
    rightPanelOpen.value = false;
  }
};

// Add window resize event listener
onMounted(() => {
  window.addEventListener('resize', handleResize);

  // Load saved profile data
  const savedData = localStorage.getItem('userProfileData');
  if (savedData) {
    try {
      const profileData = JSON.parse(savedData);

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

      // Load college lists
      if (profileData.earlyDecisionColleges && Array.isArray(profileData.earlyDecisionColleges)) {
        // Map saved college names to full college objects
        savedColleges.value = profileData.earlyDecisionColleges.map(savedCollege => {
          const fullCollege = colleges.find(c => c.name === savedCollege.name);
          return fullCollege || savedCollege;
        }).filter(Boolean); // Ensure no undefined entries if a college isn't found
      }

      if (profileData.regularDecisionColleges && Array.isArray(profileData.regularDecisionColleges)) {
        // Map saved college names to full college objects
        recentlyViewed.value = profileData.regularDecisionColleges.map(savedCollege => {
          const fullCollege = colleges.find(c => c.name === savedCollege.name);
          return fullCollege || savedCollege;
        }).filter(Boolean); // Ensure no undefined entries
      }

      console.log('Profile data loaded successfully');
    } catch (e) {
      console.error('Error parsing saved profile data:', e);
      localStorage.removeItem('userProfileData'); // Clear corrupted data
    }
  }
});

// Remove event listener on component unmount
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// Filtering and pagination
const searchQuery = ref('');
const filterBy = ref('All');
const sortBy = ref('acceptanceRate');
const page = ref(1);
const itemsPerPage = 5;
const selectedCollege = ref(null);
const admitChanceModalOpen = ref(false);

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

// Student profile data (now loaded from localStorage)
const satReading = ref(500);
const satMath = ref(500);
const gpa = ref(3.0);
const apClasses = ref([]);
const extracurriculars = ref([]);
const intendedMajor = ref("");
const recScore = ref(2);
const isLegacy = ref(false);
const demoScore = ref(0);

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

// Handle search input
const handleSearch = (value) => {
  searchQuery.value = value === null ? '' : value; // Handle clearable text field
};

// Computed student profile for admission calculations
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
    demoScore: demoScore.value
  };
});

// Persist Early Decision (savedColleges) changes
watch(savedColleges, (newVal) => {
  try {
    const data = JSON.parse(localStorage.getItem('userProfileData') || '{}');
    data.earlyDecisionColleges = newVal.map(c => ({ name: c.name, location: c.location, image: c.image })); // Save more info if needed
    localStorage.setItem('userProfileData', JSON.stringify(data));
  } catch (e) {
    console.error('Error saving early decision colleges:', e);
  }
}, { deep: true });

// Persist Regular Decision (recentlyViewed) changes
watch(recentlyViewed, (newVal) => {
  try {
    const data = JSON.parse(localStorage.getItem('userProfileData') || '{}');
    data.regularDecisionColleges = newVal.map(c => ({ name: c.name, location: c.location, image: c.image })); // Save more info if needed
    localStorage.setItem('userProfileData', JSON.stringify(data));
  } catch (e) {
    console.error('Error saving regular decision colleges:', e);
  }
}, { deep: true });


// College action items for dropdown
const collegeActionItems = [
  { title: 'View College Profile', action: 'view', icon: 'mdi-school' },
  { title: 'Save to Regular Decision', action: 'saveRegular', icon: 'mdi-bookmark-outline' },
  { title: 'Save to Early Decision', action: 'saveEarly', icon: 'mdi-bookmark' },
];

// Handle college selection to open admission chance modal
const selectCollege = (college) => {
  selectedCollege.value = college;
  admitChanceModalOpen.value = true;

  // Close mobile panels when selecting a college
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
      selectCollege(college);
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
      savedColleges.value.push(college);
    }
  } else if (action === 'remove' && index !== undefined) {
    savedColleges.value.splice(index, 1);
  }
};

// Handle save to regular decision
const handleSaveToRegular = ({ college, action, index }) => {
  if (action === 'add') {
    if (!recentlyViewed.value.some(c => c.name === college.name)) {
      recentlyViewed.value.push(college);
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
</script>

<style scoped>
.sticky-panel {
  position: sticky;
  top: 80px; /* Adjust based on your header height */
  align-self: start;
  height: calc(100vh - 80px); /* Adjust based on your header height */
  overflow-y: auto;
}

.v-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

/* Apply hover effect only to cards that are not expansion panels, dialog cards, sticky panel cards, or marked with .no-hover */
.v-card:not(.v-expansion-panel):not(.v-dialog .v-card):not(.sticky-panel .v-card):not(.no-hover):hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
}

/* Floating buttons styling */
.floating-buttons {
  position: fixed;
  bottom: 60px; /* Adjusted for potential bottom navigation */
  right: 20px;
  display: flex;
  flex-direction: column;
  z-index: 100; /* Ensure they are above other content but below modals */
}

/* Close button in mobile drawer */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1; /* Ensure it's above other drawer content */
}

/* Ensure navigation drawers stay on top */
.v-navigation-drawer {
  z-index: 1000; /* High z-index for drawers */
}

/* Ensure the college image corners are rounded correctly with the card */
.rounded-l-lg {
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;
}
</style>
