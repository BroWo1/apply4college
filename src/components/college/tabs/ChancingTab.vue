<template>
  <v-row>
    <v-col cols="12" md="8">
      <div class="chancing-content">
        <v-card-title class="text-h5 font-weight-bold pb-4 px-0">
          Detailed Admission Chances for {{ college.name }}
        </v-card-title>

        <!-- Controls Section -->
        <v-card class="mb-6" elevation="1" rounded="lg">
          <v-card-item>
            <v-card-title class="d-flex align-center">
              <v-icon start>mdi-strategy</v-icon>
              Admission Strategy
            </v-card-title>
            <v-card-subtitle>
              Adjust factors to see how they impact your chances.
            </v-card-subtitle>
          </v-card-item>
          <v-card-text>
            <v-row align="center" justify="space-around">
              <v-col cols="auto" class="text-center">
                <div class="text-subtitle-1 font-weight-medium">Early Decision</div>
                <div class="text-caption" :class="{'text-disabled': !college.allowsEarlyDecision}">
                  {{ college.allowsEarlyDecision ? 'Increases chances' : 'Not offered' }}
                </div>
                <v-switch
                  :model-value="isEarlyDecision"
                  @update:modelValue="$emit('update:isEarlyDecision', $event); $emit('calculateDetailedChance')"
                  color="primary"
                  hide-details
                  density="compact"
                  :disabled="!college.allowsEarlyDecision"
                  class="d-inline-flex"
                ></v-switch>
              </v-col>

              <v-divider vertical class="hidden-sm-and-down mx-4"></v-divider>

              <v-col cols="auto" class="text-center">
                <div class="text-subtitle-1 font-weight-medium">Legacy Status</div>
                <div class="text-caption" :class="{'text-disabled': !college.considersLegacy}">
                  {{ college.considersLegacy ? 'Family attended' : 'Not considered' }}
                </div>
                <v-switch
                  :model-value="isLegacy"
                  @update:modelValue="$emit('update:isLegacy', $event); $emit('calculateDetailedChance')"
                  color="primary"
                  hide-details
                  density="compact"
                  :disabled="!college.considersLegacy"
                  class="d-inline-flex"
                ></v-switch>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Chance Overview and Recommendation Combined -->
        <v-card class="mb-6" elevation="1" rounded="lg">
          <v-card-item>
            <v-card-title class="d-flex align-center">
              <v-icon start>mdi-target</v-icon>
              Your Admission Analysis
            </v-card-title>
          </v-card-item>
          <v-card-text>
            <!-- Chance Overview Section -->
            <div class="mb-6">
              <h3 class="text-h6 font-weight-bold mb-3">Admission Chances</h3>
              <v-row>
                <v-col cols="12" md="6">
                  <div class="d-flex flex-column align-center justify-center">
                    <v-progress-circular
                      :model-value="detailedCollegeChance.probabilityPercentage"
                      :color="detailedChanceColor"
                      :size="150"
                      :width="15"
                      class="mb-3"
                    >
                      <span class="text-h4">{{ detailedCollegeChance.probabilityPercentage }}%</span>
                    </v-progress-circular>
                    <div class="text-h6 font-weight-bold">{{ detailedChanceDescription }}</div>
                    <div class="text-body-2 text-center mt-2">
                      {{ detailedCollegeChance.timesAverageApplicant || '1.0' }} times the average applicant
                    </div>
                    <!-- Add Bitter by Coffee factor display if enabled -->
                    <div v-if="studentProfile.enableBitterByCoffee && detailedCollegeChance.bitterByCoffeeFactor && detailedCollegeChance.bitterByCoffeeFactor !== '1.00'" class="text-caption text-center mt-2">
                      <v-icon size="small" color="warning">mdi-coffee</v-icon>
                      Randomness factor: {{ detailedCollegeChance.bitterByCoffeeFactor }}x
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <v-list density="compact">
                    <v-list-subheader class="text-subtitle-1 font-weight-medium">Your Profile Strengths</v-list-subheader>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon :color="getZScoreColor(detailedCollegeChance.zScores?.gpa || 0)" class="mr-2">
                          mdi-school
                        </v-icon>
                      </template>
                      <v-list-item-title>GPA: {{ studentProfile.gpa || 'N/A' }}</v-list-item-title>
                      <template v-slot:append>
                        <v-chip :color="getZScoreColor(detailedCollegeChance.zScores?.gpa || 0)" size="small">
                          {{ formatZScore(detailedCollegeChance.zScores?.gpa || 0) }}σ
                        </v-chip>
                      </template>
                    </v-list-item>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon :color="getZScoreColor(detailedCollegeChance.zScores?.sat || 0)" class="mr-2">
                          mdi-book-open-variant
                        </v-icon>
                      </template>
                      <v-list-item-title>SAT: {{ studentProfile.satReading && studentProfile.satMath ? studentProfile.satReading + studentProfile.satMath : 'N/A' }}</v-list-item-title>
                      <template v-slot:append>
                        <v-chip :color="getZScoreColor(detailedCollegeChance.zScores?.sat || 0)" size="small">
                          {{ formatZScore(detailedCollegeChance.zScores?.sat || 0) }}σ
                        </v-chip>
                      </template>
                    </v-list-item>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon :color="getZScoreColor(detailedCollegeChance.zScores?.ap || 0)" class="mr-2">
                          mdi-certificate
                        </v-icon>
                      </template>
                      <v-list-item-title>AP Courses: {{ apCourseCount }}</v-list-item-title>
                      <template v-slot:append>
                        <v-chip :color="getZScoreColor(detailedCollegeChance.zScores?.ap || 0)" size="small">
                          {{ formatZScore(detailedCollegeChance.zScores?.ap || 0) }}σ
                        </v-chip>
                      </template>
                    </v-list-item>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon :color="getZScoreColor(detailedCollegeChance.zScores?.ec || 0)" class="mr-2">
                          mdi-account-group
                        </v-icon>
                      </template>
                      <v-list-item-title>Extracurriculars: {{ extracurricularCount }}</v-list-item-title>
                      <template v-slot:append>
                        <v-chip :color="getZScoreColor(detailedCollegeChance.zScores?.ec || 0)" size="small">
                          {{ formatZScore(detailedCollegeChance.zScores?.ec || 0) }}σ
                        </v-chip>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </div>

            <v-divider class="my-4"></v-divider>

            <!-- Recommendation Section -->
            <div>
              <div class="d-flex align-center justify-space-between mb-3">
                <h3 class="text-h6 font-weight-bold d-flex align-center">
                  <v-icon class="mr-2">mdi-lightbulb-outline</v-icon>
                  Admission Recommendation
                </h3>
                <v-btn
                  v-if="!loadingAiRec"
                  color="primary"
                  variant="tonal"
                  size="small"
                  @click="$emit('toggleAiRecommendation')"
                >
                  <v-icon size="small" class="mr-1">mdi-robot</v-icon>
                  {{ useAiRecommendation ? 'Using AI Insight' : 'Get AI Insight' }}
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
                v-if="showNoApiKeyMessage && useAiRecommendation"
                type="info"
                density="compact"
                variant="tonal"
                class="mb-3"
                color="warning"
              >
                <div class="d-flex align-center">
                  <v-icon start>mdi-key-alert</v-icon>
                  <span>OpenAI API Key is not configured. AI recommendations are disabled.</span>
                </div>
              </v-alert>
              <v-alert
                v-if="aiError && useAiRecommendation"
                type="error"
                density="compact"
                variant="tonal"
                class="mb-3"
              >
                <v-icon start>mdi-alert-circle</v-icon>
                {{ aiError }}
              </v-alert>

              <div class="text-body-1">
                <div v-if="useAiRecommendation && aiRecommendation" v-html="formatRecommendation(aiRecommendation)"></div>
                <div v-else-if="useAiRecommendation && !aiRecommendation && !aiError && !showNoApiKeyMessage && loadingAiRec">
                  <v-skeleton-loader
                    type="paragraph"
                  ></v-skeleton-loader>
                </div>
                <div v-else class="text-body-1">{{ detailedRecommendation }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- AP Courses Details Card -->
        <v-card v-if="studentProfile.apClasses && studentProfile.apClasses.length > 0" class="mb-6" elevation="1" rounded="lg">
          <v-card-item>
            <v-card-title class="d-flex align-center">
              <v-icon start>mdi-certificate</v-icon>
              AP Courses ({{ apCourseCount }})
            </v-card-title>
            <v-card-subtitle v-if="studentProfile.intendedMajor">
              AP-Major Alignment: <strong>{{ getApMajorAlignment() }}</strong>
            </v-card-subtitle>
          </v-card-item>
          <v-card-text>
            <v-row>
              <v-col v-for="(ap, index) in studentProfile.apClasses" :key="index" cols="12" sm="6">
                <v-chip
                  :color="getApColor(ap)"
                  variant="outlined"
                  class="ma-1"
                  size="small"
                >
                  <v-icon start size="x-small">{{ ap.status === 'ongoing' ? 'mdi-clock-outline' : 'mdi-check' }}</v-icon>
                  {{ ap.name }}{{ ap.score && ap.score !== 'N/A' ? ` (${ap.score})` : '' }}
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Extracurricular Activities Details Card -->
        <v-card v-if="studentProfile.extracurriculars && studentProfile.extracurriculars.length > 0" class="mb-6" elevation="1" rounded="lg">
          <v-card-item>
            <v-card-title class="d-flex align-center">
              <v-icon start>mdi-account-group</v-icon>
              Extracurricular Activities ({{ extracurricularCount }})
            </v-card-title>
            <v-card-subtitle v-if="studentProfile.intendedMajor">
              EC-Major Alignment: <strong>{{ getEcMajorAlignment() }}</strong>
            </v-card-subtitle>
          </v-card-item>
          <v-card-text>
            <v-row>
              <v-col v-for="(ec, index) in studentProfile.extracurriculars" :key="index" cols="12" sm="6">
                <v-chip
                  :color="getEcColor(ec)"
                  variant="outlined"
                  class="ma-1"
                  size="small"
                >
                  <v-icon start size="x-small">{{ getEcIcon(ec.level) }}</v-icon>
                  {{ ec.name }} (Level {{ ec.level }})
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

      </div>
    </v-col>

    <v-col cols="12" md="4">
      <div class="sticky-top-side">
        <!-- Strength Metrics card -->
        <v-card class="mb-6" elevation="1" rounded="lg">
          <v-card-item>
            <v-card-title class="d-flex align-center">
              <v-icon start>mdi-chart-line</v-icon>
              Key Profile Metrics
            </v-card-title>
          </v-card-item>
          <v-card-text>
            <v-tooltip text="Based on your GPA, test scores, and AP performance compared to admitted students">
              <template v-slot:activator="{ props }">
                <v-card variant="outlined" class="pa-3 mb-3 hoverable-item" v-bind="props">
                  <div class="d-flex align-center mb-2">
                    <v-icon class="mr-2">mdi-school</v-icon>
                    <div class="text-subtitle-1 font-weight-medium">Academic Strength</div>
                    <v-icon class="ml-auto" size="small" color="grey">mdi-information-outline</v-icon>
                  </div>
                  <v-progress-linear
                    :model-value="normalizeBlock(detailedCollegeChance.strengthBlock || 0)"
                    color="primary"
                    height="12"
                    class="mb-2"
                    rounded
                  ></v-progress-linear>
                  <div class="text-caption">
                    Score: {{ formatNumber(detailedCollegeChance.strengthBlock || 0) }}
                  </div>
                </v-card>
              </template>
            </v-tooltip>

            <v-tooltip text="How well your intended major and extracurriculars align with this college's mission">
              <template v-slot:activator="{ props }">
                <v-card variant="outlined" class="pa-3 hoverable-item" v-bind="props">
                  <div class="d-flex align-center mb-2">
                    <v-icon class="mr-2">mdi-target</v-icon>
                    <div class="text-subtitle-1 font-weight-medium">Mission Alignment</div>
                    <v-icon class="ml-auto" size="small" color="grey">mdi-information-outline</v-icon>
                  </div>
                  <v-progress-linear
                    :model-value="normalizeBlock(detailedCollegeChance.alignmentBlock || 0)"
                    color="secondary"
                    height="12"
                    class="mb-2"
                    rounded
                  ></v-progress-linear>
                  <div class="text-caption">
                    Score: {{ formatNumber(detailedCollegeChance.alignmentBlock || 0) }}
                  </div>
                </v-card>
              </template>
            </v-tooltip>
          </v-card-text>
        </v-card>

        <!-- Additional Metrics and Demographics Combined -->
        <v-card class="mb-6" elevation="1" rounded="lg">
          <v-card-item>
            <v-card-title class="d-flex align-center">
              <v-icon start>mdi-chart-box-outline</v-icon>
              Admission Factors & Demographics
            </v-card-title>
          </v-card-item>
          <v-card-text>
            <!-- Acceptance Rate Factors Section -->
            <div class="mb-4">
              <h4 class="text-subtitle-1 font-weight-medium mb-3 d-flex align-center">
                <v-icon start size="small">mdi-percent</v-icon>
                Acceptance Rate Factors
              </h4>
              <v-list density="compact">
                <v-list-item class="pa-0 mb-2">
                  <v-list-item-content class="py-2">
                    <v-list-item-title class="text-subtitle-2 font-weight-medium">Base Acceptance Rate</v-list-item-title>
                  </v-list-item-content>
                  <template v-slot:append>
                    <v-chip color="primary" size="small" variant="outlined">{{ college.acceptanceRate }}%</v-chip>
                  </template>
                </v-list-item>

                <v-divider class="my-2"></v-divider>

                <v-list-item class="pa-0 mb-2">
                  <v-list-item-content class="py-2">
                    <v-list-item-title class="text-subtitle-2 font-weight-medium">Major Adjusted Rate</v-list-item-title>
                    <v-list-item-subtitle class="text-caption mt-1" v-if="studentProfile.intendedMajor">
                      {{ isHarderMajor ? 'Major is more competitive' : isEasierMajor ? 'Major improves chances' : 'Neutral major impact' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <template v-slot:append>
                    <v-chip :color="isHarderMajor ? 'error' : isEasierMajor ? 'success' : 'primary'" size="small" variant="outlined">
                      {{ majorAdjustedRateForDisplay }}%
                    </v-chip>
                  </template>
                </v-list-item>

                <v-divider class="my-2"></v-divider>

                <v-list-item class="pa-0 mb-2">
                  <v-list-item-content class="py-2">
                    <v-list-item-title class="text-subtitle-2 font-weight-medium">Final Adjusted Rate</v-list-item-title>
                    <v-list-item-subtitle class="text-caption mt-1">
                      {{ isEarlyDecision ? 'ED provides a boost' : 'Regular Decision' }}
                      {{ isLegacy ? ' + Legacy status' : '' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <template v-slot:append>
                    <v-chip :color="isEarlyDecision || isLegacy ? 'success' : 'primary'" size="small" variant="outlined">
                      {{ finalAdjustedRateForDisplay }}%
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </div>

            <!-- Demographics Section -->
            <div v-if="studentProfile.nationality || studentProfile.gender">
              <v-divider class="my-4"></v-divider>
              <h4 class="text-subtitle-1 font-weight-medium mb-3 d-flex align-center">
                <v-icon start size="small">mdi-account-details</v-icon>
                Demographics
              </h4>
              <v-list density="compact">
                <v-list-item v-if="studentProfile.nationality" class="pa-0 mb-1">
                  <v-list-item-content class="py-2">
                    <v-list-item-title class="text-subtitle-2 font-weight-medium">
                      <v-icon start size="small">mdi-earth</v-icon>
                      Nationality
                    </v-list-item-title>
                  </v-list-item-content>
                  <template v-slot:append>
                    <v-chip size="small" variant="outlined">{{ studentProfile.nationality }}</v-chip>
                  </template>
                </v-list-item>
                <v-list-item v-if="studentProfile.gender" class="pa-0 mb-1">
                  <v-list-item-content class="py-2">
                    <v-list-item-title class="text-subtitle-2 font-weight-medium">
                      <v-icon start size="small">mdi-human</v-icon>
                      Gender
                    </v-list-item-title>
                  </v-list-item-content>
                  <template v-slot:append>
                    <v-chip size="small" variant="outlined">{{ studentProfile.gender }}</v-chip>
                  </template>
                </v-list-item>
                <v-list-item v-if="studentProfile.demoScore !== undefined" class="pa-0">
                  <v-list-item-content class="py-2">
                    <v-list-item-title class="text-subtitle-2 font-weight-medium">
                      <v-icon start size="small">mdi-chart-donut</v-icon>
                      Diversity Score
                    </v-list-item-title>
                  </v-list-item-content>
                  <template v-slot:append>
                    <v-chip size="small" :color="getDemoScoreColor(studentProfile.demoScore)" variant="outlined">
                      {{ (studentProfile.demoScore || 0).toFixed(2) }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </div>
          </v-card-text>
        </v-card>

      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue';
// Updated imports to include all necessary functions
import {
  getAdmissionChanceColor,
  getAdmissionChanceDescription,
  getMajorMatchAssessment,
  adjustAcceptanceRateByMajor,
  adjustAcceptanceRateByStrategicFactors
} from '../../../utils/admitChanceCalculator';

const props = defineProps({
  college: { type: Object, required: true },
  isEarlyDecision: { type: Boolean, default: false },
  isLegacy: { type: Boolean, default: false },
  // Added missing props with safe defaults
  detailedCollegeChance: {
    type: Object,
    default: () => ({
      probabilityPercentage: 0,
      timesAverageApplicant: '0.0',
      zScores: {},
      strengthBlock: 0,
      alignmentBlock: 0,
      probability: 0,
      bitterByCoffeeFactor: '1.00'
    })
  },
  studentProfile: {
    type: Object,
    default: () => ({
      intendedMajor: '',
      gpa: null,
      satReading: null,
      satMath: null,
      apClasses: [],
      extracurriculars: [],
      nationality: '',
      gender: '',
      demoScore: 0,
      enableBitterByCoffee: false
    })
  },
  useAiRecommendation: { type: Boolean, default: false },
  loadingAiRec: { type: Boolean, default: false },
  showNoApiKeyMessage: { type: Boolean, default: false },
  aiError: { type: String, default: '' },
  aiRecommendation: { type: String, default: '' },
});

defineEmits([
  'update:isEarlyDecision',
  'update:isLegacy',
  'calculateDetailedChance',
  'saveToEarly',
  'saveToRegular',
  'toggleAiRecommendation',
]);

const detailedChanceColor = computed(() => {
  // Ensure props.detailedCollegeChance and its properties are accessed safely
  return getAdmissionChanceColor(props.detailedCollegeChance?.probability || 0);
});

const detailedChanceDescription = computed(() => {
  // Ensure props.detailedCollegeChance and its properties are accessed safely
  return getAdmissionChanceDescription(props.detailedCollegeChance?.probability || 0);
});

const detailedRecommendation = computed(() => {
  if (!props.detailedCollegeChance || !props.college) return 'Calculating recommendation...';

  const prob = props.detailedCollegeChance.probability || 0; // Safe access
  const collegeType = props.college.collegeType || 'this';
  const edStatus = props.isEarlyDecision ? 'Early Decision' : 'Regular Decision';

  if (prob < 0.1) {
    return `This is a very hard reach school in the ${collegeType} category. ${props.isEarlyDecision ? 'Even with Early Decision,' : ''} Apply only if it's your dream school and you have strong alternatives.`;
  } else if (prob < 0.3) {
    return `This is a reach school. Applying ${edStatus} to this ${collegeType} school requires highlighting your absolute best ${collegeType === 'STEM-heavy' ? 'STEM' : 'Liberal Arts'} strengths.`;
  } else if (prob < 0.5) {
    return `This is a possible target school. Your profile is competitive for this ${collegeType} school with ${edStatus}, but admission isn't certain. Strengthen your application.`;
  } else if (prob < 0.8) {
    return `You're a strong candidate. This ${collegeType} school with ${edStatus} is a good chance. Consider it a solid target.`;
  } else {
    return `This is a likely school for you. With your ${props.isEarlyDecision ? 'Early Decision application and ' : ''}strong profile, you have an excellent chance of admission.`;
  }
});

const majorMatch = computed(() => {
  if (!props.studentProfile || !props.studentProfile.intendedMajor || !props.college) {
    return 'neutral'; // Default if essential data is missing
  }
  const assessment = getMajorMatchAssessment(props.college, props.studentProfile.intendedMajor);
  if (assessment === 'Excellent' || assessment === 'Good') {
    return 'good';
  } else if (assessment === 'Fair') {
    return 'neutral';
  } else if (assessment === 'Poor') {
    return 'challenging';
  }
  return 'neutral'; // Fallback
});

// Add computed properties for AP and EC counts
const apCourseCount = computed(() => {
  if (!props.studentProfile.apClasses) return 0;
  return props.studentProfile.apClasses.reduce((total, ap) => 
    total + (ap.status === 'ongoing' ? 0.5 : 1), 0
  );
});

const extracurricularCount = computed(() => {
  if (!props.studentProfile.extracurriculars) return 0;
  return props.studentProfile.extracurriculars.length;
});

// Add helper methods for AP and EC alignment
const getApMajorAlignment = () => {
  if (!props.studentProfile.apClasses || props.studentProfile.apClasses.length === 0) return 'N/A';
  const avgFitScore = props.studentProfile.apClasses.reduce((sum, ap) => sum + (ap.fitScore || 0), 0) / props.studentProfile.apClasses.length;
  if (avgFitScore >= 2.5) return 'Excellent';
  if (avgFitScore >= 1.5) return 'Good';
  if (avgFitScore >= 0.5) return 'Fair';
  return 'Weak';
};

const getEcMajorAlignment = () => {
  if (!props.studentProfile.extracurriculars || props.studentProfile.extracurriculars.length === 0) return 'N/A';
  const avgFitScore = props.studentProfile.extracurriculars.reduce((sum, ec) => sum + (ec.fitScore || 0), 0) / props.studentProfile.extracurriculars.length;
  if (avgFitScore >= 2.5) return 'Excellent';
  if (avgFitScore >= 1.5) return 'Good';
  if (avgFitScore >= 0.5) return 'Fair';
  return 'Weak';
};

// Add color methods for AP and EC chips
const getApColor = (ap) => {
  if (ap.score === 5) return 'success';
  if (ap.score === 4) return 'info';
  if (ap.score === 3) return 'warning';
  if (ap.status === 'ongoing') return 'grey';
  return 'error';
};

const getEcColor = (ec) => {
  if (ec.level >= 4) return 'success';
  if (ec.level === 3) return 'info';
  if (ec.level === 2) return 'warning';
  return 'grey';
};

const getEcIcon = (level) => {
  if (level >= 4) return 'mdi-star';
  if (level === 3) return 'mdi-star-half-full';
  return 'mdi-star-outline';
};

const getDemoScoreColor = (score) => {
  if (score >= 0.75) return 'success';
  if (score >= 0.5) return 'info';
  if (score >= 0.25) return 'warning';
  return 'grey';
};

const getAlignmentClass = (alignment) => {
  if (alignment === 'Excellent') return 'text-success';
  if (alignment === 'Good') return 'text-info';
  if (alignment === 'Fair') return 'text-warning';
  return 'text-error';
};

// Added computed properties for display rates and major competitiveness
const majorAdjustedRateForDisplay = computed(() => {
  if (!props.college || !props.studentProfile) return props.college?.acceptanceRate?.toFixed(1) || '0.0';
  const rate = adjustAcceptanceRateByMajor(
    parseFloat(props.college.acceptanceRate),
    props.studentProfile.intendedMajor,
    props.college.collegeType
  );
  return rate.toFixed(1);
});

const finalAdjustedRateForDisplay = computed(() => {
  if (!props.college || !props.studentProfile || !props.detailedCollegeChance) return props.college?.acceptanceRate?.toFixed(1) || '0.0';
  // The finalAdjustedAcceptanceRateForP0 is already calculated in detailedCollegeChance if the structure is consistent
  // Otherwise, recalculate if necessary:
  let rate = adjustAcceptanceRateByMajor(
    parseFloat(props.college.acceptanceRate),
    props.studentProfile.intendedMajor,
    props.college.collegeType
  );
  rate = adjustAcceptanceRateByStrategicFactors(
    rate,
    props.isEarlyDecision,
    props.isLegacy,
    props.college.allowsEarlyDecision,
    props.college.considersLegacy
  );
  return rate.toFixed(1);
});

const isHarderMajor = computed(() => {
  if (!props.college || !props.studentProfile || !props.studentProfile.intendedMajor) return false;
  const baseRate = parseFloat(props.college.acceptanceRate);
  const majorAdjusted = adjustAcceptanceRateByMajor(
    baseRate,
    props.studentProfile.intendedMajor,
    props.college.collegeType
  );
  return majorAdjusted < baseRate * 0.9;
});

const isEasierMajor = computed(() => {
  if (!props.college || !props.studentProfile || !props.studentProfile.intendedMajor) return false;
  const baseRate = parseFloat(props.college.acceptanceRate);
  const majorAdjusted = adjustAcceptanceRateByMajor(
    baseRate,
    props.studentProfile.intendedMajor,
    props.college.collegeType
  );
  return majorAdjusted > baseRate * 1.1;
});

const formatZScore = (score) => {
  if (score === undefined || score === null) return '0.00';
  return score.toFixed(2);
};

const getZScoreColor = (score) => {
  if (score === undefined || score === null) score = 0;
  if (score > 1.5) return 'success';
  if (score > 0) return 'info';
  if (score > -1.5) return 'warning';
  return 'error';
};

const formatNumber = (num) => {
  if (num === undefined || num === null) return '0.00';
  return num.toFixed(2);
};

const normalizeBlock = (blockValue) => {
  if (blockValue === undefined || blockValue === null) return 0;
  return Math.min(Math.max((blockValue + 2) * 25, 0), 100);
};

const formatRecommendation = (text) => {
  if (!text) return '';
  return text
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
};

</script>

<style scoped>
.text-disabled {
  color: rgba(0, 0, 0, 0.38);
}

.sticky-top-side::-webkit-scrollbar {
  width: 6px;
}
.sticky-top-side::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}
.sticky-top-side::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

.chancing-content {
  position: relative;
}

/* Subtle hover effects for interactive elements only */
.hoverable-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
  transition: background-color 0.2s ease;
  cursor: pointer;
}

/* Button-like hover effects for specific metrics cards */
.v-card.pa-3:hover {
  background-color: rgba(0, 0, 0, 0.03);
  transition: background-color 0.2s ease;
}

/* Hover for chips and interactive elements */
.v-chip:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
  transition: background-color 0.2s ease;
}

/* Button hover effects - no elevation */
.v-btn:hover {
  background-color: rgba(0, 0, 0, 0.04);
  transition: background-color 0.2s ease;
}

/* List item hover effects */
.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.03) !important;
  transition: background-color 0.2s ease;
}
</style>