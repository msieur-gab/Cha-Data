// CompoundCalculator.js
// Handles calculations related to chemical compounds in tea and their effects

import { BaseCalculator } from './BaseCalculator.js';

export class CompoundCalculator extends BaseCalculator {
    constructor(config) {
        super(config);
        this.compoundEffects = {};
        this.lTheanineCaffeineRatios = {};
    }
    
    // Set compound effects data
    setCompoundEffects(compoundEffects) {
        this.compoundEffects = compoundEffects || {};
    }
    
    // Set L-theanine to caffeine ratio effects
    setLTheanineCaffeineRatios(ratios) {
        this.lTheanineCaffeineRatios = ratios || {};
    }
    
    // Override infer method from BaseCalculator
    infer(tea) {
        if (!tea || (!tea.caffeineLevel && !tea.lTheanineLevel && !tea.catechinLevel)) {
            return {
                description: 'No compound data available',
                compounds: {},
                compoundEffects: {},
                compoundScores: {}
            };
        }
        
        // Extract compound levels
        const caffeineLevel = tea.caffeineLevel || 0;
        const lTheanineLevel = tea.lTheanineLevel || 0;
        const catechinLevel = tea.catechinLevel || 0;
        const totalPolyphenols = tea.totalPolyphenols || 0;
        const aminoAcids = tea.aminoAcids || 0;
        
        // Calculate L-theanine to caffeine ratio if both values are present
        const lTheanineToCaffeineRatio = caffeineLevel > 0 ? lTheanineLevel / caffeineLevel : 0;
        
        // Get compound information
        const compounds = {
            caffeineLevel,
            lTheanineLevel,
            catechinLevel,
            totalPolyphenols,
            aminoAcids,
            lTheanineToCaffeineRatio
        };
        
        // Calculate compound effects and scores
        const compoundEffects = this.getCompoundEffects(compounds, tea.type);
        const compoundScores = this.calculateCompoundScores(compounds, tea.type);
        const description = this.generateCompoundDescription(compounds, tea);
        
        return {
            description,
            compounds,
            compoundEffects,
            compoundScores
        };
    }
    
    // Override formatInference from BaseCalculator
    formatInference(inference) {
        if (!inference || !inference.compounds) {
            return '## Compound Analysis\n\nNo compound data available.';
        }
        
        let md = '## Compound Analysis\n\n';
        
        // Add description
        md += `${inference.description}\n\n`;
        
        // Add compound level details
        md += '### Compound Levels\n';
        
        const { compounds } = inference;
        
        if (compounds.caffeineLevel > 0) {
            md += `- **Caffeine**: ${compounds.caffeineLevel.toFixed(1)}/10\n`;
        }
        
        if (compounds.lTheanineLevel > 0) {
            md += `- **L-theanine**: ${compounds.lTheanineLevel.toFixed(1)}/10\n`;
        }
        
        if (compounds.lTheanineToCaffeineRatio > 0) {
            md += `- **L-theanine to Caffeine Ratio**: ${compounds.lTheanineToCaffeineRatio.toFixed(2)}\n`;
        }
        
        if (compounds.catechinLevel > 0) {
            md += `- **Catechins**: ${compounds.catechinLevel.toFixed(1)}/10\n`;
        }
        
        if (compounds.totalPolyphenols > 0) {
            md += `- **Total Polyphenols**: ${compounds.totalPolyphenols.toFixed(1)}/10\n`;
        }
        
        if (compounds.aminoAcids > 0) {
            md += `- **Amino Acids**: ${compounds.aminoAcids.toFixed(1)}/10\n`;
        }
        
        // Add compound effects
        md += `\n### Compound Effects\n`;
        
        if (inference.compoundEffects && Object.keys(inference.compoundEffects).length > 0) {
            Object.entries(inference.compoundEffects).forEach(([effect, details]) => {
                md += `- **${effect}**: ${details.description}\n`;
                
                if (details.intensity) {
                    const bars = '■'.repeat(Math.floor(details.intensity / 2)) + 
                               '□'.repeat(5 - Math.floor(details.intensity / 2));
                    md += `  Intensity: [${bars}] ${details.intensity}/10\n`;
                }
            });
        } else {
            md += `No specific compound effects identified.\n`;
        }
        
        // Add calculated scores
        md += `\n### Effect Scores from Compounds\n`;
        
        if (inference.compoundScores && Object.keys(inference.compoundScores).length > 0) {
            Object.entries(inference.compoundScores).forEach(([effect, score]) => {
                md += `- **${effect}**: ${score.toFixed(1)}/10\n`;
            });
        } else {
            md += `No compound scores calculated.\n`;
        }
        
        return md;
    }
    
    // Override serialize from BaseCalculator
    serialize(inference) {
        if (!inference) {
            return {
                compoundScores: {},
                compounds: {
                    description: 'No compound data available',
                    levels: {},
                    effects: {},
                    _sectionRef: "compounds"
                }
            };
        }
        
        return {
            compoundScores: inference.compoundScores,
            compounds: {
                description: inference.description,
                levels: inference.compounds,
                effects: inference.compoundEffects,
                _sectionRef: "compounds"
            }
        };
    }
    
    // Get compound effects based on levels and tea type
    getCompoundEffects(compounds, teaType = '') {
        const effects = {};
        
        // Caffeine effects
        this.analyzeCaffeineEffects(effects, compounds.caffeineLevel);
        
        // L-theanine effects
        this.analyzeLTheanineEffects(effects, compounds.lTheanineLevel);
        
        // L-theanine to caffeine ratio effects
        this.analyzeRatioEffects(effects, compounds.lTheanineToCaffeineRatio);
        
        // Catechin effects
        this.analyzeCatechinEffects(effects, compounds.catechinLevel);
        
        // Total polyphenols effects
        this.analyzePolyphenolEffects(effects, compounds.totalPolyphenols);
        
        // Amino acids effects
        this.analyzeAminoAcidEffects(effects, compounds.aminoAcids);
        
        // Tea type specific adjustments
        this.adjustEffectsByTeaType(effects, teaType);
        
        return effects;
    }
    
    // Analyze caffeine effects
    analyzeCaffeineEffects(effects, caffeineLevel) {
        if (!caffeineLevel || caffeineLevel <= 0) return effects;
        
        // Scale intensity based on caffeine level
        const intensity = Math.min(9, Math.max(1, Math.round(caffeineLevel)));
        
        effects.energizing = {
            description: 'Caffeine stimulates the central nervous system, providing energy and alertness.',
            intensity,
            compound: 'caffeine'
        };
        
        // High caffeine can also create focusing effects
        if (caffeineLevel >= 7) {
            effects.focusing = {
                description: 'High caffeine levels enhance mental focus by increasing neurotransmitter activity.',
                intensity: Math.floor(caffeineLevel * 0.8),
                compound: 'caffeine'
            };
        }
        
        return effects;
    }
    
    // Analyze L-theanine effects
    analyzeLTheanineEffects(effects, lTheanineLevel) {
        if (!lTheanineLevel || lTheanineLevel <= 0) return effects;
        
        // Scale intensity based on L-theanine level
        const intensity = Math.min(9, Math.max(1, Math.round(lTheanineLevel)));
        
        effects.calming = {
            description: 'L-theanine promotes alpha brain wave activity, creating a calm yet alert state.',
            intensity,
            compound: 'l-theanine'
        };
        
        // High L-theanine can also create focusing effects (different mechanism than caffeine)
        if (lTheanineLevel >= 6) {
            effects.focusing = {
                description: 'L-theanine enhances focus by promoting a relaxed attention state without drowsiness.',
                intensity: Math.floor(lTheanineLevel * 0.7),
                compound: 'l-theanine'
            };
        }
        
        return effects;
    }
    
    // Analyze L-theanine to caffeine ratio effects
    analyzeRatioEffects(effects, ratio) {
        if (!ratio || ratio <= 0) return effects;
        
        // High ratio (>1.5): More L-theanine than caffeine
        if (ratio > 1.5) {
            effects.harmonizing = {
                description: 'The high L-theanine to caffeine ratio creates a balanced, smooth mental state.',
                intensity: Math.min(9, Math.round(ratio * 2)),
                compound: 'l-theanine:caffeine ratio'
            };
        }
        // Balanced ratio (0.8-1.5): Similar levels of L-theanine and caffeine
        else if (ratio >= 0.8) {
            effects.focusing = {
                description: 'The balanced L-theanine and caffeine levels create ideal conditions for sustained focus.',
                intensity: 8,
                compound: 'l-theanine:caffeine ratio'
            };
        }
        // Low ratio (<0.8): More caffeine than L-theanine
        else {
            effects.energizing = {
                description: 'The caffeine-dominant ratio provides strong energizing effects.',
                intensity: Math.min(9, Math.round(8 - ratio * 2)),
                compound: 'l-theanine:caffeine ratio'
            };
        }
        
        return effects;
    }
    
    // Analyze catechin effects
    analyzeCatechinEffects(effects, catechinLevel) {
        if (!catechinLevel || catechinLevel <= 0) return effects;
        
        // Scale intensity based on catechin level
        const intensity = Math.min(8, Math.max(1, Math.round(catechinLevel * 0.7)));
        
        effects.clarifying = {
            description: 'Catechins help remove toxins and support mental clarity.',
            intensity,
            compound: 'catechins'
        };
        
        // High catechin can also create refreshing effects
        if (catechinLevel >= 7) {
            effects.uplifting = {
                description: 'The high antioxidant activity of catechins creates a refreshed, uplifted feeling.',
                intensity: Math.floor(catechinLevel * 0.6),
                compound: 'catechins'
            };
        }
        
        return effects;
    }
    
    // Analyze polyphenol effects
    analyzePolyphenolEffects(effects, polyphenolLevel) {
        if (!polyphenolLevel || polyphenolLevel <= 0) return effects;
        
        // Scale intensity based on polyphenol level
        const intensity = Math.min(8, Math.max(1, Math.round(polyphenolLevel * 0.7)));
        
        effects.grounding = {
            description: 'The rich polyphenol content provides a subtle grounding effect.',
            intensity,
            compound: 'polyphenols'
        };
        
        return effects;
    }
    
    // Analyze amino acid effects
    analyzeAminoAcidEffects(effects, aminoAcidLevel) {
        if (!aminoAcidLevel || aminoAcidLevel <= 0) return effects;
        
        // Scale intensity based on amino acid level
        const intensity = Math.min(8, Math.max(1, Math.round(aminoAcidLevel * 0.8)));
        
        effects.nourishing = {
            description: 'The amino acid profile provides a nourishing effect that supports overall well-being.',
            intensity,
            compound: 'amino acids'
        };
        
        return effects;
    }
    
    // Adjust effects based on tea type
    adjustEffectsByTeaType(effects, teaType) {
        if (!teaType) return effects;
        
        // Green tea adjustments
        if (teaType.includes('green')) {
            if (effects.focusing) effects.focusing.intensity += 1;
            if (effects.clarifying) effects.clarifying.intensity += 1;
        }
        // White tea adjustments
        else if (teaType.includes('white')) {
            if (effects.calming) effects.calming.intensity += 1;
            if (effects.harmonizing) effects.harmonizing.intensity += 1;
        }
        // Black tea adjustments
        else if (teaType.includes('black')) {
            if (effects.energizing) effects.energizing.intensity += 1;
            if (effects.grounding) effects.grounding.intensity += 1;
        }
        // Oolong tea adjustments
        else if (teaType.includes('oolong')) {
            if (effects.focusing) effects.focusing.intensity += 1;
            if (effects.harmonizing) effects.harmonizing.intensity += 1;
        }
        // Puerh tea adjustments
        else if (teaType.includes('puerh')) {
            if (effects.grounding) effects.grounding.intensity += 1;
            if (effects.nourishing) effects.nourishing.intensity += 1;
        }
        
        // Cap intensities at 10
        Object.values(effects).forEach(effect => {
            if (effect.intensity > 10) effect.intensity = 10;
        });
        
        return effects;
    }
    
    // Generate a description of the compounds
    generateCompoundDescription(compounds, tea) {
        if (!compounds || Object.values(compounds).every(v => !v || v <= 0)) {
            return 'No compound information available for this tea.';
        }
        
        const teaType = tea?.type || 'tea';
        const { caffeineLevel, lTheanineLevel, lTheanineToCaffeineRatio, catechinLevel } = compounds;
        
        let description = `This ${teaType} contains `;
        
        // Describe caffeine level
        if (caffeineLevel > 0) {
            if (caffeineLevel >= 8) {
                description += 'very high caffeine levels';
            } else if (caffeineLevel >= 6) {
                description += 'high caffeine levels';
            } else if (caffeineLevel >= 4) {
                description += 'moderate caffeine levels';
            } else {
                description += 'low caffeine levels';
            }
        } else {
            description += 'unknown caffeine levels';
        }
        
        // Describe L-theanine level
        if (lTheanineLevel > 0) {
            description += ' and ';
            
            if (lTheanineLevel >= 8) {
                description += 'very high L-theanine content';
            } else if (lTheanineLevel >= 6) {
                description += 'high L-theanine content';
            } else if (lTheanineLevel >= 4) {
                description += 'moderate L-theanine content';
            } else {
                description += 'low L-theanine content';
            }
        }
        
        description += '. ';
        
        // Describe L-theanine to caffeine ratio if available
        if (lTheanineToCaffeineRatio > 0) {
            description += 'The L-theanine to caffeine ratio is ';
            
            if (lTheanineToCaffeineRatio > 2) {
                description += `very high (${lTheanineToCaffeineRatio.toFixed(2)}), creating a notably calming yet focused effect.`;
            } else if (lTheanineToCaffeineRatio > 1.5) {
                description += `high (${lTheanineToCaffeineRatio.toFixed(2)}), balancing energy with calmness.`;
            } else if (lTheanineToCaffeineRatio >= 0.8) {
                description += `balanced (${lTheanineToCaffeineRatio.toFixed(2)}), providing an ideal state for focused attention.`;
            } else if (lTheanineToCaffeineRatio > 0.5) {
                description += `somewhat low (${lTheanineToCaffeineRatio.toFixed(2)}), with energy effects slightly outweighing calming effects.`;
            } else {
                description += `low (${lTheanineToCaffeineRatio.toFixed(2)}), resulting in more pronounced energizing qualities.`;
            }
            
            description += ' ';
        }
        
        // Describe catechin levels if available
        if (catechinLevel > 0) {
            description += 'This tea also contains ';
            
            if (catechinLevel >= 8) {
                description += 'very high levels of catechins';
            } else if (catechinLevel >= 6) {
                description += 'high levels of catechins';
            } else if (catechinLevel >= 4) {
                description += 'moderate levels of catechins';
            } else {
                description += 'low levels of catechins';
            }
            
            description += ', which contribute to its clarifying and refreshing qualities.';
        }
        
        return description;
    }
    
    // Calculate compound scores for effects
    calculateCompoundScores(compounds, teaType) {
        if (!compounds) {
            return {};
        }
        
        const scores = {};
        
        // Get base effects from compound levels
        const compoundEffects = this.getCompoundEffects(compounds, teaType);
        
        // Convert effect intensities to scores
        Object.entries(compoundEffects).forEach(([effect, details]) => {
            scores[effect] = details.intensity;
        });
        
        // Special case: Synergistic effects between caffeine and L-theanine
        const { caffeineLevel, lTheanineLevel } = compounds;
        
        if (caffeineLevel > 0 && lTheanineLevel > 0) {
            // If both compounds are present, enhance focusing effect
            if (!scores.focusing) {
                scores.focusing = Math.min(8, (caffeineLevel + lTheanineLevel) / 3);
            } else {
                scores.focusing = Math.min(10, scores.focusing * 1.2);
            }
        }
        
        return scores;
    }
} 