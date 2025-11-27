<template>
  <v-row>
    <v-col cols="12" md="8">
      <div class="overview-content">
        <!-- Your Chances and Acceptance Rate -->
        <v-card class="mb-6" elevation="1" rounded="lg">
          <v-card-item>
            <v-card-title class="d-flex align-center">
              <v-icon start>mdi-chart-pie</v-icon>
              Admission Overview
            </v-card-title>
          </v-card-item>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <div class="chance-section clickable-section" @click="$emit('navigateToChancing')">
                  <h3 class="text-h6 font-weight-bold mb-3 d-flex align-center">
                    <v-icon class="mr-2">mdi-target</v-icon>
                    Your Chances
                    <v-icon class="ml-auto" size="small">mdi-chevron-right</v-icon>
                  </h3>
                  <div class="d-flex align-center mb-3">
                    <div class="text-h3 font-weight-bold mr-3">{{ collegeChance.probabilityPercentage }}%</div>
                    <v-chip :color="chanceColor" variant="outlined" size="large">
                      {{ chanceDescription }}
                    </v-chip>
                  </div>
                  <div class="text-caption text-primary">
                    Click for detailed analysis
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="acceptance-section">
                  <h3 class="text-h6 font-weight-bold mb-3 d-flex align-center">
                    <v-icon class="mr-2">mdi-percent</v-icon>
                    Acceptance Rate
                  </h3>
                  <div class="d-flex align-center mb-3">
                    <div class="text-h3 font-weight-bold">{{ college.acceptanceRate }}%</div>
                    <v-progress-circular
                      :model-value="college.acceptanceRate"
                      :color="college.acceptanceRate > 20 ? 'success' : college.acceptanceRate > 10 ? 'warning' : 'error'"
                      :size="60"
                      :width="6"
                      class="ml-3"
                    >
                      <span class="text-caption">{{ college.acceptanceRate }}%</span>
                    </v-progress-circular>
                  </div>
                  <v-chip 
                    :color="college.acceptanceRate > 20 ? 'success' : college.acceptanceRate > 10 ? 'warning' : 'error'" 
                    variant="outlined" 
                    size="small"
                  >
                    {{ college.acceptanceRate > 20 ? 'Moderate' : college.acceptanceRate > 10 ? 'Competitive' : 'Highly Selective' }}
                  </v-chip>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- A4C Ratings Overview -->
        <!-- <v-card v-if="college.a4cRatings && college.a4cRatings.overall !== 'N/A'" class="mb-6 clickable-section" elevation="1" rounded="lg" @click="$emit('navigateToA4CRating')">
          <v-card-item>
            <v-card-title class="d-flex align-center">
              <v-icon start>mdi-star-circle</v-icon>
              A4C Grade Assessment
              <v-icon class="ml-auto" size="small">mdi-chevron-right</v-icon>
            </v-card-title>
          </v-card-item>
          <v-card-text>
            <v-row align="center">
              <v-col cols="12" md="5" class="text-center text-md-left mb-4 mb-md-0">
                <div class="grade-display">
                  <v-progress-circular
                    :model-value="overallScorePercentage"
                    :size="120"
                    :width="12"
                    :color="overallGradeColor"
                    class="mx-auto mx-md-0"
                  >
                    <span class="text-h4 font-weight-bold">{{ college.a4cRatings.overall }}</span>
                  </v-progress-circular>
                  <div class="text-subtitle-2 text-center mt-2">Overall Grade</div>
                </div>
              </v-col>
              <v-col cols="12" md="7">
                <h4 class="text-subtitle-1 font-weight-medium mb-3 d-flex align-center">
                  <v-icon start size="small">mdi-format-list-bulleted</v-icon>
                  Key Categories
                </h4>
                <v-row dense>
                  <v-col
                    v-for="category in college.a4cRatings.categories?.slice(0, 2)"
                    :key="category.name"
                    cols="12" sm="6"
                    class="mb-2"
                  >
                    <v-card variant="outlined" class="fill-height pa-3">
                      <div class="d-flex align-center">
                        <v-avatar :color="getGradeColor(category.rating)" size="36" class="mr-3">
                          <span class="text-white text-subtitle-2 font-weight-bold">{{ category.rating }}</span>
                        </v-avatar>
                        <div>
                          <div class="text-subtitle-2 font-weight-medium">{{ category.name }}</div>
                          <div class="text-caption">{{ getGradeDescription(category.rating) }}</div>
                        </div>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <div class="text-caption text-primary text-center mt-3">
              Click for complete rating analysis
            </div>
          </v-card-text>
        </v-card> -->

        <!-- College Type and Details -->
        <v-card class="mb-6" elevation="1" rounded="lg">
          <v-card-item>
            <v-card-title class="d-flex align-center">
              <v-icon start>mdi-school</v-icon>
              College Information
            </v-card-title>
          </v-card-item>
          <v-card-text>
            <div class="college-summary mb-4">
              <v-icon class="mr-2">mdi-map-marker</v-icon>
              <span class="font-weight-bold">Private</span> school in 
              <span class="font-weight-medium">{{ college.location.split(',')[1] }}</span> with 
              <span class="font-weight-bold">{{ college.totalStudents || '6,800' }}</span> total undergraduate students
            </div>

            <div v-if="college.description" class="college-description mb-4 pa-3" style="background: rgba(0, 0, 0, 0.05); border-radius: 8px; border-left: 4px solid #2196F3;">
              {{ college.description }}
            </div>

            <div class="tags-section">
              <h4 class="text-subtitle-2 font-weight-medium mb-2 d-flex align-center">
                <v-icon start size="small">mdi-tag-multiple</v-icon>
                Characteristics
              </h4>
              <v-chip-group>
                <v-chip variant="outlined" size="small" class="ma-1">Urban</v-chip>
                <v-chip variant="outlined" size="small" class="ma-1">{{ college.location.split(',')[1].trim() }}</v-chip>
                <v-chip v-if="college.religiousAffiliation" variant="outlined" size="small" class="ma-1">{{ college.religiousAffiliation }}</v-chip>
                <v-chip v-if="college.sportsDivision" variant="outlined" size="small" class="ma-1">{{ college.sportsDivision }}</v-chip>
                <v-chip variant="outlined" size="small" class="ma-1">{{ college.collegeType }}</v-chip>
              </v-chip-group>
            </div>
          </v-card-text>
        </v-card>

      </div>
    </v-col>

    <v-col cols="12" md="4">
      <!-- Request to Connect and AdmitChance Component -->
      <div class="r">
        <!-- Removed "Request to connect" card as requested -->

        <!-- Admit Chance Component Integration -->
        <AdmitChanceComponent
          :college="college"
          :studentProfile="studentProfile"
          :savedColleges="savedColleges"
          :recentlyViewed="recentlyViewed"
          @saveToEarly="$emit('saveToEarly', $event)"
          @saveToRegular="$emit('saveToRegular', $event)"
          :isDialogMode="false"
        />

        <!-- External Links -->
        <v-card class="pa-4">
          <h3 class="text-h6 font-weight-bold mb-4">External Resources</h3>
          <v-list>
            <v-list-item 
              :href="college.websiteUrl" 
              target="_blank" 
              rel="noopener noreferrer"
              class="mb-2"
            >
              <template v-slot:prepend>
                <v-icon class="mr-3" color="primary">mdi-web</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium">Official Website</v-list-item-title>
              <v-list-item-subtitle>Visit {{ college.name }}'s homepage</v-list-item-subtitle>
              <template v-slot:append>
                <v-icon>mdi-open-in-new</v-icon>
              </template>
            </v-list-item>
            
            <v-list-item 
              :href="college.usNewsUrl" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <template v-slot:prepend>
                <v-icon class="mr-3" color="blue">mdi-newspaper</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium">US News Rankings</v-list-item-title>
              <v-list-item-subtitle>View rankings and detailed info</v-list-item-subtitle>
              <template v-slot:append>
                <v-icon>mdi-open-in-new</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue';
import AdmitChanceComponent from '../../AdmitChanceComponent.vue'; // Corrected path
import { getAdmissionChanceColor, getAdmissionChanceDescription } from '../../../utils/admitChanceCalculator'; // Corrected path

const props = defineProps({
  college: {
    type: Object,
    required: true,
  },
  collegeChance: {
    type: Object,
    required: true,
  },
  studentProfile: {
    type: Object,
    required: true,
  },
  savedColleges: {
    type: Array,
    required: true,
  },
  recentlyViewed: {
    type: Array,
    required: true,
  },
});

defineEmits(['navigateToChancing', 'saveToEarly', 'saveToRegular']);

// const overallScorePercentage = computed(() => {
//   if (props.college && props.college.a4cRatings)
//     return gradeToScore(props.college.a4cRatings.overall);
//   return 0;
// });

// const overallGradeColor = computed(() => {
//   if (props.college && props.college.a4cRatings)
//     return getGradeColor(props.college.a4cRatings.overall);
//   return 'grey'; // Default color
// });

const chanceColor = computed(() => {
  if (!props.collegeChance) return 'grey';
  return getAdmissionChanceColor(props.collegeChance.probability || 0.27);
});

const chanceDescription = computed(() => {
  if (!props.collegeChance) return 'Calculating...';
  return getAdmissionChanceDescription(props.collegeChance.probability || 0.27);
});

// Helper function to convert grade to a numerical score
// const gradeToScore = (grade) => {
//   const mapping = {
//     'A+': 97, 'A': 93, 'A-': 90,
//     'B+': 87, 'B': 83, 'B-': 80,
//     'C+': 77, 'C': 73, 'C-': 70,
//     'D+': 67, 'D': 63, 'D-': 60,
//     'F': 50
//   };
//   return mapping[grade] || 0;
// };

// const getGradeColor = (grade) => {
//   const colors = {
//     'A+': 'green',
//     'A': 'green',
//     'A-': 'green',
//     'B+': 'lightgreen',
//     'B': 'lightgreen',
//     'B-': 'lightgreen',
//     'C+': 'yellow',
//     'C': 'yellow',
//     'C-': 'yellow',
//     'D+': 'orange',
//     'D': 'orange',
//     'D-': 'orange',
//     'F': 'red'
//   };
//   return colors[grade] || 'grey';
// };

// const getGradeDescription = (grade) => {
//   const descriptions = {
//     'A+': 'Excellent',
//     'A': 'Excellent',
//     'A-': 'Very Good',
//     'B+': 'Good',
//     'B': 'Good',
//     'B-': 'Good',
//     'C+': 'Average',
//     'C': 'Average',
//     'C-': 'Below Average',
//     'D+': 'Poor',
//     'D': 'Poor',
//     'D-': 'Poor',
//     'F': 'Very Poor'
//   };
//   return descriptions[grade] || 'N/A';
// };

</script>

<style scoped>
.overview-content {
  position: relative;
}

.chance-section, .acceptance-section {
  position: relative;
  padding: 8px;
  border-radius: 12px;
}

.grade-display {
  position: relative;
}

.college-summary {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #2196F3;
}

.college-description {
  font-style: italic;
  line-height: 1.6;
}

.tags-section {
  margin-top: 16px;
}

/* Selective hover effects for interactive elements only */
.v-btn:hover {
  background-color: rgba(0, 0, 0, 0.04);
  transition: background-color 0.2s ease;
}

.v-chip:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
  transition: background-color 0.2s ease;
}

/* Clickable sections with hover effects */
.clickable-section {
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 12px;
}

.clickable-section:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

@media (max-width: 960px) {
  .chance-section, .acceptance-section {
    margin-bottom: 16px;
  }
  
  .grade-display {
    margin-bottom: 16px;
  }
}
</style>