// ProcessingCalculator.js
// Handles calculations related to tea processing methods and their effects

import { BaseCalculator } from './BaseCalculator.js';

export class ProcessingCalculator extends BaseCalculator {
    constructor(config) {
        super(config);
        this.processingEffects = {};
    }
    
    // Set processing effects data
    setProcessingEffects(processingEffects) {
        this.processingEffects = processingEffects || {};
    }
    
    // Override infer method from BaseCalculator
    infer(tea) {
        const processingMethods = tea?.processing?.methods || tea?.processingMethods || [];
        
        if (!tea || (!processingMethods || !Array.isArray(processingMethods) || processingMethods.length === 0)) {
            return {
                description: 'No processing data available',
                methods: [],
                processingEffects: {},
                processingScores: {}
            };
        }
        
        // Support both formats
        const methods = processingMethods;
        const oxidationLevel = tea?.processing?.oxidationLevel || 0;
        const rollingStyle = tea?.processing?.rollingStyle || '';
        const withering = tea?.processing?.withering || '';
        const firing = tea?.processing?.firing || '';
        
        // Get processing information
        const processingEffects = this.getProcessingEffects(methods, oxidationLevel, tea.type);
        const processingScores = this.calculateProcessingScores(tea);
        const description = this.generateProcessingDescription(tea);
        
        return {
            description,
            methods,
            oxidationLevel,
            rollingStyle,
            withering,
            firing,
            processingEffects,
            processingScores
        };
    }
    
    // Override formatInference from BaseCalculator
    formatInference(inference) {
        if (!inference || !inference.methods || inference.methods.length === 0) {
            return '## Processing Analysis\n\nNo processing data available.';
        }
        
        let md = '## Processing Analysis\n\n';
        
        // Add description
        md += `${inference.description}\n\n`;
        
        // Add processing method details
        md += '### Processing Methods\n';
        
        if (inference.methods && inference.methods.length > 0) {
            md += `- **Methods**: ${inference.methods.join(', ')}\n`;
        }
        
        if (inference.oxidationLevel > 0) {
            md += `- **Oxidation Level**: ${inference.oxidationLevel}%\n`;
        }
        
        if (inference.rollingStyle) {
            md += `- **Rolling Style**: ${inference.rollingStyle}\n`;
        }
        
        if (inference.withering) {
            md += `- **Withering**: ${inference.withering}\n`;
        }
        
        if (inference.firing) {
            md += `- **Firing**: ${inference.firing}\n`;
        }
        
        // Add processing effects
        md += `\n### Processing Effects\n`;
        
        if (inference.processingEffects && Object.keys(inference.processingEffects).length > 0) {
            Object.entries(inference.processingEffects).forEach(([effect, details]) => {
                md += `- **${effect}**: ${details.description}\n`;
                
                if (details.intensity) {
                    const bars = '■'.repeat(Math.floor(details.intensity / 2)) + 
                               '□'.repeat(5 - Math.floor(details.intensity / 2));
                    md += `  Intensity: [${bars}] ${details.intensity}/10\n`;
                }
            });
        } else {
            md += `No specific processing effects identified.\n`;
        }
        
        // Add calculated scores
        md += `\n### Effect Scores from Processing\n`;
        
        if (inference.processingScores && Object.keys(inference.processingScores).length > 0) {
            Object.entries(inference.processingScores).forEach(([effect, score]) => {
                md += `- **${effect}**: ${score.toFixed(1)}/10\n`;
            });
        } else {
            md += `No processing scores calculated.\n`;
        }
        
        return md;
    }
    
    // Override serialize from BaseCalculator
    serialize(inference) {
        if (!inference) {
            return {
                processingScores: {},
                processing: {
                    description: 'No processing data available',
                    methods: [],
                    oxidationLevel: 0,
                    effects: {},
                    _sectionRef: "processing"
                }
            };
        }
        
        return {
            processingScores: inference.processingScores,
            processing: {
                description: inference.description,
                methods: inference.methods,
                oxidationLevel: inference.oxidationLevel,
                rollingStyle: inference.rollingStyle,
                withering: inference.withering,
                firing: inference.firing,
                effects: inference.processingEffects,
                _sectionRef: "processing"
            }
        };
    }
    
    // Get processing effects based on methods and tea type
    getProcessingEffects(methods, oxidationLevel = 0, teaType = '') {
        const effects = {};
        
        // Process each method
        methods.forEach(method => {
            this.applyMethodEffects(effects, method.toLowerCase(), oxidationLevel);
        });
        
        // Apply effects based on oxidation level
        this.applyOxidationEffects(effects, oxidationLevel, teaType);
        
        return effects;
    }
    
    // Apply effects from specific processing methods
    applyMethodEffects(effects, method, oxidationLevel) {
        // Pan firing effects
        if (method.includes('pan') && method.includes('fir')) {
            effects.focusing = {
                description: 'Pan firing preserves amino acids and creates vegetal notes that enhance mental focus.',
                intensity: 7
            };
            effects.uplifting = {
                description: 'The clean, fresh quality of pan-fired teas contributes to uplifting effects.',
                intensity: 6
            };
        }
        
        // Steaming effects
        if (method.includes('steam')) {
            effects.calming = {
                description: 'Steaming preserves L-theanine and creates vegetal notes that promote calmness.',
                intensity: 7
            };
            effects.focusing = {
                description: 'The clean, grassy qualities of steamed teas support mental clarity.',
                intensity: 6
            };
        }
        
        // Charcoal roasting effects
        if ((method.includes('charcoal') && method.includes('roast')) || method.includes('charcoal-roast')) {
            effects.grounding = {
                description: 'Charcoal roasting imparts deep, toasty notes that create grounding effects.',
                intensity: 8
            };
            effects.comforting = {
                description: 'The warm, rich character from charcoal roasting provides a comforting quality.',
                intensity: 7
            };
        }
        
        // Rolling effects
        if (method.includes('roll')) {
            const intensity = method.includes('heavy') ? 7 : 6;
            
            effects.energizing = {
                description: 'Rolling breaks cell walls, releasing compounds that contribute to energizing effects.',
                intensity
            };
        }
        
        // Withering effects
        if (method.includes('wither')) {
            effects.harmonizing = {
                description: 'Withering develops aroma compounds that create a harmonizing effect.',
                intensity: 6
            };
        }
        
        // Sun drying effects
        if (method.includes('sun') && method.includes('dry')) {
            effects.energizing = {
                description: 'Sun drying preserves natural compounds that contribute to energizing effects.',
                intensity: 6
            };
            effects.uplifting = {
                description: 'The yang energy absorbed during sun drying creates uplifting qualities.',
                intensity: 7
            };
        }
        
        // Oxidation effects
        if (method.includes('oxidat') || method.includes('ferment')) {
            // Effect intensity varies based on oxidation level
            const intensity = Math.min(8, 4 + Math.floor(oxidationLevel / 20));
            
            effects.energizing = {
                description: 'Oxidation increases caffeine bioavailability, enhancing energizing effects.',
                intensity
            };
        }
        
        return effects;
    }
    
    // Apply effects based on oxidation level
    applyOxidationEffects(effects, oxidationLevel, teaType) {
        // Low oxidation (0-30%): Green, White, Yellow
        if (oxidationLevel <= 30) {
            if (!effects.calming) {
                effects.calming = {
                    description: 'Low oxidation preserves L-theanine, contributing to calming effects.',
                    intensity: 6
                };
            }
            
            if (!effects.focusing) {
                effects.focusing = {
                    description: 'Low oxidation teas contain higher concentrations of catechins that support focus.',
                    intensity: 7
                };
            }
        }
        // Medium oxidation (31-60%): Light to medium Oolongs
        else if (oxidationLevel <= 60) {
            if (!effects.harmonizing) {
                effects.harmonizing = {
                    description: 'Medium oxidation creates a balance of compounds that promote overall harmony.',
                    intensity: 8
                };
            }
            
            if (!effects.uplifting) {
                effects.uplifting = {
                    description: 'The balanced nature of medium oxidation teas contributes to uplifting effects.',
                    intensity: 7
                };
            }
        }
        // Medium-high oxidation (61-85%): Dark Oolongs, lighter Black teas
        else if (oxidationLevel <= 85) {
            if (!effects.energizing) {
                effects.energizing = {
                    description: 'Medium-high oxidation increases the bioavailability of stimulating compounds.',
                    intensity: 7
                };
            }
            
            if (!effects.grounding) {
                effects.grounding = {
                    description: 'The deeper notes in medium-high oxidation teas create grounding effects.',
                    intensity: 6
                };
            }
        }
        // High oxidation (86-100%): Black teas, aged teas
        else {
            if (!effects.energizing) {
                effects.energizing = {
                    description: 'High oxidation maximizes caffeine impact, creating strong energizing effects.',
                    intensity: 8
                };
            }
            
            if (!effects.grounding) {
                effects.grounding = {
                    description: 'Fully oxidized teas develop rich, deep qualities that create strong grounding effects.',
                    intensity: 7
                };
            }
        }
        
        // Special case: Post-fermentation for Puerh and other post-fermented teas
        if (teaType.includes('puerh') || teaType.includes('post-fermented')) {
            effects.grounding = {
                description: 'Post-fermentation creates unique compounds that provide deep grounding effects.',
                intensity: 8
            };
            
            effects.centering = {
                description: 'The microbial activity in fermented teas contributes to centering effects.',
                intensity: 7
            };
        }
        
        return effects;
    }
    
    // Generate a description of the processing methods
    generateProcessingDescription(tea) {
        const processingMethods = tea?.processing?.methods || tea?.processingMethods || [];
        
        if (!tea || !processingMethods || !Array.isArray(processingMethods) || processingMethods.length === 0) {
            return 'No processing information available for this tea.';
        }
        
        const methods = processingMethods;
        const oxidationLevel = tea?.processing?.oxidationLevel || 0;
        const teaType = tea.type || '';
        
        let description = `This ${teaType} tea has undergone the following processing: ${methods.join(', ')}`;
        
        if (oxidationLevel > 0) {
            description += ` with an oxidation level of approximately ${oxidationLevel}%`;
            
            // Add oxidation category description
            if (oxidationLevel <= 10) {
                description += ' (minimal oxidation, preserving fresh leaf characteristics).';
            } else if (oxidationLevel <= 30) {
                description += ' (light oxidation, maintaining many fresh leaf compounds).';
            } else if (oxidationLevel <= 60) {
                description += ' (medium oxidation, creating a balance between fresh and developed characteristics).';
            } else if (oxidationLevel <= 85) {
                description += ' (medium-high oxidation, developing deeper flavors and compounds).';
            } else {
                description += ' (high oxidation, maximizing transformed leaf characteristics).';
            }
        } else {
            description += '.';
        }
        
        // Add specific processing details - safely access properties
        const withering = tea?.processing?.withering;
        if (withering) {
            description += ` The leaves were withered using ${withering} techniques.`;
        }
        
        const rollingStyle = tea?.processing?.rollingStyle;
        if (rollingStyle) {
            description += ` The rolling style is ${rollingStyle}.`;
        }
        
        const firing = tea?.processing?.firing;
        if (firing) {
            description += ` The tea was finished with ${firing} firing.`;
        }
        
        // Add effects summary
        description += ' This processing profile contributes to the tea\'s';
        
        // Determine main effects based on processing
        let mainEffects = [];
        
        if (methods.some(m => m.includes('steam') || m.includes('pan fir'))) {
            mainEffects.push('focusing');
        }
        
        if (oxidationLevel <= 30) {
            mainEffects.push('calming');
        } else if (oxidationLevel <= 60) {
            mainEffects.push('harmonizing');
        } else {
            mainEffects.push('energizing');
        }
        
        if (methods.some(m => m.includes('charcoal') || m.includes('roast'))) {
            mainEffects.push('grounding');
        }
        
        if (mainEffects.length > 0) {
            description += ` ${mainEffects.join(', ')} `;
        } else {
            description += ' characteristic ';
        }
        
        description += 'effects.';
        
        return description;
    }
    
    // Calculate processing scores for effects
    calculateProcessingScores(tea) {
        const processingMethods = tea?.processing?.methods || tea?.processingMethods || [];
        
        if (!tea || !processingMethods || !Array.isArray(processingMethods) || processingMethods.length === 0) {
            return {};
        }
        
        const methods = processingMethods;
        const oxidationLevel = tea?.processing?.oxidationLevel || 0;
        const scores = {};
        
        // Get base effects from processing methods
        const processingEffects = this.getProcessingEffects(methods, oxidationLevel, tea.type);
        
        // Convert effect intensities to scores
        Object.entries(processingEffects).forEach(([effect, details]) => {
            scores[effect] = details.intensity;
        });
        
        // Apply modifiers based on specific processing details
        this.applySpecificProcessingModifiers(scores, tea);
        
        return scores;
    }
    
    // Apply modifiers based on specific processing details
    applySpecificProcessingModifiers(scores, tea) {
        if (!tea) {
            return scores;
        }
        
        // Support both formats
        const firing = tea?.processing?.firing || '';
        const rollingStyle = tea?.processing?.rollingStyle || '';
        const withering = tea?.processing?.withering || '';
        
        // Firing modifiers
        if (firing.includes('charcoal') || firing.includes('heavy')) {
            if (scores.grounding) scores.grounding *= 1.2;
            if (scores.comforting) scores.comforting *= 1.15;
        } else if (firing.includes('light')) {
            if (scores.uplifting) scores.uplifting *= 1.1;
        }
        
        // Rolling style modifiers
        if (rollingStyle.includes('heavy') || rollingStyle.includes('tight')) {
            if (scores.energizing) scores.energizing *= 1.15;
        } else if (rollingStyle.includes('light')) {
            if (scores.calming) scores.calming *= 1.1;
        }
        
        // Withering modifiers
        if (withering.includes('long')) {
            if (scores.harmonizing) scores.harmonizing *= 1.15;
        } else if (withering.includes('sun')) {
            if (scores.uplifting) scores.uplifting *= 1.2;
        }
        
        // Also check for processing methods that indicate specific qualities
        const processingMethods = tea?.processing?.methods || tea?.processingMethods || [];
        if (Array.isArray(processingMethods)) {
            // Check for roasting
            if (processingMethods.some(m => m.includes('roast'))) {
                if (scores.grounding) scores.grounding *= 1.1;
            }
            
            // Check for fermentation
            if (processingMethods.some(m => m.includes('ferment'))) {
                if (scores.restorative) scores.restorative *= 1.15;
            }
            
            // Check for shade growing
            if (processingMethods.some(m => m.includes('shade'))) {
                if (scores.focusing) scores.focusing *= 1.2;
                if (scores.calming) scores.calming *= 1.1;
            }
        }
        
        // Cap all scores at 10
        Object.keys(scores).forEach(effect => {
            scores[effect] = Math.min(10, scores[effect]);
        });
        
        return scores;
    }
} 