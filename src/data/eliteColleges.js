import { createCollegeData } from './collegeDataStructure';

// Elite colleges (acceptance rate < 10%)
export const eliteColleges = [
  createCollegeData({
    name: 'Harvard University',
    location: 'Cambridge, MA',
    description: "One of the world's most prestigious universities with excellence across disciplines.",
    acceptanceRate: 3.5,
    tuition: 60000,
    imageUrl: 'https://placehold.co/600x400/C2185B/ffffff?text=Harvard',
    rating: 4.16,
    reviewCount: 881,
    collegeType: 'Liberal-arts',
    stats: {
      gpa: { mean: 3.96, stdDev: 0.07 },
      sat: { mean: 1540, stdDev: 50 },
      ap: { mean: 9, stdDev: 2 },
      ec: { mean: 13, stdDev: 2 },
      weights: {
        strength: {
          gpa: 0.30,
          sat: 0.22,
          ap: 0.13,
          ec: 0.35
        },
        alignment: {
          apFit: 0.20,
          ecFit: 0.30,
          rec: 0.20,
          legacy: 0.15,
          demo: 0.15
        }
      }
    }
  }),

  createCollegeData({
    name: 'Stanford University',
    location: 'Stanford, CA',
    description: 'A private research university with strengths across disciplines, particularly in technology and entrepreneurship.',
    acceptanceRate: 3.9,
    tuition: 67731,
    imageUrl: 'https://placehold.co/600x400/D32F2F/ffffff?text=Stanford',
    rating: 4.12,
    reviewCount: 1314,
    collegeType: 'STEM-heavy',
    stats: {
      gpa: { mean: 3.96, stdDev: 0.08 },
      sat: { mean: 1550, stdDev: 50 },
      ap: { mean: 10, stdDev: 2 },
      ec: { mean: 12, stdDev: 2 },
      weights: {
        strength: {
          gpa: 0.32,
          sat: 0.28,
          ap: 0.15,
          ec: 0.25
        },
        alignment: {
          apFit: 0.28,
          ecFit: 0.22,
          rec: 0.15,
          legacy: 0.15,
          demo: 0.20
        }
      }
    }
  }),

  createCollegeData({
    name: 'MIT',
    location: 'Cambridge, MA',
    description: 'A private research university focused on science, engineering, and technology education.',
    acceptanceRate: 4.5,
    tuition: 61990,
    imageUrl: 'https://placehold.co/600x400/0288D1/ffffff?text=MIT',
    rating: 4.18,
    reviewCount: 675,
    collegeType: 'STEM-heavy',
    stats: {
      gpa: { mean: 3.95, stdDev: 0.09 },
      sat: { mean: 1555, stdDev: 45 },
      ap: { mean: 9, stdDev: 2 },
      ec: { mean: 10, stdDev: 2 },
      weights: {
        strength: {
          gpa: 0.38,
          sat: 0.32,
          ap: 0.18,
          ec: 0.12
        },
        alignment: {
          apFit: 0.35,
          ecFit: 0.25,
          rec: 0.15,
          legacy: 0.05,
          demo: 0.20
        }
      }
    }
  }),

  createCollegeData({
    name: 'Duke University',
    location: 'Durham, NC',
    description: 'A private research university known for its strong academic programs and vibrant campus life.',
    acceptanceRate: 6.8,
    tuition: 66327,
    imageUrl: 'https://placehold.co/600x400/1976D2/ffffff?text=Duke',
    rating: 3.95,
    reviewCount: 1235,
    collegeType: 'Liberal-arts',
    stats: {
      gpa: { mean: 3.94, stdDev: 0.1 },
      sat: { mean: 1540, stdDev: 60 },
      ap: { mean: 9, stdDev: 2 },
      ec: { mean: 12, stdDev: 3 },
      weights: {
        strength: {
          gpa: 0.32,
          sat: 0.28,
          ap: 0.15,
          ec: 0.25
        },
        alignment: {
          apFit: 0.25,
          ecFit: 0.25,
          rec: 0.20,
          legacy: 0.18,
          demo: 0.12
        }
      }
    }
  }),

  createCollegeData({
    name: 'University of Chicago',
    location: 'Chicago, IL',
    description: 'A private research university known for its rigorous academics and diverse student body.',
    acceptanceRate: 5.0,
    tuition: 67446,
    imageUrl: 'https://placehold.co/600x400/FB8C00/ffffff?text=UChicago',
    rating: 3.83,
    reviewCount: 1333,
    collegeType: 'Liberal-arts',
    stats: {
      gpa: { mean: 3.95, stdDev: 0.08 },
      sat: { mean: 1535, stdDev: 55 },
      ap: { mean: 8, stdDev: 2 },
      ec: { mean: 11, stdDev: 3 },
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
          rec: 0.20,
          legacy: 0.15,
          demo: 0.15
        }
      }
    }
  })
];
