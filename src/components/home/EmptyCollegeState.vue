<template>
  <div class="empty-state">
    <div class="empty-state-content">
      <div class="empty-state-icon">
        <v-icon size="56" color="grey-lighten-1">mdi-school-outline</v-icon>
      </div>
      <h3 class="empty-state-title">No colleges saved yet</h3>
      <p class="empty-state-description">
        Start building your personalized college list by exploring our comprehensive database of universities
      </p>
      <v-btn
        color="primary"
        size="default"
        to="/explore"
        prepend-icon="mdi-compass"
        rounded="lg"
        variant="flat"
        class="explore-button"
      >
        Explore Colleges
      </v-btn>
    </div>
  </div>
</template>

<script setup>
// No props or logic needed for this simple component
</script>

<style scoped>
.empty-state {
  background: rgba(248, 250, 252, 0.6);
  backdrop-filter: none;
  border: 2px dashed rgba(59, 130, 246, 0.2);
  border-radius: 0.75rem;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.empty-state:hover {
  border-color: rgba(59, 130, 246, 0.3);
  background: rgba(248, 250, 252, 0.8);
}

.empty-state-content {
  max-width: 400px;
  margin: 0 auto;
  animation: fadeInUp 0.6s ease-out;
}

.empty-state-icon {
  margin-bottom: 1rem;
}

.empty-state-icon .v-icon {
  color: rgba(59, 130, 246, 0.5) !important;
}

.empty-state-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
}

.empty-state-description {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 1.5rem 0;
  font-weight: 400;
}

.explore-button {
  text-transform: none;
  font-weight: 500;
  padding: 0 1.5rem !important;
  height: 40px !important;
  font-size: 0.875rem !important;
}

.explore-button:hover {
  transform: translateY(-1px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .empty-state {
    padding: 3rem 1.5rem;
  }
  
  .empty-state-title {
    font-size: 1.375rem;
  }
  
  .empty-state-description {
    font-size: 1rem;
  }
  
  .explore-button {
    width: 100%;
    height: 52px !important;
  }
}

@media (max-width: 480px) {
  .empty-state {
    padding: 2.5rem 1rem;
  }
  
  .empty-state-title {
    font-size: 1.25rem;
  }
}
</style>
