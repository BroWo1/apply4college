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
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: rgb(var(--v-theme-on-surface));
  margin: 0;
  line-height: 1.2;
}

.section-subtitle {
  color: #1f2937;
  margin: 0.25rem 0 0 0;
  font-size: 1rem;
  line-height: 1.4;
}

.colleges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.manage-button {
  flex-shrink: 0;
  text-transform: none;
  font-weight: 500;
  box-shadow: none;
}

/* Responsive */
@media (max-width: 768px) {
  .saved-colleges-section {
    padding: 1.5rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .manage-button {
    align-self: stretch;
  }
  
  .colleges-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .section-header {
    align-items: stretch;
  }
}
</style>
