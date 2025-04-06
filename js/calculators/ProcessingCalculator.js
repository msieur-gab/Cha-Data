// ProcessingCalculator.js
// Handles calculations related to processing method influence on tea effects

import { normalizeString, validateObject, getTopItems, sortByProperty, categorizeByKeywords } from '../utils/helpers.js';

export class ProcessingCalculator {
  constructor(config, processingInfluences) {
    this.config = config;
    this.processingInfluences = processingInfluences || {};
    
    // Define processing intensity modifiers
    this.processingIntensityModifiers = {
      // Steaming intensity
      'steamed': {
          'light': 0.7,
          'standard': 1.0,
          'deep': 1.3
      },
      // Roasting intensity
      'roasted': {
          'light': 0.7,
          'medium': 1.0,
          'heavy': 1.5,
          'charcoal': 1.8
      },
      // Oxidation intensity
      'oxidation': {
          'light': 0.7,
          'medium': 1.0,
          'heavy': 1.3,
          'full': 1.5
      },
      // Fermentation intensity
      'fermented': {
          'light': 0.7,
          'medium': 1.0,
          'heavy': 1.4,
          'post-fermented': 1.6
      },
      // Aging intensity
      'aged': {
          'short': 0.7,  // < 3 years
          'medium': 1.0, // 3-7 years
          'long': 1.3,   // 7-15 years
          'vintage': 1.6 // > 15 years
      }
    };
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
    if (!Array.isArray(processingMethods) || processingMethods.length === 0) {
      return {};
    }
    
    const scores = {};
    
    // If we have pre-defined processing influences, use those
    if (this.processingInfluences && typeof this.processingInfluences === 'object') {
      // For each processing method
      processingMethods.forEach(method => {
        // Extract base method and intensity if specified
        const [baseMethod, intensity] = this.parseProcessingMethod(method);
        
        // Find the influence for this method
        const influence = this.processingInfluences[baseMethod];
        
        if (influence) {
          // Get intensity modifier if available, otherwise use 1.0
          const intensityModifier = this.getIntensityModifier(baseMethod, intensity);
          
          // Apply the influence with intensity scaling
          Object.keys(influence).forEach(effect => {
            scores[effect] = (scores[effect] || 0) + (influence[effect] * intensityModifier);
          });
        }
      });
    } else {
      // Fallback to simple rules if no predefined influences
      this.applyDefaultProcessingRules(processingMethods, scores);
    }
    
    // Ensure all scores are within valid range
    Object.keys(scores).forEach(key => {
      scores[key] = Math.min(10, Math.max(0, scores[key]));
    });
    
    return scores;
  }
  
  /**
   * Parse a processing method string to extract base method and intensity
   * @param {string} method - Processing method (e.g., "light-roast", "heavy-oxidation")
   * @returns {Array} - [baseMethod, intensity]
   */
  parseProcessingMethod(method) {
    if (!method || typeof method !== 'string') {
      return ['unknown', null];
    }
    
    const methodLower = method.toLowerCase();
    
    // Check for intensity prefixes
    const intensityPrefixes = ['light-', 'medium-', 'heavy-', 'deep-', 'full-', 'charcoal-', 'post-'];
    let intensity = null;
    let baseMethod = methodLower;
    
    for (const prefix of intensityPrefixes) {
      if (methodLower.startsWith(prefix)) {
        intensity = prefix.slice(0, -1); // Remove trailing hyphen
        baseMethod = methodLower.substring(prefix.length);
        break;
      }
    }
    
    // Special handling for specific methods
    if (baseMethod === 'roast' || baseMethod === 'roasted') {
      baseMethod = 'roasted';
    } else if (baseMethod === 'oxidized' || baseMethod === 'oxidised') {
      baseMethod = 'oxidation';
    }
    
    return [baseMethod, intensity];
  }
  
  /**
   * Get the intensity modifier for a processing method
   * @param {string} baseMethod - Base processing method
   * @param {string} intensity - Intensity level
   * @returns {number} - Modifier factor
   */
  getIntensityModifier(baseMethod, intensity) {
    if (!intensity || !this.processingIntensityModifiers[baseMethod]) {
      return 1.0; // Default modifier
    }
    
    const intensityModifiers = this.processingIntensityModifiers[baseMethod];
    return intensityModifiers[intensity] || 1.0;
  }
  
  /**
   * Apply default processing rules when no predefined influences exist
   * @param {Array} processingMethods - Processing methods
   * @param {Object} scores - Scores object to modify
   */
  applyDefaultProcessingRules(processingMethods, scores) {
    processingMethods.forEach(method => {
      const [baseMethod, intensity] = this.parseProcessingMethod(method);
      const intensityModifier = this.getIntensityModifier(baseMethod, intensity);
      
      // Apply default rules based on method
      switch (baseMethod) {
        case 'steamed':
          scores['soothing'] = (scores['soothing'] || 0) + (2.0 * intensityModifier);
          scores['clarifying'] = (scores['clarifying'] || 0) + (1.5 * intensityModifier);
          break;
        case 'roasted':
          scores['nurturing'] = (scores['nurturing'] || 0) + (2.0 * intensityModifier);
          scores['comforting'] = (scores['comforting'] || 0) + (1.5 * intensityModifier);
          break;
        case 'oxidation':
          scores['revitalizing'] = (scores['revitalizing'] || 0) + (1.5 * intensityModifier);
          scores['awakening'] = (scores['awakening'] || 0) + (1.0 * intensityModifier);
          break;
        case 'fermented':
          scores['stabilizing'] = (scores['stabilizing'] || 0) + (2.0 * intensityModifier);
          scores['centering'] = (scores['centering'] || 0) + (1.5 * intensityModifier);
          break;
        case 'aged':
          scores['centering'] = (scores['centering'] || 0) + (1.5 * intensityModifier);
          scores['stabilizing'] = (scores['stabilizing'] || 0) + (1.0 * intensityModifier);
          break;
        case 'shade-grown':
          scores['peaceful'] = (scores['peaceful'] || 0) + 2.0;
          scores['clarifying'] = (scores['clarifying'] || 0) + 1.5;
          break;
        case 'pan-fired':
          scores['revitalizing'] = (scores['revitalizing'] || 0) + 1.5;
          scores['awakening'] = (scores['awakening'] || 0) + 1.0;
          break;
        case 'sun-dried':
          scores['elevating'] = (scores['elevating'] || 0) + 1.5;
          scores['renewing'] = (scores['renewing'] || 0) + 1.0;
          break;
        case 'compressed':
          scores['stabilizing'] = (scores['stabilizing'] || 0) + 2.0;
          scores['centering'] = (scores['centering'] || 0) + 1.0;
          break;
        case 'minimal-processing':
          scores['clarifying'] = (scores['clarifying'] || 0) + 1.5;
          scores['peaceful'] = (scores['peaceful'] || 0) + 1.0;
          break;
        default:
          // No default effects for unknown methods
          break;
      }
    });
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