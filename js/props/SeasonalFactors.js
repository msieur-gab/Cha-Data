// SeasonalFactors.js
// Defines the seasonal suitability factors for different tea properties

export const seasonalFactors = {
    // Base seasonal influence by tea type
    teaTypeFactors: {
        "green": {
            spring: 9.0,  // Fresh, light teas are excellent in spring
            summer: 8.0,  // Cooling properties good for summer
            fall: 5.0,    // Moderate suitability
            winter: 4.0   // Less warming than needed for winter
        },
        "white": {
            spring: 9.0,  // Delicate white teas align with spring renewal
            summer: 8.5,  // Cooling properties excellent for summer
            fall: 5.0,    // Moderate suitability
            winter: 3.5   // Generally too light for winter
        },
        "yellow": {
            spring: 8.5,  // Gentle character excellent for spring
            summer: 7.5,  // Good for summer, more substantial than white
            fall: 5.5,    // Moderate suitability, better than green
            winter: 4.5   // Mildly warming, but still light for winter
        },
        "oolong": {
            spring: 7.5,  // Light oolongs good for spring
            summer: 7.0,  // Medium oolongs suitable for summer
            fall: 7.5,    // Darker oolongs align with fall
            winter: 7.0   // Roasted oolongs suitable for winter
        },
        "black": {
            spring: 6.0,  // Moderately suitable for spring
            summer: 5.0,  // Can be too warming for summer
            fall: 8.5,    // Great alignment with fall transition
            winter: 9.0   // Warming properties ideal for winter
        },
        "dark": {
            spring: 4.5,  // Generally too heavy for spring freshness
            summer: 6.5,  // Post-fermented teas offer cooling digestive benefits
            fall: 8.5,    // Complex character aligns beautifully with fall
            winter: 9.5   // Robust warming depth perfect for winter
        },
        "puerh": {
            spring: 5.0,  // Less aligned with spring freshness
            summer: 6.0,  // Some cooling properties of aged tea
            fall: 8.0,    // Earthiness aligns with fall
            winter: 9.5   // Warming, aged qualities perfect for winter
        }
    },

    // Processing method influence on seasonal suitability
    processingFactors: {
        "steamed": {
            spring: 1.5,  // Fresh, vegetal notes enhanced
            summer: 1.0,  // Cooling effect
            fall: -0.5,   // Less suitable for fall
            winter: -1.0  // Not warming enough for winter
        },
        "pan-fired": {
            spring: 1.0,  // Good for spring
            summer: 0.5,  // Neutral for summer
            fall: 0.5,    // Neutral for fall
            winter: 0.5   // Neutral for winter
        },
        "shade-grown": {
            spring: 2.0,  // High umami, perfect for spring
            summer: 1.5,  // Good L-theanine for summer focus
            fall: 0.0,    // Neutral for fall
            winter: -0.5  // Less warming for winter
        },
        "withered": {
            spring: 0.5,  // Neutral for spring
            summer: 0.0,  // Neutral for summer
            fall: 0.5,    // Slight enhancement for fall
            winter: 0.5   // Slight enhancement for winter
        },
        "partial-oxidation": {
            spring: 0.5,  // Depends on level, generallly good
            summer: 0.5,  // Depends on level
            fall: 1.0,    // Good for fall transition
            winter: 0.5   // Moderate for winter
        },
        "full-oxidation": {
            spring: -0.5, // Less suited for spring freshness
            summer: -1.0, // Often too warming for summer
            fall: 1.5,    // Great for fall
            winter: 2.0   // Excellent for winter warmth
        },
        "minimal-roast": {
            spring: 1.0,  // Fresh character preserved
            summer: 0.5,  // Good for summer
            fall: 0.0,    // Neutral for fall
            winter: -0.5  // Less warming for winter
        },
        "medium-roast": {
            spring: 0.0,  // Neutral for spring
            summer: -0.5, // Can be too warming for summer
            fall: 1.0,    // Good for fall
            winter: 1.0   // Good for winter
        },
        "heavy-roast": {
            spring: -1.0, // Too heavy for spring
            summer: -1.5, // Too warming for summer
            fall: 1.5,    // Great for fall
            winter: 2.0   // Excellent for winter
        },
        "sun-dried": {
            spring: 1.0,  // Good natural character
            summer: 0.5,  // Neutral for summer
            fall: 0.0,    // Neutral for fall
            winter: 0.0   // Neutral for winter
        },
        "aged": {
            spring: -1.0, // Less aligned with spring freshness
            summer: 0.0,  // Neutral for summer
            fall: 1.5,    // Great for fall transition
            winter: 2.0   // Excellent for winter
        }
    },

    // Flavor profile influence on seasonal suitability
    flavorFactors: {
        "floral": {
            spring: 2.0,  // Floral notes align with spring blooms
            summer: 1.0,  // Pleasant for summer
            fall: 0.0,    // Neutral for fall
            winter: -0.5  // Less aligned with winter
        },
        "grassy": {
            spring: 2.0,  // Fresh grass aligns with spring
            summer: 1.0,  // Good for summer
            fall: -0.5,   // Less aligned with fall
            winter: -1.0  // Not aligned with winter
        },
        "vegetal": {
            spring: 1.5,  // Fresh vegetables align with spring
            summer: 1.0,  // Good for summer
            fall: 0.0,    // Neutral for fall
            winter: -0.5  // Less aligned with winter
        },
        "fruity": {
            spring: 1.0,  // Good for spring
            summer: 2.0,  // Perfect for summer refreshment
            fall: 1.0,    // Good for fall
            winter: 0.0   // Neutral for winter
        },
        "citrus": {
            spring: 1.5,  // Bright notes good for spring
            summer: 2.0,  // Refreshing for summer
            fall: 0.5,    // Moderate for fall
            winter: 0.0   // Neutral for winter
        },
        "malty": {
            spring: 0.0,  // Neutral for spring
            summer: -0.5, // Can be too heavy for summer
            fall: 1.5,    // Great for fall
            winter: 1.5   // Great for winter
        },
        "honey": {
            spring: 1.0,  // Good for spring
            summer: 0.5,  // Moderate for summer
            fall: 1.5,    // Great for fall harvests
            winter: 1.0   // Good for winter
        },
        "sweet": {
            spring: 1.0,  // Good for spring
            summer: 1.0,  // Good for summer
            fall: 1.0,    // Good for fall
            winter: 1.0   // Good for winter
        },
        "nutty": {
            spring: 0.0,  // Neutral for spring
            summer: -0.5, // Less refreshing for summer
            fall: 2.0,    // Perfect for fall
            winter: 1.5   // Great for winter
        },
        "spicy": {
            spring: -0.5, // Less aligned with spring
            summer: -1.0, // Too warming for summer
            fall: 1.5,    // Great for fall
            winter: 2.0   // Perfect for winter
        },
        "roasted": {
            spring: -1.0, // Too heavy for spring
            summer: -1.5, // Too warming for summer
            fall: 1.5,    // Great for fall
            winter: 2.0   // Perfect for winter
        },
        "earthy": {
            spring: -0.5, // Less aligned with spring
            summer: -1.0, // Less refreshing for summer
            fall: 2.0,    // Perfect for fall
            winter: 1.5   // Great for winter
        },
        "mineral": {
            spring: 0.5,  // Moderate for spring
            summer: 1.0,  // Good for summer hydration
            fall: 1.0,    // Good for fall
            winter: 0.5   // Moderate for winter
        },
        "woody": {
            spring: -0.5, // Less aligned with spring
            summer: -1.0, // Less refreshing for summer
            fall: 1.5,    // Great for fall
            winter: 1.5   // Great for winter
        },
        "smoky": {
            spring: -1.5, // Not aligned with spring
            summer: -2.0, // Conflicts with summer freshness
            fall: 1.0,    // Good for fall
            winter: 2.0   // Perfect for winter
        }
    },

    // Climate of origin influence
    // Teas are most suitable in seasons similar to their growing region's harvest season
    originClimateFactors: {
        // By latitude (general climate zones)
        latitudeFactors: {
            tropical: {     // 0-23.5° latitude
                spring: 0.5,
                summer: 1.5,
                fall: 0.5,
                winter: -0.5
            },
            subtropical: {  // 23.5-35° latitude
                spring: 1.0,
                summer: 1.0, 
                fall: 1.0,
                winter: 0.0
            },
            temperate: {    // 35-55° latitude
                spring: 1.5,
                summer: 0.5,
                fall: 1.5,
                winter: 0.5
            },
            subpolar: {     // 55-66.5° latitude
                spring: 0.5,
                summer: 0.0,
                fall: 1.0,
                winter: 2.0
            }
        },
        
        // By harvest month (aligns with natural seasonal cycle)
        harvestMonthFactors: {
            // Spring harvest (fresh, new growth)
            3: { // March
                spring: 2.0,
                summer: 0.5,
                fall: 0.0,
                winter: -0.5
            },
            4: { // April
                spring: 2.0,
                summer: 1.0,
                fall: 0.0,
                winter: -0.5
            },
            5: { // May
                spring: 1.5,
                summer: 1.5,
                fall: 0.5,
                winter: 0.0
            },
            // Summer harvest (mature growth)
            6: { // June
                spring: 0.5,
                summer: 2.0,
                fall: 1.0,
                winter: 0.0
            },
            7: { // July
                spring: 0.0,
                summer: 2.0,
                fall: 1.0, 
                winter: 0.5
            },
            8: { // August
                spring: 0.0,
                summer: 1.5,
                fall: 1.5,
                winter: 0.5
            },
            // Fall harvest (late season)
            9: { // September
                spring: 0.0,
                summer: 0.5,
                fall: 2.0,
                winter: 1.0
            },
            10: { // October
                spring: -0.5,
                summer: 0.0,
                fall: 2.0,
                winter: 1.5
            },
            11: { // November
                spring: -0.5,
                summer: -0.5,
                fall: 1.5,
                winter: 2.0
            },
            // Winter harvest (rare, specialized)
            12: { // December
                spring: -1.0,
                summer: -1.0,
                fall: 0.5, 
                winter: 2.0
            },
            1: { // January
                spring: -0.5,
                summer: -1.0,
                fall: 0.0,
                winter: 2.0
            },
            2: { // February
                spring: 1.0,
                summer: -0.5,
                fall: 0.0,
                winter: 1.5
            }
        }
    },

    // Chemical composition influence
    chemicalFactors: {
        // L-Theanine to Caffeine ratio impact on seasonal suitability
        lTheanineToCaffeineRatio: {
            high: {  // Ratio > 1.5 (calming)
                spring: 1.0,  // Good for spring focus
                summer: 1.5,  // Excellent for summer heat (cooling)
                fall: 0.5,    // Moderate for fall
                winter: 0.0   // Neutral for winter
            },
            balanced: {  // Ratio 0.8-1.5
                spring: 1.0,  // Good for all seasons
                summer: 1.0,  // Good for all seasons
                fall: 1.0,    // Good for all seasons
                winter: 1.0   // Good for all seasons
            },
            low: {  // Ratio < 0.8 (stimulating)
                spring: 0.5,  // Moderate for spring
                summer: -0.5, // Can be too stimulating in summer heat
                fall: 1.0,    // Good for fall productivity
                winter: 1.5   // Great for winter energy
            }
        }
    }
};

export default seasonalFactors; 