import { createCollegeData } from './collegeDataStructure';

// Safety colleges (acceptance rate > 20%)
export const safetyColleges = [
  createCollegeData({
    name: 'University of Washington',
    location: 'Seattle, WA',
    description: 'A top public university known for computer science, engineering, and medicine.',
    acceptanceRate: 52,
    tuition: 12076,
    rating: 0,
    reviewCount: 0,
    collegeType: 'STEM-heavy',
    allowsEarlyDecision: false,
    applicationDeadline: 'November 15',
    stats: {
      gpa: { mean: 3.72, stdDev: 0.18 },
      sat: { mean: 1400, stdDev: 85 },
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
    }
  }),

  createCollegeData({
    name: 'UNC Chapel Hill',
    location: 'Chapel Hill, NC',
    description: 'A public research university known for its strong programs in business, law, and public health.',
    acceptanceRate: 23,
    tuition: 9196,
    rating: 0,
    reviewCount: 0,
    collegeType: 'Liberal-arts',
    allowsEarlyDecision: true,
    earlyActionDeadline: 'October 15',
    regularDecisionDeadline: 'January 15',
    stats: {
      gpa: { mean: 3.6, stdDev: 0.25 },
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
    }
  }),

  createCollegeData({
    name: 'UIUC',
    location: 'Champaign, IL',
    description: 'A leading public research university with a strong emphasis on engineering and computer science.',
    acceptanceRate: 60,
    tuition: 15000,
    rating: 0,
    reviewCount: 0,
    collegeType: 'STEM-heavy',
    allowsEarlyDecision: true,
    earlyActionDeadline: 'November 1',
    regularDecisionDeadline: 'January 5',
    stats: {
      gpa: { mean: 3.62, stdDev: 0.22 },
      sat: { mean: 1400, stdDev: 95 },
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
    }
  })
];
