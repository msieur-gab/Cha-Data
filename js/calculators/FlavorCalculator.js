// FlavorCalculator.js
// Handles calculations related to flavor influence on tea effects

import { validateObject, sortByProperty, getTopItems } from '../utils/helpers.js';
import { effectMapping } from '../props/EffectMapping.js';

export class FlavorCalculator {
  constructor(config, flavorInfluences) {
    this.config = config;
    this.flavorInfluences = flavorInfluences || {};
    this.effectMapping = effectMapping;
  }
  
  // Main calculate method following our standardized pattern
  calculate(tea) {
    const inference = this.infer(tea);
    return {
      inference: this.formatInference(inference),
      data: this.serialize(inference)
    };
  }

  // Infer flavor analysis
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
    const flavorInfluence = this.calculateFlavorInfluence(tea.flavorProfile);
    
    // Get all unique effects from flavor influences
    const allEffects = new Set();
    Object.values(this.flavorInfluences).forEach(category => {
      Object.values(category).forEach(subcategory => {
        subcategory.effects.forEach(effect => allEffects.add(effect));
      });
    });
    
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
      contributions
    };
  }

  // Format inference as markdown
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
          const barLength = Math.round(contribution * 2); // Scale to 10
          const bar = '█'.repeat(barLength) + '░'.repeat(10 - barLength);
          
          md += `- ${flavor}: ${contribution.toFixed(1)}/5\n`;
          md += `  [${bar}]\n`;
        });
        md += '\n';
      });
    }
    
    return md;
  }

  // Serialize inference for JSON export
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
    const flavorScores = this.calculateFlavorScores(inference);

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
    
    // Calculate influence of each flavor on effects
    const flavorInfluence = this.calculateFlavorInfluence(tea.flavorProfile);
    
    // Only transfer scores for consolidated effects
    Object.entries(flavorInfluence).forEach(([effect, score]) => {
      if (scores.hasOwnProperty(effect)) {
        scores[effect] += score;
      }
      // Ignore any old effect names
    });
    
    return scores;
  }

  // Calculate the influence of flavors on tea effects
  calculateFlavorInfluence(flavorProfile) {
    if (!Array.isArray(flavorProfile) || !this.flavorInfluences) {
      return {};
    }
    
    // Initialize with consolidated effects
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
    flavorProfile.forEach(flavor => {
      // Search through all categories and subcategories
      Object.entries(this.flavorInfluences).forEach(([category, subcategories]) => {
        Object.entries(subcategories).forEach(([subcategoryName, data]) => {
          if (data.flavors.includes(flavor)) {
            // Add each effect from this subcategory with its intensity
            data.effects.forEach(effect => {
              // Only add if it's one of our 8 consolidated effects
              if (scores.hasOwnProperty(effect)) {
                scores[effect] += data.intensity;
              }
              // Ignore any old effect names
            });
          }
        });
      });
    });
    
    // Apply special flavor combinations
    this.applyFlavorCombinationEffects(flavorProfile, scores);
    
    return scores;
  }

  // Apply special effects for specific flavor combinations
  applyFlavorCombinationEffects(flavorProfile, scores) {
    // Define flavor combinations and their effects on consolidated effects
    const flavorCombinations = [
      {
        combination: ['umami', 'marine'],
        effects: { focusing: 1.5, grounding: 1.0 }
      },
      {
        combination: ['floral', 'fruity'],
        effects: { elevating: 1.5, calming: 0.8 }
      },
      {
        combination: ['woody', 'earthy'],
        effects: { grounding: 1.5, comforting: 1.0 }
      },
      {
        combination: ['vegetal', 'grassy'],
        effects: { energizing: 1.2, focusing: 0.8 }
      },
      {
        combination: ['honey', 'caramel'],
        effects: { comforting: 1.5, restorative: 1.0 }
      },
      {
        combination: ['nutty', 'toasty'],
        effects: { grounding: 1.2, comforting: 1.0 }
      },
      {
        combination: ['citrus', 'fruity'],
        effects: { energizing: 1.5, elevating: 1.0 }
      },
      {
        combination: ['spicy', 'woody'],
        effects: { grounding: 1.2, energizing: 0.8 }
      }
    ];
    
    // Check for presence of each combination
    flavorCombinations.forEach(({ combination, effects }) => {
      // Count how many flavors from the combination are present
      const matchingFlavors = combination.filter(flavor => 
        flavorProfile.includes(flavor)
      );
      
      // If all flavors are present, apply the effect
      if (matchingFlavors.length === combination.length) {
        Object.entries(effects).forEach(([effect, boost]) => {
          if (!scores[effect]) {
            scores[effect] = 0;
          }
          scores[effect] += boost;
        });
      }
    });
  }
  
  // Calculate the contribution of individual flavors to a specific effect
  calculateFlavorContributions(tea, effectId) {
    if (!tea || !tea.flavorProfile || !Array.isArray(tea.flavorProfile) || !effectId) {
      return [];
    }
    
    const contributions = [];
    
    // Process each flavor in the profile
    tea.flavorProfile.forEach(flavor => {
      let totalContribution = 0;
      
      // Search through all categories and subcategories
      Object.entries(this.flavorInfluences).forEach(([category, subcategories]) => {
        Object.entries(subcategories).forEach(([subcategoryName, data]) => {
          if (data.flavors.includes(flavor) && data.effects.includes(effectId)) {
            totalContribution += data.intensity;
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
    
    // Sort by contribution strength (descending)
    return sortByProperty(contributions, 'contribution');
  }
  
  // Get dominant flavors from flavor profile
  getDominantFlavors(flavorProfile, limit = 3) {
    if (!Array.isArray(flavorProfile) || flavorProfile.length === 0) {
      return [];
    }
    
    // Calculate influence scores for each flavor
    const flavorScores = flavorProfile.map(flavor => {
      let score = 0;
      Object.entries(this.flavorInfluences).forEach(([category, subcategories]) => {
        Object.entries(subcategories).forEach(([subcategoryName, data]) => {
          if (data.flavors.includes(flavor)) {
            score += data.intensity;
          }
        });
      });
      return { flavor, score };
    });
    
    // Sort by score and take top flavors
    return sortByProperty(flavorScores, 'score')
      .slice(0, limit)
      .map(item => item.flavor);
  }
  
  // Generate a descriptive analysis of the flavor profile
  getFlavorAnalysis(tea) {
    if (!tea || !tea.flavorProfile || !Array.isArray(tea.flavorProfile)) {
      return { 
        description: 'No flavor profile available',
        dominantFlavors: [],
        flavorCount: 0,
        flavorCategories: []
      };
    }
    
    const flavorCount = tea.flavorProfile.length;
    const dominantFlavors = this.getDominantFlavors(tea.flavorProfile);
    
    // Count flavors in each category
    const flavorCategories = [];
    Object.entries(this.flavorInfluences).forEach(([category, subcategories]) => {
      let count = 0;
      Object.values(subcategories).forEach(data => {
        count += tea.flavorProfile.filter(flavor => 
          data.flavors.includes(flavor)
        ).length;
      });
      
      if (count > 0) {
        flavorCategories.push(category);
      }
    });
    
    // Generate a natural language description
    let description;
    if (flavorCount === 0) {
      description = 'No flavor information available.';
    } else if (flavorCategories.length === 0) {
      description = `This tea has ${flavorCount} flavors in its profile.`;
    } else {
      const primaryCategory = flavorCategories[0];
      
      if (flavorCategories.length === 1) {
        description = `This tea has a predominantly ${primaryCategory} flavor profile.`;
      } else {
        const secondaryCategory = flavorCategories[1];
        description = `This tea has a ${primaryCategory} profile with ${secondaryCategory} notes.`;
      }
    }
    
    return {
      description,
      dominantFlavors,
      flavorCount,
      flavorCategories
    };
  }
}

export default FlavorCalculator;
