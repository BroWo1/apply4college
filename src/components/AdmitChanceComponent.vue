<template>
  <v-dialog v-model="dialog" max-width="750px">
    <v-card
      class="pa-4"
      rounded="lg"
      :elevation="4"
      v-if="collegeChance"
    >
      <!-- College Header with Image and Name -->
      <v-card-title class="d-flex align-center pa-0 mb-4">
        <div class="d-flex align-center flex-grow-1">
          <v-img
            v-if="props.college.image"
            :src="props.college.image"
            height="80"
            width="80"
            class="mr-4 rounded-lg"
            cover
          />
          <div class="flex-grow-1">
            <h2 class="text-h5 font-weight-bold mb-1">{{ props.college.name }}</h2>
            <p class="text-subtitle-1 text-medium-emphasis mb-1">{{ props.college.location }}</p>
            <v-chip 
              :color="getAcceptanceRateColor(props.college.acceptanceRate)"
              variant="tonal"
              size="small"
              class="mr-2"
            >
              {{ props.college.acceptanceRate }}% acceptance rate
            </v-chip>
            <v-chip 
              :color="getCollegeTypeColor(props.college.collegeType)"
              variant="tonal"
              size="small"
            >
              {{ props.college.collegeType }}
            </v-chip>
          </div>
        </div>
        <div class="d-flex align-center">
          <v-btn 
            icon="mdi-open-in-new" 
            variant="text" 
            @click="viewCollegeDetails"
            title="View college details page"
            class="mr-2"
          />
          <v-btn icon="mdi-close" variant="text" @click="closeDialog"></v-btn>
        </div>
      </v-card-title>

      <v-divider class="mb-4" />

      <v-card-subtitle class="pa-0 mb-3">
        <span class="text-h6 font-weight-bold">Admission Chance Calculator</span>
      </v-card-subtitle>

      <v-card-text>
        <v-row class="mb-4">
          <v-col cols="12">
            <v-card variant="outlined" class="pa-3">
              <div class="d-flex align-center justify-space-around">
                <div class="d-flex align-center" v-if="props.college.allowsEarlyDecision">
                  <div class="me-3">
                    <div class="text-subtitle-2">Early Decision</div>
                    <div class="text-caption">Increases chances</div>
                  </div>
                  <v-switch
                    v-model="localIsEarlyDecision"
                    color="primary"
                    hide-details
                    density="compact"
                    @change="recalculateChance"
                    :disabled="!props.college.allowsEarlyDecision"
                  ></v-switch>
                </div>
                <div v-else class="d-flex align-center">
                  <div class="me-3">
                    <div class="text-subtitle-2">Early Decision</div>
                    <div class="text-caption text-disabled">Not offered</div>
                  </div>
                  <v-switch
                    :model-value="false"
                    color="primary"
                    hide-details
                    density="compact"
                    disabled
                  ></v-switch>
                </div>

                <v-divider vertical class="mx-4"></v-divider>

                <div class="d-flex align-center" v-if="props.college.considersLegacy">
                  <div class="me-3">
                    <div class="text-subtitle-2">Legacy Status</div>
                    <div class="text-caption">Family attended</div>
                  </div>
                  <v-switch
                    v-model="localIsLegacy"
                    color="primary"
                    hide-details
                    density="compact"
                    @change="recalculateChance"
                    :disabled="!props.college.considersLegacy"
                  ></v-switch>
                </div>
                <div v-else class="d-flex align-center">
                  <div class="me-3">
                    <div class="text-subtitle-2">Legacy Status</div>
                    <div class="text-caption text-disabled">Not considered</div>
                  </div>
                  <v-switch
                    :model-value="false"
                    color="primary"
                    hide-details
                    density="compact"
                    disabled
                  ></v-switch>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="6">
            <div class="d-flex flex-column align-center justify-center">
              <v-progress-circular
                :model-value="collegeChance?.probabilityPercentage || 0"
                :color="chanceColor"
                :size="120"
                :width="12"
                class="mb-2"
              >
                {{ collegeChance?.probabilityPercentage || 0 }}%
              </v-progress-circular>
              <div class="text-h6 font-weight-bold">{{ chanceDescription }}</div>
              <div class="text-body-2 text-center">
                {{ timesAverage }} times the average applicant
              </div>
            </div>
          </v-col>
          <v-col cols="12" sm="6">

            <v-list density="compact">
              <v-list-subheader>Your Profile Strengths</v-list-subheader>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon :color="getZScoreColor(collegeChance.zScores.gpa)" class="mr-2">
                    mdi-school
                  </v-icon>
                </template>
                <v-list-item-title>GPA</v-list-item-title>
                <template v-slot:append>
                  <v-chip :color="getZScoreColor(collegeChance.zScores.gpa)" size="small">
                    {{ formatZScore(collegeChance.zScores.gpa) }}σ
                  </v-chip>
                </template>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon :color="getZScoreColor(collegeChance.zScores.sat)" class="mr-2">
                    mdi-book-open-variant
                  </v-icon>
                </template>
                <v-list-item-title>SAT</v-list-item-title>
                <template v-slot:append>
                  <v-chip :color="getZScoreColor(collegeChance.zScores.sat)" size="small">
                    {{ formatZScore(collegeChance.zScores.sat) }}σ
                  </v-chip>
                </template>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon :color="getZScoreColor(collegeChance.zScores.ap)" class="mr-2">
                    mdi-certificate
                  </v-icon>
                </template>
                <v-list-item-title>AP Courses</v-list-item-title>
                <template v-slot:append>
                  <v-chip :color="getZScoreColor(collegeChance.zScores.ap)" size="small">
                    {{ formatZScore(collegeChance.zScores.ap) }}σ
                  </v-chip>
                </template>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon :color="getZScoreColor(collegeChance.zScores.ec)" class="mr-2">
                    mdi-account-group
                  </v-icon>
                </template>
                <v-list-item-title>Extracurriculars</v-list-item-title>
                <template v-slot:append>
                  <v-chip :color="getZScoreColor(collegeChance.zScores.ec)" size="small">
                    {{ formatZScore(collegeChance.zScores.ec) }}σ
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>

        <v-divider class="my-3"></v-divider>

        <div class="text-body-2 mb-3">
          <div class="d-flex align-center justify-space-between mb-2">
            <strong>Recommendation:</strong>
            <v-btn
              v-if="!loadingAiRec"
              color="primary"
              variant="tonal"
              size="small"
              @click="toggleAiRecommendation"
            >
              <v-icon size="small" class="mr-1">mdi-robot</v-icon>
              {{ useAiRecommendation ? 'Using AI' : 'Get AI Recommendation' }}
            </v-btn>
            <v-progress-circular
              v-else
              indeterminate
              size="20"
              width="2"
              color="primary"
            ></v-progress-circular>
          </div>

          <v-alert
            v-if="showNoApiKeyMessage"
            type="info"
            density="compact"
            variant="tonal"
            class="mt-2 mb-3"
            color="warning"
          >
            <div class="d-flex align-center">
              <span>OpenAI API Key is not configured. AI recommendations are disabled.</span>
            </div>
          </v-alert>

          <v-alert
            v-if="aiError"
            type="error"
            density="compact"
            variant="tonal"
            class="mt-2 mb-3"
          >
            {{ aiError }}
          </v-alert>

          <div v-if="useAiRecommendation && aiRecommendation">
            <div v-html="formatRecommendation(aiRecommendation)"></div>
          </div>
          <div v-else>
            {{ basicRecommendation }}
          </div>
        </div>

        <v-row class="mt-1">
          <v-col cols="12" sm="4">
            <v-btn
              color="primary"
              variant="outlined"
              block
              @click="showDetails = !showDetails"
            >
              {{ showDetails ? 'Hide Details' : 'Show Details' }}
            </v-btn>
          </v-col>
          <v-col cols="12" sm="4">
            <v-btn
              color="info"
              variant="outlined"
              block
              @click="showAlgorithmExplanationDialog = true"
            >
              Algorithm Info
            </v-btn>
          </v-col>
          <v-col cols="12" sm="4">
            <v-btn
              :color="saveButtonColor"
              variant="tonal"
              block
              @click="emitSaveDecision"
            >
              {{ saveButtonText }}
            </v-btn>
          </v-col>
        </v-row>

        <v-expand-transition>
          <div v-if="showDetails">
            <v-divider class="my-3"></v-divider>

            <v-row>
              <v-col cols="12" sm="6">
                <v-card variant="outlined" class="pa-3 mb-3">
                  <div class="text-subtitle-2 mb-2">Academic Strength</div>
                  <v-progress-linear
                    :model-value="normalizeBlock(collegeChance.strengthBlock)"
                    color="primary"
                    height="10"
                    class="mb-1"
                  ></v-progress-linear>
                  <div class="text-caption text-high-emphasis">
                    Your academic strength score: {{ formatNumber(collegeChance.strengthBlock) }}
                  </div>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6">
                <v-card variant="outlined" class="pa-3 mb-3">
                  <div class="text-subtitle-2 mb-2">Mission Alignment</div>
                  <v-progress-linear
                    :model-value="normalizeBlock(collegeChance.alignmentBlock)"
                    color="secondary"
                    height="10"
                    class="mb-1"
                  ></v-progress-linear>
                  <div class="text-caption text-high-emphasis">
                    Your mission alignment score: {{ formatNumber(collegeChance.alignmentBlock) }}
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <v-card variant="outlined" class="pa-3 mb-3">
              <div class="text-subtitle-2 mb-2">Application Strategy Impact</div>
              <div class="d-flex justify-space-between align-center mb-3">
                <div>
                  <v-chip :color="localIsEarlyDecision ? 'success' : 'info'" size="small" class="me-2">
                    {{ localIsEarlyDecision ? 'Early Decision' : 'Regular Decision' }}
                  </v-chip>
                  <v-chip :color="localIsLegacy ? 'purple' : 'grey'" size="small">
                    {{ localIsLegacy ? 'Legacy Student' : 'Non-Legacy' }}
                  </v-chip>
                </div>
              </div>
              <div class="mt-2">
                <div class="d-flex justify-space-between">
                  <span class="text-caption">College base acceptance rate:</span>
                  <span class="text-caption font-weight-medium">{{ props.college.acceptanceRate }}%</span>
                </div>
                <div class="d-flex justify-space-between" v-if="props.studentProfile.intendedMajor">
                  <span class="text-caption">Rate adjusted for {{ props.studentProfile.intendedMajor }}:</span>
                  <span class="text-caption font-weight-medium">{{ majorAdjustedRateForDisplay }}%</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="text-caption">Final adjusted rate (Major, ED/RD, Legacy):</span>
                  <span class="text-caption font-weight-medium">{{ finalAdjustedRateForDisplay }}%</span>
                </div>
                <v-divider class="my-2"></v-divider>
                <div class="text-caption my-1">
                  <v-icon size="x-small" :color="localIsEarlyDecision ? 'success' : 'info'" class="mr-1">
                    {{ localIsEarlyDecision ? 'mdi-arrow-up' : 'mdi-information' }}
                  </v-icon>
                  <span v-if="localIsEarlyDecision">
                    Early Decision typically increases chances (e.g., by 1.2x-2x for relevant colleges) and is binding.
                  </span>
                  <span v-else>
                    Regular Decision offers flexibility; the displayed rate reflects standard chances.
                  </span>
                </div>
                <div class="text-caption mt-1" v-if="localIsLegacy">
                  <v-icon size="x-small" color="purple" class="mr-1">mdi-account-group</v-icon>
                  Legacy Status provides an additional boost (e.g., ~1.5x) to admission chances.
                </div>
                <div class="text-caption mt-1">
                  The "Final adjusted rate" is used as the starting point ($p_0$) for the overall chance calculation.
                </div>
              </div>
            </v-card>

            <v-card variant="outlined" class="pa-3 mb-3">
              <div class="d-flex justify-space-between align-center">
                <div class="text-subtitle-2">Major Impact</div>
                <v-chip
                  :color="getMajorMatchColor(props.studentProfile.intendedMajor, props.college.collegeType)"
                  size="small"
                >
                  {{ getMajorMatchText(props.studentProfile.intendedMajor, props.college.collegeType) }}
                </v-chip>
              </div>
              <div v-if="props.studentProfile.intendedMajor" class="mt-2">
                <div class="d-flex justify-space-between">
                  <span class="text-caption">Base acceptance rate:</span>
                  <span class="text-caption font-weight-medium">{{ props.college.acceptanceRate }}%</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="text-caption">
                    Adjusted for {{ props.studentProfile.intendedMajor }} at {{ props.college.collegeType }} college:
                  </span>
                  <span class="text-caption font-weight-medium">{{ majorAdjustedRateForDisplay }}%</span>
                </div>
                <div class="text-caption mt-1">
                  <span v-if="isHarderMajor">
                    <v-icon size="x-small" color="error" class="mr-1">mdi-arrow-down</v-icon>
                    This major is typically more competitive at this type of college.
                  </span>
                  <span v-else-if="isEasierMajor">
                    <v-icon size="x-small" color="success" class="mr-1">mdi-arrow-up</v-icon>
                    This major is typically less competitive at this type of college.
                  </span>
                  <span v-else>
                    <v-icon size="x-small" color="info" class="mr-1">mdi-information</v-icon>
                    Major competitiveness is neutral or standard for this college type.
                  </span>
                </div>
              </div>
              <div v-else class="text-caption mt-2">
                Select an intended major in your profile to see its specific impact on admission chances.
              </div>
            </v-card>

            <div class="text-caption mt-2">
              <strong>Note:</strong> This calculator uses standardized scores (Z-scores, σ) to compare your profile
              to the average applicant pool. A score of +1σ means you're one standard deviation above average.
              The final admission chance also considers adjustments to the college's base acceptance rate.
            </div>
          </div>
        </v-expand-transition>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="grey-darken-1" variant="text" @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else class="pa-4" rounded="lg" :elevation="4">
      <v-card-title>Loading Calculator...</v-card-title>
      <v-card-text class="text-center">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-3">Please wait while we calculate the admission chance.</p>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showAlgorithmExplanationDialog" max-width="700px">
    <v-card class="pa-3" rounded="lg">
      <v-card-title class="d-flex justify-space-between">
        <span class="text-h6">Algorithm Explanation & Warnings</span>
        <v-btn icon="mdi-close" variant="text" @click="showAlgorithmExplanationDialog = false"></v-btn>
      </v-card-title>
      <v-card-text>
        <p class="mb-3">
          This calculator estimates admission chances based on a model that incorporates several factors.
          Here's a simplified overview:
        </p>
        <v-list density="compact">
          <v-list-item>
            <template v-slot:prepend><v-icon color="blue-darken-2" class="mr-2">mdi-numeric-1-box</v-icon></template>
            <v-list-item-title><strong>Base Rate Adjustment (p<sub>0</sub>)</strong></v-list-item-title>
            <v-list-item-subtitle>
              The college's reported acceptance rate is adjusted for:
              <ul class="my-1 ml-4" style="list-style-type: disc;">
                <li><strong>Intended Major & College Type:</strong> Competitiveness varies (e.g., STEM at a STEM-heavy school is often more competitive).</li>
                <li><strong>Early Decision (ED)/Regular Decision (RD):</strong> ED can offer a significant boost, especially at selective schools.</li>
                <li><strong>Legacy Status:</strong> Having family alumni may provide an advantage.</li>
              </ul>
              This adjusted rate forms the initial probability (p<sub>0</sub>).
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend><v-icon color="green-darken-2" class="mr-2">mdi-numeric-2-box</v-icon></template>
            <v-list-item-title><strong>Profile Strength & Alignment</strong></v-list-item-title>
            <v-list-item-subtitle>
              Your profile is compared to the college's typical admitted student profile using:
              <ul class="my-1 ml-4" style="list-style-type: disc;">
                <li><strong>Z-Scores:</strong> Standardized scores for GPA, SAT/ACT, AP courses, and Extracurriculars (ECs) show how you compare to the average. A positive Z-score (e.g., +1.0σ) means you are above average.</li>
                <li><strong>Strength Block:</strong> Combines weighted Z-scores for core academic and extracurricular achievements.</li>
                <li><strong>Alignment Block:</strong> Considers factors like the fit of your APs/ECs with your major, recommendation letter strength (if quantified), and demographic factors.</li>
              </ul>
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend><v-icon color="orange-darken-2" class="mr-2">mdi-numeric-3-box</v-icon></template>
            <v-list-item-title><strong>Final Probability Calculation</strong></v-list-item-title>
            <v-list-item-subtitle>
              The final chance calculation varies by college selectivity:
              <ul class="my-1 ml-4" style="list-style-type: disc;">
                <li><strong>Highly Selective Schools (< 20%):</strong> Uses exponential model: <code>Adjusted Base Rate (p<sub>0</sub>) * e<sup>(Strength Score + Alignment Score)</sup></code></li>
                <li><strong>Moderately Selective (20-50%):</strong> Uses a blended approach with dampened exponential effects for more conservative estimates</li>
                <li><strong>Less Selective (> 50%):</strong> Uses a highly conservative approach with reduced baseline probabilities and limited impact from profile strength</li>
              </ul>
              This tiered approach ensures more accurate and appropriately conservative predictions across different types of schools.
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend><v-icon color="purple-darken-2" class="mr-2">mdi-numeric-4-box</v-icon></template>
            <v-list-item-title><strong>"Bitter by Coffee" Factor</strong></v-list-item-title>
            <v-list-item-subtitle>
              An optional, small random factor (0.75x to 1.25x) can be applied to simulate some of the inherent unpredictability in admissions.
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>

        <v-divider class="my-4"></v-divider>
        <strong class="text-h6">Important Warnings & Disclaimers:</strong>
        <ul class="mt-2 ml-4" style="list-style-type: disc;">
          <li><strong>Estimation Only:</strong> This tool provides an estimate, not a guarantee. Admission decisions are complex and multifaceted.</li>
          <li><strong>Data Dependency:</strong> Accuracy relies on the quality of your input and the college data used (which may not always be perfectly up-to-date or reflect specific departmental nuances).</li>
          <li><strong>Holistic Review:</strong> Many qualitative factors (essays, interviews, unique talents, letters of recommendation details, demonstrated interest) are difficult to quantify and play a crucial role, especially at selective institutions. This calculator simplifies these aspects.</li>
          <li><strong>Weighting Assumptions:</strong> The importance (weights) of different factors (GPA, test scores, ECs) are generalized. Actual colleges may have different priorities.</li>
          <li><strong>Dynamic Landscape:</strong> Admission criteria and competitiveness can change year to year.</li>
          <li><strong>School Selectivity Matters:</strong> Less selective schools often have more straightforward admissions criteria and our algorithm now better accounts for these differences.</li>
        </ul>
        <p class="mt-3 text-caption">
          Use this calculator as one tool among others to gauge potential fit and chance, but always research individual college requirements and consult with counselors.
        </p>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="primary" variant="text" @click="showAlgorithmExplanationDialog = false">Got it</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script setup>
import { ref, computed, watch } from 'vue';
import {
  getAdmissionChanceColor,
  getAdmissionChanceDescription,
  calculateAdmissionChance,
  prepareStudentData,
  adjustAcceptanceRateByMajor,
  adjustAcceptanceRateByStrategicFactors,
  getMajorMatchAssessment
} from '../utils/admitChanceCalculator'; //
import {
  getCollegeMatchAnalysis,
  getApiKey
} from '../utils/profileRecommendationService';

const props = defineProps({
  college: { type: Object, required: true },
  studentProfile: { type: Object, required: true },
  savedColleges: { type: Array, default: () => [] },
  recentlyViewed: { type: Array, default: () => [] },
  modelValue: { type: Boolean, default: false }
});

const emit = defineEmits(['saveToEarly', 'saveToRegular', 'update:modelValue', 'close']);

const collegeChance = ref(null);
const showDetails = ref(false);
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const localIsLegacy = ref(false);
const localIsEarlyDecision = ref(false);

// New ref for algorithm explanation dialog
const showAlgorithmExplanationDialog = ref(false);

watch(() => dialog.value, (isOpen) => {
  if (isOpen) {
    // Reset local ED/Legacy based on college properties
    localIsEarlyDecision.value = props.college.allowsEarlyDecision ? false : false;
    localIsLegacy.value = props.college.considersLegacy ? false : false;

    showAlgorithmExplanationDialog.value = false; // Ensure explanation dialog is closed initially
    if (props.college && props.studentProfile) {
      calculateChance(); // This will now use the potentially reset localIsEarlyDecision/Legacy
    } else {
      collegeChance.value = null;
    }
  } else {
    useAiRecommendation.value = false;
    aiRecommendation.value = '';
    aiError.value = '';
    showNoApiKeyMessage.value = false;
  }
});

const calculateChance = () => {
  if (!props.college || !props.studentProfile || !props.college.stats) {
    collegeChance.value = null;
    return;
  }
  
  // Ensure local ED/Legacy are false if not allowed by the college
  const actualIsEarlyDecision = props.college.allowsEarlyDecision ? localIsEarlyDecision.value : false;
  const actualIsLegacy = props.college.considersLegacy ? localIsLegacy.value : false;
  
  const studentData = prepareStudentData({
    ...props.studentProfile,
    isLegacy: actualIsLegacy,
    isEarlyDecision: actualIsEarlyDecision
  });
  collegeChance.value = calculateAdmissionChance(studentData, props.college);
};

const recalculateChance = () => {
  calculateChance();
};

watch(
  [() => props.college, () => props.studentProfile, localIsLegacy, localIsEarlyDecision],
  () => {
    calculateChance();
  },
  { immediate: true, deep: true }
);

const closeDialog = () => {
  dialog.value = false;
  emit('close');
};

const chanceColor = computed(() => {
  if (!collegeChance.value) return 'grey';
  return getAdmissionChanceColor(collegeChance.value.probability);
});

const chanceDescription = computed(() => {
  if (!collegeChance.value) return 'Calculating...';
  return getAdmissionChanceDescription(collegeChance.value.probability);
});

const timesAverage = computed(() => {
  if (!collegeChance.value) return '0';
  return collegeChance.value.timesAverageApplicant;
});

const basicRecommendation = computed(() => {
  if (!collegeChance.value || !props.college) return 'Calculating recommendation...';

  const prob = collegeChance.value.probability;
  const collegeType = props.college.collegeType || 'this';
  const edStatus = localIsEarlyDecision.value ? 'Early Decision' : 'Regular Decision';

  if (prob < 0.1) {
    return `This is a very hard reach school in the ${collegeType} category. ${localIsEarlyDecision.value ? 'Even with Early Decision,' : ''} Apply only if it's your dream school and you have strong alternatives.`;
  } else if (prob < 0.3) {
    return `This is a reach school. Applying ${edStatus} to this ${collegeType} school requires highlighting your absolute best ${collegeType === 'STEM-heavy' ? 'STEM' : 'Liberal Arts'} strengths.`;
  } else if (prob < 0.5) {
    return `This is a possible target school. Your profile is competitive for this ${collegeType} school with ${edStatus}, but admission isn't certain. Strengthen your application.`;
  } else if (prob < 0.8) {
    return `You're a strong candidate. This ${collegeType} school with ${edStatus} is a good chance. Consider it a solid target.`;
  } else {
    return `This appears to be a very likely school for you with your profile for ${edStatus} at this ${collegeType} institution.`;
  }
});

const useAiRecommendation = ref(false);
const showNoApiKeyMessage = ref(false);
const aiRecommendation = ref('');
const loadingAiRec = ref(false);
const aiError = ref('');
const currentRecommendationCollegeId = ref(null);

watch(() => props.college?.id, (newCollegeId) => {
  if (newCollegeId !== currentRecommendationCollegeId.value) {
    aiRecommendation.value = '';
    currentRecommendationCollegeId.value = newCollegeId;
    if (useAiRecommendation.value) {
      getAiRecommendation();
    }
  }
}, { immediate: true });


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
    if (!aiRecommendation.value || currentRecommendationCollegeId.value !== props.college?.id) {
      getAiRecommendation();
    }
  } catch (error) {
    console.error('Error checking/getting API key:', error);
    aiError.value = 'Could not verify AI service availability.';
    showNoApiKeyMessage.value = true;
    useAiRecommendation.value = false;
  }
};

const formatRecommendation = (text) => {
  if (!text) return '';
  return text
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
};

const getAiRecommendation = async () => {
  if (!props.college || !props.studentProfile || !useAiRecommendation.value) return;

  loadingAiRec.value = true;
  aiError.value = '';
  try {
    const result = await getCollegeMatchAnalysis(props.studentProfile, props.college);
    if (result.success) {
      aiRecommendation.value = result.analysis;
      currentRecommendationCollegeId.value = props.college.id;
    } else {
      aiError.value = result.error || 'Failed to get AI recommendation.';
      useAiRecommendation.value = false;
    }
  } catch (error) {
    aiError.value = error.message || 'An unexpected error occurred with AI recommendation.';
    useAiRecommendation.value = false;
  } finally {
    loadingAiRec.value = false;
  }
};

const isInEarlyDecision = computed(() => {
  return props.savedColleges.some(c => c.name === props.college?.name);
});

const isInRegularDecision = computed(() => {
  return props.recentlyViewed.some(c => c.name === props.college?.name);
});

const saveButtonText = computed(() => {
  if (!props.college) return "Save Decision";
  if (isInEarlyDecision.value) return 'Remove from Early Decision';
  if (isInRegularDecision.value) return 'Remove from Regular Decision';
  if (collegeChance.value && collegeChance.value.probability > 0.3) {
    return 'Save to RD';
  }
  return 'Save to ED';
});

const saveButtonColor = computed(() => {
  return (isInEarlyDecision.value || isInRegularDecision.value) ? 'error' : 'success';
});

const getZScoreColor = (zScore) => {
  if (zScore === undefined || zScore === null) return 'grey';
  if (zScore >= 1.5) return 'success';
  if (zScore >= 0.5) return 'info';
  if (zScore >= -0.5) return 'warning';
  return 'error';
};

const formatZScore = (zScore) => {
  if (zScore === undefined || zScore === null) return 'N/A';
  const sign = zScore >= 0 ? '+' : '';
  return `${sign}${zScore.toFixed(1)}`;
};

const formatNumber = (num) => {
  if (num === undefined || num === null) return 'N/A';
  return num.toFixed(2);
};

const normalizeBlock = (blockValue) => {
  if (blockValue === undefined || blockValue === null) return 0;
  return Math.min(Math.max((blockValue + 2) * 25, 0), 100);
};

const finalAdjustedRateForDisplay = computed(() => {
  if (!props.college || !props.studentProfile || !props.college.stats) return props.college?.acceptanceRate?.toFixed(1) || '0.0';
  let rate = parseFloat(props.college.acceptanceRate);
  rate = adjustAcceptanceRateByMajor(rate, props.studentProfile.intendedMajor, props.college.collegeType);
  
  // Use actual ED/Legacy values respecting college's allowance
  const actualIsEarlyDecision = props.college.allowsEarlyDecision ? localIsEarlyDecision.value : false;
  const actualIsLegacy = props.college.considersLegacy ? localIsLegacy.value : false;
  
  rate = adjustAcceptanceRateByStrategicFactors(rate, actualIsEarlyDecision, actualIsLegacy, props.college.allowsEarlyDecision, props.college.considersLegacy);
  return rate.toFixed(1);
});

const majorAdjustedRateForDisplay = computed(() => {
  if (!props.college || !props.studentProfile || !props.college.stats) return props.college?.acceptanceRate?.toFixed(1) || '0.0';
  const rate = adjustAcceptanceRateByMajor( //
    parseFloat(props.college.acceptanceRate),
    props.studentProfile.intendedMajor,
    props.college.collegeType
  );
  return rate.toFixed(1);
});

const isHarderMajor = computed(() => {
  if (!props.college || !props.studentProfile.intendedMajor) return false;
  const baseRate = parseFloat(props.college.acceptanceRate);
  const majorAdjusted = adjustAcceptanceRateByMajor(baseRate, props.studentProfile.intendedMajor, props.college.collegeType); //
  return majorAdjusted < baseRate * 0.9;
});

const isEasierMajor = computed(() => {
  if (!props.college || !props.studentProfile.intendedMajor) return false;
  const baseRate = parseFloat(props.college.acceptanceRate);
  const majorAdjusted = adjustAcceptanceRateByMajor(baseRate, props.studentProfile.intendedMajor, props.college.collegeType); //
  return majorAdjusted > baseRate * 1.1;
});

const getMajorMatchText = (intendedMajor, collegeType) => {
  if (!intendedMajor || !collegeType) return 'Not Selected';
  return getMajorMatchAssessment({ collegeType }, intendedMajor); //
};

const getMajorMatchColor = (intendedMajor, collegeType) => {
  if (!intendedMajor || !collegeType) return 'grey';
  const match = getMajorMatchText(intendedMajor, collegeType);
  if (match === 'Excellent') return 'success';
  if (match === 'Good') return 'info';
  if (match === 'Fair') return 'warning';
  return 'error';
};

const emitSaveDecision = () => {
  if (!props.college) return;
  if (isInEarlyDecision.value) {
    const index = props.savedColleges.findIndex(c => c.name === props.college.name);
    if (index !== -1) emit('saveToEarly', { college: props.college, action: 'remove', index });
  } else if (isInRegularDecision.value) {
    const index = props.recentlyViewed.findIndex(c => c.name === props.college.name);
    if (index !== -1) emit('saveToRegular', { college: props.college, action: 'remove', index });
  } else {
    if (collegeChance.value && collegeChance.value.probability > 0.3) {
      emit('saveToRegular', { college: props.college, action: 'add' });
    } else {
      emit('saveToEarly', { college: props.college, action: 'add' });
    }
  }
};

// Helper functions for UI display
const getAcceptanceRateColor = (rate) => {
  if (rate < 10) return 'error';
  if (rate <= 20) return 'warning';
  return 'success';
};

const getCollegeTypeColor = (type) => {
  return type === 'STEM-heavy' ? 'blue' : 'purple';
};

// Navigation function
const viewCollegeDetails = () => {
  if (props.college) {
    // Convert college name to URL-friendly identifier
    const collegeId = props.college.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    // Close dialog and navigate
    closeDialog();
    // Use window.location for simple navigation since we're in a dialog
    window.location.href = `/college/${collegeId}`;
  }
};

</script>

<style scoped>
.v-progress-circular {
  font-weight: 700;
}
.text-caption {
  line-height: 1.4;
}
ul {
  padding-left: 20px; /* Ensure bullets are visible */
}
.text-disabled {
  color: rgba(0, 0, 0, 0.38);
}

/* Enhanced styling for college header */
.v-card-title {
  padding-bottom: 0 !important;
}

.v-img {
  border: 2px solid rgba(0, 0, 0, 0.12);
  transition: border-color 0.3s ease;
}

.v-img:hover {
  border-color: rgb(var(--v-theme-primary));
}

.v-chip {
  transition: all 0.3s ease;
}

.v-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>
