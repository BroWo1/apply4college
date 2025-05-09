<template>
  <v-container class="product-page-container py-12" style="max-width: 1500px;">
    <!-- Header row with logo and title -->
    <v-row justify="center" class="header-row align-center mb-6">
      <v-col cols="12" md="10">
        <v-row>
          <v-col cols="12" md="8">
            <h1 class="text-h3 text-md-h2 font-weight-bold">
              {{ $t('indexPage.title') }}
            </h1>
            <p class="text-h6 text-grey-darken-1 font-weight-regular mb-4">
              {{ $t('indexPage.subtitle') }}
            </p>
            <!-- Added Get Started button -->
            <v-btn
              color="primary"
              size="large"
              variant="elevated"
              to="/home"
              class="mb-10 mt-2"
              append-icon="mdi-arrow-right"
            >
              {{ $t('indexPage.getStarted') }}
            </v-btn>
          </v-col>
          <v-col cols="12" md="4" class="text-center text-md-end d-flex justify-md-end align-center">
            <img src="../assets/a4c.svg" alt="Apply 4 College Logo" class="product-logo" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-10">
      <!-- Feature Card 1: Core Tools -->
      <v-col cols="12" md="5">
        <v-card class="feature-card pa-6" flat border rounded="lg">
          <v-card-title class="text-h5 font-weight-medium mb-4">{{ $t('indexPage.exploreAnalyze') }}</v-card-title>
          <v-list density="compact" bg-color="transparent">
            <v-list-item prepend-icon="mdi-school" class="mb-2">
              <v-list-item-title class="font-weight-regular">{{ $t('indexPage.collegeDb') }}</v-list-item-title>
              <v-list-item-subtitle>{{ $t('indexPage.collegeDbSub') }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item prepend-icon="mdi-calculator-variant" class="mb-2">
              <v-list-item-title class="font-weight-regular">{{ $t('indexPage.chanceCalc') }}</v-list-item-title>
              <v-list-item-subtitle>{{ $t('indexPage.chanceCalcSub') }}</v-list-item-subtitle>
            </v-list-item>
             <v-list-item prepend-icon="mdi-lightbulb-on-outline">
                <v-list-item-title class="font-weight-regular">{{ $t('indexPage.aiAdvisor') }}</v-list-item-title>
                <v-list-item-subtitle>{{ $t('indexPage.aiAdvisorSub') }}</v-list-item-subtitle>
              </v-list-item>
          </v-list>
          <v-card-actions class="mt-4">
            <v-btn color="primary" variant="elevated" to="/explore" block>{{ $t('indexPage.exploreColleges') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Feature Card 2: Personalization -->
      <v-col cols="12" md="5">
        <v-card class="feature-card pa-6" flat border rounded="lg">
          <v-card-title class="text-h5 font-weight-medium mb-4">{{ $t('indexPage.organizePlan') }}</v-card-title>
           <v-list density="compact" bg-color="transparent">
             <v-list-item prepend-icon="mdi-format-list-checks" class="mb-2">
                <v-list-item-title class="font-weight-regular">{{ $t('indexPage.personalLists') }}</v-list-item-title>
                <v-list-item-subtitle>{{ $t('indexPage.personalListsSub') }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item prepend-icon="mdi-account-circle" class="mb-2">
                <v-list-item-title class="font-weight-regular">{{ $t('indexPage.profileMgmt') }}</v-list-item-title>
                <v-list-item-subtitle>{{ $t('indexPage.profileMgmtSub') }}</v-list-item-subtitle>
              </v-list-item>
               <v-list-item prepend-icon="mdi-calendar-check" class="mb-2">
                <v-list-item-title class="font-weight-regular">{{ $t('indexPage.deadlineTracking') }}</v-list-item-title>
                <v-list-item-subtitle>{{ $t('indexPage.deadlineTrackingSub') }}</v-list-item-subtitle>
              </v-list-item>
          </v-list>
          <v-card-actions class="mt-4">
             <v-btn color="secondary" variant="outlined" to="/profile" block>{{ $t('indexPage.updateProfile') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

     <!-- Developer Team Section -->
     <v-row justify="center" class="mt-12">
       <v-col cols="12" md="10" class="text-center mb-6">
         <h2 class="text-h4 font-weight-bold">{{ $t('indexPage.meetTeam') }}</h2>
         <p class="text-subtitle-1 text-grey-darken-1">
           {{ $t('indexPage.teamSubtitle') }}
         </p>
       </v-col>
     </v-row>

     <v-row justify="center" class="mb-10">
      <!-- Developer Card 1 -->
      <v-col cols="12" md="5">
        <v-card class="feature-card pa-6" flat border rounded="lg">
          <div class="d-flex flex-column align-center mb-4">
            <v-avatar size="120" class="mb-3">
              <v-img src="@/assets/will.jpg" alt="Frontend Developer"></v-img>
            </v-avatar>
            <v-card-title class="text-h5 font-weight-medium text-center pa-0">Will Li</v-card-title>
            <span class="text-subtitle-2 text-grey-darken-1">{{ $t('indexPage.frontendDev') }}</span>
          </div>
          <v-list density="compact" bg-color="transparent">
            <v-list-item prepend-icon="mdi-school" class="mb-2">
              <v-list-item-title class="font-weight-regular">{{ $t('indexPage.school') }}</v-list-item-title>
            </v-list-item>
            <v-list-item prepend-icon="mdi-briefcase" class="mb-2">
              <v-list-item-title class="font-weight-regular">{{ $t('indexPage.gpeClub') }}</v-list-item-title>
            </v-list-item>
          </v-list>
          <v-card-actions class="mt-4">
            <v-btn color="primary" variant="outlined" href="https://github.com/browo1" target="_blank" block>
              <v-icon start>mdi-github</v-icon> {{ $t('indexPage.githubProfile') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Developer Card 2 -->
      <v-col cols="12" md="5">
        <v-card class="feature-card pa-6" flat border rounded="lg">
          <div class="d-flex flex-column align-center mb-4">
            <v-avatar size="120" class="mb-3">
              <v-img src="@/assets/andy.jpg" alt="Frontend Engineer"></v-img>
            </v-avatar>
            <v-card-title class="text-h5 font-weight-medium text-center pa-0">Andy Wang</v-card-title>
            <span class="text-subtitle-2 text-grey-darken-1">{{ $t('indexPage.backendDev') }}</span>
          </div>
          <v-list density="compact" bg-color="transparent">
            <v-list-item prepend-icon="mdi-school" class="mb-2">
              <v-list-item-title class="font-weight-regular">{{ $t('indexPage.school') }}</v-list-item-title>
            </v-list-item>
            <v-list-item prepend-icon="mdi-briefcase" class="mb-2">
              <v-list-item-title class="font-weight-regular">{{ $t('indexPage.gpeClub') }}</v-list-item-title>
            </v-list-item>
          </v-list>
          <v-card-actions class="mt-4">
            <v-btn color="primary" variant="outlined" href="https://github.com/humanoid-a" target="_blank" block>
              <v-icon start>mdi-github</v-icon> {{ $t('indexPage.githubProfile') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Additional Team Members Section -->
    <v-row justify="center" class="mb-14">
      <v-col cols="12" md="10">
        <v-card flat class="text-center pa-6" color="grey-lighten-4" rounded="lg">
          <p class="text-body-1 mb-4">
            {{ $t('indexPage.madeBy') }}
          </p>
          <v-btn color="primary" variant="tonal" href="https://gpeclub.com" class="mt-2">
            {{ $t('indexPage.visitGpe') }}
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<style scoped>
h1 {
  line-height: 1.2;
}

.feature-card {
  background-color: #ffffff;
  height: 100%; /* Make cards equal height */
  display: flex;
  flex-direction: column;
}

.feature-card .v-list-item {
  padding-left: 0;
}

.feature-card .v-list-item-title {
   white-space: normal; /* Allow title to wrap */
   line-height: 1.4;
}

.feature-card .v-card-actions {
  margin-top: auto; /* Push actions to the bottom */
}

/* Adjust list item subtitle color for better contrast on white */
.feature-card .v-list-item-subtitle {
  color: rgba(0, 0, 0, 0.6);
}

/* Ensure icons have good contrast */
.feature-card .v-icon {
  color: rgba(0, 0, 0, 0.7);
}

.product-logo {
  max-width: 200px;
  height: auto;
}

/* Developer team section styles */
.v-avatar {
  border: 3px solid var(--v-theme-primary);
}
</style>
