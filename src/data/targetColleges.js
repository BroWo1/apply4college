import { createCollegeData } from './collegeDataStructure';
import ucb from '@/assets/colleges/ucb.png';
import georgetown from '@/assets/colleges/georgetown.png';
import ucla from '@/assets/colleges/ucla.png';

// Target colleges (acceptance rate between 10% and 20%)
export const targetColleges = [
  createCollegeData({
    name: 'UC Berkeley',
    location: 'Berkeley, CA',
    description: 'A public research university known for its strong engineering and science programs.',
    acceptanceRate: 11.4, // updated
    tuition: 14000, // $14,000¹
    imageUrl: ucb,
    rating: 0,
    reviewCount: 0,
    collegeType: 'STEM-heavy',
    allowsEarlyDecision: false, // UCs generally don't have ED
    applicationDeadline: 'November 30', // updated
    considersLegacy: false, // UCs generally don't consider legacy
    stats: {
      gpa: { mean: 3.89, stdDev: 0.12 },
      sat: { mean: null, stdDev: null }, // Test-Blind²
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
    },
    a4cRatings: {
      overall: 'A+',
      categories: [
        { name: 'Academics', rating: 'A+' },
        { name: 'Value', rating: 'A+' },
        { name: 'Campus', rating: 'A-' },
        { name: 'Student Life', rating: 'A' },
        { name: 'Location', rating: 'A+' },
        { name: 'Safety', rating: 'C' }
      ]
    }
  }),

  createCollegeData({
    name: 'UC Los Angeles',
    location: 'Los Angeles, CA',
    description: 'A public research university known for its diverse programs and vibrant campus life.',
    acceptanceRate: 8.6, // updated
    tuition: 14000, // $14,000¹
    imageUrl: ucla,
    rating: 0,
    reviewCount: 0,
    collegeType: 'Liberal-arts',
    allowsEarlyDecision: false, // UCs generally don't have ED
    applicationDeadline: 'November 30', // updated
    considersLegacy: false, // UCs generally don't consider legacy
    stats: {
      gpa: { mean: 3.85, stdDev: 0.15 },
      sat: { mean: null, stdDev: null }, // Test-Blind²
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
    },
    a4cRatings: {
      overall: 'A+',
      categories: [
        { name: 'Academics', rating: 'A+' },
        { name: 'Value', rating: 'A+' },
        { name: 'Campus', rating: 'A' },
        { name: 'Student Life', rating: 'A+' },
        { name: 'Location', rating: 'A+' },
        { name: 'Safety', rating: 'B-' }
      ]
    },
    majorFactors: {
      STEM: {
        competitive: 0.40, // More competitive
        popular: 0.70      // Very popular
      },
      'Liberal Arts': {
        competitive: 1.10, // Less competitive
        popular: 0.90      // Most popular
      }
    }
  }),

  createCollegeData({
    name: 'University of Michigan',
    location: 'Ann Arbor, MI',
    description: 'A leading public research university with strengths in multiple academic areas.',
    acceptanceRate: 17.7, // updated
    tuition: 17786, // $17,786¹
    imageUrl: 'https://placehold.co/600x400/fff8e1/FFB300?text=UMich',
    rating: 0,
    reviewCount: 0,
    collegeType: 'Liberal-arts',
    allowsEarlyDecision: true,
    earlyActionDeadline: 'November 1',
    regularDecisionDeadline: 'February 1',
    considersLegacy: true,
    stats: {
      gpa: { mean: 3.88, stdDev: 0.13 },
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
    },
    a4cRatings: {
      overall: 'A+',
      categories: [
        { name: 'Academics', rating: 'A+' },
        { name: 'Value', rating: 'A+' },
        { name: 'Campus', rating: 'A+' },
        { name: 'Student Life', rating: 'A+' },
        { name: 'Location', rating: 'A' },
        { name: 'Safety', rating: 'B+' }
      ]
    }
  }),

  createCollegeData({
    name: 'Carnegie Mellon University',
    location: 'Pittsburgh, PA',
    description: 'A private research university with renowned programs in computer science and engineering.',
    acceptanceRate: 11, // updated
    tuition: 58924, // $58,924
    rating: 0,
    reviewCount: 0,
    collegeType: 'STEM-heavy',
    allowsEarlyDecision: true,
    earlyDecisionIDeadline: 'November 1',
    regularDecisionDeadline: 'January 2', // updated
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
    },
    a4cRatings: {
      overall: 'A',
      categories: [
        { name: 'Academics', rating: 'A' },
        { name: 'Value', rating: 'B+' },
        { name: 'Campus', rating: 'B' },
        { name: 'Student Life', rating: 'A-' },
        { name: 'Location', rating: 'A-' },
        { name: 'Safety', rating: 'B+' }
      ]
    },
    majorFactors: {
      STEM: {
        competitive: 0.60, // More competitive
        popular: 0.65      // Very popular
      },
      'Liberal Arts': {
        competitive: 1.20, // Less competitive
        popular: 1.15      // Less popular
      }
    }
  }),

  createCollegeData({
    name: 'Georgetown University',
    location: 'Washington, D.C.',
    description: 'A private research university known for its programs in international relations, law, and public policy.',
    acceptanceRate: 13, // updated
    tuition: 64896, // $64,896
    imageUrl: georgetown,
    collegeType: 'Liberal-arts',
    stats: {
      gpa: { mean: 3.9, stdDev: 0.12 },
      sat: { mean: 1470, stdDev: 75 },
      ap: { mean: 7, stdDev: 2.5 },
      ec: { mean: 9, stdDev: 2 },
    },
    deadlines: {
      earlyDecision: 'November 1',
      regularDecision: 'January 10',
    },
    allowsEarlyDecision: true,
    considersLegacy: true,
    a4cRatings: {
      overall: 'A+',
      categories: [
        { name: 'Academics', rating: 'A+' },
        { name: 'Value', rating: 'A-' },
        { name: 'Campus', rating: 'A' },
        { name: 'Student Life', rating: 'A' },
        { name: 'Location', rating: 'A+' },
        { name: 'Safety', rating: 'C+' }
      ],
    },
    websiteUrl: 'https://www.georgetown.edu',
    usNewsUrl: 'https://www.usnews.com/best-colleges/georgetown-university-1445',
  }),
];
