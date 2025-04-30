<template>
  <v-container fluid class="pa-0" style="max-width: 2000px">
    <!-- Header and Search Bar -->
    <v-container class="text-center py-6">
      <h1 class="text-h2 font-weight-bold mb-6">Apply 4 College .ai</h1>
      <v-text-field
        label="Search Colleges"
        variant="solo-filled"
        prepend-inner-icon="mdi-magnify"
        clearable
        class="mx-auto py-2"
        style="max-width: 600px"
      ></v-text-field>
    </v-container>

    <!-- Main Content with Categories and College List -->
    <v-row class="fill-height ma-0">
      <!-- Left Category Panel -->
      <v-col cols="12" md="3" class="pa-3 hidden-sm-and-down">
        <v-card class="pa-4" rounded="lg">
          <v-card-title class="text-h6">Personal Profile</v-card-title>
          <v-divider class="my-2"></v-divider>

          <v-expansion-panels variant="accordion">
            <v-expansion-panel title="Standardized Test">
              <v-expansion-panel-text>
                <v-checkbox v-for="(region, i) in regions" :key="i" :label="region"></v-checkbox>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel title="AP and Honors">
              <v-expansion-panel-text>
                <v-checkbox v-for="(program, i) in programs" :key="i" :label="program"></v-checkbox>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel title="Extracurricular">
              <v-expansion-panel-text>
                <v-range-slider
                  v-model="acceptanceRange"
                  :max="100"
                  :min="0"
                  :step="5"
                  color="primary"
                >
                  <template v-slot:prepend>
                    <v-text-field
                      :model-value="acceptanceRange[0]"
                      hide-details
                      density="compact"
                      type="number"
                      style="width: 60px"
                    ></v-text-field>
                  </template>
                  <template v-slot:append>
                    <v-text-field
                      :model-value="acceptanceRange[1]"
                      hide-details
                      density="compact"
                      type="number"
                      style="width: 60px"
                    ></v-text-field>
                  </template>
                </v-range-slider>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-col>

      <!-- College List - Middle Section -->
      <v-col cols="12" md="6" class="pa-3">
        <v-card class="mb-4" variant="outlined" rounded="lg">
          <v-card-title class="d-flex align-center">
            <span class="text-h6">Colleges ({{ colleges.length }})</span>
            <v-spacer></v-spacer>
            <v-select
              v-model="sortBy"
              :items="sortOptions"
              label="Sort By"
              hide-details
              density="compact"
              style="max-width: 150px"
            ></v-select>
          </v-card-title>
        </v-card>

        <!-- College Cards List -->
        <v-card
          v-for="(college, i) in colleges"
          :key="i"
          class="mb-4"
          rounded="lg"
          :elevation="4"
        >
          <v-row class="ma-0">
            <v-col cols="4" class="pa-0">
              <v-img
                :src="college.image"
                height="225"
                cover
                class="rounded-l-lg"
              ></v-img>
            </v-col>
            <v-col cols="8" class="pa-4">
              <div class="d-flex justify-space-between align-start">
                <div>
                  <h3 class="text-h6 font-weight-bold mb-1">{{ college.name }}</h3>
                  <div class="text-body-2 text-medium-emphasis mb-2">
                    {{ college.location }}
                  </div>
                </div>
                <v-chip
                  :color="getAcceptanceRateColor(college.acceptanceRate)"
                  size="small"
                >
                  {{ college.acceptanceRate }}% Acceptance
                </v-chip>
              </div>
              <p class="text-body-2 mb-2">{{ college.description }}</p>
              <div class="d-flex align-center mt-auto">
                <v-rating
                  :model-value="college.rating"
                  color="amber"
                  density="compact"
                  size="small"
                  readonly
                ></v-rating>
                <span class="text-body-2 ml-2">({{ college.reviewCount }} reviews)</span>
                <v-spacer></v-spacer>
                <v-btn
                  variant="text"
                  color="primary"
                  density="comfortable"
                  size="small"
                >
                  View Details
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Pagination -->
        <div class="d-flex justify-center mt-4">
          <v-pagination
            v-model="page"
            :length="5"
            rounded="circle"
          ></v-pagination>
        </div>
      </v-col>

      <!-- Right Category/Details Panel -->
      <v-col cols="12" md="3" class="pa-3 hidden-sm-and-down">
        <v-card class="pa-4" rounded="lg">
          <v-card-title class="text-h6">Early Decision</v-card-title>
          <v-divider class="my-2"></v-divider>

          <div v-if="savedColleges.length === 0" class="text-center py-8 text-medium-emphasis">
            <v-icon icon="mdi-bookmark-outline" size="large" class="mb-2"></v-icon>
            <div>No saved colleges yet</div>
            <div class="text-caption">Your saved colleges will appear here</div>
          </div>

          <v-list v-else lines="two" density="compact">
            <v-list-item
              v-for="(college, i) in savedColleges"
              :key="i"
              :title="college.name"
              :subtitle="college.location"
            >
              <template v-slot:prepend>
                <v-avatar size="40">
                  <v-img :src="college.image" cover></v-img>
                </v-avatar>
              </template>
            </v-list-item>
          </v-list>

          <v-divider class="my-4"></v-divider>

          <v-card-title class="text-h6">Regular Decision</v-card-title>
          <v-list lines="two" density="compact">
            <v-list-item
              v-for="(college, i) in recentlyViewed"
              :key="i"
              :title="college.name"
              :subtitle="college.location"
            >
              <template v-slot:prepend>
                <v-avatar size="40">
                  <v-img :src="college.image" cover></v-img>
                </v-avatar>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { ref } from 'vue'

  // Filter data
  const regions = ['Northeast', 'Midwest', 'South', 'West', 'International']
  const programs = ['Liberal Arts', 'Engineering', 'Business', 'Science', 'Arts']
  const acceptanceRange = ref([0, 100])
  const sortBy = ref('ranking')
  const sortOptions = ['Ranking', 'Name (A-Z)', 'Acceptance Rate', 'Tuition (Low to High)']
  const page = ref(1)

  // Sample college data
  const colleges = [
    {
      name: 'Harvard University',
      location: 'Cambridge, MA',
      description: 'A private Ivy League research university with a rich history and prestigious academic programs.',
      acceptanceRate: 5,
      tuition: 51925,
      image: 'https://placehold.co/600x400/e9f5fe/1976D2?text=Harvard',
      rating: 4.8,
      reviewCount: 1245
    },
    {
      name: 'Stanford University',
      location: 'Stanford, CA',
      description: 'A private research university known for its academic strength, entrepreneurial spirit, and proximity to Silicon Valley.',
      acceptanceRate: 4,
      tuition: 56169,
      image: 'https://placehold.co/600x400/fef3e9/FB8C00?text=Stanford',
      rating: 4.9,
      reviewCount: 987
    },
    {
      name: 'MIT',
      location: 'Cambridge, MA',
      description: 'A private research university focusing on science, engineering, and technology education.',
      acceptanceRate: 7,
      tuition: 53790,
      image: 'https://placehold.co/600x400/f4e9fe/9C27B0?text=MIT',
      rating: 4.7,
      reviewCount: 1089
    },
    {
      name: 'University of Michigan',
      location: 'Ann Arbor, MI',
      description: 'A public research university with a comprehensive range of programs and a vibrant campus life.',
      acceptanceRate: 23,
      tuition: 15948,
      image: 'https://placehold.co/600x400/e9fef3/4CAF50?text=UMich',
      rating: 4.5,
      reviewCount: 876
    },
    {
      name: 'NYU',
      location: 'New York, NY',
      description: 'A private research university located in the heart of New York City with a global network of campuses.',
      acceptanceRate: 16,
      tuition: 53308,
      image: 'https://placehold.co/600x400/fef3e9/FB8C00?text=NYU',
      rating: 4.6,
      reviewCount: 1023
    }
  ]

  // Saved and recently viewed colleges
  const savedColleges = ref([
    colleges[0],  // Harvard
    colleges[2]   // MIT
  ])

  const recentlyViewed = ref([
    colleges[1],  // Stanford
    colleges[3],  // UMich
    colleges[4]   // NYU
  ])

  // Helper function to determine chip color based on acceptance rate
  const getAcceptanceRateColor = (rate) => {
    if (rate < 10) return 'red'
    if (rate < 20) return 'orange'
    if (rate < 40) return 'amber'
    return 'green'
  }
</script>

<style scoped>
.v-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.v-card:not(.v-expansion-panel):hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
}
</style>
