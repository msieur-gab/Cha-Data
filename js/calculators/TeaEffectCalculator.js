// TeaEffectCalculator.js
// Main class for analyzing tea effects, integrating all calculators

import { EffectSystemConfig } from '../config/EffectSystemConfig.js';
import { CompoundCalculator } from './CompoundCalculator.js';
import { FlavorCalculator } from './FlavorCalculator.js';
import { ProcessingCalculator } from './ProcessingCalculator.js';
import { GeographyCalculator } from './GeographyCalculator.js';
import { InteractionCalculator } from './InteractionCalculator.js';
import { PrimaryEffectCalculator } from './PrimaryEffectCalculator.js';
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
        this.primaryEffectCalculator = new PrimaryEffectCalculator(this.config);
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

        // NEW STEP: Use PrimaryEffectCalculator to derive dynamic baseline effects
        const baselineEffects = this.primaryEffectCalculator.deriveBaselineEffects(safeTea);
        
        // Get TCM profile for reference/debug
        const tcmProfile = this.primaryEffectCalculator.getTcmProfile(safeTea);

        // Calculate component scores
        const compoundScores = this.compoundCalculator.calculateCompoundEffects(safeTea) || {};
        const flavorScores = this.flavorCalculator.calculateFlavorInfluence(safeTea.flavorProfile) || {};
        const processingScores = this.processingCalculator.calculateProcessingInfluence(safeTea.processingMethods) || {};
        
        // Geography scores - handle both direct calculation and pre-loaded influences
        let geoScores = {};
        if (safeTea.geography && safeTea.geography.origin) {
            geoScores = this.geographyCalculator.calculateGeographicEffects(safeTea.geography.origin) || {};
        } else if (Object.keys(this.geographicalInfluences).length > 0) {
            geoScores = this.geographicalInfluences;
        }

        // Generate base scores - using calculated baseline effects instead of expected effects
        const baseScores = {};
        
        // Add baseline effects to base scores
        if (baselineEffects.dominant) {
            baseScores[baselineEffects.dominant] = 9.5;
        }
        if (baselineEffects.supporting) {
            baseScores[baselineEffects.supporting] = 7.5;
        }
        
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
            base: this.config.get('componentWeights.base') || 0.4,
            compounds: this.config.get('componentWeights.compounds') || 0.18,
            flavors: this.config.get('componentWeights.flavors') || 0.12,
            processing: this.config.get('componentWeights.processing') || 0.18,
            geography: this.config.get('componentWeights.geography') || 0.12
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
        
        // Ensure baseline dominant effect remains dominant after interactions
        // Use a smaller boost (0.3 instead of 0.5) to allow more natural emergence of effects
        if (baselineEffects.dominant && finalScores[baselineEffects.dominant]) {
            // Find the highest score
            const highestScore = Math.max(...Object.values(finalScores));
            
            // Make sure the baseline dominant effect is at least as high as any other effect
            if (finalScores[baselineEffects.dominant] < highestScore) {
                finalScores[baselineEffects.dominant] = highestScore + 0.3;
            }
        }

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
            baselineEffects, // Include calculated baseline effects
            tcmProfile,      // Include TCM profile for reference
            originalExpectedEffects: safeTea.expectedEffects // Keep original expected effects for comparison
        };
    }

    // Format inference as markdown
    formatInference(inference) {
        if (!inference) return "No inference available";

        const { 
            dominantEffect, 
            supportingEffects, 
            additionalEffects, 
            interactions,
            componentScores,
            buildUpScores,
            baselineEffects,
            tcmProfile,
            originalExpectedEffects,
            finalScores
        } = inference;

        // Format as markdown for easy display
        let markdown = "## Tea Effect Analysis\n\n";

        // Format score bars for visual representation
        const formatScoreBar = (score) => {
            const fullBar = "█";
            const emptyBar = "░";
            
            // Handle invalid or out of range scores
            if (isNaN(score) || score < 0) {
                return emptyBar.repeat(10);
            }
            
            // Cap the score at 10 to prevent negative emptyBars
            const fullBars = Math.min(10, Math.round(score));
            const emptyBars = Math.max(0, 10 - fullBars);
            
            return fullBar.repeat(fullBars) + emptyBar.repeat(emptyBars);
        };
        
        // TCM Profile Section (if available)
        if (tcmProfile && Object.keys(tcmProfile).length > 0) {
            markdown += `### TCM Profile\n`;
            if (tcmProfile.yinYang) {
                markdown += `- **Yin/Yang Nature**: ${tcmProfile.yinYang}\n`;
            }
            if (tcmProfile.element) {
                markdown += `- **Primary Element**: ${tcmProfile.element}\n`;
            }
            if (tcmProfile.qiMovement) {
                markdown += `- **Qi Movement**: ${tcmProfile.qiMovement}\n`;
            }
            markdown += '\n';
        }
        
        // Add baseline effects section if available
        if (baselineEffects) {
            markdown += `\n\n## Calculated Baseline Effects\n`;
            
            if (baselineEffects.dominant) {
                markdown += `- Dominant: ${baselineEffects.dominant}\n`;
            }
            
            if (baselineEffects.supporting) {
                if (Array.isArray(baselineEffects.supporting)) {
                    markdown += `- Supporting: ${baselineEffects.supporting.join(', ')}\n`;
                } else {
                    // Handle case where supporting is a single string
                    markdown += `- Supporting: ${baselineEffects.supporting}\n`;
                }
            }
            
            // Compare with original expected effects
            if (originalExpectedEffects && 
                // Only show comparison if they're not the same object/reference
                originalExpectedEffects !== baselineEffects) {
                
                markdown += `\n## Comparison with Original Expected Effects\n`;
                
                // Compare dominant effects
                if (originalExpectedEffects.dominant) {
                    const dominantMatch = baselineEffects.dominant === originalExpectedEffects.dominant;
                    markdown += `- Dominant: ${dominantMatch ? '✓ Match' : `❌ Different (Original: ${originalExpectedEffects.dominant}, Calculated: ${baselineEffects.dominant})`}\n`;
                }
                
                // Compare supporting effects
                if (originalExpectedEffects.supporting && originalExpectedEffects.supporting.length > 0) {
                    let supportingMatches = false;
                    
                    if (Array.isArray(baselineEffects.supporting) && Array.isArray(originalExpectedEffects.supporting)) {
                        // Both are arrays - check if all original supporting effects are included in baseline supporting effects
                        supportingMatches = originalExpectedEffects.supporting.every(effect => 
                            baselineEffects.supporting.includes(effect));
                    } else if (!Array.isArray(baselineEffects.supporting) && !Array.isArray(originalExpectedEffects.supporting)) {
                        // Both are strings - direct comparison
                        supportingMatches = baselineEffects.supporting === originalExpectedEffects.supporting;
                    } else if (!Array.isArray(baselineEffects.supporting) && Array.isArray(originalExpectedEffects.supporting)) {
                        // Baseline is string, original is array - check if baseline string is in original array
                        supportingMatches = originalExpectedEffects.supporting.includes(baselineEffects.supporting);
                    } else if (Array.isArray(baselineEffects.supporting) && !Array.isArray(originalExpectedEffects.supporting)) {
                        // Baseline is array, original is string - check if original string is in baseline array
                        supportingMatches = baselineEffects.supporting.includes(originalExpectedEffects.supporting);
                    }
                        
                    if (supportingMatches) {
                        markdown += `- Supporting: ✓ Match\n`;
                    } else {
                        markdown += `- Supporting: ❌ Different\n`;
                        markdown += `  - Original: ${Array.isArray(originalExpectedEffects.supporting) ? 
                            originalExpectedEffects.supporting.join(', ') : originalExpectedEffects.supporting}\n`;
                        markdown += `  - Calculated: ${baselineEffects.supporting ? 
                            (Array.isArray(baselineEffects.supporting) ? 
                                baselineEffects.supporting.join(', ') : baselineEffects.supporting) 
                            : 'None'}\n`;
                    }
                }
            }
        }
        
        // Dominant Effect
        markdown += `### Dominant Effect\n`;
        const dominantSymbol = baselineEffects?.dominant === dominantEffect.id ? ' ★' : '';
        markdown += `- ${dominantEffect.name}${dominantSymbol}: ${formatScoreBar(dominantEffect.level)} ${dominantEffect.level.toFixed(1)}/10\n\n`;
        
        // Supporting Effects
        if (supportingEffects && supportingEffects.length > 0) {
            markdown += `### Supporting Effects\n`;
            supportingEffects.forEach(effect => {
                let supportSymbol = '';
                
                if (baselineEffects?.supporting) {
                    if (Array.isArray(baselineEffects.supporting)) {
                        supportSymbol = baselineEffects.supporting.includes(effect.id) ? ' ☆' : '';
                    } else {
                        supportSymbol = baselineEffects.supporting === effect.id ? ' ☆' : '';
                    }
                }
                
                markdown += `- ${effect.name}${supportSymbol}: ${formatScoreBar(effect.level)} ${effect.level.toFixed(1)}/10\n`;
            });
            markdown += '\n';
        }
        
        // Additional Effects
        if (additionalEffects && additionalEffects.length > 0) {
            markdown += `### Additional Effects\n`;
            additionalEffects.forEach(effect => {
                markdown += `- ${effect.name}: ${formatScoreBar(effect.level)} ${effect.level.toFixed(1)}/10\n`;
            });
            markdown += '\n';
        }

        // Only add component details if we have them
        if (buildUpScores && Object.keys(buildUpScores).length > 0 && finalScores && Object.keys(finalScores).length > 0) {
            // Add a detail table for the top effects
            const topEffects = [...(supportingEffects || []), dominantEffect]
                .filter(effect => effect) // Filter out undefined effects
                .map(effect => effect.id)
                .filter(id => finalScores && finalScores[id]);
                
            if (topEffects.length > 0) {
                markdown += `### Component Contribution Details\n\n`;
                markdown += `| Effect | Base | +Processing | +Geography | +Flavor | +Compounds | Combined | Final |\n`;
                markdown += `|--------|------|------------|------------|---------|-----------|----------|-------|\n`;
                
                topEffects.forEach(effectId => {
                    const effect = [...(supportingEffects || []), dominantEffect].find(e => e && e.id === effectId);
                    if (!effect) return;
                    
                    const baseScore = (buildUpScores.withBaseScores || {})[effectId]?.toFixed(1) || "0.0";
                    const withProcessing = (buildUpScores.withProcessingScores || {})[effectId]?.toFixed(1) || "0.0";
                    const withGeo = (buildUpScores.withGeographyScores || {})[effectId]?.toFixed(1) || "0.0";
                    const withFlavor = (buildUpScores.withFlavorScores || {})[effectId]?.toFixed(1) || "0.0";
                    const withCompound = (buildUpScores.withCompoundScores || {})[effectId]?.toFixed(1) || "0.0";
                    const final = finalScores[effectId]?.toFixed(1) || "0.0";
                    
                    const baselineSymbol = baselineEffects?.dominant === effectId ? " ★" : 
                                         (baselineEffects?.supporting === effectId ? " ☆" : "");
                    
                    markdown += `| **${effect.name}**${baselineSymbol} | ${baseScore} | ${withProcessing} | ${withGeo} | ${withFlavor} | ${withCompound} | ${withCompound} | ${final} |\n`;
                });
                
                markdown += `\n### Legend\n`;
                markdown += `- ★ Baseline Dominant Effect\n`;
                markdown += `- ☆ Baseline Supporting Effect\n\n`;
            }
        }

        // Component Contributions
        markdown += `### Raw Component Scores\n`;
        Object.entries(componentScores || {}).forEach(([component, scores]) => {
            if (!scores || typeof scores !== 'object') return;
            
            markdown += `#### ${component.charAt(0).toUpperCase() + component.slice(1)}\n`;
            Object.entries(scores)
                .filter(([, score]) => score > 0)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5) // Show only top 5 effects for readability
                .forEach(([effectId, score]) => {
                    const effect = this.primaryEffects.find(e => e.id === effectId);
                    const effectName = effect ? effect.name : effectId.charAt(0).toUpperCase() + effectId.slice(1);
                    markdown += `- ${effectName}: ${formatScoreBar(score)} ${score.toFixed(1)}/10\n`;
                });
            markdown += '\n';
        });

        // Interactions
        if (interactions && interactions.length > 0) {
            markdown += `### Significant Interactions\n`;
            interactions.forEach(interaction => {
                if (interaction && interaction.description) {
                    markdown += `- **${interaction.name}**: ${interaction.description}\n`;
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
            componentScores: inference.componentScores,
            baselineEffects: inference.baselineEffects,
            tcmProfile: inference.tcmProfile,
            originalExpectedEffects: inference.originalExpectedEffects
        };
    }
}

export default TeaEffectCalculator;