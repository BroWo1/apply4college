// Simplified majors - just STEM and Liberal Arts
export const majors = [
  {
    name: "STEM",
    relatedAreas: [
      "Mathematics",
      "Computer Science",
      "Physics",
      "Chemistry",
      "Biology",
      "Engineering",
      "Technology",
      "Data Science",
      "Statistics",
      "Environmental Science",
      "Biochemistry",
      "Astronomy"
    ]
  },
  {
    name: "Liberal Arts",
    relatedAreas: [
      "English",
      "History",
      "Philosophy",
      "Psychology",
      "Sociology",
      "Political Science",
      "Economics",
      "Communications",
      "Literature",
      "Journalism",
      "Anthropology",
      "International Relations",
      "Law",
      "Education",
      "Arts",
      "Music",
      "Theater",
      "Languages"
    ]
  }
];

// Map AP courses to their typical subject areas for major fit calculations
export const apSubjectAreas = {
  "AP Calculus AB": ["Mathematics", "Engineering", "Physics"],
  "AP Calculus BC": ["Mathematics", "Engineering", "Physics"],
  "AP Statistics": ["Mathematics", "Statistics", "Economics", "Social Sciences"],
  "AP Chemistry": ["Chemistry", "Biochemistry", "Engineering"],
  "AP Biology": ["Biology", "Biochemistry", "Environmental Science"],
  "AP Physics 1": ["Physics", "Engineering", "Astronomy"],
  "AP Physics 2": ["Physics", "Engineering", "Astronomy"],
  "AP Computer Science A": ["Computer Science", "Technology", "Data Science"],
  "AP Computer Science Principles": ["Computer Science", "Technology"],
  "AP English Language and Composition": ["English", "Communications", "Journalism"],
  "AP English Literature and Composition": ["English", "Literature"],
  "AP German Language and Culture": ["Languages", "Literature"],
  "AP Psychology": ["Psychology", "Sociology"],
  "AP US History": ["History", "Political Science", "Sociology"],
  "AP World History": ["History", "Political Science", "Sociology"],
  "AP Microeconomics": ["Economics", "Statistics"],
  "AP Macroeconomics": ["Economics", "Statistics"],
};

// Map extracurricular activities to their typical subject areas for major fit calculations
export const activitySubjectAreas = {
  "Physics Competition": ["Physics", "Engineering", "Mathematics"],
  "Math Competition": ["Mathematics", "Computer Science", "Engineering"],
  "Writing Competition": ["English", "Journalism", "Literature", "Communications"],
  "Student Council": ["Leadership", "Political Science", "Communications"],
  "MUN": ["International Relations", "Political Science", "Communications"],
  "STEM Research": ["Science", "Technology", "Engineering", "Mathematics"],
  "History Research": ["History", "Anthropology", "Political Science"],
  "STEM Club": ["Science", "Technology", "Engineering", "Mathematics"],
  "Website/App Development": ["Computer Science", "Technology", "Data Science"],
  "Community Service": ["Social Work", "Education", "Sociology"],
  "Science Club": ["Science", "Technology", "Engineering"],
  "School Magazine": ["Journalism", "Communications", "English"],
  "Aerospace Club": ["Engineering", "Physics", "Astronomy"],
};

/**
 * Calculate how well a course or activity aligns with a major category
 * @param {string} itemName - Name of the AP course or extracurricular activity
 * @param {string} itemType - 'ap' or 'activity'
 * @param {string} majorName - Name of the major category ('STEM' or 'Liberal Arts')
 * @returns {number} - Fit score (1-3)
 */
export const calculateFitScore = (itemName, itemType, majorName) => {
  // Get the subject areas for the item
  const itemSubjectAreas = itemType === 'ap'
    ? apSubjectAreas[itemName] || []
    : activitySubjectAreas[itemName] || [];

  // Find the major
  const major = majors.find(m => m.name === majorName);
  if (!major) return 1; // Default to minimal fit if major not found

  // Count how many subject areas overlap between the item and the major
  let overlapCount = 0;
  itemSubjectAreas.forEach(subject => {
    if (major.relatedAreas.includes(subject)) {
      overlapCount++;
    }
  });

  // Calculate fit score based on overlap percentage
  const overlapPercentage = overlapCount / itemSubjectAreas.length;
  if (overlapPercentage === 0) return 1; // Minimal fit
  if (overlapPercentage <= 0.5) return 2; // Moderate fit
  return 3; // Strong fit
};

/**
 * Determine if an AP course is more aligned with STEM or Liberal Arts
 * @param {string} apCourseName - Name of the AP course
 * @returns {string} - 'STEM', 'Liberal Arts', or 'Both'
 */
export const determineAPCourseCategory = (apCourseName) => {
  const subjectAreas = apSubjectAreas[apCourseName] || [];

  let stemCount = 0;
  let liberalArtsCount = 0;

  subjectAreas.forEach(subject => {
    if (majors[0].relatedAreas.includes(subject)) {
      stemCount++;
    }
    if (majors[1].relatedAreas.includes(subject)) {
      liberalArtsCount++;
    }
  });

  if (stemCount > liberalArtsCount) return 'STEM';
  if (liberalArtsCount > stemCount) return 'Liberal Arts';
  return 'Both';
};

/**
 * Determine if an extracurricular activity is more aligned with STEM or Liberal Arts
 * @param {string} activityName - Name of the extracurricular activity
 * @returns {string} - 'STEM', 'Liberal Arts', or 'Both'
 */
export const determineActivityCategory = (activityName) => {
  const subjectAreas = activitySubjectAreas[activityName] || [];

  let stemCount = 0;
  let liberalArtsCount = 0;

  subjectAreas.forEach(subject => {
    if (majors[0].relatedAreas.includes(subject)) {
      stemCount++;
    }
    if (majors[1].relatedAreas.includes(subject)) {
      liberalArtsCount++;
    }
  });

  if (stemCount > liberalArtsCount) return 'STEM';
  if (liberalArtsCount > stemCount) return 'Liberal Arts';
  return 'Both';
};
