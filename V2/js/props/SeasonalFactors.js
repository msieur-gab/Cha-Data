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
        "umami": {
            spring: 2.0,  // Perfect for spring
            summer: 1.0,  // Good for summer
            fall: 0.5,    // Moderate for fall
            winter: 0.5   // Moderate for winter
        },
        "marine": {
            spring: 1.5,  // Good for spring
            summer: 1.0,  // Good for summer
            fall: 0.5,    // Moderate for fall
            winter: 0.0   // Neutral for winter
        },
        "medicinal": {
            spring: 0.0,  // Neutral for spring
            summer: -0.5, // Less aligned with summer
            fall: 1.0,    // Good for fall
            winter: 1.5   // Great for winter health
        },
        "chocolate": {
            spring: -0.5, // Less aligned with spring
            summer: -1.0, // Too rich for summer
            fall: 1.5,    // Great for fall
            winter: 2.0   // Perfect for winter coziness
        },
        "caramel": {
            spring: 0.0,  // Neutral for spring
            summer: -0.5, // Less aligned with summer
            fall: 1.5,    // Great for fall comfort
            winter: 1.5   // Great for winter
        },
        "wood": {
            spring: -0.5, // Less aligned with spring freshness
            summer: -1.0, // Not refreshing for summer
            fall: 1.5,    // Great for fall
            winter: 1.5   // Great for winter
        },
        "leather": {
            spring: -1.0, // Not aligned with spring
            summer: -1.5, // Not aligned with summer
            fall: 1.0,    // Good for fall
            winter: 1.5   // Great for winter
        },
        "smoky": {
            spring: -1.5, // Not aligned with spring
            summer: -2.0, // Not aligned with summer
            fall: 1.0,    // Good for fall
            winter: 2.0   // Perfect for winter
        }
    },

    // Emotional needs by season
    seasonalEffectPreferences: {
        spring: {
            "elevating": 2.0,  // Spring renewal
            "energizing": 1.5, // Emerging energy
            "focusing": 1.0,   // Mental clarity
            "calming": 0.5,    // Moderate preference
            "harmonizing": 1.0 // Balanced emotion
        },
        summer: {
            "energizing": 1.0, // Energy for activities
            "focusing": 0.5,   // Less focus in relaxed summer
            "calming": 1.5,    // Cooling, soothing
            "elevating": 1.5,  // Uplifting mood
            "restorative": 1.0 // Replenishing
        },
        fall: {
            "harmonizing": 1.5, // Transitional balance
            "grounding": 2.0,   // Connecting as weather changes
            "focusing": 1.5,    // Return to structure
            "comforting": 1.0,  // Nurturing in cooling weather
            "calming": 0.5      // Moderate preference
        },
        winter: {
            "comforting": 2.0,   // Nurturing in cold
            "grounding": 1.5,    // Stabilizing in darkness
            "restorative": 1.5,  // Replenishing resources
            "harmonizing": 1.0,  // Internal balance
            "energizing": 1.0    // Energy in low-light season
        }
    },

    // Weather condition modifiers
    weatherModifiers: {
        hot: {
            "calming": 1.0,    // Cooling effect valuable
            "energizing": -0.5 // Less need for warming energy
        },
        cold: {
            "energizing": 1.0, // Warming energy valuable
            "comforting": 1.0, // Nurturing warmth valuable
            "calming": -0.5    // Cooling less valuable
        },
        rainy: {
            "comforting": 1.0, // Nurturing valuable
            "grounding": 0.5   // Stabilizing valuable
        },
        windy: {
            "grounding": 1.0,   // Stabilizing valuable
            "calming": 0.5,     // Soothing valuable
            "energizing": -0.5  // Less external stimulation needed
        },
        sunny: {
            "energizing": 0.5,  // Synergizes with sunny mood
            "elevating": 0.5    // Enhances positive mood
        },
        gray: {
            "elevating": 1.0,  // Counteracts low mood
            "energizing": 0.5, // Counteracts low energy
            "comforting": 0.5  // Nurturing valuable
        }
    },

    // Time of day preferences
    timeOfDayFactors: {
        morning: {
            "energizing": 2.0,  // Energy for day start
            "focusing": 1.5,    // Mental clarity for work
            "elevating": 1.0,   // Positive mood for day
            "calming": -1.0,    // Less relaxation needed
            "grounding": 0.5    // Moderate grounding useful
        },
        midday: {
            "focusing": 1.5,    // Mental stamina for work
            "harmonizing": 1.0, // Balance for productivity
            "elevating": 1.0,   // Maintaining positive mood
            "grounding": 0.5    // Moderate grounding useful
        },
        afternoon: {
            "energizing": 1.0,  // Second wind
            "focusing": 1.0,    // Sustained attention
            "elevating": 0.5,   // Moderate mood support
            "harmonizing": 1.0  // Balance as day progresses
        },
        evening: {
            "calming": 2.0,     // Winding down
            "comforting": 1.5,  // Nurturing after day
            "restorative": 1.5, // Recovery
            "grounding": 1.0,   // Reconnecting
            "energizing": -1.5, // Avoid stimulation
            "focusing": -1.0    // Less mental activity
        },
        night: {
            "calming": 2.5,     // Sleep preparation
            "grounding": 1.0,   // Stabilizing for rest
            "energizing": -2.0, // Avoid stimulation
            "focusing": -1.5    // Avoid mental activity
        }
    }
};

// Seasonal tea categories - describing typical tea characteristics for each season
export const seasonalTeaCategories = {
    spring: {
        name: "Spring Teas",
        description: "Fresh, vibrant teas with delicate flavors and bright notes. Typically less oxidized with vegetal, floral, and fresh characteristics.",
        types: ["green", "white", "light oolong"],
        processing: ["minimal-processing", "steamed", "pan-fired", "light-oxidation"],
        flavors: ["floral", "grassy", "vegetal", "fresh", "bright", "crisp"]
    },
    summer: {
        name: "Summer Teas",
        description: "Refreshing, cooling teas with bright, fruity notes. Emphasizes hydration and revitalization with moderate intensity.",
        types: ["green", "white", "light-medium oolong"],
        processing: ["minimal-processing", "steamed", "light-roast"],
        flavors: ["fruity", "citrus", "floral", "mineral", "crisp", "light"]
    },
    fall: {
        name: "Autumn Teas",
        description: "Warming teas with deeper, richer flavors. More oxidized or roasted with nutty, toasty, and earthy characteristics.",
        types: ["black", "roasted oolong", "dark", "young puerh"],
        processing: ["full-oxidation", "medium-roast", "heavy-roast", "aged"],
        flavors: ["nutty", "woody", "malty", "honey", "earthy", "spicy"]
    },
    winter: {
        name: "Winter Teas",
        description: "Deeply warming, rich teas with complex, robust flavors. Fully oxidized, roasted, aged, or fermented with substantial body.",
        types: ["black", "heavily-roasted oolong", "aged puerh", "dark"],
        processing: ["full-oxidation", "heavy-roast", "aged", "fermented", "charcoal-roasted"],
        flavors: ["roasted", "woody", "spicy", "chocolate", "earthy", "malty"]
    }
};

// Descriptions of optimal tea alignment for each season
export const seasonalDescriptions = {
    spring: "Spring teas capture the fresh, vibrant energy of the season with delicate flavors, bright notes, and invigorating properties. The lighter processing methods preserve the tea's natural characteristics, creating a pure expression of renewal.",
    summer: "Summer teas offer cooling refreshment with bright, crisp flavors that hydrate and revitalize. Their lighter body and refreshing qualities provide perfect balance to warm weather.",
    fall: "Fall teas embrace the transitional nature of autumn with deeper, more complex flavors. Their warming qualities and richer body harmonize with cooling temperatures and the season's introspective mood.",
    winter: "Winter teas provide deep warmth and comfort with robust, complex flavors and substantial body. Their hearty character creates perfect balance to cold weather, offering nurturing support during the coldest months."
};

// Extract primary effects from seasonal preferences
export function getSeasonalPrimaryEffects(season) {
    const preferences = seasonalFactors.seasonalEffectPreferences[season];
    if (!preferences) return [];
    
    return Object.entries(preferences)
        .sort((a, b) => b[1] - a[1])  // Sort by preference strength descending
        .slice(0, 3)                   // Get top 3 effects
        .map(([effect]) => effect);    // Return just the effect names
}

export default {
    seasonalFactors,
    seasonalTeaCategories,
    seasonalDescriptions,
    getSeasonalPrimaryEffects
}; 