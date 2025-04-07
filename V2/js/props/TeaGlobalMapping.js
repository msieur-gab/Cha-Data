// TeaGlobalMapping.js
// Functions for mapping tea properties to TCM effects

/**
 * Maps the ratio of L-theanine to caffeine along with processing method to a Yin-Yang score.
 * Higher ratio of L-theanine to caffeine increases Yin score (cooling).
 * More oxidation and roasting increases Yang score (warming).
 * 
 * @param {Object} compounds - Contains theanineLevel and caffeineLevel
 * @param {Object} processingInfo - Contains oxidationLevel and roastLevel
 * @returns {Object} - Yin and Yang scores on 1-10 scale
 */
export function mapCompoundRatioAndProcessingToYinYangScore(compounds, processingInfo) {
    // Default values if data is incomplete
    const theanine = compounds?.theanineLevel || 5;
    const caffeine = compounds?.caffeineLevel || 5;
    const oxidation = processingInfo?.oxidationLevel || 5;
    const roast = processingInfo?.roastLevel || 5;
    
    // Calculate theanine to caffeine ratio effect
    // Higher theanine to caffeine ratio increases Yin
    const ratio = theanine / (caffeine || 1); // Avoid division by zero
    
    // Base Yin-Yang values
    let yin = 5;
    let yang = 5;
    
    // Adjust for compound ratio
    if (ratio > 1.5) {
        yin += 2.5 * (ratio - 1.5); // Boost yin for high theanine
        yang -= 1.5 * (ratio - 1.5); // Reduce yang
    } else if (ratio < 1) {
        yang += 2 * (1 - ratio); // Boost yang for high caffeine
        yin -= 1 * (1 - ratio); // Reduce yin
    }
    
    // Adjust for processing
    // Oxidation increases yang and decreases yin
    yang += (oxidation - 5) * 0.5;
    yin -= (oxidation - 5) * 0.3;
    
    // Roasting increases yang and decreases yin
    yang += (roast - 5) * 0.7;
    yin -= (roast - 5) * 0.4;
    
    // Ensure values are in 1-10 range
    yin = Math.max(1, Math.min(10, yin));
    yang = Math.max(1, Math.min(10, yang));
    
    return { yin, yang };
}

/**
 * Maps geographic factors and processing to element scores.
 * Based on Chinese Five Elements theory.
 * 
 * @param {Object} geography - Contains altitude, latitude, climate data
 * @param {Object} processingInfo - Contains oxidationLevel and roastLevel
 * @returns {Object} - Scores for all five elements on 1-10 scale
 */
export function mapGeographyAndProcessingToElementScores(geography, processingInfo) {
    // Default values if data is incomplete
    const altitude = geography?.altitude || 1000;
    const latitude = geography?.latitude || 30;
    const soilType = geography?.soilType || 'mineral';
    const climate = geography?.climate || 'temperate';
    const oxidation = processingInfo?.oxidationLevel || 5;
    const roast = processingInfo?.roastLevel || 5;
    
    // Initialize element scores
    let wood = 5;  // Associated with growth, spring, east
    let fire = 5;   // Associated with heat, summer, south
    let earth = 5;  // Associated with stability, transitions, center
    let metal = 5;  // Associated with clarity, autumn, west
    let water = 5;  // Associated with depth, winter, north
    
    // Altitude influences
    // Higher altitude: more metal and water, less fire
    if (altitude > 1500) {
        metal += (altitude - 1500) / 500;
        water += (altitude - 1500) / 1000;
        fire -= (altitude - 1500) / 750;
    } else if (altitude < 800) {
        fire += (800 - altitude) / 400;
        earth += (800 - altitude) / 800;
    }
    
    // Latitude influences
    // Lower latitude (tropical): more fire and wood
    // Higher latitude (temperate/cold): more water and metal
    if (latitude < 25) {
        fire += (25 - latitude) / 5;
        wood += (25 - latitude) / 7;
        water -= (25 - latitude) / 10;
    } else if (latitude > 35) {
        water += (latitude - 35) / 7;
        metal += (latitude - 35) / 10;
        fire -= (latitude - 35) / 8;
    }
    
    // Soil type influences
    switch (soilType.toLowerCase()) {
        case 'volcanic':
            fire += 2;
            earth += 1;
            break;
        case 'mineral':
        case 'rocky':
            metal += 2;
            earth += 1;
            break;
        case 'loamy':
        case 'alluvial':
            earth += 2;
            wood += 1;
            break;
        case 'sandy':
            metal += 1;
            water += 1;
            break;
    }
    
    // Climate influences
    switch (climate.toLowerCase()) {
        case 'tropical':
            fire += 2;
            wood += 1.5;
            metal -= 1;
            break;
        case 'subtropical':
            fire += 1;
            wood += 1;
            break;
        case 'temperate':
            earth += 1.5;
            metal += 1;
            break;
        case 'humid':
        case 'monsoon':
            water += 2;
            wood += 1;
            break;
        case 'highland':
            metal += 1.5;
            water += 1;
            fire -= 1;
            break;
    }
    
    // Processing influences
    // Oxidation increases fire and earth, decreases wood
    fire += (oxidation - 5) * 0.3;
    earth += (oxidation - 5) * 0.2;
    wood -= (oxidation - 5) * 0.3;
    
    // Roasting increases fire and metal, decreases water
    fire += (roast - 5) * 0.4;
    metal += (roast - 5) * 0.3;
    water -= (roast - 5) * 0.3;
    
    // Ensure all values are in 1-10 range
    wood = Math.max(1, Math.min(10, wood));
    fire = Math.max(1, Math.min(10, fire));
    earth = Math.max(1, Math.min(10, earth));
    metal = Math.max(1, Math.min(10, metal));
    water = Math.max(1, Math.min(10, water));
    
    return { wood, fire, earth, metal, water };
}

/**
 * Maps compound levels and processing to qi movement scores.
 * Determines how the tea's energy moves in the body.
 * 
 * @param {Object} compounds - Contains theanineLevel and caffeineLevel
 * @param {Object} processingInfo - Contains oxidationLevel and roastLevel
 * @returns {Object} - Scores for different qi movement patterns
 */
export function mapCompoundsAndProcessingToQiMovementScores(compounds, processingInfo) {
    // Default values if data is incomplete
    const theanine = compounds?.theanineLevel || 5;
    const caffeine = compounds?.caffeineLevel || 5;
    const catechins = compounds?.catechinsLevel || 5;
    const oxidation = processingInfo?.oxidationLevel || 5;
    const roast = processingInfo?.roastLevel || 5;
    
    // Initialize movement scores
    let upward = 5;    // Energy moves up (head, upper body)
    let outward = 5;   // Energy moves to surface/extremities
    let downward = 5;  // Energy moves down (lower body)
    let inward = 5;    // Energy moves to core/center
    
    // Caffeine increases upward and outward movement
    upward += (caffeine - 5) * 0.5;
    outward += (caffeine - 5) * 0.4;
    
    // Theanine balances movement, slightly increases downward and inward
    if (theanine > 5) {
        upward -= (theanine - 5) * 0.2;
        outward -= (theanine - 5) * 0.2;
        downward += (theanine - 5) * 0.3;
        inward += (theanine - 5) * 0.3;
    }
    
    // Catechins affect circulation, increase outward movement
    outward += (catechins - 5) * 0.3;
    
    // Oxidation increases inward movement
    inward += (oxidation - 5) * 0.3;
    outward -= (oxidation - 5) * 0.2;
    
    // Roasting increases downward movement
    downward += (roast - 5) * 0.4;
    upward -= (roast - 5) * 0.3;
    
    // Ensure all values are in 1-10 range
    upward = Math.max(1, Math.min(10, upward));
    outward = Math.max(1, Math.min(10, outward));
    downward = Math.max(1, Math.min(10, downward));
    inward = Math.max(1, Math.min(10, inward));
    
    return { upward, outward, downward, inward };
}

/**
 * Determines the temperature property of a tea based on
 * processing and compounds.
 * 
 * @param {Object} compounds - Tea compound levels
 * @param {Object} processingInfo - Processing method information
 * @returns {String} - Temperature property (cold/cool/neutral/warm/hot)
 */
export function determineTemperatureProperty(compounds, processingInfo) {
    // Calculate Yang score as basis for temperature
    const { yang } = mapCompoundRatioAndProcessingToYinYangScore(compounds, processingInfo);
    
    // Map yang score to temperature
    if (yang <= 2) return "cold";
    if (yang <= 4) return "cool";
    if (yang <= 6) return "neutral";
    if (yang <= 8) return "warm";
    return "hot";
}

/**
 * Determines the primary flavor categories present in a tea
 * based on its flavor profile data.
 * 
 * @param {Object} flavorProfile - The tea's flavor profile
 * @returns {Array} - Array of primary flavor categories
 */
export function determinePrimaryFlavorCategories(flavorProfile) {
    if (!flavorProfile) return [];
    
    const categories = [];
    const threshold = 6; // Minimum score to be considered primary
    
    // Check each category
    if (flavorProfile.floral >= threshold) categories.push("floral");
    if (flavorProfile.fruity >= threshold) categories.push("fruity");
    if (flavorProfile.vegetal >= threshold) categories.push("vegetal");
    if (flavorProfile.nutty >= threshold) categories.push("nutty");
    if (flavorProfile.spicy >= threshold) categories.push("spicy");
    if (flavorProfile.sweet >= threshold) categories.push("sweet");
    if (flavorProfile.mineral >= threshold) categories.push("mineral");
    if (flavorProfile.earthy >= threshold) categories.push("earthy");
    if (flavorProfile.woody >= threshold) categories.push("woody");
    if (flavorProfile.roasted >= threshold) categories.push("roasted");
    
    // If no categories meet the threshold, use the highest one
    if (categories.length === 0) {
        let highest = 0;
        let highestCategory = "";
        
        for (const [category, value] of Object.entries(flavorProfile)) {
            if (value > highest) {
                highest = value;
                highestCategory = category;
            }
        }
        
        if (highestCategory) categories.push(highestCategory);
    }
    
    return categories;
}

/**
 * Determines the weight/body characteristic of a tea
 * based on various properties.
 * 
 * @param {Object} tea - Tea data
 * @returns {String} - Weight characteristic (light/medium/full)
 */
export function determineTeasWeight(tea) {
    // Default to medium if not enough data
    if (!tea || !tea.compounds || !tea.processingInfo) {
        return "medium";
    }
    
    // Factors that influence weight
    const oxidation = tea.processingInfo.oxidationLevel || 5;
    const roast = tea.processingInfo.roastLevel || 5;
    const polyphenols = tea.compounds.polyphenolsLevel || 5;
    
    // Calculate weight score
    let weightScore = 5; // Medium as default
    
    // Higher oxidation increases weight
    weightScore += (oxidation - 5) * 0.4;
    
    // Higher roast increases weight
    weightScore += (roast - 5) * 0.4;
    
    // Higher polyphenols increase weight/texture
    weightScore += (polyphenols - 5) * 0.3;
    
    // If we have astringency data, factor it in
    if (tea.flavorProfile && tea.flavorProfile.astringency) {
        weightScore += (tea.flavorProfile.astringency - 5) * 0.3;
    }
    
    // Map score to weight category
    if (weightScore < 4) return "light";
    if (weightScore < 7) return "medium";
    return "full";
}

export default {
    mapCompoundRatioAndProcessingToYinYangScore,
    mapGeographyAndProcessingToElementScores,
    mapCompoundsAndProcessingToQiMovementScores,
    determineTemperatureProperty,
    determinePrimaryFlavorCategories,
    determineTeasWeight
}; 