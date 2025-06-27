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
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 1.25rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1.5px solid rgba(139, 92, 246, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.college-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 48px rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.25);
  background: rgba(255, 255, 255, 0.95);
}

.card-image-container {
  position: relative;
  overflow: hidden;
  border-radius: 0;
}

.college-image {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.college-card:hover .college-image {
  transform: scale(1.08);
}

.decision-chip {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.card-content {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.college-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.college-location {
  color: #4a5568;
  font-size: 0.9rem;
  margin: 0 0 1.25rem 0;
  line-height: 1.4;
  font-weight: 500;
}

.college-stats {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.stat-chip {
  font-weight: 600;
  background: rgba(139, 92, 246, 0.08) !important;
  color: #7c3aed !important;
  border: 1px solid rgba(139, 92, 246, 0.15) !important;
  border-radius: 0.75rem !important;
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
    padding: 1.25rem;
  }
  
  .college-stats {
    gap: 0.5rem;
  }
  
  .college-name {
    font-size: 1.125rem;
  }
  
  .college-location {
    font-size: 0.875rem;
  }
}
</style>
