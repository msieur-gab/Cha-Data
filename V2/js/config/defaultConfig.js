// defaultConfig.js
// Default configuration values for the tea effect system

export const defaultConfig = {
  // Analysis settings
  normalizeScores: true,
  dominantEffectThreshold: 7.0,
  supportingEffectThreshold: 3.5,
  interactionStrengthFactor: 0.8,
  geographicalInfluenceFactor: 0.7,
  
  // Component weights for different aspects of tea analysis
  componentWeights: {
    teaType: 0.25,      // Increase tea type influence as the base
    compounds: 0.30,    // Increase compound influence as they're more differentiating
    processing: 0.15,   // Reduce processing influence
    geography: 0.15,    // Reduce geographical factors
    flavors: 0.15       // Reduce flavor profiles influence
  },
  
  // Thresholds for compound ratio analysis
  thresholds: {
    compoundRatios: {
      balancedRange: [1.2, 1.8],  // Ideal L-theanine to caffeine ratio
      extremeRatio: 3.0,          // Very high L-theanine to caffeine
      veryLowRatio: 0.5,          // Very low L-theanine to caffeine
      lowRatio: 0.8               // Low but not extreme L-theanine to caffeine
    }
  }
};

export default defaultConfig; 