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
  return (value - mean) / stdDev;
};

/**
 * Generate a random 'bitter by coffee' factor if enabled
 * @param {boolean} enableBitterByCoffee - Whether the random factor is enabled
 * @returns {number} - Random factor between 0.75 and 1.25, or 1.0 if disabled
 */
export const generateBitterByCoffeeFactor = (enableBitterByCoffee) => {
  if (!enableBitterByCoffee) return 1.0;
  return 0.75 + (Math.random() * 0.5);
};

// Define legacy boost factor
const LEGACY_BOOST_FACTOR = 1.5; // 50% increase in chances if legacy

// 定义早期申请的提升系数区间，based on 学校排名
const ED_BOOST_FACTORS = {
  HIGHLY_SELECTIVE: 1.4, // 录取率<10%的学校ED提升40%
  VERY_SELECTIVE: 1.3,   // 录取率<20%的学校ED提升30%
  SELECTIVE: 1.2,        // 录取率<40%的学校ED提升20% 
  LESS_SELECTIVE: 1.1    // 录取率>=40%的学校ED提升10%
};

// 新增：定义RD申请的惩罚系数
const RD_PENALTY_FACTORS = {
  HIGHLY_SELECTIVE: 0.7, // 录取率<10%的学校RD降低30%
  VERY_SELECTIVE: 0.8,   // 录取率<20%的学校RD降低20%
  SELECTIVE: 0.85,       // 录取率<40%的学校RD降低15%
  LESS_SELECTIVE: 0.95   // 录取率>=40%的学校RD降低5%
};

// 越来越重要的演示兴趣因素(Demonstrated Interest)
const DEMONSTRATED_INTEREST_BOOST = 1.1; // 10%的提升

/**
 * Adjust college acceptance rate based on Early Decision, Legacy status.
 * @param {number} baseAcceptanceRate - The college's overall acceptance rate (can be pre-adjusted for major)
 * @param {boolean} isEarlyDecision - Whether the student is applying Early Decision
 * @param {boolean} isLegacy - Whether the student has legacy status
 * @param {boolean} hasDemonstratedInterest - 新增：是否表达了明确的兴趣 , 可能在文书和匹配度展示？ todo : 需要确认
 * @returns {number} - The adjusted acceptance rate
 */
export const adjustAcceptanceRateByStrategicFactors = (baseAcceptanceRate, isEarlyDecision, isLegacy, hasDemonstratedInterest = false) => {
  let adjustedRate = parseFloat(baseAcceptanceRate);

  // Apply Early Decision / Regular Decision Boost/Adjustment
  if (isEarlyDecision) {
    // ED提升系数结构 up
    if (baseAcceptanceRate < 10) {
      adjustedRate *= ED_BOOST_FACTORS.HIGHLY_SELECTIVE;
    } else if (baseAcceptanceRate < 20) {
      adjustedRate *= ED_BOOST_FACTORS.VERY_SELECTIVE;
    } else if (baseAcceptanceRate < 40) {
      adjustedRate *= ED_BOOST_FACTORS.SELECTIVE;
    } else {
      adjustedRate *= ED_BOOST_FACTORS.LESS_SELECTIVE;
    }
  } else {
    // 使用新的RD惩罚系数
    if (baseAcceptanceRate < 10) {
      adjustedRate *= RD_PENALTY_FACTORS.HIGHLY_SELECTIVE;
    } else if (baseAcceptanceRate < 20) {
      adjustedRate *= RD_PENALTY_FACTORS.VERY_SELECTIVE;
    } else if (baseAcceptanceRate < 40) {
      adjustedRate *= RD_PENALTY_FACTORS.SELECTIVE;
    } else {
      adjustedRate *= RD_PENALTY_FACTORS.LESS_SELECTIVE;
    }
  }

  // Apply Legacy Boost
  if (isLegacy) {
    adjustedRate *= LEGACY_BOOST_FACTOR;
  }
  
  // 新增：表达兴趣因素 todo ： need to specify the factors in the future
  if (hasDemonstratedInterest) {
    adjustedRate *= DEMONSTRATED_INTEREST_BOOST;
  }

  // Ensure the rate doesn't exceed a practical maximum like 99% or fall below a minimum like 1%
  return Math.min(Math.max(adjustedRate, 1), 99);
};


/**
 * Adjust college acceptance rate based on the intended major and college type
 * @param {number} baseAcceptanceRate - The college's overall acceptance rate
 * @param {string} intendedMajor - The student's intended major ('STEM' or 'Liberal Arts')
 * @param {string} collegeType - The college's focus ('STEM-heavy' or 'Liberal-arts')
 * @returns {number} - The adjusted acceptance rate for the specific major
 */
export const adjustAcceptanceRateByMajor = (baseAcceptanceRate, intendedMajor, collegeType) => {
  let rate = parseFloat(baseAcceptanceRate);
  const competitiveMajorFactor = 0.7; // 30% harder
  const lessFocusedMajorFactor = 1.2; // 20% easier
  
  // 新增：更细分的专业类型系数
  const majorTypeFactors = {
    // 高竞争度专业系数
    highCompetition: {
      'Computer Science': 0.6,  // CS更难
      'Engineering': 0.65,      // 工程类
      'Premed': 0.65,           // 医学预科
      'Business': 0.7,          // 商科
    },
    // 中等竞争度专业
    mediumCompetition: {
      'Biology': 0.75,
      'Chemistry': 0.8,
      'Economics': 0.8,
      'Mathematics': 0.85
    },
    // 低竞争度专业
    lowCompetition: {
      'Humanities': 1.1,
      'Social Sciences': 1.05,
      'Arts': 1.15, 
      'Education': 1.2
    }
  };

  if (!intendedMajor) return rate;

  // 通用的专业匹配规则
  if (intendedMajor === 'STEM' && collegeType === 'STEM-heavy') {
    rate *= competitiveMajorFactor;
  } else if (intendedMajor === 'Liberal Arts' && collegeType === 'Liberal-arts') {
    rate *= competitiveMajorFactor;
  } else if (intendedMajor === 'STEM' && collegeType === 'Liberal-arts') {
    rate *= lessFocusedMajorFactor;
  } else if (intendedMajor === 'Liberal Arts' && collegeType === 'STEM-heavy') {
    rate *= lessFocusedMajorFactor;
  }
  
  // 新增：检查学生的具体专业，进行更精确的调整
  if (majorTypeFactors.highCompetition[intendedMajor]) {
    rate *= majorTypeFactors.highCompetition[intendedMajor];
  } else if (majorTypeFactors.mediumCompetition[intendedMajor]) {
    rate *= majorTypeFactors.mediumCompetition[intendedMajor];
  } else if (majorTypeFactors.lowCompetition[intendedMajor]) {
    rate *= majorTypeFactors.lowCompetition[intendedMajor];
  }
  
  return rate;
};

/**
 * 新增：根据学校位置与学生地理位置的关系调整录取率
 * @param {number} baseAcceptanceRate - 基本录取率
 * @param {string} studentRegion - 学生所在地区
 * @param {string} collegeRegion - 学校所在地区
 * @returns {number} - 调整后的录取率
 */
export const adjustAcceptanceRateByGeography = (baseAcceptanceRate, studentRegion, collegeRegion) => {
  let rate = parseFloat(baseAcceptanceRate);
  
  // 地区多样性因素
  const geographicFactors = {
    // 学校招生偏好系数
    collegePreferences: {
      'Northeast': {
        'West': 1.1,       // 东北部学校对西部学生有轻微偏好
        'Midwest': 1.05,
        'South': 1.05,
        'International': 0.9  // 对国际生稍微严格
      },
      'West': {
        'Northeast': 1.1,
        'Midwest': 1.05,
        'South': 1.05,
        'International': 0.85
      },
      'Midwest': {
        'Northeast': 1.05,
        'West': 1.05,
        'South': 1.03,
        'International': 0.9
      },
      'South': {
        'Northeast': 1.05,
        'West': 1.05,
        'Midwest': 1.03,
        'International': 0.9
      }
    },
    // 州内申请者优势
    inStateBoost: 1.2,     // 公立大学对本州学生有20%偏好
  };

  // 如果学生和学校在同一地区，轻微降低多样性加分
  if (studentRegion === collegeRegion) {
    rate *= 0.95; // 5%的轻微调整，因为你不会增加地理多样性
    
    // 但如果是公立大学，州内学生有明显优势
    if (college?.isPublic === true && studentRegion === college?.state) {
      rate *= geographicFactors.inStateBoost;
    }
  } 
  // 跨地区申请的多样性加分
  else if (geographicFactors.collegePreferences[collegeRegion]?.[studentRegion]) {
    rate *= geographicFactors.collegePreferences[collegeRegion][studentRegion];
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
      collegeType
    );
    
    // 新增：3. 调整地理因素
    if (student.region && college.region) {
      currentAcceptanceRate = adjustAcceptanceRateByGeography(
        currentAcceptanceRate,
        student.region,
        college.region
      );
    }

    // 4. Adjust for strategic factors (ED/RD, Legacy and Demonstrated Interest)
    currentAcceptanceRate = adjustAcceptanceRateByStrategicFactors(
      currentAcceptanceRate,
      student.isEarlyDecision,
      student.isLegacy,
      student.hasDemonstratedInterest // 新增：表达兴趣因素
    );

    const p0 = currentAcceptanceRate / 100; // Convert percentage to decimal

    const weights = stats.weights || getDefaultWeights(collegeType);

    const zScores = {
      gpa: calculateZScore(student.gpa, stats.gpa.mean, stats.gpa.stdDev),
      sat: calculateZScore(student.satTotal, stats.sat.mean, stats.sat.stdDev),
      ap: calculateZScore(student.apCount, stats.ap.mean, stats.ap.stdDev),
      ec: calculateZScore(student.ecStrengthTotal, stats.ec.mean, stats.ec.stdDev),
      // 新增：课程难度得分
      courseRigor: student.courseRigor ? calculateZScore(student.courseRigor, 3, 1) : 0
    };

    // Legacy is now handled in p0 calculation, so it's removed from fitScores for alignmentBlock
    const fitScores = {
      apFit: student.apFit ? calculateZScore(student.apFit, 2, 0.5) : 0,
      ecFit: student.ecFit ? calculateZScore(student.ecFit, 2, 0.5) : 0,
      rec: student.recScore ? calculateZScore(student.recScore, 2, 0.5) : 0,
      demo: student.demoScore ? student.demoScore : 0,
      // 新增：文书质量和面试表现
      essays: student.essayScore ? calculateZScore(student.essayScore, 3, 1) : 0,
      interview: student.interviewScore ? calculateZScore(student.interviewScore, 3, 1) : 0
    };

    // 更新权重配置 - 真实但是很shabi
    const updatedWeights = {...weights};
    
    // 新增：如果有课程难度数据，加入权重
    if (student.courseRigor) {
      // 减少其他学术因素权重来添加课程难度权重
      updatedWeights.strength.gpa *= 0.8;   // GPA权重降低20%
      updatedWeights.strength.sat *= 0.9;   // SAT权重降低10%
      updatedWeights.strength.courseRigor = 0.1; // 添加10%的课程难度权重
    }
    
    // 新增：如果有文书和面试评分，加入权重
    if (student.essayScore || student.interviewScore) {
      // 为了保持总权重，稍微减少其他权重
      updatedWeights.alignment.apFit *= 0.8;  // AP匹配度权重降低20%
      updatedWeights.alignment.ecFit *= 0.9;  // EC匹配度权重降低10%
      
      if (student.essayScore) {
        updatedWeights.alignment.essays = 0.15;  // 文书15%权重
      }
      
      if (student.interviewScore) {
        updatedWeights.alignment.interview = 0.1;  // 面试10%权重 
      }
    }

    const strengthBlock =
      (updatedWeights.strength.gpa || weights.strength.gpa) * zScores.gpa +
      (updatedWeights.strength.sat || weights.strength.sat) * zScores.sat +
      (updatedWeights.strength.ap || weights.strength.ap) * zScores.ap +
      (updatedWeights.strength.ec || weights.strength.ec) * zScores.ec +
      // 新增：课程难度评分
      (updatedWeights.strength.courseRigor || 0) * zScores.courseRigor;

    // 更新对齐块计算
    const alignmentBlock =
      (updatedWeights.alignment.apFit || weights.alignment.apFit) * fitScores.apFit +
      (updatedWeights.alignment.ecFit || weights.alignment.ecFit) * fitScores.ecFit +
      (updatedWeights.alignment.rec || weights.alignment.rec) * fitScores.rec +
      (updatedWeights.alignment.demo || weights.alignment.demo) * fitScores.demo +
      // 新增：文书和面试评分
      (updatedWeights.alignment.essays || 0) * fitScores.essays +
      (updatedWeights.alignment.interview || 0) * fitScores.interview;
      
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
    
    const bitterByCoffeeFactor = generateBitterByCoffeeFactor(student.enableBitterByCoffee);
    const adjustedProbability = probability * bitterByCoffeeFactor;
    const cappedProbability = Math.min(Math.max(adjustedProbability, 0), 1);
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
      isEarlyDecision: student.isEarlyDecision,
      finalAdjustedAcceptanceRateForP0: currentAcceptanceRate,
      // 新增：添加地理和特殊因素的影响评分
      geographicImpact: student.region && college.region ? 
        (student.region === college.region ? "Neutral" : "Diverse") : null,
      demonstratedInterest: student.hasDemonstratedInterest ? "Positive" : "None"
    };
  } catch (error) {
    console.error("Error calculating admission chance:", error);
    return {
      probability: 0,
      probabilityPercentage: 0,
      error: true,
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
 * Prepare student profile data for admission chance calculation
 * @param {Object} profileData - Raw profile data from the application
 * @returns {Object} - Processed student data for calculations
 */
export const prepareStudentData = (profileData) => {
  const satTotal = (profileData.satReading || 0) + (profileData.satMath || 0);
  const apCount = (profileData.apClasses || []).reduce((total, ap) => total + (ap.status === 'ongoing' ? 0.5 : 1), 0);
  const ecStrengthTotal = (profileData.extracurriculars || []).reduce((total, ec) => total + (ec.level || 0), 0);

  const apFit = profileData.intendedMajor && (profileData.apClasses || []).length > 0
    ? (profileData.apClasses || []).reduce((total, ap) => total + (ap.fitScore || 0), 0) / profileData.apClasses.length
    : 0;

  const ecFit = profileData.intendedMajor && (profileData.extracurriculars || []).length > 0
    ? (profileData.extracurriculars || []).reduce((total, ec) => total + (ec.fitScore || 0), 0) / profileData.extracurriculars.length
    : 0;

  return {
    gpa: profileData.gpa || 0,
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
    isEarlyDecision: profileData.isEarlyDecision || false,
    region: profileData.region || '',
    courseRigor: profileData.courseRigor || 0,
    essayScore: profileData.essayScore || 0,
    interviewScore: profileData.interviewScore || 0,
    hasDemonstratedInterest: profileData.hasDemonstratedInterest || false
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
