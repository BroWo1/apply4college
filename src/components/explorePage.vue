<template>
  <v-container fluid class="pa-0" style="max-width: 2000px">
    <!-- Header and Search Bar -->
    <v-container class="text-center py-6">
      <h1 class="text-h2 font-weight-bold mb-6 pt-5">Apply 4 College .org</h1>
      <v-text-field
        label="Search Colleges"
        variant="solo"
        prepend-inner-icon="mdi-magnify"
        clearable
        class="mx-auto py-2"
        style="max-width: 600px"
      ></v-text-field>
    </v-container>

    <!-- Main Content with Categories and College List -->
    <v-row class="fill-height ma-0">
      <!-- Left Category Panel -->
      <v-col cols="12" md="3" class="pa-3 hidden-sm-and-down sticky-panel">
        <v-card class="pa-4" rounded="lg">
          <v-card-title class="text-h6">Personal Profile</v-card-title>
          <v-divider class="my-2"></v-divider>

          <v-expansion-panels variant="accordion">
            <v-expansion-panel title="Standardized Test">
              <v-expansion-panel-text>
                <div class="text-body-2">
                  SAT Reading ({{satReading}})
                </div>
                <v-slider
                  v-model="satReading"
                  :max="800"
                  :min="200"
                  :step="10"
                  thumb-label
                ></v-slider>
                <div class="text-body-2">
                  SAT Math ({{satMath}})
                </div>
                <v-slider
                  v-model="satMath"
                  :max="800"
                  :min="200"
                  :step="10"
                  thumb-label
                ></v-slider>
                <div class="text-body-2">
                  GPA ({{gpa}})
                </div>
                <v-slider
                  v-model="gpa"
                  :max="4.0"
                  :min="0.0"
                  :step="0.1"
                  thumb-label
                ></v-slider>
                <v-btn
                  color="primary"
                  class=""
                  @click="saveSAT"
                  size="small"
                  :loading="loading"
                  >
                  Save
                </v-btn>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel title="AP Courses">
  <v-expansion-panel-text>
    <div v-if="apClasses.length === 0" class="text-center py-2 text-medium-emphasis">
      No AP classes added yet
    </div>
    <v-list v-else density="compact">
      <v-list-item v-for="(apClass, i) in apClasses" :key="i">
        <template v-slot:prepend>
          <v-chip :color="getApScoreColor(apClass.score)" size="small" class="mx-3">
            {{ apClass.score }}
          </v-chip>
        </template>
        <v-list-item-title>{{ apClass.name }}</v-list-item-title>
        <template v-slot:append>
          <v-btn icon="mdi-delete" size="small" variant="text" @click="removeApClass(i)"></v-btn>
        </template>
      </v-list-item>
    </v-list>

    <div class="text-center mt-3">
      <v-btn color="primary" @click="dialog = true">
        Add AP Class
      </v-btn>
    </div>

    <!-- AP Class Modal Dialog -->
    <v-dialog v-model="dialog" max-width="400px">
      <v-card>

        <v-card-title class="text-h6">Add AP Class</v-card-title>
        <v-card-text>
          <v-select
            v-model="newApClass"
            :items="apOptions"
            label="AP Class Name"
            hide-details
            class="mb-3"
          ></v-select>
          <v-select
            v-model="newApScore"
            label="Score"
            :items="['N/A', 1, 2, 3, 4, 5]"
            hide-details
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="text"
            @click="addApClassAndClose"
            :disabled="!newApClass"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
        <v-card class="mb-4 no-hover" variant="outlined" rounded="lg">
          <v-card-title class="d-flex align-center">
            <span class="text-h6">Colleges ({{ colleges.length }})</span>
            <v-spacer></v-spacer>
            <v-select
              v-model="sortBy"
              :items="sortOptions"
              label="Area"
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
                <!-- Replace the existing v-btn with this v-menu component -->
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      variant="text"
                      color="primary"
                      density="comfortable"
                    >
                      Details
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(item, index) in collegeActionItems"
                      :key="index"
                      :value="index"
                      @click="handleCollegeAction(item.action, college)"
                    >
                      <template v-slot:prepend>
                        <v-icon :icon="item.icon" size="small" class="ml-2"></v-icon>
                      </template>
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Pagination -->
        <div class="d-flex justify-center mt-4">
          <v-pagination
            v-model="page"
            :length="5"
          ></v-pagination>
        </div>
      </v-col>

      <!-- Right Category/Details Panel -->
      <v-col cols="12" md="3" class="pa-3 hidden-sm-and-down sticky-panel">
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
              :key="`saved-${i}`"
              :title="college.name"
              :subtitle="college.location"
            >
              <template v-slot:prepend>
                <v-avatar size="40">
                  <v-img :src="college.image" cover></v-img>
                </v-avatar>
              </template>
              <template v-slot:append>
                <v-btn icon="mdi-delete" size="small" variant="text"
                  @click="removeSavedCollege(i)"
                ></v-btn>
              </template>
            </v-list-item>
          </v-list>

          <v-divider class="my-4"></v-divider>

          <v-card-title class="text-h6">Regular Decision</v-card-title>
          <div v-if="recentlyViewed.length === 0" class="text-center py-8 text-medium-emphasis">
            <v-icon icon="mdi-bookmark-outline" size="large" class="mb-2"></v-icon>
            <div>No saved colleges yet</div>
            <div class="text-caption">Your saved colleges will appear here</div>
          </div>
          <v-list lines="two" density="compact">
            <v-list-item
              v-for="(college, i) in recentlyViewed"
              :key="`recent-${i}`"
              :title="college.name"
              :subtitle="college.location"
            >
              <template v-slot:prepend>
                <v-avatar size="40">
                  <v-img :src="college.image" cover></v-img>
                </v-avatar>
              </template>
              <template v-slot:append>
                <v-btn icon="mdi-delete" size="small" variant="text"
                  @click="removeRecentlyViewedCollege(i)"
                ></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { ref, onMounted } from 'vue'

  // Filter data
  const regions = ['Northeast', 'Midwest', 'South', 'West', 'International']
  const programs = ['Liberal Arts', 'Engineering', 'Business', 'Science', 'Arts']
  const acceptanceRange = ref([0, 100])
  const sortBy = ref('All')
  const sortOptions = ['All', 'US', 'UK', 'Germany', 'Canada', 'Australia']
  const page = ref(1)

  const apOptions = [
    "AP Calculus AB",
    "AP Calculus BC",
    "AP Statistics",
    "AP Chemistry",
    "AP Biology",
    "AP Physics 1",
    "AP Physics 2",
    "AP Computer Science A",
    "AP Computer Science Principles",
    "AP English Language and Composition",
    "AP English Literature and Composition"
  ]

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
  const satReading = ref(0)
  const satMath = ref(0)
  const gpa = ref(0.0)

  // AP Classes functionality
  const apClasses = ref([
    { name: "AP Calculus BC", score: 5 },
    { name: "AP Physics C", score: 4 }
  ])
  const newApClass = ref("")
  const newApScore = ref(3)

  const addApClass = () => {
    if (newApClass.value) {
      apClasses.value.push({
        name: newApClass.value,
        score: newApScore.value
      })
      newApClass.value = ""
      newApScore.value = 3
    }
  }

  const removeApClass = (index) => {
    apClasses.value.splice(index, 1)
  }

  const getApScoreColor = (score) => {
    if (score === 5) return "success"
    if (score === 4) return "info"
    if (score === 3) return "warning"
    return "error"
  }

  const dialog = ref(false)

  // Add this new method
  const addApClassAndClose = () => {
    addApClass()
    dialog.value = false
  }

  // Function to save SAT and GPA data to local storage
  const saveSAT = () => {
      load()
    const profileData = {
      satReading: satReading.value,
      satMath: satMath.value,
      gpa: gpa.value
    }
    localStorage.setItem('userProfileData', JSON.stringify(profileData))
    // Optional: Add a notification or confirmation message here
    console.log('Profile data saved:', profileData)
  }

  // Load data from local storage when the component mounts
  onMounted(() => {
    const savedData = localStorage.getItem('userProfileData')
    if (savedData) {
      try {
        const profileData = JSON.parse(savedData)
        satReading.value = profileData.satReading || 0
        satMath.value = profileData.satMath || 0
        gpa.value = profileData.gpa || 0.0
        console.log('Profile data loaded:', profileData)
      } catch (e) {
        console.error('Error parsing saved profile data:', e)
        // Handle potential parsing errors, e.g., clear invalid data
        localStorage.removeItem('userProfileData')
      }
    }
  })

  const loading = ref(false)
    function load () {
      loading.value = true
      setTimeout(() => (loading.value = false), 1000)
    }
    // College action items for dropdown
  const collegeActionItems = [
    { title: 'View College Profile', action: 'view', icon: 'mdi-school' },
    { title: 'Compare with Others', action: 'compare', icon: 'mdi-compare' },
    { title: 'Save to Regular Decision', action: 'saveRegular', icon: 'mdi-bookmark-outline' },
    { title: 'Save to Early Decision', action: 'saveEarly', icon: 'mdi-bookmark' },
  ]

  // Handle college action selections
  const handleCollegeAction = (action, college) => {
    console.log(`Action: ${action} for college: ${college.name}`)

    // Implement action handling
    switch(action) {
      case 'saveRegular':
        if (!recentlyViewed.value.some(c => c.name === college.name)) {
          recentlyViewed.value.push(college)
        }
        break
      case 'saveEarly':
        if (!savedColleges.value.some(c => c.name === college.name)) {
          savedColleges.value.push(college)
        }
        break
      // Additional cases can be implemented as needed
    }
  }
  const removeSavedCollege = (index) => {
    savedColleges.value.splice(index, 1)
  }

  // Function to remove a college from the recently viewed list
  const removeRecentlyViewedCollege = (index) => {
    recentlyViewed.value.splice(index, 1)
  }
</script>

<style scoped>
  .sticky-panel {
    position: sticky;
    top: 80px;
    align-self: start;
    height: calc(100vh - 80px);
    overflow-y: auto;
  }

  .v-card {
    transition: transform 0.2s, box-shadow 0.2s;
  }

  /* Apply hover effect only to cards that are not expansion panels, dialog cards, sticky panel cards, or marked with .no-hover */
  .v-card:not(.v-expansion-panel):not(.v-dialog .v-card):not(.sticky-panel .v-card):not(.no-hover):hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
  }
</style>
