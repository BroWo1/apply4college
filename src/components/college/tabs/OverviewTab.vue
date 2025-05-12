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

        <!-- College Type and Details -->
        <v-card class="mb-6 pa-4">
          <div class="text-body-1 mb-4">
            <span class="font-weight-bold">Private</span> school in {{ college.location.split(',')[1] }} with {{ college.totalStudents || '6,800' }} total undergraduate students
          </div>

          <v-chip-group>
            <v-chip small class="ma-1">Urban</v-chip>
            <v-chip small class="ma-1">{{ college.location.split(',')[1].trim() }}</v-chip>
            <v-chip small class="ma-1" v-if="college.religiousAffiliation">{{ college.religiousAffiliation }}</v-chip>
            <v-chip small class="ma-1" v-if="college.sportsDivision">{{ college.sportsDivision }}</v-chip>
            <v-chip small class="ma-1">{{ college.collegeType }}</v-chip>
          </v-chip-group>
        </v-card>

        <!-- Contact Information -->
        <v-card class="mb-6 pa-4">
          
        </v-card>

        <!-- College Description -->
        <v-card class="mb-6 pa-4">
          <h3 class="text-h6 mb-3">About {{ college.name }}</h3>
          <p class="text-body-1">{{ college.description }}</p>
        </v-card>

        <!-- Key Information -->
        <v-card class="mb-6 pa-4">
          <h3 class="text-h6 mb-3">Key Information</h3>
          <v-list density="compact">
            <v-list-item>
              <v-list-item-title><strong>Tuition:</strong> ${{ college.tuition?.toLocaleString() }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title><strong>Student-Faculty Ratio:</strong> {{ college.studentFacultyRatio }}:1</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title><strong>Graduation Rate:</strong> {{ college.graduationRate }}%</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="college.averageSalaryAfter10Years">
              <v-list-item-title><strong>Avg. Salary (10 yrs post-grad):</strong> ${{ college.averageSalaryAfter10Years?.toLocaleString() }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- Campus Life -->
        <v-card class="mb-6 pa-4">
          <h3 class="text-h6 mb-3">Campus Life</h3>
          <v-chip-group column>
            <v-chip v-for="feature in college.campusLife" :key="feature" small class="ma-1">{{feature}}</v-chip>
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

defineEmits(['navigateToChancing', 'saveToEarly', 'saveToRegular']);

const chanceColor = computed(() => {
  if (!props.collegeChance) return 'grey';
  return getAdmissionChanceColor(props.collegeChance.probability || 0.27);
});

const chanceDescription = computed(() => {
  if (!props.collegeChance) return 'Calculating...';
  return getAdmissionChanceDescription(props.collegeChance.probability || 0.27);
});
</script>

<style scoped>

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