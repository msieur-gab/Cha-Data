// EffectInteractionMapper.js
// Utility to map raw effect combinations data to a format InteractionCalculator can use

/**
 * Maps raw effect combinations data to enhanced data including modifiers
 * @param {Object} effectCombinations - Raw effect combinations from EffectCombinations.js
 * @returns {Object} - Enhanced effect combinations with modifiers
 */
export function mapEffectCombinations(effectCombinations) {
  if (!effectCombinations || typeof effectCombinations !== 'object') {
    return {};
  }
  
  const mappedCombinations = {};
  
  // Process each combination to add modifier information
  Object.entries(effectCombinations).forEach(([key, combination]) => {
    // Extract the effect names from the key (format: "effect1+effect2")
    const effects = key.split('+');
    if (effects.length !== 2) return;
    
    const effect1 = effects[0];
    const effect2 = effects[1];
    
    // Generate modifiers based on the combination properties
    const modifies = generateModifiers(effect1, effect2, combination);
    
    // Create the enhanced combination
    mappedCombinations[key] = {
      ...combination,
      effects: [effect1, effect2],
      modifies
    };
  });
  
  return mappedCombinations;
}

/**
 * Intelligently generates modifiers for effect combinations based on their types
 * @param {string} effect1 - First effect name
 * @param {string} effect2 - Second effect name
 * @param {Object} combination - Combination data
 * @returns {Array} - Array of modifier objects
 */
function generateModifiers(effect1, effect2, combination) {
  const modifies = [];
  
  // If the combination already has modifiers, return them
  if (combination.modifies && Array.isArray(combination.modifies)) {
    return combination.modifies;
  }
  
  // Analyze the combination name and description to infer appropriate modifiers
  const name = combination.name?.toLowerCase() || '';
  const description = combination.description?.toLowerCase() || '';
  
  // Energy state combinations
  if (name.includes('vitality') || description.includes('energy') || description.includes('alertness')) {
    modifies.push({ target: 'revitalizing', modifier: 0.3 });
  }
  
  // Calming state combinations
  if (name.includes('peace') || name.includes('tranquil') || description.includes('calm') || description.includes('relax')) {
    modifies.push({ target: 'peaceful', modifier: 0.4 });
    modifies.push({ target: 'soothing', modifier: 0.3 });
  }
  
  // Mental state combinations
  if (name.includes('clarity') || name.includes('focus') || description.includes('mental') || description.includes('concentration')) {
    modifies.push({ target: 'clarifying', modifier: 0.4 });
  }
  
  // Reflective combinations
  if (name.includes('reflection') || name.includes('mindful') || description.includes('reflective')) {
    modifies.push({ target: 'reflective', modifier: 0.3 });
    modifies.push({ target: 'centering', modifier: 0.2 });
  }
  
  // Balancing combinations
  if (name.includes('balance') || name.includes('harmony') || description.includes('equilibrium')) {
    modifies.push({ target: 'balancing', modifier: 0.5 });
  }
  
  // Uplifting combinations
  if (name.includes('spirit') || name.includes('joy') || description.includes('positive')) {
    modifies.push({ target: 'elevating', modifier: 0.4 });
  }
  
  // Stabilizing combinations
  if (name.includes('ground') || name.includes('stable') || description.includes('anchor')) {
    modifies.push({ target: 'stabilizing', modifier: 0.4 });
  }
  
  // If no specific modifiers were found, create mutual reinforcement
  if (modifies.length === 0) {
    modifies.push({ target: effect1, modifier: 0.25 });
    modifies.push({ target: effect2, modifier: 0.25 });
  }
  
  return modifies;
}

export default mapEffectCombinations; 