// Base college data structure - defines the expected properties for each college
export const createCollegeData = ({
  name,
  location,
  description,
  acceptanceRate,
  tuition,
  imageUrl,
  rating,
  reviewCount,
  collegeType, // 'STEM-heavy' or 'Liberal-arts'
  stats
}) => {
  // Generate a placeholder image if none provided
  const image = imageUrl ||
    `https://placehold.co/600x400/${getColorForCollege(name)}/FFFFFF?text=${encodeURIComponent(name)}`;

  return {
    name,
    location,
    description,
    acceptanceRate,
    tuition,
    image,
    rating: rating || 0,
    reviewCount: reviewCount || 0,
    collegeType,
    stats: {
      gpa: stats.gpa || { mean: 3.8, stdDev: 0.15 },
      sat: stats.sat || { mean: 1400, stdDev: 80 },
      ap: stats.ap || { mean: 6, stdDev: 2 },
      ec: stats.ec || { mean: 8, stdDev: 3 },
      weights: stats.weights || getDefaultWeights(collegeType)
    }
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
