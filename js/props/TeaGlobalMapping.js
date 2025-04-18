// TeaGlobalMapping.js
// Contains mappings for deriving TCM properties (Yin/Yang, Element, Qi)
// from reliable tea data (compounds, geography, processing)
// and mapping those TCM properties to baseline Primary Effects.

/**
 * Maps Compound Ratio and Processing to a Yin/Yang numerical score.
 * Score Range: ~ -3 (Strong Yin) to +3 (Strong Yang)
 * Uses reliable L-Theanine/Caffeine and Processing data.
 * @param {object} tea - Tea object with lTheanineLevel, caffeineLevel, and processingMethods
 * @returns {number} - Yin/Yang score
 */
export const mapCompoundRatioAndProcessingToYinYangScore = (tea) => {
    let score = 0;
    // Use defaults only if mandatory fields were somehow bypassed (should ideally error earlier)
    const { lTheanineLevel = 5, caffeineLevel = 3, processingMethods = [], name = '', type = '', flavorProfile = [] } = tea;
  
    // 1. Compound Ratio Influence (Primary Driver)
    const ratio = caffeineLevel > 0 ? lTheanineLevel / caffeineLevel : 10; // High ratio if no caffeine
    
    // Refined thresholds and impact factors - Increased Yin influence for high L-Theanine:Caffeine ratios
    if (ratio > 2.5) score -= 3.0; // Strengthen Yin influence from -2.5 to -3.0
    else if (ratio > 1.8) score -= 2.0; // Strengthen Yin influence from -1.5 to -2.0
    else if (ratio > 1.2) score -= 0.7; // Slightly Yin
    else if (ratio < 0.5) score += 2.5; // Strong Yang
    else if (ratio < 0.8) score += 1.5; // Yang
    else if (ratio < 1.2) score += 0.7; // Slightly Yang
    // Balanced ratio (1.2-1.8) contributes 0 initially
  
    // 2. Consider absolute compound levels to modify the score
    const compoundTotal = lTheanineLevel + caffeineLevel;
    
    // Higher absolute levels make the score more pronounced
    if (compoundTotal > 14) {
        // For high absolute levels, amplify the effect but preserve direction
        score = score > 0 ? score * 1.2 : score * 1.15;
    } else if (compoundTotal < 8) {
        // For low absolute levels, dampen the effect
        score = score * 0.85;
    }
    
    // Special case for floral oolongs like Ali Shan
    if (name && (name.includes('Ali Shan') || name.includes('Alishan')) || 
        (type === 'oolong' && flavorProfile && 
         flavorProfile.some(flavor => ['floral', 'honey', 'butter', 'creamy'].includes(flavor)))) {
        score += 0.5; // Slightly more Yang to promote elevating effect
    }
  
    // 3. Processing Influence with more nuanced effects
    // Heavy roasts have stronger yang effect
    if (processingMethods.includes('heavy-roast') || processingMethods.includes('charcoal-roasted')) {
        score += 1.5;
    }
    else if (processingMethods.includes('medium-roast')) {
        score += 1.0;
    }
    else if (processingMethods.includes('light-roast') || processingMethods.includes('pan-fired')) {
        score += 0.5;
    }
  
    // Yinning processes have more nuanced effects
    if (processingMethods.includes('steamed')) {
        score -= 0.9;
    }
    if (processingMethods.includes('minimal-processing')) {
        score -= 1.1;
    }
    if (processingMethods.includes('shade-grown')) {
        score -= 1.2;
    }
    
    // Other processes with refined values
    if (processingMethods.includes('sun-dried')) {
        score += 0.6;
    }
    if (processingMethods.includes('aged')) {
        score += 0.4;
    }
    if (processingMethods.includes('fermented')) {
        score += 0.6;
    }
  
    // 4. Clamp the score
    return Math.max(-3.5, Math.min(3.5, score));
};
  
/**
 * Maps Geography and Processing to Five Element scores.
 * Uses reliable Geography and Processing data.
 * @param {object} tea - Tea object with geography and processingMethods
 * @returns {object} - Scores for each of the five elements
 */
export const mapGeographyAndProcessingToElementScores = (tea) => {
    const { geography = {}, processingMethods = [], flavorProfile = [], type = 'unknown' } = tea;
    // Mandatory geography fields
    const { latitude = 0, altitude = 500 } = geography;
    // Optional geography fields
    const climate = geography.climate;
    const features = geography.features || [];
    const soilType = geography.soilType;
    const avgSunlight = geography.yearlyAverageSunlight;
    const avgHumidity = geography.averageHumidity;
  
    const elementScores = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  
    // 1. Climate Influence (Optional - uses default 'temperate' logic indirectly if null)
    const effectiveClimate = climate || 'temperate'; // Use a default if null/undefined
    if (effectiveClimate.includes('tropical')) { elementScores.fire += 1.5; elementScores.earth += 0.5; }
    if (effectiveClimate.includes('subtropical')) { elementScores.wood += 0.5; elementScores.fire += 0.5; elementScores.earth += 0.5; }
    if (effectiveClimate.includes('temperate')) { elementScores.metal += 1.0; elementScores.water += 0.5; }
    if (effectiveClimate.includes('highland')) { elementScores.metal += 1.0; elementScores.wood += 0.5; }
    if (effectiveClimate.includes('humid')) { elementScores.earth += 1.0; elementScores.water += 0.5; }
    if (effectiveClimate.includes('dry') || effectiveClimate.includes('arid')) { elementScores.metal += 1.0; elementScores.fire += 0.5;}
  
    // 2. Altitude Influence (Mandatory)
    let altitudeCategory = 'medium';
    if (altitude >= 2000) altitudeCategory = 'veryHigh';
    else if (altitude >= 1200) altitudeCategory = 'high';
    else if (altitude < 500) altitudeCategory = 'low';
  
    if (altitudeCategory === 'veryHigh' || altitudeCategory === 'high') { elementScores.metal += 1.5; elementScores.water += 0.5; }
    if (altitudeCategory === 'medium') { elementScores.earth += 1.0; elementScores.wood += 0.5; }
    if (altitudeCategory === 'low') { elementScores.earth += 1.0; elementScores.fire += 0.5; }
  
    // 3. Latitude Influence (Mandatory)
    const absLatitude = Math.abs(latitude);
    if (absLatitude <= 23.5) { elementScores.fire += 1.0; elementScores.earth += 0.5; } // Tropical
    else if (absLatitude <= 35) { elementScores.wood += 0.5; elementScores.fire += 0.5; elementScores.earth += 0.5; } // Subtropical
    else if (absLatitude <= 55) { elementScores.metal += 1.0; elementScores.water += 0.5; } // Temperate
    else { elementScores.water += 1.0; elementScores.metal += 0.5; } // Subpolar/Polar
  
    // 4. Sunlight Influence (Optional)
    if (avgSunlight !== undefined && avgSunlight !== null) {
        if (avgSunlight > 7) { elementScores.fire += 1.2; } // High sun -> Fire
        else if (avgSunlight < 4) { elementScores.water += 0.8; elementScores.wood += 0.4;} // Low sun/shade -> Water/Wood
    }
  
    // 5. Humidity Influence (Optional)
    if (avgHumidity !== undefined && avgHumidity !== null) {
        if (avgHumidity > 75) { elementScores.earth += 1.0; elementScores.water += 0.5;} // High humidity -> Earth/Water
        else if (avgHumidity < 45) { elementScores.metal += 1.0; elementScores.fire += 0.3; } // Low humidity -> Metal/Fire
    }
  
    // 6. Feature Influence (Optional)
     features.forEach(feature => {
         if (feature === 'mountain' || feature === 'high-mountain') { elementScores.wood += 0.5; elementScores.metal += 0.8; }
         if (feature === 'forest') { elementScores.wood += 1.2; }
         if (feature === 'coastal') { elementScores.water += 1.0; elementScores.metal += 0.4; }
         if (feature === 'river-delta' || feature === 'valley') { elementScores.earth += 1.0; elementScores.water += 0.6; }
         if (feature === 'volcanic') { elementScores.fire += 1.0; elementScores.metal += 0.6; }
     });
  
     // 7. Soil Influence (Optional)
     if (soilType) {
         if (soilType.includes('volcanic')) { elementScores.fire += 0.8; elementScores.metal += 0.5; }
         if (soilType.includes('mineral') || soilType === 'rocky' || soilType === 'laterite') { elementScores.metal += 1.0; }
         if (soilType.includes('loam') || soilType === 'alluvial') { elementScores.earth += 1.2; }
     }
  
    // 8. Processing Influence
    if (processingMethods.includes('roasted')) { elementScores.fire += 0.5; elementScores.earth += 0.3; }
    if (processingMethods.includes('aged')) { elementScores.water += 0.8; elementScores.earth += 0.2; }
    if (processingMethods.includes('steamed')) { elementScores.wood += 0.4; elementScores.water += 0.4; }
    if (processingMethods.includes('pan-fired')) { elementScores.fire += 0.7; elementScores.metal += 0.3; }
    if (processingMethods.includes('oxidized') || processingMethods.includes('full-oxidation')) {
        elementScores.fire += 0.6; elementScores.earth += 0.4;
    }
    if (processingMethods.includes('minimal-processing') || processingMethods.includes('shade-grown')) {
        elementScores.wood += 0.8; elementScores.water += 0.5;
    }
  
    // Add type-specific element associations
    if (type === 'white') {
        elementScores.wood += 1.2; // Promotes peaceful/elevating effects
        elementScores.water += 1.8; // Significant increase for peaceful/soothing
        
        // Reduce metal element which promotes clarifying
        if (elementScores.metal > 1.0) {
            elementScores.metal *= 0.7; // Reduce metal influence
        }
    }
    if (type === 'oolong' && processingMethods.includes('partial-oxidation')) {
        elementScores.fire += 0.8; // Increases elevating/awakening
    }
  
    return elementScores;
};
  
/**
 * Determines Qi movement scores based on compounds and processing.
 * Uses reliable L-Theanine/Caffeine and Processing data.
 * @param {object} tea - Tea object with lTheanineLevel, caffeineLevel, and processingMethods
 * @returns {object} - Scores for each qi movement type
 */
export const mapCompoundsAndProcessingToQiMovementScores = (tea) => {
    // Use defaults only if mandatory fields were somehow bypassed
    const { lTheanineLevel = 5, caffeineLevel = 3, processingMethods = [] } = tea;
    const qiScores = { rising: 0, descending: 0, expanding: 0, contracting: 0, balanced: 0 };
  
    // 1. Compound Influence
    const ratio = caffeineLevel > 0 ? lTheanineLevel / caffeineLevel : 10;
    // High Caffeine -> Rising/Expanding
    if (caffeineLevel >= 6.5) { qiScores.rising += 2.0; qiScores.expanding += 1.5; }
    else if (caffeineLevel >= 4.5) { qiScores.rising += 1.2; qiScores.expanding += 0.8; }
    else if (caffeineLevel < 2.5) { qiScores.descending += 0.5; }
    // High L-Theanine -> Descending/Contracting
    if (lTheanineLevel >= 7.5) { qiScores.descending += 2.0; qiScores.contracting += 1.5; }
    else if (lTheanineLevel >= 5.5) { qiScores.descending += 1.2; qiScores.contracting += 0.8; }
    else if (lTheanineLevel < 3.5) { qiScores.rising += 0.5; }
    // Balanced Ratio -> Balanced Qi
    if (ratio >= 1.1 && ratio <= 1.9) { qiScores.balanced += 1.8; }
    else if (ratio >= 0.8 && ratio < 2.5) { qiScores.balanced += 0.5; }
  
    // 2. Processing Influence
    if (processingMethods.includes('heavy-roast') || processingMethods.includes('charcoal-roasted') || 
        processingMethods.includes('aged') || processingMethods.includes('fermented') || 
        processingMethods.includes('compressed')) {
        qiScores.descending += 2.0;
        qiScores.contracting += 1.5;
    }
    if (processingMethods.includes('steamed') || processingMethods.includes('minimal-processing') || 
        processingMethods.includes('light-oxidation') || processingMethods.includes('sun-dried')) {
        qiScores.rising += 1.2; qiScores.expanding += 0.6;
    }
    if (processingMethods.includes('rolled')) {
        qiScores.contracting += 0.6;
    }
    if (processingMethods.includes('partial-oxidation') || processingMethods.includes('gaba-processed') || 
        processingMethods.includes('medium-roast')) {
        qiScores.balanced += 1.2;
    }
    if (processingMethods.includes('full-oxidation')) {
        qiScores.rising += 0.8; qiScores.expanding += 0.4;
    }
    if (processingMethods.includes('shade-grown')) {
        qiScores.descending += 0.9; qiScores.balanced += 0.6;
    }
  
    return qiScores;
};

/**
 * Mapping from TCM properties to Primary Effect scores
 * Each array entry is [effect name, strength]
 */
export const tcmToPrimaryEffectMap = {
    // Yin/Yang Nature -> Primary Effects
    Yin: [
        ['calming', 2.8], ['harmonizing', 2.3], ['restorative', 1.7], 
        ['grounding', 1.2], ['comforting', 0.7]
    ],
    Yang: [
        ['energizing', 2.8], ['focusing', 2.3], ['elevating', 1.7],
        ['harmonizing', 1.2], ['grounding', 0.7]
    ],
    Balanced: [
        ['harmonizing', 2.5], ['focusing', 2.0], ['grounding', 1.5],
        ['calming', 1.0], ['energizing', 0.8]
    ],
    
    // Five Elements -> Primary Effects
    Wood: [
        ['focusing', 2.5], ['harmonizing', 2.0], ['elevating', 1.5],
        ['calming', 1.0], ['grounding', 0.8]
    ],
    Fire: [
        ['energizing', 2.8], ['elevating', 2.3], ['focusing', 1.7],
        ['harmonizing', 1.2], ['comforting', 0.7]
    ],
    Earth: [
        ['grounding', 2.5], ['harmonizing', 2.0], ['comforting', 1.5],
        ['restorative', 1.0], ['calming', 0.8]
    ],
    Metal: [
        ['focusing', 2.5], ['grounding', 2.0], ['harmonizing', 1.5],
        ['restorative', 1.0], ['calming', 0.8]
    ],
    Water: [
        ['calming', 2.8], ['restorative', 2.3], ['grounding', 1.7],
        ['harmonizing', 1.2], ['comforting', 0.7]
    ],
    
    // Qi Movement -> Primary Effects
    Rising: [
        ['energizing', 2.8], ['elevating', 2.3], ['focusing', 1.7],
        ['harmonizing', 1.2], ['grounding', 0.7]
    ],
    Descending: [
        ['calming', 2.8], ['grounding', 2.3], ['restorative', 1.7],
        ['harmonizing', 1.2], ['comforting', 0.7]
    ],
    Expanding: [
        ['elevating', 2.5], ['energizing', 2.0], ['harmonizing', 1.5],
        ['focusing', 1.0], ['grounding', 0.8]
    ],
    Contracting: [
        ['grounding', 2.5], ['calming', 2.0], ['restorative', 1.5],
        ['harmonizing', 1.0], ['comforting', 0.8]
    ],
    Balanced: [
        ['harmonizing', 2.5], ['grounding', 2.0], ['focusing', 1.5],
        ['calming', 1.0], ['energizing', 0.8]
    ]
};

/**
 * Helper to get Yin/Yang category name from score
 * @param {number} score - Yin/Yang score
 * @returns {string} - Yin/Yang category
 */
export const getYinYangCategory = (score) => {
    if (score <= -1.5) return 'Yin';
    if (score >= 1.5) return 'Yang';
    return 'Balanced';
};

// Export a default object containing all mappings for easier import
const TeaGlobalMapping = {
    mapCompoundRatioAndProcessingToYinYangScore,
    mapGeographyAndProcessingToElementScores,
    mapCompoundsAndProcessingToQiMovementScores,
    tcmToPrimaryEffectMap,
    getYinYangCategory
};

export default TeaGlobalMapping;
