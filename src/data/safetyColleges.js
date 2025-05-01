import { createCollegeData } from './collegeDataStructure';

// Safety colleges (acceptance rate > 20%)
export const safetyColleges = [
  createCollegeData({
    name: 'University of Washington',
    location: 'Seattle, WA',
    description: 'A top public university known for computer science, engineering, and medicine.',
    acceptanceRate: 52,
    tuition: 12076,
    rating: 4.3,
    reviewCount: 763,
    collegeType: 'STEM-heavy',
    stats: {
      gpa: { mean: 3.72, stdDev: 0.18 },
      sat: { mean: 1360, stdDev: 85 },
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
    name: 'Boston College',
    location: 'Chestnut Hill, MA',
    description: 'A private Jesuit research university with a strong liberal arts tradition.',
    acceptanceRate: 27,
    tuition: 60950,
    rating: 4.4,
    reviewCount: 684,
    collegeType: 'Liberal-arts',
    stats: {
      gpa: { mean: 3.7, stdDev: 0.2 },
      sat: { mean: 1420, stdDev: 80 },
      ap: { mean: 5, stdDev: 2 },
      ec: { mean: 7, stdDev: 3 },
      weights: {
        strength: {
          gpa: 0.30,
          sat: 0.25,
          ap: 0.15,
          ec: 0.30
        },
        alignment: {
          apFit: 0.23,
          ecFit: 0.27,
          rec: 0.20,
          legacy: 0.15,
          demo: 0.15
        }
      }
    }
  }),

  createCollegeData({
    name: 'University of Wisconsin-Madison',
    location: 'Madison, WI',
    description: 'A large public research university with a beautiful campus and strong school spirit.',
    acceptanceRate: 57,
    tuition: 10720,
    rating: 4.2,
    reviewCount: 725,
    collegeType: 'Liberal-arts',
    stats: {
      gpa: { mean: 3.6, stdDev: 0.25 },
      sat: { mean: 1350, stdDev: 90 },
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
    name: 'Purdue University',
    location: 'West Lafayette, IN',
    description: 'A public research university known for engineering, science, and technology programs.',
    acceptanceRate: 60,
    tuition: 9992,
    rating: 4.2,
    reviewCount: 695,
    collegeType: 'STEM-heavy',
    stats: {
      gpa: { mean: 3.62, stdDev: 0.22 },
      sat: { mean: 1315, stdDev: 95 },
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
