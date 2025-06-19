<template>
  <v-card class="pa-4" rounded="xl">
    <v-card-title class="d-flex align-center">
      <span class="text-h6">Personal Profile</span>
      <v-spacer></v-spacer>
      <v-btn
        to="/profile"
        variant="text"
        color="primary"
        density="comfortable"
        prepend-icon="mdi-pencil"
      >
        Edit
      </v-btn>
    </v-card-title>
    <v-divider class="my-2"></v-divider>

    <v-list density="compact">
      <!-- Basic Information -->
      <v-list-item>
        <template v-slot:prepend>
          <v-icon icon="mdi-school" class="mr-2"></v-icon>
        </template>
        <v-list-item-title>SAT Score: {{ satReading + satMath }}</v-list-item-title>
        <v-list-item-subtitle>GPA: {{ gpa }}</v-list-item-subtitle>
      </v-list-item>

      <!-- Intended Major -->
      <v-list-item>
        <template v-slot:prepend>
          <v-icon icon="mdi-book-open-variant" class="mr-2"></v-icon>
        </template>
        <v-list-item-title>Major: {{ intendedMajor || 'Not specified' }}</v-list-item-title>
      </v-list-item>

      <v-list-item>
        <template v-slot:prepend>
          <v-icon icon="mdi-book-multiple" class="mr-2"></v-icon>
        </template>
        <v-list-item-title>AP Classes: {{ apClasses.length }}</v-list-item-title>
        <v-list-item-subtitle v-if="apClasses.length > 0">
          Average score: {{ getAverageScore() }}
        </v-list-item-subtitle>
      </v-list-item>

      <!-- Extracurricular Summary -->
      <v-list-item>
        <template v-slot:prepend>
          <v-icon icon="mdi-trophy" class="mr-2"></v-icon>
        </template>
        <v-list-item-title>Activities: {{ extracurriculars.length }}</v-list-item-title>
        <v-list-item-subtitle v-if="extracurriculars.length > 0">
          Average level: {{ getAverageActivity() }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <div class="py-3 text-center">
      <v-btn
        to="/profile"
        color="primary"
        variant="outlined"
        block
      >
        View Full Profile
      </v-btn>
    </div>
  </v-card>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  satReading: { type: Number, default: 500 },
  satMath: { type: Number, default: 500 },
  gpa: { type: Number, default: 3.0 },
  intendedMajor: { type: String, default: '' },
  apClasses: { type: Array, default: () => [] },
  extracurriculars: { type: Array, default: () => [] }
});

// Helper function for average AP score
const getAverageScore = () => {
  if (props.apClasses.length === 0) return 'N/A';

  const scores = props.apClasses
    .map(ap => ap.score)
    .filter(score => score !== 'N/A' && typeof score === 'number');

  if (scores.length === 0) return 'N/A';
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return avg.toFixed(2);
};

const getAverageActivity = () => {
  if (props.extracurriculars.length === 0) return 'N/A';

  const levels = props.extracurriculars
    .map(activity => activity.level)

  const avgLevel = levels.reduce((a, b) => a + b, 0) / levels.length;
  return avgLevel.toFixed(2);

};
</script>
