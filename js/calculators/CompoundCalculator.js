// CompoundCalculator.js
// Handles calculations related to tea compound effects (L-theanine, caffeine)

import { validateObject } from '../utils/helpers.js';
// Add TCM mapping imports
import * as TeaGlobalMapping from '../props/TeaGlobalMapping.js';

export class CompoundCalculator {
  constructor(config, primaryEffects) {
    this.config = config;
    this.primaryEffects = primaryEffects;
  }
  
  // Main calculate method following standardized calculator pattern
  calculate(tea) {
    const inference = this.infer(tea);
    return {
      inference: this.formatInference(inference),
      data: this.serialize(inference)
    };
  }
  
  // Core inference method
  infer(tea) {
    tea = validateObject(tea);
    
    // Get compound levels
    const levels = this.calculateCompoundLevels(tea);
    
    // Calculate effects based on compounds
    const effects = this.calculateCompoundEffects(tea);
    
    // Get compound analysis
    const analysis = this.getCompoundAnalysis(tea);
    
    return {
      levels,
      effects,
      analysis
    };
  }
  
  // Format inference as markdown
  formatInference(inference) {
    const { levels, effects, analysis } = inference;
    
    let md = `## L-Theanine & Caffeine Analysis\n\n`;
    
    // Add basic ratio information
    md += `### Compound Ratio\n`;
    md += `- L-Theanine Level: ${analysis.lTheanineLevel}/10\n`;
    md += `- Caffeine Level: ${analysis.caffeineLevel}/10\n`;
    md += `- Ratio: ${analysis.ratio}:1\n\n`;
    
    // Add interpretation
    md += `### Interpretation\n`;
    md += `${analysis.description}\n\n`;
    
    // Add categorization
    md += `### Compound Balance\n`;
    md += `Primary Influence: ${analysis.primaryInfluence}\n\n`;
    
    // Formatting function for boolean properties
    const formatBool = (value) => value ? "Yes" : "No";
    
    // Add detailed compound level information
    md += `### Detailed Analysis\n`;
    md += `- High L-Theanine: ${formatBool(levels.highLTheanine)}\n`;
    md += `- Moderate L-Theanine: ${formatBool(levels.moderateLTheanine)}\n`;
    md += `- Low L-Theanine: ${formatBool(levels.lowLTheanine)}\n`;
    md += `- High Caffeine: ${formatBool(levels.highCaffeine)}\n`;
    md += `- Moderate Caffeine: ${formatBool(levels.moderateCaffeine)}\n`;
    md += `- Low Caffeine: ${formatBool(levels.lowCaffeine)}\n`;
    md += `- Balanced Ratio: ${formatBool(levels.balancedRatio)}\n`;
    md += `- Extreme Ratio: ${formatBool(levels.extremeRatio)}\n`;
    md += `- Very Low Ratio: ${formatBool(levels.veryLowRatio)}\n`;
    md += `- Low Ratio: ${formatBool(levels.lowRatio)}\n`;
    md += `- Is Balanced: ${formatBool(levels.balanced)}\n`;
    md += `- Is Disharmonious: ${formatBool(levels.disharmonious)}\n`;
    md += `- Is Extreme Tea: ${formatBool(levels.extremeTea)}\n\n`;
    
    // Add effect scores
    md += `### Compound Effects\n`;
    
    Object.entries(effects)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .forEach(([effect, score]) => {
        const barLength = Math.round(score);
        const bar = '█'.repeat(barLength) + '░'.repeat(10 - barLength);
        md += `${effect.padEnd(15)} ${bar} ${score.toFixed(1)}\n`;
      });
      
    return md;
  }
  
  // Serialize inference to structured data
  serialize(inference) {
    const { levels, effects, analysis } = inference;
    
    return {
      lTheanine: analysis.lTheanineLevel,
      caffeine: analysis.caffeineLevel,
      ratio: parseFloat(analysis.ratio),
      balance: {
        primaryInfluence: analysis.primaryInfluence,
        isBalanced: levels.balanced,
        isExtreme: levels.extremeTea,
        isDominant: analysis.primaryInfluence !== 'balanced'
      },
      levels: {
        lTheanine: levels.highLTheanine ? 'high' : (levels.moderateLTheanine ? 'moderate' : 'low'),
        caffeine: levels.highCaffeine ? 'high' : (levels.moderateCaffeine ? 'moderate' : 'low'),
        ratio: levels.extremeRatio ? 'extreme high' : (levels.veryLowRatio ? 'very low' : (levels.lowRatio ? 'low' : 'balanced'))
      },
      effects: effects,
      description: analysis.description
    };
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
    
    // If primaryEffects is an array of effect objects
    if (Array.isArray(this.primaryEffects)) {
      this.primaryEffects.forEach(effect => {
        scores[effect.id] = 0;
      });
    } 
    // If primaryEffects is an object keyed by effect ID
    else if (typeof this.primaryEffects === 'object') {
      Object.keys(this.primaryEffects).forEach(effectId => {
        scores[effectId] = 0;
      });
    }
  
    const levels = this.calculateCompoundLevels(tea);
    
    // Calculate Yin/Yang score
    const yinYangScore = TeaGlobalMapping.mapCompoundRatioAndProcessingToYinYangScore(tea);
    const yinYangNature = TeaGlobalMapping.getYinYangCategory(yinYangScore);

    // Apply TCM effect mapping based on Yin/Yang nature
    if (TeaGlobalMapping.tcmToPrimaryEffectMap && TeaGlobalMapping.tcmToPrimaryEffectMap[yinYangNature]) {
      TeaGlobalMapping.tcmToPrimaryEffectMap[yinYangNature].forEach(([effect, strength]) => {
        scores[effect] = (scores[effect] || 0) + strength;
      });
    }
    
    // Get penalty factors for disharmonious ratios
    const penaltyDisharmoniousGeneral = 0.7; // Penalty for disharmonious ratios
    const penaltyDisharmoniousExtreme = 0.5; // Penalty for extreme disharmonious ratios
    const penaltyExtremelyLowRatio = 0.6;   // Penalty for very low L-theanine to caffeine
    const penaltyHarmonizingUnbalanced = 0.8; // Penalty for claiming balance when unbalanced
    const penaltyBalancingExtremeTeas = 0.7; // Penalty for extreme teas claiming to be balanced
    
    // Calculate base scores with compounds
    
    // If primaryEffects is an array of effect objects
    if (Array.isArray(this.primaryEffects)) {
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
        
        // Calculate score from triggers if available
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
    }
    // If primaryEffects is an object keyed by effect ID
    else if (typeof this.primaryEffects === 'object') {
      Object.entries(this.primaryEffects).forEach(([effectId, effectData]) => {
        let score = 0;
        let balancingModifier = 1.0;
        
        // Apply different adjustment for balancing effect
        if (effectId === 'balancing') {
          // Penalize balancing if not truly balanced
          if (!levels.balanced) {
            balancingModifier = penaltyHarmonizingUnbalanced;
          }
          
          // Apply stronger penalty for extreme teas
          if (levels.extremeTea) {
            balancingModifier *= penaltyBalancingExtremeTeas;
          }
        }
        
        // Calculate score from triggers if available
        if (effectData.triggers) {
          Object.entries(effectData.triggers).forEach(([trigger, weight]) => {
            if (levels[trigger]) {
              score += weight * balancingModifier;
              
              // Apply penalties for disharmonious ratios
              if (levels.disharmonious) {
                if (['balancing', 'clarifying'].includes(effectId)) {
                  score *= penaltyDisharmoniousGeneral;
                }
                if (['peaceful', 'soothing'].includes(effectId) && levels.extremeRatio) {
                  score *= penaltyDisharmoniousExtreme;
                }
                if (['revitalizing', 'awakening'].includes(effectId) && levels.veryLowRatio) {
                  score *= penaltyExtremelyLowRatio; 
                }
              }
            }
          });
        }
        
        // Add factor to boost effect based on direct L-theanine and caffeine levels
        if (['soothing', 'peaceful', 'clarifying'].includes(effectId)) {
          score += (tea.lTheanineLevel / 10) * 1.8;
        }
        
        if (['revitalizing', 'awakening', 'nurturing'].includes(effectId)) {
          score += (tea.caffeineLevel / 10) * 1.8;
        }
        
        // Modified balancing effect calculation from compound balance
        if (effectId === 'balancing' && tea.lTheanineLevel >= 4 && tea.caffeineLevel >= 3) {
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
        
        scores[effectId] = score;
      });
    }
    
    // If no primary effects data is available, provide some basic scores based on ratio
    if (Object.keys(scores).length === 0) {
      // Create some minimal effect scores based on ratios
      if (levels.highLTheanine) {
        scores.peaceful = (tea.lTheanineLevel / 10) * 5;
        scores.soothing = (tea.lTheanineLevel / 10) * 4.5;
      }
      
      if (levels.highCaffeine) {
        scores.revitalizing = (tea.caffeineLevel / 10) * 5;
        scores.awakening = (tea.caffeineLevel / 10) * 4.5;
      }
      
      if (levels.balanced) {
        scores.balancing = Math.min(tea.lTheanineLevel, tea.caffeineLevel) / 10 * 5;
      }
    }
    
    // Cap all scores to 10
    Object.keys(scores).forEach(key => {
      scores[key] = Math.min(10, Math.max(0, scores[key]));
    });
    
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