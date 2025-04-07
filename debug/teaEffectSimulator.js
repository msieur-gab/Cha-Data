// teaEffectSimulator.js - Simulation to find optimal weights
import { teaDatabase } from '../js/TeaDatabase.js';
import { InteractionCalculator } from '../js/calculators/InteractionCalculator.js';
import { ProcessingCalculator } from '../js/calculators/ProcessingCalculator.js';
import { GeographyCalculator } from '../js/calculators/GeographyCalculator.js';
import { FlavorCalculator } from '../js/calculators/FlavorCalculator.js';
import { CompoundCalculator } from '../js/calculators/CompoundCalculator.js';
import { EffectSystemConfig } from '../js/config/EffectSystemConfig.js';
import { primaryEffects } from '../js/props/PrimaryEffects.js';
import { processingInfluences } from '../js/props/ProcessingInfluences.js';
import { flavorInfluences } from '../js/props/FlavorInfluences.js';
import { effectCombinations } from '../js/props/EffectCombinations.js';
import { mapEffectCombinations } from '../js/utils/EffectInteractionMapper.js';

export function simulateTeaEffects() {
  // Initialize result storage
  const results = [];
  const config = new EffectSystemConfig();
  
  // Create calculators
  const processingCalculator = new ProcessingCalculator(config, processingInfluences);
  const geographyCalculator = new GeographyCalculator(config);
  const flavorCalculator = new FlavorCalculator(config, flavorInfluences);
  const compoundCalculator = new CompoundCalculator(config, primaryEffects);
  
  // Weight combinations to try
  const weightCombinations = [
    { compounds: 0.40, processing: 0.30, geography: 0.15, flavor: 0.15 },
    { compounds: 0.45, processing: 0.35, geography: 0.10, flavor: 0.10 },
    { compounds: 0.50, processing: 0.30, geography: 0.10, flavor: 0.10 },
    { compounds: 0.55, processing: 0.25, geography: 0.10, flavor: 0.10 },
    { compounds: 0.60, processing: 0.25, geography: 0.10, flavor: 0.05 }
  ];
  
  // Process each tea
  teaDatabase.forEach(tea => {
    if (!tea || !tea.name) return;
    
    // Skip teas without expected effects
    if (!tea.expectedEffects?.dominant) return;
    
    console.log(`Processing tea: ${tea.name}`);
    
    // Calculate component scores once per tea
    const processingScores = processingCalculator.calculateProcessingInfluence(tea);
    const geoScores = geographyCalculator.calculateGeographicEffects(tea.origin);
    const flavorScores = flavorCalculator.calculateFlavorInfluence(tea.flavorProfile);
    const compoundScores = compoundCalculator.calculateCompoundEffects(tea);
    
    // L-Theanine dominant effects
    const ratio = tea.lTheanineLevel / tea.caffeineLevel;
    const baseScores = {};
    
    if (ratio > 1.5) {
      baseScores['calming'] = Math.min(10, tea.lTheanineLevel * 0.8);
      baseScores['restorative'] = Math.min(10, tea.lTheanineLevel * 0.7);
    }
    
    if (ratio < 1.0) {
      baseScores['energizing'] = Math.min(10, tea.caffeineLevel * 0.9);
      baseScores['focusing'] = Math.min(10, tea.caffeineLevel * 0.7);
    }
    
    // Add processing method influences
    if (tea.processingMethods.includes('shade-grown')) {
      baseScores['focusing'] = (baseScores['focusing'] || 0) + 3;
    }
    
    if (tea.processingMethods.includes('heavy-roast')) {
      baseScores['comforting'] = (baseScores['comforting'] || 0) + 3;
      baseScores['grounding'] = (baseScores['grounding'] || 0) + 2;
    }
    
    if (tea.processingMethods.includes('minimal-processing') || 
        tea.processingMethods.includes('minimal-roast')) {
      baseScores['elevating'] = (baseScores['elevating'] || 0) + 2;
    }
    
    if (tea.processingMethods.includes('aged')) {
      baseScores['grounding'] = (baseScores['grounding'] || 0) + 3;
    }
    
    // Test each weight combination
    weightCombinations.forEach(weights => {
      // Get unique effect IDs
      const allEffectIds = new Set([
        ...Object.keys(baseScores),
        ...Object.keys(processingScores),
        ...Object.keys(geoScores || {}),
        ...Object.keys(flavorScores || {}),
        ...Object.keys(compoundScores || {})
      ]);
      
      const combinedScores = {};
      
      // Calculate weighted score for each effect
      allEffectIds.forEach(effect => {
        const baseVal = (baseScores[effect] || 0) * weights.compounds;
        const processingVal = (processingScores[effect] || 0) * weights.processing;
        const geoVal = ((geoScores || {})[effect] || 0) * weights.geography;
        const flavorVal = ((flavorScores || {})[effect] || 0) * weights.flavor;
        
        // Calculate weighted total
        combinedScores[effect] = Math.min(10, baseVal + processingVal + geoVal + flavorVal);
      });
      
      // Apply interactions
      const interactionCalculator = new InteractionCalculator(config, mapEffectCombinations(effectCombinations));
      const finalScores = interactionCalculator.applyEffectInteractions(combinedScores);
      
      // Get top effects
      const sortedEffects = Object.entries(finalScores)
        .sort(([, a], [, b]) => b - a)
        .map(([id, score]) => ({ id, score }));
      
      const dominantCalculated = sortedEffects[0]?.id;
      const supportingCalculated = sortedEffects[1]?.id;
      
      // Compare with expected
      const dominantMatch = dominantCalculated === tea.expectedEffects.dominant;
      const supportingMatch = supportingCalculated === tea.expectedEffects.supporting;
      
      // Store result
      results.push({
        tea: tea.name,
        weights: { ...weights },
        dominantExpected: tea.expectedEffects.dominant,
        dominantCalculated,
        supportingExpected: tea.expectedEffects.supporting || 'none',
        supportingCalculated: supportingCalculated || 'none',
        bothMatch: dominantMatch && supportingMatch,
        dominantMatch,
        supportingMatch,
        topScores: sortedEffects.slice(0, 3).map(e => `${e.id}: ${e.score.toFixed(1)}`).join(', ')
      });
    });
  });
  
  // Analyze results by weight combination
  const summary = weightCombinations.map(weights => {
    const relevantResults = results.filter(r => 
      r.weights.compounds === weights.compounds && 
      r.weights.processing === weights.processing);
    
    const totalTeas = relevantResults.length;
    const dominantMatches = relevantResults.filter(r => r.dominantMatch).length;
    const supportingMatches = relevantResults.filter(r => r.supportingMatch).length;
    const bothMatches = relevantResults.filter(r => r.bothMatch).length;
    
    return {
      weights,
      totalTeas,
      dominantMatchRate: (dominantMatches / totalTeas * 100).toFixed(1) + '%',
      supportingMatchRate: (supportingMatches / totalTeas * 100).toFixed(1) + '%',
      bothMatchRate: (bothMatches / totalTeas * 100).toFixed(1) + '%'
    };
  });
  
  console.table(summary);
  
  // Detailed results for each tea
  console.log('DETAILED RESULTS:');
  
  // Get the best weight combination
  const bestWeights = summary.sort((a, b) => 
    parseFloat(b.dominantMatchRate) - parseFloat(a.dominantMatchRate))[0].weights;
  
  // Show results for best weight combination
  const bestResults = results.filter(r => 
    r.weights.compounds === bestWeights.compounds && 
    r.weights.processing === bestWeights.processing);
  
  console.log(`Results for best weight combination: 
    Compounds: ${bestWeights.compounds}, 
    Processing: ${bestWeights.processing}, 
    Geography: ${bestWeights.geography}, 
    Flavor: ${bestWeights.flavor}`);
  
  bestResults.forEach(result => {
    console.log(`${result.tea}:
      Expected: ${result.dominantExpected} / ${result.supportingExpected}
      Calculated: ${result.dominantCalculated} / ${result.supportingCalculated}
      Match: ${result.bothMatch ? 'BOTH' : (result.dominantMatch ? 'Dominant Only' : (result.supportingMatch ? 'Supporting Only' : 'NONE'))}
      Top Scores: ${result.topScores}
    `);
  });
  
  return {
    summary,
    bestWeights,
    detailedResults: bestResults
  };
}

// Run the simulation
simulateTeaEffects(); 