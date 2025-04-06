// ProcessingCalculator.js
// Handles calculations related to processing method influence on tea effects

import { normalizeString, validateObject, getTopItems, sortByProperty, categorizeByKeywords } from '../utils/helpers.js';

export class ProcessingCalculator {
  constructor(config, processingInfluences) {
    this.config = config;
    this.processingInfluences = processingInfluences || {};
  }
  
  // Main calculate method following standardized calculator pattern
  calculate(tea) {
    const inference = this.infer(tea);
    return {
      inference: this.formatInference(inference),
      data: this.serialize(inference)
    };
  }
  
  // Infer processing method analysis
  infer(tea) {
    if (!tea || !tea.processingMethods || !Array.isArray(tea.processingMethods) || tea.processingMethods.length === 0) {
      return {
        description: 'No processing information available',
        processingMethods: [],
        methodCount: 0,
        methodCategories: {},
        processingInfluence: {},
        methodDetails: []
      };
    }
    
    const processingMethods = tea.processingMethods;
    const processingAnalysis = this.getProcessingAnalysis(tea);
    const processingInfluence = this.calculateProcessingInfluence(processingMethods);
    const methodDetails = this.getProcessingDetails(processingMethods);
    
    return {
      description: processingAnalysis.description,
      processingMethods,
      methodCount: processingAnalysis.methodCount,
      methodCategories: processingAnalysis.methodCategories,
      processingInfluence,
      methodDetails
    };
  }
  
  // Format inference as markdown
  formatInference(inference) {
    if (!inference) {
      return '## Processing Analysis\n\nNo processing data available.';
    }

    let md = '## Processing Analysis\n\n';
    
    // Add description
    md += `${inference.description}\n\n`;
    
    // Add processing methods
    if (inference.processingMethods && inference.processingMethods.length > 0) {
      md += '### Processing Methods\n\n';
      inference.processingMethods.forEach(method => {
        md += `- **${method}**\n`;
      });
      md += '\n';
    }
    
    // Add method categories
    if (inference.methodCategories && Object.keys(inference.methodCategories).length > 0) {
      md += '### Method Categories\n\n';
      Object.entries(inference.methodCategories).forEach(([category, methods]) => {
        md += `- **${category}**: ${methods.join(', ')}\n`;
      });
      md += '\n';
    }
    
    // Add processing influence on effects
    if (inference.processingInfluence && Object.keys(inference.processingInfluence).length > 0) {
      md += '### Processing Influence on Effects\n\n';
      Object.entries(inference.processingInfluence)
        .sort(([, a], [, b]) => b - a)
        .forEach(([effect, score]) => {
          const barLength = Math.round(score);
          const bar = '█'.repeat(barLength) + '░'.repeat(10 - barLength);
          
          md += `- **${effect}**: ${score.toFixed(1)}/10\n`;
          md += `  [${bar}]\n`;
        });
      md += '\n';
    }
    
    // Add method details
    if (inference.methodDetails && inference.methodDetails.length > 0) {
      md += '### Method Details\n\n';
      inference.methodDetails.forEach(detail => {
        md += `#### ${detail.method}\n`;
        md += `Category: ${detail.category}\n`;
        md += `Intensity: ${detail.intensity}\n`;
        
        if (detail.description) {
          md += `\n${detail.description}\n`;
        }
        
        if (detail.effects && Object.keys(detail.effects).length > 0) {
          md += '\nEffects:\n';
          Object.entries(detail.effects)
            .sort(([, a], [, b]) => b - a)
            .forEach(([effect, score]) => {
              md += `- ${effect}: ${score}\n`;
            });
        }
        
        md += '\n';
      });
    }
    
    return md;
  }

  // Serialize inference for JSON export
  serialize(inference) {
    if (!inference) {
      return {
        processing: {
          profile: {
            description: 'No processing data available',
            methods: [],
            methodCount: 0,
            influence: {}
          },
          categories: {},
          methodDetails: [],
          _sectionRef: "processing"
        }
      };
    }

    // Create the profile section
    const profile = {
      description: inference.description || 'No description available',
      methods: inference.processingMethods || [],
      methodCount: inference.methodCount || 0,
      influence: inference.processingInfluence || {}
    };

    // Create the method details section
    const methodDetails = (inference.methodDetails || []).map(detail => ({
      method: detail.method || 'Unknown Method',
      category: detail.category || 'general',
      intensity: detail.intensity || 1.0,
      description: detail.description || '',
      effects: detail.effects || {}
    }));

    return {
      processing: {
        profile,
        categories: inference.methodCategories || {},
        methodDetails,
        _sectionRef: "processing"
      }
    };
  }
  
  // Calculate the influence of processing methods on tea effects
  calculateProcessingInfluence(processingMethods) {
    if (!Array.isArray(processingMethods) || !this.processingInfluences) {
      return {};
    }
    
    // Initialize scores with zeros
    const scores = {};
    
    // Track effect occurrences for diminishing returns
    const effectOccurrences = {};
    
    // Track category occurrences for category-based diminishing returns
    const categoryOccurrences = {};
    
    // Process each method in the processing methods
    processingMethods.forEach(method => {
      const normalizedMethod = normalizeString(method);
      
      // Find exact or partial match
      let matchedInfluence = this.processingInfluences[normalizedMethod];
      let matchedMethod = normalizedMethod;
      
      if (!matchedInfluence) {
        // Try to find partial match
        for (const [mappedMethod, influence] of Object.entries(this.processingInfluences)) {
          if (normalizedMethod.includes(mappedMethod) || mappedMethod.includes(normalizedMethod)) {
            matchedInfluence = influence;
            matchedMethod = mappedMethod;
            break;
          }
        }
      }
      
      // Apply effects if influence found
      if (matchedInfluence && matchedInfluence.effects) {
        // Track category occurrences for diminishing returns
        const category = matchedInfluence.category || 'general';
        categoryOccurrences[category] = (categoryOccurrences[category] || 0) + 1;
        
        // Calculate category diminishing factor
        const categoryFactor = 1 / Math.sqrt(categoryOccurrences[category]);
        
        // Apply the intensity factor from the influence
        const intensityFactor = matchedInfluence.intensity || 1.0;
        
        // Process each effect in the influence
        Object.entries(matchedInfluence.effects).forEach(([effect, strength]) => {
          // Initialize effect score if needed
          if (!scores[effect]) {
            scores[effect] = 0;
          }
          
          // Track effect occurrences for diminishing returns
          effectOccurrences[effect] = (effectOccurrences[effect] || 0) + 1;
          
          // Apply diminishing returns for repeated effects
          const effectFactor = 1 / Math.sqrt(effectOccurrences[effect]);
          
          // Calculate final strength with all factors
          const finalStrength = strength * intensityFactor * categoryFactor * effectFactor;
          
          // Add to the effect score
          scores[effect] += finalStrength;
        });
      }
    });
    
    // Cap scores at 10
    Object.keys(scores).forEach(key => {
      scores[key] = Math.min(10, Math.max(0, scores[key]));
    });
    
    return scores;
  }
  
  // Calculate the contribution of individual processing methods to a specific effect
  calculateProcessingContributions(tea, effectId) {
    tea = validateObject(tea);
    if (!tea.processingMethods || !Array.isArray(tea.processingMethods) || !effectId) {
      return [];
    }
    
    const contributions = [];
    
    // Process each method
    tea.processingMethods.forEach(method => {
      const normalizedMethod = normalizeString(method);
      
      // Find exact or partial match
      let matchedInfluence = this.processingInfluences[normalizedMethod];
      let matchedMethod = normalizedMethod;
      
      if (!matchedInfluence) {
        // Try to find partial match
        for (const [mappedMethod, influence] of Object.entries(this.processingInfluences)) {
          if (normalizedMethod.includes(mappedMethod) || mappedMethod.includes(normalizedMethod)) {
            matchedInfluence = influence;
            matchedMethod = mappedMethod;
            break;
          }
        }
      }
      
      if (matchedInfluence && matchedInfluence.effects && matchedInfluence.effects[effectId]) {
        // Calculate base contribution
        const baseStrength = matchedInfluence.effects[effectId];
        const intensityFactor = matchedInfluence.intensity || 1.0;
        const contribution = baseStrength * intensityFactor;
        
        // Add to contributions array
        contributions.push({
          method,
          matchedMethod,
          category: matchedInfluence.category || 'general',
          intensity: matchedInfluence.intensity || 1.0,
          baseStrength,
          contribution,
          description: matchedInfluence.description || ''
        });
      }
    });
    
    // Sort by contribution strength (descending)
    return sortByProperty(contributions, 'contribution');
  }
  
  // Categorize processing methods by type
  categorizeProcessingMethods(processingMethods) {
    if (!Array.isArray(processingMethods) || processingMethods.length === 0) {
      return {};
    }
    
    // Define method categories
    const categories = {
      oxidation: ['light-oxidation', 'medium-oxidation', 'heavy-oxidation', 'full-oxidation', 'oxidised', 'oxidized', 'partial-oxidation'],
      firing: ['pan-fired', 'charcoal-fired', 'fire-roasted'],
      roasting: ['light-roast', 'medium-roast', 'heavy-roast', 'dark-roast', 'roasted', 'minimal-roast', 'charcoal-roasted'],
      steaming: ['steamed', 'basket-steamed', 'machine-steamed'],
      withering: ['withered', 'extended-withering', 'sun-withered', 'frost-withered'],
      drying: ['sun-dried', 'shade-dried', 'machine-dried', 'basket-dried'],
      rolling: ['rolled', 'hand-rolled', 'machine-rolled', 'tight-rolled'],
      fermentation: ['fermented', 'post-fermented', 'wet-piled', 'post-fermentation'],
      scenting: ['scented', 'jasmine-scented', 'rose-scented', 'osmanthus-scented'],
      aging: ['aged', 'long-aged', 'naturally-aged', 'wet-stored', 'dry-stored'],
      special: ['shade-grown', 'bug-bitten', 'gaba-processed', 'compressed', 'kill-green', 'minimal-processing']
    };
    
    // Use the categorizeByKeywords helper function
    return categorizeByKeywords(processingMethods, categories);
  }
  
  // Generate a descriptive analysis of the processing methods
  getProcessingAnalysis(tea) {
    tea = validateObject(tea);
    if (!tea.processingMethods || !Array.isArray(tea.processingMethods)) {
      return { 
        description: 'No processing information available',
        primaryMethods: [],
        methodCount: 0,
        methodCategories: {}
      };
    }
    
    const methodCount = tea.processingMethods.length;
    const primaryMethods = getTopItems(tea.processingMethods, 3); // Assume first methods are primary
    const methodCategories = this.categorizeProcessingMethods(tea.processingMethods);
    
    // Determine the primary processing category
    const primaryCategoryEntry = Object.entries(methodCategories)
      .sort((a, b) => b[1].length - a[1].length)[0];
    
    const primaryCategory = primaryCategoryEntry ? primaryCategoryEntry[0] : null;
    
    // Generate a natural language description
    let description;
    if (methodCount === 0) {
      description = 'No processing information available.';
    } else if (!primaryCategory) {
      description = `This tea uses ${methodCount} processing methods.`;
    } else {
      const methodsInPrimaryCategory = methodCategories[primaryCategory].length;
      
      if (Object.keys(methodCategories).length === 1) {
        description = `This tea primarily uses ${primaryCategory} processing techniques (${methodsInPrimaryCategory} methods).`;
      } else {
        const categories = Object.keys(methodCategories);
        const secondaryCategory = categories.filter(c => c !== primaryCategory)[0] || null;
        
        if (secondaryCategory) {
          description = `This tea primarily uses ${primaryCategory} processing with secondary ${secondaryCategory} techniques.`;
        } else {
          description = `This tea primarily uses ${primaryCategory} processing techniques.`;
        }
      }
    }
    
    return {
      description,
      primaryMethods,
      methodCount,
      methodCategories
    };
  }
  
  // Get detailed processing information
  getProcessingDetails(processingMethods) {
    if (!Array.isArray(processingMethods)) {
      return [];
    }
    
    const details = [];
    
    processingMethods.forEach(method => {
      const normalizedMethod = normalizeString(method);
      
      let matchedInfluence = this.processingInfluences[normalizedMethod];
      let matchedMethod = normalizedMethod;
      
      if (!matchedInfluence) {
        // Try to find partial match
        for (const [mappedMethod, influence] of Object.entries(this.processingInfluences)) {
          if (normalizedMethod.includes(mappedMethod) || mappedMethod.includes(normalizedMethod)) {
            matchedInfluence = influence;
            matchedMethod = mappedMethod;
            break;
          }
        }
      }
      
      if (matchedInfluence) {
        details.push({
          method: method,
          matchedMethod: matchedMethod,
          category: matchedInfluence.category || 'general',
          intensity: matchedInfluence.intensity || 1.0,
          description: matchedInfluence.description || '',
          effects: { ...matchedInfluence.effects }
        });
      }
    });
    
    return details;
  }
}

export default ProcessingCalculator;