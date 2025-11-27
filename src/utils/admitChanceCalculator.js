// Updated Admission Chance Calculator for College Application Tracker

/**
 * Calculate a standardized Z-score
 * @param {number} value - The raw value
 * @param {number} mean - The mean value for the population
 * @param {number} stdDev - The standard deviation for the population
 * @returns {number} - The standardized Z-score
 */
export const calculateZScore = (value, mean, stdDev) => {
  if (stdDev === 0) return 0; // Avoid division by zero
  if (value === null || value === undefined) return null; // Handle null/undefined values for test-blind scenarios
  return (value - mean) / stdDev;
};

/**
 * Generate a random 'bitter by coffee' factor if enabled
 * @param {boolean} enableBitterByCoffee - Whether the random factor is enabled
 * @returns {number} - Random factor between 0.75 and 1.25, or 1.0 if disabled
 */
export const generateBitterByCoffeeFactor = (enableBitterByCoffee) => {
  if (!enableBitterByCoffee) return 1.0;
  return 0.85 + (Math.random() * 0.3); // Random factor between 0.85 and 1.15
};

// Define legacy boost factor
const LEGACY_BOOST_FACTOR = 1.5; // 50% increase in chances if legacy

/**
 * Adjust college acceptance rate based on Early Decision, Legacy status.
 * @param {number} baseAcceptanceRate - The college's overall acceptance rate (can be pre-adjusted for major)
 * @param {boolean} isEarlyDecision - Whether the student is applying Early Decision
 * @param {boolean} isLegacy - Whether the student has legacy status
 * @returns {number} - The adjusted acceptance rate
 */
export const adjustAcceptanceRateByStrategicFactors = (baseAcceptanceRate, isEarlyDecision, isLegacy) => {
  let adjustedRate = parseFloat(baseAcceptanceRate);

  // Apply Early Decision / Regular Decision Boost/Adjustment
  if (isEarlyDecision) {
    // Early Decision typically improves acceptance chances
    if (baseAcceptanceRate < 20) { // Use the initial base rate for decision logic for multipliers
      adjustedRate *= 1.3; // For more selective schools (under 20%), ED advantage is greater
    } else if (baseAcceptanceRate < 40) {
      adjustedRate *= 1.2; // For moderately selective schools (20-40%)
    } else {
      adjustedRate *= 1.1; // For less selective schools (over 50%) - minimal ED advantage
    }
  } else {
    // Regular Decision: Apply adjustments if ED provides a significant boost.
    // These factors represent the 'cost' of not applying ED to schools where ED has an advantage.
    if (baseAcceptanceRate < 20) {
      adjustedRate *= 0.8;
    } else if (baseAcceptanceRate < 40) {
      adjustedRate *= 0.85;
    } else {
      adjustedRate *= 0.95; // Minimal penalty for not using ED at less selective schools
    }
  }

  // Apply Legacy Boost
  if (isLegacy) {
    adjustedRate *= LEGACY_BOOST_FACTOR;
  }

  // Ensure the rate doesn't exceed a practical maximum like 99% or fall below a minimum like 1%
  return Math.min(Math.max(adjustedRate, 1), 99);
};

/**
 * Apply a sigmoid-like adjustment to the probability to prevent it from being too high.
 * This function helps to model the diminishing returns of very high calculated scores.
 * @param {number} probability - The calculated probability before adjustment.
 * @param {number} originalBaseRate - The college's original base acceptance rate (0-100).
 * @returns {number} - The adjusted probability.
 */
export const applySigmoidAdjustment = (probability, originalBaseRate) => {
  // k controls the steepness of the curve. Higher k = steeper curve.
  // x0 is the midpoint of the sigmoid.
  // L is the maximum value (usually 1 for probability).
  const L = 1;
  let k, x0;

  // Adjust k and x0 based on school selectivity
  if (originalBaseRate >= 70) { // Very high acceptance rate
    k = 1.25; // Less steep, more conservative
    x0 = 0.9; // Shift midpoint higher, harder to reach top
  } else if (originalBaseRate >= 50) { // High acceptance rate
    k = 1.9;
    x0 = 0.8;
  } else if (originalBaseRate >= 20) { // Moderately selective
    k = 2.5;
    x0 = 0.65;
  } else { // Highly selective
    k = 3; // Steeper curve, allows for higher differentiation at top
    x0 = 0.5;
  }

  // Basic logistic function: L / (1 + exp(-k * (probability - x0)))
  // We want to ensure that if the input probability is already low, it doesn't get artificially inflated.
  // And if it's high, it gets capped gracefully.

  // If the initial probability is very low, don't boost it too much with sigmoid.
  // This sigmoid is more for capping and shaping the upper end.
  if (probability < p0ToProbability(originalBaseRate / 100, 0.1)) { // if probability is less than what a 0.1 exponent would give
      return probability; // return as is or apply a much milder adjustment
  }
  
  const sigmoidValue = L / (1 + Math.exp(-k * (probability - x0)));

  // Blend the original probability with the sigmoid value.
  // Give more weight to sigmoid as probability increases.
  // This creates a smoother transition and avoids overly aggressive capping at lower probabilities.
  const weight = Math.min(1, probability * 2); // Weight increases as probability approaches 0.5 and above

  return probability * (1 - weight) + sigmoidValue * weight;
};

// Helper to convert p0 and exponent back to a rough probability for comparison
const p0ToProbability = (p0, exponent) => p0 * Math.exp(exponent);


/**
 * Adjust college acceptance rate based on the intended major and college-specific factors
 * @param {number} baseAcceptanceRate - The college's overall acceptance rate
 * @param {string} intendedMajor - The student's intended major ('STEM' or 'Liberal Arts')
 * @param {Object} college - The college object containing majorFactors
 * @returns {number} - The adjusted acceptance rate for the specific major
 */
export const adjustAcceptanceRateByMajor = (baseAcceptanceRate, intendedMajor, college) => {
  let rate = parseFloat(baseAcceptanceRate);
  
  if (!intendedMajor || !college.majorFactors) return rate;

  const majorFactors = college.majorFactors[intendedMajor];
  if (!majorFactors) return rate;

  // Use college-specific competitive factor
  if (intendedMajor === 'STEM' && college.collegeType === 'STEM-heavy') {
    rate *= majorFactors.competitive;
  } else if (intendedMajor === 'Liberal Arts' && college.collegeType === 'Liberal-arts') {
    rate *= majorFactors.competitive;
  } else if (intendedMajor === 'STEM' && college.collegeType === 'Liberal-arts') {
    rate *= majorFactors.popular || 1.2; // Use popular factor or default
  } else if (intendedMajor === 'Liberal Arts' && college.collegeType === 'STEM-heavy') {
    rate *= majorFactors.popular || 1.2; // Use popular factor or default
  }
  return rate;
};

/**
 * Calculate the admission chance for a college based on student profile
 * @param {Object} student - Student profile data (includes isEarlyDecision, isLegacy)
 * @param {Object} college - College data with stats and weights
 * @returns {Object} - Admission chance details
 */
export const calculateAdmissionChance = (student, college) => {
  try {
    const { stats, acceptanceRate, collegeType } = college;

    // 1. Start with the college's raw acceptance rate
    let currentAcceptanceRate = parseFloat(acceptanceRate);
    const originalBaseRate = currentAcceptanceRate; // Keep for ED/RD factor calculation logic if needed

    // 2. Adjust for intended major
    currentAcceptanceRate = adjustAcceptanceRateByMajor(
      currentAcceptanceRate,
      student.intendedMajor,
      college // Pass the full college object
    );

    // 3. Adjust for strategic factors (ED/RD and Legacy)
    // Pass the originalBaseRate to adjustAcceptanceRateByStrategicFactors if its internal logic
    // for choosing ED multipliers depends on the college's raw selectivity,
    // otherwise pass currentAcceptanceRate (major-adjusted) if multipliers apply to that.
    // For simplicity, current implementation of adjustAcceptanceRateByStrategicFactors uses the rate passed to it
    // for its <10, <20, >=20 logic. If that should be based on raw college selectivity, pass originalBaseRate.
    // Let's assume the multipliers are based on the major-adjusted rate's tier.
    currentAcceptanceRate = adjustAcceptanceRateByStrategicFactors(
      currentAcceptanceRate, // This is now the major-adjusted rate
      student.isEarlyDecision,
      student.isLegacy
    );

    const p0 = currentAcceptanceRate / 100; // Convert percentage to decimal

    const weights = stats.weights || getDefaultWeights(collegeType);

    const zScores = {
      gpa: calculateZScore(student.gpa, stats.gpa.mean, stats.gpa.stdDev),
      sat: calculateZScore(student.satTotal, stats.sat.mean, stats.sat.stdDev),
      ap: calculateZScore(student.apCount, stats.ap.mean, stats.ap.stdDev),
      ec: calculateZScore(student.ecStrengthTotal, stats.ec.mean, stats.ec.stdDev)
    };

    // Check if this is a test-blind scenario (SAT score is null or college doesn't consider SAT)
    const isTestBlind = student.satTotal === null || student.satTotal === undefined || 
                       (stats.sat && stats.sat.mean === null) || college.isTestBlind;

    // Legacy is now handled in p0 calculation, so it's removed from fitScores for alignmentBlock
    const fitScores = {
      apFit: student.apFit ? calculateZScore(student.apFit, 2, 0.5) : 0,
      ecFit: student.ecFit ? calculateZScore(student.ecFit, 2, 0.5) : 0,
      rec: student.recScore ? calculateZScore(student.recScore, 2, 0.5) : 0,
      demo: student.demoScore ? student.demoScore : 0
    };

    // Adjust weights for test-blind scenarios
    const adjustedWeights = isTestBlind ? getTestBlindWeights(weights, collegeType) : weights;

    const strengthBlock =
      adjustedWeights.strength.gpa * zScores.gpa +
      (isTestBlind ? 0 : adjustedWeights.strength.sat * zScores.sat) +
      adjustedWeights.strength.ap * zScores.ap +
      adjustedWeights.strength.ec * zScores.ec;

    // Legacy term removed from alignmentBlock
    const alignmentBlock =
      adjustedWeights.alignment.apFit * fitScores.apFit +
      adjustedWeights.alignment.ecFit * fitScores.ecFit +
      adjustedWeights.alignment.rec * fitScores.rec +
      adjustedWeights.alignment.demo * fitScores.demo; // weights.alignment.legacy is 0 or term is removed

    const exponent = strengthBlock + alignmentBlock;

    // Adjust probability calculation based on school selectivity
    let probability;
    if (originalBaseRate >= 50) {
      // For less selective schools, use a more conservative approach
      // This prevents overly high probabilities for schools with high acceptance rates
      const baseChance = p0 * 0.75; // Reduced from 0.9 to 0.75 - only 75% of acceptance rate as base

      // Make exponent impact more conservative for less selective schools
      const conservativeExponent = Math.min(exponent, 1.5); // Cap the exponent effect

      // Use a more conservative formula for high acceptance rate schools
      if (originalBaseRate >= 70) {
        // For very high acceptance rate schools, be even more conservative
        probability = baseChance + (1 - baseChance) * (0.5 + 0.25 * Math.tanh(conservativeExponent));
      } else {
        // For moderately high acceptance rate schools
        probability = baseChance + (1 - baseChance) * (0.6 + 0.3 * Math.tanh(conservativeExponent));
      }
    } else if (originalBaseRate >= 20) {
      // For moderately selective schools, use a blend of exponential and linear approaches
      const baseChance = p0 * 0.7; // Reduced from 0.8 to 0.7
      const expComponent = p0 * Math.exp(exponent * 0.7); // Further dampened exponential effect
      probability = baseChance + (expComponent - baseChance) * 0.7; // Weighted average with more conservative weight
    } else {
      // For highly selective schools, keep the original exponential model
      probability = p0 * Math.exp(exponent);
    }

    // Apply sigmoid adjustment to the calculated probability
    probability = applySigmoidAdjustment(probability, originalBaseRate);

    const bitterByCoffeeFactor = generateBitterByCoffeeFactor(student.enableBitterByCoffee);
    const adjustedProbability = probability * bitterByCoffeeFactor;
    const cappedProbability = Math.min(Math.max(adjustedProbability, 0), 1);
    const comparisonToAverage = Math.exp(exponent);

    return {
      probabilityRaw: probability,
      probability: cappedProbability,
      probabilityPercentage: isNaN(cappedProbability) ? 0 : Math.round(cappedProbability * 100),
      timesAverageApplicant: comparisonToAverage.toFixed(2),
      bitterByCoffeeFactor: bitterByCoffeeFactor.toFixed(2),
      zScores,
      fitScores,
      strengthBlock,
      alignmentBlock,
      exponent,
      isEarlyDecision: student.isEarlyDecision,
      isTestBlind,
      finalAdjustedAcceptanceRateForP0: currentAcceptanceRate
    };
  } catch (error) {
    console.error("Error calculating admission chance:", error);
    return {
      probability: 0,
      probabilityPercentage: 0,
      error: true,
      isTestBlind: false,
      finalAdjustedAcceptanceRateForP0: parseFloat(college.acceptanceRate) // Fallback
    };
  }
};

/**
 * Get default weights based on college type. Legacy weight set to 0 as its effect is now in p0.
 * @param {string} collegeType - 'Liberal-arts' or 'STEM-heavy'
 * @returns {Object} - Default weights for the college type
 */
export const getDefaultWeights = (collegeType) => {
  if (collegeType === 'STEM-heavy') {
    return {
      strength: { gpa: 0.35, sat: 0.30, ap: 0.15, ec: 0.20 },
      alignment: { apFit: 0.30, ecFit: 0.20, rec: 0.15, legacy: 0.0, demo: 0.20 }
    };
  } else { // Default to Liberal Arts weights
    return {
      strength: { gpa: 0.30, sat: 0.25, ap: 0.15, ec: 0.30 },
      alignment: { apFit: 0.25, ecFit: 0.25, rec: 0.20, legacy: 0.0, demo: 0.15 }
    };
  }
};

/**
 * Adjust weights for test-blind scenarios by redistributing SAT weight to other factors
 * @param {Object} originalWeights - Original weights object
 * @param {string} collegeType - 'Liberal-arts' or 'STEM-heavy'
 * @returns {Object} - Adjusted weights for test-blind scenario
 */
export const getTestBlindWeights = (originalWeights, collegeType) => {
  const satWeight = originalWeights.strength.sat;
  
  // Redistribute SAT weight proportionally to other strength factors
  const remainingStrengthFactors = ['gpa', 'ap', 'ec'];
  const totalRemainingWeight = remainingStrengthFactors.reduce((sum, factor) => 
    sum + originalWeights.strength[factor], 0);
  
  const adjustedStrengthWeights = { ...originalWeights.strength };
  adjustedStrengthWeights.sat = 0; // Remove SAT weight
  
  // Redistribute SAT weight proportionally
  if (totalRemainingWeight > 0) {
    remainingStrengthFactors.forEach(factor => {
      const proportionalIncrease = (originalWeights.strength[factor] / totalRemainingWeight) * satWeight;
      adjustedStrengthWeights[factor] += proportionalIncrease;
    });
  }
  
  // For test-blind scenarios, also slightly increase alignment weights to compensate
  // for the loss of standardized test data
  const alignmentBoost = satWeight * 0.3; // Use 30% of SAT weight to boost alignment factors
  const alignmentFactors = ['apFit', 'ecFit', 'rec', 'demo'];
  const totalAlignmentWeight = alignmentFactors.reduce((sum, factor) => 
    sum + originalWeights.alignment[factor], 0);
  
  const adjustedAlignmentWeights = { ...originalWeights.alignment };
  if (totalAlignmentWeight > 0) {
    alignmentFactors.forEach(factor => {
      const proportionalIncrease = (originalWeights.alignment[factor] / totalAlignmentWeight) * alignmentBoost;
      adjustedAlignmentWeights[factor] += proportionalIncrease;
    });
  }
  
  return {
    strength: adjustedStrengthWeights,
    alignment: adjustedAlignmentWeights
  };
};

/**
 * Prepare student profile data for admission chance calculation
 * @param {Object} profileData - Raw profile data from the application
 * @returns {Object} - Processed student data for calculations
 */
export const prepareStudentData = (profileData) => {
  // Handle test-blind scenarios where SAT scores might be null
  const satReading = profileData.satReading;
  const satMath = profileData.satMath;
  
  let satTotal = null;
  if (satReading !== null && satReading !== undefined && 
      satMath !== null && satMath !== undefined) {
    satTotal = satReading + satMath;
  } else if ((satReading !== null && satReading !== undefined) || 
             (satMath !== null && satMath !== undefined)) {
    // If only one section is provided, still consider it as having some SAT data
    satTotal = (satReading || 0) + (satMath || 0);
  }
  
  const apCount = (profileData.apClasses || []).reduce((total, ap) => total + (ap.status === 'ongoing' ? 0.5 : 1), 0);
  const ecStrengthTotal = (profileData.extracurriculars || []).reduce((total, ec) => total + (ec.level || 0), 0);

  // Fix potential NaN calculations
  const apClasses = profileData.apClasses || [];
  const extracurriculars = profileData.extracurriculars || [];

  const apFit = profileData.intendedMajor && apClasses.length > 0
    ? apClasses.reduce((total, ap) => total + (ap.fitScore || 0), 0) / apClasses.length
    : 0;

  const ecFit = profileData.intendedMajor && extracurriculars.length > 0
    ? extracurriculars.reduce((total, ec) => total + (ec.fitScore || 0), 0) / extracurriculars.length
    : 0;

  return {
    gpa: parseFloat(profileData.gpa) || 0,
    satTotal: satTotal, // Can be null for test-blind scenarios
    apCount: isNaN(apCount) ? 0 : apCount,
    ecStrengthTotal: isNaN(ecStrengthTotal) ? 0 : ecStrengthTotal,
    apFit: isNaN(apFit) ? 0 : apFit,
    ecFit: isNaN(ecFit) ? 0 : ecFit,
    recScore: parseFloat(profileData.recScore) || 0,
    isLegacy: Boolean(profileData.isLegacy),
    demoScore: parseFloat(profileData.demoScore) || 0,
    intendedMajor: profileData.intendedMajor || null,
    enableBitterByCoffee: Boolean(profileData.enableBitterByCoffee),
    isEarlyDecision: Boolean(profileData.isEarlyDecision)
  };
};

/**
 * Get a display color based on admission probability
 * @param {number} probability - Admission probability (0-1)
 * @returns {string} - Color code for UI display
 */
export const getAdmissionChanceColor = (probability) => {
  if (probability < 0.1) return 'error';
  if (probability < 0.3) return 'warning';
  if (probability < 0.6) return 'info';
  return 'success';
};

/**
 * Get a text description of admission chance
 * @param {number} probability - Admission probability (0-1)
 * @returns {string} - Text description
 */
export const getAdmissionChanceDescription = (probability) => {
  if (probability < 0.05) return 'Very Hard Reach'; // Changed from Reach++ for clarity
  if (probability < 0.15) return 'Hard Reach';      // Changed from Reach
  if (probability < 0.30) return 'Reach';           // Changed from High Reach
  if (probability < 0.50) return 'Possible';      // Changed from Target/Reach
  if (probability < 0.70) return 'Good Chance';   // Changed from Target
  if (probability < 0.85) return 'Likely';        // Changed from Safety/Target
  return 'Very Likely';                           // Changed from Safety
};

/**
 * Calculate whether a college is a good match for a student's major interest
 * @param {Object} college - College data
 * @param {string} intendedMajor - Student's intended major ('STEM' or 'Liberal Arts')
 * @returns {string} - Match assessment ('Excellent', 'Good', 'Fair', or 'Poor')
 */
export const getMajorMatchAssessment = (college, intendedMajor) => {
  if (!intendedMajor) return 'Good'; // Default if no major

  if ((intendedMajor === 'STEM' && college.collegeType === 'STEM-heavy') ||
    (intendedMajor === 'Liberal Arts' && college.collegeType === 'Liberal-arts')) {
    return 'Excellent';
  }

  if ((intendedMajor === 'STEM' && college.collegeType === 'Liberal-arts') ||
    (intendedMajor === 'Liberal Arts' && college.collegeType === 'STEM-heavy')) {
    // Check if the college has a strong program in the opposite category
    // This property 'crossDisciplinaryStrengths' would need to be added to your college data structure if used
    // const hasCrossDisciplinaryStrength = college.crossDisciplinaryStrengths &&
    //   college.crossDisciplinaryStrengths.includes(intendedMajor);
    // return hasCrossDisciplinaryStrength ? 'Good' : 'Fair';
    return 'Fair'; // If focusing strictly on primary type vs major
  }
  return 'Good'; // Default for other scenarios or if cross-disciplinary isn't detailed
};
