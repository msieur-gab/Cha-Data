// FlavorCalculator.js
// Handles calculations related to flavor influence on tea effects

export class FlavorCalculator {
  constructor(config, flavorInfluences) {
    this.config = config;
    this.flavorInfluences = flavorInfluences || {};
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
      // Look up the flavor influences
      const influences = this.flavorInfluences[flavor];
      
      if (influences) {
        // Add each influence to the corresponding effect score
        Object.entries(influences).forEach(([effectId, strength]) => {
          if (!scores[effectId]) {
            scores[effectId] = 0;
          }
          scores[effectId] += strength;
        });
      }
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
      // Look up the flavor influences
      const influences = this.flavorInfluences[flavor];
      
      if (influences && influences[effectId]) {
        // Add this flavor's contribution to the result
        contributions.push({
          flavor,
          contribution: influences[effectId]
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
    
    // For now we assume the first few flavors are dominant
    // This could be refined with actual flavor strength data
    return flavorProfile.slice(0, limit);
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
    
    // Simple categorization of flavors (could be expanded)
    const categories = {
      floral: ['floral', 'orchid', 'rose', 'jasmine', 'lily', 'chrysanthemum'],
      fruity: ['fruity', 'peach', 'apple', 'citrus', 'berry', 'plum', 'apricot', 'lychee'],
      vegetal: ['vegetal', 'grass', 'seaweed', 'marine', 'spinach', 'artichoke'],
      roasted: ['roasted', 'toasted', 'charcoal', 'coffee', 'cocoa', 'chocolate'],
      spicy: ['spicy', 'cinnamon', 'ginger', 'clove', 'pepper'],
      nutty: ['nutty', 'almond', 'walnut', 'hazelnut'],
      sweet: ['sweet', 'honey', 'caramel', 'vanilla', 'molasses'],
      mineral: ['mineral', 'slate', 'stone', 'wet rock'],
      earthy: ['earth', 'soil', 'forest floor', 'mushroom', 'wood', 'bark']
    };
    
    // Count flavors in each category
    const flavorCategories = [];
    Object.entries(categories).forEach(([category, keywords]) => {
      const count = tea.flavorProfile.filter(flavor => 
        keywords.some(keyword => flavor.toLowerCase().includes(keyword))
      ).length;
      
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