<template>
  <v-container fluid style="max-width: 1200px">
    <!-- Header -->
    <v-row class="text-center py-6">
      <v-col cols="12">
        <h1 class="text-h2 font-weight-bold mb-6 pt-5">Your Profile</h1>
        <p class="text-body-1 mb-6">
          Complete your profile to get personalized college recommendations and accurate admission chances.
        </p>
      </v-col>
    </v-row>

    <v-row>
      <!-- Left Column - Basic Info -->
      <v-col cols="12" md="6">
        <v-card class="pa-4 mb-4" rounded="lg">
          <v-card-title class="text-h5">
            <v-icon icon="mdi-account" class="mr-2"></v-icon>
            Basic Information
          </v-card-title>
          <v-divider class="my-3"></v-divider>

          <!-- Standardized Score Section -->
          <div class="text-h6 mb-3">Standardized Scores</div>

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
          <div class="text-body-1 pt-2 pb-1">
            GPA ({{gpa}})
          </div>
          <v-slider
            v-model="gpa"
            :max="4.0"
            :min="0.0"
            :step="0.1"
            thumb-label
          ></v-slider>

          <!-- Intended Major Section -->
          <div class="text-h6 mt-6 mb-3">Intended Major</div>
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

          <!-- Additional Factors Section -->
          <div class="text-h6 mt-6 mb-3">Additional Factors</div>

          <div class="text-body-1 mb-2">Recommendation Letters</div>
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

          <div class="text-h6 mt-6 mb-3">Demographics</div>

          <!-- Nationality Section -->
          <div class="text-body-1 mb-2">Nationality</div>
          <v-select
            v-model="nationality"
            :items="nationalityOptions"
            label="Select your nationality"
            hide-details
            class="mb-3"
          ></v-select>
          <div class="text-caption mb-4">
            Some institutions have specific programs or considerations for international students.
          </div>

          <!-- Gender Section -->
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
          <div class="text-caption mb-3">
            Some programs may consider gender balance in their admissions processes.
          </div>

          <!-- Demographic Score Display -->
          <v-sheet class="pa-3 mb-6 rounded bg-surface-variant">
            <div class="d-flex align-center">
              <div>
                <div class="text-body-2 font-weight-medium">Diversity Factor Score: {{ demoScore.toFixed(2) }}</div>
                <div class="text-caption">
                  This represents potential impact on admissions based on demographic factors.
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
          <!-- Inside the v-card containing Basic Information -->
          <!-- After the Demographics section and before the end of the card -->

          <div class="text-h6 mt-6 mb-3">Randomization</div>

          <v-switch
            v-model="enableBitterByCoffee"
            label="Enable 'Bitter by Coffee' factor"
            color="primary"
            hide-details
            class="mb-2"
          ></v-switch>

          <div class="text-caption mb-4">
            Adds a random factor (0.75-1.25x) to your admission chances to simulate the unpredictable nature of college admissions.
          </div>

          <v-sheet v-if="enableBitterByCoffee" class="pa-3 mb-6 rounded bg-surface-variant">
            <div class="d-flex align-center">
              <div>
                <div class="text-body-2 font-weight-medium">Randomness Enabled</div>
                <div class="text-caption">
                  Each time your chances are calculated, a random "Bitter by Coffee" factor between 0.75x and 1.25x will be applied.
                  This reflects the inherent unpredictability in admissions decisions.
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
        </v-card>
      </v-col>

      <!-- Right Column - Courses & Activities -->
      <v-col cols="12" md="6">
        <!-- AP Courses Panel -->
        <v-card class="pa-4 mb-4" rounded="lg">
          <v-card-title class="text-h5">
            <v-icon icon="mdi-book-open-page-variant" class="mr-2"></v-icon>
            AP Courses
          </v-card-title>
          <v-divider class="my-3"></v-divider>

          <div v-if="apClasses.length === 0" class="text-center py-6 text-medium-emphasis">
            <v-icon icon="mdi-book-outline" size="large" class="mb-2"></v-icon>
            <div>No AP classes added yet</div>
            <div class="text-caption">Add your AP classes to improve admission chances</div>
          </div>

          <v-list v-else>
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

          <div class="text-center mt-4">
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
        </v-card>

        <!-- Extracurricular Panel -->
        <v-card class="pa-4 mb-4" rounded="lg">
          <v-card-title class="text-h5">
            <v-icon icon="mdi-trophy" class="mr-2"></v-icon>
            Extracurricular Activities
          </v-card-title>
          <v-divider class="my-3"></v-divider>

          <div v-if="extracurriculars.length === 0" class="text-center py-6 text-medium-emphasis">
            <v-icon icon="mdi-trophy-outline" size="large" class="mb-2"></v-icon>
            <div>No extracurricular activities added yet</div>
            <div class="text-caption">Add activities to strengthen your profile</div>
          </div>

          <v-list v-else>
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

          <div class="text-center mt-4">
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
        </v-card>
      </v-col>
    </v-row>

    <!-- Save and Navigation Buttons -->
    <v-row class="my-4">
      <v-col cols="12" class="d-flex justify-center">
        <v-btn
          color="primary"
          size="large"
          class="mx-2"
          @click="saveUserProfile"
          :loading="loading"
        >
          Save Profile
        </v-btn>
        <v-btn
          color="secondary"
          size="large"
          class="mx-2"
          to="/explore"
        >
          Back to College Explorer
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { majors, calculateFitScore, determineAPCourseCategory, determineActivityCategory } from '../utils/majorData';
import { getMajorMatchAssessment } from '../utils/admitChanceCalculator';

const router = useRouter();

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

// Student profile data
const satReading = ref(500);
const satMath = ref(500);
const gpa = ref(3.0);
const apClasses = ref([]);
const extracurriculars = ref([]);
const intendedMajor = ref("");
const recScore = ref(2);
const isLegacy = ref(false);
// Demographics data
const nationality = ref('United States');
const gender = ref('Prefer not to say');

// Computed demographic score based on nationality and gender
const demoScore = computed(() => {
  let scoreNationality = 0;
  let scoreGender = 0;

  // Nationality score calculation
  if (nationality.value === 'China') {
    scoreNationality = 0;
  } else if (nationality.value === 'United States') {
    scoreNationality = 0.5;
  } else {
    scoreNationality = 0.25;
  }

  // Gender score calculation
  if (gender.value === 'Male') {
    scoreGender = 0;
  } else if (gender.value === 'Female') {
    scoreGender = 0.25;
  } else if (gender.value === 'Non-binary') {
    scoreGender = 0.5;
  } else {
    // "Prefer not to say" - default to 0
    scoreGender = 0;
  }

  // Total score (capped at 1.0 for the maximum possible advantage)
  return Math.min(scoreNationality + scoreGender, 1.0);
});

// Nationality options
const nationalityOptions = [
  'United States',
  'China',
  'Canada',
  'United Kingdom',
  'India',
  'South Korea',
  'Japan',
  'Germany',
  'France',
  'Australia',
  'Brazil',
  'Other'
];

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

// Add this with the other ref declarations at the top of the script
const enableBitterByCoffee = ref(false);

// Update the computed student profile to include the new property
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

// Update the saveUserProfile function to include the new property
const loading = ref(false);

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

    // Demographics
    nationality: nationality.value,
    gender: gender.value,
    demoScore: demoScore.value,

    // Bitter by Coffee randomization
    enableBitterByCoffee: enableBitterByCoffee.value
  };

  // Save to localStorage
  localStorage.setItem('userProfileData', JSON.stringify(profileData));
  console.log('Profile data saved:', profileData);

  setTimeout(() => {
    loading.value = false;
    // Optional: Navigate back to explore page or show success message
  }, 500);
};

// Update the onMounted function to load the new property
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

      // Load demographics
      if (profileData.nationality) {
        nationality.value = profileData.nationality;
      }
      if (profileData.gender) {
        gender.value = profileData.gender;
      }

      // Load Bitter by Coffee setting
      enableBitterByCoffee.value = profileData.enableBitterByCoffee || false;

      console.log('Profile data loaded successfully');
    } catch (e) {
      console.error('Error parsing saved profile data:', e);
    }
  }
});

</script>

<style scoped>
.v-card {
  transition: all 0.3s;
}
</style>
