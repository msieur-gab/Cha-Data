// ScoreNormalizer.js
// Handles effect score normalization and scaling

export class ScoreNormalizer {
  constructor(config) {
    this.config = config;
  }
  
  // Normalize scores with improved differentiation (modified sigmoid function)
  normalizeScore(raw) {
    // Get configuration values
    const midpoint = this.config.get('scoring.normalizationFactor');
    const steepness = this.config.get('scoring.normalizationSteepness');
    const maxScore = this.config.get('thresholds.maxEffectScore');
    
    // Modified sigmoid function for better score distribution
    // This creates an S-shaped curve with better differentiation
    let score = 10 / (1 + Math.exp(-steepness * (raw - midpoint)));
    
    // Apply nonlinear transformation to increase differentiation in mid-range
    if (score > 2 && score < 8) {
      // Stretch the middle range
      const normalizedPos = (score - 2) / 6; // 0 to 1 across the range 2-8
      const stretchedPos = Math.pow(normalizedPos, 0.9); // Power less than 1 stretches middle
      score = 2 + (stretchedPos * 6);
    }
    
    // Hard cap to prevent too many 10s
    return Math.min(maxScore, score);
  }
  
  // Apply tea type modifiers to boost characteristic effects for different tea types
  applyTeaTypeModifiers(scores, teaType) {
    if (!teaType) return scores;
    
    const typeModifiers = this.config.get(`teaTypeModifiers.${teaType.toLowerCase()}`);
    if (!typeModifiers) return scores;
    
    const modifiedScores = {...scores};
    
    // Apply stronger modifiers to create more differentiation
    Object.entries(typeModifiers).forEach(([effect, modifier]) => {
      if (modifiedScores[effect] !== undefined) {
        modifiedScores[effect] *= modifier;
      }
    });
    
    return modifiedScores;
  }
  
  // Anti-dominance limiting to prevent any effect from being too dominant
  applyAntiDominanceLimiting(scores) {
    const modifiedScores = {...scores};
    
    // Special handling to avoid excessively high balancing effect
    if (modifiedScores['balancing'] > 0) {
      // Find the top non-balancing effect score to use as a reference
      const topNonBalancingScore = Object.entries(modifiedScores)
        .filter(([effect]) => effect !== 'balancing')
        .sort(([, a], [, b]) => b - a)[0]?.[1] || 0;
      
      // Don't let balancing score greatly exceed other top effects
      if (modifiedScores['balancing'] > topNonBalancingScore * 1.5) {
        modifiedScores['balancing'] = topNonBalancingScore * 1.2;
      }
    }
    
    return modifiedScores;
  }
  
  // Apply final normalization to all scores
  normalizeFinalScores(scores) {
    const normalizedScores = {};
    
    Object.entries(scores).forEach(([effect, score]) => {
      normalizedScores[effect] = this.normalizeScore(score);
    });
    
    // Final bounds check
    Object.keys(normalizedScores).forEach(effect => {
      normalizedScores[effect] = Math.min(10, Math.max(0, normalizedScores[effect]));
    });
    
    return normalizedScores;
  }
  
  // Create score differential between dominant and supporting effects
  enhanceDominantEffect(scores) {
    const modifiedScores = {...scores};
    
    // Sort effects by score
    const sortedEffects = Object.entries(modifiedScores)
      .sort(([, a], [, b]) => b - a);
    
    if (sortedEffects.length < 2) return modifiedScores;
    
    // Get dominant and supporting effects
    const dominantEffect = sortedEffects[0];
    const supportingEffect = sortedEffects[1];
    
    // Create score differential between dominant and supporting
    // to prevent too many ties
    if (dominantEffect[1] - supportingEffect[1] < 0.3) { // Increased from 0.2
      // Create a larger separation for clearer dominant/supporting distinction
      const newDominantScore = Math.min(10, dominantEffect[1] + 0.25); // Increased from 0.15
      // Update the score
      modifiedScores[dominantEffect[0]] = newDominantScore;
    }
    
    return modifiedScores;
  }
}

export default ScoreNormalizer;

/**
 * Normalizes scores to a 0-10 scale
 * @param {Object} scores - Raw effect scores
 * @returns {Object} Normalized scores
 */
export function normalizeScores(scores) {
    if (!scores || Object.keys(scores).length === 0) {
        return {};
    }

    // Find the maximum score
    const maxScore = Math.max(...Object.values(scores));
    
    // If all scores are 0, return the original scores
    if (maxScore === 0) {
        return scores;
    }

    // Handle balancing effect if present
    if (scores['balancing']) {
        // Find the top non-balancing effect score to use as a reference
        const dominantNonBalancingScore = Object.entries(scores)
            .filter(([effect]) => effect !== 'balancing')
            .sort(([, a], [, b]) => b - a)[0]?.[1] || 0;
        
        // If balancing is much higher than other effects, reduce it
        if (scores['balancing'] > dominantNonBalancingScore * 1.3) {
            scores['balancing'] = dominantNonBalancingScore * 1.2;
        }
    }

    // Normalize all scores to 0-10 scale
    const normalized = {};
    Object.entries(scores).forEach(([effect, score]) => {
        normalized[effect] = (score / maxScore) * 10;
    });

    return normalized;
}

/**
 * Enhance the dominant effect to make it stand out more clearly
 * @param {Object} scores - Effect scores object
 * @returns {Object} - Enhanced effect scores
 */
export function enhanceDominantEffect(scores) {
    if (!scores || typeof scores !== 'object' || Object.keys(scores).length === 0) {
        return scores;
    }
    
    // Create a copy of the scores
    const enhancedScores = { ...scores };
    
    // Sort effects by score
    const sortedEffects = Object.entries(enhancedScores)
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
    
    // If we have at least one effect
    if (sortedEffects.length > 0) {
        // Get the ID of the dominant effect
        const [dominantId, dominantScore] = sortedEffects[0];
        
        // Special handling if balancing is the dominant effect
        if (dominantId === 'balancing' && sortedEffects.length > 1) {
            const [secondId, secondScore] = sortedEffects[1];
            
            // If balancing is only slightly higher than the second effect,
            // make the second effect dominant instead
            if (dominantScore - secondScore < 0.8) {
                enhancedScores[secondId] = Math.min(10, secondScore * 1.15);
                enhancedScores[dominantId] = secondScore * 0.95;
                
                // Enhance the supporting effect (third one now)
                if (sortedEffects.length > 2) {
                    const [thirdId, thirdScore] = sortedEffects[2];
                    enhancedScores[thirdId] = Math.min(10, thirdScore * 1.05);
                }
                
                return enhancedScores;
            }
        }
        
        // Enhance the dominant effect (increase by 15% instead of 10%)
        enhancedScores[dominantId] = Math.min(10, dominantScore * 1.15);
        
        // If we have supporting effects, enhance them slightly (but less than dominant)
        if (sortedEffects.length > 1) {
            const [supportingId, supportingScore] = sortedEffects[1];
            enhancedScores[supportingId] = Math.min(10, supportingScore * 1.05);
            
            // Make sure the supporting effect score doesn't exceed the dominant score
            if (enhancedScores[supportingId] >= enhancedScores[dominantId]) {
                enhancedScores[supportingId] = enhancedScores[dominantId] - 0.5;
            }
            
            // If we have a second supporting effect, enhance it very slightly
            if (sortedEffects.length > 2) {
                const [supporting2Id, supporting2Score] = sortedEffects[2];
                enhancedScores[supporting2Id] = Math.min(10, supporting2Score * 1.02);
                
                // Make sure the second supporting effect doesn't exceed the first supporting effect
                if (enhancedScores[supporting2Id] >= enhancedScores[supportingId]) {
                    enhancedScores[supporting2Id] = enhancedScores[supportingId] - 0.3;
                }
            }
        }
    }
    
    return enhancedScores;
}