<!-- First removing the status selection in the AP class list display -->
<template>
  <v-container fluid class="pa-0" style="max-width: 2000px">
    <!-- Header and Search Bar -->
    <v-container class="text-center py-6">
      <h1 class="text-h2 font-weight-bold mb-6 pt-5">Apply 4 College .org</h1>
      <v-text-field
        v-model="searchQuery"
        label="Search Colleges"
        variant="solo"
        prepend-inner-icon="mdi-magnify"
        clearable
        class="mx-auto py-2"
        style="max-width: 600px"
        @update:modelValue="handleSearch"
      ></v-text-field>
    </v-container>

    <!-- Main Content with Categories and College List -->
    <v-row class="fill-height ma-0">
      <!-- Left Category Panel -->
      <v-col cols="12" md="3" class="pa-3 hidden-sm-and-down sticky-panel">
        <v-card class="pa-4" rounded="lg">
          <v-card-title class="text-h6">Personal Profile</v-card-title>
          <v-divider class="my-2"></v-divider>

          <v-expansion-panels variant="accordion">
            <!-- Standardized Score Panel -->
            <v-expansion-panel title="Standardized Score">
              <v-expansion-panel-text>
                <div class="text-body-1 pb-5">
                  SAT ({{satReading + satMath}})
                </div>
                <div class="text-body-2">
                  Reading ({{satReading}})
                </div>
                <v-slider
                  v-model="satReading"
                  :max="800"
                  :min="200"
                  :step="10"
                  thumb-label
                ></v-slider>
                <div class="text-body-2">
                  Math ({{satMath}})
                </div>
                <v-slider
                  v-model="satMath"
                  :max="800"
                  :min="200"
                  :step="10"
                  thumb-label
                ></v-slider>
                <div class="text-body-1 pt-3">
                  GPA ({{gpa}})
                </div>
                <v-slider
                  v-model="gpa"
                  :max="4.0"
                  :min="0.0"
                  :step="0.1"
                  thumb-label
                ></v-slider>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Intended Major Panel (Simplified) -->
            <v-expansion-panel title="Intended Major">
              <v-expansion-panel-text>
                <v-radio-group
                  v-model="intendedMajor"
                  label="Select your major category"
                  hide-details
                >
                  <v-radio value="STEM" label="STEM (Science, Technology, Engineering, Math)"></v-radio>
                  <v-radio value="Liberal Arts" label="Liberal Arts & Humanities"></v-radio>
                </v-radio-group>
                <div v-if="intendedMajor" class="mt-4 text-caption">
                  {{ intendedMajor === 'STEM' ? 'STEM' : 'Liberal Arts' }} focus will help us calculate how well your AP courses and
                  extracurricular activities align with your academic goals, which impacts admission chances.
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- AP Courses Panel -->
            <v-expansion-panel title="AP Courses">
              <v-expansion-panel-text>
                <div v-if="apClasses.length === 0" class="text-center py-2 text-medium-emphasis">
                  No AP classes added yet
                </div>
                <v-list v-else density="compact">
                  <v-list-item v-for="(apClass, i) in apClasses" :key="i">
                    <template v-slot:prepend>
                      <v-chip :color="getApScoreColor(apClass.score)" size="small" class="mx-3">
                        {{ apClass.score }}
                      </v-chip>
                    </template>
                    <v-list-item-title>{{ apClass.name }}</v-list-item-title>
                    <template v-slot:append>
                      <v-btn icon="mdi-delete" size="small" variant="text" @click="removeApClass(i)"></v-btn>
                    </template>
                  </v-list-item>
                </v-list>

                <div class="text-center mt-3">
                  <v-btn color="primary" @click="dialog = true">
                    Add AP Class
                  </v-btn>
                </div>

                <!-- AP Class Modal Dialog -->
                <v-dialog v-model="dialog" max-width="400px">
                  <v-card>
                    <v-card-title class="text-h6">Add AP Class</v-card-title>
                    <v-card-text>
                      <v-select
                        v-model="newApClass"
                        :items="apOptions"
                        label="AP Class Name"
                        hide-details
                        class="mb-3"
                      ></v-select>
                      <v-select
                        v-model="newApScore"
                        label="Score"
                        :items="['N/A', 1, 2, 3, 4, 5]"
                        hide-details
                        class="mb-3"
                      ></v-select>
                      <div class="text-caption mt-3">
                        Status: {{ newApScore === "N/A" ? "ongoing" : "completed" }}
                      </div>
                      <div v-if="newApClass && intendedMajor" class="mt-3 text-caption">
                        <v-chip size="small" :color="getApMajorMatchColor(newApClass)">
                          {{ getApMajorMatchText(newApClass) }}
                        </v-chip>
                        <span class="ml-2">match with {{ intendedMajor }}</span>
                      </div>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="grey-darken-1" variant="text" @click="dialog = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        color="primary"
                        variant="text"
                        @click="addApClassAndClose"
                        :disabled="!newApClass"
                      >
                        Add
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Extracurricular Panel -->
            <v-expansion-panel title="Extracurricular">
              <v-expansion-panel-text>
                <div v-if="extracurriculars.length === 0" class="text-center py-2 text-medium-emphasis">
                  No extracurricular activities added yet
                </div>
                <v-list v-else density="compact">
                  <v-list-item v-for="(activity, i) in extracurriculars" :key="i">
                    <template v-slot:prepend>
                      <v-chip :color="getActivityLevelColor(activity.level)" size="small" class="mx-3">
                        {{ activity.level }}
                      </v-chip>
                    </template>
                    <v-list-item-title>{{ activity.name }}</v-list-item-title>
                    <template v-slot:append>
                      <v-btn icon="mdi-delete" size="small" variant="text" @click="removeActivity(i)"></v-btn>
                    </template>
                  </v-list-item>
                </v-list>

                <div class="text-center mt-3">
                  <v-btn color="primary" @click="openActivityDialog">
                    Add Activity
                  </v-btn>
                </div>

                <!-- Extracurricular Activity Modal Dialog -->
                <v-dialog v-model="activityDialog" max-width="400px">
                  <v-card>
                    <v-card-title class="text-h6">Add Extracurricular Activity</v-card-title>
                    <v-card-text>
                      <v-select
                        v-model="newActivity"
                        :items="activityOptions"
                        label="Activity Name"
                        hide-details
                        class="mb-3"
                      ></v-select>
                      <div>
                        <div class="d-flex justify-space-between mb-1">
                          <span>Strength Rating</span>
                          <span class="text-caption">
                            {{ newActivityLevel }} - {{ getLevelDescription(newActivityLevel) }}
                          </span>
                        </div>
                        <v-slider
                          v-model="newActivityLevel"
                          :min="1"
                          :max="4"
                          :step="1"
                          thumb-label
                          :thumb-size="20"
                          color="primary"
                          hide-details
                        ></v-slider>
                      </div>
                      <div v-if="newActivity && intendedMajor" class="mt-3 text-caption">
                        <v-chip size="small" :color="getActivityMajorMatchColor(newActivity)">
                          {{ getActivityMajorMatchText(newActivity) }}
                        </v-chip>
                        <span class="ml-2">match with {{ intendedMajor }}</span>
                      </div>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="grey-darken-1" variant="text" @click="activityDialog = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        color="primary"
                        variant="text"
                        @click="addActivityAndClose"
                        :disabled="!newActivity"
                      >
                        Add
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Additional Factors Panel -->
            <v-expansion-panel title="Additional Factors">
              <v-expansion-panel-text>
                <div class="text-body-1 mb-3">Recommendation Letters</div>
                <div class="d-flex justify-space-between mb-1">
                  <span class="text-caption">Expected strength (1-3)</span>
                  <span class="text-caption">
                    {{ recScore }} - {{ getRecDescription(recScore) }}
                  </span>
                </div>
                <v-slider
                  v-model="recScore"
                  :min="1"
                  :max="3"
                  :step="1"
                  thumb-label
                  :thumb-size="20"
                  color="primary"
                  class="mb-3"
                ></v-slider>

                <v-switch
                  v-model="isLegacy"
                  label="Legacy status (parent or sibling attended)"
                  color="primary"
                  hide-details
                  class="mb-3"
                ></v-switch>

                <div class="text-body-1 mt-3 mb-2">Demographics</div>
                <v-select
                  v-model="demoScore"
                  :items="demoOptions"
                  label="Demographics impact"
                  hide-details
                ></v-select>
                <div class="text-caption mt-2">
                  This reflects how demographic factors might align with the institution's diversity goals.
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-btn
            color="primary"
            class="mt-4"
            @click="saveUserProfile"
            :loading="loading"
          >
            Save
          </v-btn>
        </v-card>
      </v-col>

      <!-- College List - Middle Section -->
      <v-col cols="12" md="6" class="pa-3">
        <!-- College Filter Card -->
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

        <!-- Admission Chance Modal Component -->
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

        <!-- College Cards List -->
        <v-card
          v-for="(college, i) in displayedColleges"
          :key="i"
          class="mb-4"
          rounded="lg"
          :elevation="4"
          @click="selectCollege(college)"
        >
          <v-row class="ma-0">
            <v-col cols="4" class="pa-0">
              <v-img
                :src="college.image"
                height="225"
                cover
                class="rounded-l-lg"
              ></v-img>
            </v-col>
            <v-col cols="8" class="pa-4">
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
                <!-- Menu Component -->
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      variant="text"
                      color="primary"
                      density="comfortable"
                    >
                      Details
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

        <!-- Empty State -->
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

        <!-- Pagination -->
          <div v-if="displayedColleges.length > 0" class="d-flex justify-center mt-4">
            <v-pagination
              v-model="page"
              :length="Math.ceil(filteredColleges.length / itemsPerPage)"
              show-first-last-page
              :total-visible="7"
            ></v-pagination>
          </div>
      </v-col>

      <!-- Right Category/Details Panel -->
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
import { ref, computed, onMounted, watch } from 'vue';
import AdmitChanceComponent from './AdmitChanceComponent.vue';
import { colleges, getCollegesByType, getCollegesByAcceptanceRate, sortCollegesBy, searchColleges } from '../data/colleges.js';
import { majors, calculateFitScore, determineAPCourseCategory, determineActivityCategory } from '../utils/majorData';
import { getMajorMatchAssessment } from '../utils/admitChanceCalculator';
import CollegeComparison from './CollegeComparison.vue';

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

// AP Classes data
const apOptions = [
  "AP Calculus AB",
  "AP Calculus BC",
  "AP Statistics",
  "AP Chemistry",
  "AP Biology",
  "AP Physics 1",
  "AP Physics 2",
  "AP Computer Science A",
  "AP Computer Science Principles",
  "AP English Language and Composition",
  "AP English Literature and Composition"
];

// Extracurricular Activities data
const activityOptions = [
  "Physics Competition",
  "Math Competition",
  "Writing Competition",
  "Student Council",
  "MUN",
  "STEM Research",
  "History Research",
  "STEM Club",
  "Website/App Development",
  "Community Service",
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

// Demo options
const demoOptions = [
  { title: 'Neutral (0)', value: 0 },
  { title: 'Slight advantage (+0.5)', value: 0.5 },
  { title: 'Advantage (+1)', value: 1 }
];

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
      filtered = colleges;
  }

  // Apply search query
  if (searchQuery.value) {
    filtered = filtered.filter(college =>
      college.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      college.location.toLowerCase().includes(searchQuery.value.toLowerCase())
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

// AP Classes functionality
const newApClass = ref("");
const newApScore = ref("N/A");
const dialog = ref(false);

const addApClass = () => {
  if (newApClass.value) {
    // Calculate fit score if intended major is selected
    let fitScore = 0;
    if (intendedMajor.value) {
      fitScore = calculateFitScore(newApClass.value, 'ap', intendedMajor.value);
    }

    // Determine status automatically based on score
    const status = newApScore.value === "N/A" ? "ongoing" : "completed";

    apClasses.value.push({
      name: newApClass.value,
      score: newApScore.value,
      status: status,
      fitScore: fitScore
    });
    newApClass.value = "";
    newApScore.value = "N/A";
  }
};

const removeApClass = (index) => {
  apClasses.value.splice(index, 1);
};

const getApScoreColor = (score) => {
  if (score === 5) return "success";
  if (score === 4) return "info";
  if (score === 3) return "warning";
  if (score === "N/A") return "grey";
  return "error";
};

const addApClassAndClose = () => {
  addApClass();
  dialog.value = false;
};

// Added functions to determine AP course alignment with major
const getApMajorMatchText = (apCourseName) => {
  const category = determineAPCourseCategory(apCourseName);
  if (category === intendedMajor.value) return 'Strong';
  if (category === 'Both') return 'Good';
  return 'Fair';
};

const getApMajorMatchColor = (apCourseName) => {
  const matchText = getApMajorMatchText(apCourseName);
  if (matchText === 'Strong') return 'success';
  if (matchText === 'Good') return 'info';
  return 'warning';
};

// Extracurricular Activities functionality
const newActivity = ref("");
const newActivityLevel = ref(2);
const activityDialog = ref(false);

const addActivity = () => {
  if (newActivity.value) {
    // Calculate fit score if intended major is selected
    let fitScore = 0;
    if (intendedMajor.value) {
      fitScore = calculateFitScore(newActivity.value, 'activity', intendedMajor.value);
    }

    extracurriculars.value.push({
      name: newActivity.value,
      level: newActivityLevel.value,
      fitScore: fitScore
    });
    newActivity.value = "";
    newActivityLevel.value = 2;
  }
};

const removeActivity = (index) => {
  extracurriculars.value.splice(index, 1);
};

const addActivityAndClose = () => {
  addActivity();
  activityDialog.value = false;
};

// Added functions to determine activity alignment with major
const getActivityMajorMatchText = (activityName) => {
  const category = determineActivityCategory(activityName);
  if (category === intendedMajor.value) return 'Strong';
  if (category === 'Both') return 'Good';
  return 'Fair';
};

const getActivityMajorMatchColor = (activityName) => {
  const matchText = getActivityMajorMatchText(activityName);
  if (matchText === 'Strong') return 'success';
  if (matchText === 'Good') return 'info';
  return 'warning';
};

const getActivityLevelColor = (level) => {
  if (level === 4) return "success";
  if (level === 3) return "info";
  if (level === 2) return "warning";
  return "grey";
};

const getLevelDescription = (level) => {
  const levelDescriptions = {
    1: 'Average',
    2: 'Somewhat Strong',
    3: 'Strong',
    4: 'Very Strong'
  };
  return levelDescriptions[level] || '';
};

const getRecDescription = (score) => {
  const descriptions = {
    1: 'Basic',
    2: 'Strong',
    3: 'Outstanding'
  };
  return descriptions[score] || '';
};

const openActivityDialog = () => {
  activityDialog.value = true;
};

// Reset filters
const resetFilters = () => {
  filterBy.value = 'All';
  sortBy.value = 'acceptanceRate';
  searchQuery.value = '';
};

// Handle search input
const handleSearch = (value) => {
  searchQuery.value = value;
};

// Profile saving and loading functionality
const loading = ref(false);

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

// Watch for changes in intended major to update fit scores
watch(intendedMajor, (newMajor) => {
  if (newMajor) {
    // Update AP class fit scores
    apClasses.value.forEach(ap => {
      ap.fitScore = calculateFitScore(ap.name, 'ap', newMajor);
    });

    // Update extracurricular fit scores
    extracurriculars.value.forEach(ec => {
      ec.fitScore = calculateFitScore(ec.name, 'activity', newMajor);
    });
  }
});

const saveUserProfile = () => {
  loading.value = true;

  const profileData = {
    // Standardized scores
    satReading: satReading.value,
    satMath: satMath.value,
    gpa: gpa.value,

    // AP Classes
    apClasses: apClasses.value,

    // Extracurricular activities
    extracurriculars: extracurriculars.value,

    // Additional factors
    intendedMajor: intendedMajor.value,
    recScore: recScore.value,
    isLegacy: isLegacy.value,
    demoScore: demoScore.value,

    // College lists
    earlyDecisionColleges: savedColleges.value.map(c => ({ name: c.name })),
    regularDecisionColleges: recentlyViewed.value.map(c => ({ name: c.name }))
  };

  localStorage.setItem('userProfileData', JSON.stringify(profileData));
  console.log('Profile data saved:', profileData);

  setTimeout(() => (loading.value = false), 1000);
};

// Load saved profile data
onMounted(() => {
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
        });
      }

      if (profileData.regularDecisionColleges && Array.isArray(profileData.regularDecisionColleges)) {
        // Map saved college names to full college objects
        recentlyViewed.value = profileData.regularDecisionColleges.map(savedCollege => {
          const fullCollege = colleges.find(c => c.name === savedCollege.name);
          return fullCollege || savedCollege;
        });
      }

      console.log('Profile data loaded successfully');
    } catch (e) {
      console.error('Error parsing saved profile data:', e);
      localStorage.removeItem('userProfileData');
    }
  }
});

// College action items for dropdown
const collegeActionItems = [
  { title: 'View College Profile', action: 'view', icon: 'mdi-school' },
  { title: 'Compare with Others', action: 'compare', icon: 'mdi-compare' },
  { title: 'Save to Regular Decision', action: 'saveRegular', icon: 'mdi-bookmark-outline' },
  { title: 'Save to Early Decision', action: 'saveEarly', icon: 'mdi-bookmark' },
];

// Handle college selection to open admission chance modal
const selectCollege = (college) => {
  selectedCollege.value = college;
  admitChanceModalOpen.value = true;
};

// Close the admission chance modal
const closeAdmitChanceModal = () => {
  admitChanceModalOpen.value = false;
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
  top: 80px;
  align-self: start;
  height: calc(100vh - 80px);
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
</style>
