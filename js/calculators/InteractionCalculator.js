// InteractionCalculator.js
// Handles calculations related to tea effect interactions

import { validateObject, sortByProperty } from '../utils/helpers.js';
import { effectMapping, effectInteractionRules } from '../props/EffectMapping.js';

export class InteractionCalculator {
  constructor(config, effectCombinations) {
    this.config = config;
    this.effectCombinations = effectCombinations || {};
    this.effectMapping = effectMapping;
    this.effectInteractionRules = effectInteractionRules;
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
    const modifiedScores = this.evaluateSynergisticEffects(scores, tea);
    
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
   * @param {Object} tea - Optional tea object to use for context-specific balancing
   * @returns {Object} - Modified scores after applying synergistic interactions
   */
  evaluateSynergisticEffects(scores, tea = null) {
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
    
    // Apply additional balancing rules if tea object is provided
    if (tea) {
      this.applyBalancingRules(modifiedScores, tea);
    }
    
    return modifiedScores;
  }
  
  /**
   * Apply balancing rules to prevent certain effects from dominating
   * and to boost underrepresented effects in appropriate contexts
   */
  applyBalancingRules(scores, tea) {
    if (!tea) return scores;
    
    // Synergy between balancing and elevating
    if (scores["balancing"] > 5.0 && scores["elevating"] > 3.0) {
      scores["balancing"] *= 1.15; // Boost balancing when elevating present
    }
    
    // Prevent peaceful from dominating too many teas
    if (scores["peaceful"] > 7.0) {
      // Check if it should really be peaceful dominant
      const hasPeacefulMarkers = tea.lTheanineLevel > 7.0 && 
                                 tea.caffeineLevel < 4.0;
        
      if (!hasPeacefulMarkers) {
        scores["peaceful"] *= 0.75; // REDUCED from 0.8 - Apply stronger reduction
      }
    }
    
    // Prevent clarifying from dominating everything
    if (scores["clarifying"] > 7.0) {
      // Check if it should really be clarifying dominant
      const hasClarifyingMarkers = 
        tea.processingMethods?.includes("shade-grown") &&
        tea.flavorProfile?.some(f => ["umami", "marine"].includes(f));
        
      if (!hasClarifyingMarkers) {
        scores["clarifying"] *= 0.78; // REDUCED from 0.82 - Apply stronger reduction
      }
    }
    
    // Boost awakening effect which was underrepresented
    if (scores["awakening"] > 0 && scores["awakening"] < 5.0) {
      // Boost for teas with high caffeine and astringent/brisk flavors
      if (tea.caffeineLevel > 4.0 || 
          (tea.flavorProfile && tea.flavorProfile.some(f => 
            ["brisk", "astringent", "bright"].includes(f)))) {
        scores["awakening"] *= 1.7; // Significant boost
      }
    }
    
    // Boost nurturing effect which was underrepresented
    if (scores["nurturing"] > 0) {
      // Boost for roasted teas with woody/nutty flavors
      if (tea.processingMethods && tea.processingMethods.some(p => p.includes("roast")) &&
          tea.flavorProfile && tea.flavorProfile.some(f => 
            ["woody", "nutty", "roasted"].includes(f))) {
        scores["nurturing"] *= 1.4; // Significant boost
      }
    }
    
    // Boost elevating effect which was significantly underrepresented
    if (scores["elevating"] > 0) {
      // Check for floral and fruity flavors
      if (tea.flavorProfile && tea.flavorProfile.some(f => 
          ["floral", "fruity", "orchid", "honey", "apricot", "peach"].includes(f))) {
        scores["elevating"] *= 1.6; // Strong boost
      }
      
      // Additional boost for light processing
      if (tea.processingMethods && tea.processingMethods.some(p => 
          p.includes("light") || p === "minimal-processing")) {
        scores["elevating"] *= 1.3; // Additional boost
      }
    }
    
    // Boost comforting effect which was underrepresented
    if (scores["comforting"] > 0) {
      // Boost for toasty/nutty flavors
      if (tea.flavorProfile && tea.flavorProfile.some(f => 
          ["toasted", "nutty", "cereal", "baked", "grain"].includes(f))) {
        scores["comforting"] *= 1.8; // Strong boost for comforting
      }
    }
    
    // Boost restorative effect which was very underrepresented
    if (scores["restorative"] > 0) {
      // Boost for berry/antioxidant profiles
      if (tea.flavorProfile && tea.flavorProfile.some(f => 
          ["berry", "berries", "antioxidant", "fruity"].includes(f))) {
        scores["restorative"] *= 2.5; // Very strong boost
      }
    }
    
    // Create interaction between centering and stabilizing
    if (scores["centering"] > 4.0 && scores["stabilizing"] > 4.0) {
      // If both are present, boost the lower one
      if (scores["centering"] > scores["stabilizing"]) {
        scores["stabilizing"] *= 1.2;
      } else {
        scores["centering"] *= 1.2;
      }
    }
    
    // Processing method interactions
    if (tea.processingMethods) {
      if (tea.processingMethods.includes("fermented") || 
          tea.processingMethods.includes("pile-fermented") || 
          tea.processingMethods.includes("aged")) {
          
        // Fermented and aged teas should have stronger centering effect
        const centeringBoost = 1.0 + (0.1 * tea.processingMethods.filter(p => 
          p.includes("ferment") || p.includes("aged")).length);
          
        scores["centering"] *= centeringBoost;
        
        // If already strong, don't overboost
        scores["centering"] = Math.min(scores["centering"], 10.0);
      }
      
      // Elevating boost for lighter processing methods
      if (tea.processingMethods.some(p => p.includes("light") || p === "minimal-processing") &&
          !tea.processingMethods.some(p => p.includes("heavy") || p.includes("dark"))) {
        
        // Check for floral flavor notes too
        if (tea.flavorProfile && tea.flavorProfile.some(f => 
            ["floral", "fruity", "orchid", "honey"].includes(f))) {
          scores["elevating"] *= 1.25; // Boost elevating
        }
      }
    }
    
    // Boost nurturing if it's expected to be strong but isn't
    if (scores["nurturing"] < 4.0 && 
        tea.flavorProfile && tea.flavorProfile.some(f => ["woody", "nutty", "roasted"].includes(f)) &&
        tea.processingMethods && tea.processingMethods.some(p => p.includes("roast"))) {
      scores["nurturing"] += 2.5;
    }
    
    // Balance when multiple effects are strong
    const strongEffects = Object.entries(scores)
      .filter(([_, score]) => score > 8.0)
      .map(([effect]) => effect);
      
    if (strongEffects.length > 2) {
      // If too many strong effects, slightly reduce the lowest ones
      const overrepresentedEffects = ["peaceful", "balancing", "clarifying"];
      const effectsToReduce = strongEffects
        .filter(effect => overrepresentedEffects.includes(effect))
        .sort((a, b) => scores[a] - scores[b]);
        
      // Reduce the 2 lowest overrepresented effects
      effectsToReduce.slice(0, 2).forEach(effect => {
        scores[effect] *= 0.9;
      });
    }
    
    return scores;
  }
  
  // For backwards compatibility
  applyEffectInteractions(tea, scores) {
    // Ensure scores is an object
    if (!scores || typeof scores !== 'object') {
      return {};
    }

    // Create a copy of scores to avoid modifying the original
    const resultScores = { ...scores };

    const safeTea = {
        processing: tea?.processing || [],
        flavor: tea?.flavor || [],
        compounds: tea?.compounds || {}
    };

    // Apply complementary effects
    Object.entries(resultScores).forEach(([effect, score]) => {
        if (score > 5) { // Only apply interactions for significant effects
            const complementaryEffects = this.effectInteractionRules?.complementary?.[effect] || [];
            complementaryEffects.forEach(complementaryEffect => {
                resultScores[complementaryEffect] = (resultScores[complementaryEffect] || 0) + score * 0.3;
            });
        }
    });

    // Apply opposing effects
    Object.entries(resultScores).forEach(([effect, score]) => {
        if (score > 5) { // Only apply interactions for significant effects
            const opposingEffects = this.effectInteractionRules?.opposing?.[effect] || [];
            opposingEffects.forEach(opposingEffect => {
                resultScores[opposingEffect] = Math.max(0, (resultScores[opposingEffect] || 0) - score * 0.2);
            });
        }
    });

    return resultScores;
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
    const strengthFactor = this.config.get('interactionStrengthFactor', 0.8);
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
          const strengthFactor = this.config.get('interactionStrengthFactor', 0.8);
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
