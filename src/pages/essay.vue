<template>
  <div class="essay-page">
    <!-- Main Content -->
    <v-container fluid class="essay-container">
      <v-row>
        <!-- Left Panel - Essay Editor -->
        <v-col cols="12" lg="7" class="essay-editor-panel">
          <div class="left-panel-sticky-wrapper">
            <!-- Sticky Header -->
            <div class="editor-header-sticky">
              <v-card 
                class="mb-0"
                rounded="t-xl" 
                elevation="0"
              >
                <v-card-text class="pa-5">
                  <!-- Header Title Row -->
                  <div class="d-flex justify-space-between align-center mb-3">
                    <div class="d-flex align-center">
                      <v-icon size="28" color="primary" class="me-3">mdi-file-document-edit-outline</v-icon>
                      <h1 class="text-h5 font-weight-bold">College Essay Editor</h1>
                    </div>
                    <div class="d-flex align-center" style="gap: 8px;">
                      <v-btn
                        color="info"
                        variant="tonal"
                        prepend-icon="mdi-file-document-multiple"
                        to="/essays"
                        size="small"
                      >
                        My Essays
                      </v-btn>
                      <v-btn
                        color="primary"
                        variant="flat"
                        prepend-icon="mdi-content-save"
                        @click="saveEssay"
                        :loading="saving"
                        :disabled="!canSave"
                        size="small"
                      >
                        Save
                      </v-btn>
                      <v-btn
                        icon
                        variant="text"
                        @click="headerExpanded = !headerExpanded"
                        size="small"
                      >
                        <v-icon>{{ headerExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                      </v-btn>
                    </div>
                  </div>                    <!-- Status Chips Row -->
                  <div class="d-flex align-center flex-wrap mb-2" style="gap: 8px;">
                    <v-chip 
                      :color="wordCountColor" 
                      size="small" 
                      variant="tonal"
                      class="font-weight-medium"
                    >
                      <v-icon start size="14">mdi-counter</v-icon>
                      {{ wordCount }}/{{ wordLimit }}
                    </v-chip>

                    <v-chip
                      v-if="selectedCollegeData && admissionChance"
                      :color="getChanceColor(admissionChance.probabilityPercentage)"
                      variant="tonal"
                      size="small"
                      class="font-weight-medium"
                    >
                      <v-icon start size="14">mdi-trending-up</v-icon>
                      {{ admissionChance.probabilityPercentage }}% {{ getChanceDescription(admissionChance.probabilityPercentage).toLowerCase() }} chance
                    </v-chip>

                    <v-chip
                      v-else-if="selectedCollegeData && !studentProfile"
                      color="orange"
                      variant="tonal"
                      size="small"
                      class="font-weight-medium"
                      @click="$router.push('/profile')"
                      style="cursor: pointer;"
                    >
                      <v-icon start size="14">mdi-account-alert</v-icon>
                      Complete profile for chance
                    </v-chip>

                    <!-- Auto-save status chip -->
                    <v-chip
                      v-if="autoSaveStatus && autoSaveStatus !== 'enabled'"
                      :color="autoSaveStatus === 'saving' ? 'warning' : autoSaveStatus === 'saved' ? 'success' : 'error'"
                      size="small"
                      variant="tonal"
                      class="font-weight-medium"
                    >
                      <v-icon 
                        start 
                        size="14"
                        :class="{ 'rotating-icon': autoSaveStatus === 'saving' }"
                      >
                        {{ autoSaveStatus === 'saving' ? 'mdi-loading' : autoSaveStatus === 'saved' ? 'mdi-check' : 'mdi-alert-circle' }}
                      </v-icon>
                      {{ autoSaveStatus === 'saving' ? 'Saving...' : autoSaveStatus === 'saved' ? 'Saved' : 'Error' }}
                    </v-chip>
                  </div>

                  <v-expand-transition>
                    <div v-show="headerExpanded">
                      <v-divider class="my-4" />
                      <v-card variant="" class="pa-4" rounded="lg">
                        <v-row align="center">
                          <v-col cols="12" md="4">
                            <v-select
                              v-model="selectedCollege"
                              :items="colleges"
                              item-title="name"
                              item-value="name"
                              label="Select College"
                              variant="outlined"
                              density="compact"
                              hide-details
                              prepend-inner-icon="mdi-school"
                              rounded="lg"
                              :menu-props="{ transition: 'slide-y-transition' }"
                              @update:model-value="onCollegeChange"
                              class="custom-select"
                            >
                              <template v-slot:item="{ props, item }">
                                <v-list-item 
                                  v-bind="props" 
                                  rounded="lg"
                                  class="custom-select-item"
                                >
                                  <template v-slot:prepend>
                                    <v-avatar size="24" class="me-2">
                                      <v-img :src="item.raw.image" :alt="item.raw.name" />
                                    </v-avatar>
                                  </template>
                                </v-list-item>
                              </template>
                            </v-select>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-select
                              v-model="promptSource"
                              :items="promptSources"
                              item-title="text"
                              item-value="value"
                              label="Prompt Source"
                              variant="outlined"
                              density="compact"
                              hide-details
                              prepend-inner-icon="mdi-source-branch"
                              rounded="lg"
                              :menu-props="{ transition: 'slide-y-transition' }"
                              @update:model-value="onPromptSourceChange"
                              class="custom-select"
                            >
                              <template v-slot:item="{ props, item }">
                                <v-list-item 
                                  v-bind="props" 
                                  :title="item.title" 
                                  rounded="lg"
                                  class="custom-select-item"
                                ></v-list-item>
                              </template>
                            </v-select>
                          </v-col>
                          <v-col cols="12" md="2">
                            <v-text-field
                              v-model="wordLimit"
                              label="Word Limit"
                              variant="outlined"
                              density="compact"
                              hide-details
                              type="number"
                              min="100"
                              max="2000"
                              prepend-inner-icon="mdi-counter"
                              rounded="lg"
                            />
                          </v-col>
                        </v-row>

                        <!-- Essay Prompt Display/Input -->
                        <div class="mt-4">
                          <h3 class="text-subtitle-1 font-weight-bold mb-2">Essay Prompt</h3>
                          
                          <!-- Predefined Prompts -->
                          <div v-if="promptSource === 'predefined'">
                            <v-select
                              v-model="selectedPrompt"
                              :items="essayPrompts"
                              item-title="text"
                              item-value="id"
                              label="Select a prompt"
                              variant="outlined"
                              density="compact"
                              class="mb-2 custom-select"
                              hide-details
                              rounded="lg"
                              :menu-props="{ transition: 'slide-y-transition' }"
                              @update:model-value="onPromptChange"
                            >
                              <template v-slot:item="{ props, item }">
                                <v-list-item 
                                  v-bind="props" 
                                  :title="item.title" 
                                  rounded="lg"
                                  class="custom-select-item"
                                ></v-list-item>
                              </template>
                            </v-select>
                            <p v-if="currentPrompt" class="prompt-text text-caption pa-2">{{ currentPrompt.text }}</p>
                          </div>

                          <!-- Custom Prompt -->
                          <div v-else>
                            <v-textarea
                              v-model="customPrompt"
                              label="Enter your essay prompt"
                              variant="outlined"
                              rows="2"
                              auto-grow
                              hide-details
                              placeholder="Type your essay prompt here..."
                              rounded="lg"
                            />
                          </div>
                        </div>
                      </v-card>
                    </div>
                  </v-expand-transition>
                </v-card-text>
              </v-card>
            </div>

            <!-- Writing Section -->
            <v-card 
              class="writing-card" 
              rounded="b-xl" 
              elevation="0"
            >
              <v-card-text class="pa-6">
                <!-- Simple Text Editor -->
                <v-textarea
                  ref="essayTextarea"
                  v-model="essayContent"
                  placeholder="Start writing your essay here..."
                  variant="outlined"
                  auto-grow
                  :rows="dynamicRows"
                  class="essay-textarea"
                  @input="onEssayChange"
                  :disabled="!selectedCollege || (!selectedPrompt && !customPrompt.trim())"
                  @keydown="handleTab"
                />
              </v-card-text>
            </v-card>
          </div>
        </v-col>

        <!-- Right Panel - AI Analysis -->
        <v-col cols="12" lg="5" class="ai-analysis-panel">
          <div class="sticky-panel">
            <div class="ai-header-sticky">
              <v-card 
                class="mb-0"
                rounded="t-xl" 
                elevation="0"
                border
              >
                <v-card-text class="pa-6">
                  <div class="d-flex align-center">
                    <v-icon size="32" color="primary" class="me-3">mdi-robot-outline</v-icon>
                    <h2 class="text-h5 font-weight-bold">AI Essay Coach</h2>
                    <v-progress-circular
                      v-if="isAnalyzing"
                      indeterminate
                      size="20"
                      width="2"
                      color="primary"
                      class="ms-2"
                    />
                    <v-spacer />
                    <v-btn
                      color="primary"
                      variant="tonal"
                      size="small"
                      prepend-icon="mdi-refresh"
                      @click="refreshAnalysis"
                      :loading="isAnalyzing"
                      :disabled="!essayContent.trim()"
                    >
                      Analyze
                    </v-btn>
                    
                    <!-- Dev Button -->
                    <v-btn
                      v-if="debugMode || debugInfo"
                      color="orange"
                      variant="outlined"
                      size="small"
                      prepend-icon="mdi-bug"
                      class="ml-2"
                      @click="showDebugModal = true"
                      :disabled="!debugInfo"
                    >
                      Debug
                    </v-btn>
                    
                    <v-tooltip text="Toggle debug mode to capture detailed AI analysis information">
                      <template #activator="{ props }">
                        <v-btn
                          v-bind="props"
                          :color="debugMode ? 'orange' : 'grey'"
                          variant="text"
                          size="small"
                          icon="mdi-cog"
                          class="ml-2"
                          @click="debugMode = !debugMode"
                        >
                        </v-btn>
                      </template>
                    </v-tooltip>
                    
                    <!-- Debug Info Button -->
                    <v-btn
                      v-if="debugMode"
                      color="blue"
                      variant="text"
                      size="small"
                      icon="mdi-information"
                      class="ml-1"
                      @click="console.log('Debug Info:', { selectedCollege: selectedCollege.value, selectedCollegeData: selectedCollegeData.value, studentProfile: studentProfile.value, admissionChance: admissionChance.value })"
                    >
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </div>
            <v-card 
              class="ai-analysis-card" 
              rounded="b-xl" 
              elevation="0"
              border
            >
              <v-card-text class="pa-6">
                <!-- College Match Info Card -->
                <v-card v-if="selectedCollegeData && admissionChance" class="mb-4" rounded="lg" elevation="0" color="white">
                  <v-card-text class="pa-4">
                    <div class="d-flex align-center mb-3">
                      <v-avatar size="40" class="me-3">
                        <v-img :src="selectedCollegeData.image" :alt="selectedCollegeData.name" />
                      </v-avatar>
                      <div>
                        <h3 class="text-subtitle-1 font-weight-bold">{{ selectedCollegeData.name }}</h3>
                        <p class="text-caption mb-0 text-grey-darken-1">{{ selectedCollegeData.location }}</p>
                      </div>
                      <v-spacer />
                      <v-chip 
                        :color="getChanceColor(admissionChance.probabilityPercentage)" 
                        variant="flat" 
                        class="font-weight-bold"
                      >
                        {{ admissionChance.probabilityPercentage }}%
                      </v-chip>
                    </div>
                    
                    <v-progress-linear
                      :model-value="admissionChance.probabilityPercentage"
                      :color="getChanceColor(admissionChance.probabilityPercentage)"
                      height="8"
                      rounded
                      class="mb-3"
                    />
                    
                    <div class="d-flex justify-space-between text-caption">
                      <span>Admission Chance</span>
                      <span class="font-weight-bold">{{ getChanceDescription(admissionChance.probabilityPercentage) }}</span>
                    </div>
                  </v-card-text>
                </v-card>

                <!-- Profile Setup Prompt -->
                <v-card v-else-if="selectedCollegeData && !studentProfile" class="mb-4" rounded="lg" elevation="0" color="orange-lighten-5" border>
                  <v-card-text class="pa-4">
                    <div class="d-flex align-center mb-3">
                      <v-icon color="orange" size="32" class="me-3">mdi-account-alert</v-icon>
                      <div>
                        <h3 class="text-subtitle-1 font-weight-bold text-orange-darken-2">Set Up Your Profile</h3>
                        <p class="text-caption mb-0 text-orange-darken-1">Complete your profile to see admission chances for {{ selectedCollegeData.name }}</p>
                      </div>
                      <v-spacer />
                      <v-btn
                        color="orange"
                        variant="flat"
                        size="small"
                        to="/profile"
                        prepend-icon="mdi-account-edit"
                      >
                        Set Up Profile
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>

                <!-- College Selection Prompt -->
                <v-card v-else-if="!selectedCollegeData" class="mb-4" rounded="lg" elevation="0" color="blue-lighten-5" border>
                  <v-card-text class="pa-4">
                    <div class="d-flex align-center">
                      <v-icon color="primary" size="32" class="me-3">mdi-school</v-icon>
                      <div>
                        <h3 class="text-subtitle-1 font-weight-bold text-primary">Select a College</h3>
                        <p class="text-caption mb-0 text-grey-darken-1">Choose a target college to see personalized analysis and admission chances</p>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>

                <!-- Analysis Status -->
                <div v-if="!essayContent.trim()" class="analysis-placeholder">
                  <v-sheet 
                    class="text-center pa-8" 
                    color="transparent"
                    rounded="lg"
                  >
                    <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-pencil-outline</v-icon>
                    <h3 class="text-h6 text-grey-darken-1 mb-2">Start Writing</h3>
                    <p class="text-body-2 text-grey-darken-1">
                      Select a college and prompt, then start writing to get AI-powered feedback and suggestions.
                    </p>
                  </v-sheet>
                </div>

                <!-- Error Display -->
                <v-alert 
                  v-if="analysisError"
                  type="error"
                  class="mb-4"
                  dismissible
                  @input="analysisError = null"
                >
                  <strong>Analysis Failed:</strong> {{ analysisError }}
                </v-alert>

                <!-- AI Analysis Content -->
                <div v-else class="analysis-content">
                  <!-- Overall Score -->
                  <v-card class="mb-4" rounded="lg" elevation="0" color="white">
                    <v-card-text class="pa-4">
                      <div class="d-flex align-center justify-space-between mb-2">
                        <h3 class="text-subtitle-1 font-weight-bold">Overall Score</h3>
                        <v-chip :color="getScoreColor(overallScore)" variant="flat" class="font-weight-bold">
                          {{ overallScore }}/100
                        </v-chip>
                      </div>
                      <v-progress-linear
                        :model-value="overallScore"
                        :color="getScoreColor(overallScore)"
                        height="8"
                        rounded
                      />
                    </v-card-text>
                  </v-card>

                  <!-- Analysis Categories -->
                  <div class="analysis-categories mb-4">
                    <v-expansion-panels multiple>
                      <v-expansion-panel 
                        v-for="category in analysisCategories" 
                        :key="category.id"
                        :value="category.id"
                        rounded="lg"
                        bg-color="white"
                        class="mb-2"
                      >
                        <v-expansion-panel-title>
                          <div class="d-flex align-center w-100">
                            <v-icon :color="getCategoryColor(category.id)" class="me-3">{{ getCategoryIcon(category.id) }}</v-icon>
                            <span class="font-weight-medium">{{ category.title }}</span>
                            <v-spacer />
                            <v-chip 
                              size="small" 
                              :color="getScoreColor(category.score * 10)" 
                              variant="tonal"
                            >
                              {{ category.score }}/10
                            </v-chip>
                          </div>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text class="pt-3">
                          <p class="mb-3 text-body-2">{{ category.feedback }}</p>
                          <div v-if="category.suggestions.length">
                            <h4 class="text-subtitle-2 font-weight-bold mb-2">Suggestions:</h4>
                            <v-list density="compact" class="bg-transparent">
                              <v-list-item 
                                v-for="(suggestion, i) in category.suggestions" 
                                :key="i"
                                class="px-0"
                              >
                                <template v-slot:prepend>
                                  <v-icon size="16" color="primary" class="me-3">mdi-lightbulb-outline</v-icon>
                                </template>
                                <v-list-item-title class="text-body-2" style="white-space: normal;">{{ suggestion }}</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </div>

                  <!-- AI Comments -->
                  <v-card rounded="lg" elevation="0" color="white" class="mb-4">
                    <v-card-text class="pa-4">
                      <h3 class="text-subtitle-1 font-weight-bold mb-3">
                        <v-icon color="primary" class="me-2">mdi-comment-text-outline</v-icon>
                        AI Comments
                      </h3>
                      <div class="comments-list">
                        <div v-if="analysisComments.length === 0 && !isAnalyzing" class="text-center text-grey-darken-1 py-4">
                          <p>No specific comments yet. Click "Analyze" to get detailed feedback.</p>
                        </div>
                        <div 
                          v-for="comment in analysisComments" 
                          :key="comment.id || comment.text"
                          class="comment-item mb-3 pa-3"
                          :class="`comment-${comment.type}`"
                        >
                          <div class="d-flex align-start">
                            <v-icon 
                              size="20" 
                              :color="getCommentColor(comment.type)" 
                              class="me-3 mt-1"
                            >
                              {{ getCommentIcon(comment.type) }}
                            </v-icon>
                            <div class="flex-grow-1">
                              <div class="d-flex align-center mb-1">
                                <span class="text-caption font-weight-medium text-uppercase">
                                  {{ comment.type }}
                                </span>
                                <v-tooltip location="top">
                                  <template v-slot:activator="{ props }">
                                    <v-chip 
                                      v-if="comment.line" 
                                      v-bind="props"
                                      size="x-small" 
                                      variant="tonal" 
                                      class="ms-2 line-chip"
                                      @click="highlightLine(comment.line)"
                                      color="primary"
                                    >
                                      <v-icon start size="12">mdi-cursor-text</v-icon>
                                      Line {{ comment.line }}
                                    </v-chip>
                                  </template>
                                  <span>Click to highlight this line in your essay</span>
                                </v-tooltip>
                              </div>
                              <p class="text-body-2 mb-2">{{ comment.text }}</p>
                              <div v-if="comment.context" class="context-preview">
                                <v-chip 
                                  size="small" 
                                  variant="outlined" 
                                  class="context-chip text-caption"
                                  prepend-icon="mdi-text-search"
                                >
                                  "{{ truncateContext(comment.context) }}"
                                </v-chip>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>

                  <!-- Profile Match -->
                  <v-card rounded="lg" elevation="0" color="white">
                    <v-card-text class="pa-4">
                      <h3 class="text-subtitle-1 font-weight-bold mb-3">
                        <v-icon color="secondary" class="me-2">mdi-account-check-outline</v-icon>
                        Profile Alignment
                      </h3>
                      <p class="text-body-2 mb-3">
                        Based on your profile and the selected college's values, here's how well your essay aligns:
                      </p>
                      <v-progress-linear
                        :model-value="profileAlignment"
                        color="secondary"
                        height="8"
                        rounded
                        class="mb-2"
                      />
                      <div class="d-flex justify-space-between">
                        <span class="text-caption">Profile Match</span>
                        <span class="text-caption font-weight-bold">{{ profileAlignment }}%</span>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Debug Modal -->
    <v-dialog
      v-model="showDebugModal"
      max-width="1200"
      persistent
      scrollable
    >
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon color="orange" class="me-2">mdi-bug</v-icon>
          AI Analysis Debug Information
          <v-spacer />
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="showDebugModal = false"
          />
        </v-card-title>
        
        <v-card-text class="pa-0">
          <v-tabs v-if="debugInfo" v-model="debugTab">
            <v-tab value="input">Input Data</v-tab>
            <v-tab value="api">API Call</v-tab>
            <v-tab value="output">Output</v-tab>
            <v-tab value="error" v-if="debugInfo.error">Error</v-tab>
          </v-tabs>
          
          <v-window v-if="debugInfo" v-model="debugTab">
            <v-window-item value="input">
              <div class="pa-4">
                <h3 class="text-h6 mb-3">Input Data Sent to AI</h3>
                <v-card variant="outlined" class="mb-4">
                  <v-card-text>
                    <h4 class="text-subtitle-1 mb-2">Essay Content</h4>
                    <v-textarea
                      :model-value="debugInfo.input?.content || ''"
                      readonly
                      variant="outlined"
                      auto-grow
                      rows="10"
                      class="text-body-2"
                    />
                  </v-card-text>
                </v-card>
                
                <v-card variant="outlined" class="mb-4">
                  <v-card-text>
                    <h4 class="text-subtitle-1 mb-2">Metadata</h4>
                    <v-list density="compact">
                      <v-list-item>
                        <template #prepend>
                          <v-icon>mdi-school</v-icon>
                        </template>
                        <v-list-item-title>College</v-list-item-title>
                        <v-list-item-subtitle>{{ debugInfo.input?.college || 'Not specified' }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <template #prepend>
                          <v-icon>mdi-help-circle</v-icon>
                        </template>
                        <v-list-item-title>Prompt</v-list-item-title>
                        <v-list-item-subtitle>{{ debugInfo.input?.prompt || 'Not specified' }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item v-if="debugInfo.input?.contentStats">
                        <template #prepend>
                          <v-icon>mdi-text</v-icon>
                        </template>
                        <v-list-item-title>Content Stats</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ debugInfo.input.contentStats.words }} words, 
                          {{ debugInfo.input.contentStats.characters }} characters, 
                          {{ debugInfo.input.contentStats.lines }} lines
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
                
                <v-card variant="outlined" v-if="debugInfo.input?.studentProfile">
                  <v-card-text>
                    <h4 class="text-subtitle-1 mb-2">Student Profile</h4>
                    <pre class="text-caption bg-grey-lighten-4 pa-3 rounded">{{ JSON.stringify(debugInfo.input.studentProfile, null, 2) }}</pre>
                  </v-card-text>
                </v-card>
              </div>
            </v-window-item>
            
            <v-window-item value="api">
              <div class="pa-4">
                <h3 class="text-h6 mb-3">API Call Details</h3>
                <v-card variant="outlined" class="mb-4">
                  <v-card-text>
                    <v-list density="compact">
                      <v-list-item>
                        <v-list-item-title>URL</v-list-item-title>
                        <v-list-item-subtitle>{{ debugInfo.apiCall?.url }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>Model</v-list-item-title>
                        <v-list-item-subtitle>{{ debugInfo.apiCall?.model }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>Temperature</v-list-item-title>
                        <v-list-item-subtitle>{{ debugInfo.apiCall?.temperature }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>Max Tokens</v-list-item-title>
                        <v-list-item-subtitle>{{ debugInfo.apiCall?.max_tokens }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>Response Status</v-list-item-title>
                        <v-list-item-subtitle>{{ debugInfo.apiCall?.responseStatus }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>Request Time</v-list-item-title>
                        <v-list-item-subtitle>{{ debugInfo.apiCall?.requestTimestamp }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>Response Time</v-list-item-title>
                        <v-list-item-subtitle>{{ debugInfo.apiCall?.responseTimestamp }}</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
                
                <v-card variant="outlined" class="mb-4">
                  <v-card-text>
                    <h4 class="text-subtitle-1 mb-2">System Prompt</h4>
                    <v-textarea
                      :model-value="debugInfo.apiCall?.messages?.[0]?.content || ''"
                      readonly
                      variant="outlined"
                      auto-grow
                      rows="15"
                      class="text-caption"
                    />
                  </v-card-text>
                </v-card>
                
                <v-card variant="outlined">
                  <v-card-text>
                    <h4 class="text-subtitle-1 mb-2">User Prompt</h4>
                    <v-textarea
                      :model-value="debugInfo.apiCall?.messages?.[1]?.content || ''"
                      readonly
                      variant="outlined"
                      auto-grow
                      rows="15"
                      class="text-caption"
                    />
                  </v-card-text>
                </v-card>
              </div>
            </v-window-item>
            
            <v-window-item value="output">
              <div class="pa-4">
                <h3 class="text-h6 mb-3">AI Response & Processing</h3>
                <v-card variant="outlined" class="mb-4">
                  <v-card-text>
                    <h4 class="text-subtitle-1 mb-2">Raw API Response</h4>
                    <pre class="text-caption bg-grey-lighten-4 pa-3 rounded" style="max-height: 400px; overflow-y: auto;">{{ JSON.stringify(debugInfo.output?.rawApiResponse, null, 2) }}</pre>
                  </v-card-text>
                </v-card>
                
                <v-card variant="outlined" class="mb-4">
                  <v-card-text>
                    <h4 class="text-subtitle-1 mb-2">Parsed Analysis</h4>
                    <pre class="text-caption bg-grey-lighten-4 pa-3 rounded" style="max-height: 400px; overflow-y: auto;">{{ JSON.stringify(debugInfo.output?.parsedAnalysis, null, 2) }}</pre>
                  </v-card-text>
                </v-card>
                
                <v-card variant="outlined">
                  <v-card-text>
                    <h4 class="text-subtitle-1 mb-2">Enhanced Analysis (Final)</h4>
                    <pre class="text-caption bg-grey-lighten-4 pa-3 rounded" style="max-height: 400px; overflow-y: auto;">{{ JSON.stringify(debugInfo.output?.enhancedAnalysis, null, 2) }}</pre>
                  </v-card-text>
                </v-card>
              </div>
            </v-window-item>
            
            <v-window-item value="error" v-if="debugInfo.error">
              <div class="pa-4">
                <h3 class="text-h6 mb-3 text-error">Error Information</h3>
                <v-card variant="outlined" color="error" class="mb-4">
                  <v-card-text>
                    <h4 class="text-subtitle-1 mb-2">Error Details</h4>
                    <pre class="text-caption">{{ JSON.stringify(debugInfo.error, null, 2) }}</pre>
                  </v-card-text>
                </v-card>
              </div>
            </v-window-item>
          </v-window>
          
          <div v-else class="pa-4 text-center">
            <v-icon size="64" color="grey-lighten-1">mdi-information-outline</v-icon>
            <p class="text-body-1 mt-2">No debug information available</p>
            <p class="text-body-2 text-grey-darken-1">Enable debug mode and run an analysis to see debug information.</p>
          </div>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            variant="text"
            @click="showDebugModal = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { colleges } from '@/data/colleges.js'
import { calculateAdmissionChance, prepareStudentData } from '@/utils/admitChanceCalculator.js'
import { useUserStore } from '@/stores/user'
import { useEssayAnalysis } from '@/composables/useEssayAnalysis.js'

// Store
const userStore = useUserStore()

// Essay Analysis
const {
  analyzing,
  analysisResult,
  analysisError,
  hasAnalysis,
  isAnalyzing,
  overallScore: aiOverallScore,
  profileAlignment: aiProfileAlignment,
  categories: aiCategories,
  comments: aiComments,
  strengths: aiStrengths,
  improvements: aiImprovements,
  debugInfo,
  analyzeEssay,
  getSuggestions,
  checkGrammar,
  clearAnalysis
} = useEssayAnalysis()

// TODO: Replace with actual API calls
// These are mock data structures for UI demonstration

// Reactive data
const selectedCollege = ref(null)
const selectedPrompt = ref(null)
const promptSource = ref('custom')
const customPrompt = ref('')
const wordLimit = ref(650)
const essayContent = ref('')
const saving = ref(false)
const essayTextarea = ref(null)
const selectedText = ref('')
const selectionStart = ref(0)
const selectionEnd = ref(0)
const headerExpanded = ref(true)

// Debug functionality
const showDebugModal = ref(false)
const debugMode = ref(false)
const debugTab = ref('input')

// Auto-save functionality
const autoSaveEnabled = ref(true)
const autoSaveStatus = ref('enabled') // 'enabled', 'saving', 'saved', 'error'
const autoSaveDelay = ref(3000) // 3 seconds delay
let autoSaveTimeout = null
const lastAutoSavedContent = ref('')

// Admission chance calculation
const admissionChance = ref(null)
const studentProfile = ref(null)

// Prompt sources
const promptSources = ref([
  { text: 'Write Custom Prompt', value: 'custom' },
  { text: 'Choose from Templates', value: 'predefined' }
])

const essayPrompts = ref([
  {
    id: 1,
    text: "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.",
    wordLimit: 650
  },
  {
    id: 2,
    text: "The lessons we take from obstacles we encounter can be fundamental to later success. Recount a time when you faced a challenge, setback, or failure. How did it affect you, and what did you learn from the experience?",
    wordLimit: 650
  },
  {
    id: 3,
    text: "Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?",
    wordLimit: 650
  },
  {
    id: 4,
    text: "Reflect on something that someone has done for you that has made you happy or thankful in a surprising way. How has this gratitude affected or motivated you?",
    wordLimit: 650
  },
  {
    id: 5,
    text: "Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others.",
    wordLimit: 650
  },
  {
    id: 6,
    text: "Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you? What or who do you turn to when you want to learn more?",
    wordLimit: 650
  },
  {
    id: 7,
    text: "Share an essay on any topic of your choice. It can be one you've already written, one that responds to a different prompt, or one of your own design.",
    wordLimit: 650
  }
])

// Use AI analysis data from composable
const overallScore = computed(() => aiOverallScore.value || 0)
const profileAlignment = computed(() => aiProfileAlignment.value || 0)
const analysisCategories = computed(() => aiCategories.value || [])
const analysisComments = computed(() => aiComments.value || [])

// Selected college data
const selectedCollegeData = computed(() => {
  if (!selectedCollege.value) return null
  return colleges.find(c => c.name === selectedCollege.value)
})

// Admission chance calculation helpers
const getChanceColor = (percentage) => {
  if (percentage >= 70) return 'success'
  if (percentage >= 40) return 'warning'
  return 'error'
}

const getChanceDescription = (percentage) => {
  if (percentage >= 80) return 'Excellent'
  if (percentage >= 60) return 'Good'
  if (percentage >= 40) return 'Fair'
  if (percentage >= 20) return 'Reach'
  return 'Long Shot'
}

// Calculate admission chance when college changes
const calculateAdmissionChanceForCollege = () => {
  console.log('Calculating admission chance for college:', selectedCollegeData.value?.name)
  console.log('Student profile:', studentProfile.value)
  
  if (!selectedCollegeData.value || !studentProfile.value) {
    console.log('Missing data - College:', !!selectedCollegeData.value, 'Profile:', !!studentProfile.value)
    admissionChance.value = null
    return
  }

  try {
    const studentData = prepareStudentData(studentProfile.value)
    console.log('Prepared student data:', studentData)
    
    const chance = calculateAdmissionChance(studentData, selectedCollegeData.value)
    console.log('Calculated admission chance:', chance)
    
    admissionChance.value = chance
  } catch (error) {
    console.error('Error calculating admission chance:', error)
    admissionChance.value = null
  }
}

// Load student profile data
const loadStudentProfile = () => {
  const profileKey = userStore.isAuthenticated ? 'userProfileData' : 'guestProfileData'
  const savedData = localStorage.getItem(profileKey)
  
  if (savedData) {
    try {
      const profileData = JSON.parse(savedData)
      studentProfile.value = {
        gpa: profileData.gpa || 3.0,
        satReading: profileData.satReading || 500,
        satMath: profileData.satMath || 500,
        apClasses: profileData.apClasses || [],
        extracurriculars: profileData.extracurriculars || [],
        intendedMajor: profileData.intendedMajor || '',
        recScore: profileData.recScore || 2,
        isLegacy: profileData.isLegacy || false,
        demoScore: profileData.demoScore || 0,
        nationality: profileData.nationality || 'United States',
        gender: profileData.gender || 'Prefer not to say',
        enableBitterByCoffee: profileData.enableBitterByCoffee || false
      }
      console.log('Loaded student profile:', studentProfile.value)
    } catch (error) {
      console.error('Error loading student profile:', error)
      studentProfile.value = null
    }
  } else {
    // Create a basic profile for demo purposes
    console.log('No saved profile found, creating default profile for demo')
    studentProfile.value = {
      gpa: 3.5,
      satReading: 650,
      satMath: 680,
      apClasses: ['AP Chemistry', 'AP Calculus BC'],
      extracurriculars: ['Debate Team', 'Volunteer Work'],
      intendedMajor: 'Computer Science',
      recScore: 3,
      isLegacy: false,
      demoScore: 0,
      nationality: 'United States',
      gender: 'Prefer not to say',
      enableBitterByCoffee: false
    }
  }
}

// Computed properties
const currentPrompt = computed(() => {
  return essayPrompts.value.find(p => p.id === selectedPrompt.value)
})

const wordCount = computed(() => {
  return essayContent.value.trim().split(/\s+/).filter(word => word.length > 0).length
})

const wordCountColor = computed(() => {
  const ratio = wordCount.value / wordLimit.value
  if (ratio > 1) return 'error'
  if (ratio > 0.9) return 'warning'
  return 'success'
})

const canSave = computed(() => {
  const hasPrompt = promptSource.value === 'custom' ? customPrompt.value.trim() : selectedPrompt.value
  return selectedCollege.value && hasPrompt && essayContent.value.trim().length > 0
})

const dynamicRows = computed(() => {
  const lines = essayContent.value.split('\n').length
  return Math.max(5, Math.min(lines, 30)) // min 5, max 30 rows
})

// Methods
const onPromptSourceChange = (source) => {
  promptSource.value = source
  if (source === 'custom') {
    selectedPrompt.value = null
  } else {
    customPrompt.value = ''
  }
}

const onCollegeChange = (collegeId) => {
  console.log('College changed to:', collegeId)
  // TODO: API call to fetch college-specific prompts
  // Mock: Update available prompts based on college
  
  // Calculate admission chance when college changes
  nextTick(() => {
    calculateAdmissionChanceForCollege()
  })
}

const onPromptChange = (promptId) => {
  // TODO: API call to get prompt-specific guidance
  console.log('Prompt changed:', promptId)
}

const onEssayChange = () => {
  // Clear existing analysis when content changes
  if (hasAnalysis) {
    clearAnalysis()
  }
  
  // Trigger auto-save
  triggerAutoSave()
}

// Auto-save methods
const triggerAutoSave = () => {
  if (!autoSaveEnabled.value || !canSave.value) return
  
  // Clear existing timeout
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout)
  }
  
  // Set new timeout
  autoSaveTimeout = setTimeout(() => {
    performAutoSave()
  }, autoSaveDelay.value)
}

const performAutoSave = async () => {
  if (!canSave.value || essayContent.value === lastAutoSavedContent.value) {
    return
  }
  
  try {
    autoSaveStatus.value = 'saving'
    
    const essayData = {
      college: selectedCollege.value,
      prompt: promptSource.value === 'custom' ? customPrompt.value : currentPrompt.value?.text,
      promptSource: promptSource.value,
      wordLimit: wordLimit.value,
      content: essayContent.value,
      wordCount: wordCount.value,
      lastSaved: new Date().toISOString(),
      autoSaved: true
    }
    
    // Save to localStorage (similar to manual save but marked as auto-save)
    const savedEssays = JSON.parse(localStorage.getItem('savedEssays') || '[]')
    const essayId = Date.now().toString()
    const essayWithId = { id: essayId, ...essayData }
    
    // Check if updating existing essay or creating new one
    const existingIndex = savedEssays.findIndex(e => 
      e.college === essayData.college && 
      e.prompt === essayData.prompt
    )
    
    if (existingIndex >= 0) {
      savedEssays[existingIndex] = { ...savedEssays[existingIndex], ...essayWithId }
    } else {
      savedEssays.push(essayWithId)
    }
    
    localStorage.setItem('savedEssays', JSON.stringify(savedEssays))
    
    // Update status
    lastAutoSavedContent.value = essayContent.value
    autoSaveStatus.value = 'saved'
    
    // Reset status after a few seconds
    setTimeout(() => {
      if (autoSaveStatus.value === 'saved') {
        autoSaveStatus.value = 'enabled'
      }
    }, 3000)
    
  } catch (error) {
    console.error('Auto-save failed:', error)
    autoSaveStatus.value = 'error'
    
    // Reset error status after a few seconds
    setTimeout(() => {
      if (autoSaveStatus.value === 'error') {
        autoSaveStatus.value = 'enabled'
      }
    }, 5000)
  }
}

const handleTab = (e) => {
  if (e.key === 'Tab') {
    e.preventDefault()
    const textarea = e.target
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const value = essayContent.value

    essayContent.value = value.substring(0, start) + '\t' + value.substring(end)

    nextTick(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 1
    })
  }
}

const formatText = (format) => {
  // Simple text formatting - just add markdown syntax
  if (!essayTextarea.value) return
  
  const textarea = essayTextarea.value.$el.querySelector('textarea')
  if (!textarea) return
  
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  
  const formatMap = {
    'bold': '**',
    'italic': '*',
    'underline': '_'
  }
  
  const marker = formatMap[format]
  if (!marker) return
  
  if (start === end) {
    // No selection, add markers at cursor
    const before = essayContent.value.substring(0, start)
    const after = essayContent.value.substring(end)
    essayContent.value = before + marker + marker + after
    
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + marker.length, start + marker.length)
    }, 0)
  } else {
    // Text selected, wrap it
    const selectedText = essayContent.value.substring(start, end)
    const before = essayContent.value.substring(0, start)
    const after = essayContent.value.substring(end)
    const formattedText = marker + selectedText + marker
    
    essayContent.value = before + formattedText + after
    
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + marker.length, end + marker.length)
    }, 0)
  }
}

const onTextSelect = (event) => {
  const textarea = event.target
  selectionStart.value = textarea.selectionStart
  selectionEnd.value = textarea.selectionEnd
  selectedText.value = essayContent.value.substring(textarea.selectionStart, textarea.selectionEnd)
}

const isFormatActive = (format) => {
  return false // Simplified - no active state detection
}

const saveEssay = async () => {
  saving.value = true
  try {
    const essayData = {
      college: selectedCollege.value,
      prompt: promptSource.value === 'custom' ? customPrompt.value : currentPrompt.value?.text,
      promptSource: promptSource.value,
      wordLimit: wordLimit.value,
      content: essayContent.value,
      wordCount: wordCount.value,
      lastSaved: new Date().toISOString()
    }
    
    // TODO: API call to save essay
    console.log('Saving essay:', essayData)
    
    // Mock: Save to localStorage for now
    const savedEssays = JSON.parse(localStorage.getItem('savedEssays') || '[]')
    const essayId = Date.now().toString()
    const essayWithId = { id: essayId, ...essayData }
    
    // Check if updating existing essay or creating new one
    const existingIndex = savedEssays.findIndex(e => 
      e.college === essayData.college && 
      e.prompt === essayData.prompt
    )
    
    if (existingIndex >= 0) {
      savedEssays[existingIndex] = essayWithId
    } else {
      savedEssays.push(essayWithId)
    }
    
    localStorage.setItem('savedEssays', JSON.stringify(savedEssays))
    
    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Show success message (you can add a toast notification here)
    console.log('Essay saved successfully!')
    
  } finally {
    saving.value = false
  }
}

const submitEssay = async () => {
  // TODO: Remove this function or repurpose if needed
  console.log('Submit function deprecated - now using save')
}

const refreshAnalysis = async () => {
  if (!essayContent.value.trim()) {
    console.warn('No essay content to analyze')
    return
  }

  if (!selectedCollege.value) {
    console.warn('No college selected for analysis')
    return
  }

  try {
    const analysisData = {
      content: essayContent.value,
      prompt: promptSource.value === 'custom' ? customPrompt.value : currentPrompt.value?.text,
      college: selectedCollegeData.value?.name || selectedCollege.value,
      studentProfile: studentProfile.value
    }
    
    console.log('Starting essay analysis with', analysisData.content.split('\n').length, 'lines')
    await analyzeEssay(analysisData, debugMode.value)
    console.log('Essay analysis completed successfully')
  } catch (error) {
    console.error('Essay analysis failed:', error)
    // You can add toast notification here
  }
}

const getCategoryIcon = (categoryId) => {
  const icons = {
    structure: 'mdi-format-list-numbered',
    voice: 'mdi-account-voice',
    content: 'mdi-book-open-variant',
    grammar: 'mdi-spellcheck'
  }
  return icons[categoryId] || 'mdi-star-outline'
}

const getCategoryColor = (categoryId) => {
  const colors = {
    structure: 'primary',
    voice: 'secondary',
    content: 'success',
    grammar: 'warning'
  }
  return colors[categoryId] || 'grey'
}

const getScoreColor = (score) => {
  if (score >= 80) return 'success'
  if (score >= 60) return 'warning'
  return 'error'
}

const getCommentColor = (type) => {
  const colors = {
    suggestion: 'primary',
    grammar: 'warning',
    strength: 'success',
    question: 'info'
  }
  return colors[type] || 'grey'
}

const getCommentIcon = (type) => {
  const icons = {
    suggestion: 'mdi-lightbulb-outline',
    grammar: 'mdi-spellcheck',
    strength: 'mdi-thumb-up-outline',
    question: 'mdi-help-circle-outline'
  }
  return icons[type] || 'mdi-comment-outline'
}

// AI Comment utility methods
const highlightLine = (lineNumber) => {
  if (!essayTextarea.value || !lineNumber) return

  const textarea = essayTextarea.value.$el?.querySelector('textarea')
  if (!textarea) return

  const lines = essayContent.value.split('\n')
  
  // Validate line number
  if (lineNumber < 1 || lineNumber > lines.length) {
    console.warn(`Invalid line number: ${lineNumber}. Essay has ${lines.length} lines.`)
    return
  }

  let charPosition = 0
  
  // Calculate character position of the target line
  for (let i = 0; i < lineNumber - 1; i++) {
    charPosition += lines[i].length + 1 // +1 for the newline character
  }
  
  // Calculate end position of the line
  const lineContent = lines[lineNumber - 1] || ''
  const lineEndPosition = charPosition + lineContent.length
  
  // Focus and select the line
  textarea.focus()
  textarea.setSelectionRange(charPosition, lineEndPosition)
  
  // Scroll to the selected text
  nextTick(() => {
    try {
      textarea.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      })
    } catch (error) {
      // Fallback for older browsers
      textarea.scrollTop = textarea.scrollHeight * (lineNumber / lines.length)
    }
  })
}

const truncateContext = (context) => {
  if (!context) return ''
  
  const maxLength = 50
  if (context.length <= maxLength) return context
  
  return context.substring(0, maxLength) + '...'
}

// Lifecycle
onMounted(() => {
  // Load student profile for admission chance calculation
  loadStudentProfile()
  
  // Check if we're editing an existing essay
  const route = useRoute()
  if (route.query.id) {
    loadExistingEssay(route.query.id)
  }
  
  // Initialize auto-save status
  if (autoSaveEnabled.value && canSave.value) {
    autoSaveStatus.value = 'enabled'
  }
  
  // Calculate initial admission chance after profile is loaded
  nextTick(() => {
    if (selectedCollege.value && studentProfile.value) {
      calculateAdmissionChanceForCollege()
    }
  })
})

onUnmounted(() => {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout)
  }
})

// Watchers
watch(selectedCollege, (newValue) => {
  console.log('selectedCollege watcher triggered:', newValue)
  calculateAdmissionChanceForCollege()
})

watch(studentProfile, (newValue) => {
  console.log('studentProfile watcher triggered:', newValue)
  calculateAdmissionChanceForCollege()
}, { deep: true })

const loadExistingEssay = (essayId) => {
  try {
    const savedEssays = JSON.parse(localStorage.getItem('savedEssays') || '[]')
    const essay = savedEssays.find(e => e.id === essayId)
    
    if (essay) {
      selectedCollege.value = essay.college
      essayContent.value = essay.content
      wordLimit.value = essay.wordLimit
      
      if (essay.promptSource === 'custom') {
        promptSource.value = 'custom'
        customPrompt.value = essay.prompt
      } else {
        promptSource.value = 'predefined'
        // Find matching prompt in essayPrompts
        const matchingPrompt = essayPrompts.value.find(p => p.text === essay.prompt)
        if (matchingPrompt) {
          selectedPrompt.value = matchingPrompt.id
        }
      }
    }
  } catch (error) {
    console.error('Error loading existing essay:', error)
  }
}
</script>

<style scoped>
.essay-page {
  height: 100%;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.essay-container {
  padding: 2rem;
}

@media (max-width: 960px) {
  .essay-container {
    padding: 1rem;
  }
}

.editor-header-sticky {
  position: relative;
  z-index: 10;
}

.editor-header-sticky > .v-card {
  border-bottom-width: 0;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.editor-header-sticky::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2rem;
  background: linear-gradient(to bottom, rgba(248, 250, 252, 0.8), transparent);
  transform: translateY(100%);
  pointer-events: none;
  z-index: 2;
}

.essay-editor-panel {
  padding-right: 1rem;
}

@media (max-width: 1264px) {
  .essay-editor-panel {
    padding-right: 0;
    margin-bottom: 2rem;
  }
}

.ai-analysis-panel {
  padding-left: 1rem;
}

@media (max-width: 1264px) {
  .ai-analysis-panel {
    padding-left: 0;
  }
}

.left-panel-sticky-wrapper {
  position: sticky;
  top: 0;
  z-index: 5;
  height: 100vh;
  overflow-y: auto;
}

.writing-card {
  border-top: none;
  position: relative;
  z-index: 1;
  flex-grow: 1;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.prompt-text {
  color: #475569;
  line-height: 1.6;
}

.comment-item {
  border-left: 3px solid transparent;
  border-radius: 8px;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  margin-bottom: 8px;
}

.comment-item:hover {
  background: rgba(139, 92, 246, 0.1);
  transform: translateX(2px);
}

.comment-suggestion { border-color: #6366f1; }
.comment-grammar { border-color: #f59e0b; }
.comment-strength { border-color: #10b981; }
.comment-question { border-color: #3b82f6; }

.context-chip {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  max-width: 240px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
}

.context-chip:hover {
  background: rgba(25, 118, 210, 0.1);
  border-color: #1976d2;
  color: #1976d2;
  transform: scale(1.02);
}

.context-preview {
  margin-top: 8px;
}

.line-chip {
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
}

.line-chip:hover {
  transform: scale(1.05);
  background-color: #1976d2 !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

.essay-textarea :deep(textarea) {
  line-height: 1.8 !important;
  font-size: 1rem !important;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
}

.rotating-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

</style>

<style scoped>
.left-panel-sticky-wrapper {
  position: sticky;
  top: calc(var(--v-layout-top, 0px) + 2rem);
  height: calc(100vh - var(--v-layout-top, 0px) - var(--v-layout-bottom, 0px) - 4rem);
  display: flex;
  flex-direction: column;
}

.sticky-panel {
  position: sticky;
  top: calc(var(--v-layout-top, 0px) + 2rem);
  height: calc(100vh - var(--v-layout-top, 0px) - var(--v-layout-bottom, 0px) - 4rem);
  display: flex;
  flex-direction: column;
}

.ai-header-sticky {
  position: relative;
  z-index: 10;
}

.ai-header-sticky > .v-card {
  border-bottom-width: 0;
  background-color: #ffffff;
}

.ai-header-sticky::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2rem;
  background: linear-gradient(to bottom, #ffffff, transparent);
  transform: translateY(100%);
  pointer-events: none;
  z-index: 2;
}

.ai-analysis-card {
  height: 100%;
  overflow-y: auto;
  background-color: #ffffff;
  border-top: none !important;
  flex-grow: 1;
}

.writing-card {
  border-top: none;
  position: relative;
  z-index: 1;
  flex-grow: 1;
  overflow-y: auto;
}

.prompt-text {
  color: #475569;
  line-height: 1.6;
}

.comment-item {
  border-left: 3px solid transparent;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.comment-item:hover {
  background-color: #f1f5f9;
}

.comment-suggestion { border-color: #6366f1; }
.comment-grammar { border-color: #f59e0b; }
.comment-strength { border-color: #10b981; }
.comment-question { border-color: #3b82f6; }

.context-chip {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  max-width: 240px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
}

.context-chip:hover {
  background-color: #e3f2fd;
  border-color: #1976d2;
  color: #1976d2;
}

.context-preview {
  margin-top: 8px;
}

.line-chip {
  cursor: pointer;
  transition: all 0.2s ease;
}

.line-chip:hover {
  transform: scale(1.05);
  background-color: #1976d2 !important;
  color: white !important;
}

.essay-textarea ::v-deep(textarea) {
  line-height: 1.8 !important;
  font-size: 1rem !important;
}

.rotating-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Essay-specific cards with glass effect */
.v-card {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
</style>