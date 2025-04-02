// TimingCalculator.js
// Calculate optimal drinking times for teas with a scientific approach

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
    
    // Calculate optimal timing for a tea based on its properties
    calculateOptimalTiming(tea) {
        // Validate tea object
        if (!tea || typeof tea !== 'object') {
            return { error: 'Invalid tea object' };
        }
        
        // Default values for missing properties
        const safeTea = {
            caffeineLevel: tea.caffeineLevel !== undefined ? tea.caffeineLevel : 3,
            lTheanineLevel: tea.lTheanineLevel !== undefined ? tea.lTheanineLevel : 5,
            type: tea.type || 'unknown',
            flavorProfile: Array.isArray(tea.flavorProfile) ? tea.flavorProfile : [],
            processingMethods: Array.isArray(tea.processingMethods) ? tea.processingMethods : []
        };
        
        // Calculate time-based suitability scores
        const timeScores = this._calculateTimeScores(safeTea);
        
        // Determine best time ranges
        const bestTimes = this._findBestTimeRanges(timeScores);
        
        // Generate full day data for plotting
        const chartData = this._generateChartData(timeScores);
        
        return {
            timeScores,
            bestTimes,
            chartData,
            explanation: this._generateExplanation(safeTea, bestTimes)
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
        return Object.entries(effectScores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([effect, score]) => ({ effect, score }));
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
    
    // Find best time ranges based on scores
    _findBestTimeRanges(timeScores) {
        // Convert to array for easier processing
        const hourScores = Object.entries(timeScores)
            .map(([hour, score]) => ({ hour: parseInt(hour), score }))
            .sort((a, b) => a.hour - b.hour);
        
        // Find peaks (local maxima)
        const peaks = hourScores.filter((entry, i, arr) => {
            const prev = i > 0 ? arr[i-1].score : 0;
            const next = i < arr.length - 1 ? arr[i+1].score : 0;
            return entry.score > prev && entry.score > next && entry.score >= 7;
        });
        
        // Group adjacent high-score hours into ranges
        const ranges = [];
        let currentRange = null;
        
        hourScores.forEach(entry => {
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
                        ranges.push(currentRange);
                        currentRange = { start: entry.hour, end: entry.hour, avgScore: entry.score };
                    }
                }
            } else if (currentRange) {
                ranges.push(currentRange);
                currentRange = null;
            }
        });
        
        // Add any remaining range
        if (currentRange) {
            ranges.push(currentRange);
        }
        
        // Sort by average score
        return ranges.map(range => ({
            ...range,
            // Format for display
            timeRange: `${this._formatHour(range.start)} - ${this._formatHour(range.end)}`
        })).sort((a, b) => b.avgScore - a.avgScore);
    }
    
    // Format hour to AM/PM format
    _formatHour(hour) {
        const period = hour < 12 ? 'AM' : 'PM';
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${displayHour}:00 ${period}`;
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
}

export default TimingCalculator; 