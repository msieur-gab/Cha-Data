// normalization.js
// Utility functions for effect score normalization and scaling

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

    // Handle harmonizing effect if present (replaces balancing)
    if (scores['harmonizing']) {
        // Find the top non-harmonizing effect score to use as a reference
        const dominantNonHarmonizingScore = Object.entries(scores)
            .filter(([effect]) => effect !== 'harmonizing')
            .sort(([, a], [, b]) => b - a)[0]?.[1] || 0;
        
        // If harmonizing is much higher than other effects, reduce it
        if (scores['harmonizing'] > dominantNonHarmonizingScore * 1.3) {
            scores['harmonizing'] = dominantNonHarmonizingScore * 1.2;
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
 * @param {string} dominantId - ID of the dominant effect to enhance
 * @returns {Object} - Enhanced effect scores
 */
export function enhanceDominantEffect(scores, dominantId) {
    if (!scores || typeof scores !== 'object' || Object.keys(scores).length === 0) {
        return scores;
    }
    
    // Create a copy of the scores
    const enhancedScores = { ...scores };
    
    // If no dominant ID is provided, find it by sorting effects by score
    if (!dominantId) {
        const sortedEffects = Object.entries(enhancedScores)
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
            
        if (sortedEffects.length > 0) {
            dominantId = sortedEffects[0][0];
        } else {
            return enhancedScores;
        }
    }
    
    // Check if the dominant effect exists in scores
    if (!(dominantId in enhancedScores)) {
        return enhancedScores;
    }
    
    // Sort effects by score
    const sortedEffects = Object.entries(enhancedScores)
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
    
    // Special handling if harmonizing is the dominant effect
    if (dominantId === 'harmonizing' && sortedEffects.length > 1) {
        const [secondId, secondScore] = sortedEffects[1];
        
        // If harmonizing is only slightly higher than the second effect,
        // make the second effect dominant instead
        if (enhancedScores[dominantId] - secondScore < 0.8) {
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
    
    // Enhance the dominant effect
    enhancedScores[dominantId] = Math.min(9.5, enhancedScores[dominantId] * 1.05);
    
    // Adjust supporting effects to maintain a hierarchy
    // Find the index of the dominant effect
    const dominantIndex = sortedEffects.findIndex(([id]) => id === dominantId);
    
    // If we have supporting effects, enhance them slightly (but less than dominant)
    if (dominantIndex === 0 && sortedEffects.length > 1) {
        const [supportingId, supportingScore] = sortedEffects[1];
        enhancedScores[supportingId] = Math.min(9.0, supportingScore * 1.02);
        
        // Make sure the supporting effect score doesn't exceed the dominant score
        if (enhancedScores[supportingId] >= enhancedScores[dominantId]) {
            enhancedScores[supportingId] = enhancedScores[dominantId] - 0.5;
        }
        
        // If we have a second supporting effect, enhance it very slightly
        if (sortedEffects.length > 2) {
            const [supporting2Id, supporting2Score] = sortedEffects[2];
            enhancedScores[supporting2Id] = Math.min(8.5, supporting2Score * 1.01);
            
            // Make sure the second supporting effect doesn't exceed the first supporting effect
            if (enhancedScores[supporting2Id] >= enhancedScores[supportingId]) {
                enhancedScores[supporting2Id] = enhancedScores[supportingId] - 0.3;
            }
        }
    }
    
    return enhancedScores;
}

/**
 * Advanced score normalization system with customizable parameters
 * @param {Object} config - Configuration object with normalization parameters
 * @returns {Object} - Object with normalization methods
 */
export function createScoreNormalizer(config = {}) {
    // Default configuration
    const defaultConfig = {
        normalizationFactor: 5,  // Midpoint for sigmoid function
        steepness: 0.5,          // Steepness of sigmoid curve
        maxEffectScore: 9.8,     // Maximum score cap
        enhancementFactor: 1.05  // Enhancement multiplier
    };
    
    // Merge with provided config
    const normalizeConfig = { ...defaultConfig, ...config };
    
    return {
        // Normalize a single score with sigmoid function
        normalizeScore(rawScore) {
            // Modified sigmoid function for better score distribution
            let score = 10 / (1 + Math.exp(-normalizeConfig.steepness * 
                (rawScore - normalizeConfig.normalizationFactor)));
            
            // Apply nonlinear transformation to increase differentiation in mid-range
            if (score > 2 && score < 8) {
                // Stretch the middle range
                const normalizedPos = (score - 2) / 6; // 0 to 1 across the range 2-8
                const stretchedPos = Math.pow(normalizedPos, 0.9); // Power less than 1 stretches middle
                score = 2 + (stretchedPos * 6);
            }
            
            // Hard cap to prevent too many 10s
            return Math.min(normalizeConfig.maxEffectScore, score);
        },
        
        // Normalize all scores in an object
        normalizeScores(scores) {
            const result = {};
            Object.entries(scores).forEach(([key, value]) => {
                result[key] = this.normalizeScore(value);
            });
            return result;
        },
        
        // Apply tea type specific modifiers
        applyTeaTypeModifiers(scores, teaType, modifiers) {
            if (!teaType || !modifiers || !modifiers[teaType]) {
                return scores;
            }
            
            const typeModifiers = modifiers[teaType];
            const modifiedScores = { ...scores };
            
            Object.entries(typeModifiers).forEach(([effect, modifier]) => {
                if (modifiedScores[effect] !== undefined) {
                    modifiedScores[effect] *= modifier;
                }
            });
            
            return modifiedScores;
        }
    };
}

export default {
    normalizeScores,
    enhanceDominantEffect,
    createScoreNormalizer
}; 