<template>
  <v-dialog v-model="dialog" max-width="750px">
    <v-card
      class="pa-4"
      rounded="lg"
      :elevation="4"
      v-if="collegeChance"
    >
      <v-card-title class="d-flex justify-space-between">
        <span class="text-h6 font-weight-bold">Admission Chance Calculator</span>
        <v-btn icon="mdi-close" variant="text" @click="closeDialog"></v-btn>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <div class="d-flex flex-column align-center justify-center">
              <v-progress-circular
                :model-value="collegeChance.probabilityPercentage"
                :color="chanceColor"
                :size="120"
                :width="12"
                class="mb-2"
              >
                {{ collegeChance.probabilityPercentage }}%
              </v-progress-circular>
              <div class="text-h6 font-weight-bold">{{ chanceDescription }}</div>
              <div class="text-body-2 text-center">
                {{ timesAverage }} times the average applicant
              </div>
            </div>
          </v-col>
          <v-col cols="12" sm="6">
            <!-- Legacy Status Toggle -->
            <v-card variant="outlined" class="pa-2 mb-3">
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="text-subtitle-2">Legacy Status</div>
                  <div class="text-caption">Parent or sibling attended this college</div>
                </div>
                <v-switch
                  v-model="localIsLegacy"
                  color="primary"
                  hide-details
                  density="compact"
                  @change="recalculateChance"
                ></v-switch>
              </div>
            </v-card>
            
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

        <!-- Recommendation Section - Modified to include AI toggle -->
        <div class="text-body-2 mb-3">
          <div class="d-flex align-center justify-space-between mb-2">
            <strong>Recommendation:</strong>
            <v-btn
              v-if="!loadingAiRec"
              :color="useAiRecommendation ? 'primary' : 'grey'"
              :variant="useAiRecommendation ? 'tonal' : 'text'"
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

          <!-- No API key message -->
          <v-alert
            v-if="showNoApiKeyMessage"
            type="info"
            density="compact"
            variant="tonal"
            class="mt-2 mb-3"
          >
            <div class="d-flex align-center">
              <span>Please configure your OpenAI API key in Settings to use AI recommendations.</span>
              <v-btn
                color="primary"
                variant="text"
                size="small"
                class="ml-2"
                to="/settings"
              >
                Go to Settings
              </v-btn>
            </div>
          </v-alert>

          <!-- AI Recommendation Error -->
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
          <v-col cols="12" sm="6">
            <v-btn
              color="primary"
              variant="outlined"
              block
              @click="showDetails = !showDetails"
            >
              {{ showDetails ? 'Hide Details' : 'Show Details' }}
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6">
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

            <!-- Added Major Impact Information -->
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
                  <span class="text-caption font-weight-medium">{{ adjustedAcceptanceRate }}%</span>
                </div>
                <div class="text-caption mt-1">
                  <span v-if="isHarderMajor">
                    <v-icon size="x-small" color="error" class="mr-1">mdi-arrow-down</v-icon>
                    This major is more competitive at this college type.
                  </span>
                  <span v-else-if="isEasierMajor">
                    <v-icon size="x-small" color="success" class="mr-1">mdi-arrow-up</v-icon> 
                    This major is less competitive at this college type.
                  </span>
                </div>
              </div>
              
              <div v-else class="text-caption mt-2">
                Select an intended major in your profile to see how it affects your admission chances at this college.
              </div>
            </v-card>

            <div class="text-caption mt-2">
              <strong>Note:</strong> This calculator uses standardized scores (Z-scores) to compare your profile
              to the average applicant pool. A score of +1σ means you're one standard deviation above the average.
            </div>
          </div>
        </v-expand-transition>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="grey-darken-1" variant="text" @click="closeDialog">Close</v-btn>
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
  prepareStudentData
} from '../utils/admitChanceCalculator';
import {
  getCollegeMatchAnalysis
} from '../utils/profileRecommendationService';

const props = defineProps({
  college: {
    type: Object,
    required: true
  },
  studentProfile: {
    type: Object,
    required: true
  },
  savedColleges: {
    type: Array,
    default: () => []
  },
  recentlyViewed: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['saveToEarly', 'saveToRegular', 'update:modelValue', 'close']);

const collegeChance = ref(null);
const showDetails = ref(false);
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Add local legacy status state
const localIsLegacy = ref(false);

// Initialize the local legacy status when dialog opens
watch(() => dialog.value, (isOpen) => {
  if (isOpen) {
    // Default to false when opening, as this is a per-college setting
    localIsLegacy.value = false;
  }
});

// Define calculateChance function FIRST
const calculateChance = () => {
  if (!props.college || !props.studentProfile) return;

  // Prepare student data for calculations
  const studentData = prepareStudentData({
    ...props.studentProfile,
    // Override the legacy status with our local per-college setting
    isLegacy: localIsLegacy.value
  });

  // Calculate admission chance
  collegeChance.value = calculateAdmissionChance(studentData, props.college);
};

// Recalculate chance when legacy status changes
const recalculateChance = () => {
  calculateChance();
};

// THEN, define the watch that uses it
watch(
  [() => props.college, () => props.studentProfile],
  () => {
    calculateChance(); // Now this is safe to call
  },
  { immediate: true, deep: true }
);

// Close dialog handler
const closeDialog = () => {
  dialog.value = false;
  emit('close');
};

// Computed properties for UI display
const chanceColor = computed(() => {
  if (!collegeChance.value) return 'grey';
  return getAdmissionChanceColor(collegeChance.value.probability);
});

const chanceDescription = computed(() => {
  if (!collegeChance.value) return 'Unknown';
  return getAdmissionChanceDescription(collegeChance.value.probability);
});

const timesAverage = computed(() => {
  if (!collegeChance.value) return '0';
  return collegeChance.value.timesAverageApplicant;
});

// Basic recommendation (original logic)
const basicRecommendation = computed(() => {
  if (!collegeChance.value) return '';

  const prob = collegeChance.value.probability;
  const collegeType = props.college.collegeType;

  if (prob < 0.1) {
    return `This is a serious reach school in the ${collegeType} category. Apply only if it's your dream school and you have other more realistic options.`;
  } else if (prob < 0.3) {
    return `This is a reach school for you. The ${collegeType} focus means you should highlight your ${collegeType === 'STEM-heavy' ? 'STEM' : 'Liberal Arts'} strengths in your application.`;
  } else if (prob < 0.5) {
    return `This could be a good target school. Your profile is competitive for this ${collegeType} school, but admission is not guaranteed.`;
  } else if (prob < 0.8) {
    return `You're a strong candidate for this ${collegeType} school. Consider it as a target school with good chances.`;
  } else {
    return `This would be a safety school for you with your strong ${collegeType === 'STEM-heavy' ? 'STEM' : 'Liberal Arts'} profile.`;
  }
});

// AI Recommendation Integration
const useAiRecommendation = ref(false);
// Removed showNoApiKeyMessage ref
const aiRecommendation = ref('');
const loadingAiRec = ref(false);
const aiError = ref('');
// Track which college the recommendation is for
const currentRecommendationCollegeId = ref(null);

// Watch for college changes to reset recommendation if needed
watch(() => props.college?.id, (newCollegeId, oldCollegeId) => {
  if (newCollegeId !== oldCollegeId) {
    // If the college changes, reset the AI recommendation
    if (useAiRecommendation.value) {
      // Only fetch new recommendation if we're actively using AI recs
      getAiRecommendation();
    } else {
      // Otherwise just clear the stored recommendation
      aiRecommendation.value = '';
      currentRecommendationCollegeId.value = null;
    }
  }
}, { immediate: true });

// Toggle AI recommendation
const toggleAiRecommendation = () => {
  // If already using AI recommendation, toggle back to basic
  if (useAiRecommendation.value) {
    useAiRecommendation.value = false;
    return;
  }

  // Removed check for API key

  // Toggle to AI recommendation
  useAiRecommendation.value = true;

  // Check if we need a new recommendation for the current college
  if (!aiRecommendation.value || currentRecommendationCollegeId.value !== props.college.id) {
    getAiRecommendation();
  }
};

// Format AI recommendation text (convert newlines and formatting)
const formatRecommendation = (text) => {
  if (!text) return '';
  return text
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
};

// Get AI recommendation from OpenAI
const getAiRecommendation = async () => {
  if (!props.college || !props.studentProfile) return;

  loadingAiRec.value = true;
  aiError.value = '';

  try {
    const result = await getCollegeMatchAnalysis(props.studentProfile, props.college);

    if (result.success) {
      aiRecommendation.value = result.analysis;
      currentRecommendationCollegeId.value = props.college.id;
    } else {
      aiError.value = result.error || 'Failed to get AI recommendation';
      useAiRecommendation.value = false;
    }
  } catch (error) {
    aiError.value = error.message || 'An unexpected error occurred';
    useAiRecommendation.value = false;
  } finally {
    loadingAiRec.value = false;
  }
};

// Reset recommendation when dialog opens
watch(() => dialog.value, (isOpen) => {
  if (isOpen) {
    // Reset to default recommendation view when opening dialog
    useAiRecommendation.value = false;

    // Clear any previous recommendation if it's for a different college
    if (currentRecommendationCollegeId.value !== props.college.id) {
      aiRecommendation.value = '';
      currentRecommendationCollegeId.value = null;
    }
  }
});

const isInEarlyDecision = computed(() => {
  return props.savedColleges.some(c => c.name === props.college.name);
});

const isInRegularDecision = computed(() => {
  return props.recentlyViewed.some(c => c.name === props.college.name);
});

const saveButtonText = computed(() => {
  if (isInEarlyDecision.value) {
    return 'Remove from Early Decision';
  } else if (isInRegularDecision.value) {
    return 'Remove from Regular Decision';
  } else {
    // Check probability to suggest Early or Regular decision
    if (collegeChance.value && collegeChance.value.probability > 0.3) {
      return 'Save to Regular Decision';
    } else {
      return 'Save to Early Decision';
    }
  }
});

const saveButtonColor = computed(() => {
  if (isInEarlyDecision.value || isInRegularDecision.value) {
    return 'error';
  } else {
    return 'success';
  }
});

// Helper functions
const getZScoreColor = (zScore) => {
  if (zScore >= 1.5) return 'success';
  if (zScore >= 0.5) return 'info';
  if (zScore >= -0.5) return 'warning';
  return 'error';
};

const formatZScore = (zScore) => {
  const sign = zScore >= 0 ? '+' : '';
  return `${sign}${zScore.toFixed(1)}`;
};

const formatNumber = (num) => {
  return num.toFixed(2);
};

const normalizeBlock = (blockValue) => {
  // Convert block value to percentage for progress bar (typically ranges from -2 to +2)
  return Math.min(Math.max((blockValue + 2) * 25, 0), 100);
};

// Major impact functions and computed properties
import { getMajorMatchAssessment, adjustAcceptanceRateByMajor } from '../utils/admitChanceCalculator';

// Get adjusted acceptance rate for the current major and college
const adjustedAcceptanceRate = computed(() => {
  if (!props.college || !props.studentProfile.intendedMajor) return props.college?.acceptanceRate || 0;
  
  const adjusted = adjustAcceptanceRateByMajor(
    props.college.acceptanceRate, 
    props.studentProfile.intendedMajor, 
    props.college.collegeType
  );
  
  return adjusted.toFixed(1);
});

// Determine if this major is more competitive at this college
const isHarderMajor = computed(() => {
  if (!props.college || !props.studentProfile.intendedMajor) return false;
  
  return (
    (props.studentProfile.intendedMajor === 'STEM' && props.college.collegeType === 'STEM-heavy') || 
    (props.studentProfile.intendedMajor === 'Liberal Arts' && props.college.collegeType === 'Liberal-arts')
  );
});

// Determine if this major is less competitive at this college
const isEasierMajor = computed(() => {
  if (!props.college || !props.studentProfile.intendedMajor) return false;
  
  return (
    (props.studentProfile.intendedMajor === 'STEM' && props.college.collegeType === 'Liberal-arts') || 
    (props.studentProfile.intendedMajor === 'Liberal Arts' && props.college.collegeType === 'STEM-heavy')
  );
});

// Get major match text based on student's intended major and college type
const getMajorMatchText = (intendedMajor, collegeType) => {
  if (!intendedMajor) return 'Not Selected';
  
  return getMajorMatchAssessment({ collegeType }, intendedMajor);
};

// Get color for major match chip
const getMajorMatchColor = (intendedMajor, collegeType) => {
  if (!intendedMajor) return 'grey';
  
  const match = getMajorMatchText(intendedMajor, collegeType);
  if (match === 'Excellent') return 'success';
  if (match === 'Good') return 'info';
  if (match === 'Fair') return 'warning';
  return 'error';
};

const emitSaveDecision = () => {
  if (isInEarlyDecision.value) {
    // Remove from early decision
    const index = props.savedColleges.findIndex(c => c.name === props.college.name);
    if (index !== -1) {
      emit('saveToEarly', { college: props.college, action: 'remove', index });
    }
  } else if (isInRegularDecision.value) {
    // Remove from regular decision
    const index = props.recentlyViewed.findIndex(c => c.name === props.college.name);
    if (index !== -1) {
      emit('saveToRegular', { college: props.college, action: 'remove', index });
    }
  } else {
    // Add to appropriate list based on admission chance
    if (collegeChance.value && collegeChance.value.probability > 0.3) {
      emit('saveToRegular', { college: props.college, action: 'add' });
    } else {
      emit('saveToEarly', { college: props.college, action: 'add' });
    }
  }
};
</script>

<style scoped>
.v-progress-circular {
  font-weight: 700;
}
</style>
