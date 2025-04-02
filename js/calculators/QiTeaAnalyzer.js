// Simplified QiTeaAnalyzer for the pivot
// Analyzes traditional aspects of tea based on Chinese medicine

import { yinYangProperties } from '../data/YinYang.js';
import { fiveElementAssociations } from '../data/FiveElements.js';
import { qiMovementPatterns } from '../data/QiMovement.js';
import { timeRecommendations } from '../data/TimeOfDay.js';

class QiTeaAnalyzer {
  constructor(config) {
    this.config = config;
  }
  
  // Calculate traditional effect profile for a given tea
  calculateQiEffects(tea, context = {}) {
    // 1. Calculate Yin-Yang balance
    const yinYangBalance = this.calculateYinYangBalance(tea);
    
    // 2. Determine Five Element associations
    const elementInfluences = this.calculateElementInfluences(tea);
    const primaryElement = Object.entries(elementInfluences)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    // 3. Determine Qi movement patterns
    const qiMovement = this.determineQiMovement(tea);
    
    // 4. Generate personalized recommendations
    const personalizedRecommendations = this.generateRecommendations(
      tea, yinYangBalance, primaryElement, qiMovement, context
    );
    
    return {
      yinYangBalance,
      elementInfluences,
      primaryElement,
      qiMovement,
      personalizedRecommendations
    };
  }
  
  // Calculate the Yin-Yang balance of a tea
  calculateYinYangBalance(tea) {
    // Base values depend on tea type
    let yinScore = 5;
    let yangScore = 5;
    
    // Adjust based on tea type
    switch (tea.type.toLowerCase()) {
      case 'white':
        yinScore += 3;
        yangScore -= 2;
        break;
      case 'green':
        yinScore += 2;
        yangScore -= 1;
        break;
      case 'yellow':
        yinScore += 1;
        yangScore += 0;
        break;
      case 'oolong':
        // Depends on oxidation level, but we'll use a midpoint
        yinScore += 0;
        yangScore += 1;
        break;
      case 'black':
        yinScore -= 2;
        yangScore += 3;
        break;
      case 'puerh':
        yinScore -= 3;
        yangScore += 2;
        break;
    }
    
    // Adjust for processing methods
    if (tea.processingMethods.includes('roasted') || 
        tea.processingMethods.includes('heavy-roast')) {
      yangScore += 2;
      yinScore -= 1;
    }
    
    if (tea.processingMethods.includes('sun-dried')) {
      yangScore += 1;
    }
    
    if (tea.processingMethods.includes('shade-grown')) {
      yinScore += 1;
      yangScore -= 1;
    }
    
    // Determine the balance description
    const ratio = yangScore / yinScore;
    
    if (ratio > 1.5) return "Strongly Yang";
    if (ratio > 1.2) return "Moderately Yang";
    if (ratio > 1.05) return "Slightly Yang";
    if (ratio >= 0.95) return "Balanced";
    if (ratio >= 0.8) return "Slightly Yin";
    if (ratio >= 0.6) return "Moderately Yin";
    return "Strongly Yin";
  }
  
  // Calculate Five Element influences
  calculateElementInfluences(tea) {
    const influences = {
      wood: 0,
      fire: 0,
      earth: 0,
      metal: 0,
      water: 0
    };
    
    // Flavor profiles contribute to element associations
    tea.flavorProfile.forEach(flavor => {
      // Check if this flavor maps to element associations
      const elementAssociations = fiveElementAssociations.flavors[flavor];
      if (elementAssociations) {
        Object.entries(elementAssociations).forEach(([element, strength]) => {
          influences[element] += strength;
        });
      }
    });
    
    // Processing methods affect element associations
    tea.processingMethods.forEach(method => {
      const methodAssociations = fiveElementAssociations.processing[method];
      if (methodAssociations) {
        Object.entries(methodAssociations).forEach(([element, strength]) => {
          influences[element] += strength;
        });
      }
    });
    
    // Tea type base influences
    const typeAssociations = fiveElementAssociations.teaTypes[tea.type];
    if (typeAssociations) {
      Object.entries(typeAssociations).forEach(([element, strength]) => {
        influences[element] += strength;
      });
    }
    
    return influences;
  }
  
  // Determine Qi movement pattern
  determineQiMovement(tea) {
    // Default pattern is "balanced"
    let dominantPattern = "balanced";
    let highestScore = 0;
    
    // Check each pattern to find the dominant one
    Object.entries(qiMovementPatterns).forEach(([pattern, criteria]) => {
      let score = 0;
      
      // Tea type contribution
      if (criteria.teaTypes && criteria.teaTypes[tea.type]) {
        score += criteria.teaTypes[tea.type];
      }
      
      // Flavor contribution
      if (criteria.flavors) {
        tea.flavorProfile.forEach(flavor => {
          if (criteria.flavors[flavor]) {
            score += criteria.flavors[flavor];
          }
        });
      }
      
      // Processing method contribution
      if (criteria.processing) {
        tea.processingMethods.forEach(method => {
          if (criteria.processing[method]) {
            score += criteria.processing[method];
          }
        });
      }
      
      // Check if this is the highest score so far
      if (score > highestScore) {
        highestScore = score;
        dominantPattern = pattern;
      }
    });
    
    return dominantPattern;
  }
  
  // Generate personalized recommendations
  generateRecommendations(tea, yinYangBalance, primaryElement, qiMovement, context) {
    // Time of day recommendations
    const timeOfDay = this.recommendTimeOfDay(tea, yinYangBalance, qiMovement);
    
    // Health considerations
    const healthConsiderations = this.determineHealthConsiderations(
      tea, yinYangBalance, primaryElement, qiMovement
    );
    
    // Cautions based on YinYang balance
    const cautions = this.determineCautions(yinYangBalance);
    
    // Ideal pairings
    const idealPairings = this.recommendPairings(primaryElement, yinYangBalance);
    
    return {
      timeOfDay,
      healthConsiderations,
      cautions,
      idealPairings
    };
  }
  
  // Recommend best time of day for consumption
  recommendTimeOfDay(tea, yinYangBalance, qiMovement) {
    const timeRecs = timeRecommendations;
    let bestTimes = [];
    
    // Recommendations based on Yin-Yang balance
    if (yinYangBalance.includes("Yang")) {
      bestTimes.push(...timeRecs.yinYang.yang);
    } else if (yinYangBalance.includes("Yin")) {
      bestTimes.push(...timeRecs.yinYang.yin);
    } else {
      // Balanced teas are versatile
      bestTimes.push(...timeRecs.yinYang.balanced);
    }
    
    // Recommendations based on Qi movement
    if (timeRecs.qiMovement[qiMovement]) {
      const qiTimes = timeRecs.qiMovement[qiMovement];
      // Find common times between yin-yang and qi recommendations
      bestTimes = bestTimes.filter(time => qiTimes.includes(time));
      
      // If no common times, just use the qi movement times
      if (bestTimes.length === 0) {
        bestTimes = [...qiTimes];
      }
    }
    
    // If still no recommendations, provide general times
    if (bestTimes.length === 0) {
      bestTimes = ["Morning", "Afternoon"];
    }
    
    return {
      bestTimes,
      explanation: `Based on its ${yinYangBalance} nature and ${qiMovement} qi movement`
    };
  }
  
  // Determine health considerations
  determineHealthConsiderations(tea, yinYangBalance, primaryElement, qiMovement) {
    const benefits = [];
    
    // Benefits based on Yin-Yang balance
    if (yinYangBalance.includes("Yang")) {
      benefits.push("Promotes warmth and circulation");
      benefits.push("Energizing and stimulating");
    } else if (yinYangBalance.includes("Yin")) {
      benefits.push("Cooling and calming properties");
      benefits.push("Supports hydration and bodily fluids");
    }
    
    // Benefits based on primary Element
    switch (primaryElement) {
      case "wood":
        benefits.push("Supports liver function and flexibility");
        benefits.push("Helps with decision-making and planning");
        break;
      case "fire":
        benefits.push("Supports heart function and circulation");
        benefits.push("Promotes joy and social connection");
        break;
      case "earth":
        benefits.push("Supports digestive function and nourishment");
        benefits.push("Promotes centeredness and stability");
        break;
      case "metal":
        benefits.push("Supports lung function and immune response");
        benefits.push("Promotes clarity and discernment");
        break;
      case "water":
        benefits.push("Supports kidney function and vital essence");
        benefits.push("Promotes wisdom and introspection");
        break;
    }
    
    // Benefits based on Qi movement
    switch (qiMovement) {
      case "rising":
        benefits.push("Lifts energy and mood");
        benefits.push("Helps with mental clarity and focus");
        break;
      case "descending":
        benefits.push("Grounds and settles energy");
        benefits.push("Aids in relaxation and meditation");
        break;
      case "expanding":
        benefits.push("Releases tension and stagnation");
        benefits.push("Promotes emotional expression");
        break;
      case "contracting":
        benefits.push("Consolidates energy and focuses intention");
        benefits.push("Supports discipline and concentration");
        break;
      case "balanced":
        benefits.push("Harmonizes body systems");
        benefits.push("Supports overall equilibrium");
        break;
    }
    
    return { benefits };
  }
  
  // Determine cautions based on Yin-Yang balance
  determineCautions(yinYangBalance) {
    const cautions = [];
    
    if (yinYangBalance.includes("Strongly Yang")) {
      cautions.push("May increase heat and restlessness in those with excess heat conditions");
      cautions.push("Use with care if you have high blood pressure or anxiety");
    } else if (yinYangBalance.includes("Strongly Yin")) {
      cautions.push("May increase coldness in those with deficient yang conditions");
      cautions.push("Use with care if you have poor circulation or low energy");
    }
    
    return cautions;
  }
  
  // Recommend food or activity pairings
  recommendPairings(primaryElement, yinYangBalance) {
    const pairings = [];
    
    // Pairings based on primary Element
    switch (primaryElement) {
      case "wood":
        pairings.push("Lightly sautéed green vegetables");
        pairings.push("Creative activities like writing or art");
        break;
      case "fire":
        pairings.push("Berries and red fruits");
        pairings.push("Social gatherings and conversations");
        break;
      case "earth":
        pairings.push("Whole grains and mildly sweet foods");
        pairings.push("Contemplative activities in nature");
        break;
      case "metal":
        pairings.push("White foods like rice, pears, or almonds");
        pairings.push("Organizing or decluttering activities");
        break;
      case "water":
        pairings.push("Dark foods like black beans or blueberries");
        pairings.push("Meditation and reflection");
        break;
    }
    
    // Additional pairings based on Yin-Yang balance
    if (yinYangBalance.includes("Yang")) {
      pairings.push("Balance with cooling foods like cucumber or mint");
    } else if (yinYangBalance.includes("Yin")) {
      pairings.push("Balance with warming spices like cinnamon or ginger");
    }
    
    return pairings;
  }
}

export default QiTeaAnalyzer; 