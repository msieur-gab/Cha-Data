// TeaTypeCalculator.js
// Handles calculations related to tea types and their inherent effects

import { BaseCalculator } from './BaseCalculator.js';

export class TeaTypeCalculator extends BaseCalculator {
    constructor(config) {
        super(config);
        this.teaTypeEffects = {};
    }
    
    // Set tea type effects data
    setTeaTypeEffects(teaTypeEffects) {
        this.teaTypeEffects = teaTypeEffects || {};
    }
    
    // Override infer method from BaseCalculator
    infer(tea) {
        if (!tea || !tea.type) {
            return {
                description: 'No tea type data available',
                teaType: 'unknown',
                typeEffects: {},
                typeScores: {}
            };
        }
        
        // Get tea type information
        const teaType = tea.type.toLowerCase();
        const subType = tea.subType || '';
        const typeEffects = this.getTeaTypeEffects(teaType, subType);
        const typeScores = this.calculateTypeScores(teaType, subType);
        const description = this.generateTypeDescription(teaType, subType, tea);
        
        return {
            description,
            teaType,
            subType,
            typeEffects,
            typeScores
        };
    }
    
    // Override formatInference from BaseCalculator
    formatInference(inference) {
        if (!inference || !inference.teaType || inference.teaType === 'unknown') {
            return '## Tea Type Analysis\n\nNo tea type data available.';
        }
        
        let md = '## Tea Type Analysis\n\n';
        
        // Add description
        md += `${inference.description}\n\n`;
        
        // Add tea type details
        md += '### Tea Type Details\n';
        
        md += `- **Primary Type**: ${this.capitalizeFirstLetter(inference.teaType)}\n`;
        
        if (inference.subType) {
            md += `- **Sub-Type**: ${this.capitalizeFirstLetter(inference.subType)}\n`;
        }
        
        // Add tea type effects
        md += `\n### Type-Based Effects\n`;
        
        if (inference.typeEffects && Object.keys(inference.typeEffects).length > 0) {
            Object.entries(inference.typeEffects).forEach(([effect, details]) => {
                md += `- **${effect}**: ${details.description}\n`;
                
                if (details.intensity) {
                    const bars = '■'.repeat(Math.floor(details.intensity / 2)) + 
                               '□'.repeat(5 - Math.floor(details.intensity / 2));
                    md += `  Intensity: [${bars}] ${details.intensity}/10\n`;
                }
            });
        } else {
            md += `No specific type effects identified.\n`;
        }
        
        // Add calculated scores
        md += `\n### Effect Scores from Tea Type\n`;
        
        if (inference.typeScores && Object.keys(inference.typeScores).length > 0) {
            Object.entries(inference.typeScores).forEach(([effect, score]) => {
                md += `- **${effect}**: ${score.toFixed(1)}/10\n`;
            });
        } else {
            md += `No type scores calculated.\n`;
        }
        
        return md;
    }
    
    // Override serialize from BaseCalculator
    serialize(inference) {
        if (!inference) {
            return {
                typeScores: {},
                teaType: {
                    description: 'No tea type data available',
                    primaryType: 'unknown',
                    subType: '',
                    effects: {},
                    _sectionRef: "teaType"
                }
            };
        }
        
        return {
            typeScores: inference.typeScores,
            teaType: {
                description: inference.description,
                primaryType: inference.teaType,
                subType: inference.subType,
                effects: inference.typeEffects,
                _sectionRef: "teaType"
            }
        };
    }
    
    // Helper method to capitalize first letter
    capitalizeFirstLetter(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Get tea type effects based on type and subtype
    getTeaTypeEffects(teaType, subType = '') {
        const effects = {};
        
        // Process by primary tea type
        this.applyPrimaryTypeEffects(effects, teaType);
        
        // Process by sub-type if available
        if (subType) {
            this.applySubTypeEffects(effects, teaType, subType);
        }
        
        return effects;
    }
    
    // Apply effects based on primary tea type
    applyPrimaryTypeEffects(effects, teaType) {
        // Green tea effects
        if (teaType === 'green') {
            effects.focusing = {
                description: 'Green teas have a natural balance of compounds that enhance mental clarity and focus.',
                intensity: 7
            };
            effects.refreshing = {
                description: 'The crisp, clean nature of green tea provides a refreshing effect.',
                intensity: 8
            };
            effects.clarifying = {
                description: 'Green teas help clear mental fog and support clearer thinking.',
                intensity: 6
            };
        }
        // White tea effects
        else if (teaType === 'white') {
            effects.calming = {
                description: 'White teas have a gentle, subtle energy that promotes calmness.',
                intensity: 8
            };
            effects.uplifting = {
                description: 'The delicate nature of white tea creates a subtly uplifting effect.',
                intensity: 6
            };
            effects.harmonizing = {
                description: 'White teas help bring the body and mind into gentle harmony.',
                intensity: 7
            };
        }
        // Oolong tea effects
        else if (teaType === 'oolong') {
            effects.harmonizing = {
                description: 'Oolong teas balance stimulating and calming qualities for overall harmony.',
                intensity: 8
            };
            effects.focusing = {
                description: 'The unique processing of oolong creates a tea that supports sustained focus.',
                intensity: 7
            };
            effects.centering = {
                description: 'Oolong teas help center the mind while maintaining awareness.',
                intensity: 6
            };
        }
        // Black tea effects
        else if (teaType === 'black') {
            effects.energizing = {
                description: 'Black teas provide robust energy through higher caffeine content and full oxidation.',
                intensity: 8
            };
            effects.grounding = {
                description: 'The full-bodied nature of black tea creates a grounding, stabilizing effect.',
                intensity: 7
            };
            effects.warming = {
                description: 'Black teas have an inherent warming quality that is comforting.',
                intensity: 6
            };
        }
        // Dark tea effects (including puerh)
        else if (teaType === 'dark' || teaType === 'puerh' || teaType.includes('puerh')) {
            effects.grounding = {
                description: 'Puerh and dark teas have deep grounding qualities from post-fermentation.',
                intensity: 9
            };
            effects.centering = {
                description: 'The earthy qualities of dark teas create a centering effect.',
                intensity: 7
            };
            effects.stabilizing = {
                description: 'Dark teas provide a stable, long-lasting energy rather than a quick surge.',
                intensity: 8
            };
        }
        // Yellow tea effects
        else if (teaType === 'yellow') {
            effects.balancing = {
                description: 'Yellow teas have a unique processing that creates balanced effects.',
                intensity: 8
            };
            effects.clarifying = {
                description: 'Yellow teas help clear the mind while maintaining equanimity.',
                intensity: 7
            };
            effects.focusing = {
                description: 'The gentle nature of yellow tea supports a soft focus state.',
                intensity: 6
            };
        }
        // Herbal tea/tisane general effects
        else if (teaType === 'herbal' || teaType === 'tisane') {
            effects.varied = {
                description: 'Herbal teas have widely varying effects depending on their specific ingredients.',
                intensity: 5
            };
            // Note: Specific herbs would need their own specialized effects
        }
        
        return effects;
    }
    
    // Apply effects based on sub-type
    applySubTypeEffects(effects, teaType, subType) {
        // Green tea sub-types
        if (teaType === 'green') {
            if (subType.includes('matcha')) {
                effects.focusing.intensity += 2;
                effects.energizing = {
                    description: 'Matcha provides concentrated compounds and nutrients for sustained energy.',
                    intensity: 8
                };
            } else if (subType.includes('gyokuro') || subType.includes('shade-grown')) {
                effects.calming = {
                    description: 'Shade-grown teas have higher L-theanine content for enhanced calming effects.',
                    intensity: 7
                };
                effects.focusing.intensity += 1;
            } else if (subType.includes('sencha')) {
                effects.balancing = {
                    description: 'Sencha has a balanced profile that helps regulate energy and mood.',
                    intensity: 7
                };
            } else if (subType.includes('dragonwell') || subType.includes('longjing')) {
                effects.centering = {
                    description: 'The pan-fired nature of Dragonwell creates a centering, focused quality.',
                    intensity: 7
                };
            }
        }
        // Oolong sub-types
        else if (teaType === 'oolong') {
            if (subType.includes('rock') || subType.includes('yan') || subType.includes('wuyi')) {
                effects.grounding = {
                    description: 'Rock oolongs have a mineral quality that creates a strong grounding effect.',
                    intensity: 8
                };
            } else if (subType.includes('dan cong')) {
                effects.uplifting = {
                    description: 'Dan Cong oolongs have aromatic qualities that create an uplifting effect.',
                    intensity: 7
                };
            } else if (subType.includes('milk') || subType.includes('jin xuan')) {
                effects.comforting = {
                    description: 'Milk oolongs have a naturally creamy quality that is deeply comforting.',
                    intensity: 8
                };
            } else if (subType.includes('tie guan yin') || subType.includes('iron goddess')) {
                effects.balancing = {
                    description: 'Traditional Tie Guan Yin has a perfect balance for harmonizing mind and body.',
                    intensity: 8
                };
            }
        }
        // Puerh sub-types
        else if (teaType === 'puerh' || teaType.includes('puerh')) {
            if (subType.includes('sheng') || subType.includes('raw')) {
                effects.clarifying = {
                    description: 'Raw puerh has astringent qualities that create a clarifying effect.',
                    intensity: 7
                };
                effects.energizing = {
                    description: 'Young sheng puerh can have significant energizing effects.',
                    intensity: 6
                };
            } else if (subType.includes('shou') || subType.includes('ripe')) {
                effects.grounding.intensity += 1;
                effects.comforting = {
                    description: 'Ripe puerh has warm, earthy qualities that create a deeply comforting effect.',
                    intensity: 8
                };
            } else if (subType.includes('aged')) {
                effects.centering.intensity += 2;
                effects.medicinal = {
                    description: 'Aged puerh develops unique compounds with pronounced medicinal qualities.',
                    intensity: 7
                };
            }
        }
        // Black tea sub-types
        else if (teaType === 'black') {
            if (subType.includes('assam')) {
                effects.energizing.intensity += 1;
                effects.invigorating = {
                    description: 'Assam has a robust, malty profile that creates highly invigorating effects.',
                    intensity: 8
                };
            } else if (subType.includes('darjeeling')) {
                effects.elevating = {
                    description: 'Darjeeling has muscatel notes that create an elevating, mood-enhancing effect.',
                    intensity: 7
                };
            } else if (subType.includes('keemun')) {
                effects.focusing.intensity = 7;
                effects.soothing = {
                    description: 'Keemun has a smooth character that creates a soothing effect alongside energy.',
                    intensity: 6
                };
            } else if (subType.includes('yunnan') || subType.includes('dian hong')) {
                effects.nourishing = {
                    description: 'Yunnan black teas have rich, sweet qualities that create a nourishing effect.',
                    intensity: 7
                };
            }
        }
        
        // Cap all intensities at 10
        Object.values(effects).forEach(effect => {
            if (effect.intensity > 10) effect.intensity = 10;
        });
        
        return effects;
    }
    
    // Generate a description of the tea type
    generateTypeDescription(teaType, subType, tea) {
        if (!teaType || teaType === 'unknown') {
            return 'The tea type is unknown or not specified.';
        }
        
        let description = '';
        const origin = tea.origin ? ` from ${tea.origin}` : '';
        
        // Generate description based on tea type
        if (teaType === 'green') {
            description = `This is a green tea${origin}, characterized by minimal oxidation and typically vegetal, fresh flavors. Green teas are known for their focusing and refreshing qualities, with higher levels of catechins and L-theanine.`;
            
            if (subType) {
                if (subType.includes('matcha')) {
                    description += ` As a matcha, it's stone-ground into a fine powder and contains the entire leaf, resulting in concentrated effects and nutrients.`;
                } else if (subType.includes('gyokuro') || subType.includes('shade-grown')) {
                    description += ` Being shade-grown, this tea has developed higher levels of L-theanine and chlorophyll, creating a uniquely balanced calming yet focusing effect.`;
                } else if (subType.includes('sencha')) {
                    description += ` Sencha is Japan's most consumed tea, offering a balanced profile with moderate caffeine and L-theanine levels.`;
                } else if (subType.includes('dragonwell') || subType.includes('longjing')) {
                    description += ` Longjing (Dragonwell) is pan-fired to create its distinctive flat appearance and nutty, chestnut-like flavor profile that contributes to its centering effect.`;
                }
            }
        } else if (teaType === 'white') {
            description = `This is a white tea${origin}, which undergoes minimal processing with no rolling or oxidation. White teas are known for their delicate flavors and calming, harmonizing effects with naturally high antioxidant content.`;
            
            if (subType) {
                if (subType.includes('silver needle') || subType.includes('bai hao yin zhen')) {
                    description += ` Silver Needle (Bai Hao Yin Zhen) is made solely from buds, resulting in the highest concentration of natural compounds and a distinctly subtle yet complex effect.`;
                } else if (subType.includes('white peony') || subType.includes('bai mu dan')) {
                    description += ` White Peony (Bai Mu Dan) includes both buds and young leaves, creating a slightly fuller flavor profile while maintaining the characteristic gentleness of white tea.`;
                }
            }
        } else if (teaType === 'oolong') {
            description = `This is an oolong tea${origin}, which is partially oxidized between green and black tea. Oolongs are known for their complexity and harmonizing qualities, offering a balance of stimulating and calming effects.`;
            
            if (subType) {
                if (subType.includes('rock') || subType.includes('yan') || subType.includes('wuyi')) {
                    description += ` As a rock oolong from the Wuyi mountains, it has developed a distinctive mineral character that creates a profound grounding effect.`;
                } else if (subType.includes('dan cong')) {
                    description += ` Dan Cong oolongs are known for their aromatic complexity, often mimicking various flowers or fruits, which contributes to their uplifting nature.`;
                } else if (subType.includes('milk') || subType.includes('jin xuan')) {
                    description += ` Jin Xuan (Milk Oolong) has a naturally creamy, smooth quality that creates a uniquely comforting drinking experience.`;
                } else if (subType.includes('tie guan yin') || subType.includes('iron goddess')) {
                    description += ` Tie Guan Yin (Iron Goddess of Mercy) is renowned for its balanced profile that harmonizes body and mind, with floral notes and a smooth finish.`;
                }
            }
        } else if (teaType === 'black') {
            description = `This is a black tea${origin}, which is fully oxidized, resulting in robust flavors and energizing effects. Black teas typically contain higher caffeine levels and developed tannins that contribute to their grounding nature.`;
            
            if (subType) {
                if (subType.includes('assam')) {
                    description += ` Assam teas are known for their malty, robust character and high caffeine content, making them particularly invigorating.`;
                } else if (subType.includes('darjeeling')) {
                    description += ` Darjeeling, often called the "champagne of teas," has muscatel notes and a complexity that creates an elevating effect.`;
                } else if (subType.includes('keemun')) {
                    description += ` Keemun has a subtle smoky character with chocolate notes that balance its energizing qualities with a soothing effect.`;
                } else if (subType.includes('yunnan') || subType.includes('dian hong')) {
                    description += ` Yunnan black tea (Dian Hong) has rich, honey-like notes with malty sweetness that creates a unique nourishing quality alongside its energy.`;
                }
            }
        } else if (teaType === 'puerh' || teaType.includes('puerh')) {
            description = `This is a puerh tea${origin}, which undergoes microbial fermentation and aging. Puerh teas are known for their deep, earthy qualities and pronounced grounding, centering effects.`;
            
            if (subType) {
                if (subType.includes('sheng') || subType.includes('raw')) {
                    description += ` As a raw (sheng) puerh, it has undergone natural aging with minimal processing, resulting in more astringent qualities and energizing effects that evolve over time.`;
                } else if (subType.includes('shou') || subType.includes('ripe')) {
                    description += ` As a ripe (shou) puerh, it has undergone accelerated fermentation, resulting in smooth, earthy qualities and a distinctly comforting, grounding effect.`;
                } else if (subType.includes('aged')) {
                    description += ` With significant aging, this puerh has developed complex flavors and unique compounds that create pronounced medicinal and centering qualities.`;
                }
            }
        } else if (teaType === 'yellow') {
            description = `This is a yellow tea${origin}, a rare category that undergoes a unique "yellowing" process between green and white tea processing. Yellow teas are known for their smooth, balanced character and gentle focusing effects.`;
        } else if (teaType === 'herbal' || teaType === 'tisane') {
            description = `This is an herbal infusion${origin}, not made from the Camellia sinensis plant. Herbal teas have widely varying properties depending on their specific ingredients.`;
            
            if (subType) {
                description += ` This particular blend is ${subType}, which has its own unique effects profile.`;
            }
        } else {
            description = `This is a ${teaType} tea${origin}. Its specific characteristics may vary based on processing and origin.`;
        }
        
        return description;
    }
    
    // Calculate tea type scores for effects
    calculateTypeScores(teaType, subType) {
        const scores = {};
        
        // Get base effects from tea type
        const typeEffects = this.getTeaTypeEffects(teaType, subType);
        
        // Convert effect intensities to scores
        Object.entries(typeEffects).forEach(([effect, details]) => {
            scores[effect] = details.intensity;
        });
        
        return scores;
    }
} 