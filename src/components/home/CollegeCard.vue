<template>
  <article class="college-card" @click="$emit('click')">
    <div class="card-image-container">
      <v-img
        :src="college.image"
        :alt="`${college.name} campus`"
        height="160"
        cover
        class="college-image"
      />
      <v-chip
        :color="college.isEarlyDecision ? 'error' : 'success'"
        size="small"
        class="decision-chip"
        variant="flat"
      >
        {{ college.isEarlyDecision ? 'ED' : 'RD' }}
      </v-chip>
    </div>
    
    <div class="card-content">
      <h3 class="college-name">{{ college.name }}</h3>
      <p class="college-location">{{ college.location }}</p>
      
      <div class="college-stats">
        <v-chip 
          size="small" 
          variant="tonal" 
          color="purple"
          class="stat-chip"
        >
          <v-icon start size="small">mdi-percent</v-icon>
          {{ college.acceptanceRate }}%
        </v-chip>
        <v-chip 
          size="small" 
          variant="tonal" 
          color="secondary"
          class="stat-chip"
        >
          {{ college.collegeType === 'STEM-heavy' ? 'STEM' : 'Liberal Arts' }}
        </v-chip>
      </div>
      
    </div>
  </article>
</template>

<script setup>
defineProps({
  college: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])
</script>

<style scoped>
.college-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.08);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.college-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: rgba(139, 92, 246, 0.2);
}

.card-image-container {
  position: relative;
  overflow: hidden;
}

.college-image {
  transition: transform 0.3s ease;
}

.college-card:hover .college-image {
  transform: scale(1.05);
}

.decision-chip {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.card-content {
  padding: 1.25rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.college-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.college-location {
  color: #1f2937;
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.college-stats {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.stat-chip {
  font-weight: 500;
}

.college-rating {
  margin-top: auto;
}

/* Focus styles for accessibility */
.college-card:focus {
  outline: 2px solid #8b5cf6;
  outline-offset: 2px;
}

/* Mobile responsiveness */
@media (max-width: 480px) {
  .card-content {
    padding: 1rem;
  }
  
  .college-stats {
    gap: 0.375rem;
  }
}
</style>
