import { createCollegeData } from './collegeDataStructure';

// Elite colleges (acceptance rate < 10%)
export const eliteColleges = [
  createCollegeData({
    name: 'Harvard University',
    location: 'Cambridge, MA',
    description: 'One of the world\'s most prestigious universities with excellence across disciplines.',
    acceptanceRate: 3,
    tuition: 55587,
    imageUrl: 'https://placehold.co/600x400/ffebee/C2185B?text=Harvard',
    rating: 0,
    reviewCount: 0,
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
    acceptanceRate: 4,
    tuition: 58500,
    imageUrl: 'https://placehold.co/600x400/ffe9e9/D32F2F?text=Stanford',
    rating: 0,
    reviewCount: 0,
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
    acceptanceRate: 4,
    tuition: 57750,
    imageUrl: 'https://placehold.co/600x400/e6f7ff/0288D1?text=MIT',
    rating: 0,
    reviewCount: 0,
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
    acceptanceRate: 5,
    tuition: 56000,
    imageUrl: 'https://placehold.co/600x400/e9f5fe/1976D2?text=Duke',
    rating: 0,
    reviewCount: 0,
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
    acceptanceRate: 6,
    tuition: 60000,
    imageUrl: 'https://placehold.co/600x400/fef3e9/FB8C00?text=UChicago',
    rating: 0,
    reviewCount: 0,
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
