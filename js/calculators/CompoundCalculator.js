// CompoundCalculator.js
// Handles calculations related to tea compound effects (L-theanine, caffeine)

import { validateObject } from '../utils/helpers.js';

export class CompoundCalculator {
  constructor(config, primaryEffects) {
    this.config = config;
    this.primaryEffects = primaryEffects;
  }
  
  // Calculate compound levels with enhanced ratio handling
  calculateCompoundLevels(tea) {
    tea = validateObject(tea);
    
    // Ensure we have values to work with
    const lTheanineLevel = tea.lTheanineLevel !== undefined ? tea.lTheanineLevel : 5;
    const caffeineLevel = tea.caffeineLevel !== undefined ? tea.caffeineLevel : 3;
    const ratio = lTheanineLevel / caffeineLevel;
    
    const thresholds = this.config.get('thresholds.compoundRatios');
    
    // Determine compound level categories
    const levels = {
      highLTheanine: lTheanineLevel >= 7,
      moderateLTheanine: lTheanineLevel >= 4 && lTheanineLevel < 7,
      lowLTheanine: lTheanineLevel < 4,
      highCaffeine: caffeineLevel >= 5,
      moderateCaffeine: caffeineLevel >= 3 && caffeineLevel < 5,
      lowCaffeine: caffeineLevel < 3,
      balancedRatio: ratio >= thresholds.balancedRange[0] && ratio <= thresholds.balancedRange[1],
      extremeRatio: ratio > thresholds.extremeRatio,
      veryLowRatio: ratio < thresholds.veryLowRatio,
      lowRatio: ratio < thresholds.lowRatio
    };

    // Determine if the tea has disharmonious levels
    levels.disharmonious = levels.extremeRatio || levels.veryLowRatio;
    
    // Tea is only truly balanced if in the balancedRatio range and not disharmonious
    levels.balanced = levels.balancedRatio && !levels.disharmonious;
    
    // Determine if this is an "extreme" tea (very high or low in either compound)
    levels.extremeTea = lTheanineLevel >= 8 || lTheanineLevel <= 2 || 
                        caffeineLevel >= 7 || caffeineLevel <= 1;

    return levels;
  }
  
  // Calculate purely compound-based effects
  calculateCompoundEffects(tea) {
    tea = validateObject(tea);
    if (!this.primaryEffects) {
      return {};
    }
    
    // Create initial scores object with all effects set to 0
    const scores = {};
    for (const effect of this.primaryEffects) {
      scores[effect.id] = 0;
    }
  
    const levels = this.calculateCompoundLevels(tea);
    
    // Get penalty factors for disharmonious ratios
    const penaltyDisharmoniousGeneral = 0.7; // Penalty for disharmonious ratios
    const penaltyDisharmoniousExtreme = 0.5; // Penalty for extreme disharmonious ratios
    const penaltyExtremelyLowRatio = 0.6;   // Penalty for very low L-theanine to caffeine
    const penaltyHarmonizingUnbalanced = 0.8; // Penalty for claiming balance when unbalanced
    const penaltyBalancingExtremeTeas = 0.7; // Penalty for extreme teas claiming to be balanced
    
    // Calculate base scores with compounds
    for (const effect of this.primaryEffects) {
      let score = 0;
      let balancingModifier = 1.0;
      
      // Apply different adjustment for balancing effect
      if (effect.id === 'balancing') {
        // Penalize balancing if not truly balanced
        if (!levels.balanced) {
          balancingModifier = penaltyHarmonizingUnbalanced;
        }
        
        // Apply stronger penalty for extreme teas
        if (levels.extremeTea) {
          balancingModifier *= penaltyBalancingExtremeTeas;
        }
      }

      // Calculate score from triggers
      if (effect.triggers) {
        Object.entries(effect.triggers).forEach(([trigger, weight]) => {
          if (levels[trigger]) {
            score += weight * balancingModifier;

            // Apply penalties for disharmonious ratios
            if (levels.disharmonious) {
              if (['balancing', 'clarifying'].includes(effect.id)) {
                score *= penaltyDisharmoniousGeneral;
              }
              if (['peaceful', 'soothing'].includes(effect.id) && levels.extremeRatio) {
                score *= penaltyDisharmoniousExtreme;
              }
              if (['revitalizing', 'awakening'].includes(effect.id) && levels.veryLowRatio) {
                score *= penaltyExtremelyLowRatio; 
              }
            }
          }
        });
      }
      
      // Add factor to boost effect based on direct L-theanine and caffeine levels
      if (['soothing', 'peaceful', 'clarifying'].includes(effect.id)) {
        score += (tea.lTheanineLevel / 10) * 1.8;
      }
      
      if (['revitalizing', 'awakening', 'nurturing'].includes(effect.id)) {
        score += (tea.caffeineLevel / 10) * 1.8;
      }
      
      // Modified balancing effect calculation from compound balance
      if (effect.id === 'balancing' && tea.lTheanineLevel >= 4 && tea.caffeineLevel >= 3) {
        // Calculate the balance value but with more penalties for imbalance
        const difference = Math.abs(tea.lTheanineLevel - tea.caffeineLevel);
        
        // Only boost substantially if truly in balance
        if (difference <= 1.5) {
          const balance = 10 - (difference * 2); // More severe penalty for difference
          score += (balance / 10) * 1.5;
        } else {
          // Much smaller boost for larger differences
          score += 0.3; 
        }
      }
      
      scores[effect.id] = score;
    }
    
    return scores;
  }
  
  // Return a detailed explanation of compound effects for UI display
  getCompoundAnalysis(tea) {
    tea = validateObject(tea);
    
    const levels = this.calculateCompoundLevels(tea);
    const lTheanineLevel = tea.lTheanineLevel !== undefined ? tea.lTheanineLevel : 5;
    const caffeineLevel = tea.caffeineLevel !== undefined ? tea.caffeineLevel : 3;
    const ratio = lTheanineLevel / caffeineLevel;
    
    // Generate natural language description of the compound balance
    let description;
    
    if (levels.balanced) {
      description = `This tea has a balanced L-theanine to caffeine ratio of ${ratio.toFixed(1)}:1, promoting harmonious effects.`;
    } else if (levels.extremeRatio) {
      description = `This tea has an extremely high L-theanine to caffeine ratio of ${ratio.toFixed(1)}:1, strongly emphasizing calming effects.`;
    } else if (levels.veryLowRatio) {
      description = `This tea has a very low L-theanine to caffeine ratio of ${ratio.toFixed(1)}:1, significantly emphasizing stimulating effects.`;
    } else if (levels.lowRatio) {
      description = `This tea has a low L-theanine to caffeine ratio of ${ratio.toFixed(1)}:1, somewhat emphasizing stimulating effects.`;
    } else if (ratio > this.config.get('thresholds.compoundRatios.balancedRange')[1]) {
      description = `This tea has a moderately high L-theanine to caffeine ratio of ${ratio.toFixed(1)}:1, leaning toward calming effects.`;
    } else {
      description = `This tea has an L-theanine to caffeine ratio of ${ratio.toFixed(1)}:1.`;
    }
    
    // Return the compound analysis data
    return {
      levels,
      lTheanineLevel,
      caffeineLevel,
      ratio: ratio.toFixed(1),
      description,
      isBalanced: levels.balanced,
      primaryInfluence: levels.extremeRatio ? 'calming' : 
                        levels.veryLowRatio ? 'stimulating' : 
                        levels.balanced ? 'balanced' : 
                        ratio > 1.8 ? 'calming-leaning' : 'stimulating-leaning'
    };
  }
}

export default CompoundCalculator; 