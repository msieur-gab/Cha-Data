// TeaTypeDescriptors.js
// Descriptors and explanations for tea types across different contexts

export const teaTypeSeasonalExplanations = {
    green: {
        spring: "Green teas' fresh, vegetal characteristics align perfectly with spring renewal.",
        summer: "The cooling properties of green tea make it refreshing during summer heat.",
        fall: "Green tea's lighter character is less aligned with fall's transition to heartier flavors.",
        winter: "Green tea lacks the warming characteristics typically sought during winter."
    },
    white: {
        spring: "White tea's delicate nature harmonizes with spring's gentle emergence of flavors.",
        summer: "White tea's minimal processing provides a cooling effect ideal for summer.",
        fall: "White tea's subtlety may be overwhelmed by fall's stronger flavor preferences.",
        winter: "White tea typically lacks the robust warmth associated with winter teas."
    },
    yellow: {
        spring: "Yellow tea's gentle character and subtle sweetness make it excellent for spring drinking.",
        summer: "Yellow tea provides a refreshing yet slightly more substantial option for summer enjoyment.",
        fall: "Yellow tea's mellow character may be overshadowed by fall's preference for deeper flavors.",
        winter: "Yellow tea generally lacks the warming intensity preferred in winter months."
    },
    oolong: {
        spring: "Light oolongs capture spring's fresh floral notes beautifully.",
        summer: "Oolong's versatility makes it suitable for summer enjoyment.",
        fall: "Darker oolongs complement fall's transition with their heartier character.",
        winter: "Roasted oolongs provide comforting warmth appropriate for winter."
    },
    black: {
        spring: "Black tea's robustness can be too heavy for spring's lighter preferences.",
        summer: "Black tea's warming properties may be less refreshing during summer heat.",
        fall: "Black tea's rich, full body perfectly complements fall's transition to heartier flavors.",
        winter: "Black tea's warming properties are ideal for winter comfort."
    },
    dark: {
        spring: "Dark tea's deep character contrasts with spring's preference for lighter profiles.",
        summer: "Post-fermented dark teas can offer cooling digestive benefits even in summer heat.",
        fall: "Dark tea's complex, earthy character aligns beautifully with fall's deeper flavor palette.",
        winter: "Dark tea's warming depth makes it perfectly suited for winter consumption."
    },
    puerh: {
        spring: "Puerh's earthy depth contrasts with spring's preference for lighter teas.",
        summer: "Aged puerh has some cooling properties beneficial in summer.",
        fall: "Puerh's earthy, complex character aligns beautifully with fall's deeper flavors.",
        winter: "Puerh's warmth and depth make it perfect for winter consumption."
    }
};

// Additional descriptive information about tea types
export const teaTypeInfo = {
    dark: "A broad category of post-fermented teas including puerh (sheng/raw and shou/ripe), liu bao, and other aged heicha varieties.",
    puerh: "A subcategory of dark tea from Yunnan, China, available as sheng (raw/green) or shou (ripe/cooked) with unique aging properties."
};

// Mapping of seasonal flavor affinities for reference
export const seasonalFlavorAffinities = {
    spring: ["floral", "grassy", "vegetal", "citrus", "fresh"],
    summer: ["fruity", "citrus", "crisp", "mineral", "light"],
    fall: ["nutty", "malty", "earthy", "woody", "spicy"],
    winter: ["roasted", "spicy", "woody", "smoky", "malty"]
};

// Season opposites for explanation generation
export const seasonOpposites = {
    spring: "fall",
    summer: "winter",
    fall: "spring",
    winter: "summer"
};

export default {
    teaTypeSeasonalExplanations,
    teaTypeInfo,
    seasonalFlavorAffinities,
    seasonOpposites
}; 