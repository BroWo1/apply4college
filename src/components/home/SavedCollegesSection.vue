<template>
  <section class="saved-colleges-section" aria-labelledby="saved-colleges-title">
    <div class="section-header">
      <div class="section-text">
        <h2 id="saved-colleges-title" class="section-title">
          {{ $t('homePage.savedColleges') }}
        </h2>
        <p class="section-subtitle">
          Your personalized college shortlist
        </p>
      </div>
      <div class="section-actions">
        <v-btn
          variant="tonal"
          color="purple"
          to="/explore"
          append-icon="mdi-arrow-right"
          rounded="xl"
          size="large"
          class="manage-button"
        >
          {{ $t('homePage.manageList') }}
        </v-btn>
      </div>
    </div>

    <!-- College Grid -->
    <div v-if="colleges.length > 0" class="colleges-grid">
      <CollegeCard
        v-for="college in colleges"
        :key="college.id"
        :college="college"
        @click="$emit('view-college', college)"
      />
    </div>

    <!-- Empty State -->
    <EmptyCollegeState v-else />
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import CollegeCard from './CollegeCard.vue'
import EmptyCollegeState from './EmptyCollegeState.vue'

const { t } = useI18n()

defineProps({
  colleges: {
    type: Array,
    default: () => []
  }
})

defineEmits(['view-college'])
</script>

<style scoped>
.saved-colleges-section {
  background: transparent;
  border-radius: 0;
  padding: 0;
  border: none;
  box-shadow: none;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  gap: 1.5rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  line-height: 1.2;
}

.section-subtitle {
  color: #4a5568;
  margin: 0.5rem 0 0 0;
  font-size: 1.05rem;
  line-height: 1.5;
  font-weight: 400;
}

.colleges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.75rem;
}

.manage-button {
  flex-shrink: 0;
  text-transform: none;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #8b5cf6 100%) !important;
  color: white !important;
  border: none !important;
  padding: 0 2rem !important;
  height: 48px !important;
  border-radius: 1rem !important;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.25) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.manage-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(139, 92, 246, 0.35) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .saved-colleges-section {
    padding: 0;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  
  .manage-button {
    align-self: stretch;
    height: 44px !important;
  }
  
  .colleges-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .saved-colleges-section {
    padding: 0;
  }
  
  .section-header {
    align-items: stretch;
    gap: 1.25rem;
  }
  
  .section-title {
    font-size: 1.625rem;
  }
  
  .colleges-grid {
    gap: 1rem;
  }
}
</style>
