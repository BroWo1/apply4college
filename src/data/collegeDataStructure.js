// Base college data structure - defines the expected properties for each college
export const createCollegeData = ({
  name,
  location,
  description,
  acceptanceRate,
  tuition,
  imageUrl,
  collegeType, // 'STEM-heavy' or 'Liberal-arts'
  stats,
  deadlines = {}, // Add default empty deadlines object
  allowsEarlyDecision = true, // New flag
  considersLegacy = true, // New flag
  a4cRatings = {}, // New field for A4C ratings
  majorFactors = {}, // New field for major-specific competitive factors
  websiteUrl, // Official college website URL
  usNewsUrl // US News ranking page URL
}) => {
  // Generate a placeholder image if none provided
  const image = imageUrl ||
    `https://placehold.co/600x400/${getColorForCollege(name)}/FFFFFF?text=${encodeURIComponent(name)}`;

  // Set default major factors if not provided
  const defaultMajorFactors = {
    STEM: {
      competitive: collegeType === 'STEM-heavy' ? 0.7 : 1.2, // Default based on college type
      popular: collegeType === 'STEM-heavy' ? 0.8 : 1.1     // Additional factor for popular majors
    },
    'Liberal Arts': {
      competitive: collegeType === 'Liberal-arts' ? 0.7 : 1.2,
      popular: collegeType === 'Liberal-arts' ? 0.8 : 1.1
    }
  };

  return {
    name,
    location,
    description,
    acceptanceRate,
    tuition,
    image,
    collegeType,
    stats: {
      gpa: stats.gpa || { mean: 3.8, stdDev: 0.15 },
      sat: stats.sat || { mean: 1400, stdDev: 80 },
      ap: stats.ap || { mean: 6, stdDev: 2 },
      ec: stats.ec || { mean: 8, stdDev: 3 },
      weights: stats.weights || getDefaultWeights(collegeType)
    },
    // Add default deadlines if not provided
    deadlines: {
      earlyDecision: deadlines.earlyDecision || "November 1",
      regularDecision: deadlines.regularDecision || "January 1"
    },
    allowsEarlyDecision, // Add to returned object
    considersLegacy,      // Add to returned object
    a4cRatings: {
      overall: a4cRatings.overall || 'N/A', // Default overall rating
      categories: a4cRatings.categories || [] // Default empty array for sub-categories
    },
    majorFactors: {
      ...defaultMajorFactors,
      ...majorFactors // Override defaults with college-specific factors
    },
    // Website URLs with fallback generation
    websiteUrl: websiteUrl || generateWebsiteUrl(name),
    usNewsUrl: usNewsUrl || generateUsNewsUrl(name)
  };
};

// Helper function to generate a color hash based on college name
const getColorForCollege = (name) => {
  // Simple hash function to create a color from the college name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert to hex color (removing red tones to ensure contrast with text)
  const color = (hash & 0x00FFFF).toString(16).padStart(6, '0');
  return color;
};

// Helper function to generate website URL for a college
const generateWebsiteUrl = (name) => {
  const collegeName = name.toLowerCase();
  
  // Common college website patterns
  if (collegeName.includes('harvard')) return 'https://www.harvard.edu';
  if (collegeName.includes('stanford')) return 'https://www.stanford.edu';
  if (collegeName.includes('mit')) return 'https://www.mit.edu';
  if (collegeName.includes('yale')) return 'https://www.yale.edu';
  if (collegeName.includes('princeton')) return 'https://www.princeton.edu';
  if (collegeName.includes('columbia')) return 'https://www.columbia.edu';
  if (collegeName.includes('university of chicago')) return 'https://www.uchicago.edu';
  if (collegeName.includes('duke')) return 'https://www.duke.edu';
  if (collegeName.includes('penn') || collegeName.includes('university of pennsylvania')) return 'https://www.upenn.edu';
  if (collegeName.includes('caltech')) return 'https://www.caltech.edu';
  if (collegeName.includes('northwestern')) return 'https://www.northwestern.edu';
  if (collegeName.includes('dartmouth')) return 'https://home.dartmouth.edu';
  if (collegeName.includes('brown')) return 'https://www.brown.edu';
  if (collegeName.includes('cornell')) return 'https://www.cornell.edu';
  if (collegeName.includes('rice')) return 'https://www.rice.edu';
  if (collegeName.includes('notre dame')) return 'https://www.nd.edu';
  if (collegeName.includes('vanderbilt')) return 'https://www.vanderbilt.edu';
  if (collegeName.includes('washington university')) return 'https://wustl.edu';
  if (collegeName.includes('emory')) return 'https://www.emory.edu';
  if (collegeName.includes('georgetown')) return 'https://www.georgetown.edu';
  if (collegeName.includes('carnegie mellon')) return 'https://www.cmu.edu';
  if (collegeName.includes('ucla')) return 'https://www.ucla.edu';
  if (collegeName.includes('university of california, berkeley') || collegeName.includes('uc berkeley')) return 'https://www.berkeley.edu';
  
  // Generic fallback - try to construct a likely URL
  const cleanName = collegeName
    .replace(/university of /g, '')
    .replace(/college/g, '')
    .replace(/[^a-z\s]/g, '')
    .trim()
    .split(' ')[0];
  
  return `https://www.${cleanName}.edu`;
};

// Helper function to generate US News URL for a college
const generateUsNewsUrl = (name) => {
  const collegeName = name
    .toLowerCase()
    .replace(/[^a-z\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/university-of-/g, '') // Simplify "University of" patterns
    .replace(/college/g, '')
    .replace(/-+/g, '-') // Remove multiple consecutive hyphens
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  
  return `https://www.usnews.com/best-colleges/${collegeName}`;
};

// Get default weights based on college type
export const getDefaultWeights = (collegeType) => {
  if (collegeType === 'STEM-heavy') {
    return {
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
        legacy: 0.15,
        demo: 0.20
      }
    };
  } else {
    // Default to Liberal Arts weights
    return {
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
    };
  }
};
