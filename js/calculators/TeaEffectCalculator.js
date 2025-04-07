// TeaEffectCalculator.js
// Main class for analyzing tea effects, integrating all calculators

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

        // Calculate component scores
        const compoundScores = this.compoundCalculator.calculateCompoundEffects(safeTea) || {};
        const flavorScores = this.flavorCalculator.calculateFlavorInfluence(safeTea.flavorProfile) || {};
        const processingScores = this.processingCalculator.calculateProcessingInfluence(safeTea) || {};
        
        // Geography scores - handle both direct calculation and pre-loaded influences
        let geoScores = {};
        if (safeTea.geography && safeTea.geography.origin) {
            geoScores = this.geographyCalculator.calculateGeographicEffects(safeTea.geography.origin) || {};
        } else if (Object.keys(this.geographicalInfluences).length > 0) {
            geoScores = this.geographicalInfluences;
        }

        // Generate base scores from L-Theanine to Caffeine ratio, NOT from expectedEffects
        const baseScores = {};
        
        // Add L-Theanine to Caffeine ratio effects to base scores
        const ratio = safeTea.lTheanineLevel / safeTea.caffeineLevel;
        
        if (ratio > 1.5) {
            // L-Theanine dominant effects
            baseScores["peaceful"] = (baseScores["peaceful"] || 0) + Math.min(10, safeTea.lTheanineLevel * 0.8);
            baseScores["soothing"] = (baseScores["soothing"] || 0) + Math.min(10, safeTea.lTheanineLevel * 0.7);
        }
        
        if (ratio < 1.0) {
            // Caffeine dominant effects
            baseScores["revitalizing"] = (baseScores["revitalizing"] || 0) + Math.min(10, safeTea.caffeineLevel * 0.9);
            baseScores["awakening"] = (baseScores["awakening"] || 0) + Math.min(10, safeTea.caffeineLevel * 0.7);
        }

        // Get component weights
        const weights = {
            base: this.config.get('componentWeights.base') || 0.35,
            compounds: this.config.get('componentWeights.compounds') || 0.18,
            flavors: this.config.get('componentWeights.flavors') || 0.12,
            processing: this.config.get('componentWeights.processing') || 0.20,
            geography: this.config.get('componentWeights.geography') || 0.15
        };

        // Get all unique effect IDs from all component calculations
        const allEffectIds = new Set([
            ...Object.keys(baseScores),
            ...Object.keys(compoundScores),
            ...Object.keys(flavorScores),
            ...Object.keys(processingScores),
            ...Object.keys(geoScores)
        ]);

        // Track the build-up of scores for debugging
        const withBaseScores = {};
        const withProcessingScores = {};
        const withGeographyScores = {};
        const withFlavorScores = {};
        const withCompoundScores = {};
        
        // Apply weighted calculation to combine component scores
        const combinedScores = {};
        
        // Calculate combined score for each effect
        allEffectIds.forEach(effect => {
            // Calculate each component's contribution
            const baseContribution = (baseScores[effect] || 0) * weights.base;
            withBaseScores[effect] = baseContribution;
            
            const processingContribution = (processingScores[effect] || 0) * weights.processing;
            withProcessingScores[effect] = withBaseScores[effect] + processingContribution;
            
            const geoContribution = (geoScores[effect] || 0) * weights.geography;
            withGeographyScores[effect] = withProcessingScores[effect] + geoContribution;
            
            const flavorContribution = (flavorScores[effect] || 0) * weights.flavors;
            withFlavorScores[effect] = withGeographyScores[effect] + flavorContribution;
            
            const compoundContribution = (compoundScores[effect] || 0) * weights.compounds;
            withCompoundScores[effect] = withFlavorScores[effect] + compoundContribution;
            
            // Combined score is the sum of all weighted contributions
            combinedScores[effect] = withCompoundScores[effect];
        });
        
        // Apply interactions
        const interactionScores = this.interactionCalculator.applyEffectInteractions(combinedScores);
        
        // Normalize final scores
        const normalizedScores = normalizeScores(interactionScores);
        
        // Enhance dominant effect
        const finalScores = enhanceDominantEffect(normalizedScores);
        
        // Sort effects by score
        const sortedEffects = Object.entries(finalScores)
            .map(([id, score]) => {
                // Find the effect in primaryEffects
                const effect = this.primaryEffects.find(e => e.id === id);
                return {
                    id,
                    name: effect ? effect.name : id.charAt(0).toUpperCase() + id.slice(1),
                    description: effect ? effect.description : '',
                    level: score
                };
            })
            .sort((a, b) => b.level - a.level);

        // Identify effects
        const dominantEffect = sortedEffects[0] || { id: 'balanced', name: 'Balanced', description: 'A balanced state of mind and body', level: 5 };
        const supportingEffects = sortedEffects.slice(1, 3)
            .filter(effect => effect.level >= this.config.get('supportingEffectThreshold', 3.5));
        const additionalEffects = sortedEffects.slice(3)
            .filter(effect => effect.level >= 4.0);

        // Get interactions
        const interactions = this.interactionCalculator.identifySignificantInteractions(finalScores);

        return {
            dominantEffect,
            supportingEffects,
            additionalEffects,
            interactions,
            componentScores: {
                base: baseScores,
                compounds: compoundScores,
                flavors: flavorScores,
                processing: processingScores,
                geography: geoScores
            },
            buildUpScores: {
                withBaseScores,
                withProcessingScores,
                withGeographyScores,
                withFlavorScores,
                withCompoundScores
            },
            finalScores,
            originalExpectedEffects: safeTea.expectedEffects // Keep original expected effects for comparison only
        };
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
            buildUpScores,
            finalScores,
            originalExpectedEffects
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
        if (originalExpectedEffects) {
            markdown += `## Expected Effects\n`;
            
            if (originalExpectedEffects.dominant) {
                markdown += `- **Dominant**: ${originalExpectedEffects.dominant}\n`;
            }
            
            if (originalExpectedEffects.supporting) {
                const supportingText = Array.isArray(originalExpectedEffects.supporting)
                    ? originalExpectedEffects.supporting.join(', ')
                    : originalExpectedEffects.supporting;
                markdown += `- **Supporting**: ${supportingText}\n`;
            }
            
            markdown += '\n';
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
        if (buildUpScores && Object.keys(buildUpScores).length > 0 && finalScores && Object.keys(finalScores).length > 0) {
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
                    
                    const baseScore = (buildUpScores.withBaseScores || {})[effectId]?.toFixed(1) || "0.0";
                    const withProcessing = (buildUpScores.withProcessingScores || {})[effectId]?.toFixed(1) || "0.0";
                    const withGeo = (buildUpScores.withGeographyScores || {})[effectId]?.toFixed(1) || "0.0";
                    const withFlavor = (buildUpScores.withFlavorScores || {})[effectId]?.toFixed(1) || "0.0";
                    const withCompound = (buildUpScores.withCompoundScores || {})[effectId]?.toFixed(1) || "0.0";
                    const final = finalScores[effectId]?.toFixed(1) || "0.0";
                    
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
            const topEffects = Object.entries(finalScores || {})
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
            buildUpScores: inference.buildUpScores,
            finalScores: inference.finalScores,
            originalExpectedEffects: inference.originalExpectedEffects
        };
    }
}

export default TeaEffectCalculator;