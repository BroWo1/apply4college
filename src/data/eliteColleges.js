import { createCollegeData } from './collegeDataStructure'; // Assuming this path is correct

// Import local images
import uchicagoImg from '@/assets/colleges/uchicago.png';
import dukeImg from '@/assets/colleges/duke.png';
import harvard from '@/assets/colleges/harvard.png';
import stanford from '@/assets/colleges/stanford.png';
import mit from '@/assets/colleges/mit.png';
import cornell from '@/assets/colleges/cornell.png';
import brown from '@/assets/colleges/brown.png';

// Elite colleges (acceptance rate < 10%)
// The statistics (GPA, SAT, AP, EC) have been adjusted to better reflect
// the average applicant profile rather than the average admitted student profile.
// Generally, mean values are slightly lower and standard deviations slightly wider.
export const eliteColleges = [
  createCollegeData({
    name: 'Harvard University',
    location: 'Cambridge, MA',
    acceptanceRate: 3.59, // updated
    tuition: 60000,
    imageUrl: harvard,
    rating: 4.16,
    reviewCount: 881,
    collegeType: 'Liberal-arts',
    websiteUrl: 'https://www.harvard.edu',
    usNewsUrl: 'https://www.usnews.com/best-colleges/harvard-university-2155',
    deadlines: {
      earlyDecision: "November 1", // REA
      regularDecision: "January 1"
    },
    stats: {
      gpa: { mean: 3.86, stdDev: 0.12 },
      sat: { mean: 1510, stdDev: 70 },
      ap: { mean: 7, stdDev: 2.5 },
      ec: { mean: 12, stdDev: 2.5 },
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
    },
    a4cRatings: {
      overall: 'A+',
      categories: [
        { name: 'Academics', rating: 'A+' },
        { name: 'Value', rating: 'A' },
        { name: 'Campus', rating: 'A+' },
        { name: 'Student Life', rating: 'A' },
        { name: 'Location', rating: 'A+' },
        { name: 'Safety', rating: 'B' }
      ]
    },
    majorFactors: {
      STEM: {
        competitive: 0.75, // More competitive
        popular: 0.85      // Very popular
      },
      'Liberal Arts': {
        competitive: 1.20, // Less competitive
        popular: 0.90      // Most popular
      }
    }
  }),

  createCollegeData({
    name: 'Stanford University',
    location: 'Stanford, CA',
    acceptanceRate: 3.9, // updated
    tuition: 60430,
    imageUrl: stanford,
    rating: 4.05,
    reviewCount: 1023,
    collegeType: 'STEM-heavy',
    deadlines: {
      earlyDecision: "November 1", // REA
      regularDecision: "January 5"
    },
    stats: {
      gpa: { mean: 3.86, stdDev: 0.13 },
      sat: { mean: 1520, stdDev: 70 },
      ap: { mean: 8, stdDev: 2.5 },
      ec: { mean: 12, stdDev: 2.5 },
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
    },
    a4cRatings: {
      overall: 'A+',
      categories: [
        { name: 'Academics', rating: 'A+' },
        { name: 'Value', rating: 'A' },
        { name: 'Campus', rating: 'A+' },
        { name: 'Student Life', rating: 'A+' },
        { name: 'Location', rating: 'A+' },
        { name: 'Safety', rating: 'B+' }
      ]
    },
    majorFactors: {
      STEM: {
        competitive: 0.65, // More competitive
        popular: 0.70      // Very popular
      },
      'Liberal Arts': {
        competitive: 1.15, // Less competitive
        popular: 1.10      // Less popular
      }
    }
  }),

  createCollegeData({
    name: 'MIT',
    location: 'Cambridge, MA',
    acceptanceRate: 4.5, // updated
    tuition: 57986,
    imageUrl: mit,
    rating: 4.18,
    reviewCount: 742,
    collegeType: 'STEM-heavy',
    deadlines: {
      earlyDecision: "November 1", // EA
      regularDecision: "January 6"
    },
    stats: {
      gpa: { mean: 3.85, stdDev: 0.14 },
      sat: { mean: 1525, stdDev: 65 },
      ap: { mean: 7, stdDev: 2.5 },
      ec: { mean: 10, stdDev: 2.5 },
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
    },
    a4cRatings: {
      overall: 'A+',
      categories: [
        { name: 'Academics', rating: 'A+' },
        { name: 'Value', rating: 'A' },
        { name: 'Campus', rating: 'A-' },
        { name: 'Student Life', rating: 'A-' },
        { name: 'Location', rating: 'A' },
        { name: 'Safety', rating: 'A-' }
      ]
    }
  }),

  createCollegeData({
    name: 'Duke University',
    location: 'Durham, NC',
    acceptanceRate: 5.4, // updated
    tuition: 66327,
    imageUrl: dukeImg,
    rating: 3.95,
    reviewCount: 1235,
    collegeType: 'Liberal-arts',
    deadlines: {
      earlyDecision: "November 4", // updated
      regularDecision: "January 2"
    },
    stats: {
      gpa: { mean: 3.84, stdDev: 0.15 },
      sat: { mean: 1510, stdDev: 80 },
      ap: { mean: 7, stdDev: 2.5 },
      ec: { mean: 10, stdDev: 3.5 },
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
    },
    a4cRatings: {
      overall: 'A+',
      categories: [
        { name: 'Academics', rating: 'A+' },
        { name: 'Value', rating: 'A-' },
        { name: 'Campus', rating: 'A+' },
        { name: 'Student Life', rating: 'A+' },
        { name: 'Location', rating: 'A-' },
        { name: 'Safety', rating: 'B' }
      ]
    }
  }),

  createCollegeData({
    name: 'University of Chicago',
    location: 'Chicago, IL',
    acceptanceRate: 5.0, // updated
    tuition: 67446,
    imageUrl: uchicagoImg,
    rating: 3.83,
    reviewCount: 1333,
    collegeType: 'Liberal-arts',
    deadlines: {
      earlyDecision: "November 1", // ED
      regularDecision: "January 6"
    },
    stats: {
      gpa: { mean: 3.85, stdDev: 0.13 },
      sat: { mean: 1505, stdDev: 75 },
      ap: { mean: 6, stdDev: 2.5 },
      ec: { mean: 9, stdDev: 3.5 },
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
    },
    a4cRatings: {
      overall: 'A+',
      categories: [
        { name: 'Academics', rating: 'A+' },
        { name: 'Value', rating: 'A-' },
        { name: 'Campus', rating: 'A' },
        { name: 'Student Life', rating: 'A-' },
        { name: 'Location', rating: 'A' },
        { name: 'Safety', rating: 'C+' }
      ]
    }
  }),

  createCollegeData({
    name: 'Brown University',
    location: 'Providence, RI',
    description: 'A private Ivy League research university known for its unique Open Curriculum.',
    acceptanceRate: 5.0, // updated
    tuition: 65146,
    imageUrl: brown,
    collegeType: 'Liberal-arts',
    stats: {
      gpa: { mean: 3.93, stdDev: 0.1 },
      sat: { mean: 1500, stdDev: 70 },
      ap: { mean: 8, stdDev: 2.5 },
      ec: { mean: 8, stdDev: 2 },
    },
    deadlines: {
      earlyDecision: 'November 1',
      regularDecision: 'January 3', // updated
    },
    allowsEarlyDecision: true,
    considersLegacy: true,
    a4cRatings: {
      overall: 'A+',
      categories: [
        { name: 'Academics', rating: 'A+' },
        { name: 'Value', rating: 'A-' },
        { name: 'Campus', rating: 'A' },
        { name: 'Student Life', rating: 'A+' },
        { name: 'Location', rating: 'A-' },
        { name: 'Safety', rating: 'B-' }
      ],
    },
    websiteUrl: 'https://www.brown.edu',
    usNewsUrl: 'https://www.usnews.com/best-colleges/brown-university-3401',
  }),
  createCollegeData({
    name: 'Cornell University',
    location: 'Ithaca, NY',
    description: 'A private Ivy League and statutory land-grant research university in Ithaca, New York.',
    acceptanceRate: 8.0, // updated
    tuition: 68380,
    imageUrl: cornell,
    collegeType: 'STEM-heavy',
    stats: {
      gpa: { mean: 3.9, stdDev: 0.12 },
      sat: { mean: 1510, stdDev: 70 },
      ap: { mean: 8, stdDev: 2.5 },
      ec: { mean: 10, stdDev: 2 },
    },
    deadlines: {
      earlyDecision: 'November 1',
      regularDecision: 'January 2',
    },
    allowsEarlyDecision: true,
    considersLegacy: true,
    a4cRatings: {
      overall: 'A+',
      categories: [
        { name: 'Academics', rating: 'A' },
        { name: 'Value', rating: 'A-' },
        { name: 'Campus', rating: 'A+' },
        { name: 'Student Life', rating: 'A' },
        { name: 'Location', rating: 'B+' },
        { name: 'Safety', rating: 'A-' }
      ],
    },
    websiteUrl: 'https://www.cornell.edu',
    usNewsUrl: 'https://www.usnews.com/best-colleges/cornell-university-2711',
  }),
];
