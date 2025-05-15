import { createCollegeData } from './collegeDataStructure';

// Target colleges (acceptance rate between 10% and 20%)
export const targetColleges = [
  createCollegeData({
    name: 'UC Berkeley',
    location: 'Berkeley, CA',
    description: 'A public research university known for its strong engineering and science programs.',
    acceptanceRate: 10,
    tuition: 14000,
    imageUrl: 'https://placehold.co/600x400/f4e9fe/9C27B0?text=UCB',
    rating: 0,
    reviewCount: 0,
    collegeType: 'STEM-heavy',
    allowsEarlyDecision: false, // Example: UCs generally don't have ED
    considersLegacy: false, // Example: UCs generally don't consider legacy
    stats: {
      gpa: { mean: 3.89, stdDev: 0.12 },
      sat: { mean: 1480, stdDev: 70 },
      ap: { mean: 7, stdDev: 2 },
      ec: { mean: 10, stdDev: 3 },
      weights: {
        strength: {
          gpa: 0.35,
          sat: 0.30,
          ap: 0.15,
          ec: 0.20
        },
        alignment: {
          apFit: 0.30,
          ecFit: 0.20,
          rec: 0.15,
          legacy: 0.10,
          demo: 0.25
        }
      }
    }
  }),

  createCollegeData({
    name: 'UC Los Angeles',
    location: 'Los Angeles, CA',
    description: 'A public research university known for its diverse programs and vibrant campus life.',
    acceptanceRate: 12,
    tuition: 14000,
    imageUrl: 'https://placehold.co/600x400/e9fef3/4CAF50?text=UCLA',
    rating: 0,
    reviewCount: 0,
    collegeType: 'Liberal-arts',
    allowsEarlyDecision: false, // Example: UCs generally don't have ED
    considersLegacy: false, // Example: UCs generally don't consider legacy
    stats: {
      gpa: { mean: 3.85, stdDev: 0.15 },
      sat: { mean: 1460, stdDev: 75 },
      ap: { mean: 6, stdDev: 2 },
      ec: { mean: 9, stdDev: 3 },
      weights: {
        strength: {
          gpa: 0.32,
          sat: 0.25,
          ap: 0.13,
          ec: 0.30
        },
        alignment: {
          apFit: 0.22,
          ecFit: 0.28,
          rec: 0.18,
          legacy: 0.10,
          demo: 0.22
        }
      }
    }
  }),

  createCollegeData({
    name: 'University of Michigan',
    location: 'Ann Arbor, MI',
    description: 'A leading public research university with strengths in multiple academic areas.',
    acceptanceRate: 18,
    tuition: 17786,
    imageUrl: 'https://placehold.co/600x400/fff8e1/FFB300?text=UMich',
    rating: 0,
    reviewCount: 0,
    collegeType: 'Liberal-arts',
    // Michigan has Early Action, not strictly ED, but for this example, let's say it allows a form of early application
    allowsEarlyDecision: true,
    considersLegacy: true, // Public universities vary, Michigan might
    stats: {
      gpa: { mean: 3.82, stdDev: 0.15 },
      sat: { mean: 1435, stdDev: 80 },
      ap: { mean: 6, stdDev: 2 },
      ec: { mean: 8, stdDev: 3 },
      weights: {
        strength: {
          gpa: 0.30,
          sat: 0.25,
          ap: 0.15,
          ec: 0.30
        },
        alignment: {
          apFit: 0.25,
          ecFit: 0.25,
          rec: 0.18,
          legacy: 0.12,
          demo: 0.20
        }
      }
    }
  }),

  createCollegeData({
    name: 'Carnegie Mellon University',
    location: 'Pittsburgh, PA',
    description: 'A private research university with renowned programs in computer science and engineering.',
    acceptanceRate: 15,
    tuition: 58924,
    rating: 0,
    reviewCount: 0,
    collegeType: 'STEM-heavy',
    allowsEarlyDecision: true,
    considersLegacy: true,
    stats: {
      gpa: { mean: 3.85, stdDev: 0.14 },
      sat: { mean: 1500, stdDev: 65 },
      ap: { mean: 8, stdDev: 2 },
      ec: { mean: 10, stdDev: 3 },
      weights: {
        strength: {
          gpa: 0.35,
          sat: 0.30,
          ap: 0.15,
          ec: 0.20
        },
        alignment: {
          apFit: 0.32,
          ecFit: 0.22,
          rec: 0.16,
          legacy: 0.10,
          demo: 0.20
        }
      }
    }
  })
];
