<template>
  <v-container fluid class="pa-0">
    <!-- Hero Section with College Cards -->
    <v-sheet class="hero-section" color="primary">
      <v-container>
        <v-row align="center" class="py-8 py-md-12">
          <v-col cols="12" md="6" class="text-start">
            <v-img 
              src="../assets/a4c.svg" 
              alt="Apply 4 College Logo" 
              :max-width="$vuetify.display.xs ? 80 : 100"
              class="mb-4"
            />
            <h1 class="text-h4 text-md-h2 font-weight-black mb-3">
              {{ $t('indexPage.title') }}
            </h1>
            <p class="text-body-1 text-md-h6 font-weight-light mb-6 opacity-90">
              {{ $t('indexPage.subtitle') }}
            </p>
            <v-btn
              size="large"
              variant="flat"
              color="white"
              class="text-primary"
              to="/home"
              rounded="lg"
              prepend-icon="mdi-rocket-launch"
            >
              {{ $t('indexPage.getStarted') }}
            </v-btn>
          </v-col>
          
          <!-- Animated College Cards -->
          <v-col cols="12" md="6" class="d-none d-md-block position-relative" style="height: 400px;">
            <div class="college-cards-container">
              <v-card
                v-for="(college, index) in displayedColleges"
                :key="`${college.name}-${cardKey}`"
                class="college-preview-card"
                :style="getCardStyle(index)"
                rounded="lg"
                elevation="8"
              >
                <v-img
                  :src="college.image"
                  height="120"
                  cover
                />
                <v-card-text class="pa-3">
                  <h4 class="text-subtitle-2 font-weight-bold text-truncate">{{ college.name }}</h4>
                  <p class="text-caption mb-1">{{ college.location }}</p>
                  <v-chip size="x-small" color="white" variant="tonal">
                    {{ college.acceptanceRate }}% acceptance
                  </v-chip>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <!-- Features Section -->
    <v-container class="py-12 py-md-16">
      <v-row>
        <v-col cols="12" md="6" class="mb-6">
          <v-card rounded="xl" elevation="0" color="grey-lighten-5" class="h-100">
            <v-card-text class="pa-6 pa-md-8">
              <v-icon size="40" color="primary" class="mb-4">mdi-magnify-scan</v-icon>
              <v-card-title class="text-h5 pa-0 mb-4">{{ $t('indexPage.exploreAnalyze') }}</v-card-title>
              
              <v-list bg-color="transparent" class="mb-4">
                <v-list-item v-for="(item, i) in exploreFeatures" :key="i" class="px-0">
                  <template v-slot:prepend>
                    <v-icon :icon="item.icon" color="primary"></v-icon>
                  </template>
                  <v-list-item-title class="font-weight-medium">{{ item.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
              
              <v-btn color="primary" size="large" to="/explore" block rounded="lg">
                {{ $t('indexPage.exploreColleges') }}
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6" class="mb-6">
          <v-card rounded="xl" elevation="0" color="grey-lighten-5" class="h-100">
            <v-card-text class="pa-6 pa-md-8">
              <v-icon size="40" color="secondary" class="mb-4">mdi-clipboard-check-outline</v-icon>
              <v-card-title class="text-h5 pa-0 mb-4">{{ $t('indexPage.organizePlan') }}</v-card-title>
              
              <v-list bg-color="transparent" class="mb-4">
                <v-list-item v-for="(item, i) in organizeFeatures" :key="i" class="px-0">
                  <template v-slot:prepend>
                    <v-icon :icon="item.icon" color="secondary"></v-icon>
                  </template>
                  <v-list-item-title class="font-weight-medium">{{ item.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
              
              <v-btn color="secondary" size="large" to="/profile" block rounded="lg">
                {{ $t('indexPage.updateProfile') }}
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Team Section -->
    <v-sheet color="grey-lighten-4" class="py-12 py-md-16">
      <v-container>
        <div class="text-center mb-8">
          <h2 class="text-h4 font-weight-black mb-2">{{ $t('indexPage.meetTeam') }}</h2>
          <p class="text-subtitle-1 text-grey-darken-2">{{ $t('indexPage.teamSubtitle') }}</p>
        </div>

        <v-row>
          <v-col v-for="member in teamMembers" :key="member.name" cols="12" md="4">
            <v-card rounded="xl" elevation="0" class="text-center h-100">
              <v-card-text class="pa-6">
                <v-avatar size="120" class="mb-4">
                  <v-img :src="member.image" :alt="member.name"></v-img>
                </v-avatar>
                <h4 class="text-h6 font-weight-bold mb-1">{{ member.name }}</h4>
                <p class="text-subtitle-2 text-primary mb-3">{{ member.role }}</p>
                <v-chip-group column class="mb-3">
                  <v-chip size="small" variant="tonal">📚 {{ member.school }}</v-chip>
                  <v-chip size="small" variant="tonal">💼 {{ member.club }}</v-chip>
                </v-chip-group>
                <v-btn variant="tonal" color="primary" :href="member.github" target="_blank" block rounded="lg">
                  <v-icon start>mdi-github</v-icon>
                  GitHub
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- GPE Club Section -->
        <v-card class="text-center mt-8" color="primary" rounded="xl">
          <v-card-text class="pa-6">
            <p class="text-h6 mb-4">{{ $t('indexPage.madeBy') }}</p>
            <v-btn variant="flat" color="white" class="text-primary" href="https://gpeclub.com" rounded="lg">
              {{ $t('indexPage.visitGpe') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-container>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { colleges } from '@/data/colleges.js';

// Import avatars
import willImg from '@/assets/will.jpg';
import andyImg from '@/assets/andy.jpg';
import jczImg from '@/assets/jcz.jpg';

const { t } = useI18n();

// College cards animation
const cardKey = ref(0);
const displayedColleges = ref([]);
let intervalId = null;

// Get random colleges for hero display
const getRandomColleges = () => {
  const shuffled = [...colleges].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

// Card positioning
const getCardStyle = (index) => {
  const positions = [
    { top: '20px', right: '20px', transform: 'rotate(-5deg)', zIndex: 3 },
    { top: '50px', right: '80px', transform: 'rotate(3deg)', zIndex: 2 },
    { top: '80px', right: '140px', transform: 'rotate(-2deg)', zIndex: 1 }
  ];
  return positions[index] || {};
};

// Rotate colleges every 3 seconds
onMounted(() => {
  displayedColleges.value = getRandomColleges();
  intervalId = setInterval(() => {
    displayedColleges.value = getRandomColleges();
    cardKey.value++; // Force re-render with new key
  }, 3000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

const exploreFeatures = computed(() => [
  {
    icon: 'mdi-school',
    title: t('indexPage.collegeDb'),
    subtitle: t('indexPage.collegeDbSub')
  },
  {
    icon: 'mdi-calculator-variant',
    title: t('indexPage.chanceCalc'),
    subtitle: t('indexPage.chanceCalcSub')
  },
  {
    icon: 'mdi-lightbulb-on-outline',
    title: t('indexPage.aiAdvisor'),
    subtitle: t('indexPage.aiAdvisorSub')
  }
]);

const organizeFeatures = computed(() => [
  {
    icon: 'mdi-format-list-checks',
    title: t('indexPage.personalLists'),
    subtitle: t('indexPage.personalListsSub')
  },
  {
    icon: 'mdi-account-circle',
    title: t('indexPage.profileMgmt'),
    subtitle: t('indexPage.profileMgmtSub')
  },
  {
    icon: 'mdi-calendar-check',
    title: t('indexPage.deadlineTracking'),
    subtitle: t('indexPage.deadlineTrackingSub')
  }
]);

const teamMembers = [
  {
    name: 'Will Li',
    role: t('indexPage.frontendDev'),
    school: t('indexPage.school'),
    club: t('indexPage.gpeClub'),
    image: willImg,
    github: 'https://github.com/browo1'
  },
  {
    name: 'Andy Wang',
    role: t('indexPage.backendDev'),
    school: t('indexPage.school'),
    club: t('indexPage.gpeClub'),
    image: andyImg,
    github: 'https://github.com/humanoid-a'
  },
  {
    name: 'Jiace Zhao',
    role: t('indexPage.fullstackDev'),
    school: t('indexPage.school3'),
    club: t('indexPage.krypotoClub'),
    image: jczImg,
    github: 'https://github.com/chrisdsasa'
  }
];
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, var(--v-theme-primary) 0%, var(--v-theme-primary-darken-1) 100%);
  min-height: auto;
  overflow: hidden;
}

/* College Cards Animation */
.college-cards-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.college-preview-card {
  position: absolute;
  width: 220px;
  background: rgba(255, 255, 255, 0.95);
  transition: all 0.5s ease;
  animation: fadeInSlide 0.5s ease;
}

@keyframes fadeInSlide {
  from {
    opacity: 0;
    transform: translateX(50px) rotate(0deg);
  }
  to {
    opacity: 1;
  }
}

.college-preview-card:hover {
  transform: translateY(-8px) rotate(0deg) !important;
  z-index: 10 !important;
}

/* Card hover effects */
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

/* Clean button styles */
.v-btn {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
}
</style>