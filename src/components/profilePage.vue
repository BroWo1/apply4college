<template>
  <v-container fluid style="max-width: 1500px">
    <v-row class="text-center py-6">
      <v-col cols="12">
        <h1 class="text-h2 font-weight-bold mb-6 pt-5">{{ $t('profilePage.title') }}</h1>
        <p class="text-body-1 mb-6">
          {{ $t('profilePage.subtitle') }}
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4 mb-4" rounded="lg">
          <v-card-title class="text-h5">
            <v-icon icon="mdi-account" class="mr-2"></v-icon>
            {{ $t('profilePage.basicInfo') }}
          </v-card-title>
          <v-divider class="my-3"></v-divider>

          <div class="text-h6 mb-3">{{ $t('profilePage.standardizedScores') }}</div>

          <div class="text-body-1 pb-2">
            SAT ({{satReading + satMath}})
          </div>
          <div class="text-body-2">
            {{ $t('profilePage.satReading') }} ({{satReading}})
          </div>
          <v-slider
            v-model="satReading"
            :max="800"
            :min="200"
            :step="10"
            thumb-label
          ></v-slider>
          <div class="text-body-2">
            {{ $t('profilePage.satMath') }} ({{satMath}})
          </div>
          <v-slider
            v-model="satMath"
            :max="800"
            :min="200"
            :step="10"
            thumb-label
          ></v-slider>
          <div class="text-body-1 pt-2 pb-1">
            {{ $t('profilePage.gpa') }} ({{gpa}})
          </div>
          <v-slider
            v-model="gpa"
            :max="4.0"
            :min="0.0"
            :step="0.05"
            thumb-label
          ></v-slider>

          <div class="text-h6 mt-6 mb-3">{{ $t('profilePage.intendedMajor') }}</div>
          <v-radio-group
            v-model="intendedMajor"
            :label="$t('profilePage.selectMajor')"
          >
            <v-radio value="STEM" :label="$t('profilePage.stem')"></v-radio>
            <v-radio value="Liberal Arts" :label="$t('profilePage.liberalArts')"></v-radio>
          </v-radio-group>
          <div v-if="intendedMajor" class="mt-2 text-caption">
            {{ intendedMajor === 'STEM' ? $t('profilePage.stemFocus') : $t('profilePage.artsHumanitiesFocus') }}
          </div>

          <div class="text-h6 mt-6 mb-3">{{ $t('profilePage.additionalFactors') }}</div>

          <div class="text-body-1 mb-2">{{ $t('profilePage.recommendationLetters') }}</div>
          <div class="d-flex justify-space-between mb-1">
            <span class="text-caption">{{ $t('profilePage.recStrength') }}</span>
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
          
          <div class="text-body-1 mb-2">Course Rigor</div>
          <div class="d-flex justify-space-between mb-1">
            <span class="text-caption">Overall difficulty of your high school classes</span>
            <span class="text-caption">
              {{ courseRigor }} - {{ getCourseRigorDescription(courseRigor) }}
            </span>
          </div>
          <v-slider
            v-model="courseRigor"
            :min="1"
            :max="5"
            :step="1"
            thumb-label
            :thumb-size="20"
            color="primary"
            class="mb-3"
          >
            <template v-slot:thumb-label="{ modelValue }">
              {{ getCourseRigorDescription(modelValue) }}
            </template>
          </v-slider>
          <div class="text-caption mb-4">
            Rate your overall course difficulty - whether you took standard, honors, or advanced courses beyond AP classes.
          </div>
          
          <div class="text-body-1 mb-2">Essay Quality (Self-Assessed)</div>
          <div class="d-flex justify-space-between mb-1">
            <span class="text-caption">Estimated quality of your application essays</span>
            <span class="text-caption">
              {{ essayScore }} - {{ getEssayDescription(essayScore) }}
            </span>
          </div>
          <v-slider
            v-model="essayScore"
            :min="1"
            :max="5"
            :step="1"
            thumb-label
            :thumb-size="20"
            color="primary"
            class="mb-3"
          >
            <template v-slot:thumb-label="{ modelValue }">
              {{ getEssayDescription(modelValue) }}
            </template>
          </v-slider>
          <div class="text-caption mb-4">
            This is your self-assessment of your essays. Consider feedback from teachers/counselors.
          </div>
          
          <div class="text-body-1 mb-2">Interview Performance (Optional)</div>
          <div class="d-flex justify-space-between mb-1">
            <span class="text-caption">Performance in college interviews</span>
            <span class="text-caption">
              {{ interviewScore === 0 ? 'N/A' : `${interviewScore} - ${getInterviewDescription(interviewScore)}` }}
            </span>
          </div>
          <v-slider
            v-model="interviewScore"
            :min="0"
            :max="5"
            :step="1"
            thumb-label
            :thumb-size="20"
            color="primary"
            class="mb-3"
          >
            <template v-slot:thumb-label="{ modelValue }">
              {{ modelValue === 0 ? 'N/A' : getInterviewDescription(modelValue) }}
            </template>
          </v-slider>
          <div class="text-caption mb-4">
            If you've had college interviews, rate your estimated performance. Leave at N/A if not applicable.
          </div>

          <div class="text-h6 mt-6 mb-3">{{ $t('profilePage.demographics') }}</div>
          
          <div class="text-body-1 mb-2">Geographic Region</div>
          <v-select
            v-model="region"
            :items="regionOptions"
            label="Select your geographic region"
            hide-details
            class="mb-3"
          ></v-select>
          <div class="text-caption mb-4">
            Your geographic location can impact your admissions chances differently at various schools.
          </div>

          <div class="text-body-1 mb-2">{{ $t('profilePage.nationality') }}</div>
          <v-select
            v-model="nationality"
            :items="nationalityOptions"
            :label="$t('profilePage.nationality')"
            hide-details
            class="mb-3"
          ></v-select>
          <div class="text-caption mb-4">
            {{ $t('profilePage.nationalityHelp') }}
          </div>
          
          <div class="text-body-1 mb-2">Demonstrated Interest</div>
          <v-switch
            v-model="hasDemonstratedInterest"
            label="I have demonstrated interest to my target colleges"
            color="primary"
            hide-details
            class="mb-2"
          ></v-switch>
          <div class="text-caption mb-4">
            Demonstrated interest includes campus visits, attending info sessions, early applications, specific supplemental essays, etc.
          </div>

          <div class="text-body-1 mb-2">{{ $t('profilePage.gender') }}</div>
          <v-radio-group
            v-model="gender"
            class="mt-1 mb-2"
            hide-details
          >
            <v-radio value="Male" :label="$t('profilePage.male')"></v-radio>
            <v-radio value="Female" :label="$t('profilePage.female')"></v-radio>
            <v-radio value="Non-binary" :label="$t('profilePage.nonBinary')"></v-radio>
            <v-radio value="Prefer not to say" :label="$t('profilePage.preferNotToSay')"></v-radio>
          </v-radio-group>
          <div class="text-caption mb-3">
            {{ $t('profilePage.genderHelp') }}
          </div>

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

      <v-col cols="12" md="6">
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
                <v-chip :color="getActivityLevelColor(activity.level, activity.name)" size="small" class="mx-3">
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
                    :max="currentNewActivityMaxLevel"
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

    <v-row class="my-4">
      <v-col cols="12" class="d-flex flex-column flex-md-row justify-center align-center">
        <v-btn
          color="primary"
          size="large"
          class="mx-md-2 my-2 my-md-0"
          @click="manualSaveUserProfile"
          :loading="loading"
        >
          Save Profile
        </v-btn>
        <v-btn
          color="secondary"
          size="large"
          class="mx-md-2 my-2 my-md-0"
          to="/explore"
        >
          Back to College Explorer
        </v-btn>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="snackbar"
      :timeout="2000"
      :color="snackbarColor"
      location="top"
    >
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import AuthModal from '@/components/AuthModal.vue';
import api from '@/api';
import { useI18n } from 'vue-i18n';
import { majors, calculateFitScore, determineAPCourseCategory, determineActivityCategory } from '../utils/majorData';
import { getMajorMatchAssessment } from '../utils/admitChanceCalculator';

const router = useRouter();
const userStore = useUserStore();
const { t } = useI18n();

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
const satReading = ref(600);
const satMath = ref(620);
const gpa = ref(3.8);
const apClasses = ref([]);
const extracurriculars = ref([]);
const intendedMajor = ref('STEM');
const recScore = ref(2);
const isLegacy = ref(false);
const nationality = ref('Domestic');
const gender = ref('Prefer not to say');
const enableBitterByCoffee = ref(false);

// New data points
const courseRigor = ref(3);
const essayScore = ref(3);
const interviewScore = ref(0);
const region = ref('');
const hasDemonstratedInterest = ref(false);

// Snackbar
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success'); // Default color
const loading = ref(false); // For the manual save button's loading state

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
  'United States', 'China', 'Canada', 'United Kingdom', 'India', 'South Korea',
  'Japan', 'Germany', 'France', 'Australia', 'Brazil', 'Other'
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
    enableBitterByCoffee: enableBitterByCoffee.value,
    courseRigor: courseRigor.value,
    essayScore: essayScore.value,
    interviewScore: interviewScore.value,
    region: region.value,
    hasDemonstratedInterest: hasDemonstratedInterest.value
  };
});

// --- AUTO-SAVE LOGIC ---
const initialLoadComplete = ref(false);

function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

const performSaveOperation = (isAutoSave = false) => {
  const profileData = {
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
    enableBitterByCoffee: enableBitterByCoffee.value,
    courseRigor: courseRigor.value,
    essayScore: essayScore.value,
    interviewScore: interviewScore.value,
    region: region.value,
    hasDemonstratedInterest: hasDemonstratedInterest.value
  };

  localStorage.setItem('userProfileData', JSON.stringify(profileData));
  console.log(isAutoSave ? 'Profile auto-saved:' : 'Profile saved manually:', profileData);

  snackbarText.value = isAutoSave ? 'Profile auto-saved!' : 'Profile saved!';
  snackbarColor.value = 'success'; // Green for successful save
  snackbar.value = true;
};

const debouncedAutoSave = debounce(() => {
  performSaveOperation(true);
}, 2000); // Auto-save after 2 seconds of inactivity

watch(
  studentProfile,
  (newValue, oldValue) => {
    if (initialLoadComplete.value) {
      // If the watcher fires after initial load, assume a relevant change.
      // Vue's deep watcher should ensure it fires on actual data changes within studentProfile.
      // The previous JSON.stringify comparison might have been too restrictive for array mutations.
      console.log('Profile data changed (watcher fired), queuing auto-save...');
      debouncedAutoSave();
    }
  },
  { deep: true }
);

const manualSaveUserProfile = () => {
  loading.value = true;
  performSaveOperation(false);
  setTimeout(() => {
    loading.value = false;
  }, 500);
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
  switch (score) {
    case 1:
      return t('profilePage.recAverage');
    case 2:
      return t('profilePage.recGood');
    case 3:
      return t('profilePage.recExcellent');
    default:
      return '';
  }
};

const openActivityDialog = () => {
  activityDialog.value = true;
};

// New description methods
const getCourseRigorDescription = (score) => {
  switch (score) {
    case 1: return 'Basic';
    case 2: return 'Standard';
    case 3: return 'Good';
    case 4: return 'Strong';
    case 5: return 'Exceptional';
    default: return 'Not rated';
  }
};

const getEssayDescription = (score) => {
  switch (score) {
    case 1: return 'Basic';
    case 2: return 'Decent';
    case 3: return 'Good';
    case 4: return 'Strong';
    case 5: return 'Outstanding';
    default: return 'Not rated';
  }
};

const getInterviewDescription = (score) => {
  switch (score) {
    case 0: return 'N/A';
    case 1: return 'Poor';
    case 2: return 'Average';
    case 3: return 'Good';
    case 4: return 'Great';
    case 5: return 'Exceptional';
    default: return 'Not rated';
  }
};

// New geographic region options
const regionOptions = [
  { title: 'Not Specified', value: '' },
  { title: 'Northeast', value: 'Northeast' },
  { title: 'Midwest', value: 'Midwest' },
  { title: 'South', value: 'South' },
  { title: 'West', value: 'West' },
  { title: 'International', value: 'International' }
];

onMounted(() => {
  const savedData = localStorage.getItem('userProfileData');
  if (savedData) {
    try {
      const profileData = JSON.parse(savedData);
      satReading.value = profileData.satReading || 600;
      satMath.value = profileData.satMath || 620;
      gpa.value = profileData.gpa || 3.8;
      if (profileData.apClasses && Array.isArray(profileData.apClasses)) {
        apClasses.value = profileData.apClasses;
      }
      if (profileData.extracurriculars && Array.isArray(profileData.extracurriculars)) {
        extracurriculars.value = profileData.extracurriculars;
      }
      intendedMajor.value = profileData.intendedMajor || 'STEM';
      recScore.value = profileData.recScore || 2;
      isLegacy.value = profileData.isLegacy || false; // Ensure isLegacy is loaded
      if (profileData.nationality) nationality.value = profileData.nationality;
      if (profileData.gender) gender.value = profileData.gender;
      enableBitterByCoffee.value = profileData.enableBitterByCoffee || false;
      courseRigor.value = profileData.courseRigor || 3;
      essayScore.value = profileData.essayScore || 3;
      interviewScore.value = profileData.interviewScore || 0;
      region.value = profileData.region || '';
      hasDemonstratedInterest.value = profileData.hasDemonstratedInterest || false;
      console.log('Profile data loaded successfully');
    } catch (e) {
      console.error('Error parsing saved profile data:', e);
    }
  }
  nextTick(() => {
    initialLoadComplete.value = true;
    console.log('Initial load complete. Auto-save enabled.');
  });
});

</script>

<style scoped>
.v-card {
  transition: all 0.3s;
}

</style>
