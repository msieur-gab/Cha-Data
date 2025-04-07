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
  
  // Calculate the influence of flavors on tea effects
  calculateFlavorInfluence(flavorProfile) {
    if (!Array.isArray(flavorProfile) || !this.flavorInfluences) {
      return {};
    }
    
    // Initialize scores with zeros
    const scores = {};
    
    // Process each flavor in the profile
    flavorProfile.forEach(flavor => {
      // Search through all categories and subcategories
      Object.entries(this.flavorInfluences).forEach(([category, subcategories]) => {
        Object.entries(subcategories).forEach(([subcategoryName, data]) => {
          if (data.flavors.includes(flavor)) {
            // Add each effect from this subcategory with its intensity
            data.effects.forEach(effect => {
              if (!scores[effect]) {
                scores[effect] = 0;
              }
              scores[effect] += data.intensity;
            });
          }
        });
      });
    });
    
    // Apply special boosts for specific flavor combinations
    
    // For umami/marine flavors, boost focusing effect
    if (flavorProfile.some(f => ["umami", "marine"].includes(f))) {
      scores["focusing"] = (scores["focusing"] || 0) + 4.0;
    }
    
    // Boost elevating effect for floral/fruity flavors
    if (flavorProfile.some(f => ["floral", "fruity", "orchid", "honey", "apricot", "peach"].includes(f))) {
      scores["elevating"] = (scores["elevating"] || 0) + 5.5;
    }
    
    // Further boost for multiple floral notes
    const floralCount = flavorProfile.filter(f => 
      ["floral", "orchid", "jasmine", "rose"].includes(f)).length;
    if (floralCount >= 2) {
      scores["elevating"] = (scores["elevating"] || 0) + 3.0;
    }
    
    // Add comforting boost for woody/earthy flavors
    if (flavorProfile.some(f => ["woody", "nutty", "roasted", "earthy"].includes(f))) {
      scores["comforting"] = (scores["comforting"] || 0) + 4.5;
    }
    
    // Add missing comforting effect for toasty/nutty flavors
    if (flavorProfile.some(f => ["toasted", "nutty", "cereal", "baked", "grain"].includes(f))) {
      scores["comforting"] = (scores["comforting"] || 0) + 6.5;
    }
    
    // Create restorative effect for unique profiles
    if (flavorProfile.includes("fruity") && 
        flavorProfile.some(f => ["berries", "berry", "antioxidant"].includes(f))) {
      scores["restorative"] = (scores["restorative"] || 0) + 6.0;
    }
    
    // Boost energizing effect for brisk and astringent profiles
    if (flavorProfile.some(f => ["brisk", "astringent", "bright"].includes(f))) {
      scores["energizing"] = (scores["energizing"] || 0) + 5.0;
    }
    
    // Map smokiness to comforting and grounding
    if (flavorProfile.some(f => ["smoky", "tarry", "pine", "charcoal"].includes(f))) {
      scores["comforting"] = (scores["comforting"] || 0) + 5.5;
      scores["grounding"] = (scores["grounding"] || 0) + 3.5;
    }
    
    // Map minerality to harmonizing and grounding
    if (flavorProfile.some(f => ["mineral", "minerally", "rocks", "wet-stone"].includes(f))) {
      scores["harmonizing"] = (scores["harmonizing"] || 0) + 3.2;
      scores["grounding"] = (scores["grounding"] || 0) + 2.5;
    }
    
    // Map malty notes to energizing but also grounding
    if (flavorProfile.some(f => ["malt", "malty", "bread", "biscuit"].includes(f))) {
      scores["energizing"] = (scores["energizing"] || 0) + 3.5;
      scores["grounding"] = (scores["grounding"] || 0) + 2.5;
    }
    
    return scores;
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

  calculateFlavorScores(tea) {
    const flavorScores = {};
    const safeTea = {
        flavor: tea.flavor || [],
        processing: tea.processing || []
    };

    // Helper function to add flavor scores
    const addFlavorScore = (effect, score) => {
        flavorScores[effect] = (flavorScores[effect] || 0) + score;
    };

    // Process each flavor
    safeTea.flavor.forEach(flavor => {
        switch (flavor) {
            case 'umami':
                addFlavorScore("focusing", 2.5);
                addFlavorScore("harmonizing", 1.5);
                break;
            case 'sweet':
                addFlavorScore("comforting", 2.0);
                addFlavorScore("harmonizing", 1.5);
                break;
            case 'bitter':
                addFlavorScore("focusing", 2.0);
                addFlavorScore("energizing", 1.5);
                break;
            case 'astringent':
                addFlavorScore("focusing", 2.0);
                addFlavorScore("grounding", 1.5);
                break;
            case 'floral':
                addFlavorScore("elevating", 2.5);
                addFlavorScore("harmonizing", 1.5);
                break;
            case 'fruity':
                addFlavorScore("elevating", 2.0);
                addFlavorScore("comforting", 1.5);
                break;
            case 'woody':
                addFlavorScore("grounding", 2.5);
                addFlavorScore("comforting", 1.5);
                break;
            case 'earthy':
                addFlavorScore("grounding", 2.5);
                addFlavorScore("harmonizing", 1.5);
                break;
            case 'spicy':
                addFlavorScore("energizing", 2.0);
                addFlavorScore("elevating", 1.5);
                break;
            case 'roasty':
                addFlavorScore("grounding", 2.0);
                addFlavorScore("comforting", 1.5);
                break;
            case 'smoky':
                addFlavorScore("grounding", 2.5);
                addFlavorScore("focusing", 1.5);
                break;
            case 'marine':
                addFlavorScore("focusing", 2.0);
                addFlavorScore("calming", 1.5);
                break;
            case 'mineral':
                addFlavorScore("grounding", 2.0);
                addFlavorScore("focusing", 1.5);
                break;
        }
    });

    // Apply processing-specific flavor adjustments
    if (safeTea.processing.includes('shade-grown')) {
        addFlavorScore("focusing", 1.5);
        addFlavorScore("calming", 1.0);
    }

    if (safeTea.processing.includes('heavy-roast')) {
        addFlavorScore("grounding", 2.0);
        addFlavorScore("comforting", 1.5);
    }

    // Normalize scores
    Object.keys(flavorScores).forEach(effect => {
        flavorScores[effect] = Math.min(10, Math.max(0, flavorScores[effect]));
    });

    return flavorScores;
  }
}

export default FlavorCalculator;
