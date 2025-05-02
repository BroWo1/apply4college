&lt;template>
  <v-dialog v-model="dialog" max-width="800px">
    <v-card
      class="pa-4"
      rounded="lg"
      :elevation="4"
    >
      <v-card-title class="d-flex justify-space-between">
        <span class="text-h6 font-weight-bold">AI-Powered Recommendations</span>
        <v-btn icon="mdi-close" variant="text" @click="closeDialog"></v-btn>
      </v-card-title>

      <v-card-text>
        <!-- Loading state -->
        <div v-if="loading" class="d-flex flex-column align-center py-6">
          <v-progress-circular indeterminate color="primary" size="64" width="6" class="mb-4"></v-progress-circular>
          <div class="text-body-1">Analyzing your profile and generating personalized recommendations...</div>
        </div>

        <!-- Error state -->
        <v-alert v-else-if="error" type="error" class="mb-4">
          {{ error }}
        </v-alert>

        <!-- API Key input state -->
        <div v-else-if="!hasApiKey" class="pa-4">
          <div class="text-h6 mb-3">Enter OpenAI API Key</div>
          <div class="text-body-2 mb-4">
            To get personalized AI recommendations, you'll need to provide your OpenAI API key.
            You can get one from <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI's website</a>.
          </div>

          <v-text-field
            v-model="apiKey"
            label="OpenAI API Key"
            placeholder="sk-..."
            variant="outlined"
            hide-details
            class="mb-4"
          ></v-text-field>

          <div class="text-caption mb-4">
            Your API key is only used for this session and is not stored permanently.
          </div>

          <v-btn color="primary" @click="saveApiKey" :disabled="!apiKey || apiKey.length < 10">
            Continue
          </v-btn>
        </div>

        <!-- Results state -->
        <div v-else-if="recommendation" class="recommendation-content">
          <v-tabs v-model="activeTab" grow>
            <v-tab value="strategy">Application Strategy</v-tab>
            <v-tab value="improvements">Profile Improvements</v-tab>
            <v-tab value="essays">Essay Topics</v-tab>
          </v-tabs>

          <v-window v-model="activeTab">
            <!-- Strategy Tab -->
            <v-window-item value="strategy">
              <div class="pa-4">
                <div class="text-h6 mb-2">Your Application Strategy</div>
                <div v-html="formatContent(recommendation.strategy)" class="text-body-1"></div>

                <v-divider class="my-4"></v-divider>

                <div class="text-h6 mb-2">College Matches</div>
                <div v-html="formatContent(recommendation.matches)" class="text-body-1"></div>
              </div>
            </v-window-item>

            <!-- Improvements Tab -->
            <v-window-item value="improvements">
              <div class="pa-4">
                <div class="text-h6 mb-3">Ways to Strengthen Your Profile</div>
                <v-list>
                  <v-list-item v-for="(item, i) in recommendation.improvements" :key="i">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-check-circle" color="success" class="mr-3"></v-icon>
                    </template>
                    <v-list-item-title class="text-subtitle-1 font-weight-medium">
                      {{ getImprovementTitle(item) }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-body-2 mt-1">
                      {{ getImprovementDetails(item) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </div>
            </v-window-item>

            <!-- Essays Tab -->
            <v-window-item value="essays">
              <div class="pa-4">
                <div class="text-h6 mb-3">Suggested Essay Topics</div>

                <div v-if="!essayTopics && !loadingEssayTopics">
                  <v-btn color="primary" @click="getEssayTopics">
                    Generate Essay Topic Ideas
                  </v-btn>
                </div>

                <div v-else-if="loadingEssayTopics" class="d-flex flex-column align-center py-4">
                  <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  <div class="mt-2">Generating creative essay topics...</div>
                </div>

                <div v-else-if="essayTopics" v-html="formatContent(essayTopics)" class="text-body-1"></div>
              </div>
            </v-window-item>
          </v-window>
        </div>
      </v-card-text>

      <v-card-actions class="d-flex justify-end">
        <v-btn color="grey-darken-1" variant="text" @click="closeDialog">Close</v-btn>
        <v-btn
          v-if="recommendation"
          color="primary"
          variant="elevated"
          @click="saveRecommendations"
        >
          Save Recommendations
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
&lt;/template>

<script setup>
import { ref, computed, watch } from 'vue';
import { setApiKey, getProfileRecommendations, getEssayTopicSuggestions } from '../utils/profileRecommendationService';

const props = defineProps({
  studentProfile: {
    type: Object,
    required: true
  },
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'close', 'save-recommendations']);

// Dialog state
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// API key management
const apiKey = ref('');
const hasApiKey = ref(false);

// UI state
const loading = ref(false);
const error = ref(null);
const recommendation = ref(null);
const activeTab = ref('strategy');

// Essay topics state
const essayTopics = ref(null);
const loadingEssayTopics = ref(false);

// Close dialog handler
const closeDialog = () => {
  dialog.value = false;
  emit('close');
};

// Save API key
const saveApiKey = () => {
  if (apiKey.value && apiKey.value.length > 10) {
    setApiKey(apiKey.value);
    hasApiKey.value = true;
    // After setting API key, immediately fetch recommendations
    fetchRecommendations();
  }
};

// Parse AI response
const parseRecommendations = (response) => {
  if (!response) return null;

  // Simple parsing - in a real app, you'd want more robust parsing
  // This is a basic implementation that assumes certain formatting
  const sections = response.split(/\n\d+\./);

  // Handle case where GPT-4 might not use the exact formatting we expect
  if (sections.length < 3) {
    return {
      strategy: response,
      improvements: ["Review recommendations for specific ways to improve your profile"],
      matches: "See the full response for college match suggestions."
    };
  }

  // Parse improvements into an array
  const improvementText = sections[1] || '';
  const improvements = improvementText
    .split(/\n-/)
    .filter(item => item.trim().length > 0)
    .map(item => item.trim());

  return {
    strategy: sections[0] || '',
    improvements: improvements.length > 0 ? improvements : improvementText.split('\n').filter(line => line.trim()),
    matches: sections[2] || ''
  };
};

// Format content for display (convert newlines to HTML)
const formatContent = (text) => {
  if (!text) return '';
  return text
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
};

// Extract title and details from improvement item
const getImprovementTitle = (item) => {
  const colonIndex = item.indexOf(':');
  if (colonIndex > 0) {
    return item.substring(0, colonIndex).trim();
  }
  // If no colon, return the first sentence or the first 60 characters
  const firstSentenceEnd = item.indexOf('. ');
  if (firstSentenceEnd > 0) {
    return item.substring(0, firstSentenceEnd + 1).trim();
  }
  return item.length > 60 ? item.substring(0, 60) + '...' : item;
};

const getImprovementDetails = (item) => {
  const colonIndex = item.indexOf(':');
  if (colonIndex > 0) {
    return item.substring(colonIndex + 1).trim();
  }
  // If no colon, return everything after the first sentence or after 60 chars
  const firstSentenceEnd = item.indexOf('. ');
  if (firstSentenceEnd > 0) {
    return item.substring(firstSentenceEnd + 2).trim();
  }
  return item.length > 60 ? item.substring(60).trim() : '';
};

// Fetch recommendations from the API
const fetchRecommendations = async () => {
  if (!hasApiKey.value) return;

  loading.value = true;
  error.value = null;

  try {
    const response = await getProfileRecommendations(props.studentProfile);

    if (response.success) {
      recommendation.value = parseRecommendations(response.recommendation);
    } else {
      error.value = response.error || 'Failed to get recommendations. Please try again.';
    }
  } catch (err) {
    error.value = err.message || 'An unexpected error occurred.';
  } finally {
    loading.value = false;
  }
};

// Get essay topics
const getEssayTopics = async () => {
  if (!hasApiKey.value) return;

  loadingEssayTopics.value = true;

  try {
    const response = await getEssayTopicSuggestions(props.studentProfile);

    if (response.success) {
      essayTopics.value = response.topics;
    } else {
      error.value = response.error || 'Failed to get essay topic suggestions.';
    }
  } catch (err) {
    error.value = err.message || 'An unexpected error occurred.';
  } finally {
    loadingEssayTopics.value = false;
  }
};

// Save recommendations
const saveRecommendations = () => {
  if (recommendation.value) {
    // This would save recommendations to local storage or your backend
    localStorage.setItem('savedRecommendations', JSON.stringify(recommendation.value));

    // Emit event to parent component
    emit('save-recommendations', recommendation.value);

    // Close the dialog
    closeDialog();
  }
};

// Watch for dialog open to trigger API call
watch(() => dialog.value, (newValue) => {
  if (newValue && hasApiKey.value && !recommendation.value && !loading.value) {
    fetchRecommendations();
  }
});

// Check for stored API key on component mount
// In a real app, you might use a more secure method to store the API key
// This is just for demo purposes
const checkStoredApiKey = () => {
  const storedKey = localStorage.getItem('openai_api_key');
  if (storedKey) {
    apiKey.value = storedKey;
    hasApiKey.value = true;
    setApiKey(storedKey);
  }
};

// Call this when the component is mounted
checkStoredApiKey();
</script>

<style scoped>
.recommendation-content {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
