// InteractionCalculator.js
// Handles calculations related to tea effect interactions

import { BaseCalculator } from './BaseCalculator.js';
import { validateObject, sortByProperty } from '../utils/helpers.js';
import mapEffectCombinations from '../utils/EffectInteractionMapper.js';

export class InteractionCalculator extends BaseCalculator {
    constructor(config) {
        super(config);
        this.effectCombinations = {
            "calming+focusing": {
                name: "Mindful Tranquility",
                description: "A state of calm alertness with enhanced mental clarity",
                modifies: [
                    { target: "focusing", modifier: 0.5 }, // Boost focusing
                    { target: "energizing", modifier: -0.3 } // Reduce energizing
                ]
            },
            
            "floral+fruity": {
                name: "Uplifting Aroma",
                description: "A combination that creates pronounced elevating effects",
                modifies: [
                    { target: "elevating", modifier: 0.7 } // Significant boost to elevating
                ]
            },
            
            "earthy+woody": {
                name: "Grounding Foundation",
                description: "A deeply centering combination with pronounced grounding effects",
                modifies: [
                    { target: "grounding", modifier: 0.8 }, // Boost grounding
                    { target: "comforting", modifier: 0.5 } // Boost comforting
                ]
            }
        };
        this.effectInteractionRules = {
            complementary: {
                energizing: ['focusing', 'elevating'],
                calming: ['harmonizing', 'restorative'],
                focusing: ['energizing', 'grounding'],
                harmonizing: ['calming', 'elevating'],
                grounding: ['focusing', 'comforting'],
                elevating: ['energizing', 'harmonizing'],
                comforting: ['grounding', 'restorative'],
                restorative: ['calming', 'comforting']
            },
            opposing: {
                energizing: ['calming'],
                calming: ['energizing'],
                focusing: ['restorative'],
                harmonizing: [],
                grounding: ['elevating'],
                elevating: ['grounding'],
                comforting: [],
                restorative: ['focusing']
            }
        };
    }
    
    // Set effect combinations data
    setEffectCombinations(effectCombinations) {
        this.effectCombinations = mapEffectCombinations(effectCombinations || {});
    }
    
    // Override infer method from BaseCalculator
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
    
    // Override formatInference method from BaseCalculator
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
    
    // Override serialize method from BaseCalculator
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
            
            // Return a copy of the scores, ensuring only consolidated effects are used
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
            
            // Process each score, keeping only consolidated effects
            Object.entries(tea).forEach(([effect, score]) => {
                // Only include if it's one of our 8 consolidated effects
                if (consolidatedScores.hasOwnProperty(effect)) {
                    consolidatedScores[effect] = (consolidatedScores[effect] || 0) + score;
                }
                // Ignore old effect names
            });
            
            return consolidatedScores;
        }
        
        // Otherwise, generate scores based on tea properties
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
        
        if (tea && typeof tea === 'object') {
            // Add L-theanine and caffeine based effects
            if (tea.compounds?.theanineLevel !== undefined && tea.compounds?.caffeineLevel !== undefined) {
                const theanineLevel = tea.compounds.theanineLevel;
                const caffeineLevel = tea.compounds.caffeineLevel;
                const ratio = theanineLevel / caffeineLevel;
                
                if (ratio > 1.5) {
                    // L-Theanine dominant - calming effects
                    scores.calming += theanineLevel * 0.8;
                    scores.focusing += theanineLevel * 0.5;
                }
                
                if (ratio < 1.0) {
                    // Caffeine dominant - energizing effects
                    scores.energizing += caffeineLevel * 0.9;
                    scores.focusing += caffeineLevel * 0.5;
                }
                
                // Balance ratio gives harmonizing
                if (ratio >= 1.0 && ratio <= 1.5) {
                    scores.harmonizing += (theanineLevel + caffeineLevel) * 0.3;
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
        
        // Get compound information from tea
        const theanineLevel = tea.compounds?.theanineLevel || 0;
        const caffeineLevel = tea.compounds?.caffeineLevel || 0;
        
        // Synergy between harmonizing and elevating
        if (scores.harmonizing > 5.0 && scores.elevating > 3.0) {
            scores.harmonizing *= 1.15; // Boost harmonizing when elevating present
        }
        
        // Prevent calming from dominating too many teas
        if (scores.calming > 7.0) {
            // Check if it should really be calming dominant
            const hasCalmingMarkers = theanineLevel > 7.0 && caffeineLevel < 4.0;
            
            if (!hasCalmingMarkers) {
                scores.calming *= 0.75; // Apply reduction
            }
        }
        
        // Ensure focusing isn't too weak when it should be present
        if (scores.focusing < 5.0 && theanineLevel > 5 && caffeineLevel > 3) {
            scores.focusing = Math.max(scores.focusing, 5.0);
        }
        
        // Ensure proper balance between energizing and calming
        if (scores.energizing > 6.0 && scores.calming > 6.0) {
            // They shouldn't both be high - reduce both and boost harmonizing
            const reduction = 0.8;
            scores.energizing *= reduction;
            scores.calming *= reduction;
            scores.harmonizing = Math.max(scores.harmonizing, 6.0);
        }
        
        return scores;
    }
    
    /**
     * Public API method to apply effect interactions to a set of scores
     * 
     * @param {Object} tea - Tea object or effect scores
     * @param {Object} scores - Effect scores to modify
     * @returns {Object} - Modified scores after applying interactions
     */
    applyEffectInteractions(tea, scores) {
        // Make sure we're working with valid scores
        if (!scores || typeof scores !== 'object') {
            return {
                energizing: 0,
                calming: 0,
                focusing: 0,
                harmonizing: 0,
                grounding: 0,
                elevating: 0,
                comforting: 0,
                restorative: 0
            };
        }

        // Get consolidated scores, ensuring old effects are converted
        const consolidatedScores = this._extractEffectScores(scores);
        
        // Apply synergistic effects
        const modifiedScores = this.evaluateSynergisticEffects(consolidatedScores, tea);
        
        // Apply complementary and opposing effects
        this.applyEffectRules(modifiedScores);
        
        return modifiedScores;
    }
    
    /**
     * Apply complementary and opposing effect rules
     * @param {Object} scores - Effect scores 
     */
    applyEffectRules(scores) {
        const { complementary, opposing } = this.effectInteractionRules;
        const strengthFactor = this.config.get('interactionStrengthFactor', 0.8);
        
        // Apply complementary boosts
        Object.entries(complementary).forEach(([effect, complementaryEffects]) => {
            if (scores[effect] >= 4) { // Only apply if the effect is moderately strong
                complementaryEffects.forEach(complementaryEffect => {
                    if (scores[complementaryEffect] > 0) {
                        // Boost the complementary effect
                        const boost = scores[effect] * 0.15 * strengthFactor;
                        scores[complementaryEffect] += boost;
                    }
                });
            }
        });
        
        // Apply opposing reductions
        Object.entries(opposing).forEach(([effect, opposingEffects]) => {
            if (scores[effect] >= 6) { // Only apply for stronger effects
                opposingEffects.forEach(opposingEffect => {
                    if (scores[opposingEffect] > 0) {
                        // Reduce the opposing effect
                        const reduction = scores[effect] * 0.2 * strengthFactor;
                        scores[opposingEffect] = Math.max(0, scores[opposingEffect] - reduction);
                    }
                });
            }
        });
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
        // For interactions that don't have modifies property
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
    
    // Get all interactions for a specific effect or tea
    getEffectInteractions(tea) {
        // If tea is an object with effects, identify significant interactions
        if (tea && typeof tea === 'object' && !Array.isArray(tea)) {
            return this.identifySignificantInteractions(this._extractEffectScores(tea));
        }
        
        // Otherwise treat it as an effect ID
        const effectId = tea;
        
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
            .filter(effect => effect.score >= this.config.get('supportingEffectThreshold', 3.5))
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
                        name: interaction.name || `${effect1} + ${effect2}`,
                        description: interaction.description || 'These effects work together synergistically.',
                        strength: strength
                    });
                }
            }
        }
        
        return significantInteractions;
    }
} 