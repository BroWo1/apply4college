import { createCollegeData } from './collegeDataStructure';

// Safety colleges (acceptance rate > 20%)
export const safetyColleges = [
  createCollegeData({
    name: 'University of Washington',
    location: 'Seattle, WA',
    description: 'A top public university known for computer science, engineering, and medicine.',
    acceptanceRate: 45, // updated
    tuition: 12076, // $12,076¹
    rating: 0,
    reviewCount: 0,
    collegeType: 'STEM-heavy',
    allowsEarlyDecision: false,
    applicationDeadline: 'November 15',
    stats: {
      gpa: { mean: 3.72, stdDev: 0.18 },
      sat: { mean: 1350, stdDev: 85 }, // updated
      ap: { mean: 5, stdDev: 2 },
      ec: { mean: 7, stdDev: 3 },
      weights: {
        strength: {
          gpa: 0.33,
          sat: 0.27,
          ap: 0.15,
          ec: 0.25
        },
        alignment: {
          apFit: 0.28,
          ecFit: 0.22,
          rec: 0.15,
          legacy: 0.10,
          demo: 0.25
        }
      }
    },
    a4cRatings: {
      overall: 'A',
      categories: [
        { name: 'Academics', rating: 'A-' },
        { name: 'Value', rating: 'A' },
        { name: 'Campus', rating: 'A' },
        { name: 'Student Life', rating: 'A-' },
        { name: 'Location', rating: 'A+' },
        { name: 'Safety', rating: 'C+' }
      ]
    }
  }),

  createCollegeData({
    name: 'UNC Chapel Hill',
    location: 'Chapel Hill, NC',
    description: 'A public research university known for its strong programs in business, law, and public health.',
    acceptanceRate: 15.3, // updated
    tuition: 9196, // $9,196¹
    rating: 0,
    reviewCount: 0,
    collegeType: 'Liberal-arts',
    allowsEarlyDecision: true,
    earlyActionDeadline: 'October 15',
    regularDecisionDeadline: 'January 15',
    stats: {
      gpa: { mean: 3.8, stdDev: 0.25 }, // updated (weighted)
      sat: { mean: 1380, stdDev: 90 },
      ap: { mean: 4, stdDev: 2 },
      ec: { mean: 6, stdDev: 3 },
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
        { name: 'Academics', rating: 'A' },
        { name: 'Value', rating: 'A+' },
        { name: 'Campus', rating: 'A' },
        { name: 'Student Life', rating: 'A' },
        { name: 'Location', rating: 'A-' },
        { name: 'Safety', rating: 'B' }
      ]
    }
  }),

  createCollegeData({
    name: 'UIUC',
    location: 'Champaign, IL',
    description: 'A leading public research university with a strong emphasis on engineering and computer science.',
    acceptanceRate: 42.4, // updated
    tuition: 15000, // $15,000¹
    rating: 0,
    reviewCount: 0,
    collegeType: 'STEM-heavy',
    allowsEarlyDecision: true,
    earlyActionDeadline: 'November 1',
    regularDecisionDeadline: 'January 5',
    stats: {
      gpa: { mean: 3.7, stdDev: 0.22 }, // updated
      sat: { mean: 1360, stdDev: 95 }, // updated
      ap: { mean: 4, stdDev: 2 },
      ec: { mean: 5, stdDev: 3 },
      weights: {
        strength: {
          gpa: 0.35,
          sat: 0.30,
          ap: 0.15,
          ec: 0.20
        },
        alignment: {
          apFit: 0.32,
          ecFit: 0.18,
          rec: 0.15,
          legacy: 0.10,
          demo: 0.25
        }
      }
    },
    a4cRatings: {
      overall: 'A',
      categories: [
        { name: 'Academics', rating: 'A' },
        { name: 'Value', rating: 'A' },
        { name: 'Campus', rating: 'B+' },
        { name: 'Student Life', rating: 'A' },
        { name: 'Location', rating: 'B-' },
        { name: 'Safety', rating: 'B' }
      ]
    }
  })
];
