<template>
  <v-card
    class="mb-4 pa-4"
    rounded="lg"
    :elevation="4"
    v-if="collegeChance"
  >
    <v-card-title class="text-h6 font-weight-bold mb-2">
      Admission Chance Calculator
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

      <div class="text-body-2 mb-3" v-if="recommendation">
        <strong>Recommendation:</strong> {{ recommendation }}
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

          <div class="text-caption mt-2">
            <strong>Note:</strong> This calculator uses standardized scores (Z-scores) to compare your profile
            to the average applicant pool. A score of +1σ means you're one standard deviation above the average.
          </div>
        </div>
      </v-expand-transition>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import {
  getAdmissionChanceColor,
  getAdmissionChanceDescription,
  calculateAdmissionChance,
  prepareStudentData
} from '../utils/admitChanceCalculator';

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
  }
});

const emit = defineEmits(['saveToEarly', 'saveToRegular']);

const collegeChance = ref(null);
const showDetails = ref(false);

// Define calculateChance function FIRST
const calculateChance = () => {
  if (!props.college || !props.studentProfile) return;

  // Prepare student data for calculations
  const studentData = prepareStudentData(props.studentProfile);

  // Calculate admission chance
  collegeChance.value = calculateAdmissionChance(studentData, props.college);
};

// THEN, define the watch that uses it
watch(
  [() => props.college, () => props.studentProfile],
  () => {
    calculateChance(); // Now this is safe to call
  },
  { immediate: true, deep: true }
);

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

const recommendation = computed(() => {
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
