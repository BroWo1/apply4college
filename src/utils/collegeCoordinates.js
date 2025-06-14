// College coordinates mapping
// This maps college locations to their latitude and longitude coordinates
// Only includes colleges that are in the database

export const collegeCoordinates = {
  // Elite Colleges
  'Cambridge, MA': { lat: 42.3736, lng: -71.1097 }, // Harvard University, MIT
  'Stanford, CA': { lat: 37.4275, lng: -122.1697 }, // Stanford University
  'Durham, NC': { lat: 36.0014, lng: -78.9382 }, // Duke University
  'Chicago, IL': { lat: 41.7886, lng: -87.5987 }, // University of Chicago

  // Target Colleges
  'Berkeley, CA': { lat: 37.8719, lng: -122.2585 }, // UC Berkeley
  'Los Angeles, CA': { lat: 34.0689, lng: -118.4452 }, // UCLA
  'Ann Arbor, MI': { lat: 42.2681, lng: -83.7312 }, // University of Michigan
  'Pittsburgh, PA': { lat: 40.4444, lng: -79.9608 }, // Carnegie Mellon University

  // Safety Colleges
  'Seattle, WA': { lat: 47.6553, lng: -122.3035 }, // University of Washington
  'Chapel Hill, NC': { lat: 35.9049, lng: -79.0469 }, // UNC Chapel Hill
  'Champaign, IL': { lat: 40.1020, lng: -88.2272 }, // UIUC
};

// Function to get coordinates for a college location
export const getCollegeCoordinates = (location) => {
  return collegeCoordinates[location] || null;
};

// Function to add coordinates to college data
export const addCoordinatesToCollege = (college) => {
  const coordinates = getCollegeCoordinates(college.location);
  return {
    ...college,
    coordinates: coordinates || { lat: 39.8283, lng: -98.5795 } // Default to center of US if not found
  };
};

// Function to add coordinates to an array of colleges
export const addCoordinatesToColleges = (colleges) => {
  return colleges.map(addCoordinatesToCollege);
};
