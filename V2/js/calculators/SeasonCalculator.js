// SeasonCalculator.js
// Handles calculations related to seasonal influence on tea effects

import { BaseCalculator } from './BaseCalculator.js';

export class SeasonCalculator extends BaseCalculator {
    constructor(config) {
        super(config);
        this.seasonalFactors = {};
    }
    
    // Set seasonal factors data
    setSeasonalFactors(seasonalFactors) {
        this.seasonalFactors = seasonalFactors || {};
    }
    
    // Override infer method from BaseCalculator
    infer(tea) {
        if (!tea || !tea.geography || !tea.geography.harvestMonth) {
            return {
                description: 'No seasonal data available',
                seasonName: 'Unknown',
                seasonalEffects: {},
                seasonalScores: {}
            };
        }
        
        const { harvestMonth } = tea.geography;
        const latitude = tea.geography.latitude || 0;
        
        // Get seasonal information
        const seasonName = this.getSeasonName(harvestMonth, latitude);
        const seasonalEffects = this.getSeasonalEffects(seasonName, tea.type);
        const seasonDescription = this.generateSeasonDescription(seasonName, tea);
        
        // Calculate seasonal scores
        const seasonalScores = this.calculateSeasonalScores(seasonName, tea);
        
        return {
            description: seasonDescription,
            seasonName,
            harvestMonth,
            hemisphere: latitude >= 0 ? 'Northern' : 'Southern',
            seasonalEffects,
            seasonalScores
        };
    }
    
    // Override formatInference from BaseCalculator
    formatInference(inference) {
        if (!inference || !inference.seasonName) {
            return '## Seasonal Analysis\n\nNo seasonal data available.';
        }
        
        let md = '## Seasonal Analysis\n\n';
        
        // Add description
        md += `${inference.description}\n\n`;
        
        // Add seasonal effect details
        md += `### ${inference.seasonName} Harvest\n`;
        md += `Month: ${inference.harvestMonth} (${inference.hemisphere} Hemisphere)\n\n`;
        
        // Add seasonal effects
        md += `#### Seasonal Effects\n`;
        
        if (inference.seasonalEffects && Object.keys(inference.seasonalEffects).length > 0) {
            Object.entries(inference.seasonalEffects).forEach(([effect, details]) => {
                md += `- **${effect}**: ${details.description}\n`;
                
                if (details.intensity) {
                    const bars = '■'.repeat(Math.floor(details.intensity / 2)) + 
                                '□'.repeat(5 - Math.floor(details.intensity / 2));
                    md += `  Intensity: [${bars}] ${details.intensity}/10\n`;
                }
            });
        } else {
            md += `No specific seasonal effects identified.\n`;
        }
        
        // Add calculated scores
        md += `\n#### Effect Scores from Seasonal Factors\n`;
        
        if (inference.seasonalScores && Object.keys(inference.seasonalScores).length > 0) {
            Object.entries(inference.seasonalScores).forEach(([effect, score]) => {
                md += `- **${effect}**: ${score.toFixed(1)}/10\n`;
            });
        } else {
            md += `No seasonal scores calculated.\n`;
        }
        
        return md;
    }
    
    // Override serialize from BaseCalculator
    serialize(inference) {
        if (!inference) {
            return {
                seasonalScores: {},
                seasonal: {
                    description: 'No seasonal data available',
                    seasonName: 'Unknown',
                    harvestMonth: 0,
                    hemisphere: 'Unknown',
                    effects: {},
                    _sectionRef: "seasonal"
                }
            };
        }
        
        return {
            seasonalScores: inference.seasonalScores,
            seasonal: {
                description: inference.description,
                seasonName: inference.seasonName,
                harvestMonth: inference.harvestMonth,
                hemisphere: inference.hemisphere,
                effects: inference.seasonalEffects,
                _sectionRef: "seasonal"
            }
        };
    }
    
    // Get the season name based on month and latitude
    getSeasonName(month, latitude = 0) {
        if (!month || month < 1 || month > 12) {
            return 'Unknown';
        }
        
        // Adjust for southern hemisphere
        const isSouthernHemisphere = latitude < 0;
        let adjustedMonth = isSouthernHemisphere ? (month + 6) % 12 : month;
        if (adjustedMonth === 0) adjustedMonth = 12;
        
        // Determine season
        if (adjustedMonth >= 3 && adjustedMonth <= 5) {
            return adjustedMonth === 3 || adjustedMonth === 4 ? 'Early Spring' : 'Spring';
        } else if (adjustedMonth >= 6 && adjustedMonth <= 8) {
            return 'Summer';
        } else if (adjustedMonth >= 9 && adjustedMonth <= 11) {
            return 'Autumn';
        } else {
            return 'Winter';
        }
    }
    
    // Get seasonal effects based on season and tea type
    getSeasonalEffects(seasonName, teaType) {
        const effects = {};
        
        // Early Spring effects - generally the highest quality, most prized harvests
        if (seasonName === 'Early Spring') {
            effects.focusing = {
                description: 'Early spring teas tend to have enhanced focusing properties due to concentrated nutrients after winter dormancy.',
                intensity: 8
            };
            effects.elevating = {
                description: 'The fresh energy of early spring contributes to elevating qualities in the tea.',
                intensity: 7
            };
            effects.energizing = {
                description: 'Early spring harvests typically contain higher caffeine levels, increasing energizing effects.',
                intensity: 6
            };
        }
        // Spring effects
        else if (seasonName === 'Spring') {
            effects.harmonizing = {
                description: 'Spring teas offer well-balanced qualities that promote harmony and equilibrium.',
                intensity: 7
            };
            effects.focusing = {
                description: 'The moderate energy of spring teas supports mental clarity and focus.',
                intensity: 6
            };
            effects.elevating = {
                description: 'Spring teas tend to have uplifting qualities that elevate mood.',
                intensity: 5
            };
        }
        // Summer effects
        else if (seasonName === 'Summer') {
            effects.energizing = {
                description: 'Summer harvests are typically more robust and stimulating.',
                intensity: 7
            };
            effects.grounding = {
                description: 'The full maturity of summer leaves provides a grounding quality.',
                intensity: 6
            };
            effects.focusing = {
                description: 'Summer teas offer steady focus without the intensity of spring harvests.',
                intensity: 5
            };
        }
        // Autumn effects
        else if (seasonName === 'Autumn') {
            effects.comforting = {
                description: 'Autumn harvests tend to have deeper, more comforting qualities.',
                intensity: 7
            };
            effects.grounding = {
                description: 'The transitional nature of autumn imparts grounding properties.',
                intensity: 6
            };
            effects.harmonizing = {
                description: 'Autumn teas help balance the transition between seasons.',
                intensity: 5
            };
        }
        // Winter effects
        else if (seasonName === 'Winter') {
            effects.calming = {
                description: 'Winter harvests (where applicable) tend to have calming, restful qualities.',
                intensity: 7
            };
            effects.restorative = {
                description: 'Winter teas often support recovery and restoration during the cold season.',
                intensity: 6
            };
            effects.comforting = {
                description: 'The warming nature of winter harvests provides comforting effects.',
                intensity: 5
            };
        }
        
        // Adjust based on tea type
        this.adjustEffectsByTeaType(effects, teaType);
        
        return effects;
    }
    
    // Adjust effects based on tea type
    adjustEffectsByTeaType(effects, teaType) {
        if (!teaType) return effects;
        
        // Green tea adjustments
        if (teaType === 'green') {
            if (effects.focusing) effects.focusing.intensity += 1;
            if (effects.energizing) effects.energizing.intensity += 1;
        }
        // White tea adjustments
        else if (teaType === 'white') {
            if (effects.calming) effects.calming.intensity += 1;
            if (effects.restorative) effects.restorative.intensity += 1;
        }
        // Black tea adjustments
        else if (teaType === 'black') {
            if (effects.energizing) effects.energizing.intensity += 1;
            if (effects.grounding) effects.grounding.intensity += 1;
        }
        // Oolong tea adjustments
        else if (teaType === 'oolong') {
            if (effects.harmonizing) effects.harmonizing.intensity += 1;
            if (effects.elevating) effects.elevating.intensity += 1;
        }
        // Puerh tea adjustments
        else if (teaType.includes('puerh')) {
            if (effects.grounding) effects.grounding.intensity += 1;
            if (effects.comforting) effects.comforting.intensity += 1;
        }
        
        // Cap intensities at 10
        Object.values(effects).forEach(effect => {
            if (effect.intensity > 10) effect.intensity = 10;
        });
        
        return effects;
    }
    
    // Generate a description of the seasonal influence
    generateSeasonDescription(seasonName, tea) {
        const teaType = tea?.type || 'tea';
        const region = tea?.origin ? `from ${tea.origin}` : '';
        
        if (seasonName === 'Early Spring') {
            return `This ${teaType} ${region} was harvested during Early Spring, the premier harvest season. Early spring teas are highly prized for their concentrated flavors and potent effects after the winter dormancy period. They typically offer exceptional focusing and elevating qualities with a fresh, vibrant character.`;
        } else if (seasonName === 'Spring') {
            return `This ${teaType} ${region} was harvested during Spring, a prime tea harvesting season. Spring harvests are known for their well-balanced, harmonizing qualities and moderate energy. The fresh growth of spring contributes to a clean, bright character in the tea.`;
        } else if (seasonName === 'Summer') {
            return `This ${teaType} ${region} was harvested during Summer. Summer harvests tend to produce more robust, full-bodied teas with stronger energizing effects. The mature leaves develop deeper flavors and grounding qualities during this season.`;
        } else if (seasonName === 'Autumn') {
            return `This ${teaType} ${region} was harvested during Autumn. Autumn harvests often develop unique comforting qualities and deeper flavors as the plant prepares for dormancy. These teas typically offer grounding effects and a smooth character that transitions well between seasons.`;
        } else if (seasonName === 'Winter') {
            return `This ${teaType} ${region} was harvested during Winter, which is unusual for most tea regions. Winter harvests (where applicable) tend to produce teas with distinctive calming and restorative properties, often with a more subdued flavor profile.`;
        } else {
            return `The harvest season for this ${teaType} ${region} is unknown or not specified.`;
        }
    }
    
    // Calculate seasonal scores for effects
    calculateSeasonalScores(seasonName, tea) {
        const scores = {};
        const seasonalEffects = this.getSeasonalEffects(seasonName, tea.type);
        
        // Convert effect intensities to scores
        Object.entries(seasonalEffects).forEach(([effect, details]) => {
            scores[effect] = details.intensity;
        });
        
        // Apply modifiers based on tea characteristics
        this.applyTeaSpecificModifiers(scores, tea);
        
        return scores;
    }
    
    // Apply modifiers based on specific tea characteristics
    applyTeaSpecificModifiers(scores, tea) {
        if (!tea) return scores;
        
        // Altitude modifiers
        if (tea.geography && tea.geography.altitude) {
            const altitude = tea.geography.altitude;
            
            // High altitude enhances focusing and elevating effects
            if (altitude > 1000) {
                if (scores.focusing) scores.focusing *= 1.2;
                if (scores.elevating) scores.elevating *= 1.2;
            }
            // Low altitude enhances grounding effects
            else if (altitude < 500) {
                if (scores.grounding) scores.grounding *= 1.2;
                if (scores.comforting) scores.comforting *= 1.1;
            }
        }
        
        // L-theanine to caffeine ratio modifiers
        if (tea.lTheanineLevel && tea.caffeineLevel && tea.caffeineLevel > 0) {
            const ratio = tea.lTheanineLevel / tea.caffeineLevel;
            
            // High L-theanine ratio enhances calming and focusing
            if (ratio > 1.5) {
                if (scores.calming) scores.calming *= 1.2;
                if (scores.focusing) scores.focusing *= 1.1;
            }
            // Low ratio enhances energizing
            else if (ratio < 0.8) {
                if (scores.energizing) scores.energizing *= 1.2;
            }
        }
        
        // Cap all scores at 10
        Object.keys(scores).forEach(effect => {
            scores[effect] = Math.min(10, scores[effect]);
        });
        
        return scores;
    }
} 