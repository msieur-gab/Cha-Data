// FlavorCalculator.js
// Handles calculations related to flavor influence on tea effects

export class FlavorCalculator {
  constructor(config, flavorInfluences) {
    this.config = config;
    this.flavorInfluences = flavorInfluences || {};
  }
  
  // Main calculate method following our pattern
  calculate(tea) {
    console.log('=== FlavorCalculator.calculate ===');
    console.log('Input tea:', {
      hasFlavorProfile: !!tea?.flavorProfile,
      flavorProfile: tea?.flavorProfile || []
    });
    
    const inference = this.infer(tea);
    console.log('Inference:', {
      hasDescription: !!inference?.description,
      dominantFlavors: inference?.dominantFlavors || [],
      flavorCount: inference?.flavorCount || 0,
      categoryCount: inference?.flavorCategories?.length || 0,
      contributionCount: inference?.contributions?.length || 0
    });
    
    const formattedInference = this.formatInference(inference);
    const serializedData = this.serialize(inference);
    
    console.log('Serialized data:', {
      hasProfile: !!serializedData?.flavor?.profile,
      hasCategories: !!serializedData?.flavor?.categories?.length,
      hasContributions: !!serializedData?.flavor?.contributions?.length
    });
    
    return {
      inference: formattedInference,
      data: serializedData
    };
  }

  // Infer flavor analysis
  infer(tea) {
    console.log('=== FlavorCalculator.infer ===');
    console.log('Input tea:', {
      hasFlavorProfile: !!tea?.flavorProfile,
      flavorProfile: tea?.flavorProfile || []
    });
    
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
    console.log('Flavor Analysis:', {
      description: flavorAnalysis.description,
      dominantFlavors: flavorAnalysis.dominantFlavors,
      categories: flavorAnalysis.flavorCategories
    });
    
    const flavorInfluence = this.calculateFlavorInfluence(tea.flavorProfile);
    console.log('Flavor Influence:', Object.keys(flavorInfluence));
    
    // Get all unique effects from flavor influences
    const allEffects = new Set();
    Object.values(this.flavorInfluences).forEach(category => {
      Object.values(category).forEach(subcategory => {
        subcategory.effects.forEach(effect => allEffects.add(effect));
      });
    });
    console.log('Found Effects:', Array.from(allEffects));
    
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
    
    console.log('Contributions:', contributions.map(c => ({
      effect: c.effect,
      count: c.contributions.length
    })));
    
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
    console.log('Formatting inference:', inference);
    
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
    
    console.log('Formatted markdown:', md);
    return md;
  }

  // Serialize inference for JSON export
  serialize(inference) {
    console.log('=== FlavorCalculator.serialize ===');
    console.log('Input inference:', {
      hasDescription: !!inference?.description,
      hasContributions: !!inference?.contributions?.length,
      contributionCount: inference?.contributions?.length || 0
    });
    
    if (!inference) {
      return {
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

    const result = {
      flavor: {
        profile,
        categories,
        contributions,
        _sectionRef: "flavor"
      }
    };
    
    console.log('Output JSON:', {
      hasProfile: !!result.flavor.profile,
      profileKeys: Object.keys(result.flavor.profile),
      hasCategories: !!result.flavor.categories.length,
      categoryCount: result.flavor.categories.length,
      hasContributions: !!result.flavor.contributions.length,
      contributionCount: result.flavor.contributions.length
    });
    
    return result;
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
    return contributions.sort((a, b) => b.contribution - a.contribution);
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
    return flavorScores
      .sort((a, b) => b.score - a.score)
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
        flavorCategories.push({ category, count });
      }
    });
    
    // Sort categories by count (descending)
    flavorCategories.sort((a, b) => b.count - a.count);
    
    // Generate a natural language description
    let description;
    if (flavorCount === 0) {
      description = 'No flavor information available.';
    } else if (flavorCategories.length === 0) {
      description = `This tea has ${flavorCount} flavors in its profile.`;
    } else {
      const primaryCategory = flavorCategories[0].category;
      
      if (flavorCategories.length === 1) {
        description = `This tea has a predominantly ${primaryCategory} flavor profile.`;
      } else {
        const secondaryCategory = flavorCategories[1].category;
        description = `This tea has a ${primaryCategory} profile with ${secondaryCategory} notes.`;
      }
    }
    
    return {
      description,
      dominantFlavors,
      flavorCount,
      flavorCategories: flavorCategories.map(c => c.category)
    };
  }
}

export default FlavorCalculator; 