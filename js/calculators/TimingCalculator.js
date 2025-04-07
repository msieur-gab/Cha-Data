// TimingCalculator.js
// Calculate optimal drinking times for teas with a scientific approach

import { validateObject, createSafeTea, sortByProperty } from '../utils/helpers.js';

export class TimingCalculator {
    constructor(config, primaryEffects) {
        this.config = config;
        this.primaryEffects = primaryEffects;
        
        // Time intervals in hours (24-hour format)
        this.timeIntervals = Array.from({ length: 24 }, (_, i) => i);
        
        // Circadian-based baseline alertness model (simplified)
        // Based on scientific studies of average alertness levels throughout the day
        this.baselineAlertness = {
            0: 2.0,  // 12 AM - low alertness during sleep hours
            1: 1.5, 
            2: 1.0,  // Lowest alertness around 2-4 AM
            3: 1.0,
            4: 1.5,
            5: 2.5,  // Rising alertness
            6: 4.0,
            7: 5.5,
            8: 7.0,  // Morning alertness peak
            9: 7.5,
            10: 7.0,
            11: 6.5,
            12: 6.0,  // Post-lunch dip
            13: 5.0,
            14: 4.5,  // Afternoon slump
            15: 5.0,
            16: 5.5,  // Recovery
            17: 6.0,
            18: 5.5,
            19: 5.0,
            20: 4.5,  // Evening wind-down
            21: 4.0,
            22: 3.0,
            23: 2.5   // Night, preparing for sleep
        };
        
        // Effect optimal time mapping - when each effect is most desirable
        this.effectTimingMap = {
            revitalizing: { peakHours: [7, 8, 9], falloffRate: 1.5 },
            awakening: { peakHours: [6, 7, 8], falloffRate: 1.2 },
            soothing: { peakHours: [19, 20, 21], falloffRate: 1.0 },
            peaceful: { peakHours: [18, 19, 20, 21], falloffRate: 0.9 },
            clarifying: { peakHours: [9, 10, 11, 14, 15], falloffRate: 1.2 },
            reflective: { peakHours: [10, 11, 16, 17, 18], falloffRate: 0.8 },
            comforting: { peakHours: [15, 16, 17, 18, 19], falloffRate: 0.7 },
            nurturing: { peakHours: [16, 17, 18, 19], falloffRate: 0.8 },
            stabilizing: { peakHours: [11, 12, 13, 16, 17], falloffRate: 0.9 },
            centering: { peakHours: [6, 7, 17, 18, 19], falloffRate: 0.8 },
            balancing: { peakHours: [9, 10, 11, 14, 15, 16], falloffRate: 0.6 },
            elevating: { peakHours: [8, 9, 10, 15, 16], falloffRate: 1.1 },
            renewing: { peakHours: [7, 8, 14, 15, 16], falloffRate: 1.0 },
            restorative: { peakHours: [17, 18, 19, 20], falloffRate: 0.8 }
        };
        
        // Caffeine metabolism factors
        this.caffeineHalfLife = 5.5; // hours (average for most adults)
        this.caffeinePeakTime = 0.75; // hours after consumption when caffeine peaks
        
        // Sleep disruption threshold (on a 0-10 scale)
        this.sleepDisruptionThreshold = 3.0;
    }
    
    // Main API method following standardized calculator pattern
    calculate(tea) {
        const inference = this.infer(tea);
        return {
            inference: this.formatInference(inference),
            data: this.serialize(inference)
        };
    }
    
    // Core inference method
    infer(tea) {
        // Validate tea object
        tea = validateObject(tea);
        
        // Use createSafeTea for default values
        const safeTea = createSafeTea(tea);
        
        // Calculate time scores
        const timeScores = this._calculateTimeScores(safeTea);
        
        // Find best time ranges
        const bestTimeRanges = this._findBestTimeRanges(timeScores);
        
        // Determine effect alignment for this tea
        const effectAlignment = this._determineEffectAlignment(safeTea);
        
        // Calculate key ratios
        const lTheanineToCaffeineRatio = safeTea.lTheanineLevel / safeTea.caffeineLevel;
        
        // Define the profile based on tea properties
        let teaProfile = {
            teaType: safeTea.type || 'unknown',
            caffeineLevel: safeTea.caffeineLevel || 3,
            lTheanineLevel: safeTea.lTheanineLevel || 3,
            processingLevel: this._calculateProcessingLevel(safeTea.processingMethods || []),
            season: safeTea.geography?.harvestSeason || this._getSeason(safeTea.geography?.harvestMonth),
            timeOfDay: null, // Will be calculated
            primaryEffects: [], // Remove reference to expectedEffects - let timing be based on actual calculated effects
            geography: {
                altitude: safeTea.geography?.altitude || 500,
                humidity: safeTea.geography?.humidity || 60,
                latitude: safeTea.geography?.latitude || 30
            }
        };
        
        return {
            timeScores,
            timeRanges: bestTimeRanges,
            effectAlignment,
            lTheanineToCaffeineRatio,
            teaType: safeTea.type,
            caffeineLevel: safeTea.caffeineLevel,
            lTheanineLevel: safeTea.lTheanineLevel,
            primaryEffects: safeTea.expectedEffects ? [
                safeTea.expectedEffects.dominant,
                safeTea.expectedEffects.supporting
            ].filter(Boolean) : []
        };
    }
    
    // Format inference as markdown
    formatInference(inference) {
        const { 
            timeRanges, 
            effectAlignment, 
            lTheanineToCaffeineRatio, 
            teaType, 
            caffeineLevel, 
            lTheanineLevel,
            primaryEffects
        } = inference;
        
        let md = `# ${teaType.charAt(0).toUpperCase() + teaType.slice(1)} Tea Timing Analysis\n\n`;
        
        // Tea Properties
        md += `## Tea Properties\n`;
        md += `- Caffeine Level: ${caffeineLevel}/10\n`;
        md += `- L-Theanine Level: ${lTheanineLevel}/10\n`;
        md += `- L-Theanine to Caffeine Ratio: ${lTheanineToCaffeineRatio.toFixed(2)}:1\n\n`;
        
        // Primary Effects
        md += `## Primary Effects\n`;
        if (effectAlignment && effectAlignment.length > 0) {
            effectAlignment.forEach(({ effect, score }, index) => {
                md += `${index + 1}. ${effect.charAt(0).toUpperCase() + effect.slice(1)} (${score.toFixed(1)}/10)\n`;
            });
        } else {
            md += `No dominant effects identified.\n`;
        }
        md += '\n';
        
        // Timing Recommendations
        md += `## Optimal Drinking Times\n`;
        if (timeRanges && timeRanges.recommendations && timeRanges.recommendations.length > 0) {
            timeRanges.recommendations.forEach((range, index) => {
                md += `${index + 1}. ${range.timeRange} (score: ${range.avgScore.toFixed(1)}/10)\n`;
                md += `   - ${range.reason}\n`;
            });
        } else {
            md += `No specific optimal times identified.\n`;
        }
        md += '\n';
        
        // Cautionary Times
        if (timeRanges && timeRanges.cautionaryTimes && timeRanges.cautionaryTimes.length > 0) {
            md += `## Times to Avoid\n`;
            timeRanges.cautionaryTimes.forEach((range, index) => {
                md += `${index + 1}. ${range.timeRange} (score: ${range.avgScore.toFixed(1)}/10)\n`;
                md += `   - ${range.reason}\n`;
            });
            md += '\n';
        }
        
        // Scientific Basis
        md += `## Scientific Basis\n`;
        if (caffeineLevel > 6) {
            md += `- High caffeine content suggests avoiding consumption within ${this.caffeineHalfLife} hours of bedtime\n`;
        }
        if (lTheanineToCaffeineRatio > 1.5) {
            md += `- High L-theanine to caffeine ratio produces a calming effect with focused alertness\n`;
        } else if (lTheanineToCaffeineRatio < 0.8) {
            md += `- Lower L-theanine to caffeine ratio produces a more stimulating effect\n`;
        }
        
        // Effect Timing Analysis
        md += `\n## Effect Timing Analysis\n`;
        if (primaryEffects && primaryEffects.length > 0) {
            primaryEffects.forEach(effect => {
                const timing = this.effectTimingMap[effect];
                if (timing) {
                    const peakHours = timing.peakHours.map(h => 
                        `${h % 12 || 12}${h < 12 ? 'AM' : 'PM'}`
                    ).join(', ');
                    md += `- ${effect.charAt(0).toUpperCase() + effect.slice(1)}: Peak hours at ${peakHours}\n`;
                }
            });
        } else {
            md += `No specific effect timing available.\n`;
        }
        
        return md;
    }
    
    // Serialize inference for JSON export
    serialize(inference) {
        const { timeScores, timeRanges, effectAlignment, teaType } = inference;
        
        // Build chart data for visualization
        const chartData = {
            labels: Array.from({ length: 24 }, (_, i) => {
                const hour = i % 12 || 12;
                return `${hour}${i < 12 ? 'AM' : 'PM'}`;
            }),
            datasets: [
                {
                    label: "Tea Suitability",
                    data: Object.values(timeScores || {}),
                    type: 'bar',
                    yAxisID: 'y'
                },
                {
                    label: "Circadian Alertness",
                    data: Object.values(this.baselineAlertness),
                    type: 'line',
                    yAxisID: 'y1',
                    borderColor: '#3498db',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                }
            ]
        };
        
        const recommended = (timeRanges?.recommendations || []).map(range => ({
            timeOfDay: range.timeRange,
            score: range.avgScore,
            reason: range.reason
        }));
        
        const notRecommended = (timeRanges?.cautionaryTimes || []).map(range => ({
            timeOfDay: range.timeRange,
            score: range.avgScore,
            reason: range.reason
        }));
        
        return {
            recommended,
            notRecommended,
            chartData,
            timeScores: timeScores || {},
            effectAlignment: effectAlignment || []
        };
    }
    
    // Calculate suitability scores for each hour of the day
    _calculateTimeScores(tea) {
        const timeScores = {};
        
        // Calculate L-Theanine to Caffeine ratio
        const lTheanineToCaffeineRatio = tea.lTheanineLevel / tea.caffeineLevel;
        
        // Adjust for caffeine sensitivity (evening penalty)
        const caffeineImpact = this._calculateCaffeineImpact(tea.caffeineLevel);
        
        // Get effect alignment from tea type and processing
        const effectAlignment = this._determineEffectAlignment(tea);
        
        // Time-based scaling factors (stronger contrast between good/bad times)
        const timeScalingFactors = {
            // Night hours (very low suitability)
            0: 0.15, 1: 0.12, 2: 0.1, 3: 0.1, 4: 0.15, 
            // Early morning (rising suitability)
            5: 0.3, 6: 0.6, 
            // Day hours (full potential)
            7: 0.9, 8: 1.0, 9: 1.0, 10: 1.0, 11: 1.0, 12: 1.0, 13: 1.0, 14: 1.0, 15: 1.0, 16: 0.9,
            // Evening (declining suitability)
            17: 0.7, 18: 0.5, 19: 0.4, 20: 0.3, 21: 0.25, 22: 0.2, 23: 0.17
        };
        
        // Calculate score for each hour
        this.timeIntervals.forEach(hour => {
            // Base score from effect timing alignment
            let score = this._calculateEffectTimingScore(hour, effectAlignment);
            
            // Adjust for caffeine impact - reduce evening scores based on caffeine level
            if (hour >= 14) { // After 2 PM
                const hoursBeforeMidnight = 24 - hour;
                // Stronger penalty as we get closer to sleep time
                const caffeineTimePenalty = (hoursBeforeMidnight < this.caffeineHalfLife * 1.5) 
                    ? caffeineImpact * (1 - (hoursBeforeMidnight / (this.caffeineHalfLife * 2)))
                    : 0;
                score -= caffeineTimePenalty;
            }
            
            // L-Theanine modulation - reduces the negative effect of caffeine
            if (lTheanineToCaffeineRatio > 1) {
                // L-Theanine helps mitigate caffeine's sleep disruption
                score += Math.min((lTheanineToCaffeineRatio - 1) * 0.5, 1.5);
            }
            
            // Align with natural alertness cycle
            const alertnessAlignment = this._calculateAlertnessAlignment(hour, effectAlignment);
            score = score * 0.7 + alertnessAlignment * 0.3;
            
            // Apply time-based scaling factor
            score *= timeScalingFactors[hour];
            
            // Normalize score to 0-10 range
            timeScores[hour] = Math.max(0, Math.min(10, score));
        });
        
        return timeScores;
    }
    
    // Calculate the impact of caffeine based on its level
    _calculateCaffeineImpact(caffeineLevel) {
        // Scale from 0-10 to actual impact factor
        return (caffeineLevel / 10) * 3.5;
    }
    
    // Determine dominant effects based on tea properties
    _determineEffectAlignment(tea) {
        // Simplified effect determination
        const effectScores = {};
        
        // Base the scores on L-Theanine to Caffeine ratio instead
        if (tea.lTheanineLevel !== undefined && tea.caffeineLevel !== undefined) {
            const ratio = tea.lTheanineLevel / tea.caffeineLevel;
            
            if (ratio > 1.5) {
                effectScores["peaceful"] = Math.min(10, tea.lTheanineLevel * 0.8);
                effectScores["soothing"] = Math.min(10, tea.lTheanineLevel * 0.7);
            }
            
            if (ratio < 1.0) {
                effectScores["revitalizing"] = Math.min(10, tea.caffeineLevel * 0.9);
                effectScores["awakening"] = Math.min(10, tea.caffeineLevel * 0.7);
            }
        }
        
        // Use expected effects if provided
        if (tea.expectedEffects) {
            if (tea.expectedEffects.dominant) {
                effectScores[tea.expectedEffects.dominant] = 9;
            }
            if (tea.expectedEffects.supporting) {
                effectScores[tea.expectedEffects.supporting] = 7;
            }
        }
        
        // Sort effects by score and return top 3
        return sortByProperty(
            Object.entries(effectScores).map(([effect, score]) => ({ effect, score })),
            'score'
        ).slice(0, 3);
    }
    
    // Calculate score based on effect timing alignment
    _calculateEffectTimingScore(hour, effectAlignment) {
        let score = 0;
        
        effectAlignment.forEach(({ effect, score: effectScore }, index) => {
            // Weight by position (dominant effect has more influence)
            const weight = 1 - (index * 0.25);
            
            // Effect has mapping in the timing map
            if (this.effectTimingMap[effect]) {
                const { peakHours, falloffRate } = this.effectTimingMap[effect];
                
                // Perfect match - effect is at peak during this hour
                if (peakHours.includes(hour)) {
                    score += effectScore * weight;
                } else {
                    // Calculate how far from ideal time
                    const closestPeakHour = peakHours.reduce((closest, peak) => {
                        const distance = Math.min(
                            Math.abs(hour - peak),
                            Math.abs((hour + 24) - peak),
                            Math.abs(hour - (peak + 24))
                        );
                        return distance < closest.distance ? { peak, distance } : closest;
                    }, { peak: peakHours[0], distance: 24 });
                    
                    // Apply distance penalty based on falloff rate
                    const distancePenalty = closestPeakHour.distance * falloffRate;
                    score += Math.max(0, (effectScore - distancePenalty) * weight);
                }
            }
        });
        
        // Normalize to base 10
        return score;
    }
    
    // Calculate alignment with natural alertness cycle
    _calculateAlertnessAlignment(hour, effectAlignment) {
        const alertness = this.baselineAlertness[hour];
        let score = 5; // Neutral base score
        
        // Check if any effects favor high or low alertness
        const highAlertnessEffects = ['revitalizing', 'awakening', 'clarifying'];
        const lowAlertnessEffects = ['soothing', 'peaceful', 'centering'];
        
        effectAlignment.forEach(({ effect, score: effectScore }) => {
            if (highAlertnessEffects.includes(effect)) {
                // High alertness effects match well with high alertness times
                score += (alertness / 10) * effectScore * 0.2;
            } else if (lowAlertnessEffects.includes(effect)) {
                // Low alertness effects match well with low alertness times
                score += ((10 - alertness) / 10) * effectScore * 0.2;
            }
        });
        
        return score;
    }
    
    // Find the best time ranges for tea consumption
    _findBestTimeRanges(timeScores) {
        const recommendations = [];
        const cautionaryTimes = [];
        
        // Convert timeScores to array of {hour, score} objects
        const timeScoreArray = Object.entries(timeScores)
            .map(([hour, score]) => ({
                hour: parseInt(hour),
                score
            }))
            .sort((a, b) => b.score - a.score); // Sort by score descending
        
        // Group adjacent high-score hours into ranges
        let currentRange = null;
        
        timeScoreArray.forEach(entry => {
            if (entry.score >= 7) {
                if (!currentRange) {
                    currentRange = { start: entry.hour, end: entry.hour, avgScore: entry.score };
                } else {
                    // If adjacent hour, extend range
                    if (entry.hour === currentRange.end + 1) {
                        currentRange.end = entry.hour;
                        currentRange.avgScore = (currentRange.avgScore + entry.score) / 2;
                    } else {
                        // Start new range
                        recommendations.push({
                            timeRange: this._formatTimeRange(currentRange.start, currentRange.end),
                            avgScore: currentRange.avgScore,
                            reason: this._getTimeRangeReason(currentRange, true)
                        });
                        currentRange = { start: entry.hour, end: entry.hour, avgScore: entry.score };
                    }
                }
            } else if (currentRange) {
                recommendations.push({
                    timeRange: this._formatTimeRange(currentRange.start, currentRange.end),
                    avgScore: currentRange.avgScore,
                    reason: this._getTimeRangeReason(currentRange, true)
                });
                currentRange = null;
            }
        });
        
        // Add any remaining range
        if (currentRange) {
            recommendations.push({
                timeRange: this._formatTimeRange(currentRange.start, currentRange.end),
                avgScore: currentRange.avgScore,
                reason: this._getTimeRangeReason(currentRange, true)
            });
        }
        
        // Find cautionary times (low scores)
        const lowScoreThreshold = 3;
        let cautionaryStart = null;
        
        for (let hour = 0; hour < 24; hour++) {
            const score = timeScores[hour];
            
            if (score < lowScoreThreshold) {
                if (cautionaryStart === null) {
                    cautionaryStart = hour;
                }
            } else if (cautionaryStart !== null) {
                cautionaryTimes.push({
                    timeRange: this._formatTimeRange(cautionaryStart, hour - 1),
                    avgScore: score,
                    reason: this._getTimeRangeReason({ start: cautionaryStart, end: hour - 1, score }, false)
                });
                cautionaryStart = null;
            }
        }
        
        // Handle case where cautionary period extends to end of day
        if (cautionaryStart !== null) {
            cautionaryTimes.push({
                timeRange: this._formatTimeRange(cautionaryStart, 23),
                avgScore: timeScores[23],
                reason: this._getTimeRangeReason({ start: cautionaryStart, end: 23, score: timeScores[23] }, false)
            });
        }
        
        return {
            recommendations,
            cautionaryTimes
        };
    }
    
    // Format time range as string (e.g., "6AM-9AM")
    _formatTimeRange(start, end) {
        const formatHour = hour => {
            const h = hour % 12 || 12;
            return `${h}${hour < 12 ? 'AM' : 'PM'}`;
        };
        return start === end ? formatHour(start) : `${formatHour(start)}-${formatHour(end)}`;
    }
    
    // Get reason for time range recommendation
    _getTimeRangeReason(range, isRecommended) {
        const startHour = range.start;
        const endHour = range.end;
        
        if (isRecommended) {
            if (startHour >= 5 && endHour <= 11) {
                return "Morning hours provide optimal alertness and focus";
            } else if (startHour >= 12 && endHour <= 16) {
                return "Afternoon hours offer sustained energy without sleep disruption";
            } else if (startHour >= 17 && endHour <= 20) {
                return "Early evening hours for relaxation and winding down";
            }
        } else {
            if (startHour >= 21 || endHour <= 4) {
                return "Night hours may disrupt sleep patterns";
            } else if (startHour >= 13 && endHour <= 15) {
                return "Post-lunch hours may cause drowsiness";
            }
        }
        
        return isRecommended ? "Optimal time based on tea properties" : "Less ideal time for consumption";
    }
    
    // Calculate processing level based on processing methods
    _calculateProcessingLevel(processingMethods) {
        if (!processingMethods || !Array.isArray(processingMethods) || processingMethods.length === 0) {
            return 5; // Default/medium processing level
        }
        
        // Processing methods that indicate heavy processing
        const heavyProcessing = [
            'roasted', 'heavy-roast', 'charcoal-roasted', 'pile-fermented', 
            'post-fermented', 'aged', 'compressed'
        ];
        
        // Processing methods that indicate light processing
        const lightProcessing = [
            'steamed', 'sun-dried', 'minimal-processing', 'shade-grown', 
            'withered', 'baked'
        ];
        
        // Count occurrences of each processing type
        const heavyCount = processingMethods.filter(method => 
            heavyProcessing.some(heavy => method.toLowerCase().includes(heavy.toLowerCase()))
        ).length;
        
        const lightCount = processingMethods.filter(method => 
            lightProcessing.some(light => method.toLowerCase().includes(light.toLowerCase()))
        ).length;
        
        // Calculate processing level (1-10 scale)
        // 1-3: Light processing, 4-7: Medium processing, 8-10: Heavy processing
        let processingLevel = 5; // Default medium
        
        if (heavyCount > lightCount) {
            // More heavy processing methods
            processingLevel = 7 + Math.min(heavyCount, 3);
        } else if (lightCount > heavyCount) {
            // More light processing methods
            processingLevel = 4 - Math.min(lightCount, 3);
        }
        
        return Math.max(1, Math.min(10, processingLevel));
    }
    
    // Get season from harvest month
    _getSeason(harvestMonth) {
        if (!harvestMonth || typeof harvestMonth !== 'number') {
            return 'spring'; // Default to spring
        }
        
        // Northern hemisphere seasons
        if (harvestMonth >= 3 && harvestMonth <= 5) {
            return 'spring';
        } else if (harvestMonth >= 6 && harvestMonth <= 8) {
            return 'summer';
        } else if (harvestMonth >= 9 && harvestMonth <= 11) {
            return 'autumn';
        } else {
            return 'winter';
        }
    }
}

export default TimingCalculator;
