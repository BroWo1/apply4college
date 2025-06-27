<template>
  <section class="ai-advisor-section" aria-labelledby="ai-advisor-title">
    <div class="section-header">
      <div class="section-icon">
        <div class="gradient-avatar">
          <v-icon size="32" color="white">mdi-robot-happy</v-icon>
        </div>
      </div>
      <div class="section-text">
        <h2 id="ai-advisor-title" class="section-title">
          {{ $t('homePage.aiAdvisor') }}
        </h2>
        <p class="section-subtitle">
          Get instant personalized college advice powered by AI
        </p>
      </div>
    </div>

    <div class="ai-input-container">
      <v-text-field
        :model-value="question"
        @update:model-value="$emit('update:question', $event)"
        :label="$t('homePage.askPlaceholder')"
        variant="outlined"
        clearable
        @keydown.enter="handleAsk"
        :loading="loading"
        :disabled="loading"
        class="ai-input"
        bg-color="white"
        rounded="lg"
        hide-details
      >
        <template v-slot:append-inner>
          <v-btn
            icon="mdi-send"
            variant="flat"
            color="purple"
            @click="handleAsk"
            :loading="loading"
            :disabled="!question?.trim()"
            size="small"
            rounded="lg"
            class="send-button"
          />
        </template>
      </v-text-field>

      <!-- Quick Suggestions -->
      <div v-if="!response && !loading" class="quick-suggestions">
        <p class="suggestions-label">Quick questions to get started:</p>
        <div class="suggestions-grid">
          <v-chip
            v-for="(q, i) in quickQuestions"
            :key="i"
            @click="handleQuickQuestion(q)"
            color="purple"
            variant="tonal"
            size="small"
            rounded="xl"
            class="suggestion-chip"
          >
            {{ q }}
          </v-chip>
        </div>
      </div>
    </div>

    <!-- AI Response -->
    <v-expand-transition>
      <div v-if="response" class="ai-response-container">
        <v-card
          color="purple"
          variant="tonal"
          rounded="xl"
          elevation="0"
          class="ai-response-card"
        >
          <v-card-text class="response-content">
            <div class="response-header">
              <v-avatar size="32" color="purple" class="response-avatar">
                <v-icon size="18" color="white">mdi-robot-happy</v-icon>
              </v-avatar>
              <span class="response-label">AI Advisor</span>
            </div>
            <div class="response-text" v-html="formattedResponse"></div>
          </v-card-text>
        </v-card>
      </div>
    </v-expand-transition>

    <!-- Error State -->
    <v-expand-transition>
      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        rounded="xl"
        elevation="0"
        class="error-alert"
      >
        {{ error }}
      </v-alert>
    </v-expand-transition>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  question: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  response: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  quickQuestions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:question', 'ask'])

const formattedResponse = computed(() => {
  return props.response.replace(/\n/g, '<br>')
})

const handleAsk = () => {
  if (props.question?.trim()) {
    emit('ask', props.question)
  }
}

const handleQuickQuestion = (question) => {
  emit('update:question', question)
  emit('ask', question)
}
</script>

<style scoped>
.ai-advisor-section {
  background: transparent;
  border-radius: 0;
  padding: 0;
  margin-bottom: 0;
  border: none;
  box-shadow: none;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}

.section-icon {
  flex-shrink: 0;
}

.gradient-avatar {
  width: 60px;
  height: 60px;
  border-radius: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.25);
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

.ai-input-container {
  margin-bottom: 2rem;
}

.ai-input {
  margin-bottom: 1.25rem;
}

:deep(.v-text-field .v-field) {
  background: rgba(255, 255, 255, 0.9) !important;
  border: 1.5px solid rgba(139, 92, 246, 0.15) !important;
  border-radius: 1rem !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04) !important;
  backdrop-filter: blur(8px);
}

:deep(.v-text-field .v-field:hover) {
  border-color: rgba(139, 92, 246, 0.25) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06) !important;
}



.send-button {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%) !important;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3) !important;
  border: none !important;
}

.send-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4) !important;
}

.quick-suggestions {
  margin-top: 1.25rem;
}

.suggestions-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.suggestions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.suggestion-chip {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(139, 92, 246, 0.08) !important;
  color: #7c3aed !important;
  border: 1px solid rgba(139, 92, 246, 0.15) !important;
  font-weight: 500;
}

.suggestion-chip:hover {
  transform: translateY(-2px);
  background: rgba(139, 92, 246, 0.12) !important;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.25) !important;
}

.ai-response-container {
  margin-top: 2rem;
}

.ai-response-card {
  background: rgba(248, 250, 252, 0.8) !important;
  border: 1.5px solid rgba(139, 92, 246, 0.15) !important;
  backdrop-filter: none !important;
  box-shadow: 0 2px 12px rgba(139, 92, 246, 0.08) !important;
  border-radius: 1rem !important;
}

.response-content {
  padding: 2rem;
}

.response-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.response-avatar {
  flex-shrink: 0;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%) !important;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

.response-label {
  font-weight: 700;
  color: #7c3aed;
  font-size: 1rem;
}

.response-text {
  line-height: 1.7;
  color: #374151;
  font-size: 1rem;
}

.error-alert {
  margin-top: 1.5rem;
  background: rgba(248, 250, 252, 0.8) !important;
  border: 1.5px solid rgba(239, 68, 68, 0.15) !important;
  backdrop-filter: none !important;
  border-radius: 1rem !important;
}

/* Responsive */
@media (max-width: 768px) {
  .ai-advisor-section {
    padding: 0;
    margin-bottom: 0;
  }
  
  .section-header {
    gap: 1rem;
  }
  
  .gradient-avatar {
    width: 52px;
    height: 52px;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
  
  .suggestions-grid {
    gap: 0.5rem;
  }
  
  .response-content {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .ai-advisor-section {
    padding: 0;
    margin-bottom: 0;
  }
  
  .section-header {
    gap: 0.75rem;
  }
  
  .section-title {
    font-size: 1.625rem;
  }
}
</style>
