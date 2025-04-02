// helpers.js
// Utility helper functions for tea analysis

/**
 * Safely access a nested property in an object
 * @param {Object} obj - The object to access
 * @param {string} path - The property path (e.g., 'geography.altitude')
 * @param {*} defaultValue - Default value if property doesn't exist
 * @returns {*} - The property value or default
 */
export function getNestedProperty(obj, path, defaultValue = null) {
  if (!obj || !path) return defaultValue;
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === undefined || current === null || !Object.prototype.hasOwnProperty.call(current, key)) {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current === undefined ? defaultValue : current;
}

/**
 * Determine if a value falls within a range
 * @param {number} value - The value to check
 * @param {number} min - Minimum of the range
 * @param {number} max - Maximum of the range
 * @returns {boolean} - True if value is within range
 */
export function isInRange(value, min, max) {
  return value >= min && value <= max;
}

/**
 * Categorize a numeric value into descriptive ranges
 * @param {number} value - The value to categorize
 * @param {Object} ranges - Mapping of category names to [min, max] arrays
 * @param {string} defaultCategory - Default category if no range matches
 * @returns {string} - The category name
 */
export function categorizeValue(value, ranges, defaultCategory = 'medium') {
  for (const [category, [min, max]] of Object.entries(ranges)) {
    if (isInRange(value, min, max)) {
      return category;
    }
  }
  return defaultCategory;
}

/**
 * Find the closest matching key in an object
 * @param {Object} obj - The object to search
 * @param {string} key - The key to match
 * @returns {string|null} - The best matching key or null
 */
export function findClosestKey(obj, key) {
  if (!obj || !key) return null;
  
  // Direct match
  if (obj[key]) return key;
  
  // Case-insensitive match
  const lowerKey = key.toLowerCase();
  for (const objKey of Object.keys(obj)) {
    if (objKey.toLowerCase() === lowerKey) {
      return objKey;
    }
  }
  
  // Fuzzy match (contains)
  for (const objKey of Object.keys(obj)) {
    if (objKey.toLowerCase().includes(lowerKey) || 
        lowerKey.includes(objKey.toLowerCase())) {
      return objKey;
    }
  }
  
  return null;
}

export default {
  getNestedProperty,
  isInRange,
  categorizeValue,
  findClosestKey
}; 