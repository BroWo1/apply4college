<template>
  <div class="index-page">
    <!-- Modern Hero Section -->
    <section class="hero-section" aria-labelledby="hero-title">
      <div class="hero-content">
        <div class="hero-decoration">
          <div class="floating-icons">
            <v-icon class="floating-icon icon-1">mdi-school</v-icon>
            <v-icon class="floating-icon icon-2">mdi-star</v-icon>
            <v-icon class="floating-icon icon-3">mdi-lightbulb</v-icon>
            <v-icon class="floating-icon icon-4">mdi-book-open-variant</v-icon>
            <v-icon class="floating-icon icon-5">mdi-account-group</v-icon>
            <v-icon class="floating-icon icon-6">mdi-map-marker</v-icon>
          </div>
        </div>
        <v-container>
          <v-row align="center" class="py-4 py-md-6">
            <v-col cols="12" md="6" class="text-start">
              <v-img 
                src="../assets/a4c.svg" 
                alt="Apply 4 College Logo" 
                :max-width="$vuetify.display.xs ? 80 : 100"
                class="mb-4"
              />
              <h1 id="hero-title" class="hero-title">
                {{ $t('indexPage.title') }}
              </h1>
              <p class="hero-subtitle">
                {{ $t('indexPage.subtitle') }}
              </p>
              <v-btn
                size="x-large"
                variant="flat"
                color="white"
                class="text-primary cta-button"
                to="/home"
                rounded="xl"
                prepend-icon="mdi-rocket-launch"
              >
                {{ $t('indexPage.getStarted') }}
              </v-btn>
            </v-col>
            
            <!-- Animated College Cards -->
            <v-col cols="12" md="6" class="d-none d-md-block position-relative" style="height: 300px;">
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
      </div>
    </section>

    <!-- Main Content -->
    <main class="main-content">

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
          <p class="text-subtitle-1" style="color: #1f2937;">{{ $t('indexPage.teamSubtitle') }}</p>
        </div>

        <div class="team-cards-container">
          <div class="team-cards-scroll">
            <v-card 
              v-for="member in teamMembers" 
              :key="member.name" 
              rounded="xl" 
              elevation="0" 
              class="text-center team-card"
            >
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
          </div>
        </div>

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
    </main>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { colleges } from '@/data/colleges.js';

// Import avatars
import willImg from '@/assets/will.jpg';
import andyImg from '@/assets/andy.jpg';
import jczImg from '@/assets/jcz.jpg';
import ericImg from '@/assets/eric.jpg';

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
  }, 4000);
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
  },
  {
    name: 'Eric Jia',
    role: t('Lead Designer'),
    school: t('indexPage.school'),
    club: t('Spartans Magazine'),
    image: ericImg,
  },
];
</script>

<style scoped>
.index-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* Modern Hero Section */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, 
    #8b5cf6 0%, 
    #7c3aed 50%,
    #6d28d9 100%
  );
  padding: 2rem 2rem;
  overflow: hidden;
  color: white;
}

.hero-content {
  position: relative;
  z-index: 10;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
  font-weight: 300;
}

.cta-button {
  text-transform: none;
  font-weight: 600;
  padding: 0 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.cta-button:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

/* Floating Animation */
.hero-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.floating-icons {
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-icon {
  position: absolute;
  opacity: 0.1;
  font-size: 3rem;
  animation: float 6s ease-in-out infinite;
  pointer-events: none;
}

.icon-1 {
  top: 10%;
  left: 15%;
  font-size: 2.5rem;
  animation-duration: 7s;
}

.icon-2 {
  top: 60%;
  right: 15%;
  font-size: 3.5rem;
  animation-duration: 8s;
  animation-delay: 1s;
}

.icon-3 {
  bottom: 20%;
  left: 5%;
  font-size: 2rem;
  animation-duration: 6s;
  animation-delay: 2s;
}

.icon-4 {
  top: 15%;
  right: 5%;
  font-size: 3rem;
  animation-duration: 9s;
  animation-delay: 3s;
}

.icon-5 {
  bottom: 10%;
  right: 25%;
  font-size: 2.8rem;
  animation-duration: 7.5s;
  animation-delay: 4s;
}

.icon-6 {
  top: 50%;
  left: 25%;
  font-size: 2.2rem;
  animation-duration: 8.5s;
  animation-delay: 5s;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
  }
  50% { 
    transform: translateY(-20px) rotate(10deg); 
  }
}

/* Main Content */
.main-content {
  position: relative;
  z-index: 5;
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
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
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
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
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

/* Team Cards Horizontal Scroll */
.team-cards-container {
  position: relative;
  overflow: hidden;
  margin: 0 -1rem;
  padding: 0 1rem;
}

.team-cards-scroll {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 1rem 0;
  scrollbar-width: thin;
  scrollbar-color: #e2e8f0 transparent;
}

.team-cards-scroll::-webkit-scrollbar {
  height: 8px;
}

.team-cards-scroll::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}

.team-cards-scroll::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.team-cards-scroll::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

.team-card {
  flex: 0 0 300px;
  height: 100%;
  min-height: 400px;
  transition: all 0.3s ease;
}

.team-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  .team-card {
    flex: 0 0 280px;
  }
  
  .team-cards-scroll {
    gap: 1rem;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    padding: 1.5rem 1rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.125rem;
  }
  
  .cta-button {
    width: 100%;
  }
}

/* Update text colors to black */
:deep(.text-caption) {
  color: #1f2937 !important;
}

:deep(.v-list-item-subtitle) {
  color: #1f2937 !important;
}
</style>