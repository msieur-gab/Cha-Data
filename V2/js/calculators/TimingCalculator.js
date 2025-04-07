// TimingCalculator.js
// Handles calculations related to tea effect timing and duration

import { BaseCalculator } from './BaseCalculator.js';

export class TimingCalculator extends BaseCalculator {
    constructor(config) {
        super(config);
        this.effectTimings = {};
    }
    
    // Set effect timing data
    setEffectTimings(timings) {
        this.effectTimings = timings || {};
    }
    
    // Override infer method from BaseCalculator
    infer(tea) {
        if (!tea) {
            return {
                description: 'No tea data available for timing analysis',
                timing: {
                    onset: 0,
                    peak: 0,
                    duration: 0
                },
                phases: [],
                timingEffects: {}
            };
        }
        
        // Extract relevant data
        const teaType = tea.type || '';
        const caffeineLevel = tea.caffeineLevel || 0;
        const lTheanineLevel = tea.lTheanineLevel || 0;
        const catechinLevel = tea.catechinLevel || 0;
        
        // Calculate base timing data
        const timing = this.calculateBaseTiming(tea);
        
        // Calculate effect phases
        const phases = this.calculateEffectPhases(timing, tea);
        
        // Calculate timing-specific effects
        const timingEffects = this.calculateTimingEffects(timing, phases, tea);
        
        // Generate description
        const description = this.generateTimingDescription(timing, phases, tea);
        
        return {
            description,
            timing,
            phases,
            timingEffects
        };
    }
    
    // Override formatInference from BaseCalculator
    formatInference(inference) {
        if (!inference || !inference.timing) {
            return '## Effect Timing Analysis\n\nNo timing data available.';
        }
        
        let md = '## Effect Timing Analysis\n\n';
        
        // Add description
        md += `${inference.description}\n\n`;
        
        // Add basic timing info
        md += '### Key Timing Points\n';
        md += `- **Onset**: ${inference.timing.onset} minutes\n`;
        md += `- **Peak Effects**: ${inference.timing.peak} minutes\n`;
        md += `- **Total Duration**: ${inference.timing.duration} minutes\n\n`;
        
        // Add effect phases
        md += '### Effect Phases\n';
        
        if (inference.phases && inference.phases.length > 0) {
            inference.phases.forEach(phase => {
                md += `#### ${phase.name} (${phase.start}-${phase.end} minutes)\n`;
                md += `${phase.description}\n\n`;
                
                if (phase.effects && Object.keys(phase.effects).length > 0) {
                    md += 'Primary effects during this phase:\n';
                    
                    Object.entries(phase.effects).forEach(([effect, intensity]) => {
                        const bars = '■'.repeat(Math.floor(intensity / 2)) + 
                                   '□'.repeat(5 - Math.floor(intensity / 2));
                        md += `- **${effect}**: [${bars}] ${intensity}/10\n`;
                    });
                    
                    md += '\n';
                }
            });
        } else {
            md += 'No specific effect phases identified.\n\n';
        }
        
        // Add timing-specific effects
        md += '### Timing-Based Effects\n';
        
        if (inference.timingEffects && Object.keys(inference.timingEffects).length > 0) {
            Object.entries(inference.timingEffects).forEach(([effect, details]) => {
                md += `- **${effect}**: ${details.description}\n`;
                
                if (details.duration) {
                    md += `  Duration: ~${details.duration} minutes\n`;
                }
            });
        } else {
            md += 'No timing-specific effects identified.\n';
        }
        
        return md;
    }
    
    // Override serialize from BaseCalculator
    serialize(inference) {
        if (!inference) {
            return {
                timing: {
                    description: 'No timing data available',
                    onset: 0,
                    peak: 0,
                    duration: 0,
                    phases: [],
                    effects: {},
                    _sectionRef: "timing"
                }
            };
        }
        
        return {
            timing: {
                description: inference.description,
                onset: inference.timing.onset,
                peak: inference.timing.peak,
                duration: inference.timing.duration,
                phases: inference.phases,
                effects: inference.timingEffects,
                _sectionRef: "timing"
            }
        };
    }
    
    // Calculate base timing for tea effects
    calculateBaseTiming(tea) {
        // Default values for a standard tea
        let onset = 15;     // 15 minutes until effects begin
        let peak = 30;      // 30 minutes until peak effects
        let duration = 180; // 3 hours total duration
        
        // Extract key factors
        const teaType = tea.type || '';
        const caffeineLevel = tea.caffeineLevel || 0;
        const lTheanineLevel = tea.lTheanineLevel || 0;
        
        // Adjust based on caffeine level (higher = faster onset, longer duration)
        if (caffeineLevel > 0) {
            onset = Math.max(5, onset - (caffeineLevel - 5));
            peak = Math.max(20, peak - (caffeineLevel - 5) * 2);
            duration = Math.min(360, duration + (caffeineLevel * 15));
        }
        
        // Adjust based on L-theanine level (higher = gentler onset, longer duration)
        if (lTheanineLevel > 0) {
            onset = Math.min(25, onset + (lTheanineLevel - 5));
            peak = Math.min(45, peak + (lTheanineLevel - 5) * 2);
            duration = Math.min(360, duration + (lTheanineLevel * 10));
        }
        
        // Adjust based on tea type
        if (teaType === 'green') {
            // Green tea: faster onset, moderate duration
            onset = Math.max(5, onset - 3);
            duration = Math.min(240, duration + 20);
        } else if (teaType === 'black') {
            // Black tea: fast onset, shorter duration
            onset = Math.max(5, onset - 5);
            peak = Math.max(15, peak - 5);
            duration = Math.max(120, duration - 30);
        } else if (teaType === 'white') {
            // White tea: gentle onset, moderate duration
            onset = Math.min(25, onset + 5);
            peak = Math.min(45, peak + 10);
            duration = Math.min(270, duration + 30);
        } else if (teaType.includes('puerh') || teaType === 'dark') {
            // Puerh/dark tea: moderate onset, long duration
            onset = Math.min(20, onset + 2);
            peak = Math.min(40, peak + 5);
            duration = Math.min(480, duration + 120);
        } else if (teaType === 'oolong') {
            // Oolong: balanced timing
            duration = Math.min(300, duration + 60);
        }
        
        // Process-specific adjustments (if available)
        if (tea.processing) {
            if (tea.processing.oxidationLevel > 70) {
                // High oxidation: faster onset
                onset = Math.max(5, onset - 3);
                peak = Math.max(15, peak - 5);
            } else if (tea.processing.oxidationLevel < 20) {
                // Low oxidation: gentler onset
                onset = Math.min(25, onset + 3);
            }
            
            // Firing methods can affect duration
            if (tea.processing.firing && tea.processing.firing.includes('charcoal')) {
                // Charcoal firing: longer duration
                duration = Math.min(360, duration + 60);
            }
        }
        
        return {
            onset,
            peak,
            duration
        };
    }
    
    // Calculate effect phases based on timing
    calculateEffectPhases(timing, tea) {
        const { onset, peak, duration } = timing;
        const phases = [];
        
        // Phase 1: Initial onset
        phases.push({
            name: 'Initial onset',
            start: 0,
            end: onset,
            description: 'The first subtle effects begin to emerge as compounds start to be absorbed.',
            effects: this.calculatePhaseEffects(1, tea)
        });
        
        // Phase 2: Rising effects
        phases.push({
            name: 'Rising effects',
            start: onset,
            end: peak,
            description: 'Effects progressively intensify as compounds reach higher blood concentrations.',
            effects: this.calculatePhaseEffects(2, tea)
        });
        
        // Phase 3: Peak effects
        const peakDuration = Math.round(duration * 0.25); // Peak lasts about 1/4 of total duration
        phases.push({
            name: 'Peak effects',
            start: peak,
            end: peak + peakDuration,
            description: 'Maximum intensity of effects as compounds reach optimal concentrations.',
            effects: this.calculatePhaseEffects(3, tea)
        });
        
        // Phase 4: Sustained effects
        const sustainedEnd = Math.round(duration * 0.75); // Sustained lasts until 3/4 of duration
        phases.push({
            name: 'Sustained effects',
            start: peak + peakDuration,
            end: sustainedEnd,
            description: 'Effects maintain a steady presence with gradual reduction in intensity.',
            effects: this.calculatePhaseEffects(4, tea)
        });
        
        // Phase 5: Tapering effects
        phases.push({
            name: 'Tapering effects',
            start: sustainedEnd,
            end: duration,
            description: 'Effects gradually diminish as compounds are metabolized and cleared.',
            effects: this.calculatePhaseEffects(5, tea)
        });
        
        return phases;
    }
    
    // Calculate the effects for each phase
    calculatePhaseEffects(phaseNumber, tea) {
        const effects = {};
        const teaType = tea.type || '';
        const caffeineLevel = tea.caffeineLevel || 0;
        const lTheanineLevel = tea.lTheanineLevel || 0;
        
        // Phase 1: Initial onset
        if (phaseNumber === 1) {
            if (caffeineLevel > 5) {
                effects.alertness = Math.min(10, Math.round(caffeineLevel * 0.6));
            }
            
            if (lTheanineLevel > 0) {
                effects.relaxation = Math.min(10, Math.round(lTheanineLevel * 0.4));
            }
            
            if (teaType === 'green' || teaType === 'white') {
                effects.refresh = 6;
            } else if (teaType === 'black') {
                effects.stimulation = 7;
            } else if (teaType.includes('puerh')) {
                effects.warmth = 6;
            }
        }
        // Phase 2: Rising effects
        else if (phaseNumber === 2) {
            if (caffeineLevel > 0) {
                effects.energizing = Math.min(10, Math.round(caffeineLevel * 0.8));
            }
            
            if (lTheanineLevel > 0) {
                effects.calming = Math.min(10, Math.round(lTheanineLevel * 0.7));
                
                if (caffeineLevel > 0) {
                    effects.focusing = Math.min(10, Math.round((caffeineLevel + lTheanineLevel) / 2));
                }
            }
            
            if (teaType === 'green') {
                effects.clarifying = 7;
            } else if (teaType === 'black') {
                effects.invigorating = 8;
            } else if (teaType.includes('oolong')) {
                effects.balancing = 7;
            } else if (teaType.includes('puerh')) {
                effects.grounding = 6;
            }
        }
        // Phase 3: Peak effects
        else if (phaseNumber === 3) {
            if (caffeineLevel > 0) {
                effects.energizing = Math.min(10, caffeineLevel);
            }
            
            if (lTheanineLevel > 0) {
                effects.calming = Math.min(10, lTheanineLevel);
                
                if (caffeineLevel > 0) {
                    const ratio = lTheanineLevel / caffeineLevel;
                    
                    if (ratio > 1.2) {
                        effects.harmonizing = 8;
                    } else if (ratio >= 0.8) {
                        effects.focusing = 9;
                    } else {
                        effects.stimulating = 8;
                    }
                }
            }
            
            if (teaType === 'green') {
                effects.refresh = 9;
                effects.clarifying = 8;
            } else if (teaType === 'black') {
                effects.energizing = 9;
                effects.warming = 7;
            } else if (teaType === 'white') {
                effects.subtle = 8;
                effects.calming = 8;
            } else if (teaType === 'oolong') {
                effects.balancing = 9;
                effects.centering = 8;
            } else if (teaType.includes('puerh')) {
                effects.grounding = 9;
                effects.centering = 7;
            }
        }
        // Phase 4: Sustained effects
        else if (phaseNumber === 4) {
            if (caffeineLevel > 0) {
                effects.alertness = Math.min(10, Math.round(caffeineLevel * 0.7));
            }
            
            if (lTheanineLevel > 0) {
                effects.calming = Math.min(10, Math.round(lTheanineLevel * 0.9));
            }
            
            if (caffeineLevel > 0 && lTheanineLevel > 0) {
                effects.focusing = Math.min(10, Math.round((caffeineLevel + lTheanineLevel) / 2 * 0.8));
            }
            
            if (teaType === 'green') {
                effects.clarifying = 6;
            } else if (teaType === 'black') {
                effects.invigorating = 6;
            } else if (teaType === 'oolong') {
                effects.balancing = 8;
            } else if (teaType.includes('puerh')) {
                effects.grounding = 8;
                effects.centering = 7;
            }
        }
        // Phase 5: Tapering effects
        else if (phaseNumber === 5) {
            if (caffeineLevel > 7) {
                effects.lingering = Math.min(10, Math.round(caffeineLevel * 0.4));
            }
            
            if (lTheanineLevel > 0) {
                effects.afterglow = Math.min(10, Math.round(lTheanineLevel * 0.6));
            }
            
            if (teaType.includes('puerh')) {
                effects.grounding = 5;
            } else if (teaType === 'oolong') {
                effects.residual = 6;
            } else if (teaType === 'white') {
                effects.subtle = 5;
            }
        }
        
        return effects;
    }
    
    // Calculate timing-specific effects
    calculateTimingEffects(timing, phases, tea) {
        const effects = {};
        const teaType = tea.type || '';
        const caffeineLevel = tea.caffeineLevel || 0;
        const lTheanineLevel = tea.lTheanineLevel || 0;
        
        // Effect: Rapid onset
        if (timing.onset < 10) {
            effects.rapidOnset = {
                description: 'Effects begin quickly, with noticeable changes within the first 10 minutes.',
                duration: timing.onset
            };
        }
        
        // Effect: Sustained focus
        if (lTheanineLevel > 0 && caffeineLevel > 0 && lTheanineLevel / caffeineLevel >= 0.8) {
            const focusDuration = Math.min(180, timing.duration * 0.6);
            
            effects.sustainedFocus = {
                description: 'The balanced L-theanine and caffeine creates a prolonged state of focused attention.',
                duration: Math.round(focusDuration)
            };
        }
        
        // Effect: Extended duration
        if (timing.duration > 240) {
            effects.extendedDuration = {
                description: 'Effects last significantly longer than average, providing extended benefits.',
                duration: timing.duration
            };
        }
        
        // Effect: Gentle transition
        if (lTheanineLevel > caffeineLevel) {
            effects.gentleTransition = {
                description: 'Effects emerge and fade gradually, without abrupt changes in energy or mood.',
                duration: timing.duration
            };
        }
        
        // Effect: Crash-free
        if (teaType === 'puerh' || teaType === 'oolong' || (lTheanineLevel > caffeineLevel * 0.8)) {
            effects.crashFree = {
                description: 'Energy levels taper off smoothly without the crash often associated with caffeine.',
                duration: phases[4].end - phases[3].start // Duration from start of sustained to end of tapering
            };
        }
        
        return effects;
    }
    
    // Generate timing description
    generateTimingDescription(timing, phases, tea) {
        const teaType = tea?.type || 'tea';
        const { onset, peak, duration } = timing;
        
        let description = `This ${teaType} tea has an onset of effects at approximately ${onset} minutes, reaching peak intensity around ${peak} minutes, with a total duration of about ${Math.round(duration / 60)} hours (${duration} minutes). `;
        
        // Add tea-type specific timing details
        if (teaType === 'green') {
            description += 'Green teas typically have a relatively quick onset with a clean, refreshing energy that develops into mental clarity. ';
        } else if (teaType === 'black') {
            description += 'Black teas generally provide faster onset with pronounced energizing effects that gradually transition to a sustained alertness. ';
        } else if (teaType === 'white') {
            description += 'White teas characteristically offer a gentle, gradual onset with subtle yet long-lasting effects that avoid overstimulation. ';
        } else if (teaType === 'oolong') {
            description += 'Oolong teas typically provide a balanced effect profile with a moderate onset and well-sustained effects that maintain equilibrium. ';
        } else if (teaType.includes('puerh')) {
            description += 'Puerh teas generally have a moderate onset that develops into deep, grounding effects with significantly longer duration than most teas. ';
        }
        
        // Add compound-based timing details
        const caffeineLevel = tea.caffeineLevel || 0;
        const lTheanineLevel = tea.lTheanineLevel || 0;
        
        if (caffeineLevel > 0 && lTheanineLevel > 0) {
            const ratio = lTheanineLevel / caffeineLevel;
            
            if (ratio > 1.5) {
                description += 'The high L-theanine to caffeine ratio creates a smooth onset and extended duration, with predominant calming effects alongside gentle stimulation. ';
            } else if (ratio >= 0.8) {
                description += 'The balanced L-theanine and caffeine create ideal conditions for sustained focus throughout the peak and sustained phases. ';
            } else {
                description += 'The higher caffeine level results in more pronounced stimulation during onset and peak phases, with L-theanine providing moderate moderation. ';
            }
        } else if (caffeineLevel > 7) {
            description += 'The high caffeine content results in quickly noticeable energizing effects with a pronounced peak phase. ';
        } else if (lTheanineLevel > 7) {
            description += 'The high L-theanine content creates a gentle onset with extended calming effects throughout the duration. ';
        }
        
        // Add notable timing effects
        if (onset < 10) {
            description += 'This tea has a notably rapid onset of effects. ';
        } else if (onset > 20) {
            description += 'This tea has a characteristically gentle, gradual onset. ';
        }
        
        if (duration > 300) {
            description += 'The effects have an extended duration, lasting significantly longer than average. ';
        } else if (duration < 120) {
            description += 'The effects have a relatively short duration compared to other teas. ';
        }
        
        return description;
    }
} 