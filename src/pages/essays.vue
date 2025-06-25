<template>
  <div class="essays-page">
    <!-- Header Section -->
    <section class="hero-section" aria-labelledby="hero-title">
      <div class="hero-content">
        <div class="hero-text-container">
          <div class="d-flex align-center justify-center">
            <h1 id="hero-title" class="hero-title">My Essays</h1>
            <v-chip
              size="small"
              color="rgba(255, 255, 255, 0.2)"
              variant="tonal"
              class="ml-3 beta-chip"
            >
              BETA
            </v-chip>
          </div>
          <p class="hero-subtitle">Manage and review all your college application essays</p>
          <div class="hero-actions">
            <v-btn
              color="white"
              variant="flat"
              prepend-icon="mdi-plus"
              to="/essay"
              size="large"
              class="hero-btn"
            >
              New Essay
            </v-btn>
          </div>
        </div>
        <div class="hero-decoration">
          <div class="floating-icons">
            <v-icon class="floating-icon icon-1">mdi-file-document</v-icon>
            <v-icon class="floating-icon icon-2">mdi-pencil</v-icon>
            <v-icon class="floating-icon icon-3">mdi-lightbulb</v-icon>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Search and Filter Bar -->
      <v-card rounded="xl" elevation="0" class="mb-8 filter-card">
        <v-card-text class="pa-8">
          <v-row align="center" class="gy-4">
            <v-col cols="12" md="6">
              <v-text-field
                v-model="searchQuery"
                label="Search essays..."
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-magnify"
                clearable
                @input="filterEssays"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="statusFilter"
                :items="statusOptions"
                label="Status"
                variant="outlined"
                density="comfortable"
                @update:model-value="filterEssays"
                rounded="lg"
                class="custom-select"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :title="item.title"
                    :value="item.value"
                    rounded="lg"
                    class="custom-select-item"
                  />
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="sortBy"
                :items="sortOptions"
                label="Sort by"
                variant="outlined"
                density="comfortable"
                @update:model-value="sortEssays"
                rounded="lg"
                class="custom-select"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :title="item.title"
                    :value="item.value"
                    rounded="lg"
                    class="custom-select-item"
                  />
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Essays Grid -->
      <div v-if="loading" class="text-center py-8">
        <v-progress-circular indeterminate color="primary" size="64" />
        <p class="text-h6 mt-4">Loading your essays...</p>
      </div>

      <div v-else-if="filteredEssays.length === 0" class="empty-state">
        <v-sheet class="text-center pa-12 empty-state-card" color="transparent" rounded="xl">
          <v-icon size="120" color="grey-lighten-2" class="mb-6">mdi-file-document-outline</v-icon>
          <h2 class="text-h4 font-weight-bold mb-4">No Essays Found</h2>
          <p class="text-body-1 text-grey-darken-1 mb-6" style="max-width: 400px; margin: 0 auto;">
            {{ searchQuery ? 'No essays match your search criteria.' : 'Start writing your first college essay to see it here.' }}
          </p>
          <v-btn
            v-if="!searchQuery"
            color="primary"
            variant="flat"
            size="large"
            prepend-icon="mdi-plus"
            to="/essay"
            class="empty-state-btn"
          >
            Write Your First Essay
          </v-btn>
          <v-btn
            v-else
            color="primary"
            variant="tonal"
            class="empty-state-btn"
            @click="clearSearch"
          >
            Clear Search
          </v-btn>
        </v-sheet>
      </div>

      <v-row v-else class="gy-6">
        <v-col 
          v-for="essay in filteredEssays" 
          :key="essay.id"
          cols="12" 
          md="6" 
          xl="4"
        >
          <v-card 
            class="essay-card h-100" 
            rounded="xl" 
            elevation="0"
            @click="openEssay(essay)"
            style="cursor: pointer;"
          >
            <v-card-text class="pa-6">
              <!-- College Info -->
              <div class="d-flex align-center mb-4">
                <v-avatar size="40" class="me-3">
                  <v-img 
                    v-if="getCollegeInfo(essay.college)?.image"
                    :src="getCollegeInfo(essay.college)?.image" 
                    :alt="getCollegeInfo(essay.college)?.name"
                  />
                  <v-icon v-else color="primary">mdi-school</v-icon>
                </v-avatar>
                <div class="flex-grow-1">
                  <h3 class="text-h6 font-weight-bold">
                    {{ getCollegeInfo(essay.college)?.name || 'Unknown College' }}
                  </h3>
                  <p class="text-caption text-grey-darken-1 mb-0">
                    {{ formatDate(essay.lastSaved) }}
                  </p>
                </div>
                <v-menu
                  location="bottom end"
                  transition="slide-y-transition"
                  class="essay-actions-menu"
                >
                  <template v-slot:activator="{ props }">
                    <v-btn
                      icon="mdi-dots-vertical"
                      variant="text"
                      size="small"
                      v-bind="props"
                      @click.stop
                      class="action-menu-btn"
                    />
                  </template>
                  <v-card min-width="160" rounded="xl" elevation="4" class="action-menu-card">
                    <v-list nav density="compact" class="pa-2">
                      <v-list-item 
                        @click="editEssay(essay)"
                        rounded="lg"
                        class="action-menu-item"
                      >
                        <template v-slot:prepend>
                          <v-icon>mdi-pencil</v-icon>
                        </template>
                        <v-list-item-title>Edit</v-list-item-title>
                      </v-list-item>
                      <v-list-item 
                        @click="duplicateEssay(essay)"
                        rounded="lg"
                        class="action-menu-item"
                      >
                        <template v-slot:prepend>
                          <v-icon>mdi-content-copy</v-icon>
                        </template>
                        <v-list-item-title>Duplicate</v-list-item-title>
                      </v-list-item>
                      <v-divider class="my-1" />
                      <v-list-item 
                        @click="deleteEssay(essay)" 
                        rounded="lg"
                        class="action-menu-item action-menu-item--danger"
                        base-color="error"
                      >
                        <template v-slot:prepend>
                          <v-icon color="error">mdi-delete</v-icon>
                        </template>
                        <v-list-item-title class="text-error">Delete</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-menu>
              </div>

              <!-- Essay Prompt Preview -->
              <div class="prompt-preview mb-4">
                <p class="text-body-2 text-grey-darken-1 mb-2">
                  <strong>Prompt:</strong>
                </p>
                <p class="text-body-2 prompt-text">
                  {{ truncateText(essay.prompt, 120) }}
                </p>
              </div>

              <!-- Essay Content Preview -->
              <div class="content-preview mb-4">
                <p class="text-body-2 essay-preview">
                  {{ truncateText(essay.content, 150) }}
                </p>
              </div>

              <!-- Essay Stats -->
              <div class="essay-stats">
                <v-row>
                  <v-col cols="6">
                    <v-chip size="small" variant="tonal" color="primary">
                      {{ essay.wordCount }} words
                    </v-chip>
                  </v-col>
                  <v-col cols="6" class="text-end">
                    <v-chip 
                      size="small" 
                      variant="tonal" 
                      :color="getProgressColor(essay.wordCount, essay.wordLimit)"
                    >
                      {{ Math.round((essay.wordCount / essay.wordLimit) * 100) }}% complete
                    </v-chip>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>

            <!-- Action Bar -->
            <v-divider />
            <v-card-actions class="pa-4">
              <v-btn
                variant="text"
                color="primary"
                size="small"
                prepend-icon="mdi-eye"
                @click.stop="previewEssay(essay)"
              >
                Preview
              </v-btn>
              <v-spacer />
              <v-btn
                variant="tonal"
                color="primary"
                size="small"
                prepend-icon="mdi-pencil"
                @click.stop="editEssay(essay)"
              >
                Edit
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </main>

    <!-- Essay Preview Dialog -->
    <v-dialog v-model="previewDialog" max-width="800px" scrollable>
      <v-card v-if="selectedEssay" rounded="xl">
        <v-card-title class="pa-6 pb-4">
          <div class="d-flex align-center">
            <v-avatar size="32" class="me-3">
              <v-img 
                v-if="getCollegeInfo(selectedEssay.college)?.image"
                :src="getCollegeInfo(selectedEssay.college)?.image" 
                :alt="getCollegeInfo(selectedEssay.college)?.name"
              />
              <v-icon v-else color="primary">mdi-school</v-icon>
            </v-avatar>
            <div>
              <h2 class="text-h5 font-weight-bold">
                {{ getCollegeInfo(selectedEssay.college)?.name || 'Essay Preview' }}
              </h2>
              <p class="text-caption text-grey-darken-1 mb-0">
                Last saved: {{ formatDate(selectedEssay.lastSaved) }}
              </p>
            </div>
          </div>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-6">
          <!-- Prompt -->
          <div class="mb-6">
            <h3 class="text-h6 font-weight-bold mb-2">Essay Prompt</h3>
            <div class="prompt-display pa-4">
              <p class="prompt-text mb-2">{{ selectedEssay.prompt }}</p>
              <v-chip size="small" color="primary" variant="tonal">
                {{ selectedEssay.wordLimit }} words max
              </v-chip>
            </div>
          </div>

          <!-- Content -->
          <div class="mb-4">
            <div class="d-flex justify-space-between align-center mb-2">
              <h3 class="text-h6 font-weight-bold">Essay Content</h3>
              <v-chip 
                size="small" 
                :color="getProgressColor(selectedEssay.wordCount, selectedEssay.wordLimit)"
                variant="tonal"
              >
                {{ selectedEssay.wordCount }} / {{ selectedEssay.wordLimit }} words
              </v-chip>
            </div>
            <div class="essay-content">
              <p class="text-body-1" style="line-height: 1.8; white-space: pre-wrap;">{{ selectedEssay.content }}</p>
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-6">
          <v-btn color="primary" variant="tonal" @click="editEssay(selectedEssay)">
            <v-icon start>mdi-pencil</v-icon>
            Edit Essay
          </v-btn>
          <v-spacer />
          <v-btn variant="text" @click="previewDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card rounded="xl">
        <v-card-title class="pa-6 pb-4">
          <v-icon color="error" class="me-2">mdi-alert-circle</v-icon>
          Delete Essay
        </v-card-title>
        <v-card-text class="pa-6 pt-0">
          <p>Are you sure you want to delete this essay? This action cannot be undone.</p>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { colleges } from '@/data/colleges.js'

const router = useRouter()

// Reactive data
const essays = ref([])
const filteredEssays = ref([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('all')
const sortBy = ref('date')
const previewDialog = ref(false)
const deleteDialog = ref(false)
const selectedEssay = ref(null)
const essayToDelete = ref(null)

// Filter and sort options
const statusOptions = [
  { title: 'All Essays', value: 'all' },
  { title: 'Draft', value: 'draft' },
  { title: 'Complete', value: 'complete' }
]

const sortOptions = [
  { title: 'Last Modified', value: 'date' },
  { title: 'College Name', value: 'college' },
  { title: 'Word Count', value: 'wordCount' }
]

// Methods
const loadEssays = async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call
    const savedEssays = JSON.parse(localStorage.getItem('savedEssays') || '[]')
    essays.value = savedEssays
    filteredEssays.value = [...savedEssays]
    sortEssays()
  } finally {
    loading.value = false
  }
}

const filterEssays = () => {
  let filtered = [...essays.value]
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(essay => 
      essay.content.toLowerCase().includes(query) ||
      essay.prompt.toLowerCase().includes(query) ||
      getCollegeInfo(essay.college)?.name.toLowerCase().includes(query)
    )
  }
  
  // Status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(essay => {
      if (statusFilter.value === 'complete') {
        return essay.wordCount >= essay.wordLimit * 0.8
      } else {
        return essay.wordCount < essay.wordLimit * 0.8
      }
    })
  }
  
  filteredEssays.value = filtered
  sortEssays()
}

const sortEssays = () => {
  filteredEssays.value.sort((a, b) => {
    switch (sortBy.value) {
      case 'date':
        return new Date(b.lastSaved) - new Date(a.lastSaved)
      case 'college':
        const collegeA = getCollegeInfo(a.college)?.name || 'Unknown'
        const collegeB = getCollegeInfo(b.college)?.name || 'Unknown'
        return collegeA.localeCompare(collegeB)
      case 'wordCount':
        return b.wordCount - a.wordCount
      default:
        return 0
    }
  })
}

const getCollegeInfo = (collegeName) => {
  return colleges.find(c => c.name === collegeName)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const getProgressColor = (wordCount, wordLimit) => {
  const ratio = wordCount / wordLimit
  if (ratio >= 0.8) return 'success'
  if (ratio >= 0.5) return 'warning'
  return 'primary'
}

const clearSearch = () => {
  searchQuery.value = ''
  filterEssays()
}

const openEssay = (essay) => {
  editEssay(essay)
}

const editEssay = (essay) => {
  // TODO: Navigate to essay editor with essay data
  // For now, we'll navigate to the essay page with query params
  router.push({
    path: '/essay',
    query: { 
      id: essay.id,
      college: essay.college,
      content: essay.content
    }
  })
}

const previewEssay = (essay) => {
  selectedEssay.value = essay
  previewDialog.value = true
}

const duplicateEssay = async (essay) => {
  try {
    const duplicatedEssay = {
      ...essay,
      id: Date.now().toString(),
      lastSaved: new Date().toISOString(),
      content: essay.content + '\n\n[COPY]'
    }
    
    const savedEssays = JSON.parse(localStorage.getItem('savedEssays') || '[]')
    savedEssays.push(duplicatedEssay)
    localStorage.setItem('savedEssays', JSON.stringify(savedEssays))
    
    await loadEssays()
  } catch (error) {
    console.error('Error duplicating essay:', error)
  }
}

const deleteEssay = (essay) => {
  essayToDelete.value = essay
  deleteDialog.value = true
}

const confirmDelete = async () => {
  try {
    const savedEssays = JSON.parse(localStorage.getItem('savedEssays') || '[]')
    const updatedEssays = savedEssays.filter(e => e.id !== essayToDelete.value.id)
    localStorage.setItem('savedEssays', JSON.stringify(updatedEssays))
    
    await loadEssays()
    deleteDialog.value = false
    essayToDelete.value = null
  } catch (error) {
    console.error('Error deleting essay:', error)
  }
}

// Lifecycle
onMounted(() => {
  loadEssays()
})
</script>

<style scoped>
.essays-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* Modern Hero Section */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, 
    #8b5cf6 0%, 
    #7c3aed 50%,
    #6d28d9 100%
  );
  padding: 4rem 2rem;
  overflow: hidden;
  color: white;
  z-index: 1;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  text-align: center;
}

.hero-text-container {
  margin-bottom: 0;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.hero-actions {
  margin-bottom: 0;
}

.hero-btn {
  color: #7c3aed !important;
  text-transform: none;
  letter-spacing: normal;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.3);
}

.beta-chip {
  color: white !important;
  background: rgba(255, 255, 255, 0.15) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

/* Floating Animation */
.hero-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  overflow: hidden;
}

.floating-icons {
  position: relative;
  width: 100%;
  height: 100%;
}

.floating-icon {
  position: absolute;
  opacity: 0.1;
  font-size: 3rem;
  animation: float 6s ease-in-out infinite;
}

.icon-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.icon-2 {
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.icon-3 {
  bottom: 30%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
  }
  50% { 
    transform: translateY(-20px) rotate(10deg); 
  }
}

/* Main Content */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  position: relative;
  z-index: 1;
}

.filter-card {
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.essay-card {
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.essay-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.prompt-preview {
  background: rgba(139, 92, 246, 0.05);
  padding: 1rem;
  border-radius: 12px;
  border-left: 3px solid #8b5cf6;
}

.prompt-text {
  color: #374151;
  line-height: 1.6;
  margin: 0;
}

.essay-preview {
  color: #6b7280;
  line-height: 1.6;
  font-family: 'Georgia', serif;
}

.content-preview {
  max-height: 100px;
  overflow: hidden;
  position: relative;
}

.prompt-display {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  border-left: 4px solid #8b5cf6;
}

.essay-content {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  font-family: 'Georgia', serif;
  line-height: 1.8;
}

.empty-state {
  margin: 4rem 0;
}

.empty-state-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.empty-state-btn {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.empty-state-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
}

/* Dialog Styles */
:deep(.v-dialog .v-card) {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

:deep(.v-dialog .v-card-title) {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

:deep(.v-dialog .v-card-actions) {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    padding: 3rem 1rem;
  }
  
  .main-content {
    padding: 2rem 1rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.125rem;
  }
}

/* Smooth transitions */
.v-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-btn {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
}

/* Deep styles for consistency */
:deep(.v-card) {
  border: none;
}

:deep(.v-btn) {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
}

/* Custom Select Dropdown Styles */
.custom-select :deep(.v-field) {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.v-menu > .v-overlay__content) {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
}

.custom-select-item {
  margin: 2px 4px;
  border-radius: 8px !important;
  transition: all 0.2s ease-in-out;
}

.custom-select-item:hover {
  background-color: rgba(139, 92, 246, 0.1) !important;
}

:deep(.v-list-item--active) {
  background-color: rgba(139, 92, 246, 0.15) !important;
  color: #7c3aed !important;
}

/* Dark theme support for custom selects */
.v-theme--dark .custom-select :deep(.v-field) {
  background: rgba(33, 33, 33, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.v-theme--dark :deep(.v-menu > .v-overlay__content) {
  background: rgba(33, 33, 33, 0.9) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Action Menu Styles */
.action-menu-btn {
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
}

.action-menu-btn:hover {
  background-color: rgba(139, 92, 246, 0.1) !important;
}

.action-menu-card {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.action-menu-item {
  margin: 2px 0;
  border-radius: 8px !important;
  transition: all 0.2s ease-in-out;
  min-height: 40px;
}

.action-menu-item:hover {
  background-color: rgba(139, 92, 246, 0.1) !important;
  transform: translateX(2px);
}

.action-menu-item--danger:hover {
  background-color: rgba(244, 67, 54, 0.1) !important;
}

/* Dark theme support for action menu */
.v-theme--dark .action-menu-card {
  background: rgba(33, 33, 33, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.v-theme--dark .action-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
</style>
