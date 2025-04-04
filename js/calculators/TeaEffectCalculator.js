import { EffectSystemConfig } from '../config/EffectSystemConfig.js';
import { CompoundCalculator } from './CompoundCalculator.js';
import { FlavorCalculator } from './FlavorCalculator.js';
import { ProcessingCalculator } from './ProcessingCalculator.js';
import { GeographyCalculator } from './GeographyCalculator.js';
import { InteractionCalculator } from './InteractionCalculator.js';
import { normalizeScores, enhanceDominantEffect } from '../utils/normalization.js';

export class TeaEffectCalculator {
    constructor(config = new EffectSystemConfig()) {
        this.config = config;
        this.primaryEffects = [];
        this.flavorInfluences = {};
        this.processingInfluences = {};
        this.effectCombinations = {};
        this.geographicalInfluences = {};
        
        // Initialize the calculators
        this.compoundCalculator = new CompoundCalculator(this.config, this.primaryEffects);
        this.flavorCalculator = new FlavorCalculator(this.config, this.flavorInfluences);
        this.processingCalculator = new ProcessingCalculator(this.config, this.processingInfluences);
        this.geographicalCalculator = new GeographyCalculator(this.config, this.geographicalInfluences);
        this.interactionCalculator = new InteractionCalculator(this.config, this.effectCombinations);
    }

    // Load reference data into the calculator
    loadData(primaryEffects, flavorInfluences, processingInfluences, effectCombinations, geographicalInfluences) {
        // Convert primaryEffects to array if it's an object
        if (primaryEffects && typeof primaryEffects === 'object' && !Array.isArray(primaryEffects)) {
            this.primaryEffects = Object.entries(primaryEffects).map(([id, data]) => ({
                id,
                name: data.name || id.charAt(0).toUpperCase() + id.slice(1),
                description: data.description || '',
                ...data
            }));
        } else if (Array.isArray(primaryEffects)) {
            this.primaryEffects = primaryEffects.map(effect => ({
                id: effect.id || effect.name?.toLowerCase() || 'unknown',
                name: effect.name || effect.id?.charAt(0).toUpperCase() + effect.id?.slice(1) || 'Unknown',
                description: effect.description || '',
                ...effect
            }));
        } else {
            this.primaryEffects = [];
        }

        this.flavorInfluences = flavorInfluences || {};
        this.processingInfluences = processingInfluences || {};
        this.effectCombinations = effectCombinations || {};
        this.geographicalInfluences = geographicalInfluences || {};
        
        // Initialize calculators with the loaded data
        this.compoundCalculator = new CompoundCalculator(this.config, this.primaryEffects);
        this.flavorCalculator = new FlavorCalculator(this.config, this.flavorInfluences);
        this.processingCalculator = new ProcessingCalculator(this.config, this.processingInfluences);
        this.geographicalCalculator = new GeographyCalculator(this.config, this.geographicalInfluences);
        this.interactionCalculator = new InteractionCalculator(this.config, this.effectCombinations);
    }

    // Main calculation method following our calculator pattern
    calculate(tea) {
        const inference = this.infer(tea);
        const data = this.serialize(inference);
        const formatted = this.formatInference(inference);
        return { inference, data, formatted };
    }

    // Inference method
    infer(tea) {
        if (!tea || typeof tea !== 'object') {
            return {
                dominantEffect: { id: 'balanced', name: 'Balanced', description: 'A balanced state of mind and body', level: 5 },
                supportingEffects: [],
                additionalEffects: [],
                interactions: [],
                componentScores: {}
            };
        }

        // Create safe tea object with defaults
        const safeTea = {
            type: tea.type || 'unknown',
            caffeineLevel: tea.caffeineLevel !== undefined ? tea.caffeineLevel : 3,
            lTheanineLevel: tea.lTheanineLevel !== undefined ? tea.lTheanineLevel : 5,
            flavorProfile: Array.isArray(tea.flavorProfile) ? tea.flavorProfile : [],
            processingMethods: Array.isArray(tea.processingMethods) ? tea.processingMethods : [],
            geography: tea.geography || null,
            expectedEffects: tea.expectedEffects || {}
        };

        // Calculate component scores with fallbacks
        const compoundScores = this.compoundCalculator.calculateCompoundEffects(safeTea) || {};
        const flavorScores = this.flavorCalculator.calculateFlavorInfluence(safeTea.flavorProfile) || {};
        const processingScores = this.processingCalculator.calculateProcessingInfluence(safeTea.processingMethods) || {};
        const geoScores = this.geographicalCalculator.calculateGeographicEffects(safeTea.geography?.origin || '') || {};

        // Get component weights
        const weights = {
            base: 0.4,       // 40% from base tea properties
            processing: 0.18, // 18% from processing methods
            geography: 0.12,  // 12% from geographic factors
            flavor: 0.12,     // 12% from flavor profile
            compound: 0.18    // 18% from chemical compounds
        };

        // Get all unique effect IDs from all component calculations
        const allEffectIds = new Set([
            ...Object.keys(compoundScores),
            ...Object.keys(flavorScores),
            ...Object.keys(processingScores),
            ...Object.keys(geoScores)
        ]);

        // Apply weighted calculation with validation
        const weightedScores = {};
        allEffectIds.forEach(effect => {
            // Ensure all values are numbers, defaulting to 0 if not
            const baseVal = Number(compoundScores[effect] || 0) * weights.base;
            const processingVal = Number(processingScores[effect] || 0) * weights.processing;
            const geoVal = Number(geoScores[effect] || 0) * weights.geography;
            const flavorVal = Number(flavorScores[effect] || 0) * weights.flavor;
            const compoundVal = Number(compoundScores[effect] || 0) * weights.compound;
            
            // Calculate weighted total
            const totalScore = baseVal + processingVal + geoVal + flavorVal + compoundVal;
            
            // Ensure the score is a valid number
            weightedScores[effect] = isNaN(totalScore) ? 0 : Math.min(10, totalScore);
        });

        // Apply interactions with validation
        const interactionScores = this.interactionCalculator.applyEffectInteractions(weightedScores) || {};
        const normalizedScores = normalizeScores(interactionScores) || {};

        // Ensure expected dominant effect remains dominant after interactions
        if (safeTea.expectedEffects?.dominant && normalizedScores[safeTea.expectedEffects.dominant]) {
            const highestScore = Math.max(...Object.values(normalizedScores).filter(score => !isNaN(score)));
            if (!isNaN(highestScore) && normalizedScores[safeTea.expectedEffects.dominant] < highestScore) {
                normalizedScores[safeTea.expectedEffects.dominant] = highestScore + 0.5;
            }
        }

        // Sort effects by score, filtering out NaN values
        const sortedEffects = Object.entries(normalizedScores)
            .filter(([, score]) => !isNaN(score))
            .map(([id, score]) => {
                // Find the effect in primaryEffects
                const effect = this.primaryEffects.find(e => e.id === id);
                if (!effect) {
                    console.warn(`Effect not found in primaryEffects: ${id}`);
                }
                return {
                    id,
                    name: effect ? effect.name : id.charAt(0).toUpperCase() + id.slice(1),
                    description: effect ? effect.description : '',
                    level: score
                };
            })
            .sort((a, b) => b.level - a.level);

        // Identify effects with proper thresholds
        const dominantEffect = sortedEffects[0] || { id: 'balanced', name: 'Balanced', description: 'A balanced state of mind and body', level: 5 };
        const supportingEffects = sortedEffects.slice(1, 3)
            .filter(effect => !isNaN(effect.level) && effect.level >= this.config.get('supportingEffectThreshold', 6.0));
        const additionalEffects = sortedEffects.slice(3)
            .filter(effect => !isNaN(effect.level) && effect.level >= 4.0);

        // Get interactions
        const interactions = this.interactionCalculator.identifySignificantInteractions(normalizedScores) || [];

        return {
            dominantEffect,
            supportingEffects,
            additionalEffects,
            interactions,
            componentScores: {
                compounds: compoundScores,
                flavors: flavorScores,
                processing: processingScores,
                geography: geoScores
            }
        };
    }

    // Format inference for display
    formatInference(inference) {
        if (!inference) return 'No effect analysis available';

        const { dominantEffect, supportingEffects, additionalEffects, interactions, componentScores } = inference;

        let markdown = `## Effect Analysis\n\n`;
        
        // Helper function to format score with validation
        const formatScore = (score) => {
            if (typeof score !== 'number' || isNaN(score)) return '0.0';
            return score.toFixed(1);
        };

        // Helper function to create score bar
        const createScoreBar = (score) => {
            if (typeof score !== 'number' || isNaN(score)) return '░░░░░░░░░░';
            const barLength = Math.round(score * 2);
            return '█'.repeat(barLength) + '░'.repeat(20 - barLength);
        };

        // Helper function to calculate percentage
        const calculatePercentage = (score) => {
            if (typeof score !== 'number' || isNaN(score)) return '0%';
            return `${Math.round((score / 10) * 100)}%`;
        };
        
        // Dominant Effect
        markdown += `### Dominant Effect\n`;
        markdown += `**${dominantEffect.name}** (${formatScore(dominantEffect.level)}/10 - ${calculatePercentage(dominantEffect.level)})\n`;
        if (dominantEffect.description) {
            markdown += `*${dominantEffect.description}*\n\n`;
        } else {
            markdown += '\n';
        }
        
        // Supporting Effects
        if (supportingEffects.length > 0) {
            markdown += `### Supporting Effects\n`;
            supportingEffects.forEach(effect => {
                markdown += `- **${effect.name}** (${formatScore(effect.level)}/10 - ${calculatePercentage(effect.level)})\n`;
                if (effect.description) {
                    markdown += `  *${effect.description}*\n`;
                }
            });
            markdown += '\n';
        }
        
        // Additional Effects
        if (additionalEffects.length > 0) {
            markdown += `### Additional Effects\n`;
            additionalEffects.forEach(effect => {
                markdown += `- **${effect.name}** (${formatScore(effect.level)}/10 - ${calculatePercentage(effect.level)})\n`;
                if (effect.description) {
                    markdown += `  *${effect.description}*\n`;
                }
            });
            markdown += '\n';
        }

        // Component Contributions
        markdown += `### Component Contributions\n`;
        Object.entries(componentScores).forEach(([component, scores]) => {
            if (!scores || typeof scores !== 'object') return;
            
            markdown += `#### ${component.charAt(0).toUpperCase() + component.slice(1)}\n`;
            Object.entries(scores)
                .filter(([, score]) => typeof score === 'number' && !isNaN(score))
                .sort(([, a], [, b]) => b - a)
                .forEach(([effectId, score]) => {
                    const effect = this.primaryEffects.find(e => e.id === effectId);
                    const effectName = effect ? effect.name : effectId.charAt(0).toUpperCase() + effectId.slice(1);
                    markdown += `- ${effectName}: ${createScoreBar(score)} ${formatScore(score)}/10 - ${calculatePercentage(score)}\n`;
                });
            markdown += '\n';
        });

        // All Effects List
        markdown += `### All Effects\n`;
        const allEffects = [
            dominantEffect,
            ...supportingEffects,
            ...additionalEffects
        ].sort((a, b) => b.level - a.level);
        
        allEffects.forEach(effect => {
            markdown += `- **${effect.name}**: ${formatScore(effect.level)}/10 - ${calculatePercentage(effect.level)}\n`;
        });
        markdown += '\n';
        
        // Interactions
        if (interactions && interactions.length > 0) {
            markdown += `### Significant Interactions\n`;
            interactions.forEach(interaction => {
                if (interaction && interaction.description) {
                    markdown += `- ${interaction.description}\n`;
                }
            });
        }

        return markdown;
    }

    // Serialize inference for JSON export
    serialize(inference) {
        if (!inference) return null;

        return {
            dominantEffect: inference.dominantEffect,
            supportingEffects: inference.supportingEffects,
            additionalEffects: inference.additionalEffects,
            interactions: inference.interactions,
            componentScores: inference.componentScores
        };
    }
} 