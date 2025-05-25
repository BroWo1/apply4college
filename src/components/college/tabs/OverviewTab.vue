<template>
  <v-row>
    <v-col cols="12" md="8">
      <v-card flat class="mb-6" style="background-color: transparent;">
        <!-- Your Chances and Acceptance Rate -->
        <v-card class="mb-6 pa-4">
          <v-row>
            <v-col cols="12" md="6">
              <h3 class="text-h6 font-weight-bold mb-2">Your chances</h3>
              <div class="d-flex align-center">
                <div class="text-h4 font-weight-bold mr-2">{{ collegeChance.probabilityPercentage }}%</div>
                <v-chip :color="chanceColor" small>{{ chanceDescription }}</v-chip>
              </div>
              <v-btn color="primary" variant="text" @click="$emit('navigateToChancing')" class="mt-2">
                View Details
              </v-btn>
            </v-col>
            <v-col cols="12" md="6">
              <h3 class="text-h6 font-weight-bold mb-2">Acceptance rate</h3>
              <div class="text-h4 font-weight-bold">{{ college.acceptanceRate }}%</div>
            </v-col>
          </v-row>
        </v-card>

        <!-- A4C Ratings Overview -->
        <v-card v-if="college.a4cRatings && college.a4cRatings.overall !== 'N/A'" class="mb-6 pa-4">
          <v-row align="center">
            <v-col cols="12" md="5" class="text-center text-md-left mb-4 mb-md-0">
              <h3 class="text-h6 font-weight-bold mb-2">A4C Grade</h3>
              <v-progress-circular
                :model-value="overallScorePercentage"
                :size="100" 
                :width="10" 
                :color="overallGradeColor"
                class="mx-auto mx-md-0"
              >
                <span class="text-h5 font-weight-bold">{{ college.a4cRatings.overall }}</span>
              </v-progress-circular>
            </v-col>
            <v-col cols="12" md="7">
              <h4 class="text-subtitle-1 font-weight-medium mb-2">Key Categories:</h4>
              <v-row dense>
                <v-col
                  v-for="category in college.a4cRatings.categories?.slice(0, 2)" 
                  :key="category.name"
                  cols="12" sm="6"
                  class="mb-1 px-1"
                >
                  <v-card outlined class="fill-height d-flex flex-column pa-2" elevation="0">
                    <v-row align="center" no-gutters>
                      <v-col cols="auto" class="mr-2">
                        <v-avatar :color="getGradeColor(category.rating)" size="30">
                          <span class="white--text text-caption font-weight-bold">{{ category.rating }}</span>
                        </v-avatar>
                      </v-col>
                      <v-col>
                        <div class="text-caption font-weight-medium">{{ category.name }}</div>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-btn color="primary" variant="text" @click="$emit('navigateToA4CRating')" class="mt-4 d-block mx-auto mx-md-0">
            View Full Rating Details
          </v-btn>
        </v-card>

        <!-- College Type and Details -->
        <v-card class="mb-6 pa-4">
          <div class="text-body-1 mb-4">
            <span class="font-weight-bold">Private</span> school in {{ college.location.split(',')[1] }} with {{ college.totalStudents || '6,800' }} total undergraduate students
          </div>

          <div v-if="college.description" class="text-body-2 mb-4">
            {{ college.description }}
          </div>

          <v-chip-group>
            <v-chip small class="ma-1">Urban</v-chip>
            <v-chip small class="ma-1">{{ college.location.split(',')[1].trim() }}</v-chip>
            <v-chip small class="ma-1" v-if="college.religiousAffiliation">{{ college.religiousAffiliation }}</v-chip>
            <v-chip small class="ma-1" v-if="college.sportsDivision">{{ college.sportsDivision }}</v-chip>
            <v-chip small class="ma-1">{{ college.collegeType }}</v-chip>
          </v-chip-group>
        </v-card>

    
      </v-card>
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

        <!-- Similar Schools -->
        <v-card class="pa-4">
          <h3 class="text-h6 font-weight-bold mb-4">Similar schools</h3>
          <v-list>
            <v-list-item v-for="(school, index) in similarSchools" :key="index" :to="'/college/' + encodeURIComponent(school.name)">
              <template v-slot:prepend>
                <v-avatar size="40" class="mr-3">
                  <v-img :src="school.image" cover></v-img>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-medium">{{ school.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ school.location }}</v-list-item-subtitle>
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
  similarSchools: {
    type: Array,
    required: true,
  },
});

defineEmits(['navigateToChancing', 'saveToEarly', 'saveToRegular', 'navigateToA4CRating']);

const overallScorePercentage = computed(() => {
  if (props.college && props.college.a4cRatings)
    return gradeToScore(props.college.a4cRatings.overall);
  return 0;
});

const overallGradeColor = computed(() => {
  if (props.college && props.college.a4cRatings)
    return getGradeColor(props.college.a4cRatings.overall);
  return 'grey'; // Default color
});

const chanceColor = computed(() => {
  if (!props.collegeChance) return 'grey';
  return getAdmissionChanceColor(props.collegeChance.probability || 0.27);
});

const chanceDescription = computed(() => {
  if (!props.collegeChance) return 'Calculating...';
  return getAdmissionChanceDescription(props.collegeChance.probability || 0.27);
});

// Helper function to convert grade to a numerical score
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

// Helper function to get color for A4C rating chips (similar to A4CRatingTab)
const getGradeColor = (grade) => {
  const colors = {
    'A+': 'green',
    'A': 'green',
    'A-': 'green',
    'B+': 'lightgreen',
    'B': 'lightgreen',
    'B-': 'yellow',
    'C+': 'yellow',
    'C': 'orange',
    'C-': 'red',
    'D+': 'red',
    'D': 'red',
    'D-': 'darkred',
    'F': 'darkred'
  };
  return colors[grade] || 'grey';
};

</script>

<style scoped>
.white--text {
  color: white !important;
}

/* Custom scrollbar for sticky component if needed */
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
</style>