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
  background: rgba(248, 250, 252, 0.6);
  backdrop-filter: none;
  border: 2px dashed rgba(139, 92, 246, 0.2);
  border-radius: 1.25rem;
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.empty-state:hover {
  border-color: rgba(139, 92, 246, 0.3);
  background: rgba(248, 250, 252, 0.8);
}

.empty-state-content {
  max-width: 400px;
  margin: 0 auto;
  animation: fadeInUp 0.6s ease-out;
}

.empty-state-icon {
  margin-bottom: 1.75rem;
}

.empty-state-icon .v-icon {
  color: rgba(139, 92, 246, 0.6) !important;
}

.empty-state-title {
  font-size: 1.625rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 1.25rem 0;
  line-height: 1.3;
}

.empty-state-description {
  color: #4a5568;
  font-size: 1.05rem;
  line-height: 1.6;
  margin: 0 0 2.5rem 0;
  font-weight: 400;
}

.explore-button {
  text-transform: none;
  font-weight: 600;
  padding: 0 2.5rem !important;
  height: 56px !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #8b5cf6 100%) !important;
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.3) !important;
  border: none !important;
  color: white !important;
}

.explore-button:hover {
  box-shadow: 0 8px 28px rgba(139, 92, 246, 0.4) !important;
  transform: translateY(-2px);
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
