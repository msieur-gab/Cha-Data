// FlavorCalculator.js
// Handles calculations related to flavor influence on tea effects

import { BaseCalculator } from './BaseCalculator.js';
import { validateObject, sortByProperty, getTopItems } from '../utils/helpers.js';
import { effectMapping } from '../props/EffectMapping.js';

export class FlavorCalculator extends BaseCalculator {
  constructor(config) {
    super(config);
    this.effectMapping = effectMapping;
    this.flavorInfluences = {};
  }
  
  // Set flavor influences data
  setFlavorInfluences(flavorInfluences) {
    this.flavorInfluences = flavorInfluences || {};
  }

  // Override infer method from BaseCalculator
  infer(tea) {
    if (!tea || !tea.flavorProfile) {
      return {
        description: 'No flavor profile available',
        dominantFlavors: [],
        flavorCount: 0,
        flavorCategories: [],
        flavorInfluence: {},
        contributions: []
      };
    }

    const flavorAnalysis = this.getFlavorAnalysis(tea);
    const flavorInfluence = this.calculateFlavorInfluence(tea);
    
    // Get all unique effects from flavor influences
    const allEffects = new Set();
    
    // Safely traverse the flavorInfluences structure
    if (this.flavorInfluences && typeof this.flavorInfluences === 'object') {
      Object.values(this.flavorInfluences).forEach(category => {
        if (category && typeof category === 'object') {
          Object.values(category).forEach(subcategory => {
            if (subcategory && subcategory.effects) {
              if (Array.isArray(subcategory.effects)) {
                // Old format with array of effect names
                subcategory.effects.forEach(effect => allEffects.add(effect));
              } else if (typeof subcategory.effects === 'object') {
                // New format with object of effect names and scores
                Object.keys(subcategory.effects).forEach(effect => allEffects.add(effect));
              }
            }
          });
        }
      });
    }
    
    // Calculate contributions for all effects
    const contributions = Array.from(allEffects).map(effect => {
      const flavorContributions = this.calculateFlavorContributions(tea, effect);
      return {
        effect,
        contributions: flavorContributions.map(({ flavor, contribution }) => ({
          flavor,
          score: contribution
        }))
      };
    }).filter(({ contributions }) => contributions.length > 0);
    
    return {
      description: flavorAnalysis.description,
      dominantFlavors: flavorAnalysis.dominantFlavors,
      flavorCount: flavorAnalysis.flavorCount,
      flavorCategories: flavorAnalysis.flavorCategories,
      flavorInfluence,
      contributions,
      flavorScores: this.calculateFlavorScores(tea)
    };
  }

  // Override formatInference from BaseCalculator
  formatInference(inference) {
    if (!inference) {
      return '## Flavor Analysis\n\nNo flavor data available.';
    }

    let md = '## Flavor Analysis\n\n';
    
    // Add description
    md += `${inference.description}\n\n`;
    
    // Add dominant flavors
    if (inference.dominantFlavors && inference.dominantFlavors.length > 0) {
      md += '### Dominant Flavors\n\n';
      inference.dominantFlavors.forEach(flavor => {
        md += `- **${flavor}**\n`;
      });
      md += '\n';
    }
    
    // Add flavor categories
    if (inference.flavorCategories && inference.flavorCategories.length > 0) {
      md += '### Flavor Categories\n\n';
      inference.flavorCategories.forEach(category => {
        md += `- ${category}\n`;
      });
      md += '\n';
    }
    
    // Add flavor influence on effects
    if (inference.contributions && inference.contributions.length > 0) {
      md += '### Flavor Influence on Effects\n\n';
      inference.contributions.forEach(({ effect, contributions }) => {
        md += `#### ${effect}\n`;
        contributions.forEach(({ flavor, score }) => {
          const contribution = typeof score === 'number' ? score : 0;
          // Ensure barLength is between 0 and 10
          const barLength = Math.min(10, Math.max(0, Math.round(contribution * 2))); // Scale to 10
          const emptyLength = Math.max(0, 10 - barLength);
          const bar = '█'.repeat(barLength) + '░'.repeat(emptyLength);
          
          md += `- ${flavor}: ${contribution.toFixed(1)}/5\n`;
          md += `  [${bar}]\n`;
        });
        md += '\n';
      });
    }
    
    return md;
  }

  // Override serialize from BaseCalculator
  serialize(inference) {
    if (!inference) {
      return {
        flavorScores: {},
        flavor: {
          profile: {
            description: 'No flavor data available',
            dominantFlavors: [],
            flavorCount: 0,
            influence: {}
          },
          categories: [],
          contributions: [],
          _sectionRef: "flavor"
        }
      };
    }

    // Calculate flavor scores
    const flavorScores = inference.flavorScores || {};

    // Create the profile section
    const profile = {
      description: inference.description || 'No description available',
      dominantFlavors: inference.dominantFlavors || [],
      flavorCount: inference.flavorCount || 0,
      influence: inference.flavorInfluence || {}
    };

    // Create the categories section
    const categories = inference.flavorCategories || [];

    // Create the contributions section
    const contributions = (inference.contributions || []).map(({ effect, contributions }) => ({
      effect: effect || 'Unknown Effect',
      contributions: (contributions || []).map(({ flavor, score }) => ({
        flavor: flavor || 'Unknown Flavor',
        score: typeof score === 'number' ? score : 0
      }))
    }));

    return {
      flavorScores,
      flavor: {
        profile,
        categories,
        contributions,
        _sectionRef: "flavor"
      }
    };
  }
  
  // Calculate flavor influence scores for final output
  calculateFlavorScores(tea) {
    if (!tea || !tea.flavorProfile || !Array.isArray(tea.flavorProfile)) {
        return {};
    }
    
    // Initialize scores with 8 consolidated effects
    const scores = {
        energizing: 0,
        calming: 0,
        focusing: 0,
        harmonizing: 0,
        grounding: 0,
        elevating: 0,
        comforting: 0,
        restorative: 0
    };
    
    // Process each flavor in the profile
    tea.flavorProfile.forEach(flavor => {
        if (typeof flavor !== 'string') return;
        
        const normalizedFlavor = flavor.toLowerCase().trim();
        
        // Search through all flavor categories
        Object.entries(this.flavorInfluences).forEach(([categoryName, category]) => {
            // Handle different flavor influences formats
            Object.entries(category).forEach(([subcategoryName, subcategory]) => {
                // Check if this subcategory contains our flavor
                // Handle both formats: array of flavors or associatedFlavors
                const flavorList = subcategory.flavors || subcategory.associatedFlavors || [];
                if (flavorList.includes(normalizedFlavor) || flavorList.some(f => normalizedFlavor.includes(f))) {
                    // Handle different effect formats
                    if (Array.isArray(subcategory.effects)) {
                        // Old format with array of effect names
                        subcategory.effects.forEach(effect => {
                            // Map old effect names to new consolidated ones
                            const mappedEffect = this.mapEffectName(effect);
                            if (scores.hasOwnProperty(mappedEffect)) {
                                scores[mappedEffect] += (subcategory.intensity || 1);
                            }
                        });
                    } else if (typeof subcategory.effects === 'object') {
                        // New format with object of effect names and scores
                        Object.entries(subcategory.effects).forEach(([effect, value]) => {
                            if (scores.hasOwnProperty(effect)) {
                                scores[effect] += value * (subcategory.intensity || 1) / 10;
                            }
                        });
                    }
                }
            });
        });
    });
    
    // Cap all scores at 10
    Object.keys(scores).forEach(effect => {
        scores[effect] = Math.min(10, scores[effect]);
    });
    
    return scores;
  }
  
  // Map old effect names to new consolidated effects
  mapEffectName(effect) {
    const effectMap = {
        'peaceful': 'calming',
        'balancing': 'harmonizing',
        'soothing': 'calming',
        'awakening': 'energizing',
        'clarifying': 'focusing',
        'renewing': 'restorative',
        'elevating': 'elevating',
        'revitalizing': 'energizing',
        'stabilizing': 'grounding',
        'centering': 'grounding',
        'reflective': 'focusing',
        'nurturing': 'comforting',
        'comforting': 'comforting',
        'warming': 'energizing',
        'restorative': 'restorative'
    };
    
    return effectMap[effect.toLowerCase()] || effect.toLowerCase();
  }
  
  // Calculate flavor influence on effects
  calculateFlavorInfluence(tea) {
    if (!tea || !tea.flavorProfile || !Array.isArray(tea.flavorProfile)) {
        return {};
    }
    
    return this.calculateFlavorScores(tea);
  }
  
  // Calculate which flavors contribute to a specific effect
  calculateFlavorContributions(tea, effectId) {
    if (!tea || !tea.flavorProfile || !Array.isArray(tea.flavorProfile)) {
      return [];
    }
    
    const contributions = [];
    
    // Process each flavor
    tea.flavorProfile.forEach(flavor => {
      if (typeof flavor !== 'string') return;
      
      const normalizedFlavor = flavor.toLowerCase().trim();
      let totalContribution = 0;
      
      // Check each category
      Object.values(this.flavorInfluences).forEach(category => {
        // Check each subcategory
        Object.entries(category).forEach(([subcategoryName, subcategory]) => {
          // Get flavor list, handling both formats
          const flavorList = subcategory.flavors || subcategory.associatedFlavors || [];
          
          // Check if flavor exists in this subcategory
          let hasEffect = false;
          
          // Check for the effect in both formats
          if (Array.isArray(subcategory.effects)) {
            // Old format with array of effect names
            const mappedEffect = this.mapEffectName(effectId);
            hasEffect = subcategory.effects.includes(effectId) || subcategory.effects.includes(mappedEffect);
          } else if (typeof subcategory.effects === 'object') {
            // New format with object of effect names and scores
            hasEffect = subcategory.effects.hasOwnProperty(effectId);
          }
          
          if (flavorList.includes(normalizedFlavor) && hasEffect) {
            // Add contribution (using appropriate format)
            if (Array.isArray(subcategory.effects)) {
              totalContribution += subcategory.influence || subcategory.intensity || 3;
            } else {
              totalContribution += (subcategory.effects[effectId] || 0) * 
                                  (subcategory.intensity || subcategory.influence || 1) / 10;
            }
          }
        });
      });
      
      if (totalContribution > 0) {
        contributions.push({
          flavor,
          contribution: totalContribution
        });
      }
    });
    
    // Sort by contribution
    return contributions.sort((a, b) => b.contribution - a.contribution);
  }
  
  // Get dominant flavors from flavor profile
  getDominantFlavors(flavorProfile, limit = 3) {
    if (!flavorProfile || !Array.isArray(flavorProfile)) {
      return [];
    }
    
    // Group identical flavors
    const flavorCounts = {};
    flavorProfile.forEach(flavor => {
      if (typeof flavor !== 'string') return;
      
      const normalizedFlavor = flavor.toLowerCase().trim();
      flavorCounts[normalizedFlavor] = (flavorCounts[normalizedFlavor] || 0) + 1;
    });
    
    // Sort flavors by count
    const sortedFlavors = Object.entries(flavorCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([flavor]) => {
        // Title case the flavor name
        return flavor.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
      });
    
    return sortedFlavors.slice(0, limit);
  }
  
  // Get comprehensive flavor analysis
  getFlavorAnalysis(tea) {
    if (!tea || !tea.flavorProfile || !Array.isArray(tea.flavorProfile)) {
      return {
        description: 'No flavor profile available',
        dominantFlavors: [],
        flavorCount: 0,
        flavorCategories: []
      };
    }
    
    const flavorProfile = tea.flavorProfile.filter(f => typeof f === 'string');
    const flavorCount = flavorProfile.length;
    const dominantFlavors = this.getDominantFlavors(flavorProfile);
    
    // Extract flavor categories
    const flavorCategories = new Set();
    flavorProfile.forEach(flavor => {
      const normalizedFlavor = flavor.toLowerCase().trim();
      
      // Check each category
      Object.entries(this.flavorInfluences).forEach(([categoryName, category]) => {
        // Check each subcategory
        Object.values(category).forEach(subcategory => {
          // Get flavor list, handling both formats
          const flavorList = subcategory.flavors || subcategory.associatedFlavors || [];
          
          // Check if flavor exists in this subcategory
          if (flavorList.includes(normalizedFlavor) || flavorList.some(f => normalizedFlavor.includes(f))) {
            flavorCategories.add(categoryName);
          }
        });
      });
    });
    
    // Generate a description
    let description = 'This tea has ';
    if (flavorCount === 0) {
      description += 'no specified flavors.';
    } else if (flavorCount === 1) {
      description += `a single predominant flavor: ${dominantFlavors[0]}.`;
    } else if (flavorCount <= 3) {
      description += `a simple flavor profile dominated by ${dominantFlavors.join(', ')}.`;
    } else if (flavorCount <= 6) {
      description += `a moderately complex flavor profile. Primary flavors include ${dominantFlavors.join(', ')}.`;
    } else {
      description += `a rich and complex flavor profile with many nuances. Dominant notes include ${dominantFlavors.join(', ')}.`;
    }
    
    return {
      description,
      dominantFlavors,
      flavorCount,
      flavorCategories: Array.from(flavorCategories)
    };
  }
}