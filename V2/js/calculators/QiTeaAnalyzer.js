// QiTeaAnalyzer.js
// Handles calculations related to traditional tea energy effects (qi) from an East Asian perspective

import { BaseCalculator } from './BaseCalculator.js';

export class QiTeaAnalyzer extends BaseCalculator {
    constructor(config) {
        super(config);
        this.energyPatterns = {};
        this.elementalQualities = {};
    }
    
    // Set energy patterns data
    setEnergyPatterns(patterns) {
        this.energyPatterns = patterns || {};
    }
    
    // Set elemental qualities data
    setElementalQualities(qualities) {
        this.elementalQualities = qualities || {};
    }
    
    // Override infer method from BaseCalculator
    infer(tea) {
        if (!tea) {
            return {
                description: 'No tea data available for traditional energy analysis',
                energyProfile: {},
                elementalBalance: {},
                directions: {},
                qiEffects: {}
            };
        }
        
        // Calculate energy profile
        const energyProfile = this.calculateEnergyProfile(tea);
        
        // Calculate elemental balance
        const elementalBalance = this.calculateElementalBalance(tea);
        
        // Calculate directional tendencies
        const directions = this.calculateDirections(tea);
        
        // Calculate traditional effects
        const qiEffects = this.calculateQiEffects(energyProfile, elementalBalance, directions, tea);
        
        // Generate description
        const description = this.generateQiDescription(energyProfile, elementalBalance, directions, tea);
        
        return {
            description,
            energyProfile,
            elementalBalance,
            directions,
            qiEffects
        };
    }
    
    // Override formatInference from BaseCalculator
    formatInference(inference) {
        if (!inference || !inference.energyProfile) {
            return '## Traditional Energy Analysis\n\nNo energy data available.';
        }
        
        let md = '## Traditional Energy Analysis\n\n';
        
        // Add description
        md += `${inference.description}\n\n`;
        
        // Add energy profile
        md += '### Energy Profile\n';
        
        const { energyProfile } = inference;
        
        md += `- **Temperature**: ${this.getTemperatureDescription(energyProfile.temperature)}\n`;
        md += `- **Moisture**: ${this.getMoistureDescription(energyProfile.moisture)}\n`;
        md += `- **Weight**: ${this.getWeightDescription(energyProfile.weight)}\n`;
        md += `- **Movement**: ${this.getMovementDescription(energyProfile.movement)}\n\n`;
        
        // Add elemental balance
        md += '### Five Element Balance\n';
        
        const { elementalBalance } = inference;
        
        Object.entries(elementalBalance).forEach(([element, value]) => {
            const bars = '■'.repeat(Math.floor(value / 2)) + 
                       '□'.repeat(5 - Math.floor(value / 2));
            md += `- **${this.capitalizeFirstLetter(element)}**: [${bars}] ${value}/10\n`;
        });
        
        md += '\n';
        
        // Add directional tendencies
        md += '### Directional Tendencies\n';
        
        const { directions } = inference;
        
        md += `- **Primary Direction**: ${directions.primary || 'Balanced'}\n`;
        
        if (directions.secondary) {
            md += `- **Secondary Direction**: ${directions.secondary}\n`;
        }
        
        if (directions.notes) {
            md += `- **Notes**: ${directions.notes}\n`;
        }
        
        md += '\n';
        
        // Add qi effects
        md += '### Traditional Effects\n';
        
        if (inference.qiEffects && Object.keys(inference.qiEffects).length > 0) {
            Object.entries(inference.qiEffects).forEach(([effect, details]) => {
                md += `- **${effect}**: ${details.description}\n`;
                
                if (details.intensity) {
                    const bars = '■'.repeat(Math.floor(details.intensity / 2)) + 
                               '□'.repeat(5 - Math.floor(details.intensity / 2));
                    md += `  Intensity: [${bars}] ${details.intensity}/10\n`;
                }
            });
        } else {
            md += 'No specific traditional effects identified.\n';
        }
        
        return md;
    }
    
    // Override serialize from BaseCalculator
    serialize(inference) {
        if (!inference) {
            return {
                traditionalEnergy: {
                    description: 'No traditional energy data available',
                    energyProfile: {},
                    elementalBalance: {},
                    directions: {},
                    effects: {},
                    _sectionRef: "traditionalEnergy"
                }
            };
        }
        
        return {
            traditionalEnergy: {
                description: inference.description,
                energyProfile: inference.energyProfile,
                elementalBalance: inference.elementalBalance,
                directions: inference.directions,
                effects: inference.qiEffects,
                _sectionRef: "traditionalEnergy"
            }
        };
    }
    
    // Helper method to capitalize first letter
    capitalizeFirstLetter(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Calculate energy profile
    calculateEnergyProfile(tea) {
        // Default values (neutral)
        let temperature = 5; // 1 = very cold, 10 = very hot
        let moisture = 5;    // 1 = very dry, 10 = very moist
        let weight = 5;      // 1 = very light, 10 = very heavy
        let movement = 5;    // 1 = very descending, 10 = very ascending
        
        const teaType = tea.type || '';
        
        // Adjust based on tea type
        if (teaType === 'green') {
            temperature = 3; // cooling
            moisture = 6;    // slightly moist
            weight = 3;      // light
            movement = 7;    // ascending
        } else if (teaType === 'white') {
            temperature = 2; // very cooling
            moisture = 7;    // moist
            weight = 2;      // very light
            movement = 8;    // strongly ascending
        } else if (teaType === 'yellow') {
            temperature = 4; // mildly cooling
            moisture = 5;    // neutral
            weight = 4;      // somewhat light
            movement = 6;    // mildly ascending
        } else if (teaType === 'oolong') {
            // Different for light vs dark oolongs
            const oxidationLevel = tea.processing?.oxidationLevel || 50;
            
            if (oxidationLevel < 40) {
                // Light oolong
                temperature = 4; // slightly cooling
                moisture = 5;    // neutral
                weight = 4;      // somewhat light
                movement = 6;    // mildly ascending
            } else {
                // Dark oolong
                temperature = 6; // slightly warming
                moisture = 4;    // slightly dry
                weight = 6;      // somewhat heavy
                movement = 4;    // mildly descending
            }
        } else if (teaType === 'black') {
            temperature = 7; // warming
            moisture = 3;    // dry
            weight = 7;      // heavy
            movement = 3;    // descending
        } else if (teaType.includes('puerh')) {
            // Different for sheng vs shou
            if (tea.subType && (tea.subType.includes('sheng') || tea.subType.includes('raw'))) {
                // Sheng puerh
                temperature = 4; // slightly cooling
                moisture = 5;    // neutral
                weight = 6;      // somewhat heavy
                movement = 5;    // balanced
            } else {
                // Shou puerh or unspecified
                temperature = 8; // quite warming
                moisture = 2;    // very dry
                weight = 8;      // very heavy
                movement = 2;    // strongly descending
            }
        }
        
        // Adjust based on processing
        if (tea.processing) {
            // Oxidation level effects
            const oxidationLevel = tea.processing.oxidationLevel || 0;
            
            if (oxidationLevel > 0) {
                // Higher oxidation = warmer, drier, heavier, more descending
                temperature += (oxidationLevel - 50) / 25; // -2 to +2 based on oxidation
                moisture -= (oxidationLevel - 50) / 25;    // +2 to -2 based on oxidation
                weight += (oxidationLevel - 50) / 25;      // -2 to +2 based on oxidation
                movement -= (oxidationLevel - 50) / 25;    // +2 to -2 based on oxidation
            }
            
            // Roasting effects
            if (tea.processing.firing) {
                if (tea.processing.firing.includes('charcoal') || tea.processing.firing.includes('heavy')) {
                    temperature += 2; // much warmer
                    moisture -= 1;    // drier
                    weight += 1;      // heavier
                    movement -= 1;    // more descending
                } else if (tea.processing.firing.includes('medium')) {
                    temperature += 1; // warmer
                    moisture -= 0.5;  // slightly drier
                }
            }
        }
        
        // Adjust based on origin (simplified generalizations)
        if (tea.origin) {
            if (tea.origin.includes('Yunnan') || tea.origin.includes('Assam')) {
                // Yunnan and Assam teas tend to be more warming and substantial
                temperature += 1;
                weight += 1;
            } else if (tea.origin.includes('Darjeeling') || tea.origin.includes('Nepal')) {
                // Darjeeling and Nepal teas tend to be lighter and more ascending
                weight -= 1;
                movement += 1;
            } else if (tea.origin.includes('Japan')) {
                // Japanese teas tend to be more cooling and ascending
                temperature -= 1;
                movement += 1;
            } else if (tea.origin.includes('Wuyi')) {
                // Wuyi rock teas tend to be more grounding
                weight += 1;
                movement -= 1;
            }
        }
        
        // Adjust based on geography (if available)
        if (tea.geography) {
            if (tea.geography.altitude > 1000) {
                // High altitude = lighter, more ascending
                weight -= 1;
                movement += 1;
            }
        }
        
        // Cap all values to 1-10 range
        temperature = Math.min(10, Math.max(1, Math.round(temperature)));
        moisture = Math.min(10, Math.max(1, Math.round(moisture)));
        weight = Math.min(10, Math.max(1, Math.round(weight)));
        movement = Math.min(10, Math.max(1, Math.round(movement)));
        
        return {
            temperature,
            moisture,
            weight,
            movement
        };
    }
    
    // Calculate elemental balance
    calculateElementalBalance(tea) {
        // Default values (balanced)
        let wood = 5;  // 1-10 scale
        let fire = 5;  // 1-10 scale
        let earth = 5; // 1-10 scale
        let metal = 5; // 1-10 scale
        let water = 5; // 1-10 scale
        
        const teaType = tea.type || '';
        
        // Adjust based on tea type
        if (teaType === 'green') {
            wood += 3;  // Strong wood energy (spring, growth)
            metal += 1; // Some metal energy (clarity)
            fire -= 1;  // Less fire energy (not roasted)
        } else if (teaType === 'white') {
            metal += 3; // Strong metal energy (purity, clearing)
            wood += 1;  // Some wood energy (freshness)
            earth -= 1; // Less earth energy (not grounding)
        } else if (teaType === 'yellow') {
            earth += 2; // Moderate earth energy (centering)
            wood += 1;  // Some wood energy
            fire += 1;  // Some fire energy
        } else if (teaType === 'oolong') {
            // Different for light vs dark oolongs
            const oxidationLevel = tea.processing?.oxidationLevel || 50;
            
            if (oxidationLevel < 40) {
                // Light oolong
                wood += 2;  // Moderate wood energy
                fire += 1;  // Some fire energy
                metal += 1; // Some metal energy
            } else {
                // Dark oolong
                fire += 2;  // Moderate fire energy (roasting)
                earth += 2; // Moderate earth energy (grounding)
                wood -= 1;  // Less wood energy
            }
        } else if (teaType === 'black') {
            fire += 3;  // Strong fire energy (full oxidation)
            earth += 2; // Moderate earth energy (grounding)
            water -= 1; // Less water energy
            wood -= 1;  // Less wood energy
        } else if (teaType.includes('puerh')) {
            // Different for sheng vs shou
            if (tea.subType && (tea.subType.includes('sheng') || tea.subType.includes('raw'))) {
                // Sheng puerh
                wood += 2;  // Moderate wood energy
                water += 1; // Some water energy
                fire += 1;  // Some fire energy
            } else {
                // Shou puerh or unspecified
                water += 3; // Strong water energy (deep, descending)
                earth += 2; // Moderate earth energy (grounding)
                wood -= 1;  // Less wood energy
                metal -= 1; // Less metal energy
            }
        }
        
        // Adjust based on processing
        if (tea.processing) {
            // Oxidation effects
            const oxidationLevel = tea.processing.oxidationLevel || 0;
            
            if (oxidationLevel > 70) {
                fire += 2;  // More fire energy with high oxidation
                wood -= 1;  // Less wood energy
            } else if (oxidationLevel < 20) {
                wood += 1;  // More wood energy with low oxidation
                fire -= 1;  // Less fire energy
            }
            
            // Roasting effects
            if (tea.processing.firing) {
                if (tea.processing.firing.includes('charcoal') || tea.processing.firing.includes('heavy')) {
                    fire += 2;   // Much more fire energy
                    earth += 1;  // More earth energy
                    metal -= 1;  // Less metal energy
                } else if (tea.processing.firing.includes('medium')) {
                    fire += 1;   // More fire energy
                }
            }
        }
        
        // Adjust based on age
        if (tea.age && tea.age > 5) {
            water += Math.min(3, Math.floor(tea.age / 5)); // Older tea gains water energy
            wood -= Math.min(2, Math.floor(tea.age / 10)); // Loses wood energy
        }
        
        // Cap all values to 1-10 range
        wood = Math.min(10, Math.max(1, Math.round(wood)));
        fire = Math.min(10, Math.max(1, Math.round(fire)));
        earth = Math.min(10, Math.max(1, Math.round(earth)));
        metal = Math.min(10, Math.max(1, Math.round(metal)));
        water = Math.min(10, Math.max(1, Math.round(water)));
        
        return {
            wood,
            fire,
            earth,
            metal,
            water
        };
    }
    
    // Calculate directional tendencies
    calculateDirections(tea) {
        const { type = '', processing = {} } = tea;
        const energyProfile = this.calculateEnergyProfile(tea);
        
        let primary = '';
        let secondary = '';
        let notes = '';
        
        // Determine primary direction based on movement and tea type
        if (energyProfile.movement >= 8) {
            primary = 'Strongly Upward';
        } else if (energyProfile.movement >= 6) {
            primary = 'Upward';
        } else if (energyProfile.movement <= 3) {
            primary = 'Strongly Downward';
        } else if (energyProfile.movement <= 5) {
            primary = 'Downward';
        } else {
            primary = 'Balanced';
        }
        
        // Determine secondary direction based on tea type and processing
        if (type === 'green' || type === 'white') {
            if (energyProfile.temperature <= 3) {
                secondary = 'Outward';
                notes = 'Dispersing energy that moves to the exterior';
            }
        } else if (type === 'black' || (type.includes('puerh') && !tea.subType?.includes('sheng'))) {
            if (energyProfile.temperature >= 7) {
                secondary = 'Inward';
                notes = 'Consolidating energy that moves to the interior';
            }
        } else if (type === 'oolong') {
            if (processing.oxidationLevel && processing.oxidationLevel > 70) {
                secondary = 'Inward';
                notes = 'Moderately consolidating energy';
            } else if (processing.oxidationLevel && processing.oxidationLevel < 30) {
                secondary = 'Outward';
                notes = 'Moderately dispersing energy';
            } else {
                secondary = 'Balanced';
                notes = 'Harmonizing both inward and outward movements';
            }
        } else if (type.includes('puerh') && tea.subType?.includes('sheng')) {
            if (tea.age && tea.age > 10) {
                secondary = 'Inward';
                notes = 'Aged sheng develops more inward-directing qualities';
            } else {
                secondary = 'Outward then Inward';
                notes = 'Initial outward movement followed by deeper inward direction';
            }
        }
        
        // Special case for aged teas
        if (tea.age && tea.age > 15) {
            if (primary !== 'Strongly Downward') {
                primary = 'Downward';
            }
            secondary = 'Inward';
            notes = 'Deep settling energy characteristic of well-aged tea';
        }
        
        return {
            primary,
            secondary,
            notes
        };
    }
    
    // Calculate traditional Qi effects
    calculateQiEffects(energyProfile, elementalBalance, directions, tea) {
        const effects = {};
        const teaType = tea.type || '';
        
        // Temperature-based effects
        if (energyProfile.temperature <= 3) {
            effects.cooling = {
                description: 'Reduces heat in the body, calms fire, refreshes the spirit',
                intensity: 11 - energyProfile.temperature
            };
        } else if (energyProfile.temperature >= 7) {
            effects.warming = {
                description: 'Dispels cold, warms the core, invigorates circulation',
                intensity: energyProfile.temperature
            };
        }
        
        // Moisture-based effects
        if (energyProfile.moisture <= 3) {
            effects.drying = {
                description: 'Reduces dampness, clears phlegm, sharpens clarity',
                intensity: 11 - energyProfile.moisture
            };
        } else if (energyProfile.moisture >= 7) {
            effects.moistening = {
                description: 'Nourishes fluids, alleviates dryness, soothes tissues',
                intensity: energyProfile.moisture
            };
        }
        
        // Movement-based effects
        if (energyProfile.movement >= 7) {
            effects.lifting = {
                description: 'Raises sunken energy, uplifts the spirit, brightens the mind',
                intensity: energyProfile.movement
            };
        } else if (energyProfile.movement <= 4) {
            effects.sinking = {
                description: 'Anchors floating energy, calms restlessness, promotes rootedness',
                intensity: 11 - energyProfile.movement
            };
        }
        
        // Weight-based effects
        if (energyProfile.weight <= 3) {
            effects.lightening = {
                description: 'Disperses stagnation, creates spaciousness, promotes flexibility',
                intensity: 11 - energyProfile.weight
            };
        } else if (energyProfile.weight >= 7) {
            effects.anchoring = {
                description: 'Provides substance, stabilizes, creates enduring presence',
                intensity: energyProfile.weight
            };
        }
        
        // Elemental effects
        if (elementalBalance.wood >= 7) {
            effects.vitalizing = {
                description: 'Promotes growth, supports the liver, increases flexibility',
                intensity: elementalBalance.wood
            };
        }
        
        if (elementalBalance.fire >= 7) {
            effects.stimulating = {
                description: 'Activates circulation, supports the heart, increases joy',
                intensity: elementalBalance.fire
            };
        }
        
        if (elementalBalance.earth >= 7) {
            effects.centering = {
                description: 'Promotes stability, supports the spleen, nourishes tissues',
                intensity: elementalBalance.earth
            };
        }
        
        if (elementalBalance.metal >= 7) {
            effects.refining = {
                description: 'Enhances boundaries, supports the lungs, promotes clarity',
                intensity: elementalBalance.metal
            };
        }
        
        if (elementalBalance.water >= 7) {
            effects.deepening = {
                description: 'Builds reserves, supports the kidneys, increases stillness',
                intensity: elementalBalance.water
            };
        }
        
        // Special effects based on tea type
        if (teaType === 'green') {
            effects.clarifying = {
                description: 'Clears heat from the liver, brightens the eyes, sharpens vision',
                intensity: 8
            };
        } else if (teaType === 'white') {
            effects.gentleCooling = {
                description: 'Softly reduces heat while preserving resources, good for deficient heat conditions',
                intensity: 8
            };
        } else if (teaType === 'oolong') {
            if (tea.processing?.oxidationLevel < 50) {
                effects.harmonizing = {
                    description: 'Balances upper and middle energies, promotes smooth Qi flow',
                    intensity: 8
                };
            } else {
                effects.circulating = {
                    description: 'Moves stagnant Qi, particularly in the middle burner, supports transformation',
                    intensity: 8
                };
            }
        } else if (teaType === 'black') {
            effects.fortifying = {
                description: 'Strengthens the spleen, dispels cold, promotes digestive fire',
                intensity: 8
            };
        } else if (teaType.includes('puerh')) {
            if (tea.subType?.includes('sheng') || tea.subType?.includes('raw')) {
                effects.descending = {
                    description: 'Guides Qi downward, clears heat, resolves stagnation',
                    intensity: 8
                };
            } else {
                effects.transforming = {
                    description: 'Transforms dampness, harmonizes the middle burner, warms the core',
                    intensity: 9
                };
            }
        }
        
        // Special effects for aged teas
        if (tea.age && tea.age > 15) {
            effects.settling = {
                description: 'Creates profound stillness, connects to deep resources, nourishes essence',
                intensity: 7 + Math.min(3, Math.floor(tea.age / 10))
            };
        }
        
        return effects;
    }
    
    // Generate description of Qi characteristics
    generateQiDescription(energyProfile, elementalBalance, directions, tea) {
        const teaType = tea?.type || 'tea';
        
        let description = `This ${teaType} tea has a `;
        
        // Temperature description
        description += this.getTemperatureDescription(energyProfile.temperature).toLowerCase();
        
        // Moisture description
        description += ` and ${this.getMoistureDescription(energyProfile.moisture).toLowerCase()} energy profile, `;
        
        // Weight and movement description
        description += `characterized by a ${this.getWeightDescription(energyProfile.weight).toLowerCase()} body that tends to move ${this.getMovementDescription(energyProfile.movement).toLowerCase()}. `;
        
        // Directional tendencies
        description += `Its qi moves primarily in a ${directions.primary.toLowerCase()} direction`;
        
        if (directions.secondary) {
            description += ` with a secondary ${directions.secondary.toLowerCase()} movement`;
        }
        
        description += '. ';
        
        // Elemental balance
        const dominantElements = this.getDominantElements(elementalBalance);
        
        if (dominantElements.length > 0) {
            description += `From a five-element perspective, this tea emphasizes ${dominantElements.join(', ')} energies. `;
        } else {
            description += `From a five-element perspective, this tea has a relatively balanced energetic profile. `;
        }
        
        // Traditional effects
        const qiEffects = this.calculateQiEffects(energyProfile, elementalBalance, directions, tea);
        const topEffects = Object.entries(qiEffects)
            .sort((a, b) => b[1].intensity - a[1].intensity)
            .slice(0, 3)
            .map(([effect, _]) => effect);
        
        if (topEffects.length > 0) {
            description += `Its primary energetic qualities include ${topEffects.join(', ')}. `;
        }
        
        // Tea type specific descriptions
        if (teaType === 'green') {
            description += 'In traditional tea medicine, green tea is known for its ability to clear heat, brighten the eyes, and promote the free flow of Qi. ';
        } else if (teaType === 'white') {
            description += 'In traditional tea medicine, white tea is valued for its gentle cooling properties and ability to clear heat without depleting the body\'s resources. ';
        } else if (teaType === 'oolong') {
            if (tea.processing?.oxidationLevel < 50) {
                description += 'In traditional tea medicine, lighter oolongs are noted for their harmonizing effects on the middle burner and ability to lift the spirit. ';
            } else {
                description += 'In traditional tea medicine, darker oolongs are appreciated for their warming properties and ability to move stagnant Qi. ';
            }
        } else if (teaType === 'black') {
            description += 'In traditional tea medicine, black tea is used to warm the middle burner, strengthen the spleen, and dispel cold and dampness. ';
        } else if (teaType.includes('puerh')) {
            if (tea.subType?.includes('sheng') || tea.subType?.includes('raw')) {
                description += 'In traditional tea medicine, sheng puerh is known for its ability to clear heat, resolve stagnation, and guide Qi downward. ';
            } else {
                description += 'In traditional tea medicine, shou puerh is valued for its warming nature and ability to transform dampness in the middle burner. ';
            }
            
            if (tea.age && tea.age > 10) {
                description += 'With significant aging, the tea has developed deeper, more grounding qualities that nourish the core energy. ';
            }
        }
        
        // Add notes if available
        if (directions.notes) {
            description += directions.notes + '. ';
        }
        
        return description;
    }
    
    // Helper methods for descriptions
    
    getTemperatureDescription(value) {
        if (value <= 2) return 'Very Cold';
        if (value <= 3) return 'Cold';
        if (value <= 4) return 'Cool';
        if (value === 5) return 'Neutral';
        if (value <= 6) return 'Warm';
        if (value <= 8) return 'Hot';
        return 'Very Hot';
    }
    
    getMoistureDescription(value) {
        if (value <= 2) return 'Very Dry';
        if (value <= 3) return 'Dry';
        if (value <= 4) return 'Slightly Dry';
        if (value === 5) return 'Neutral';
        if (value <= 6) return 'Slightly Moist';
        if (value <= 8) return 'Moist';
        return 'Very Moist';
    }
    
    getWeightDescription(value) {
        if (value <= 2) return 'Very Light';
        if (value <= 3) return 'Light';
        if (value <= 4) return 'Somewhat Light';
        if (value === 5) return 'Balanced';
        if (value <= 6) return 'Somewhat Heavy';
        if (value <= 8) return 'Heavy';
        return 'Very Heavy';
    }
    
    getMovementDescription(value) {
        if (value <= 2) return 'Strongly Downward';
        if (value <= 3) return 'Downward';
        if (value <= 4) return 'Slightly Downward';
        if (value === 5) return 'Balanced';
        if (value <= 6) return 'Slightly Upward';
        if (value <= 8) return 'Upward';
        return 'Strongly Upward';
    }
    
    getDominantElements(elementalBalance) {
        const threshold = 7; // Consider elements with value 7 or higher as dominant
        return Object.entries(elementalBalance)
            .filter(([_, value]) => value >= threshold)
            .map(([element, _]) => element);
    }
} 