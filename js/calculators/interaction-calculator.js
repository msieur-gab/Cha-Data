// InteractionCalculator.js
// Handles calculations related to tea effect interactions

import { validateObject, sortByProperty } from '../utils/helpers.js';

export class InteractionCalculator {
  constructor(config, effectCombinations) {
    this.config = config;
    this.effectCombinations = effectCombinations || {};
  }
  
  // Main API method that follows the standardized calculator pattern
  calculate(tea) {
    const inference = this.infer(tea);
    return {
      inference: this.formatInference(inference),
      data: this.serialize(inference)
    };
  }
  
  // Core inferencer - processes scores and produces raw data
  infer(tea) {
    // Generate or extract effect scores from tea
    const scores = this._extractEffectScores(tea);
    
    // Apply interaction effects
    const modifiedScores = this.evaluateSynergisticEffects(scores);
    
    // Identify significant interactions
    const interactions = this.identifySignificantInteractions(scores);
    
    return {
      originalScores: scores,
      modifiedScores: modifiedScores,
      interactions: interactions
    };
  }
  
  // Format as human-readable markdown
  formatInference(inference) {
    const { originalScores, modifiedScores, interactions } = inference;
    
    let markdown = "## Effect Interaction Analysis\n\n";
    
    // Add interaction descriptions
    if (interactions && interactions.length > 0) {
      markdown += "### Significant Interactions\n";
      interactions.forEach(interaction => {
        markdown += `- **${interaction.name}**: ${interaction.description}\n`;
        markdown += `  - Strength: ${interaction.strength.toFixed(2)}\n`;
        markdown += `  - Effects: ${interaction.effects.join(' + ')}\n`;
      });
      markdown += "\n";
    } else {
      markdown += "No significant interactions detected.\n\n";
    }
    
    // Show score changes
    markdown += "### Effect Score Changes\n";
    const allEffects = new Set([
      ...Object.keys(originalScores), 
      ...Object.keys(modifiedScores)
    ]);
    
    allEffects.forEach(effect => {
      const original = originalScores[effect] || 0;
      const modified = modifiedScores[effect] || 0;
      const change = modified - original;
      
      if (Math.abs(change) > 0.1) {
        const changeSymbol = change > 0 ? "↑" : "↓";
        markdown += `- **${effect}**: ${original.toFixed(1)} → ${modified.toFixed(1)} ${changeSymbol} ${Math.abs(change).toFixed(1)}\n`;
      }
    });
    
    return markdown;
  }
  
  // Convert to structured data for JSON
  serialize(inference) {
    return {
      interactions: inference.interactions.map(interaction => ({
        name: interaction.name,
        description: interaction.description,
        effects: interaction.effects,
        strength: interaction.strength
      })),
      scores: {
        original: inference.originalScores,
        modified: inference.modifiedScores
      }
    };
  }
  
  // Extract effect scores from tea object or use provided scores
  _extractEffectScores(tea) {
    // If tea is already a score object, use it directly
    if (tea && typeof tea === 'object' && !Array.isArray(tea) && 
        Object.values(tea).every(v => typeof v === 'number')) {
      return { ...tea };
    }
    
    // Otherwise, generate scores based on tea properties
    const scores = {};
    
    if (tea && typeof tea === 'object') {
      // Use expected effects if available
      if (tea.expectedEffects) {
        if (tea.expectedEffects.dominant) {
          scores[tea.expectedEffects.dominant] = 9.5;
        }
        if (tea.expectedEffects.supporting) {
          scores[tea.expectedEffects.supporting] = 7.5;
        }
      }
      
      // Add L-theanine and caffeine based effects
      if (tea.lTheanineLevel !== undefined && tea.caffeineLevel !== undefined) {
        const ratio = tea.lTheanineLevel / tea.caffeineLevel;
        
        if (ratio > 1.5) {
          scores.peaceful = (scores.peaceful || 0) + tea.lTheanineLevel * 0.8;
          scores.soothing = (scores.soothing || 0) + tea.lTheanineLevel * 0.7;
        }
        
        if (ratio < 1.0) {
          scores.revitalizing = (scores.revitalizing || 0) + tea.caffeineLevel * 0.9;
          scores.awakening = (scores.awakening || 0) + tea.caffeineLevel * 0.7;
        }
      }
    }
    
    return scores;
  }
  
  /**
   * Evaluates synergistic interactions between effects and applies modifications
   * 
   * This is the core synergistic calculation method that:
   * 1. Identifies potential interactions between all effect pairs
   * 2. Calculates interaction strength based on effect intensities
   * 3. Applies modifiers to target effects based on interaction definitions
   * 4. Returns a new set of scores with all synergistic effects applied
   * 
   * @param {Object} scores - Original effect scores
   * @returns {Object} - Modified scores after applying synergistic interactions
   */
  evaluateSynergisticEffects(scores) {
    scores = validateObject(scores);
    if (!this.effectCombinations) {
      return scores;
    }
    
    // Create a copy of the scores to modify
    const modifiedScores = { ...scores };
    
    // Get sorted list of dominant effects (descending order)
    const sortedEffects = sortByProperty(
      Object.entries(scores).map(([id, score]) => ({ id, score })),
      'score'
    );
    
    // Apply interactions between primary effects
    for (let i = 0; i < sortedEffects.length - 1; i++) {
      const effect1 = sortedEffects[i].id;
      
      for (let j = i + 1; j < sortedEffects.length; j++) {
        const effect2 = sortedEffects[j].id;
        
        // Apply the interaction if it exists
        this.applyInteraction(effect1, effect2, modifiedScores);
      }
    }
    
    return modifiedScores;
  }
  
  // For backwards compatibility
  applyEffectInteractions(scores) {
    return this.evaluateSynergisticEffects(scores);
  }
  
  /**
   * Apply a synergistic interaction between two effects
   * 
   * When two effects interact, they can modify other effects in various ways:
   * - Amplify related effects through positive modifiers
   * - Reduce competing effects through negative modifiers
   * - Create secondary effects not strongly present in the original
   * 
   * @param {string} effect1 - First effect identifier
   * @param {string} effect2 - Second effect identifier
   * @param {Object} scores - Scores being modified
   */
  applyInteraction(effect1, effect2, scores) {
    // Look for the interaction in either direction
    const interaction = this.findInteraction(effect1, effect2);
    
    if (!interaction) {
      return;
    }
    
    // Get base scores
    const score1 = scores[effect1] || 0;
    const score2 = scores[effect2] || 0;
    
    // Calculate interaction strength based on both scores
    // The weaker effect limits the overall interaction strength
    const strengthFactor = this.config.get('interactionStrengthFactor');
    const interactionStrength = Math.min(score1, score2) * strengthFactor;
    
    // If interaction has modifies property, apply the modifiers
    if (interaction.modifies) {
      // Apply the modifier to the target effects
      interaction.modifies.forEach(({ target, modifier }) => {
        if (!scores[target]) {
          scores[target] = 0;
        }
        
        // Apply the interaction effect
        scores[target] += interactionStrength * modifier;
      });
    } 
    // For interactions that don't have modifies property (from EffectCombinations.js)
    // We'll consider it a reinforcing interaction between the two effects
    else {
      // Reinforce both effects slightly
      scores[effect1] += interactionStrength * 0.2;
      scores[effect2] += interactionStrength * 0.2;
    }
  }
  
  // Find an interaction between two effects (in either direction)
  findInteraction(effect1, effect2) {
    // Create a lookup key (order doesn't matter for the lookup)
    const key1 = `${effect1}+${effect2}`;
    const key2 = `${effect2}+${effect1}`;
    
    // Return the interaction if it exists
    return this.effectCombinations[key1] || this.effectCombinations[key2];
  }
  
  // Get all interactions for a specific effect
  getEffectInteractions(effectId) {
    if (!effectId || !this.effectCombinations) {
      return [];
    }
    
    const interactions = [];
    
    // Search for all interactions involving this effect
    Object.entries(this.effectCombinations).forEach(([key, interaction]) => {
      if (key.includes(effectId)) {
        interactions.push({
          key,
          ...interaction
        });
      }
    });
    
    return interactions;
  }
  
  /**
   * Identify significant synergistic interactions for a tea's effect profile
   * 
   * This analyzes the tea's effect profile to find meaningful combinations that:
   * 1. Involve effects that are sufficiently strong (above threshold)
   * 2. Have defined interactions in the effect combinations database
   * 3. Would create measurable synergistic effects
   * 
   * @param {Object} scores - Effect scores to analyze
   * @returns {Array} - List of significant interactions with their strength and details
   */
  identifySignificantInteractions(scores) {
    scores = validateObject(scores);
    
    // Get sorted list of dominant effects (descending order)
    const sortedEffects = sortByProperty(
      Object.entries(scores).map(([id, score]) => ({ id, score })),
      'score'
    );
    
    // Only consider top effects with significant scores
    const significantEffects = sortedEffects
      .filter(effect => effect.score >= this.config.get('supportingEffectThreshold'))
      .slice(0, 3); // Only top 3 effects
    
    if (significantEffects.length < 2) {
      return [];
    }
    
    const significantInteractions = [];
    
    // Check for interactions between significant effects
    for (let i = 0; i < significantEffects.length - 1; i++) {
      const effect1 = significantEffects[i].id;
      
      for (let j = i + 1; j < significantEffects.length; j++) {
        const effect2 = significantEffects[j].id;
        
        // Find the interaction
        const interaction = this.findInteraction(effect1, effect2);
        
        if (interaction) {
          // Calculate interaction strength
          const score1 = scores[effect1] || 0;
          const score2 = scores[effect2] || 0;
          const strengthFactor = this.config.get('interactionStrengthFactor');
          const strength = Math.min(score1, score2) * strengthFactor;
          
          // Add to the list of significant interactions
          significantInteractions.push({
            effects: [effect1, effect2],
            strength,
            description: interaction.description,
            name: interaction.name,
            modifies: interaction.modifies || []
          });
        }
      }
    }
    
    // Sort interactions by strength (descending)
    return sortByProperty(significantInteractions, 'strength');
  }
}

export default InteractionCalculator;
