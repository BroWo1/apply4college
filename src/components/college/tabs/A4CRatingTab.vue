<template>
  <v-row>
    <v-col cols="12" md="8">
      <div class="rating-content">
        <!-- Overall Grade Section -->
        <v-card class="mb-6" elevation="1" rounded="lg">
          <v-card-item>
            <v-card-title class="d-flex align-center">
              <v-icon start>mdi-star-circle</v-icon>
              A4C Grade Assessment
            </v-card-title>
            <v-card-subtitle>
              Comprehensive evaluation across key academic and campus life categories
            </v-card-subtitle>
          </v-card-item>
          <v-card-text>
            <v-row align="center">
              <v-col cols="12" md="5" class="text-center text-md-left mb-4 mb-md-0">
                <div class="overall-grade-display">
                  <v-progress-circular
                    :model-value="overallScorePercentage"
                    :size="160"
                    :width="12"
                    :color="overallGradeColor"
                    class="mx-auto mx-md-0"
                  >
                    <span class="text-h3 font-weight-bold">{{ overallRatingDisplay }}</span>
                  </v-progress-circular>
                  <div class="text-h6 font-weight-medium mt-3 text-center">Overall A4C Grade</div>
                  <div class="text-caption text-center mt-1">
                    {{ getGradeDescription(overallRatingDisplay) }} Performance
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="7">
                <div class="grade-explanation pa-4" style="background: rgba(0, 0, 0, 0.03); border-radius: 12px; border-left: 4px solid #2196F3;">
                  <h4 class="text-subtitle-1 font-weight-medium mb-2 d-flex align-center">
                    <v-icon start size="small" color="primary">mdi-information</v-icon>
                    Grade Breakdown
                  </h4>
                  <p class="text-body-2 mb-2">
                    Our A4C grading system evaluates colleges across multiple dimensions to give you a comprehensive view of institutional quality.
                  </p>
                  <div class="grade-scale">
                    <div class="d-flex align-center justify-space-between text-caption">
                      <span><strong>A+/A/A-:</strong> Excellent</span>
                      <span><strong>B+/B/B-:</strong> Good</span>
                      <span><strong>C+/C/C-:</strong> Average</span>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Category Breakdown -->
        <v-card class="mb-6" elevation="1" rounded="lg">
          <v-card-item>
            <v-card-title class="d-flex align-center">
              <v-icon start>mdi-format-list-bulleted</v-icon>
              Category Breakdown
            </v-card-title>
            <v-card-subtitle>
              Detailed performance across {{ ratingCategoriesDisplay.length }} key evaluation areas
            </v-card-subtitle>
          </v-card-item>
          <v-card-text>
            <v-row>
              <v-col
                v-for="(category, index) in ratingCategoriesDisplay"
                :key="category.name"
                cols="12" sm="6" md="4"
                class="mb-3"
              >
                <v-card 
                  variant="outlined" 
                  class="fill-height category-card pa-4"
                  :class="getCategoryCardClass(category.rating)"
                >
                  <div class="d-flex align-center mb-3">
                    <v-avatar 
                      :color="getGradeColor(category.rating)" 
                      size="48" 
                      class="mr-3"
                    >
                      <span class="white--text text-h6 font-weight-bold">{{ category.rating }}</span>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <div class="text-subtitle-1 font-weight-medium">{{ category.name }}</div>
                      <div class="text-caption" :style="`color: ${getGradeColor(category.rating)}`">
                        {{ getGradeDescription(category.rating) }}
                      </div>
                    </div>
                  </div>
                  
                  <!-- Progress bar showing grade as percentage -->
                  <v-progress-linear
                    :model-value="gradeToScore(category.rating)"
                    :color="getGradeColor(category.rating)"
                    height="8"
                    class="mb-2"
                    rounded
                  ></v-progress-linear>
                  
                  <div class="text-caption text-center">
                    Grade: {{ category.rating }}
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>


      </div>
    </v-col>

    <v-col cols="12" md="4">
      <div class="sticky-side">
        <!-- College Rating Comparison -->
        <v-card class="mb-6" elevation="1" rounded="lg">
          <v-card-item>
            <v-card-title class="d-flex align-center">
              <v-icon start>mdi-compare</v-icon>
              A4C Rating Comparison
            </v-card-title>
            <v-card-subtitle>
              See how {{ collegeName }} compares to other colleges
            </v-card-subtitle>
          </v-card-item>
          <v-card-text>
            <!-- Current College Highlight -->
            <v-card 
              variant="outlined" 
              class="mb-4 pa-3"
              :class="`border-${overallGradeColor.replace('#', '')}`"
              style="border-width: 2px !important;"
            >
              <div class="d-flex align-center">
                <v-avatar 
                  :color="overallGradeColor" 
                  size="40" 
                  class="mr-3"
                >
                  <span class="white--text text-h6 font-weight-bold">{{ overallRatingDisplay }}</span>
                </v-avatar>
                <div class="flex-grow-1">
                  <div class="text-subtitle-1 font-weight-bold">{{ collegeName }}</div>
                  <div class="text-caption" :style="`color: ${overallGradeColor}`">
                    Current College
                  </div>
                </div>
                <v-chip 
                  :color="overallGradeColor" 
                  size="small" 
                  variant="flat"
                >
                  {{ overallRatingDisplay }}
                </v-chip>
              </div>
            </v-card>

            <!-- Similar Rated Colleges -->
            <div class="mb-4">
              <h4 class="text-subtitle-2 font-weight-medium mb-3 d-flex align-center">
                <v-icon start size="small" color="primary">mdi-star-box</v-icon>
                Similar Rated Colleges
              </h4>
              <v-list density="compact">
                <v-list-item
                  v-for="college in getSimilarRatedColleges()"
                  :key="college.name"
                  class="pa-2 mb-1"
                  style="border-radius: 8px;"
                >
                  <template v-slot:prepend>
                    <v-avatar 
                      :color="getGradeColor(college.a4cRatings.overall)" 
                      size="32" 
                      class="mr-3"
                    >
                      <span class="white--text text-caption font-weight-bold">{{ college.a4cRatings.overall }}</span>
                    </v-avatar>
                  </template>
                  <div class="flex-grow-1">
                    <v-list-item-title class="text-subtitle-2">{{ college.name }}</v-list-item-title>
                    <v-list-item-subtitle class="text-caption">{{ college.location }}</v-list-item-subtitle>
                  </div>
                  <v-chip 
                    :color="getGradeColor(college.a4cRatings.overall)" 
                    size="x-small" 
                    variant="flat"
                  >
                    {{ college.a4cRatings.overall }}
                  </v-chip>
                </v-list-item>
              </v-list>
            </div>

            <!-- Higher Rated Colleges -->
            <div class="mb-4">
              <h4 class="text-subtitle-2 font-weight-medium mb-3 d-flex align-center">
                <v-icon start size="small" color="success">mdi-trending-up</v-icon>
                Higher Rated Colleges
              </h4>
              <v-list density="compact">
                <v-list-item
                  v-for="college in getHigherRatedColleges()"
                  :key="college.name"
                  class="pa-2 mb-1"
                  style="border-radius: 8px;"
                >
                  <template v-slot:prepend>
                    <v-avatar 
                      :color="getGradeColor(college.a4cRatings.overall)" 
                      size="32" 
                      class="mr-3"
                    >
                      <span class="white--text text-caption font-weight-bold">{{ college.a4cRatings.overall }}</span>
                    </v-avatar>
                  </template>
                  <div class="flex-grow-1">
                    <v-list-item-title class="text-subtitle-2">{{ college.name }}</v-list-item-title>
                    <v-list-item-subtitle class="text-caption">{{ college.location }}</v-list-item-subtitle>
                  </div>
                  <v-chip 
                    :color="getGradeColor(college.a4cRatings.overall)" 
                    size="x-small" 
                    variant="flat"
                  >
                    {{ college.a4cRatings.overall }}
                  </v-chip>
                </v-list-item>
              </v-list>
            </div>

            <!-- Rating Distribution -->
            <div>
              <h4 class="text-subtitle-2 font-weight-medium mb-3 d-flex align-center">
                <v-icon start size="small" color="info">mdi-chart-bar</v-icon>
                Rating Distribution
              </h4>
              <div class="rating-distribution">
                <div 
                  v-for="grade in ratingDistribution" 
                  :key="grade.grade"
                  class="d-flex align-center mb-2"
                >
                  <v-chip 
                    :color="getGradeColor(grade.grade)" 
                    size="small" 
                    variant="flat"
                    class="mr-3"
                    style="min-width: 40px;"
                  >
                    {{ grade.grade }}
                  </v-chip>
                  <v-progress-linear
                    :model-value="(grade.count / totalColleges) * 100"
                    :color="getGradeColor(grade.grade)"
                    height="6"
                    class="flex-grow-1 mr-2"
                    rounded
                  ></v-progress-linear>
                  <span class="text-caption">{{ grade.count }}</span>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Quick Actions Card -->
        <v-card elevation="1" rounded="lg">
          <v-card-item>
            <v-card-title class="d-flex align-center">
              <v-icon start>mdi-lightning-bolt</v-icon>
              Quick Actions
            </v-card-title>
          </v-card-item>
          <v-card-text>
            <v-btn
              block
              variant="outlined"
              color="primary"
              class="mb-3"
              @click="showGradeInfoDialog = true"
            >
              <v-icon start>mdi-information-outline</v-icon>
              How Grades Work
            </v-btn>
            
            <v-btn
              block
              variant="outlined"
              color="secondary"
              @click="showDataSourceDialog = true"
            >
              <v-icon start>mdi-source-branch</v-icon>
              View Data Sources
            </v-btn>
          </v-card-text>
        </v-card>
      </div>
    </v-col>

    <!-- Dialogs (kept for detailed information) -->
    <v-dialog v-model="showGradeInfoDialog" max-width="600px">
      <v-card rounded="lg">
        <v-card-item>
          <v-card-title class="d-flex align-center">
            <v-icon start>mdi-information</v-icon>
            How Grades Are Calculated
          </v-card-title>
        </v-card-item>
        <v-card-text>
          <p class="mb-3">Our A4C grading system provides a comprehensive overview of a college's strengths and weaknesses across various categories. Each category is assigned a letter grade from A+ to F, based on a proprietary algorithm that considers multiple data points.</p>
          <p class="mb-3">The overall grade is a weighted average of these category grades, designed to give you a quick snapshot of the college's quality.</p>
          
          <v-divider class="my-4"></v-divider>
          
          <h4 class="text-subtitle-1 font-weight-bold mb-3">Grading Scale:</h4>
          <v-list density="compact">
            <v-list-item>
              <template v-slot:prepend>
                <v-chip color="success" size="small" class="mr-3">A+/A/A-</v-chip>
              </template>
              <v-list-item-title>Excellent (90-100)</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-chip color="info" size="small" class="mr-3">B+/B/B-</v-chip>
              </template>
              <v-list-item-title>Good (80-89)</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-chip color="warning" size="small" class="mr-3">C+/C/C-</v-chip>
              </template>
              <v-list-item-title>Average (70-79)</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-chip color="orange" size="small" class="mr-3">D+/D/D-</v-chip>
              </template>
              <v-list-item-title>Below Average (60-69)</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-chip color="error" size="small" class="mr-3">F</v-chip>
              </template>
              <v-list-item-title>Poor (Below 60)</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="showGradeInfoDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDataSourceDialog" max-width="600px">
      <v-card rounded="lg">
        <v-card-item>
          <v-card-title class="d-flex align-center">
            <v-icon start>mdi-source-branch</v-icon>
            Data Sources
          </v-card-title>
        </v-card-item>
        <v-card-text>
          <p class="mb-4">Our ratings are derived from a variety of sources to ensure accuracy and comprehensiveness:</p>
          
          <v-list>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary" class="mr-3">mdi-government</v-icon>
              </template>
              <div>
                <v-list-item-title class="font-weight-medium">National Center for Education Statistics (NCES)</v-list-item-title>
                <v-list-item-subtitle>Official federal education data and statistics</v-list-item-subtitle>
              </div>
            </v-list-item>
            
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary" class="mr-3">mdi-school</v-icon>
              </template>
              <div>
                <v-list-item-title class="font-weight-medium">Institutional Self-Reporting</v-list-item-title>
                <v-list-item-subtitle>Data provided directly by colleges and universities</v-list-item-subtitle>
              </div>
            </v-list-item>
            
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary" class="mr-3">mdi-account-group</v-icon>
              </template>
              <div>
                <v-list-item-title class="font-weight-medium">Student Surveys & Reviews</v-list-item-title>
                <v-list-item-subtitle>Feedback from current students and alumni</v-list-item-subtitle>
              </div>
            </v-list-item>
            
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary" class="mr-3">mdi-robot</v-icon>
              </template>
              <div>
                <v-list-item-title class="font-weight-medium">A4C Proprietary Analysis</v-list-item-title>
                <v-list-item-subtitle>Machine learning models and algorithmic evaluation</v-list-item-subtitle>
              </div>
            </v-list-item>
          </v-list>
          
          <v-alert type="info" variant="tonal" class="mt-4">
            <v-icon start>mdi-clock</v-icon>
            We strive to use the most current data available, typically from the last academic year.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="showDataSourceDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup>
import { ref, computed } from 'vue';
import { colleges } from '@/data/colleges';

const props = defineProps({
  college: {
    type: Object,
    required: true,
  }
});

const collegeName = computed(() => props.college ? props.college.name : 'this school');

// --- Grade Data & Logic ---
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
  return getGradeColor(overallRatingDisplay.value);
});

const getGradeDescription = (grade) => {
  const descriptions = {
    'A+': 'Excellent',
    'A': 'Excellent', 
    'A-': 'Very Good',
    'B+': 'Good',
    'B': 'Good',
    'B-': 'Good',
    'C+': 'Average',
    'C': 'Average',
    'C-': 'Below Average',
    'D+': 'Poor',
    'D': 'Poor',
    'D-': 'Poor',
    'F': 'Very Poor'
  };
  return descriptions[grade] || 'N/A';
};

const getCategoryCardClass = (grade) => {
  const score = gradeToScore(grade);
  if (score >= 90) return 'category-card-excellent';
  if (score >= 80) return 'category-card-good';
  if (score >= 70) return 'category-card-average';
  return 'category-card-below';
};

// --- College Comparison Logic ---
const currentCollegeScore = computed(() => gradeToScore(overallRatingDisplay.value));

// Get colleges with valid A4C ratings, excluding current college
const validColleges = computed(() => {
  return colleges.filter(college => 
    college.a4cRatings && 
    college.a4cRatings.overall && 
    college.a4cRatings.overall !== 'N/A' &&
    college.name !== props.college?.name
  );
});

const getSimilarRatedColleges = () => {
  const currentScore = currentCollegeScore.value;
  const threshold = 5; // Within 5 points
  
  return validColleges.value
    .filter(college => {
      const collegeScore = gradeToScore(college.a4cRatings.overall);
      return Math.abs(collegeScore - currentScore) <= threshold;
    })
    .sort((a, b) => {
      const scoreA = gradeToScore(a.a4cRatings.overall);
      const scoreB = gradeToScore(b.a4cRatings.overall);
      return Math.abs(scoreA - currentScore) - Math.abs(scoreB - currentScore);
    })
    .slice(0, 4);
};

const getHigherRatedColleges = () => {
  const currentScore = currentCollegeScore.value;
  
  return validColleges.value
    .filter(college => {
      const collegeScore = gradeToScore(college.a4cRatings.overall);
      return collegeScore > currentScore;
    })
    .sort((a, b) => {
      const scoreA = gradeToScore(a.a4cRatings.overall);
      const scoreB = gradeToScore(b.a4cRatings.overall);
      return scoreB - scoreA; // Highest first
    })
    .slice(0, 4);
};

// Rating distribution across all colleges
const ratingDistribution = computed(() => {
  const distribution = {};
  const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
  
  // Initialize all grades with 0 count
  grades.forEach(grade => {
    distribution[grade] = 0;
  });
  
  // Count colleges by grade
  validColleges.value.forEach(college => {
    const grade = college.a4cRatings.overall;
    if (distribution.hasOwnProperty(grade)) {
      distribution[grade]++;
    }
  });
  
  // Convert to array and filter out grades with 0 count
  return grades
    .map(grade => ({ grade, count: distribution[grade] }))
    .filter(item => item.count > 0)
    .sort((a, b) => gradeToScore(b.grade) - gradeToScore(a.grade));
});

const totalColleges = computed(() => {
  return validColleges.value.length;
});

// Dialog visibility
const showGradeInfoDialog = ref(false);
const showDataSourceDialog = ref(false);

</script>

<style scoped>
.rating-content {
  position: relative;
}

.overall-grade-display {
  position: relative;
}

.grade-explanation {
  position: relative;
}

.category-card {
  transition: all 0.2s ease;
  border-radius: 12px;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.category-card-excellent {
  border-left: 4px solid #28a745;
}

.category-card-good {
  border-left: 4px solid #17a2b8;
}

.category-card-average {
  border-left: 4px solid #ffc107;
}

.category-card-below {
  border-left: 4px solid #fd7e14;
}

.white--text {
  color: white !important;
}

.fill-height {
  height: 100%;
}

.v-avatar span {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.sticky-side {
  position: sticky;
  top: 20px;
}

.summary-stats .stat-item {
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.summary-stats .stat-item:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

.grade-scale {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  padding: 8px;
}

/* College Comparison Styles */
.rating-distribution {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 12px;
}

.v-list-item {
  border-radius: 8px;
  transition: all 0.2s ease;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04) !important;
  transform: translateX(4px);
}

/* Custom border color classes */
.border-28a745 {
  border-color: #28a745 !important;
}

.border-17a2b8 {
  border-color: #17a2b8 !important;
}

.border-ffc107 {
  border-color: #ffc107 !important;
}

.border-fd7e14 {
  border-color: #fd7e14 !important;
}

.border-dc3545 {
  border-color: #dc3545 !important;
}

/* Hover effects for interactive elements */
.v-btn:hover {
  background-color: rgba(0, 0, 0, 0.04);
  transition: background-color 0.2s ease;
}

.v-chip:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
  transition: background-color 0.2s ease;
}

@media (max-width: 960px) {
  .overall-grade-display {
    margin-bottom: 16px;
  }
  
  .sticky-side {
    position: relative;
    top: 0;
  }
}
</style>