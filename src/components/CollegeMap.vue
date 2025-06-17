<template>
  <div class="college-map-container">
    <!-- Header -->
     <!--
    <div class="map-header">
      <h1 class="text-h4 font-weight-bold mb-2">College Map</h1>
      <p class="text-subtitle-1 text-medium-emphasis mb-4">
        Explore colleges across the United States. Markers show your personalized admission chances based on your profile.
      </p>
    </div>
    -->

    <!-- Legend for marker colors - REMAINS REMOVED as per previous step -->
    <!-- 
    <v-card class="mb-4" elevation="1" variant="tonal">
      ...
    </v-card>
    -->

    <!-- Map Container -->
    <v-card elevation="4" class="map-card">
      <div
        ref="mapContainer"
        class="map-container"
        style="height: 600px; width: 100%;"
      />
    </v-card>

    <!-- Floating Filters at bottom -->
    <v-card 
      class="floating-filters" 
      elevation="8"
      rounded="xl"
    >
      <v-card-text class="py-3">
        <v-row dense>
          <v-col cols="12" md="3">
            <v-select
              v-model="selectedType"
              :items="collegeTypes"
              label="College Type"
              variant="outlined"
              density="compact"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="selectedAcceptanceRange"
              :items="acceptanceRanges"
              label="Acceptance Rate"
              variant="outlined"
              density="compact"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="searchQuery"
              label="Search colleges..."
              variant="outlined"
              density="compact"
              clearable
              prepend-inner-icon="mdi-magnify"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              @click="resetFilters"
              variant="outlined"
              block
              color="secondary"
              size="default"
            >
              Reset
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- AdmitChance Component for clicked college -->
    <AdmitChanceComponent
      v-if="selectedCollege"
      v-model="showAdmitChanceDialog"
      :college="selectedCollege"
      :student-profile="currentStudentProfile"
      :saved-colleges="[]"
      :recently-viewed="[]"
      @close="closeAdmitChanceDialog"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { colleges } from '@/data/colleges';
import { addCoordinatesToColleges } from '@/utils/collegeCoordinates';
import AdmitChanceComponent from '@/components/AdmitChanceComponent.vue';
import { useUserStore } from '@/stores/user';
import { calculateAdmissionChance, prepareStudentData } from '@/utils/admitChanceCalculator';

// Router and store
const router = useRouter();
const userStore = useUserStore();

// Reactive data
const mapContainer = ref(null);
const map = ref(null);
const markers = ref([]);
const selectedCollege = ref(null);
const showAdmitChanceDialog = ref(false);

// Filters
const selectedType = ref(null);
const selectedAcceptanceRange = ref(null);
const searchQuery = ref('');

// Default student profile for map interactions
const defaultStudentProfile = ref({
  gpa: 3.8,
  satReading: 700,
  satMath: 720,
  apClasses: [
    { name: 'AP Calculus BC', score: 5, status: 'completed', fitScore: 0.9 },
    { name: 'AP Physics 1', score: 4, status: 'completed', fitScore: 0.8 },
    { name: 'AP English Literature', score: 4, status: 'completed', fitScore: 0.7 },
    { name: 'AP US History', score: 5, status: 'completed', fitScore: 0.8 },
    { name: 'AP Computer Science A', score: 5, status: 'completed', fitScore: 0.9 }
  ],
  extracurriculars: [
    { name: 'Math Olympiad', level: 4, fitScore: 0.9 }, // 4 = Very Strong / High Distinction
    { name: 'Debate Team Captain', level: 3, fitScore: 0.8 }, // 3 = Strong / Significant Award
    { name: 'Volunteer Tutoring', level: 2, fitScore: 0.7 }, // 2 = Somewhat Strong / Notable Achievement
    { name: 'Science Fair Winner', level: 4, fitScore: 0.8 } // 4 = Very Strong / High Distinction
  ],
  intendedMajor: 'Computer Science',
  recScore: 4, // 4 = Very Strong (was 8, but scale is 1-5)
  isLegacy: false,
  demoScore: 5,
  nationality: 'US',
  gender: 'prefer-not-to-say',
  enableBitterByCoffee: false
});

// Use actual user profile if available, otherwise use default
const currentStudentProfile = computed(() => {
  // Try to get the actual user profile from localStorage
  try {
    const profileKey = userStore.isAuthenticated ? 'userProfileData' : 'guestProfileData';
    const storedProfile = localStorage.getItem(profileKey);
    
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      
      // Return a properly structured profile, merging with defaults for missing fields
      return {
        gpa: parsedProfile.gpa || defaultStudentProfile.value.gpa,
        satReading: parsedProfile.satReading || defaultStudentProfile.value.satReading,
        satMath: parsedProfile.satMath || defaultStudentProfile.value.satMath,
        apClasses: parsedProfile.apClasses || defaultStudentProfile.value.apClasses,
        extracurriculars: parsedProfile.extracurriculars || defaultStudentProfile.value.extracurriculars,
        intendedMajor: parsedProfile.intendedMajor || defaultStudentProfile.value.intendedMajor,
        recScore: parsedProfile.recScore || defaultStudentProfile.value.recScore,
        isLegacy: parsedProfile.isLegacy || defaultStudentProfile.value.isLegacy,
        demoScore: parsedProfile.demoScore || defaultStudentProfile.value.demoScore,
        nationality: parsedProfile.nationality || defaultStudentProfile.value.nationality,
        gender: parsedProfile.gender || defaultStudentProfile.value.gender,
        enableBitterByCoffee: parsedProfile.enableBitterByCoffee || defaultStudentProfile.value.enableBitterByCoffee
      };
    }
  } catch (error) {
    console.warn('Error loading user profile for map, using default:', error);
  }
  
  // Fall back to default profile
  return defaultStudentProfile.value;
});

// Filter options
const collegeTypes = [
  { title: 'All Types', value: null },
  { title: 'STEM-heavy', value: 'STEM-heavy' },
  { title: 'Liberal Arts', value: 'Liberal-arts' }
];

const acceptanceRanges = [
  { title: 'All Ranges', value: null },
  { title: 'Elite (< 10%)', value: 'elite' }, // This remains for filtering, but legend/color logic changes
  { title: 'Reach (< 20%)', value: 'reach_map' }, // New/adjusted for map legend
  { title: 'Target (20-50%)', value: 'target_map' }, // New/adjusted for map legend
  { title: 'Safety (> 50%)', value: 'safety_map' } // New/adjusted for map legend
];

// Computed college data with coordinates
const collegesWithCoordinates = computed(() => {
  return addCoordinatesToColleges(colleges);
});

// Filtered colleges
const filteredColleges = computed(() => {
  let filtered = [...collegesWithCoordinates.value];

  // Filter by type
  if (selectedType.value) {
    filtered = filtered.filter(college => college.collegeType === selectedType.value);
  }

  // Filter by acceptance range
  if (selectedAcceptanceRange.value) {
    switch (selectedAcceptanceRange.value) {
      case 'elite': // Keep this for filtering if needed, or adjust if it should align with new map legend
        filtered = filtered.filter(college => college.acceptanceRate < 10);
        break;
      // Add cases for new/adjusted map legend values if they are used for filtering
      // Or, if the existing 'elite', 'target', 'safety' values in the dropdown
      // should now map to the new ranges for filtering, update these conditions:
      case 'target': // This was 10-20, if it means the new "Target (20-50%)" for filtering:
        filtered = filtered.filter(college => college.acceptanceRate >= 20 && college.acceptanceRate <= 50);
        break;
      case 'safety': // This was >20, if it means the new "Safety (>50%)" for filtering:
        filtered = filtered.filter(college => college.acceptanceRate > 50);
        break;
      // It might be clearer to rename the values in acceptanceRanges to avoid confusion
      // e.g., elite_filter, target_filter_old, safety_filter_old
      // and then add new ones for the map's visual representation if filtering logic is different.
      // For now, I'll assume the filter dropdown's 'target' and 'safety' should map to the new ranges.
      // And 'elite' still means <10 for filtering.
      // If 'Reach (<20%)' from legend needs a filter option:
      case 'reach_map':
         filtered = filtered.filter(college => college.acceptanceRate < 20);
         break;
    }
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(college =>
      college.name.toLowerCase().includes(query) ||
      college.location.toLowerCase().includes(query)
    );
  }

  return filtered;
});

// Initialize map
const initializeMap = () => {
  if (!mapContainer.value) return;

  // Create map
  map.value = L.map(mapContainer.value).setView([39.8283, -98.5795], 4);

  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map.value);

  // Add markers
  updateMarkers();
};

// Update markers based on filtered colleges
const updateMarkers = () => {
  if (!map.value) return;

  // Clear existing markers
  markers.value.forEach(marker => {
    map.value.removeLayer(marker);
  });
  markers.value = [];

  // Add new markers
  filteredColleges.value.forEach(college => {
    if (!college.coordinates) return;

    // Calculate personalized admission chance
    const admissionChance = calculateCollegeAdmissionChance(college);
    const markerColor = getMarkerColor(admissionChance);
    
    // Create custom icon with calculated admission chance
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="marker-pin" style="background-color: ${markerColor};">
          <div class="marker-content">${admissionChance}%</div>
        </div>
      `,
      iconSize: [30, 40],
      iconAnchor: [15, 40]
    });

    const marker = L.marker([college.coordinates.lat, college.coordinates.lng], {
      icon: customIcon
    }).addTo(map.value);

    // Create hover tooltip content
    const tooltipContent = `
      <div style="text-align: center; min-width: 180px; font-size: 12px;">
        <strong style="font-size: 13px;">${college.name}</strong><br>
        <span style="color: #1976d2; font-weight: bold;">Your Chance: ${admissionChance}%</span>
      </div>
    `;

    // Create detailed popup content
    const popupContent = `
      <div style="text-align: center; min-width: 220px;">
        <strong>${college.name}</strong><br>
        ${college.location}<br>
        <div style="margin: 8px 0;">
          <span style="color: #1976d2; font-weight: bold;">Your Admission Chance: ${admissionChance}%</span><br>
          <span style="color: #666; font-size: 0.9em;">College Acceptance Rate: ${college.acceptanceRate}%</span>
        </div>
        <span style="color: #388e3c;">Tuition: $${college.tuition?.toLocaleString()}</span><br>
        <small style="color: #666;">Click marker for detailed analysis</small>
      </div>
    `;

    // Add hover tooltip that appears quickly
    marker.bindTooltip(tooltipContent, {
      permanent: false,
      direction: 'top',
      offset: [0, -40],
      opacity: 0.9,
      className: 'custom-tooltip'
    });

    // Add click popup with detailed info

    // Add click event to open AdmitChance component
    marker.on('click', () => {
      selectedCollege.value = college;
      showAdmitChanceDialog.value = true;
    });

    markers.value.push(marker);
  });
};

// Helper functions
const getMarkerColor = (admissionChance) => { // Changed parameter to admissionChance
  if (admissionChance < 20) return '#d32f2f'; // Red for reach
  if (admissionChance <= 50) return '#f57c00'; // Orange for target
  return '#388e3c'; // Green for safety
};

// Calculate admission chance for a college
const calculateCollegeAdmissionChance = (college) => {
  try {
    const studentData = prepareStudentData({
      ...currentStudentProfile.value,
      isLegacy: false, // Default to false for map display
      isEarlyDecision: false // Default to regular decision for map display
    });
    
    const chanceResult = calculateAdmissionChance(studentData, college);
    return chanceResult?.probabilityPercentage || 0;
  } catch (error) {
    console.warn('Error calculating admission chance for', college.name, ':', error);
    return 0;
  }
};

const resetFilters = () => {
  selectedType.value = null;
  selectedAcceptanceRange.value = null;
  searchQuery.value = '';
};

const closeAdmitChanceDialog = () => {
  showAdmitChanceDialog.value = false;
  selectedCollege.value = null;
};

// Watch for filter changes and profile changes
watch(filteredColleges, () => {
  updateMarkers();
}, { deep: true });

watch(currentStudentProfile, () => {
  updateMarkers();
}, { deep: true });

// Lifecycle
onMounted(() => {
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  setTimeout(() => {
    initializeMap();
  }, 100);
});

onBeforeUnmount(() => {
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
  if (map.value) {
    map.value.remove();
  }
});
</script>

<style scoped>
.college-map-container {
  padding: 20px;
  position: relative; /* Restored original, was implicitly kept */
  /* Removed: position: fixed, top, left, width, height, z-index, background-color */
}

.map-header {
  text-align: center;
  margin-bottom: 20px;
}

.map-card {
  margin-bottom: 20px; /* Restored */
  /* Removed: width: 100%; height: 100%; border-radius: 0 !important; box-shadow: none !important; */
}

.map-container {
  border-radius: 8px; /* Restored */
  /* Removed: height: 100%; width: 100%; */
}

/* Floating filters at bottom */
.floating-filters {
  position: fixed;
  bottom: 60px; /* Restored original value */
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  max-width: 90vw;
  width: 100%;
  max-width: 1200px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.floating-filters .v-card-text {
  padding-bottom: 12px !important;
}

/* Custom marker styles */
:deep(.custom-marker) {
  background: transparent;
  border: none;
}

:deep(.marker-pin) {
  width: 30px;
  height: 30px;
  border-radius: 50% 50% 50% 0;
  position: absolute;
  transform: rotate(-45deg);
  left: 50%;
  top: 50%;
  margin: -15px 0 0 -15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  transition: transform 0.2s ease;
}

:deep(.marker-pin:hover) {
  transform: rotate(-45deg) scale(1.1);
}

:deep(.marker-content) {
  transform: rotate(45deg);
  color: white;
  font-weight: bold;
  font-size: 10px;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
}

/* Custom tooltip styles */
:deep(.custom-tooltip) {
  background: rgba(0, 0, 0, 0.85) !important;
  color: white !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 8px 12px !important;
  font-size: 12px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
}

:deep(.custom-tooltip .leaflet-tooltip-content) {
  margin: 0 !important;
  line-height: 1.4 !important;
}

/* Popup styles */
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
}

:deep(.leaflet-popup-content) {
  margin: 8px 12px;
  line-height: 1.4;
}

.marker-legend {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  border: 1px solid white;
  box-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

/* Responsive adjustments for floating filters */
@media (max-width: 960px) {
  .floating-filters {
    bottom: 10px; /* Ensured original responsive value */
    left: 10px;
    right: 10px;
    transform: none;
    max-width: none;
  }
}

@media (max-width: 600px) {
  .college-map-container {
    padding: 10px; /* Restored */
  }
  
  .floating-filters .v-row {
    margin: 0;
  }
  
  .floating-filters .v-col {
    padding: 2px 4px;
  }
}
</style>
