// CompoundCalculator.js
// Handles calculations related to tea compound effects (L-theanine, caffeine)

import { validateObject } from '../utils/helpers.js';
// Add TCM mapping imports
import * as TeaGlobalMapping from '../props/TeaGlobalMapping.js';
import { effectMapping } from '../props/EffectMapping.js';

export class CompoundCalculator {
  constructor(config, primaryEffects) {
    this.config = config;
    this.primaryEffects = primaryEffects;
    this.effectMapping = effectMapping;
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
    if (!inference) {
      return {
        compoundScores: {},
        compounds: {
          description: 'No compound data available',
          lTheanine: null,
          caffeine: null,
          ratio: null,
          otherCompounds: {},
          influence: {}
        }
      };
    }

    // Calculate compound scores
    const compoundScores = this.calculateCompoundScores(inference);

    return {
      compoundScores,
      compounds: {
        description: inference.description || 'No description available',
        lTheanine: inference.lTheanine || null,
        caffeine: inference.caffeine || null,
        ratio: inference.ratio || null,
        otherCompounds: inference.otherCompounds || {},
        influence: inference.compoundInfluence || {}
      }
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
    
    // Create initial scores object with all 8 consolidated effects set to 0
    const scores = {
      energizing: 0,
      calming: 0,
      focusing: 0,
      harmonizing: 0,
      grounding: 0,
      elevating: 0,
      comforting: 0,
      restorative: 0
    };

    const levels = this.calculateCompoundLevels(tea);
    
    // Calculate Yin/Yang score
    const yinYangScore = TeaGlobalMapping.mapCompoundRatioAndProcessingToYinYangScore(tea);
    const yinYangNature = TeaGlobalMapping.getYinYangCategory(yinYangScore);

    // Apply TCM effect mapping based on Yin/Yang nature
    if (TeaGlobalMapping.tcmToPrimaryEffectMap && TeaGlobalMapping.tcmToPrimaryEffectMap[yinYangNature]) {
      TeaGlobalMapping.tcmToPrimaryEffectMap[yinYangNature].forEach(([effect, strength]) => {
        // We only care about the 8 consolidated effects, ignore old names
        if (scores.hasOwnProperty(effect)) {
          scores[effect] += strength;
        }
      });
    }
    
    // Apply compound level based effects
    if (levels.highLTheanine) {
      scores.calming += 3.0;       // Increased from 2.5
      scores.focusing += 1.5;
      scores.restorative += 1.5;   // Increased from 1.0
      scores.elevating += 1.0;     // Added to boost elevating effects
    } else if (levels.moderateLTheanine) {
      scores.calming += 2.0;       // Increased from 1.5
      scores.focusing += 1.0;
      scores.harmonizing += 1.0;   // Increased from 0.8
      scores.restorative += 0.8;   // Added for more balance
    }
    
    if (levels.highCaffeine) {
      scores.energizing += 2.0;    // Decreased from 2.5
      scores.focusing += 1.2;      // Increased from 1.0
      scores.elevating += 1.0;     // Increased from 0.8
    } else if (levels.moderateCaffeine) {
      scores.energizing += 1.2;    // Decreased from 1.5
      scores.focusing += 1.0;      // Increased from 0.8
    }
    
    // Balanced effects
    if (levels.balanced) {
      scores.harmonizing += 2.5;   // Increased from 2.0
      scores.focusing += 1.2;      // Increased from 1.0
      scores.grounding += 1.0;     // Increased from 0.8
      scores.elevating += 0.8;     // Added to boost elevating effects
    }
    
    // Extreme effects
    if (levels.extremeRatio) {
      scores.calming += 2.5;       // Increased from 2.2
      scores.restorative += 2.0;   // Increased from 1.5
      scores.grounding += 1.0;     // Added grounding effect
    } else if (levels.veryLowRatio) {
      scores.energizing += 2.0;    // Decreased from 2.5
      scores.focusing += 1.5;      // Increased from 1.2
      scores.elevating += 1.0;     // Added elevating effect
    }
    
    return scores;
  }
  
  // Calculate compound scores for final output
  calculateCompoundScores(inference) {
    if (!inference || !inference.effects) {
      return {};
    }
    
    // Map to the 8 consolidated effects
    const consolidatedScores = {
      energizing: 0,
      calming: 0,
      focusing: 0,
      harmonizing: 0,
      grounding: 0,
      elevating: 0,
      comforting: 0,
      restorative: 0
    };
    
    // Only copy scores that match our consolidated effects
    Object.entries(inference.effects).forEach(([effect, score]) => {
      if (consolidatedScores.hasOwnProperty(effect)) {
        consolidatedScores[effect] += score;
      }
      // Ignore any old effect names
    });
    
    return consolidatedScores;
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