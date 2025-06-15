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
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.section-icon {
  flex-shrink: 0;
}

.gradient-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
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

.ai-input-container {
  margin-bottom: 1.5rem;
}

.ai-input {
  margin-bottom: 1rem;
}

.send-button {
  box-shadow: none !important;
}

.quick-suggestions {
  margin-top: 1rem;
}

.suggestions-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.suggestions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.suggestion-chip {
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ai-response-container {
  margin-top: 1.5rem;
}

.ai-response-card {
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.response-content {
  padding: 1.5rem;
}

.response-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.response-avatar {
  flex-shrink: 0;
}

.response-label {
  font-weight: 600;
  color: #8b5cf6;
}

.response-text {
  line-height: 1.6;
  color: #1f2937;
}

.error-alert {
  margin-top: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .ai-advisor-section {
    padding: 1.5rem;
  }
  
  .section-header {
    gap: 0.75rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .suggestions-grid {
    gap: 0.375rem;
  }
}
</style>
