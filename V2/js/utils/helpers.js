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

/**
 * Normalizes a string by converting to lowercase, trimming, and replacing spaces with dashes
 * @param {string} str - The string to normalize
 * @returns {string} - The normalized string
 */
export function normalizeString(str) {
  if (!str) return '';
  return str.toLowerCase().trim().replace(/\s+/g, '-');
}

/**
 * Extracts the top N items from an array
 * @param {Array} items - The array of items
 * @param {number} limit - Maximum number of items to return
 * @returns {Array} - Top N items
 */
export function getTopItems(items, limit = 3) {
  if (!Array.isArray(items)) return [];
  return items.slice(0, limit);
}

/**
 * Sorts array of objects by a specified numerical property (descending)
 * @param {Array} array - The array to sort
 * @param {string} property - The property to sort by
 * @returns {Array} - Sorted array
 */
export function sortByProperty(array, property) {
  if (!Array.isArray(array) || !property) return array;
  return [...array].sort((a, b) => b[property] - a[property]);
}

/**
 * Validates object property and returns default if invalid
 * @param {Object} obj - The object to validate
 * @param {*} defaultValue - Default value if object is invalid
 * @returns {*} - The validated object or default
 */
export function validateObject(obj, defaultValue = {}) {
  return (obj && typeof obj === 'object') ? obj : defaultValue;
}

/**
 * Creates a safe tea object with defaults for missing properties
 * @param {Object} tea - The tea object to make safe
 * @returns {Object} - Tea object with default values for missing properties
 */
export function createSafeTea(tea) {
  if (!tea || typeof tea !== 'object') return {
    compounds: {
      caffeineLevel: 3,
      theanineLevel: 5
    },
    type: 'unknown',
    flavorProfile: {},
    processingInfo: {
      methods: []
    }
  };
  
  return {
    compounds: {
      caffeineLevel: getNestedProperty(tea, 'compounds.caffeineLevel', 3),
      theanineLevel: getNestedProperty(tea, 'compounds.theanineLevel', 5)
    },
    type: tea.type || 'unknown',
    flavorProfile: validateObject(tea.flavorProfile),
    processingInfo: {
      methods: Array.isArray(getNestedProperty(tea, 'processingInfo.methods')) 
        ? tea.processingInfo.methods 
        : []
    }
  };
}

/**
 * Maps array items to categories based on keywords
 * @param {Array} items - Array of strings to categorize
 * @param {Object} categoryMap - Map of category names to arrays of keywords
 * @returns {Object} - Map of categories to matched items
 */
export function categorizeByKeywords(items, categoryMap) {
  if (!Array.isArray(items) || !categoryMap) return {};
  
  const result = {};
  
  Object.entries(categoryMap).forEach(([category, keywords]) => {
    const matches = items.filter(item => 
      keywords.some(keyword => item.toLowerCase().includes(keyword))
    );
    
    if (matches.length > 0) {
      result[category] = matches;
    }
  });
  
  return result;
}

/**
 * Converts an array of scores to a format suitable for visualization
 * @param {Object} scores - Object with score names as keys and values as numbers
 * @returns {Array} - Array of objects with name and value properties
 */
export function formatScoresForVisualization(scores) {
  if (!scores || typeof scores !== 'object') return [];
  
  return Object.entries(scores).map(([name, value]) => ({
    name,
    value: Number(value) || 0
  }));
}

/**
 * Creates a formatted text description of top effects
 * @param {Object} scores - Object with effect names as keys and scores as values
 * @param {number} limit - Maximum number of effects to include
 * @returns {string} - Formatted text description
 */
export function createEffectDescription(scores, limit = 3) {
  if (!scores || typeof scores !== 'object') return '';
  
  const sortedEffects = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
  
  if (sortedEffects.length === 0) return '';
  
  if (sortedEffects.length === 1) {
    return `Primarily ${sortedEffects[0][0]}`;
  }
  
  const mainEffect = sortedEffects[0][0];
  const supportingEffects = sortedEffects.slice(1).map(e => e[0]);
  
  return `Primarily ${mainEffect}, with supporting ${supportingEffects.join(' and ')}`;
}

export default {
  getNestedProperty,
  isInRange,
  categorizeValue,
  findClosestKey,
  normalizeString,
  getTopItems,
  sortByProperty,
  validateObject,
  createSafeTea,
  categorizeByKeywords,
  formatScoresForVisualization,
  createEffectDescription
}; 