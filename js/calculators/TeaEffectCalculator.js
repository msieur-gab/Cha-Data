// TeaEffectCalculator.js
// Main class for analyzing tea effects, integrating all calculators

import { EffectSystemConfig } from '../config/EffectSystemConfig.js';
import { CompoundCalculator } from './CompoundCalculator.js';
import { FlavorCalculator } from './FlavorCalculator.js';
import { ProcessingCalculator } from './ProcessingCalculator.js';
import { GeographyCalculator } from './GeographyCalculator.js';
import { InteractionCalculator } from './InteractionCalculator.js';
import { TeaTypeCalculator } from './TeaTypeCalculator.js';
import { normalizeScores, enhanceDominantEffect } from '../utils/normalization.js';
import { effectMapping, teaTypeEffects } from '../props/EffectMapping.js';

export class TeaEffectCalculator {
    constructor(config = new EffectSystemConfig()) {
        this.config = config;
        this.teaTypeEffects = teaTypeEffects;
        this.primaryEffects = [];
        this.flavorInfluences = {};
        this.processingInfluences = {};
        this.effectCombinations = {};
        this.geographicalInfluences = {};
        
        // Initialize the calculators
        this.teaTypeCalculator = new TeaTypeCalculator();
        this.compoundCalculator = new CompoundCalculator(this.config, this.primaryEffects);
        this.flavorCalculator = new FlavorCalculator(this.config, this.flavorInfluences);
        this.processingCalculator = new ProcessingCalculator(this.config, this.processingInfluences);
        this.geographyCalculator = new GeographyCalculator(this.config);
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
        
        // Initialize calculators with the loaded data
        this.compoundCalculator = new CompoundCalculator(this.config, this.primaryEffects);
        this.flavorCalculator = new FlavorCalculator(this.config, this.flavorInfluences);
        this.processingCalculator = new ProcessingCalculator(this.config, this.processingInfluences);
        this.geographyCalculator = new GeographyCalculator(this.config);
        this.interactionCalculator = new InteractionCalculator(this.config, this.effectCombinations);
    }

    // Main calculate method following our calculator pattern
    calculate(tea) {
        const inference = this.infer(tea);
        return {
            inference: this.formatInference(inference),
            data: this.serialize(inference)
        };
    }

    // Core inference method
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
                    geography: {}
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

        // Extract scores from results
        const compoundScores = compoundResult.data?.compoundScores || {};
        const flavorScores = flavorResult.data?.flavorScores || {};
        const processingScores = processingResult.data?.processingScores || {};
        const geographyScores = geographyResult.data?.geographyScores || {};

        // Store component scores
        const componentScores = {
            base: baseScores,
            compounds: compoundScores,
            flavors: flavorScores,
            processing: processingScores,
            geography: geographyScores
        };

        // Calculate score progression
        const scoreProgression = this.calculateScoreProgression(
            baseScores, processingScores, geographyScores, flavorScores, compoundScores
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
    calculateScoreProgression(baseScores, processingScores, geographyScores, flavorScores, compoundScores) {
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

    // Format inference as markdown
    formatInference(inference) {
        if (!inference) {
            return "No inference data available";
        }

        const {
            dominantEffect,
            supportingEffects,
            additionalEffects,
            interactions,
            componentScores,
            scoreProgression,
            comparison
        } = inference;

        let markdown = `# Tea Effect Analysis\n\n`;

        // Format util for score bars
        const formatScoreBar = (score) => {
            const fullBar = '█';
            const emptyBar = '░';
            const fullBars = Math.floor(score);
            const emptyBars = 10 - fullBars;
            
            return fullBar.repeat(fullBars) + emptyBar.repeat(emptyBars);
        };

        // Expected Effects Section
        if (inference.originalExpectedEffects) {
            markdown += `## Expected Effects\n`;
            
            // Add expected dominant effect
            if (inference.originalExpectedEffects.dominant) {
                markdown += `- **Dominant**: ${inference.originalExpectedEffects.dominant}\n`;
            }
            
            // Add expected supporting effect
            if (inference.originalExpectedEffects.supporting) {
                const supportingText = Array.isArray(inference.originalExpectedEffects.supporting)
                    ? inference.originalExpectedEffects.supporting.join(', ')
                    : inference.originalExpectedEffects.supporting;
                markdown += `- **Supporting**: ${supportingText}\n`;
            }
            
            markdown += `\n`;
        }
        
        // Add comparison section if available
        if (comparison) {
            markdown += `## Calculation Comparison\n`;
            
            markdown += `### Dominant Effect\n`;
            markdown += `- Expected: **${comparison.dominant.expected}**\n`;
            markdown += `- Calculated: **${comparison.dominant.calculated}**\n`;
            markdown += `- Match: ${comparison.dominant.match ? '✓' : '✗'}\n\n`;
            
            markdown += `### Supporting Effect\n`;
            markdown += `- Expected: **${comparison.supporting.expected}**\n`;
            markdown += `- Calculated: **${comparison.supporting.calculated}**\n`;
            markdown += `- Match: ${comparison.supporting.match ? '✓' : '✗'}\n\n`;
            
            markdown += `Overall Match: ${comparison.matches ? '✓' : '✗'}\n\n`;
        }
        
        // Dominant Effect
        if (dominantEffect && dominantEffect.level !== undefined) {
            markdown += `### Dominant Effect\n`;
            markdown += `- ${dominantEffect.name}: ${formatScoreBar(dominantEffect.level)} ${dominantEffect.level.toFixed(1)}/10\n\n`;
        } else {
            markdown += `### Dominant Effect\n`;
            markdown += `- No dominant effect found\n\n`;
        }
        
        // Supporting Effects
        if (supportingEffects && supportingEffects.length > 0) {
            markdown += `### Supporting Effects\n`;
            supportingEffects.forEach(effect => {
                if (effect && effect.level !== undefined) {
                    markdown += `- ${effect.name}: ${formatScoreBar(effect.level)} ${effect.level.toFixed(1)}/10\n`;
                } else {
                    markdown += `- ${effect?.name || 'Unknown effect'}\n`;
                }
            });
            markdown += '\n';
        }
        
        // Additional Effects
        if (additionalEffects && additionalEffects.length > 0) {
            markdown += `### Additional Effects\n`;
            additionalEffects.forEach(effect => {
                if (effect && effect.level !== undefined) {
                    markdown += `- ${effect.name}: ${formatScoreBar(effect.level)} ${effect.level.toFixed(1)}/10\n`;
                } else {
                    markdown += `- ${effect?.name || 'Unknown effect'}\n`;
                }
            });
            markdown += '\n';
        }
        
        // Interactions
        if (interactions && interactions.length > 0) {
            markdown += `### Effect Interactions\n`;
            interactions.forEach(interaction => {
                if (interaction && interaction.magnitude !== undefined) {
                    markdown += `- ${interaction.description} (${interaction.magnitude > 0 ? '+' : ''}${interaction.magnitude.toFixed(1)})\n`;
                } else {
                    markdown += `- ${interaction?.description || 'Unknown interaction'}\n`;
                }
            });
            markdown += '\n';
        }

        // Only add component details if we have them
        if (scoreProgression && Object.keys(scoreProgression).length > 0 && inference.finalScores && Object.keys(inference.finalScores).length > 0) {
            // Add a detail table for the top effects
            const topEffects = [
                ...(supportingEffects || []), 
                ...(dominantEffect ? [dominantEffect] : [])
            ].map(effect => effect?.id)
             .filter(id => id); // filter out any undefined/null
            
            if (topEffects.length > 0) {
                markdown += `### Component Contribution Details\n\n`;
                markdown += `| Effect | Base | +Processing | +Geography | +Flavor | +Compounds | Final |\n`;
                markdown += `|--------|------|------------|------------|---------|------------|-------|\n`;
                
                topEffects.forEach(effectId => {
                    const effect = [
                        ...(supportingEffects || []), 
                        ...(dominantEffect ? [dominantEffect] : [])
                    ].find(e => e && e.id === effectId);
                    if (!effect) return;
                    
                    const baseScore = (scoreProgression.withBaseScores || {})[effectId]?.toFixed(1) || "0.0";
                    const withProcessing = (scoreProgression.withProcessingScores || {})[effectId]?.toFixed(1) || "0.0";
                    const withGeo = (scoreProgression.withGeographyScores || {})[effectId]?.toFixed(1) || "0.0";
                    const withFlavor = (scoreProgression.withFlavorScores || {})[effectId]?.toFixed(1) || "0.0";
                    const withCompound = (scoreProgression.withCompoundScores || {})[effectId]?.toFixed(1) || "0.0";
                    const final = inference.finalScores[effectId]?.toFixed(1) || "0.0";
                    
                    // Check if this is a dominant or supporting effect
                    const isDominant = dominantEffect && dominantEffect.id === effectId;
                    const isSupporting = supportingEffects && Array.isArray(supportingEffects) && 
                                          supportingEffects.some(e => e && e.id === effectId);
                    const symbol = isDominant ? " ★" : (isSupporting ? " ☆" : "");
                    
                    markdown += `| **${effect.name}**${symbol} | ${baseScore} | ${withProcessing} | ${withGeo} | ${withFlavor} | ${withCompound} | ${final} |\n`;
                });
                
                markdown += `\n### Legend\n`;
                markdown += `- ★ Dominant Effect\n`;
                markdown += `- ☆ Supporting Effect\n\n`;
            }
        }
        
        // Raw Component Scores Table
        if (componentScores) {
            markdown += `### Raw Component Scores\n\n`;
            markdown += `| Effect | Base | Compounds | Flavors | Processing | Geography |\n`;
            markdown += `|--------|------|-----------|---------|------------|----------|\n`;
            
            // Find the top 10 effects by final score
            const topEffects = Object.entries(inference.finalScores || {})
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([effectId]) => effectId);
            
            topEffects.forEach(effectId => {
                const baseScore = (componentScores.base || {})[effectId]?.toFixed(1) || "0.0";
                const compoundScore = (componentScores.compounds || {})[effectId]?.toFixed(1) || "0.0";
                const flavorScore = (componentScores.flavors || {})[effectId]?.toFixed(1) || "0.0";
                const processingScore = (componentScores.processing || {})[effectId]?.toFixed(1) || "0.0";
                const geoScore = (componentScores.geography || {})[effectId]?.toFixed(1) || "0.0";
                
                // Find the effect name
                const effectObj = [
                    ...(supportingEffects || []), 
                    ...(additionalEffects || []), 
                    ...(dominantEffect ? [dominantEffect] : [])
                ].find(e => e && e.id === effectId);
                const effectName = effectObj ? effectObj.name : effectId;
                
                markdown += `| ${effectName} | ${baseScore} | ${compoundScore} | ${flavorScore} | ${processingScore} | ${geoScore} |\n`;
            });
            
            markdown += `\n`;
        }
        
        return markdown;
    }

    // Serialize inference to structured data
    serialize(inference) {
        if (!inference) return null;

        return {
            dominantEffect: inference.dominantEffect,
            supportingEffects: inference.supportingEffects,
            additionalEffects: inference.additionalEffects,
            interactions: inference.interactions,
            componentScores: inference.componentScores,
            scoreProgression: inference.scoreProgression,
            finalScores: inference.finalScores,
            originalExpectedEffects: inference.originalExpectedEffects
        };
    }

    // Calculate baseline effect scores starting with tea type
    calculateBaseScores(tea) {
        if (!tea) {
            return {};
        }
        
        // Use TeaTypeCalculator to get base scores from tea type
        try {
            const typeScores = this.teaTypeCalculator.calculateTeaTypeScores(tea);
            return typeScores;
        } catch (error) {
            console.warn(`Error calculating tea type scores: ${error.message}`);
            
            // Fallback to empty scores if type calculation fails
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
    }

    // Calculate final scores with clear weighting from all components
    calculateFinalScores(tea) {
        if (!tea) {
            return {};
        }
        
        // Calculate scores from different aspects
        const baseScores = this.calculateBaseScores(tea);
        const compoundResult = this.compoundCalculator.calculate(tea);
        const flavorResult = this.flavorCalculator.calculate(tea);
        const processingResult = this.processingCalculator.calculate(tea);
        const geographyResult = this.geographyCalculator.calculate(tea);
        
        // Extract scores from results
        const compoundScores = compoundResult.data?.compoundScores || {};
        const flavorScores = flavorResult.data?.flavorScores || {};
        const processingScores = processingResult.data?.processingScores || {};
        const geographyScores = geographyResult.data?.geographyScores || {};
        
        // Combine scores with weights
        const finalScores = {};
        const weights = this.config.get('componentWeights');
        
        // Start with base scores
        Object.entries(baseScores).forEach(([effect, score]) => {
            finalScores[effect] = score * weights.teaType;
        });
        
        // Add compound scores
        Object.entries(compoundScores).forEach(([effect, score]) => {
            finalScores[effect] = (finalScores[effect] || 0) + score * weights.compounds;
        });
        
        // Add processing scores
        Object.entries(processingScores).forEach(([effect, score]) => {
            finalScores[effect] = (finalScores[effect] || 0) + score * weights.processing;
        });
        
        // Add geography scores
        Object.entries(geographyScores).forEach(([effect, score]) => {
            finalScores[effect] = (finalScores[effect] || 0) + score * weights.geography;
        });
        
        // Add flavor scores
        Object.entries(flavorScores).forEach(([effect, score]) => {
            finalScores[effect] = (finalScores[effect] || 0) + score * weights.flavors;
        });
        
        // Normalize final scores
        Object.keys(finalScores).forEach(effect => {
            finalScores[effect] = Math.min(10, Math.max(0, finalScores[effect]));
        });
        
        return finalScores;
    }

    // Add a function to compare calculated results with expected effects
    compareWithExpectedEffects(calculatedEffects, expectedEffects) {
        if (!expectedEffects) return null;
        
        // Extract dominant and supporting from calculated effects
        const sortedCalculatedEffects = Object.entries(calculatedEffects)
            .sort(([, a], [, b]) => b - a);
        
        const calculatedDominant = sortedCalculatedEffects[0]?.[0] || null;
        const calculatedSupporting = sortedCalculatedEffects[1]?.[0] || null;
        
        const comparison = {
            matches: false,
            dominant: {
                expected: expectedEffects.dominant,
                calculated: calculatedDominant,
                match: false
            },
            supporting: {
                expected: expectedEffects.supporting,
                calculated: calculatedSupporting,
                match: false
            }
        };
        
        // Check for matches
        comparison.dominant.match = expectedEffects.dominant === calculatedDominant;
        comparison.supporting.match = expectedEffects.supporting === calculatedSupporting;
        comparison.matches = comparison.dominant.match && comparison.supporting.match;
        
        return comparison;
    }

    calculateTeaTypeScores(tea) {
        const teaTypeScores = {};
        
        // Get tea type effects
        const teaType = tea.type.toLowerCase();
        const mappedType = teaType === 'puerh' ? 'puerh-shou' : teaType;
        const typeEffects = teaTypeEffects[mappedType]?.effects || teaTypeEffects.green.effects;
        
        // Apply tea type effects
        Object.entries(typeEffects).forEach(([effect, score]) => {
            teaTypeScores[effect] = score;
        });
        
        return teaTypeScores;
    }

    calculate(tea) {
        // Calculate scores from each component
        const teaTypeScores = this.calculateTeaTypeScores(tea);
        const compoundScores = this.compoundCalculator.calculateCompoundScores(tea);
        const flavorScores = this.flavorCalculator.calculateFlavorScores(tea);
        const processingScores = this.processingCalculator.calculateProcessingScores(tea);
        const geographyScores = this.geographyCalculator.calculateGeographyScores(tea);
        
        // Combine scores with weights
        const componentScores = {
            teaType: teaTypeScores,
            compounds: compoundScores,
            processing: processingScores,
            geography: geographyScores,
            flavors: flavorScores
        };
        
        // Track score progression
        const scoreProgression = {
            withTeaTypeScores: { ...teaTypeScores },
            withCompoundScores: {},
            withProcessingScores: {},
            withGeographyScores: {},
            withFlavorScores: {},
            finalScores: {}
        };
        
        // Apply weights and combine scores
        let currentScores = { ...teaTypeScores };
        
        // Add compound scores
        Object.entries(compoundScores).forEach(([effect, score]) => {
            currentScores[effect] = (currentScores[effect] || 0) + score * this.config.get('componentWeights').compounds;
        });
        scoreProgression.withCompoundScores = { ...currentScores };
        
        // Add processing scores
        Object.entries(processingScores).forEach(([effect, score]) => {
            currentScores[effect] = (currentScores[effect] || 0) + score * this.config.get('componentWeights').processing;
        });
        scoreProgression.withProcessingScores = { ...currentScores };
        
        // Add geography scores
        Object.entries(geographyScores).forEach(([effect, score]) => {
            currentScores[effect] = (currentScores[effect] || 0) + score * this.config.get('componentWeights').geography;
        });
        scoreProgression.withGeographyScores = { ...currentScores };
        
        // Add flavor scores
        Object.entries(flavorScores).forEach(([effect, score]) => {
            currentScores[effect] = (currentScores[effect] || 0) + score * this.config.get('componentWeights').flavor;
        });
        scoreProgression.withFlavorScores = { ...currentScores };
        
        // Apply interactions
        const finalScores = this.interactionCalculator.applyEffectInteractions(tea, currentScores);
        scoreProgression.finalScores = { ...finalScores };
        
        return {
            componentScores,
            scoreProgression,
            finalScores
        };
    }
}

export default TeaEffectCalculator;