// ProcessingCalculator.js
// Handles calculations related to tea processing methods and their effects
// REVISED to use data from props file (js/props/ProcessingInfluences.js)

import { BaseCalculator } from './BaseCalculator.js';
import { effectNameSubstitution } from '../props/EffectMapping.js';

export class ProcessingCalculator extends BaseCalculator {
    constructor(config) {
        super(config);
        // This will hold the data loaded from js/props/ProcessingInfluences.js
        this.processingInfluences = {};
        this.processingToPrimaryEffectMap = {};
    }

    // Set processing effects data (called when loading data)
    setProcessingEffects(processingInfluences, processingToPrimaryEffectMap) {
        this.processingInfluences = processingInfluences || {};
        this.processingToPrimaryEffectMap = processingToPrimaryEffectMap || {};
    }

    // Override infer method from BaseCalculator
    infer(tea) {
        const processingData = tea?.processing || {};
        const processingMethods = processingData.methods || tea?.processingMethods || []; // Support both formats

        if (!tea || (!processingMethods || !Array.isArray(processingMethods) || processingMethods.length === 0)) {
            return {
                description: 'No processing data available',
                methods: [],
                processingEffects: {}, // Changed name to avoid confusion
                processingScores: {}
            };
        }

        const methods = processingMethods;
        const oxidationLevel = processingData.oxidationLevel || 0;
        const rollingStyle = processingData.rollingStyle || '';
        const withering = processingData.withering || '';
        const firing = processingData.firing || '';

        // Calculate scores based *only* on props data now
        const processingScores = this.calculateProcessingScores(tea);
        // Retrieve the descriptions from props for formatting
        const relevantPropsEffects = this.getRelevantPropsEffects(methods, oxidationLevel, tea.type);
        const description = this.generateProcessingDescription(tea);

        return {
            description,
            methods,
            oxidationLevel,
            rollingStyle,
            withering,
            firing,
            processingEffects: relevantPropsEffects, // Return effects described in props
            processingScores // Return calculated scores
        };
    }

    // Calculate processing scores based *only* on props data
    calculateProcessingScores(tea) {
        const scores = {};
        const processingData = tea?.processing || {};
        const processingMethods = processingData.methods || tea?.processingMethods || [];
        const oxidationLevel = processingData.oxidationLevel || 0;
        const teaType = tea?.type || '';

        if (!this.processingInfluences || Object.keys(this.processingInfluences).length === 0) {
            console.warn("ProcessingCalculator: processingInfluences data not loaded.");
            return {};
        }

        // --- 1. Apply scores from specific processing methods listed in props ---
        processingMethods.forEach(method => {
            const normalizedMethod = method.toLowerCase().trim();
            
            // Try exact match first
            let methodData = this.processingInfluences[normalizedMethod];
            
            // If no exact match, try to find a partial match
            if (!methodData) {
                const keys = Object.keys(this.processingInfluences);
                for (const key of keys) {
                    if (normalizedMethod.includes(key) || key.includes(normalizedMethod)) {
                        methodData = this.processingInfluences[key];
                        console.log(`Found partial match for ${normalizedMethod}: ${key}`);
                        break;
                    }
                }
            }
            
            // If still no match, try component-based matching
            if (!methodData) {
                const methodComponents = {
                    'pan': 'pan-fired',
                    'fire': 'pan-fired',
                    'steam': 'steamed',
                    'roast': 'medium-roast',
                    'charcoal': 'charcoal-roasted',
                    'heavy roast': 'heavy-roast',
                    'light roast': 'light-roast',
                    'shade': 'shade-grown'
                };
                
                for (const [component, mappedMethod] of Object.entries(methodComponents)) {
                    if (normalizedMethod.includes(component) && this.processingInfluences[mappedMethod]) {
                        methodData = this.processingInfluences[mappedMethod];
                        console.log(`Found component match for ${normalizedMethod}: ${mappedMethod}`);
                        break;
                    }
                }
            }

            if (methodData && methodData.effects) {
                const intensity = methodData.intensity || 1.0; // Default intensity if not specified

                // Iterate through the effects defined for this method in props
                Object.entries(methodData.effects).forEach(([effectName, baseScore]) => {
                    // Map old effect names to the 8 core effects if necessary
                    const coreEffectName = effectNameSubstitution.needsConversion(effectName) 
                        ? effectNameSubstitution.toNewEffects(effectName)
                        : effectName;

                    // Ensure it's one of the 8 core effects you're tracking
                    const validCoreEffects = ["energizing", "calming", "focusing", "harmonizing", "grounding", "elevating", "comforting", "restorative"];
                    if (validCoreEffects.includes(coreEffectName)) {
                        if (typeof baseScore === 'number') {
                            scores[coreEffectName] = (scores[coreEffectName] || 0) + (baseScore * intensity);
                        }
                    } else {
                        console.warn(`ProcessingCalculator: Effect "${effectName}" for method "${normalizedMethod}" not recognized or mapped.`);
                    }
                });
            }
        });

        // --- 2. Apply algorithmic adjustments based on oxidation level ---
        // (Keeping some algorithmic influence as props might not cover all nuances)
        const oxidationFactor = (oxidationLevel - 50) / 50; // Ranges from -1 (0% ox) to +1 (100% ox)

        if (oxidationLevel > 0) {
            // Higher oxidation moderately increases energizing/grounding, slightly decreases calming/elevating
            scores["energizing"] = (scores["energizing"] || 0) + Math.max(0, oxidationFactor * 2.0); // Adds up to +2
            scores["grounding"] = (scores["grounding"] || 0) + Math.max(0, oxidationFactor * 1.5); // Adds up to +1.5
            scores["calming"] = (scores["calming"] || 0) + Math.min(0, oxidationFactor * -1.5); // Subtracts up to -1.5
            scores["elevating"] = (scores["elevating"] || 0) + Math.min(0, oxidationFactor * -1.0); // Subtracts up to -1.0
        }
        
        // Special case for post-fermentation (Puerh) - relies on method being listed
        if (teaType.includes('puerh') || processingMethods.some(m => m.includes('ferment'))) {
            scores["grounding"] = (scores["grounding"] || 0) * 1.1; // Slight boost
            scores["comforting"] = (scores["comforting"] || 0) * 1.1;
        }

        // --- 3. Apply specific processing modifiers (kept from original) ---
        this.applySpecificProcessingModifiers(scores, tea);

        // --- 4. Normalize and Cap Scores ---
        Object.keys(scores).forEach(effect => {
            // Ensure score is not negative and cap at 10
            scores[effect] = Math.min(10, Math.max(0, scores[effect]));
        });

        return scores;
    }

    // Retrieve effect descriptions from props for relevant methods
    getRelevantPropsEffects(methods, oxidationLevel, teaType) {
        const relevantEffects = {};
        if (!this.processingInfluences) return relevantEffects;

        methods.forEach(method => {
            const normalizedMethod = method.toLowerCase().trim();
            
            // Try exact match first
            let methodData = this.processingInfluences[normalizedMethod];
            
            // If no exact match, try to find a partial match
            if (!methodData) {
                const keys = Object.keys(this.processingInfluences);
                for (const key of keys) {
                    if (normalizedMethod.includes(key) || key.includes(normalizedMethod)) {
                        methodData = this.processingInfluences[key];
                        break;
                    }
                }
            }
            
            // If still no match, try component-based matching
            if (!methodData) {
                const methodComponents = {
                    'pan': 'pan-fired',
                    'fire': 'pan-fired',
                    'steam': 'steamed',
                    'roast': 'medium-roast',
                    'charcoal': 'charcoal-roasted',
                    'heavy roast': 'heavy-roast',
                    'light roast': 'light-roast',
                    'shade': 'shade-grown'
                };
                
                for (const [component, mappedMethod] of Object.entries(methodComponents)) {
                    if (normalizedMethod.includes(component) && this.processingInfluences[mappedMethod]) {
                        methodData = this.processingInfluences[mappedMethod];
                        break;
                    }
                }
            }
            
            if (methodData && methodData.description) {
                // Just store the description linked to the method for formatting
                // We capture the specific effect contributions in processingScores
                if(!relevantEffects[normalizedMethod]) {
                    relevantEffects[normalizedMethod] = { 
                        description: methodData.description, 
                        intensity: methodData.intensity || 0,
                        category: methodData.category || 'processing'
                    };
                }
            }
        });
        
        // Try to add description based on oxidation level
        if (oxidationLevel > 0) {
            let oxidationCategory = '';
            if (oxidationLevel <= 10) oxidationCategory = 'minimal-oxidation';
            else if (oxidationLevel <= 30) oxidationCategory = 'light-oxidation';
            else if (oxidationLevel <= 60) oxidationCategory = 'partial-oxidation';
            else if (oxidationLevel <= 85) oxidationCategory = 'medium-oxidation';
            else oxidationCategory = 'full-oxidation';
            
            if (this.processingInfluences[oxidationCategory]) {
                relevantEffects[`oxidation-level-${oxidationLevel}%`] = {
                    description: this.processingInfluences[oxidationCategory].description || 
                               `${oxidationLevel}% oxidation affects the tea's chemical composition and resulting effects.`,
                    intensity: this.processingInfluences[oxidationCategory].intensity || 1.0,
                    category: 'oxidation'
                };
            }
        }

        return relevantEffects;
    }

    // Kept from original - applies modifiers based on specific details
    applySpecificProcessingModifiers(scores, tea) {
        if (!tea) {
            return scores;
        }

        const processingData = tea.processing || {};
        const firing = processingData.firing || '';
        const rollingStyle = processingData.rollingStyle || '';
        const withering = processingData.withering || '';
        const processingMethods = processingData.methods || tea?.processingMethods || [];

        // Firing modifiers
        if (firing.includes('charcoal') || firing.includes('heavy')) {
            if (scores.grounding) scores.grounding *= 1.2;
            if (scores.comforting) scores.comforting *= 1.15;
        } else if (firing.includes('light')) {
            if (scores.elevating) scores.elevating *= 1.1;
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
            // Sun withering might boost elevating slightly
            if (scores.elevating) scores.elevating *= 1.1;
        }

        // Modifiers based on methods array (if specific details aren't separate)
        if (Array.isArray(processingMethods)) {
            if (processingMethods.some(m => m.includes('roast') && (m.includes('heavy') || m.includes('charcoal')))) {
                if (scores.grounding && !firing.includes('heavy') && !firing.includes('charcoal')) scores.grounding *= 1.1; // Avoid double boosting
                if (scores.comforting && !firing.includes('heavy') && !firing.includes('charcoal')) scores.comforting *= 1.1;
            }
            if (processingMethods.some(m => m.includes('shade'))) {
                if (scores.focusing) scores.focusing *= 1.1; // Shade boost focus
                if (scores.calming) scores.calming *= 1.05;
                if (scores.elevating) scores.elevating *= 1.05; // Slight shade boost elevating
            }
            if (processingMethods.some(m => m.includes('ferment'))) {
                if (scores.restorative) scores.restorative *= 1.1; // Ferment boost restorative
                if (scores.grounding) scores.grounding *= 1.05;
            }
        }

        return scores;
    }

    // Override formatInference from BaseCalculator
    formatInference(inference) {
        if (!inference || !inference.methods || inference.methods.length === 0) {
            return '## Processing Analysis\n\nNo processing data available.';
        }

        let md = '## Processing Analysis\n\n';

        // Add description (generated based on tea data)
        md += `${inference.description}\n\n`;

        // Add processing method details from inference
        md += '### Processing Methods Applied\n';
        md += `- **Methods**: ${inference.methods.join(', ')}\n`;
        if (inference.oxidationLevel > 0) md += `- **Oxidation Level**: ${inference.oxidationLevel}%\n`;
        if (inference.rollingStyle) md += `- **Rolling Style**: ${inference.rollingStyle}\n`;
        if (inference.withering) md += `- **Withering**: ${inference.withering}\n`;
        if (inference.firing) md += `- **Firing**: ${inference.firing}\n`;
        md += '\n';

        // Display Descriptions of Applied Methods (from props)
        md += '### Descriptions of Applied Methods (from Props)\n';
        if (inference.processingEffects && Object.keys(inference.processingEffects).length > 0) {
            Object.entries(inference.processingEffects).forEach(([methodName, details]) => {
                md += `- **${methodName}**: ${details.description} (Base Intensity: ${details.intensity || 'N/A'})\n`;
            });
        } else {
            md += 'No specific method descriptions found in props for applied methods.\n';
        }
        md += '\n';

        // Add calculated scores
        md += `### Calculated Effect Scores from Processing\n`;
        if (inference.processingScores && Object.keys(inference.processingScores).length > 0) {
            const sortedScores = Object.entries(inference.processingScores)
                .filter(([, score]) => score > 0.1) // Only show scores with some value
                .sort(([, scoreA], [, scoreB]) => scoreB - scoreA); // Sort descending

            if(sortedScores.length === 0){
                md += `No significant processing scores calculated.\n`;
            } else {
                sortedScores.forEach(([effect, score]) => {
                    const bars = '■'.repeat(Math.min(5,Math.floor(score / 2))) + 
                              '□'.repeat(Math.max(0, 5 - Math.floor(score / 2)));
                    md += `- **${effect}**: ${score.toFixed(1)}/10 [${bars}]\n`;
                });
            }
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

    // Generate a description of the processing methods
    generateProcessingDescription(tea) {
        const processingData = tea?.processing || {};
        const processingMethods = processingData.methods || tea?.processingMethods || [];

        if (!tea || !processingMethods || !Array.isArray(processingMethods) || processingMethods.length === 0) {
            return 'No processing information available for this tea.';
        }

        const methods = processingMethods;
        const oxidationLevel = processingData.oxidationLevel || 0;
        const teaType = tea.type || '';

        let description = `This ${teaType} tea has undergone the following processing: ${methods.join(', ')}`;

        if (oxidationLevel > 0) {
            description += ` with an oxidation level of approximately ${oxidationLevel}%`;
            // Add oxidation category description
            if (oxidationLevel <= 10) description += ' (minimal oxidation).';
            else if (oxidationLevel <= 30) description += ' (light oxidation).';
            else if (oxidationLevel <= 60) description += ' (medium oxidation).';
            else if (oxidationLevel <= 85) description += ' (medium-high oxidation).';
            else description += ' (high oxidation).';
        } else {
            description += '.';
        }

        // Add specific processing details if available
        const withering = processingData.withering;
        if (withering) description += ` Withered using ${withering} techniques.`;
        const rollingStyle = processingData.rollingStyle;
        if (rollingStyle) description += ` Rolling style is ${rollingStyle}.`;
        const firing = processingData.firing;
        if (firing) description += ` Finished with ${firing} firing.`;

        // Determine main effects based on processing scores
        const processingScores = this.calculateProcessingScores(tea);
        if (processingScores && Object.keys(processingScores).length > 0) {
            const topEffects = Object.entries(processingScores)
                .filter(([, score]) => score > 3.0) // Only consider significant scores
                .sort(([, scoreA], [, scoreB]) => scoreB - scoreA) // Sort by score descending
                .slice(0, 2) // Take top 2
                .map(([effect]) => effect); // Just keep the effect names
                
            if (topEffects.length > 0) {
                description += ` This processing profile primarily contributes to the tea's ${topEffects.join(' and ')} effects.`;
            } else {
                description += ' This processing profile generally contributes to its characteristic effects.';
            }
        } else {
            description += ' This processing profile generally contributes to its characteristic effects.';
        }

        return description;
    }
}
