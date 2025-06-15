<template>
  <div class="empty-state">
    <div class="empty-state-content">
      <div class="empty-state-icon">
        <v-icon size="80" color="grey-lighten-1">mdi-school-outline</v-icon>
      </div>
      <h3 class="empty-state-title">No colleges saved yet</h3>
      <p class="empty-state-description">
        Start building your personalized college list by exploring our comprehensive database of universities
      </p>
      <v-btn 
        color="purple" 
        size="x-large" 
        to="/explore" 
        prepend-icon="mdi-compass"
        rounded="xl"
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
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px dashed rgba(0, 0, 0, 0.1);
  border-radius: 1.5rem;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-state-content {
  max-width: 400px;
  margin: 0 auto;
  animation: fadeInUp 0.6s ease-out;
}

.empty-state-icon {
  margin-bottom: 1.5rem;
}

.empty-state-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  margin: 0 0 1rem 0;
  line-height: 1.3;
}

.empty-state-description {
  color: #1f2937;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 2rem 0;
}

.explore-button {
  text-transform: none;
  font-weight: 600;
  padding: 0 2rem;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.explore-button:hover {
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
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
    font-size: 1.25rem;
  }
  
  .explore-button {
    width: 100%;
  }
}
</style>
