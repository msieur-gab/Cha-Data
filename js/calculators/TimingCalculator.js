// TimingCalculator.js
// Calculate optimal drinking times for teas with a scientific approach

import { validateObject, createSafeTea, sortByProperty } from '../utils/helpers.js';

export class TimingCalculator {
    constructor(config, primaryEffects, compoundData) {
        this.config = config;
        this.primaryEffects = primaryEffects;
        this.compoundData = compoundData;
        
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
    
    // Main API method
    calculate(tea) {
        // Validate tea object
        tea = validateObject(tea);
        
        // Use createSafeTea for default values
        const safeTea = createSafeTea(tea);
        
        const inference = this.infer(safeTea);
        return {
            inference: this.formatInference(inference),
            data: this.serialize(inference)
        };
    }
    
    // Inferencer: Produces raw insights and reasoning
    infer(tea) {
        const timeScores = this._calculateTimeScores(tea);
        const bestTimeRanges = this._findBestTimeRanges(timeScores);
        const effectAlignment = this._determineEffectAlignment(tea);
        const lTheanineToCaffeineRatio = tea.lTheanineLevel / tea.caffeineLevel;
        
        return {
            timeScores,
            timeRanges: {
                recommendations: bestTimeRanges.recommendations || [],
                cautionaryTimes: bestTimeRanges.cautionaryTimes || []
            },
            effectAlignment,
            lTheanineToCaffeineRatio,
            teaType: tea.type,
            caffeineLevel: tea.caffeineLevel,
            lTheanineLevel: tea.lTheanineLevel,
            primaryEffects: tea.primaryEffects || []
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
        effectAlignment.forEach(({ effect, score }, index) => {
            md += `${index + 1}. ${effect.charAt(0).toUpperCase() + effect.slice(1)} (${score.toFixed(1)}/10)\n`;
        });
        md += '\n';
        
        // Timing Recommendations
        md += `## Optimal Drinking Times\n`;
        timeRanges.recommendations.forEach((range, index) => {
            md += `${index + 1}. ${range.timeRange} (score: ${range.avgScore.toFixed(1)}/10)\n`;
            md += `   - ${range.reason}\n`;
        });
        md += '\n';
        
        // Cautionary Times
        if (timeRanges.cautionaryTimes.length > 0) {
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
        primaryEffects.forEach(effect => {
            const timing = this.effectTimingMap[effect];
            if (timing) {
                const peakHours = timing.peakHours.map(h => 
                    `${h % 12 || 12}${h < 12 ? 'AM' : 'PM'}`
                ).join(', ');
                md += `- ${effect.charAt(0).toUpperCase() + effect.slice(1)}: Peak hours at ${peakHours}\n`;
            }
        });
        
        return md;
    }
    
    // Serializer: Transforms insights into structured JSON
    serialize(inference) {
        const { timeScores, timeRanges } = inference;
        
        return {
            recommended: timeRanges.recommendations.map(range => ({
                timeOfDay: range.timeRange,
                score: range.avgScore,
                reason: range.reason
            })),
            notRecommended: timeRanges.cautionaryTimes.map(range => ({
                timeOfDay: range.timeRange,
                score: range.avgScore,
                reason: range.reason
            })),
            chartData: {
                labels: Array.from({ length: 24 }, (_, i) => {
                    const hour = i % 12 || 12;
                    return `${hour}${i < 12 ? 'AM' : 'PM'}`;
                }),
                datasets: [
                    {
                        label: "Tea Suitability",
                        data: Object.values(timeScores),
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
            }
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
        
        // Base effects by tea type
        switch (tea.type.toLowerCase()) {
            case 'green':
                effectScores.revitalizing = 4;
                effectScores.soothing = 5;
                effectScores.clarifying = 6;
                break;
            case 'black':
                effectScores.revitalizing = 8;
                effectScores.awakening = 7;
                effectScores.nurturing = 5;
                break;
            case 'oolong':
                effectScores.balancing = 7;
                effectScores.elevating = 6;
                effectScores.reflective = 5;
                break;
            case 'white':
                effectScores.peaceful = 8;
                effectScores.soothing = 6;
                effectScores.reflective = 5;
                break;
            case 'puerh':
                effectScores.centering = 7;
                effectScores.stabilizing = 8;
                effectScores.nurturing = 6;
                break;
            default:
                effectScores.balancing = 5;
        }
        
        // Adjust for caffeine/L-theanine ratio
        const ratio = tea.lTheanineLevel / tea.caffeineLevel;
        if (ratio > 1.5) {
            // High L-theanine to caffeine promotes calming effects
            effectScores.soothing = (effectScores.soothing || 0) + 3;
            effectScores.peaceful = (effectScores.peaceful || 0) + 2;
            effectScores.clarifying = (effectScores.clarifying || 0) + 2;
        } else if (ratio < 0.8) {
            // High caffeine to L-theanine promotes stimulating effects
            effectScores.revitalizing = (effectScores.revitalizing || 0) + 3;
            effectScores.awakening = (effectScores.awakening || 0) + 2;
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
        
        // Find peaks (local maxima)
        const peaks = timeScoreArray.filter((entry, i, arr) => {
            const prev = i > 0 ? arr[i-1].score : 0;
            const next = i < arr.length - 1 ? arr[i+1].score : 0;
            return entry.score > prev && entry.score > next && entry.score >= 7;
        });
        
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
    
    // Generate chart-ready data
    _generateChartData(timeScores) {
        return Object.entries(timeScores).map(([hour, score]) => ({
            hour: parseInt(hour),
            time: this._formatHour(parseInt(hour)),
            score: parseFloat(score.toFixed(2))
        }));
    }
    
    // Generate explanation text
    _generateExplanation(tea, bestTimes) {
        if (bestTimes.length === 0) {
            return "This tea doesn't have strongly defined optimal times. It can be enjoyed throughout the day.";
        }
        
        const mainTime = bestTimes[0];
        let explanation = `${tea.type.charAt(0).toUpperCase() + tea.type.slice(1)} tea with caffeine level ${tea.caffeineLevel}/10 and L-theanine level ${tea.lTheanineLevel}/10 (ratio: ${(tea.lTheanineLevel/tea.caffeineLevel).toFixed(2)}:1).\n\n`;
        
        explanation += `Primary optimal drinking time: ${mainTime.timeRange} (score: ${mainTime.avgScore.toFixed(1)}/10).\n`;
        
        if (bestTimes.length > 1) {
            explanation += `Secondary optimal times: ${bestTimes.slice(1, 3).map(t => t.timeRange).join(', ')}.\n`;
        }
        
        // Add scientific reasoning
        explanation += "\nScientific basis:\n";
        
        if (tea.caffeineLevel > 6) {
            explanation += "• High caffeine content suggests avoiding consumption within 6 hours of bedtime to prevent sleep disruption.\n";
        }
        
        if (tea.lTheanineLevel / tea.caffeineLevel > 1.5) {
            explanation += "• High L-theanine to caffeine ratio produces a calming effect with focused alertness, making it suitable for focused work or relaxation.\n";
        } else if (tea.lTheanineLevel / tea.caffeineLevel < 0.8) {
            explanation += "• Lower L-theanine to caffeine ratio produces a more stimulating effect, making it optimal for mornings or physical activities.\n";
        }
        
        return explanation;
    }

    // Generate chart data for visualization
    _generateChartData() {
        const labels = Array.from({ length: 24 }, (_, i) => {
            const hour = i % 12 || 12;
            return `${hour}${i < 12 ? 'AM' : 'PM'}`;
        });

        const timeScores = this._calculateTimeScores(this.tea);
        const teaData = Object.values(timeScores);
        const circadianData = Object.values(this.baselineAlertness);

        return {
            labels,
            datasets: [
                {
                    label: "Tea Suitability",
                    data: teaData,
                    type: 'bar',
                    yAxisID: 'y'
                },
                {
                    label: "Circadian Alertness",
                    data: circadianData,
                    type: 'line',
                    yAxisID: 'y1',
                    borderColor: '#3498db',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                }
            ]
        };
    }

    // Format timing recommendations for JSON export
    _formatTimingRecommendations() {
        const timeRanges = this._findBestTimeRanges();
        return {
            recommended: timeRanges.recommendations.map(timeRange => ({
                timeOfDay: timeRange.timeRange,
                score: timeRange.avgScore,
                reason: timeRange.reason || "Optimal time based on tea properties and circadian rhythm"
            })),
            notRecommended: timeRanges.cautionaryTimes.map(timeRange => ({
                timeOfDay: timeRange.timeRange,
                score: timeRange.avgScore,
                reason: timeRange.reason || "Not recommended due to time of day and tea properties"
            })),
            chartData: this._generateChartData(),
            explanation: this._generateExplanation()
        };
    }
}

export default TimingCalculator; 