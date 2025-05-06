// Updated Admission Chance Calculator for College Application Tracker
// This utility calculates standardized scores and admission chances based on the mathematical model

/**
 * Calculate a standardized Z-score
 * @param {number} value - The raw value
 * @param {number} mean - The mean value for the population
 * @param {number} stdDev - The standard deviation for the population
 * @returns {number} - The standardized Z-score
 */
export const calculateZScore = (value, mean, stdDev) => {
  if (stdDev === 0) return 0; // Avoid division by zero
  return (value - mean) / stdDev;
};

/**
 * Generate a random 'bitter by coffee' factor if enabled
 * @param {boolean} enableBitterByCoffee - Whether the random factor is enabled
 * @returns {number} - Random factor between 0.75 and 1.25, or 1.0 if disabled
 */
export const generateBitterByCoffeeFactor = (enableBitterByCoffee) => {
  if (!enableBitterByCoffee) return 1.0; // Return 1.0 (neutral) if not enabled
  // Generate random number between 0.75 and 1.25
  return 0.75 + (Math.random() * 0.5);
};

/**
 * Adjust college acceptance rate based on Early Decision vs Regular Decision
 * @param {number} baseAcceptanceRate - The college's overall acceptance rate
 * @param {boolean} isEarlyDecision - Whether the student is applying Early Decision
 * @returns {number} - The adjusted acceptance rate based on application type
 */
export const adjustAcceptanceRateByEDRD = (baseAcceptanceRate, isEarlyDecision) => {
  // Early Decision typically improves acceptance chances by about 1.5-2.5x
  // The more selective the school, the greater the ED advantage

  // For more selective schools (under 10%), ED advantage is greater
  if (baseAcceptanceRate < 10) {
    return isEarlyDecision ? baseAcceptanceRate * 2 : baseAcceptanceRate * 0.8;
  }
  // For moderately selective schools (10-20%)
  else if (baseAcceptanceRate < 20) {
    return isEarlyDecision ? baseAcceptanceRate * 1.5 : baseAcceptanceRate * 0.85;
  }
  // For less selective schools (above 20%)
  else {
    return isEarlyDecision ? baseAcceptanceRate * 1.2 : baseAcceptanceRate * 0.9;
  }
};

/**
 * Adjust college acceptance rate based on the intended major and college type
 * @param {number} baseAcceptanceRate - The college's overall acceptance rate
 * @param {string} intendedMajor - The student's intended major ('STEM' or 'Liberal Arts')
 * @param {string} collegeType - The college's focus ('STEM-heavy' or 'Liberal-arts')
 * @returns {number} - The adjusted acceptance rate for the specific major
 */
export const adjustAcceptanceRateByMajor = (baseAcceptanceRate, intendedMajor, collegeType) => {
  // Default adjustment factors
  const competitiveMajorFactor = 0.7; // More competitive (multiply by 0.7 = 30% harder)
  const lessFocusedMajorFactor = 1.2; // Less competitive (multiply by 1.2 = 20% easier)
  const neutralFactor = 1.0; // No adjustment

  // No adjustment if no intended major specified
  if (!intendedMajor) return baseAcceptanceRate;

  // STEM major at STEM-heavy school (highly competitive)
  if (intendedMajor === 'STEM' && collegeType === 'STEM-heavy') {
    return baseAcceptanceRate * competitiveMajorFactor;
  }

  // Liberal Arts major at Liberal-arts school (competitive)
  if (intendedMajor === 'Liberal Arts' && collegeType === 'Liberal-arts') {
    return baseAcceptanceRate * competitiveMajorFactor;
  }

  // STEM major at Liberal-arts school (less competitive for STEM)
  if (intendedMajor === 'STEM' && collegeType === 'Liberal-arts') {
    return baseAcceptanceRate * lessFocusedMajorFactor;
  }

  // Liberal Arts major at STEM-heavy school (less competitive for Liberal Arts)
  if (intendedMajor === 'Liberal Arts' && collegeType === 'STEM-heavy') {
    return baseAcceptanceRate * lessFocusedMajorFactor;
  }

  // Default case - no adjustment
  return baseAcceptanceRate;
};

/**
 * Calculate the admission chance for a college based on student profile
 * @param {Object} student - Student profile data
 * @param {Object} college - College data with stats and weights
 * @returns {Object} - Admission chance details
 */
export const calculateAdmissionChance = (student, college) => {
  try {
    const { stats, acceptanceRate, collegeType } = college;

    // Base acceptance rate adjustment based on intended major
    let adjustedAcceptanceRate = adjustAcceptanceRateByMajor(
      acceptanceRate,
      student.intendedMajor,
      collegeType
    );

    // Further adjust based on Early Decision / Regular Decision status
    adjustedAcceptanceRate = adjustAcceptanceRateByEDRD(
      adjustedAcceptanceRate,
      student.isEarlyDecision
    );

    const p0 = adjustedAcceptanceRate / 100; // Convert percentage to decimal

    // Use either college-specific weights or defaults based on college type
    const weights = stats.weights || getDefaultWeights(collegeType);

    // Calculate Z-scores for student attributes
    const zScores = {
      gpa: calculateZScore(student.gpa, stats.gpa.mean, stats.gpa.stdDev),
      sat: calculateZScore(student.satTotal, stats.sat.mean, stats.sat.stdDev),
      ap: calculateZScore(student.apCount, stats.ap.mean, stats.ap.stdDev),
      ec: calculateZScore(student.ecStrengthTotal, stats.ec.mean, stats.ec.stdDev)
    };

    // Calculate Z-scores for fit and other factors (if available)
    const fitScores = {
      apFit: student.apFit ? calculateZScore(student.apFit, 2, 0.5) : 0,
      ecFit: student.ecFit ? calculateZScore(student.ecFit, 2, 0.5) : 0,
      rec: student.recScore ? calculateZScore(student.recScore, 2, 0.5) : 0,
      legacy: student.isLegacy ? 1 : 0,
      demo: student.demoScore ? student.demoScore : 0
    };

    // Calculate the "Strength" block
    const strengthBlock =
      weights.strength.gpa * zScores.gpa +
      weights.strength.sat * zScores.sat +
      weights.strength.ap * zScores.ap +
      weights.strength.ec * zScores.ec;

    // Calculate the "Alignment" block
    const alignmentBlock =
      weights.alignment.apFit * fitScores.apFit +
      weights.alignment.ecFit * fitScores.ecFit +
      weights.alignment.rec * fitScores.rec +
      weights.alignment.legacy * fitScores.legacy +
      weights.alignment.demo * fitScores.demo;

    // Calculate the final admission probability using the formula
    const exponent = strengthBlock + alignmentBlock;
    const probability = p0 * Math.exp(exponent);

    // Generate bitter by coffee factor (randomness)
    const bitterByCoffeeFactor = generateBitterByCoffeeFactor(student.enableBitterByCoffee);

    // Apply the bitter by coffee factor to the probability
    const adjustedProbability = probability * bitterByCoffeeFactor;

    // Ensure probability is between 0 and 1
    const cappedProbability = Math.min(Math.max(adjustedProbability, 0), 1);

    // Calculate how the student compares to the average applicant
    const comparisonToAverage = Math.exp(exponent);

    return {
      probabilityRaw: probability,
      probability: cappedProbability,
      probabilityPercentage: Math.round(cappedProbability * 100),
      timesAverageApplicant: comparisonToAverage.toFixed(2),
      bitterByCoffeeFactor: bitterByCoffeeFactor.toFixed(2),
      zScores,
      fitScores,
      strengthBlock,
      alignmentBlock,
      exponent,
      isEarlyDecision: student.isEarlyDecision
    };
  } catch (error) {
    console.error("Error calculating admission chance:", error);
    return {
      probability: 0,
      probabilityPercentage: 0,
      error: true
    };
  }
};

/**
 * Get default weights based on college type
 * @param {string} collegeType - 'Liberal-arts' or 'STEM-heavy'
 * @returns {Object} - Default weights for the college type
 */
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

/**
 * Prepare student profile data for admission chance calculation
 * @param {Object} profileData - Raw profile data from the application
 * @returns {Object} - Processed student data for calculations
 */
export const prepareStudentData = (profileData) => {
  // Calculate total SAT score
  const satTotal = profileData.satReading + profileData.satMath;

  // Count AP classes (completed = 1, ongoing = 0.5)
  const apCount = profileData.apClasses.reduce((total, ap) => {
    return total + (ap.status === 'ongoing' ? 0.5 : 1);
  }, 0);

  // Calculate total EC strength
  const ecStrengthTotal = profileData.extracurriculars.reduce((total, ec) => {
    return total + ec.level;
  }, 0);

  // Calculate average AP fit with intended major category
  const apFit = profileData.intendedMajor && profileData.apClasses.length > 0
    ? profileData.apClasses.reduce((total, ap) => total + (ap.fitScore || 0), 0) / profileData.apClasses.length
    : 0;

  // Calculate average EC fit with intended major category
  const ecFit = profileData.intendedMajor && profileData.extracurriculars.length > 0
    ? profileData.extracurriculars.reduce((total, ec) => total + (ec.fitScore || 0), 0) / profileData.extracurriculars.length
    : 0;

  return {
    gpa: profileData.gpa,
    satTotal,
    apCount,
    ecStrengthTotal,
    apFit,
    ecFit,
    recScore: profileData.recScore || 0,
    isLegacy: profileData.isLegacy || false,
    demoScore: profileData.demoScore || 0,
    intendedMajor: profileData.intendedMajor,
    enableBitterByCoffee: profileData.enableBitterByCoffee || false,
    isEarlyDecision: profileData.isEarlyDecision || false  // Add Early Decision status
  };
};

/**
 * Get a display color based on admission probability
 * @param {number} probability - Admission probability (0-1)
 * @returns {string} - Color code for UI display
 */
export const getAdmissionChanceColor = (probability) => {
  if (probability < 0.1) return 'error'; // Red
  if (probability < 0.3) return 'warning'; // Orange/Amber
  if (probability < 0.6) return 'info'; // Blue
  return 'success'; // Green
};

/**
 * Get a text description of admission chance
 * @param {number} probability - Admission probability (0-1)
 * @returns {string} - Text description
 */
export const getAdmissionChanceDescription = (probability) => {
  if (probability < 0.05) return 'Reach++';
  if (probability < 0.15) return 'Reach';
  if (probability < 0.30) return 'High Reach';
  if (probability < 0.50) return 'Target/Reach';
  if (probability < 0.70) return 'Target';
  if (probability < 0.85) return 'Safety/Target';
  return 'Safety';
};

/**
 * Calculate whether a college is a good match for a student's major interest
 * @param {Object} college - College data
 * @param {string} intendedMajor - Student's intended major ('STEM' or 'Liberal Arts')
 * @returns {string} - Match assessment ('Excellent', 'Good', 'Fair', or 'Poor')
 */
export const getMajorMatchAssessment = (college, intendedMajor) => {
  // Perfect match: STEM major applying to STEM-heavy college or Liberal Arts major applying to Liberal Arts college
  if ((intendedMajor === 'STEM' && college.collegeType === 'STEM-heavy') ||
      (intendedMajor === 'Liberal Arts' && college.collegeType === 'Liberal-arts')) {
    return 'Excellent';
  }

  // Mismatch: STEM major applying to Liberal Arts college or vice versa
  if ((intendedMajor === 'STEM' && college.collegeType === 'Liberal-arts') ||
      (intendedMajor === 'Liberal Arts' && college.collegeType === 'STEM-heavy')) {
    // Check if the college has a strong program in the opposite category
    const hasCrossDisciplinaryStrength = college.crossDisciplinaryStrengths &&
      college.crossDisciplinaryStrengths.includes(intendedMajor);

    return hasCrossDisciplinaryStrength ? 'Good' : 'Fair';
  }

  return 'Good'; // Default if no major specified or other scenario
};
