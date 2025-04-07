// ProcessingCalculator.js
// Handles calculations related to processing method influence on tea effects

import { normalizeString, validateObject, getTopItems, sortByProperty, categorizeByKeywords } from '../utils/helpers.js';
// Add TCM mapping imports
import * as TeaGlobalMapping from '../props/TeaGlobalMapping.js';
import { effectMapping } from '../props/EffectMapping.js';

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

    this.effectMapping = effectMapping;
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
    const processingInfluence = this.calculateProcessingScores(tea);
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
        processingScores: {},
        processing: {
          description: 'No processing data available',
          methods: [],
          methodCount: 0,
          categories: {},
          influence: {},
          details: []
        }
      };
    }

    // Calculate processing scores
    const processingScores = this.calculateProcessingScores(inference);

    return {
      processingScores,
      processing: {
        description: inference.description || 'No description available',
        methods: inference.processingMethods || [],
        methodCount: inference.methodCount || 0,
        categories: inference.methodCategories || {},
        influence: inference.processingInfluence || {},
        details: inference.methodDetails || []
      }
    };
  }
  
  // Calculate processing influence on effects
  calculateProcessingScores(tea) {
    const processingScores = {};
    const safeTea = {
        processing: tea.processing || []
    };

    // Helper function to add processing scores
    const addProcessingScore = (effect, score) => {
        processingScores[effect] = (processingScores[effect] || 0) + score;
    };

    // Process each processing method
    safeTea.processing.forEach(method => {
        switch (method) {
            case 'shade-grown':
                addProcessingScore("focusing", 3.0);
                addProcessingScore("calming", 2.0);
                break;
            case 'steamed':
                addProcessingScore("focusing", 2.5);
                addProcessingScore("calming", 1.5);
                break;
            case 'pan-fired':
                addProcessingScore("focusing", 2.0);
                addProcessingScore("grounding", 1.5);
                break;
            case 'light-roast':
                addProcessingScore("harmonizing", 2.0);
                addProcessingScore("elevating", 1.5);
                break;
            case 'heavy-roast':
                addProcessingScore("grounding", 3.0);
                addProcessingScore("comforting", 2.0);
                break;
            case 'aged':
                addProcessingScore("grounding", 3.0);
                addProcessingScore("harmonizing", 2.0);
                break;
            case 'compressed':
                addProcessingScore("grounding", 2.0);
                addProcessingScore("harmonizing", 1.5);
                break;
            case 'oxidized':
                addProcessingScore("energizing", 2.0);
                addProcessingScore("comforting", 1.5);
                break;
            case 'fermented':
                addProcessingScore("grounding", 2.5);
                addProcessingScore("restorative", 1.5);
                break;
        }
    });

    // Apply processing combinations
    this.applyProcessingCombinations(safeTea, processingScores);

    // Normalize scores
    Object.keys(processingScores).forEach(effect => {
        processingScores[effect] = Math.min(10, Math.max(0, processingScores[effect]));
    });

    return processingScores;
  }
  
  // Parse processing method to handle intensity qualifiers
  parseProcessingMethod(method) {
    if (!method || typeof method !== 'string') {
      return { baseMethod: 'unknown', intensity: null };
    }

    method = method.toLowerCase().trim();
    
    // First, check for combined method+intensity format (e.g. "heavy-roast")
    const combinedMatch = method.match(/^(light|medium|heavy|deep|full|charcoal|short|vintage|post)-(.+)$/);
    if (combinedMatch) {
      const intensity = combinedMatch[1];
      const baseMethod = combinedMatch[2];
      return { baseMethod, intensity };
    }
    
    // Check for "X processed" format, like "lightly processed"
    const processedMatch = method.match(/^(light|medium|heavy|deep|full)(?:ly)?[ -]processed$/);
    if (processedMatch) {
      return { baseMethod: 'processed', intensity: processedMatch[1] };
    }
    
    // Handle known intensity qualifiers within the method name
    if (method.includes('light')) {
      // Common processing methods that might include "light" qualifier
      if (method.includes('roast')) {
        return { baseMethod: 'roasted', intensity: 'light' };
      }
      if (method.includes('steam')) {
        return { baseMethod: 'steamed', intensity: 'light' };
      }
      if (method.includes('ferment')) {
        return { baseMethod: 'fermented', intensity: 'light' };
      }
      if (method.includes('oxidation') || method.includes('oxidized')) {
        return { baseMethod: 'oxidation', intensity: 'light' };
      }
    }
    if (method.includes('heavy') || method.includes('deep')) {
      // Common processing methods that might include "heavy/deep" qualifier
      if (method.includes('roast')) {
        return { baseMethod: 'roasted', intensity: 'heavy' };
      }
      if (method.includes('steam')) {
        return { baseMethod: 'steamed', intensity: 'deep' };
      }
      if (method.includes('ferment')) {
        return { baseMethod: 'fermented', intensity: 'heavy' };
      }
      if (method.includes('oxidation') || method.includes('oxidized')) {
        return { baseMethod: 'oxidation', intensity: 'heavy' };
      }
    }
    
    // No intensity qualifier found, return base method only
    return { baseMethod: method, intensity: null };
  }
  
  /**
   * Get the intensity modifier for a processing method
   * @param {string} baseMethod - Base processing method
   * @param {string} intensity - Intensity level
   * @returns {number} - Modifier factor
   */
  getIntensityModifier(baseMethod, intensity) {
    // Default intensity modifier is 1.0
    if (!intensity) return 1.0;
    
    // Check if we have a specific intensity mapping for this method
    if (this.processingIntensityModifiers[baseMethod] && 
        this.processingIntensityModifiers[baseMethod][intensity]) {
      return this.processingIntensityModifiers[baseMethod][intensity];
    }
    
    // Generic intensity modifiers if no specific mapping is found
    switch (intensity) {
      case 'light': return 0.7;
      case 'medium': return 1.0;
      case 'heavy': return 1.3;
      case 'deep': return 1.3;
      case 'full': return 1.5;
      case 'charcoal': return 1.8;
      case 'post': return 1.6;
      case 'short': return 0.7;
      case 'vintage': return 1.6;
      default: return 1.0;
    }
  }
  
  /**
   * Apply default processing rules when no predefined influences exist
   * @param {Array} processingMethods - Processing methods
   * @param {Object} scores - Scores object to modify
   */
  applyDefaultProcessingRules(processingMethods, scores) {
    processingMethods.forEach(method => {
      const { baseMethod, intensity } = this.parseProcessingMethod(method);
      const intensityModifier = this.getIntensityModifier(baseMethod, intensity);
      
      // Apply default rules based on method
      switch (baseMethod) {
        case 'steamed':
          scores['soothing'] = (scores['soothing'] || 0) + (3.5 * intensityModifier);  // INCREASED from 2.0
          scores['clarifying'] = (scores['clarifying'] || 0) + (2.0 * intensityModifier);  // INCREASED from 1.5
          break;
        case 'roasted':
          // Strengthened nurturing effect from roasted profiles
          const roastIntensity = intensity === 'heavy' || intensity === 'dark' ? 1.7 : 1.3;  // INCREASED from 1.5/1.0
          scores['nurturing'] = (scores['nurturing'] || 0) + (6.5 * roastIntensity * intensityModifier);  // INCREASED from 5.0
          scores['comforting'] = (scores['comforting'] || 0) + (4.0 * intensityModifier);  // INCREASED from 2.5
          break;
        case 'oxidation':
          scores['revitalizing'] = (scores['revitalizing'] || 0) + (2.0 * intensityModifier);  // INCREASED from 1.5
          scores['awakening'] = (scores['awakening'] || 0) + (2.5 * intensityModifier);  // INCREASED significantly from 1.0
          break;
        case 'fermented':
          scores['stabilizing'] = (scores['stabilizing'] || 0) + (2.5 * intensityModifier);  // Unchanged from 2.5
          scores['centering'] = (scores['centering'] || 0) + (2.8 * intensityModifier);  // Unchanged from 2.8
          break;
        case 'aged':
          scores['centering'] = (scores['centering'] || 0) + (2.5 * intensityModifier);  // Unchanged from 2.5
          scores['stabilizing'] = (scores['stabilizing'] || 0) + (2.0 * intensityModifier);  // Unchanged from 2.0
          break;
        case 'shade-grown':
          // Adjust shade-grown to be more balanced
          scores['peaceful'] = (scores['peaceful'] || 0) + 1.2;  // REDUCED from 1.5
          scores['clarifying'] = (scores['clarifying'] || 0) + 3.5;  // INCREASED from 2.0
          break;
        case 'pan-fired':
          scores['revitalizing'] = (scores['revitalizing'] || 0) + 2.0;  // INCREASED from 1.5
          scores['awakening'] = (scores['awakening'] || 0) + 2.5;  // INCREASED from 1.0
          break;
        case 'sun-dried':
          scores['elevating'] = (scores['elevating'] || 0) + 4.5;  // INCREASED from 3.0
          scores['renewing'] = (scores['renewing'] || 0) + 2.5;  // INCREASED from 2.0
          break;
        case 'compressed':
          scores['stabilizing'] = (scores['stabilizing'] || 0) + 2.0;  // Unchanged
          scores['centering'] = (scores['centering'] || 0) + 1.0;  // Unchanged
          break;
        case 'minimal-processing':
          scores['clarifying'] = (scores['clarifying'] || 0) + 2.0;  // INCREASED from 1.5
          scores['peaceful'] = (scores['peaceful'] || 0) + 0.8;  // REDUCED from 1.0
          break;
        case 'heavy-roast':
          scores['nurturing'] = (scores['nurturing'] || 0) + 6.5;  // INCREASED from 5.5
          scores['centering'] = (scores['centering'] || 0) + 3.5;  // Unchanged
          scores['comforting'] = (scores['comforting'] || 0) + 5.0;  // INCREASED from 4.0
          break;
        case 'medium-roast':
          scores['nurturing'] = (scores['nurturing'] || 0) + 5.0;  // INCREASED from 4.0
          scores['balancing'] = (scores['balancing'] || 0) + 2.7;  // REDUCED from 3.0
          break;
        case 'pile-fermented':
        case 'fermented':
          scores['centering'] = (scores['centering'] || 0) + 4.5;  // Unchanged
          scores['stabilizing'] = (scores['stabilizing'] || 0) + 4.0;  // Unchanged
          break;
        case 'withered':
          scores['balancing'] = (scores['balancing'] || 0) + 2.0;  // REDUCED from 2.2
          scores['elevating'] = (scores['elevating'] || 0) + 1.5;  // NEW addition
          break;
        case 'smoked':
        case 'pine-fired':
          scores['nurturing'] = (scores['nurturing'] || 0) + 5.5;  // INCREASED from 4.5
          scores['comforting'] = (scores['comforting'] || 0) + 4.5;  // INCREASED from 3.5
          scores['stabilizing'] = (scores['stabilizing'] || 0) + 2.5;  // Unchanged
          break;
        case 'light-oxidation':
          scores['elevating'] = (scores['elevating'] || 0) + 3.5;  // NEW addition
          scores['clarifying'] = (scores['clarifying'] || 0) + 2.0;  // NEW addition
          break;
        case 'mixed-with-rice':
        case 'genmaicha':
          scores['comforting'] = (scores['comforting'] || 0) + 6.0;  // NEW significant addition
          scores['grounding'] = (scores['grounding'] || 0) + 3.5;  // NEW addition
          break;
        case 'bug-bitten':
          scores['elevating'] = (scores['elevating'] || 0) + 3.0;  // NEW addition for Oriental Beauty
          scores['restorative'] = (scores['restorative'] || 0) + 2.5;  // NEW addition
          break;
        default:
          // No default effects for unknown methods
          break;
      }
    });
    
    // Additional processing method combinations
    this.applyProcessingCombinations(processingMethods, scores);
  }
  
  // NEW method to handle processing combinations
  applyProcessingCombinations(tea, scores) {
    const addScore = (effect, score) => {
        scores[effect] = (scores[effect] || 0) + score;
    };

    // Gyokuro (shade-grown + steamed)
    if (tea.processing.includes('shade-grown') && tea.processing.includes('steamed')) {
        addScore("focusing", 1.5);
        addScore("calming", 1.0);
    }

    // Special case for multiple processing methods
    if (tea.processing.length > 2) {
        // Reduce scores slightly to prevent overrepresentation
        Object.keys(scores).forEach(effect => {
            scores[effect] = scores[effect] * 0.9;
        });
    }
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