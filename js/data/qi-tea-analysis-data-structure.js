// data/qi-tea-analysis-data-structure.js
// Central shared lookup tables for the Tea Analysis System (Simplified for pivot)

// Import available data modules
import { geographicalFactors } from './GeographicalInfluences.js';
import { fiveElementsCharacteristics } from './FiveElements.js';
import { yinYangCharacteristics } from './YinYang.js';
import { qiMovementPatterns } from './QiMovement.js';
import { timeOfDayRecommendations } from './TimeOfDay.js';

// Mock data for missing modules to prevent import errors
export const teaTypeProperties = {
  white: {
    caffeineLevel: 'low',
    lTheanineLevel: 'high',
    oxidationLevel: 'minimal',
    baseEffects: ['cooling', 'calming', 'focusing']
  },
  green: {
    caffeineLevel: 'moderate',
    lTheanineLevel: 'high',
    oxidationLevel: 'minimal',
    baseEffects: ['refreshing', 'clarifying', 'uplifting']
  },
  oolong: {
    caffeineLevel: 'moderate-high',
    lTheanineLevel: 'moderate',
    oxidationLevel: 'partial',
    baseEffects: ['balancing', 'harmonizing', 'digestive']
  },
  black: {
    caffeineLevel: 'high',
    lTheanineLevel: 'moderate-low',
    oxidationLevel: 'full',
    baseEffects: ['energizing', 'warming', 'grounding']
  },
  puerh: {
    caffeineLevel: 'moderate-high',
    lTheanineLevel: 'moderate',
    oxidationLevel: 'post-fermented',
    baseEffects: ['centering', 'warming', 'digestive']
  }
};

export const processingEffects = {
  'sun-dried': ['warming', 'yang-enhancing'],
  'shade-grown': ['cooling', 'yin-enhancing'],
  'steamed': ['preserves-freshness', 'maintains-green-character'],
  'pan-fired': ['adds-toasty-notes', 'reduces-grassiness'],
  'roasted': ['adds-complexity', 'reduces-astringency', 'warming'],
  'oxidized': ['adds-richness', 'develops-fruit-notes', 'increases-roundness'],
  'fermented': ['improves-digestibility', 'adds-depth', 'reduces-astringency'],
  'aged': ['mellows-flavor', 'increases-complexity', 'enhances-depth']
};

export const compoundRatioEffects = {
  caffeine: {
    high: ['energizing', 'alertness', 'potential-jitters'],
    moderate: ['balanced-energy', 'focused-attention'],
    low: ['gentle-uplift', 'minimal-stimulation']
  },
  lTheanine: {
    high: ['calming', 'focused', 'anti-anxiety'],
    moderate: ['balanced-mood', 'mild-relaxation'],
    low: ['minimal-calming-effect']
  },
  ratios: {
    '2+': ['focused-calm', 'meditation-supportive', 'balanced-energy'],
    '1-2': ['balanced-alertness', 'productive-energy'],
    '0.5-1': ['energizing', 'stimulating', 'potentially-activating'],
    '<0.5': ['highly-stimulating', 'alert', 'potential-overstimulation']
  }
};

export const seasonalRecommendations = {
  spring: ['green tea', 'white tea', 'light oolong'],
  summer: ['green tea', 'white tea', 'light-bodied tea', 'cold-brewed tea'],
  autumn: ['oolong tea', 'light black tea', 'roasted tea'],
  winter: ['black tea', 'puerh tea', 'roasted oolong']
};

export const elementCycles = {
  generating: {
    wood: 'fire',
    fire: 'earth',
    earth: 'metal',
    metal: 'water',
    water: 'wood'
  },
  controlling: {
    wood: 'earth',
    earth: 'water',
    water: 'fire',
    fire: 'metal',
    metal: 'wood'
  }
};

export const elementCombinations = {
  harmonious: [
    ['wood', 'fire'],
    ['fire', 'earth'],
    ['earth', 'metal'],
    ['metal', 'water'],
    ['water', 'wood']
  ],
  balancing: [
    ['wood', 'earth'],
    ['earth', 'water'],
    ['water', 'fire'],
    ['fire', 'metal'],
    ['metal', 'wood']
  ]
};

// Re-export available tables
export {
  geographicalFactors,
  fiveElementsCharacteristics,
  yinYangCharacteristics,
  qiMovementPatterns,
  timeOfDayRecommendations
};