// SeasonCalculator.js
// Calculate optimal seasonal suitability for teas with a scientific approach

import { seasonalFactors } from '../props/SeasonalFactors.js';
import { teaTypeSeasonalExplanations, seasonalFlavorAffinities, seasonOpposites } from '../props/TeaTypeDescriptors.js';
import { processingInfluences, significantSeasonalProcessing } from '../props/ProcessingInfluences.js';
import { validateObject, normalizeString, getTopItems, sortByProperty, categorizeByKeywords } from '../utils/helpers.js';

export class SeasonCalculator {
    constructor(config, primaryEffects) {
        this.config = config;
        this.primaryEffects = primaryEffects;
        this.seasons = ['spring', 'summer', 'fall', 'winter'];
    }
    
    // Main calculate method following standardized calculator pattern
    calculate(tea) {
        const inference = this.infer(tea);
        return {
            inference: this.formatInference(inference),
            data: this.serialize(inference)
        };
    }
    
    // Inferencer: Processes tea data and produces raw insights
    infer(tea) {
        // Validate tea object
        tea = validateObject(tea);
        
        // Calculate seasonal suitability scores
        const suitabilityResults = this.calculateSeasonalSuitability(tea);
        
        return {
            scores: suitabilityResults.scores || {},
            bestSeasons: suitabilityResults.bestSeasons || [],
            explanations: suitabilityResults.explanations || {},
            scientificBasis: suitabilityResults.explanations?.scientific || ''
        };
    }
    
    // Format inference as human-readable markdown
    formatInference(inference) {
        const { scores, bestSeasons, explanations, scientificBasis } = inference;
        
        let md = `## Seasonal Analysis\n\n`;
        
        // Add general description
        if (explanations && explanations.general) {
            md += `${explanations.general}\n\n`;
        }
        
        // Add season scores and explanations
        md += '### Seasonal Suitability\n\n';
        for (const season of this.seasons) {
            const score = scores[season];
            const explanation = explanations[season];
            
            // Add score bar
            const barLength = Math.round(score);
            const bar = '█'.repeat(barLength) + '░'.repeat(10 - barLength);
            
            md += `#### ${season.charAt(0).toUpperCase() + season.slice(1)}\n`;
            md += `Score: ${score.toFixed(1)}/10\n`;
            md += `[${bar}]\n`;
            md += `${explanation}\n\n`;
        }
        
        // Add scientific basis
        md += '### Scientific Basis\n\n';
        md += `${scientificBasis}\n`;
        
        return md;
    }
    
    // Serialize inference for JSON export
    serialize(inference) {
        return {
            scores: inference.scores,
            bestSeasons: inference.bestSeasons,
            explanations: inference.explanations,
            scientificBasis: inference.scientificBasis
        };
    }
    
    // Calculate seasonal suitability for a tea based on its properties
    calculateSeasonalSuitability(tea) {
        // Default values for missing properties
        const safeTea = {
            type: tea.type || 'unknown',
            caffeineLevel: tea.caffeineLevel !== undefined ? tea.caffeineLevel : 3,
            lTheanineLevel: tea.lTheanineLevel !== undefined ? tea.lTheanineLevel : 5,
            flavorProfile: Array.isArray(tea.flavorProfile) ? tea.flavorProfile : [],
            processingMethods: Array.isArray(tea.processingMethods) ? tea.processingMethods : [],
            geography: tea.geography || {}
        };
        
        // Initialize scores for each season
        const scores = {
            spring: 5,
            summer: 5,
            fall: 5,
            winter: 5
        };
        
        // Calculate temperature influence (tea type base scores)
        this._calculateTemperatureInfluence(safeTea, scores);
        
        // Calculate processing method influence
        this._calculateProcessingInfluence(safeTea, scores);
        
        // Calculate flavor profile influence
        this._calculateFlavorInfluence(safeTea, scores);
        
        // Calculate origin climate correlation
        this._calculateOriginClimateFactor(safeTea, scores);
        
        // Calculate chemical composition influence
        this._calculateChemicalCompositionFactor(safeTea, scores);
        
        // Normalize scores to 0-10 range
        for (const season of this.seasons) {
            scores[season] = Math.max(0, Math.min(10, scores[season]));
        }
        
        // Rank seasons by score
        const rankedSeasons = this._rankSeasons(scores);
        
        // Generate explanations for the scores
        const explanations = this._generateExplanations(safeTea, scores);
        
        return {
            scores,
            bestSeasons: rankedSeasons,
            explanations
        };
    }
    
    // Calculate the influence of tea type on seasonal suitability
    _calculateTemperatureInfluence(tea, scores) {
        const { teaTypeFactors } = seasonalFactors;
        const teaType = tea.type.toLowerCase();
        
        if (teaTypeFactors[teaType]) {
            for (const season of this.seasons) {
                scores[season] = teaTypeFactors[teaType][season];
            }
        }
    }
    
    // Calculate the influence of processing methods on seasonal suitability
    _calculateProcessingInfluence(tea, scores) {
        const { processingFactors } = seasonalFactors;
        
        tea.processingMethods.forEach(method => {
            if (processingFactors[method]) {
                for (const season of this.seasons) {
                    scores[season] += processingFactors[method][season];
                }
            }
        });
    }
    
    // Calculate the influence of flavor profile on seasonal suitability
    _calculateFlavorInfluence(tea, scores) {
        const { flavorFactors } = seasonalFactors;
        
        tea.flavorProfile.forEach((flavor, index) => {
            if (flavorFactors[flavor]) {
                // Weight by position (primary flavors have more influence)
                const weight = 1 - (index * 0.15);
                
                for (const season of this.seasons) {
                    scores[season] += flavorFactors[flavor][season] * weight;
                }
            }
        });
    }
    
    // Calculate the influence of origin climate on seasonal suitability
    _calculateOriginClimateFactor(tea, scores) {
        const { originClimateFactors } = seasonalFactors;
        const { geography } = tea;
        
        if (!geography) return;
        
        // Calculate climate zone based on latitude
        if (geography.latitude !== undefined) {
            const absLatitude = Math.abs(geography.latitude);
            let climateZone;
            
            if (absLatitude < 23.5) {
                climateZone = 'tropical';
            } else if (absLatitude < 35) {
                climateZone = 'subtropical';
            } else if (absLatitude < 55) {
                climateZone = 'temperate';
            } else {
                climateZone = 'subpolar';
            }
            
            const { latitudeFactors } = originClimateFactors;
            if (latitudeFactors[climateZone]) {
                for (const season of this.seasons) {
                    scores[season] += latitudeFactors[climateZone][season];
                }
            }
        }
        
        // Apply harvest month influence
        if (geography.harvestMonth !== undefined) {
            const month = geography.harvestMonth;
            const { harvestMonthFactors } = originClimateFactors;
            
            if (harvestMonthFactors[month]) {
                for (const season of this.seasons) {
                    scores[season] += harvestMonthFactors[month][season];
                }
            }
        }
    }
    
    // Calculate the influence of chemical composition on seasonal suitability
    _calculateChemicalCompositionFactor(tea, scores) {
        const { chemicalFactors } = seasonalFactors;
        
        // Calculate L-Theanine to Caffeine ratio
        const ratio = tea.lTheanineLevel / tea.caffeineLevel;
        let ratioCategory;
        
        if (ratio > 1.5) {
            ratioCategory = 'high';
        } else if (ratio >= 0.8) {
            ratioCategory = 'balanced';
        } else {
            ratioCategory = 'low';
        }
        
        const { lTheanineToCaffeineRatio } = chemicalFactors;
        if (lTheanineToCaffeineRatio[ratioCategory]) {
            for (const season of this.seasons) {
                scores[season] += lTheanineToCaffeineRatio[ratioCategory][season];
            }
        }
    }
    
    // Rank seasons by score
    _rankSeasons(scores) {
        return this.seasons
            .map(season => ({ season, score: scores[season] }))
            .sort((a, b) => b.score - a.score);
    }
    
    // Generate explanations for the scores
    _generateExplanations(tea, scores) {
        const explanations = {};
        const rankedSeasons = this._rankSeasons(scores);
        const bestSeason = rankedSeasons[0].season;
        
        // Generate general explanation
        explanations.general = `${tea.type.charAt(0).toUpperCase() + tea.type.slice(1)} tea with a ${this._getLTheanineRatioDescription(tea)} L-theanine to caffeine ratio (${(tea.lTheanineLevel/tea.caffeineLevel).toFixed(2)}:1).`;
        
        // Generate explanation for each season
        this.seasons.forEach(season => {
            let explanation = '';
            const score = scores[season];
            
            // Use more flexible terminology based on actual score values
            if (score >= 9.5) {
                explanation += `This tea is exceptional for ${season} (${score.toFixed(1)}/10). `;
            } else if (score >= 8.5) {
                explanation += `This tea is excellent for ${season} (${score.toFixed(1)}/10). `;
            } else if (score >= 7.0) {
                explanation += `This tea is very good for ${season} (${score.toFixed(1)}/10). `;
            } else if (score >= 5.5) {
                explanation += `This tea is well-suited for ${season} (${score.toFixed(1)}/10). `;
            } else if (score >= 4.0) {
                explanation += `This tea is acceptable for ${season} (${score.toFixed(1)}/10). `;
            } else if (score >= 2.5) {
                explanation += `This tea is less ideal for ${season} (${score.toFixed(1)}/10). `;
            } else {
                explanation += `This tea is not recommended for ${season} (${score.toFixed(1)}/10). `;
            }
            
            // Add relative ranking note if this is the best season
            if (season === bestSeason && rankedSeasons[0].score - rankedSeasons[1].score >= 1.0) {
                explanation += `It's best enjoyed during ${season}. `;
            }
            
            // Add tea type reasoning
            explanation += this._getTeaTypeSeasonalExplanation(tea.type, season);
            
            // Add processing method reasoning if significant
            const processingExplanation = this._getProcessingSeasonalExplanation(tea.processingMethods, season);
            if (processingExplanation) {
                explanation += ' ' + processingExplanation;
            }
            
            // Add flavor profile reasoning
            const flavorExplanation = this._getFlavorSeasonalExplanation(tea.flavorProfile, season);
            if (flavorExplanation) {
                explanation += ' ' + flavorExplanation;
            }
            
            explanations[season] = explanation;
        });
        
        // Scientific basis
        explanations.scientific = this._getScientificBasis(tea);
        
        return explanations;
    }
    
    // Get L-Theanine to Caffeine ratio description
    _getLTheanineRatioDescription(tea) {
        const ratio = tea.lTheanineLevel / tea.caffeineLevel;
        
        if (ratio > 1.5) {
            return 'high';
        } else if (ratio >= 0.8) {
            return 'balanced';
        } else {
            return 'low';
        }
    }
    
    // Generate tea type seasonal explanation
    _getTeaTypeSeasonalExplanation(teaType, season) {
        return teaTypeSeasonalExplanations[teaType.toLowerCase()]?.[season] || "";
    }
    
    // Generate processing method seasonal explanation
    _getProcessingSeasonalExplanation(methods, season) {
        // Find the most significant processing method for this season
        const relevantMethod = methods.find(method => 
            significantSeasonalProcessing[season].includes(method)
        );
        
        if (!relevantMethod) return "";
        
        // Get the explanation from processingInfluences
        const processMethod = processingInfluences[relevantMethod];
        if (processMethod && processMethod.seasonalExplanations && processMethod.seasonalExplanations[season]) {
            return processMethod.seasonalExplanations[season];
        }
        
        return "";
    }
    
    // Generate flavor profile seasonal explanation
    _getFlavorSeasonalExplanation(flavors, season) {
        if (!flavors.length) return "";
        
        // Check if the tea has flavors aligned with this season
        const alignedFlavors = flavors.filter(flavor => 
            seasonalFlavorAffinities[season].includes(flavor)
        );
        
        if (alignedFlavors.length === 0) {
            const opposingSeason = this._getOpposingSeason(season);
            return `Its flavor profile lacks typical ${season} characteristics and may be better aligned with ${opposingSeason}.`;
        }
        
        if (alignedFlavors.length > 0) {
            return `Its ${alignedFlavors.join(', ')} notes are particularly well-suited for ${season} enjoyment.`;
        }
        
        return "";
    }
    
    // Get opposing season
    _getOpposingSeason(season) {
        return seasonOpposites[season] || "";
    }
    
    // Generate scientific basis for the seasonal recommendations
    _getScientificBasis(tea) {
        const ratio = tea.lTheanineLevel / tea.caffeineLevel;
        let explanation = "";
        
        explanation += "Scientific basis for seasonal recommendations:\n";
        
        // Tea type factors
        explanation += `• ${tea.type.charAt(0).toUpperCase() + tea.type.slice(1)} tea is categorized based on its processing level, `;
        
        if (tea.type === "green" || tea.type === "white" || tea.type === "yellow") {
            explanation += "with minimal oxidation creating cooling properties beneficial in warmer seasons.\n";
        } else if (tea.type === "oolong") {
            explanation += "with partial oxidation creating a balance suitable across seasons but optimized by its roast level.\n";
        } else if (tea.type === "black") {
            explanation += "with full oxidation creating warming properties beneficial in cooler seasons.\n";
        } else if (tea.type === "dark" || tea.type === "puerh") {
            explanation += "with post-fermentation creating complex warming characteristics particularly beneficial in cooler seasons.\n";
        }
        
        // Chemical composition
        if (ratio > 1.5) {
            explanation += "• High L-theanine to caffeine ratio (>" + ratio.toFixed(2) + ":1) produces cooling, calming effects that counteract summer heat stress.\n";
        } else if (ratio < 0.8) {
            explanation += "• Low L-theanine to caffeine ratio (<" + ratio.toFixed(2) + ":1) produces warming, stimulating effects beneficial during colder seasons.\n";
        } else {
            explanation += "• Balanced L-theanine to caffeine ratio (" + ratio.toFixed(2) + ":1) provides versatility across seasons.\n";
        }
        
        // Processing methods
        const significantProcessing = tea.processingMethods.find(method => 
            ["shade-grown", "heavy-roast", "full-oxidation", "aged"].includes(method)
        );
        
        if (significantProcessing) {
            if (significantProcessing === "shade-grown") {
                explanation += "• Shade-grown processing increases L-theanine content, enhancing cooling, focused effects ideal for warmer seasons.\n";
            } else if (significantProcessing === "heavy-roast" || significantProcessing === "full-oxidation") {
                explanation += `• ${significantProcessing === "heavy-roast" ? "Heavy roasting" : "Full oxidation"} creates compounds that produce warming effects aligned with colder seasons.\n`;
            } else if (significantProcessing === "aged") {
                explanation += "• Aging develops deeper, more complex compounds that create warming effects beneficial in cooler seasons.\n";
            }
        }
        
        // Origin factors
        if (tea.geography && tea.geography.harvestMonth) {
            const month = tea.geography.harvestMonth;
            const season = this._getHarvestSeason(month);
            explanation += `• Harvested in ${this._getMonthName(month)} (${season}), aligning with natural seasonal growth cycles and nutrient composition optimal for that period.\n`;
        }
        
        return explanation;
    }
    
    // Get harvest season from month
    _getHarvestSeason(month) {
        if (month >= 3 && month <= 5) return "spring";
        if (month >= 6 && month <= 8) return "summer";
        if (month >= 9 && month <= 11) return "fall";
        return "winter";
    }
    
    // Get month name from number
    _getMonthName(month) {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return months[month - 1] || "Unknown Month";
    }
}

export default SeasonCalculator;