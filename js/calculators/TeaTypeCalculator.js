import { teaTypeEffects } from '../props/EffectMapping.js';

/**
 * TeaTypeCalculator
 * 
 * This calculator determines the initial effect scores based on tea type.
 * It provides the foundation for tea effect calculations by mapping
 * each tea type to its characteristic effects.
 */
export class TeaTypeCalculator {
    constructor() {
        this.teaTypeEffects = teaTypeEffects;
    }

    /**
     * Calculate tea type effect scores
     * @param {Object} tea - The tea object containing type information
     * @returns {Object} - Object containing tea type effect scores
     */
    calculateTeaTypeScores(tea) {
        if (!tea || !tea.type) {
            throw new Error('Invalid tea object or missing tea type');
        }

        // Handle puerh type mapping
        const teaType = tea.type.toLowerCase();
        const mappedType = teaType === 'puerh' ? 'puerh-shou' : teaType;

        const typeEffects = this.teaTypeEffects[mappedType];
        if (!typeEffects) {
            throw new Error(`No effects defined for tea type: ${teaType}`);
        }

        // Initialize scores for all effects
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

        // Apply tea type effects
        Object.entries(typeEffects.effects).forEach(([effect, score]) => {
            scores[effect] = score;
        });

        return this.normalizeScores(scores);
    }

    /**
     * Normalize scores to ensure they're within 0-10 range
     * @param {Object} scores - The scores to normalize
     * @returns {Object} - Normalized scores
     */
    normalizeScores(scores) {
        // Ensure all scores are within 0-10 range
        const normalized = {};
        Object.entries(scores).forEach(([effect, score]) => {
            normalized[effect] = Math.max(0, Math.min(10, score));
        });
        return normalized;
    }

    /**
     * Get the dominant and supporting effects based on scores
     * @param {Object} scores - The effect scores
     * @returns {Object} - Object containing dominant and supporting effects
     */
    getDominantEffects(scores) {
        const sorted = Object.entries(scores)
            .sort(([, a], [, b]) => b - a);

        return {
            dominant: sorted[0][0],
            supporting: sorted[1][0]
        };
    }
}

export default TeaTypeCalculator; 