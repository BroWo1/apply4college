// Main college data file that imports and consolidates all colleges
import { eliteColleges } from './eliteColleges';
import { targetColleges } from './targetColleges';
import { safetyColleges } from './safetyColleges';

// Combine all college groups into a single array
export const colleges = [
  ...eliteColleges,
  ...targetColleges,
  ...safetyColleges
];

// Helper function to filter colleges by type
export const getCollegesByType = (type) => {
  return colleges.filter(college => college.collegeType === type);
};

// Helper function to filter colleges by acceptance rate range
export const getCollegesByAcceptanceRate = (minRate, maxRate) => {
  return colleges.filter(college =>
    college.acceptanceRate >= minRate &&
    college.acceptanceRate <= maxRate
  );
};

// Get elite colleges (under 10% acceptance)
export const getEliteColleges = () => {
  return getCollegesByAcceptanceRate(0, 10);
};

// Get target colleges (10-20% acceptance)
export const getTargetColleges = () => {
  return getCollegesByAcceptanceRate(10, 20);
};

// Get safety colleges (over 20% acceptance)
export const getSafetyColleges = () => {
  return getCollegesByAcceptanceRate(20, 100);
};

// Get STEM-focused colleges
export const getStemColleges = () => {
  return getCollegesByType('STEM-heavy');
};

// Get Liberal Arts colleges
export const getLiberalArtsColleges = () => {
  return getCollegesByType('Liberal-arts');
};

// Helper function to sort colleges by specific criteria
export const sortCollegesBy = (colleges, criterion) => {
  switch(criterion) {
    case 'name':
      return [...colleges].sort((a, b) => a.name.localeCompare(b.name));
    case 'acceptanceRate':
      return [...colleges].sort((a, b) => a.acceptanceRate - b.acceptanceRate);
    case 'tuition':
      return [...colleges].sort((a, b) => a.tuition - b.tuition);
    case 'rating':
      return [...colleges].sort((a, b) => b.rating - a.rating);
    default:
      return colleges;
  }
};

// Search colleges by name or location
export const searchColleges = (query) => {
  const searchTerm = query.toLowerCase();
  return colleges.filter(college =>
    college.name.toLowerCase().includes(searchTerm) ||
    college.location.toLowerCase().includes(searchTerm)
  );
};
