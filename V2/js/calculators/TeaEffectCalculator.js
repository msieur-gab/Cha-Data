// TeaEffectCalculator.js
// Main class for analyzing tea effects, integrating all calculators

import { BaseCalculator } from './BaseCalculator.js';
import { EffectSystemConfig } from '../config/EffectSystemConfig.js';
import { CompoundCalculator } from './CompoundCalculator.js';
import { FlavorCalculator } from './FlavorCalculator.js';
import { ProcessingCalculator } from './ProcessingCalculator.js';
import { GeographyCalculator } from './GeographyCalculator.js';
import { InteractionCalculator } from './InteractionCalculator.js';
import { TeaTypeCalculator } from './TeaTypeCalculator.js';
import { SeasonCalculator } from './SeasonCalculator.js';
import { normalizeScores, enhanceDominantEffect } from '../utils/normalization.js';
import { effectMapping, teaTypeEffects } from '../props/EffectMapping.js';

export class TeaEffectCalculator extends BaseCalculator {
    constructor(config = new EffectSystemConfig()) {
        super(config);
        this.teaTypeEffects = teaTypeEffects;
        this.primaryEffects = [];
        this.flavorInfluences = {};
        this.processingInfluences = {};
        this.effectCombinations = {};
        this.geographicalInfluences = {};
        
        // Initialize the calculators
        this.teaTypeCalculator = new TeaTypeCalculator(this.config);
        this.compoundCalculator = new CompoundCalculator(this.config);
        this.flavorCalculator = new FlavorCalculator(this.config);
        this.processingCalculator = new ProcessingCalculator(this.config);
        this.geographyCalculator = new GeographyCalculator(this.config);
        this.seasonCalculator = new SeasonCalculator(this.config);
        this.interactionCalculator = new InteractionCalculator(this.config);
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
        
        // Handle different formats of geographical influences
        if (geographicalInfluences) {
            if (typeof geographicalInfluences === 'object') {
                // Check if it's already an effect score map
                if (Object.values(geographicalInfluences).some(v => typeof v === 'number')) {
                    this.geographicalInfluences = geographicalInfluences;
                } else if (geographicalInfluences.effects && typeof geographicalInfluences.effects === 'object') {
                    // Extract the effects property
                    this.geographicalInfluences = geographicalInfluences.effects;
                } else {
                    this.geographicalInfluences = {};
                }
            } else {
                this.geographicalInfluences = {};
            }
        } else {
            this.geographicalInfluences = {};
        }
    }

    // Override infer method from BaseCalculator
    infer(tea) {
        if (!tea) {
            return {
                dominantEffect: { id: 'none', level: 0 },
                supportingEffects: [],
                additionalEffects: [],
                interactions: [],
                componentScores: {
                    base: {},
                    compounds: {},
                    flavors: {},
                    processing: {},
                    geography: {},
                    seasonal: {}
                },
                scoreProgression: {},
                comparison: null
            };
        }

        // Calculate scores from different aspects
        const baseScores = this.calculateBaseScores(tea);
        const compoundResult = this.compoundCalculator.calculate(tea);
        const flavorResult = this.flavorCalculator.calculate(tea);
        const processingResult = this.processingCalculator.calculate(tea);
        const geographyResult = this.geographyCalculator.calculate(tea);
        const seasonalResult = this.seasonCalculator.calculate(tea);

        // Extract scores from results
        const compoundScores = compoundResult.data?.compoundScores || {};
        const flavorScores = flavorResult.data?.flavorScores || {};
        const processingScores = processingResult.data?.processingScores || {};
        const geographyScores = geographyResult.data?.geographyScores || {};
        const seasonalScores = seasonalResult.data?.seasonalScores || {};

        // Store component scores
        const componentScores = {
            base: baseScores,
            compounds: compoundScores,
            flavors: flavorScores,
            processing: processingScores,
            geography: geographyScores,
            seasonal: seasonalScores
        };

        // Calculate score progression
        const scoreProgression = this.calculateScoreProgression(
            baseScores, processingScores, geographyScores, flavorScores, compoundScores, seasonalScores
        );

        // Calculate final scores with weights
        const finalScores = this.calculateFinalScores(tea);
        
        // Apply interactions after calculating all component scores
        const interactionScores = this.interactionCalculator.applyEffectInteractions(tea, finalScores);
        
        // Normalize final scores
        Object.keys(interactionScores).forEach(effect => {
            interactionScores[effect] = Math.min(10, Math.max(0, interactionScores[effect]));
        });

        // Get top effects
        const sortedEffects = Object.entries(interactionScores)
            .sort(([, a], [, b]) => b - a)
            .map(([id, level]) => {
                // Find the effect in primaryEffects
                const effect = this.primaryEffects.find(e => e.id === id) || 
                             this.primaryEffects.find(e => e.name.toLowerCase() === id.toLowerCase());
                
                return {
                    id: effect?.id || id,
                    name: effect?.name || id.charAt(0).toUpperCase() + id.slice(1),
                    description: effect?.description || '',
                    level: level
                };
            });

        const dominantEffect = sortedEffects[0] || {
            id: 'balanced',
            name: 'Balanced',
            description: 'A balanced state of mind and body',
            level: 5
        };

        const supportingEffects = sortedEffects
            .slice(1, 3)
            .filter(effect => effect.level >= this.config.get('supportingEffectThreshold', 3.5));

        const additionalEffects = sortedEffects
            .slice(3)
            .filter(effect => effect.level >= 4.0);
        
        // Compare with expected effects if available
        const comparison = tea.expectedEffects ? 
            this.compareWithExpectedEffects(interactionScores, tea.expectedEffects) : null;

        return {
            dominantEffect,
            supportingEffects,
            additionalEffects,
            interactions: this.interactionCalculator.getEffectInteractions(tea),
            componentScores,
            scoreProgression,
            finalScores: interactionScores,
            comparison,
            originalExpectedEffects: tea.expectedEffects // Keep for reference
        };
    }

    // Helper to calculate score progression
    calculateScoreProgression(baseScores, processingScores, geographyScores, flavorScores, compoundScores, seasonalScores = {}) {
        const weights = this.config.get('componentWeights');
        
        // Initialize with base scores
        let currentScores = {};
        Object.entries(baseScores).forEach(([effect, score]) => {
            currentScores[effect] = score * weights.teaType;
        });
        const scoreProgression = {
            withBaseScores: { ...currentScores }
        };
        
        // Add processing scores
        Object.entries(processingScores).forEach(([effect, score]) => {
            currentScores[effect] = (currentScores[effect] || 0) + score * weights.processing;
        });
        scoreProgression.withProcessingScores = { ...currentScores };

        // Add geography scores
        Object.entries(geographyScores).forEach(([effect, score]) => {
            currentScores[effect] = (currentScores[effect] || 0) + score * weights.geography;
        });
        scoreProgression.withGeographyScores = { ...currentScores };

        // Add seasonal scores
        Object.entries(seasonalScores).forEach(([effect, score]) => {
            currentScores[effect] = (currentScores[effect] || 0) + score * (weights.seasonal || 0.1);
        });
        scoreProgression.withSeasonalScores = { ...currentScores };

        // Add flavor scores
        Object.entries(flavorScores).forEach(([effect, score]) => {
            currentScores[effect] = (currentScores[effect] || 0) + score * weights.flavors;
        });
        scoreProgression.withFlavorScores = { ...currentScores };

        // Add compound scores
        Object.entries(compoundScores).forEach(([effect, score]) => {
            currentScores[effect] = (currentScores[effect] || 0) + score * weights.compounds;
        });
        scoreProgression.withCompoundScores = { ...currentScores };
        
        return scoreProgression;
    }

    // Override formatInference from BaseCalculator
    formatInference(inference) {
        if (!inference) {
            return "No inference data available";
        }

        const {
            dominantEffect,
            supportingEffects,
            additionalEffects,
            interactions
        } = inference;

        // Format score as bar chart
        const formatScoreBar = (score) => {
            const fullBlocks = Math.floor(score);
            const emptyBlocks = 10 - fullBlocks;
            return `[${'■'.repeat(fullBlocks)}${'.'.repeat(emptyBlocks)}] ${score.toFixed(1)}/10`;
        };

        let output = `## Tea Effect Analysis\n\n`;
        
        // Dominant effect
        if (dominantEffect) {
            output += `### Dominant Effect: ${dominantEffect.name}\n`;
            output += `${formatScoreBar(dominantEffect.level)}\n\n`;
            output += `${dominantEffect.description || 'No description available'}\n\n`;
        }
        
        // Supporting effects
        if (supportingEffects && supportingEffects.length > 0) {
            output += `### Supporting Effects\n\n`;
            for (const effect of supportingEffects) {
                output += `#### ${effect.name}\n`;
                output += `${formatScoreBar(effect.level)}\n\n`;
                output += `${effect.description || 'No description available'}\n\n`;
            }
        }
        
        // Additional effects
        if (additionalEffects && additionalEffects.length > 0) {
            output += `### Additional Effects\n\n`;
            for (const effect of additionalEffects) {
                output += `**${effect.name}**: ${effect.level.toFixed(1)}/10 - ${effect.description || 'No description available'}\n\n`;
            }
        }
        
        // Key interactions
        if (interactions && interactions.length > 0) {
            output += `### Key Effect Interactions\n\n`;
            for (const interaction of interactions) {
                output += `- **${interaction.type}**: ${interaction.description}\n`;
            }
        }
        
        return output;
    }

    // Override serialize from BaseCalculator
    serialize(inference) {
        return {
            dominantEffect: inference.dominantEffect,
            supportingEffects: inference.supportingEffects,
            additionalEffects: inference.additionalEffects,
            interactions: inference.interactions,
            componentScores: inference.componentScores,
            scoreProgression: inference.scoreProgression,
            finalScores: inference.finalScores,
            comparison: inference.comparison
        };
    }

    // Calculate base scores from tea type
    calculateBaseScores(tea) {
        let baseScores = {};
        
        // Get base effects from tea type
        if (tea.type && this.teaTypeEffects[tea.type]) {
            const teaTypeData = this.teaTypeEffects[tea.type];
            baseScores = { ...teaTypeData.effects };
        } else if (tea.type) {
            // If tea type is not recognized, use a default balanced profile
            baseScores = {
                "energizing": 5,
                "focusing": 5,
                "calming": 5,
                "harmonizing": 5
            };
        }
        
        return baseScores;
    }

    // Calculate final scores with component weighting
    calculateFinalScores(tea) {
        const weights = this.config.get('componentWeights');
        
        // Get all component scores
        const baseScores = this.calculateBaseScores(tea);
        const compoundResult = this.compoundCalculator.calculate(tea);
        const flavorResult = this.flavorCalculator.calculate(tea);
        const processingResult = this.processingCalculator.calculate(tea);
        const geographyResult = this.geographyCalculator.calculate(tea);
        const seasonalResult = this.seasonCalculator.calculate(tea);

        // Extract scores from results
        const compoundScores = compoundResult.data?.compoundScores || {};
        const flavorScores = flavorResult.data?.flavorScores || {};
        const processingScores = processingResult.data?.processingScores || {};
        const geographyScores = geographyResult.data?.geographyScores || {};
        const seasonalScores = seasonalResult.data?.seasonalScores || {};
        
        // Initialize finalScores with base scores
        let finalScores = {};
        Object.entries(baseScores).forEach(([effect, score]) => {
            finalScores[effect] = score * weights.teaType;
        });
        
        // Add compound scores
        Object.entries(compoundScores).forEach(([effect, score]) => {
            finalScores[effect] = (finalScores[effect] || 0) + score * weights.compounds;
        });
        
        // Add flavor scores
        Object.entries(flavorScores).forEach(([effect, score]) => {
            finalScores[effect] = (finalScores[effect] || 0) + score * weights.flavors;
        });
        
        // Add processing scores
        Object.entries(processingScores).forEach(([effect, score]) => {
            finalScores[effect] = (finalScores[effect] || 0) + score * weights.processing;
        });
        
        // Add geography scores
        Object.entries(geographyScores).forEach(([effect, score]) => {
            finalScores[effect] = (finalScores[effect] || 0) + score * weights.geography;
        });
        
        // Add seasonal scores
        Object.entries(seasonalScores).forEach(([effect, score]) => {
            finalScores[effect] = (finalScores[effect] || 0) + score * (weights.seasonal || 0.1);
        });
        
        // Normalize scores
        if (this.config.get('normalizeScores', true)) {
            finalScores = normalizeScores(finalScores);
            
            // Enhance dominant effect
            const dominantEffect = Object.entries(finalScores)
                .sort(([, a], [, b]) => b - a)[0];
            
            if (dominantEffect && dominantEffect[1] >= this.config.get('dominantEffectThreshold', 7.0)) {
                finalScores = enhanceDominantEffect(finalScores, dominantEffect[0]);
            }
        }
        
        return finalScores;
    }

    // Compare calculated effects with expected effects
    compareWithExpectedEffects(calculatedEffects, expectedEffects) {
        if (!expectedEffects || !calculatedEffects) {
            return null;
        }
        
        const matches = [];
        const mismatches = [];
        
        // Process expected effects
        Object.entries(expectedEffects).forEach(([effect, expectedValue]) => {
            const calculatedValue = calculatedEffects[effect] || 0;
            
            // Check if calculated value is within 2 points of expected
            const isMatch = Math.abs(calculatedValue - expectedValue) <= 2;
            
            if (isMatch) {
                matches.push({
                    effect,
                    expected: expectedValue,
                    calculated: calculatedValue
                });
            } else {
                mismatches.push({
                    effect,
                    expected: expectedValue,
                    calculated: calculatedValue,
                    difference: calculatedValue - expectedValue
                });
            }
        });
        
        return {
            matches,
            mismatches,
            matchPercentage: matches.length / (matches.length + mismatches.length) * 100
        };
    }
} 