<template>
  <v-container>
    <v-row>
      <!-- Overall Grade Section -->
      <v-col cols="12" md="4" class="text-center">
        <div class="overall-grade-container">
          <v-progress-circular
            :model-value="overallScorePercentage"
            :size="180"
            :width="15"
            :color="overallGradeColor"
            class="mx-auto"
          >
            <!-- Ensure overallRating computed prop is used here -->
            <span class="text-h3 font-weight-bold">{{ overallRatingDisplay }}</span>
          </v-progress-circular>
          <h2 class="text-h5 mt-4 mb-1">Overall A4C Grade</h2>
          <p class="text-caption">
            <a href="#" @click.prevent="showGradeInfoDialog = true">How are grades calculated?</a>
          </p>
          <p class="text-caption">
            <a href="#" @click.prevent="showDataSourceDialog = true">Data Sources</a>
          </p>
        </div>
      </v-col>

      <!-- Sub-Category Ratings Section -->
      <v-col cols="12" md="8">
        <v-row dense>
          <v-col
            v-for="category in ratingCategoriesDisplay"
            :key="category.name"
            cols="12" sm="6"
            class="mb-2"
          >
            <v-card class="fill-height d-flex flex-column">
              <v-card-text class="flex-grow-1">
                <v-row align="center" no-gutters>
                  <v-col cols="auto" class="mr-3">
                    <v-avatar :color="getGradeColor(category.rating)" size="40">
                      <span class="white--text text-subtitle-1 font-weight-bold">{{ category.rating }}</span>
                    </v-avatar>
                  </v-col>
                  <v-col>
                    <div class="text-subtitle-1 font-weight-medium">{{ category.name }}</div>
                  </v-col>
                </v-row>
              </v-card-text>
              <!-- Optional: Add a small description or link to more info if needed -->
              <!-- <v-card-actions>
                <v-btn text small color="primary">Details</v-btn>
              </v-card-actions> -->
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Dialog for Grade Calculation Info -->
    <v-dialog v-model="showGradeInfoDialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h5">How Grades Are Calculated</v-card-title>
        <v-card-text>
          <p>Our A4C grading system provides a comprehensive overview of a college's strengths and weaknesses across various categories. Each category is assigned a letter grade from A+ to F, based on a proprietary algorithm that considers multiple data points.</p>
          <p>The overall grade is a weighted average of these category grades, designed to give you a quick snapshot of the college's quality.</p>
          <p><strong>Grading Scale:</strong></p>
          <ul>
            <li>A+, A, A-: Excellent</li>
            <li>B+, B, B-: Good</li>
            <li>C+, C, C-: Average</li>
            <li>D+, D, D-: Below Average</li>
            <li>F: Poor</li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showGradeInfoDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog for Data Sources Info -->
    <v-dialog v-model="showDataSourceDialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h5">Data Sources</v-card-title>
        <v-card-text>
          <p>Our ratings are derived from a variety of sources to ensure accuracy and comprehensiveness. These include:</p>
          <ul>
            <li>Publicly available data from the National Center for Education Statistics (NCES)</li>
            <li>Self-reported data from colleges and universities</li>
            <li>Student surveys and reviews from reputable platforms</li>
            <li>Proprietary A4C analysis and machine learning models</li>
          </ul>
          <p>We strive to use the most current data available, typically from the last academic year.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showDataSourceDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  college: {
    type: Object,
    required: true,
  }
});

const collegeName = computed(() => props.college ? props.college.name : 'this school');

// --- Grade Data & Logic ---
// Use computed properties to get data from the college prop
const overallRatingDisplay = computed(() => {
  return props.college && props.college.a4cRatings ? props.college.a4cRatings.overall : 'N/A';
});

const ratingCategoriesDisplay = computed(() => {
  return props.college && props.college.a4cRatings ? props.college.a4cRatings.categories : [];
});

const gradeToScore = (grade) => {
  const mapping = {
    'A+': 97, 'A': 93, 'A-': 90,
    'B+': 87, 'B': 83, 'B-': 80,
    'C+': 77, 'C': 73, 'C-': 70,
    'D+': 67, 'D': 63, 'D-': 60,
    'F': 50
  };
  return mapping[grade] || 0;
};

const overallScorePercentage = computed(() => {
  // Use the computed overallRatingDisplay for score calculation
  return gradeToScore(overallRatingDisplay.value);
});

const getGradeColor = (grade) => {
  const score = gradeToScore(grade);
  if (score >= 90) return '#28a745'; // Green (A range)
  if (score >= 80) return '#17a2b8'; // Blue (B range)
  if (score >= 70) return '#ffc107'; // Yellow (C range)
  if (score >= 60) return '#fd7e14'; // Orange (D range)
  return '#dc3545'; // Red (F)
};

const overallGradeColor = computed(() => {
  // Use the computed overallRatingDisplay for color calculation
  return getGradeColor(overallRatingDisplay.value);
});

// Dialog visibility
const showGradeInfoDialog = ref(false);
const showDataSourceDialog = ref(false);

</script>

<style scoped>
.overall-grade-container {
  padding: 20px;
  border-radius: 8px;
  /* background-color: #f9f9f9; */ /* Optional background for the overall grade section */
}

.white--text {
  color: white !important;
}

/* Ensure cards in the grid take full height to align nicely */
.fill-height {
  height: 100%;
}

/* Adjust avatar and text alignment */
.v-avatar span {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
</style>
