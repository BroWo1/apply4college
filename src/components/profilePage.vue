<template>
  <div class="profile-page">
    <section class="hero-section" aria-labelledby="hero-title">
      <div class="hero-content">
        <div class="hero-text-container">
          <h1 id="hero-title" class="hero-title">
            Your Profile
          </h1>
          <p class="hero-subtitle">
            Expand each section to edit your profile. Changes are saved automatically, or you can save manually.
          </p>
        </div>
        <div class="hero-decoration">
          <div class="floating-icons">
            <v-icon class="floating-icon icon-1">mdi-account-edit</v-icon>
            <v-icon class="floating-icon icon-2">mdi-chart-line</v-icon>
            <v-icon class="floating-icon icon-3">mdi-pencil</v-icon>
          </div>
        </div>
      </div>
    </section>

    <main class="main-content">
      <v-container fluid style="max-width: 1400px">
        <v-row>
          <v-col cols="12" md="6">
            <v-expansion-panels multiple variant="popout">
              <v-expansion-panel rounded="lg" class="mb-4" elevation="1">
                <v-expansion-panel-title class="text-h6 font-weight-regular">
                  <v-icon icon="mdi-chart-bar" class="mr-3"></v-icon>
                  Academic Profile
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="pt-2">
                    <!-- Academic Metrics Section -->
                    <div class="text-subtitle-1 mb-3">Academic Metrics</div>
                    <div class="text-body-1 pb-2">
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
                      color="primary"
                      class="mb-4"
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
                      color="primary"
                      class="mb-4"
                    ></v-slider>
                    <div class="text-body-1 pt-2 pb-1">
                      GPA ({{gpa}})
                    </div>
                    <v-slider
                      v-model="gpa"
                      :max="4.0"
                      :min="0.0"
                      :step="0.05"
                      thumb-label
                      color="primary"
                      class="mb-6"
                    ></v-slider>
                    
                    <v-divider class="my-6"></v-divider>
                    
                    <!-- Academic Focus Section -->
                    <div class="text-subtitle-1 mb-3">Academic Focus</div>
                    <div class="text-body-2 mb-3">Intended Major</div>
                    <v-radio-group
                      v-model="intendedMajor"
                      label="Select your major category"
                    >
                      <v-radio value="STEM" label="STEM (Science, Technology, Engineering, Math)"></v-radio>
                      <v-radio value="Liberal Arts" label="Liberal Arts & Humanities"></v-radio>
                    </v-radio-group>
                    <div v-if="intendedMajor" class="mt-2 text-caption">
                      {{ intendedMajor === 'STEM' ? 'STEM' : 'Liberal Arts' }} focus will help us calculate how well your AP courses and
                      extracurricular activities align with your academic goals, which impacts admission chances.
                    </div>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
              
              <v-expansion-panel rounded="lg" class="mb-4" elevation="1">
                 <v-expansion-panel-title class="text-h6 font-weight-regular">
                    <v-icon icon="mdi-account-details" class="mr-3"></v-icon>
                    Profile Factors
                 </v-expansion-panel-title>
                 <v-expansion-panel-text>
                  <div class="pt-2">
                    <div class="text-subtitle-1 mb-3">Additional Factors</div>
                    <div class="text-body-1 mb-2">Extra Materials (e.g. Recommendation Letter, Essay)</div>
                    <div class="d-flex justify-space-between mb-1">
                      <span class="text-caption">Expected strength (1-4)</span>
                      <span class="text-caption">
                        {{ recScore }} - {{ getRecDescription(recScore) }}
                      </span>
                    </div>
                    <v-slider
                      v-model="recScore"
                      :min="1"
                      :max="4"
                      :step="1"
                      thumb-label
                      :thumb-size="20"
                      color="primary"
                      class="mb-3"
                    ></v-slider>
                    
                    <v-divider class="my-6"></v-divider>

                    <div class="text-subtitle-1 mt-6 mb-3">Demographics</div>
                    <div class="text-body-1 mb-2">Nationality</div>
                    <v-select
                      v-model="nationality"
                      :items="nationalityOptions"
                      label="Select your nationality"
                      hide-details
                      class="mb-3"
                      variant="outlined"
                      density="compact"
                    ></v-select>
                    <div class="text-caption mb-4">
                      Some institutions have specific programs or considerations for international students.
                    </div>
                    <div class="text-body-1 mb-2">Gender</div>
                    <v-radio-group
                      v-model="gender"
                      class="mt-1 mb-2"
                      hide-details
                    >
                      <v-radio value="Male" label="Male"></v-radio>
                      <v-radio value="Female" label="Female"></v-radio>
                      <v-radio value="Non-binary" label="Non-binary"></v-radio>
                      <v-radio value="Prefer not to say" label="Prefer not to say"></v-radio>
                    </v-radio-group>
                    <div class="text-caption mb-6">
                      Some programs may consider gender balance in their admissions processes.
                    </div>
                    <v-sheet class="pa-3 mb-6" rounded="lg" color="grey-lighten-5">
                      <div class="d-flex align-center">
                        <div>
                          <div class="text-body-2 font-weight-medium">Diversity Factor Score: {{ demoScore.toFixed(2) }}</div>
                          <div class="text-caption">
                            Represents potential impact based on demographic factors.
                          </div>
                        </div>
                        <v-spacer></v-spacer>
                        <v-tooltip location="top">
                          <template v-slot:activator="{ props }">
                            <v-icon v-bind="props" icon="mdi-information-outline" size="small"></v-icon>
                          </template>
                          <span>Score is automatically calculated based on your nationality and gender selections.</span>
                        </v-tooltip>
                      </div>
                    </v-sheet>
                    
                    <v-divider class="my-6"></v-divider>

                    <div class="text-subtitle-1 mt-6 mb-3">Randomization</div>
                    <v-switch
                      v-model="enableBitterByCoffee"
                      label="Enable 'Bitter by Coffee' factor"
                      color="primary"
                      hide-details
                      class="mb-2"
                    ></v-switch>
                    <div class="text-caption mb-4">
                      Adds a random factor (0.75-1.25x) to simulate the unpredictable nature of college admissions.
                    </div>
                    <v-sheet v-if="enableBitterByCoffee" class="pa-3" rounded="lg" color="grey-lighten-5">
                      <div class="d-flex align-center">
                        <div>
                          <div class="text-body-2 font-weight-medium">Randomness Enabled</div>
                          <div class="text-caption">
                            A random factor will be applied to your admission chance calculations.
                          </div>
                        </div>
                        <v-spacer></v-spacer>
                        <v-tooltip location="top">
                          <template v-slot:activator="{ props }">
                            <v-icon v-bind="props" icon="mdi-coffee" size="small"></v-icon>
                          </template>
                          <span>Sometimes admissions is "bitter" or "sweet" like coffee - this factor simulates that unpredictability.</span>
                        </v-tooltip>
                      </div>
                    </v-sheet>
                  </div>
                 </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>

          <v-col cols="12" md="6">
            <v-expansion-panels multiple variant="popout">
              <v-expansion-panel rounded="lg" class="mb-4" elevation="1">
                <v-expansion-panel-title class="text-h6 font-weight-regular">
                  <v-icon icon="mdi-book-open-page-variant" class="mr-3"></v-icon>
                  AP Courses
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="pt-2">
                    <div v-if="apClasses.length === 0" class="text-center py-8 text-medium-emphasis">
                      <v-icon icon="mdi-book-outline" size="x-large" class="mb-2"></v-icon>
                      <div class="text-h6 font-weight-regular">No AP classes added</div>
                      <div class="text-caption">Add your AP classes to improve admission chances</div>
                    </div>
                    <v-list v-else class="bg-transparent">
                      <v-list-item v-for="(apClass, i) in apClasses" :key="i">
                        <template v-slot:prepend>
                          <v-chip :color="getApScoreColor(apClass.score)" size="small" class="mx-3" label>
                            {{ apClass.score }}
                          </v-chip>
                        </template>
                        <v-list-item-title>{{ apClass.name }}</v-list-item-title>
                        <template v-slot:append>
                          <v-btn icon="mdi-delete" size="small" variant="text" @click="removeApClass(i)"></v-btn>
                        </template>
                      </v-list-item>
                    </v-list>
                    <div class="text-center mt-4 pa-2">
                      <v-btn color="primary" @click="dialog = true" rounded="lg" block>
                        Add AP Class
                      </v-btn>
                    </div>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <v-expansion-panel rounded="lg" class="mb-4" elevation="1">
                <v-expansion-panel-title class="text-h6 font-weight-regular">
                  <v-icon icon="mdi-trophy" class="mr-3"></v-icon>
                  Extracurriculars
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="pt-2">
                    <div v-if="extracurriculars.length === 0" class="text-center py-8 text-medium-emphasis">
                      <v-icon icon="mdi-trophy-outline" size="x-large" class="mb-2"></v-icon>
                      <div class="text-h6 font-weight-regular">No activities added</div>
                      <div class="text-caption">Add activities to strengthen your profile</div>
                    </div>
                    <v-list v-else class="bg-transparent">
                      <v-list-item v-for="(activity, i) in extracurriculars" :key="i">
                        <template v-slot:prepend>
                          <v-chip :color="getActivityLevelColor(activity.level, activity.name)" size="small" class="mx-3" label>
                            {{ activity.level }}
                          </v-chip>
                        </template>
                        <v-list-item-title>{{ activity.name }}</v-list-item-title>
                        <template v-slot:append>
                          <v-btn icon="mdi-delete" size="small" variant="text" @click="removeActivity(i)"></v-btn>
                        </template>
                      </v-list-item>
                    </v-list>
                    <div class="text-center mt-4 pa-2">
                      <v-btn color="primary" @click="openActivityDialog" rounded="lg" block>
                        Add Activity
                      </v-btn>
                    </div>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
        
        <v-dialog v-model="dialog" max-width="400px">
          <v-card rounded="xl">
            <v-card-title class="text-h6 px-6 pt-4">Add AP Class</v-card-title>
            <v-card-text class="pa-6">
              <v-select
                v-model="newApClass"
                :items="apOptions"
                label="AP Class Name"
                hide-details
                class="mb-4"
                variant="outlined"
                density="compact"
              ></v-select>
              <v-select
                v-model="newApScore"
                label="Score"
                :items="['N/A', 1, 2, 3, 4, 5]"
                hide-details
                class="mb-3"
                variant="outlined"
                density="compact"
              ></v-select>
              <div class="text-caption mt-3">
                Status: {{ newApScore === "N/A" ? "ongoing" : "completed" }}
              </div>
              <div v-if="newApClass && intendedMajor" class="mt-4 text-caption">
                <v-chip size="small" :color="getApMajorMatchColor(newApClass)">
                  {{ getApMajorMatchText(newApClass) }}
                </v-chip>
                <span class="ml-2">match with {{ intendedMajor }}</span>
              </div>
            </v-card-text>
            <v-card-actions class="px-6 pb-4">
              <v-spacer></v-spacer>
              <v-btn color="grey-darken-1" variant="text" @click="dialog = false" rounded="lg">
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                variant="flat"
                @click="addApClassAndClose"
                :disabled="!newApClass"
                rounded="lg"
              >
                Add
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="activityDialog" max-width="400px">
          <v-card rounded="xl">
            <v-card-title class="text-h6 px-6 pt-4">Add Extracurricular Activity</v-card-title>
            <v-card-text class="pa-6">
              <v-select
                v-model="newActivity"
                :items="activityOptions"
                label="Activity Name"
                hide-details
                class="mb-4"
                variant="outlined"
                density="compact"
              ></v-select>
              <div class="mt-2">
                <div class="d-flex justify-space-between mb-1">
                  <span>Strength Rating</span>
                  <span class="text-caption">
                    {{ newActivityLevel }} - {{ getLevelDescription(newActivityLevel) }}
                  </span>
                </div>
                <v-slider
                  v-model="newActivityLevel"
                  :min="1"
                  :max="currentNewActivityMaxLevel"
                  :step="1"
                  thumb-label
                  :thumb-size="20"
                  color="primary"
                  hide-details
                ></v-slider>
              </div>
              <div v-if="newActivity && intendedMajor" class="mt-4 text-caption">
                <v-chip size="small" :color="getActivityMajorMatchColor(newActivity)">
                  {{ getActivityMajorMatchText(newActivity) }}
                </v-chip>
                <span class="ml-2">match with {{ intendedMajor }}</span>
              </div>
            </v-card-text>
            <v-card-actions class="px-6 pb-4">
              <v-spacer></v-spacer>
              <v-btn color="grey-darken-1" variant="text" @click="activityDialog = false" rounded="lg">
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                variant="flat"
                @click="addActivityAndClose"
                :disabled="!newActivity"
                rounded="lg"
              >
                Add
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-row class="my-8">
          <v-col cols="12" class="d-flex flex-column flex-md-row justify-center align-center">
            <v-btn
              color="primary"
              size="large"
              class="mx-md-2 my-2 my-md-0"
              @click="manualSaveUserProfile"
              :loading="loading"
              rounded="lg"
              variant="flat"
              min-width="220"
            >
              <v-icon start>mdi-content-save</v-icon>
              Save Profile
            </v-btn>
            <v-btn
              color="grey-darken-2"
              size="large"
              class="mx-md-2 my-2 my-md-0"
              to="/explore"
              rounded="lg"
              variant="outlined"
               min-width="220"
            >
              <v-icon start>mdi-arrow-left</v-icon>
              Back to Explorer
            </v-btn>
          </v-col>
        </v-row>
        <v-snackbar
          v-model="snackbar"
          :timeout="2500"
          :color="snackbarColor"
          location="top"
          rounded="lg"
        >
          {{ snackbarText }}
          <template v-slot:actions>
            <v-btn color="white" variant="text" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-container>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api';
import { majors, calculateFitScore, determineAPCourseCategory, determineActivityCategory } from '../utils/majorData';
import { getMajorMatchAssessment } from '../utils/admitChanceCalculator';
import { useUserStore } from '@/stores/user'; // Import user store

const router = useRouter();
const userStore = useUserStore(); // Initialize user store

// AP Classes data
const apOptions = [
  "AP Calculus AB", "AP Calculus BC", "AP Statistics", "AP Chemistry", "AP Biology",
  "AP Physics 1", "AP Physics 2", "AP Computer Science A", "AP Computer Science Principles",
  "AP English Language and Composition", "AP English Literature and Composition",
  "AP German Language and Culture", "AP Psychology", "AP US History", "AP World History",
  "AP Microeconomics", "AP Macroeconomics"
];

// Extracurricular Activities data
const activityOptions = [
  "Physics Competition", "Math Competition", "Writing Competition", "Student Council",
  "MUN", "STEM Research", "History Research", "STEM Club", "Website/App Development",
  "Community Service", "Science Club", "School Magazine", "Aerospace Club",
];

// Student profile data
const satReading = ref(500);
const satMath = ref(500);
const gpa = ref(3.0);
const apClasses = ref([]);
const extracurriculars = ref([]);
const intendedMajor = ref("");
const recScore = ref(2);
const isLegacy = ref(false);
const nationality = ref('United States');
const gender = ref('Prefer not to say');
const enableBitterByCoffee = ref(false);


// Snackbar
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success'); // Default color
const loading = ref(false); // For loading states (initial fetch and manual save)
const GUEST_PROFILE_KEY = 'guestProfileData';
const USER_PROFILE_KEY = 'userProfileData';
const PERSISTENT_PROFILE_KEY = 'persistentProfileData'; // New key for specific persistent data

// Computed demographic score
const demoScore = computed(() => {
  let scoreNationality = 0;
  let scoreGender = 0;
  if (nationality.value === 'China') scoreNationality = 0;
  else if (nationality.value === 'United States') scoreNationality = 0.5;
  else scoreNationality = 0.25;

  if (gender.value === 'Male') scoreGender = 0;
  else if (gender.value === 'Female') scoreGender = 0.25;
  else if (gender.value === 'Non-binary') scoreGender = 0.5;
  else scoreGender = 0;
  return Math.min(scoreNationality + scoreGender, 1.0);
});

const nationalityOptions = [
  'United States', 'China', 'Canada', 'Hong Kong','Australia','Other'
];

// AP Classes functionality
const newApClass = ref("");
const newApScore = ref("N/A");
const dialog = ref(false);

// Extracurricular Activities functionality
const newActivity = ref("");
const newActivityLevel = ref(2);
const activityDialog = ref(false);

const isSpecialActivityType = (activityName) => {
  if (!activityName) return false;
  const nameLower = activityName.toLowerCase();
  return nameLower.includes('research') || nameLower.includes('competition');
};

const currentNewActivityMaxLevel = computed(() => {
  return isSpecialActivityType(newActivity.value) ? 5 : 4;
});

watch(currentNewActivityMaxLevel, (newMax) => {
  if (newActivityLevel.value > newMax) {
    newActivityLevel.value = newMax;
  }
});

// Watch newActivity to reset level if type changes, or cap if already set
watch(newActivity, (val) => {
    // When activity changes, adjust level to be within new max, or default for new type
    const max = isSpecialActivityType(val) ? 5 : 4;
    if (newActivityLevel.value > max) {
        newActivityLevel.value = max;
    }
    // Optional: reset to a default like 2 if you prefer when type changes
    // else if (newActivityLevel.value < 1) newActivityLevel.value = 1;
}, { immediate: false });

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
    nationality: nationality.value,
    gender: gender.value,
    demoScore: demoScore.value,
    enableBitterByCoffee: enableBitterByCoffee.value
  };
});

// --- AUTO-SAVE LOGIC ---
const initialLoadComplete = ref(false);

// Definition for the debounce function
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

async function fetchUserProfileFromAPI() {
  if (!userStore.isAuthenticated) {
    // Should not be called if not authenticated, handled by loadProfile
    console.warn('fetchUserProfileFromAPI called while not authenticated');
    return false;
  }
  loading.value = true;
  try {
    const { data } = await api.get('profile/');
    satReading.value = data.sat_reading || 500;
    satMath.value = data.sat_math || 500;
    gpa.value = data.gpa || 3.0;
    // Ensure apClasses and extracurriculars are arrays even if API returns null/undefined
    apClasses.value = (data.ap_classes && Array.isArray(data.ap_classes)) ? data.ap_classes : [];
    extracurriculars.value = (data.extracurriculars && Array.isArray(data.extracurriculars)) ? data.extracurriculars : [];
    
    // Load intendedMajor from API and map to frontend values
    const apiMajor = data.intended_major || "";
    if (apiMajor === "LAH") {
      intendedMajor.value = "Liberal Arts";
    } else if (apiMajor === "STEM") {
      intendedMajor.value = "STEM";
    } else {
      intendedMajor.value = ""; // Default to empty if API value is unexpected
    }
    
    recScore.value = data.recommendation_strength || 2;
    isLegacy.value = data.is_legacy || false;
    // nationality.value = data.nationality || 'United States'; // Removed: Will be loaded from PERSISTENT_PROFILE_KEY
    // gender.value = data.gender || 'Prefer not to say'; // Removed: Will be loaded from PERSISTENT_PROFILE_KEY
    enableBitterByCoffee.value = data.enable_bitter_by_coffee || false; // Keep this as it's part of randomization, not demographics/major
    
    console.log('Profile data loaded successfully from API (excluding major/demographics managed locally)');
    // Update localStorage with the fetched data (for authenticated user) - this will not include the locally managed fields
    // However, studentProfile.value will still have them from persistent load, so USER_PROFILE_KEY will store them.
    // This is acceptable as USER_PROFILE_KEY acts as a full snapshot for authenticated users if API fails later.
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(studentProfile.value));
    return true;
  } catch (e) {
    console.error('Error fetching profile data from API:', e);
    snackbarText.value = e.response?.data?.detail || 'Failed to load profile from server. Using local data if available.';
    snackbarColor.value = 'error';
    snackbar.value = true;
    // Fallback to user-specific local storage if API fails for an authenticated user
    const localData = localStorage.getItem(USER_PROFILE_KEY);
    if (localData) {
      try {
        const profileData = JSON.parse(localData);
        applyProfileData(profileData); // Apply the full profile data
        console.log('Profile data loaded from USER_PROFILE_KEY as API fallback.');
        return true; // Indicate that data was loaded (from local fallback)
      } catch (parseError) {
        console.error('Error parsing local user profile data:', parseError);
        // If parsing USER_PROFILE_KEY fails, defaults will be set later or persistent data might cover some fields
      }
    }
    // If API failed and USER_PROFILE_KEY also failed or was empty, return false
    return false;
  } finally {
    loading.value = false;
  }
}

function loadGuestProfileFromLocalStorage() {
  loading.value = true;
  const savedData = localStorage.getItem(GUEST_PROFILE_KEY);
  if (savedData) {
    try {
      const profileData = JSON.parse(savedData);
      applyProfileData(profileData);
      console.log('Guest profile data loaded successfully from localStorage');
      // Snackbar for guest load can be shown here or suppressed if persistent load also shows one
      // snackbarText.value = 'Profile loaded locally (guest)';
      // snackbarColor.value = 'info';
      // snackbar.value = true;
    } catch (e) {
      console.error('Error parsing saved guest profile data from localStorage:', e);
      setDefaultProfileData(); // Reset to defaults if parsing fails
      snackbarText.value = 'Could not load local guest data. Using default profile.';
      snackbarColor.value = 'warning';
      snackbar.value = true;
    }
  } else {
    setDefaultProfileData(); // Set defaults if no guest data found
    console.log('No guest profile data found in localStorage. Using defaults.');
  }
  loading.value = false;
  // initialLoadComplete will be set in onMounted after persistent data is also processed
}

function applyProfileData(profileData) {
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
  // demoScore is computed, no need to set it here
}

function setDefaultProfileData() {
  satReading.value = 500;
  satMath.value = 500;
  gpa.value = 3.0;
  apClasses.value = [];
  extracurriculars.value = [];
  intendedMajor.value = "";
  recScore.value = 2;
  isLegacy.value = false;
  nationality.value = 'United States';
  gender.value = 'Prefer not to say';
  enableBitterByCoffee.value = false;
}

const performSaveOperation = async (isAutoSave = false) => {
  loading.value = true;
  try {
    // 1. Prepare the specific data to be always saved locally
    const persistentData = {
      apClasses: apClasses.value,
      extracurriculars: extracurriculars.value,
      intendedMajor: intendedMajor.value,
      nationality: nationality.value,
      gender: gender.value,
      enableBitterByCoffee: enableBitterByCoffee.value
    };
    // 2. Always save this persistent subset to its own local storage key
    localStorage.setItem(PERSISTENT_PROFILE_KEY, JSON.stringify(persistentData));
    console.log('Persisted specific profile data locally:', persistentData);

    // 3. Proceed with existing logic for API/Guest save for the *full* profile
    if (userStore.isAuthenticated) {
      const payload = {
        sat_reading: studentProfile.value.satReading,
        sat_math: studentProfile.value.satMath,
        gpa: studentProfile.value.gpa,
        ap_classes: studentProfile.value.apClasses, // Keep sending these as they are not exclusively local
        extracurriculars: studentProfile.value.extracurriculars, // Keep sending these
        // intended_major: studentProfile.value.intendedMajor, // Removed: Not sent to API
        recommendation_strength: studentProfile.value.recScore,
        is_legacy: studentProfile.value.isLegacy,
        // nationality: studentProfile.value.nationality, // Removed: Not sent to API
        // gender: studentProfile.value.gender, // Removed: Not sent to API
        enable_bitter_by_coffee: studentProfile.value.enableBitterByCoffee // Keep this as it's part of randomization
      };

      // Conditionally add intended_major if it has a non-empty value
      if (studentProfile.value.intendedMajor && studentProfile.value.intendedMajor !== "") {
        let majorApiValue = studentProfile.value.intendedMajor;
        
        // Map frontend display/partial values to backend enum keys
        if (majorApiValue === "Liberal Arts" || majorApiValue === "Liberal Arts & Humanities") {
          majorApiValue = "LAH";
        } else if (majorApiValue === "Science, Technology, Engineering, Math") {
          majorApiValue = "STEM";
        }
        // Add other mappings here if new Major choices are added to models.py
        // and the frontend uses different display strings for them.
        
        payload.intended_major = majorApiValue;
      }

      await api.put('profile/', payload);

      // USER_PROFILE_KEY will store the complete profile including locally managed fields.
      // This is for local fallback consistency for authenticated users.
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(studentProfile.value));
      if (!isAutoSave) {
        snackbarText.value = 'Profile saved successfully to server.';
        snackbarColor.value = 'success';
        snackbar.value = true;
      }
    } else {
      localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(studentProfile.value));
      if (!isAutoSave) {
        snackbarText.value = 'Profile saved locally.';
        snackbarColor.value = 'success';
        snackbar.value = true;
      }
    }

  } catch (e) {
    console.error('Error during save operation:', e);
    // The persistentData was already saved successfully before this catch block.
    if (userStore.isAuthenticated) { // This error is from the API call or USER_PROFILE_KEY save
      snackbarText.value = 'Failed to save full profile to server. Key settings are backed up locally.';
    } else { // This error is from GUEST_PROFILE_KEY save (should be rare if not API related)
      snackbarText.value = 'Failed to save full profile locally. Key settings may still be backed up.';
    }
    snackbarColor.value = 'error';
    snackbar.value = true;
  } finally {
    loading.value = false;
  }
};

const debouncedAutoSave = debounce(() => {
  if (initialLoadComplete.value) { // Ensure auto-save only runs after initial load
    console.log('Auto-saving profile data...');
    performSaveOperation(true); // Auto-save is now silent
  }
}, 2000); // Auto-save after 2 seconds of inactivity

// Manual save function
const manualSaveUserProfile = async () => {
  // Directly call the save operation without debounce
  await performSaveOperation(false);
};

// --- END AUTO-SAVE LOGIC ---

const getApScoreColor = (score) => {
  if (score === 5) return "success";
  if (score === 4) return "info";
  if (score === 3) return "warning";
  if (score === "N/A") return "grey";
  return "error";
};

const addApClassAndClose = () => {
  if (newApClass.value) {
    const existingClass = apClasses.value.find(apClass => apClass.name === newApClass.value);
    if (existingClass) {
      snackbarText.value = `AP Class "${newApClass.value}" already added.`;
      snackbarColor.value = 'warning'; // Yellow for warning
      snackbar.value = true;
      // newApClass.value = ""; // Optionally reset
      // newApScore.value = "N/A";
      dialog.value = false; // Close dialog even on error
      return;
    }

    let fitScore = 0;
    if (intendedMajor.value) {
      fitScore = calculateFitScore(newApClass.value, 'ap', intendedMajor.value);
    }
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
  dialog.value = false;
};

const removeApClass = (index) => {
  apClasses.value.splice(index, 1);
};

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

const addActivityAndClose = () => {
  if (newActivity.value) {
    // Optional: Check for duplicate activity
    // const existingActivity = extracurriculars.value.find(act => act.name === newActivity.value);
    // if (existingActivity) {
    //   snackbarText.value = `Activity "${newActivity.value}" already added.`;
    //   snackbarColor.value = 'warning';
    //   snackbar.value = true;
    //   activityDialog.value = false;
    //   return;
    // }
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
  activityDialog.value = false;
};

const removeActivity = (index) => {
  extracurriculars.value.splice(index, 1);
};

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

const getActivityLevelColor = (level, activityName = "") => {
  const special = isSpecialActivityType(activityName);
  if (special) { // Max 5 for special types
    if (level === 5) return "success";
    if (level === 4) return "info";
    if (level === 3) return "warning";
    if (level === 2) return "grey-darken-1";
    return "grey"; // Level 1
  } else { // Max 4 for normal types
    if (level === 4) return "success";
    if (level === 3) return "info";
    if (level === 2) return "warning";
    return "grey"; // Level 1
  }
};

const getLevelDescription = (level) => {
  // Descriptions are now universal up to 5; slider max controls availability of level 5
  const levelDescriptions = {
    1: 'Average / Participation',
    2: 'Somewhat Strong / Notable Achievement',
    3: 'Strong / Significant Award',
    4: 'Very Strong / High Distinction',
    5: 'Exceptional / Top Tier'
  };
  return levelDescriptions[level] || '';
};

const getRecDescription = (score) => {
  const descriptions = { 
    1: 'Basic', 
    2: 'Decent', 
    3: 'Strong', 
    4: 'Very Strong', 
    5: 'Outstanding' 
  };
  return descriptions[score] || '';
};

const openActivityDialog = () => {
  activityDialog.value = true;
};

onMounted(async () => {
  let mainProfileSourceLoaded = false;

  // Step 1: Load the main profile (full data)
  if (userStore.isAuthenticated) {
    const loadedSuccessfully = await fetchUserProfileFromAPI();
    if (loadedSuccessfully) {
      mainProfileSourceLoaded = true;
    } else {
      // fetchUserProfileFromAPI already tries USER_PROFILE_KEY. If it returned false,
      // it means API failed AND USER_PROFILE_KEY was not found or failed to parse.
      // In this scenario, applyProfileData wasn't called with valid data from these primary sources.
      // We will set defaults, then persistent data will override specific fields.
      console.log('Authenticated user: API and USER_PROFILE_KEY failed. Setting defaults before persistent load.');
      setDefaultProfileData();
    }
  } else {
    // For guest users, loadGuestProfileFromLocalStorage handles GUEST_PROFILE_KEY or sets defaults.
    loadGuestProfileFromLocalStorage();
    mainProfileSourceLoaded = true; // loadGuestProfileFromLocalStorage always sets some state (loaded or default)
  }

  // Step 2: Load and apply data from PERSISTENT_PROFILE_KEY for specified fields,
  // overriding values for these specific fields that might have been loaded from the main profile sources or defaults.
  const persistentDataString = localStorage.getItem(PERSISTENT_PROFILE_KEY);
  if (persistentDataString) {
    try {
      const persistentProfileData = JSON.parse(persistentDataString);
      console.log('Applying persistent local data over current state:', persistentProfileData);
      
      if (persistentProfileData.hasOwnProperty('apClasses') && Array.isArray(persistentProfileData.apClasses)) {
        apClasses.value = persistentProfileData.apClasses;
      }
      if (persistentProfileData.hasOwnProperty('extracurriculars') && Array.isArray(persistentProfileData.extracurriculars)) {
        extracurriculars.value = persistentProfileData.extracurriculars;
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
      
      // Optionally, provide feedback that persistent data was applied.
      // This might be too frequent if shown every time.
      // if (mainProfileSourceLoaded && !snackbar.value) { // Avoid overriding other snackbars
      //   snackbarText.value = 'Applied locally stored preferences for key settings.';
      //   snackbarColor.value = 'info';
      //   snackbar.value = true;
      // }

    } catch (e) {
      console.error('Error parsing or applying persistent profile data from localStorage:', e);
      // If persistent data is corrupt, the values from main load (or defaults) will remain.
    }
  }

  // Initial load is complete after all attempts to load/apply data.
  // nextTick ensures Vue has processed DOM updates from data changes before setting initialLoadComplete.
  nextTick(() => {
    initialLoadComplete.value = true;
    console.log('Initial load sequence complete. Auto-save monitoring active.');
  });
});
</script>

<style scoped>
.profile-page {
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
  margin: 0 auto;
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
  padding-top: 2rem;
  position: relative;
  z-index: 1;
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
:deep(.v-expansion-panel) {
  background-color: white;
}
:deep(.v-expansion-panels) {
  background-color: transparent !important;
}

:deep(.v-btn) {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
}
</style>