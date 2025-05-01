<template>
  <v-dialog v-model="dialog" fullscreen scrollable>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>College Comparison</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="closeDialog">Done</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <!-- College Selection Section -->
      <v-card-text class="pa-4">
        <v-row>
          <v-col cols="12" md="9">
            <h3 class="text-h6 mb-2">Select Colleges to Compare</h3>
            <v-chip-group
              v-model="selectedColleges"
              multiple
              column
              class="mb-4"
            >
              <v-chip
                v-for="college in availableColleges"
                :key="college.name"
                :value="college.name"
                filter
                outlined
                :color="collegeColor(college)"
              >
                {{ college.name }}
              </v-chip>
            </v-chip-group>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filterType"
              :items="filterOptions"
              label="Filter Colleges"
              hide-details
              class="mb-4"
            ></v-select>
          </v-col>
        </v-row>

        <!-- Empty Selection State -->
        <v-card v-if="selectedCollegeObjects.length === 0" class="text-center pa-6" flat>
          <v-icon size="large" class="mb-3">mdi-school-outline</v-icon>
          <div class="text-h6 mb-2">Select colleges to compare</div>
          <div class="text-body-2">Choose at least two colleges to see a side-by-side comparison</div>
        </v-card>

        <!-- Comparison Table -->
        <div v-else>
          <h3 class="text-h6 mb-3">Comparison</h3>

          <!-- College Headers -->
          <v-row class="mb-2">
            <v-col cols="3" class="text-body-1 font-weight-bold">
              College Details
            </v-col>
            <v-col
              v-for="college in selectedCollegeObjects"
              :key="college.name"
              :cols="12 / (selectedCollegeObjects.length + 1)"
              class="text-center"
            >
              <v-avatar size="60" class="mb-2">
                <v-img :src="college.image" cover></v-img>
              </v-avatar>
              <div class="text-body-1 font-weight-bold">{{ college.name }}</div>
              <div class="text-caption">{{ college.location }}</div>
              <v-chip size="small" :color="getAcceptanceRateColor(college.acceptanceRate)" class="mt-1">
                {{ college.acceptanceRate }}% Acceptance
              </v-chip>
            </v-col>
          </v-row>

          <!-- Section: Basic Information -->
          <v-card class="mb-4" flat outlined>
            <v-card-title class="text-subtitle-1 bg-grey-lighten-3 py-2">
              Basic Information
            </v-card-title>

            <v-row class="pa-3">
              <v-col cols="3" class="text-body-2 font-weight-medium">College Type</v-col>
              <v-col
                v-for="college in selectedCollegeObjects"
                :key="`type-${college.name}`"
                :cols="12 / (selectedCollegeObjects.length + 1)"
                class="text-center text-body-2"
              >
                <v-chip :color="college.collegeType === 'STEM-heavy' ? 'info' : 'success'" size="small">
                  {{ college.collegeType }}
                </v-chip>
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-row class="pa-3">
              <v-col cols="3" class="text-body-2 font-weight-medium">Tuition</v-col>
              <v-col
                v-for="college in selectedCollegeObjects"
                :key="`tuition-${college.name}`"
                :cols="12 / (selectedCollegeObjects.length + 1)"
                class="text-center text-body-2"
              >
                ${{ formatCurrency(college.tuition) }}
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-row class="pa-3">
              <v-col cols="3" class="text-body-2 font-weight-medium">Rating</v-col>
              <v-col
                v-for="college in selectedCollegeObjects"
                :key="`rating-${college.name}`"
                :cols="12 / (selectedCollegeObjects.length + 1)"
                class="text-center"
              >
                <v-rating
                  :model-value="college.rating"
                  color="amber"
                  density="compact"
                  size="small"
                  readonly
                ></v-rating>
                <div class="text-caption">({{ college.reviewCount }} reviews)</div>
              </v-col>
            </v-row>
          </v-card>

          <!-- Section: Admission Factors -->
          <v-card class="mb-4" flat outlined v-if="studentProfile.gpa">
            <v-card-title class="text-subtitle-1 bg-grey-lighten-3 py-2">
              Your Admission Chances
            </v-card-title>

            <v-row class="pa-3">
              <v-col cols="3" class="text-body-2 font-weight-medium">Admission Probability</v-col>
              <v-col
                v-for="college in selectedCollegeObjects"
                :key="`chance-${college.name}`"
                :cols="12 / (selectedCollegeObjects.length + 1)"
                class="text-center"
              >
                <v-progress-circular
                  :model-value="getAdmissionChance(college).probabilityPercentage"
                  :color="getAdmissionChanceColor(getAdmissionChance(college).probability)"
                  :size="50"
                  :width="6"
                >
                  {{ getAdmissionChance(college).probabilityPercentage }}%
                </v-progress-circular>
                <div class="text-caption mt-1">
                  {{ getAdmissionChanceDescription(getAdmissionChance(college).probability) }}
                </div>
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-row class="pa-3">
              <v-col cols="3" class="text-body-2 font-weight-medium">Average GPA</v-col>
              <v-col
                v-for="college in selectedCollegeObjects"
                :key="`gpa-${college.name}`"
                :cols="12 / (selectedCollegeObjects.length + 1)"
                class="text-center"
              >
                <div class="text-body-2">{{ college.stats.gpa.mean.toFixed(2) }}</div>
                <v-chip
                  size="x-small"
                  :color="getComparisonColor(studentProfile.gpa, college.stats.gpa.mean)"
                  class="mt-1"
                >
                  {{ getComparisonText(studentProfile.gpa, college.stats.gpa.mean) }}
                </v-chip>
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-row class="pa-3">
              <v-col cols="3" class="text-body-2 font-weight-medium">Average SAT</v-col>
              <v-col
                v-for="college in selectedCollegeObjects"
                :key="`sat-${college.name}`"
                :cols="12 / (selectedCollegeObjects.length + 1)"
                class="text-center"
              >
                <div class="text-body-2">{{ college.stats.sat.mean }}</div>
                <v-chip
                  size="x-small"
                  :color="getComparisonColor(studentProfile.satReading + studentProfile.satMath, college.stats.sat.mean)"
                  class="mt-1"
                >
                  {{ getComparisonText(studentProfile.satReading + studentProfile.satMath, college.stats.sat.mean) }}
                </v-chip>
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-row class="pa-3">
              <v-col cols="3" class="text-body-2 font-weight-medium">Major Match</v-col>
              <v-col
                v-for="college in selectedCollegeObjects"
                :key="`match-${college.name}`"
                :cols="12 / (selectedCollegeObjects.length + 1)"
                class="text-center"
              >
                <v-chip
                  size="small"
                  :color="getMajorMatchColor(college)"
                >
                  {{ getMajorMatch(college) }}
                </v-chip>
              </v-col>
            </v-row>
          </v-card>

          <!-- Section: Description -->
          <v-card class="mb-4" flat outlined>
            <v-card-title class="text-subtitle-1 bg-grey-lighten-3 py-2">
              Description
            </v-card-title>

            <v-row class="pa-3">
              <v-col cols="3" class="text-body-2 font-weight-medium">About</v-col>
              <v-col
                v-for="college in selectedCollegeObjects"
                :key="`desc-${college.name}`"
                :cols="12 / (selectedCollegeObjects.length + 1)"
                class="text-body-2"
              >
                {{ college.description }}
              </v-col>
            </v-row>
          </v-card>

          <!-- Section: Actions -->
          <v-card flat>
            <v-row class="pa-3">
              <v-col cols="3"></v-col>
              <v-col
                v-for="college in selectedCollegeObjects"
                :key="`action-${college.name}`"
                :cols="12 / (selectedCollegeObjects.length + 1)"
                class="text-center"
              >
                <v-btn
                  :color="isInEarlyDecision(college) ? 'error' : 'success'"
                  size="small"
                  variant="tonal"
                  class="ma-1"
                  @click="toggleEarlyDecision(college)"
                >
                  {{ isInEarlyDecision(college) ? 'Remove from ED' : 'Add to ED' }}
                </v-btn>
                <v-btn
                  :color="isInRegularDecision(college) ? 'error' : 'info'"
                  size="small"
                  variant="tonal"
                  class="ma-1"
                  @click="toggleRegularDecision(college)"
                >
                  {{ isInRegularDecision(college) ? 'Remove from RD' : 'Add to RD' }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { colleges, getCollegesByType, getCollegesByAcceptanceRate } from '../data/colleges';
import {
  calculateAdmissionChance,
  prepareStudentData,
  getAdmissionChanceColor,
  getAdmissionChanceDescription,
  getMajorMatchAssessment
} from '../utils/admitChanceCalculator';

const props = defineProps({
  value: {
    type: Boolean,
    default: false
  },
  savedColleges: {
    type: Array,
    default: () => []
  },
  recentlyViewed: {
    type: Array,
    default: () => []
  },
  studentProfile: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:modelValue', 'saveToEarly', 'saveToRegular']);

// Dialog visibility
const dialog = computed({
  get: () => props.value,
  set: (value) => emit('update:modelValue', value)
});

// College filtering
const filterType = ref('All Colleges');
const filterOptions = [
  'All Colleges',
  'Elite Schools',
  'Target Schools',
  'Safety Schools',
  'STEM-focused',
  'Liberal Arts',
  'My Saved Colleges'
];

// College selection
const selectedColleges = ref([]);

// Filter available colleges based on selection
const availableColleges = computed(() => {
  switch(filterType.value) {
    case 'Elite Schools':
      return getCollegesByAcceptanceRate(0, 10);
    case 'Target Schools':
      return getCollegesByAcceptanceRate(10, 20);
    case 'Safety Schools':
      return getCollegesByAcceptanceRate(20, 100);
    case 'STEM-focused':
      return getCollegesByType('STEM-heavy');
    case 'Liberal Arts':
      return getCollegesByType('Liberal-arts');
    case 'My Saved Colleges':
      return [...props.savedColleges, ...props.recentlyViewed];
    default:
      return colleges;
  }
});

// Get full college objects for selected colleges
const selectedCollegeObjects = computed(() => {
  return selectedColleges.value.map(name =>
    colleges.find(college => college.name === name)
  ).filter(college => college !== undefined);
});

// Limit to max 4 selected colleges
watch(selectedColleges, (newSelected) => {
  if (newSelected.length > 4) {
    selectedColleges.value = newSelected.slice(0, 4);
  }
});

// College color selection
const collegeColor = (college) => {
  if (college.collegeType === 'STEM-heavy') {
    return 'info';
  } else {
    return 'success';
  }
};

// Admission chance calculation
const getAdmissionChance = (college) => {
  const studentData = prepareStudentData(props.studentProfile);
  return calculateAdmissionChance(studentData, college);
};

// Admission chance color calculation
const getAcceptanceRateColor = (rate) => {
  if (rate < 10) return 'error';
  if (rate < 20) return 'warning';
  if (rate < 40) return 'info';
  return 'success';
};

// Major match assessment
const getMajorMatch = (college) => {
  if (!props.studentProfile.intendedMajor) {
    return 'Unknown';
  }

  return getMajorMatchAssessment(college, props.studentProfile.intendedMajor);
};

const getMajorMatchColor = (college) => {
  const match = getMajorMatch(college);

  switch(match) {
    case 'Excellent':
      return 'success';
    case 'Good':
      return 'info';
    case 'Fair':
      return 'warning';
    default:
      return 'grey';
  }
};

// Compare student stats to college average
const getComparisonText = (studentStat, collegeMean) => {
  const diff = ((studentStat - collegeMean) / collegeMean) * 100;

  if (diff >= 10) return '+' + Math.round(diff) + '%';
  if (diff <= -10) return Math.round(diff) + '%';
  return 'On target';
};

const getComparisonColor = (studentStat, collegeMean) => {
  const diff = ((studentStat - collegeMean) / collegeMean) * 100;

  if (diff >= 10) return 'success';
  if (diff <= -10) return 'error';
  return 'info';
};

// Check if college is in saved lists
const isInEarlyDecision = (college) => {
  return props.savedColleges.some(c => c.name === college.name);
};

const isInRegularDecision = (college) => {
  return props.recentlyViewed.some(c => c.name === college.name);
};

// Handle save/remove college actions
const toggleEarlyDecision = (college) => {
  if (isInEarlyDecision(college)) {
    const index = props.savedColleges.findIndex(c => c.name === college.name);
    emit('saveToEarly', { college, action: 'remove', index });
  } else {
    emit('saveToEarly', { college, action: 'add' });
  }
};

const toggleRegularDecision = (college) => {
  if (isInRegularDecision(college)) {
    const index = props.recentlyViewed.findIndex(c => c.name === college.name);
    emit('saveToRegular', { college, action: 'remove', index });
  } else {
    emit('saveToRegular', { college, action: 'add' });
  }
};

// Format currency
const formatCurrency = (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Close dialog
const closeDialog = () => {
  dialog.value = false;
};
</script>

<style scoped>
.v-card-text {
  max-height: calc(100vh - 64px);
  overflow-y: auto;
}
</style>
