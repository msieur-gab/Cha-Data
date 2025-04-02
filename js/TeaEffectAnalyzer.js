// TeaEffectAnalyzer.js
// Main class for analyzing tea effects, integrating all calculators

import { EffectSystemConfig } from './config/EffectSystemConfig.js';
import { CompoundCalculator } from './calculators/CompoundCalculator.js';
import { FlavorCalculator } from './calculators/FlavorCalculator.js';
import { ProcessingCalculator } from './calculators/ProcessingCalculator.js';
import { GeographyCalculator } from './calculators/GeographyCalculator.js';
import { InteractionCalculator } from './calculators/InteractionCalculator.js';
import { normalizeScores, enhanceDominantEffect } from './utils/normalization.js';

export class TeaEffectAnalyzer {
  constructor(config = new EffectSystemConfig()) {
    this.config = config;
    this.primaryEffects = [];
    this.flavorInfluences = {};
    this.processingInfluences = {};
    this.effectCombinations = {};
    this.geographicalInfluences = {};
    
    // Initialize the calculators (will be fully set up after loadData)
    this.compoundCalculator = new CompoundCalculator(this.config, this.primaryEffects);
    this.flavorCalculator = new FlavorCalculator(this.config, this.flavorInfluences);
    this.processingCalculator = new ProcessingCalculator(this.config, this.processingInfluences);
    this.geographicalCalculator = new GeographyCalculator(this.config, this.geographicalInfluences);
    this.interactionCalculator = new InteractionCalculator(this.config, this.effectCombinations);
  }

  // Load reference data into the analyzer
  loadData(primaryEffects, flavorInfluences, processingInfluences, effectCombinations, geographicalInfluences) {
    // Convert primaryEffects object to array with id property if needed
    if (primaryEffects && typeof primaryEffects === 'object' && !Array.isArray(primaryEffects)) {
      this.primaryEffects = Object.entries(primaryEffects).map(([id, data]) => ({
        id,
        ...data
      }));
    } else {
      this.primaryEffects = primaryEffects || [];
    }
    
    this.flavorInfluences = flavorInfluences || {};
    this.processingInfluences = processingInfluences || {};
    this.effectCombinations = effectCombinations || {};
    this.geographicalInfluences = geographicalInfluences || {};
    
    // Set up the calculators with the data
    this.compoundCalculator = new CompoundCalculator(this.config, this.primaryEffects);
    this.flavorCalculator = new FlavorCalculator(this.config, this.flavorInfluences);
    this.processingCalculator = new ProcessingCalculator(this.config, this.processingInfluences);
    this.geographicalCalculator = new GeographyCalculator(this.config, this.geographicalInfluences);
    this.interactionCalculator = new InteractionCalculator(this.config, this.effectCombinations);
  }

  // Calculate tea effects with component weighting approach
  calculateTeaEffects(tea) {
    if (!tea || typeof tea !== 'object') {
      console.error('Invalid tea object:', tea);
      return null;
    }

    // Handle missing properties safely
    const safeTea = {
      type: tea.type || 'unknown',
      caffeineLevel: tea.caffeineLevel !== undefined ? tea.caffeineLevel : 3,
      lTheanineLevel: tea.lTheanineLevel !== undefined ? tea.lTheanineLevel : 5,
      flavorProfile: Array.isArray(tea.flavorProfile) ? tea.flavorProfile : [],
      processingMethods: Array.isArray(tea.processingMethods) ? tea.processingMethods : [],
      geography: tea.geography || null
    };

    // Check which data sources are available
    const availableDataSources = {
      compounds: true,  // Always available in some form
      flavors: safeTea.flavorProfile.length > 0,
      processing: safeTea.processingMethods.length > 0,
      geography: safeTea.geography !== null
    };
    
    // Calculate raw scores from each component
    const compoundScores = this.compoundCalculator.calculateCompoundEffects(safeTea);
    const flavorScores = this.flavorCalculator.calculateFlavorInfluence(safeTea.flavorProfile);
    const processingScores = this.processingCalculator.calculateProcessingInfluence(safeTea.processingMethods);
    const geoScores = this.geographicalCalculator.calculateGeographicalScores(safeTea);
    
    // Get component weights
    const weights = {
      compounds: this.config.get('componentWeights.compounds'),
      flavors: this.config.get('componentWeights.flavors'),
      processing: this.config.get('componentWeights.processing'),
      geography: this.config.get('componentWeights.geography')
    };
    
    // Adjust weights if data sources are missing
    let totalWeight = 0;
    Object.entries(availableDataSources).forEach(([source, available]) => {
      if (!available) {
        weights[source] = 0;
      }
      totalWeight += weights[source];
    });
    
    // Normalize weights to ensure they sum to 1.0
    if (totalWeight > 0) {
      Object.keys(weights).forEach(source => {
        weights[source] = weights[source] / totalWeight;
      });
    }
    
    // Apply weighted calculation to combine component scores
    const combinedScores = {};
    
    // Get all effect IDs from all calculators
    const allEffectIds = new Set([
      ...Object.keys(compoundScores),
      ...Object.keys(flavorScores),
      ...Object.keys(processingScores),
      ...Object.keys(geoScores)
    ]);
    
    // Calculate combined score for each effect
    allEffectIds.forEach(effect => {
      combinedScores[effect] = (
        (compoundScores[effect] || 0) * weights.compounds +
        (flavorScores[effect] || 0) * weights.flavors +
        (processingScores[effect] || 0) * weights.processing +
        (geoScores[effect] || 0) * weights.geography
      );
    });
    
    // Apply interactions
    const interactionScores = this.interactionCalculator.applyEffectInteractions(combinedScores);
    
    // Normalize final scores
    const normalizedScores = normalizeScores(interactionScores);
    
    // Enhance dominant effect
    const finalScores = enhanceDominantEffect(normalizedScores);

    return finalScores;
  }
  
  // Create a comprehensive tea effect profile
  createTeaEffectProfile(tea) {
    if (!tea || typeof tea !== 'object') {
      return {
        dominantEffect: { id: 'balanced', name: 'Balanced', level: 5 },
        supportingEffects: [],
        additionalEffects: [],
        allEffects: [],
        rawScores: {}
      };
    }
    
    const effectScores = this.calculateTeaEffects(tea);
    
    // Sort effects by score
    const sortedEffects = Object.entries(effectScores)
      .map(([id, score]) => {
        const effect = this.primaryEffects.find(e => e.id === id);
        if (!effect) {
          // If effect not found, provide a default with the id as name
          return { id, name: id.charAt(0).toUpperCase() + id.slice(1), level: score };
        }
        return { ...effect, level: score };
      })
      .filter(effect => effect && effect.id) // Make sure we have valid effects
      .sort((a, b) => b.level - a.level);
    
    // Identify dominant and supporting effects
    const dominantEffect = sortedEffects[0] || { id: 'balanced', name: 'Balanced', level: 5 };
    const supportingEffects = sortedEffects.slice(1, 3)
      .filter(effect => effect && effect.level >= this.config.get('supportingEffectThreshold'));
    
    // Additional effects above a certain threshold
    const additionalEffects = sortedEffects.slice(3)
      .filter(effect => effect && effect.level >= 4.0);
    
    // Identify significant interactions
    const interactions = this.interactionCalculator.identifySignificantInteractions(effectScores);
    
    return {
      dominantEffect,
      supportingEffects,
      additionalEffects,
      allEffects: sortedEffects,
      rawScores: effectScores,
      interactions
    };
  }
  
  // Get a complete analysis breakdown that includes all calculator results
  getCompleteAnalysis(tea) {
    if (!tea || typeof tea !== 'object') {
      return { error: 'Invalid tea object' };
    }
    
    // Get the basic effect profile
    const effectProfile = this.createTeaEffectProfile(tea);
    
    // Add compound analysis
    const compoundAnalysis = this.compoundCalculator.getCompoundAnalysis(tea);
    
    // Add flavor analysis
    const flavorAnalysis = this.flavorCalculator.getFlavorAnalysis(tea);
    
    // Add processing analysis
    const processingAnalysis = this.processingCalculator.getProcessingAnalysis(tea);
    
    // Add geographical analysis
    const geographicalAnalysis = this.geographicalCalculator.getGeographicalAnalysis(tea);
    
    return {
      effects: effectProfile,
      compound: compoundAnalysis,
      flavor: flavorAnalysis,
      processing: processingAnalysis,
      geography: geographicalAnalysis
    };
  }
}

export default TeaEffectAnalyzer; 