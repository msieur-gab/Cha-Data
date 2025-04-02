// primaryEffects.js
// Renamed from atomicMoods.js with updated terminology

export const primaryEffects = {
    revitalizing: { // formerly energizing
        description: "Promotes physical and mental vitality",
        color: {
            start: "#FF9966",
            end: "#FF5E62"
        },
        triggers: {
            highCaffeine: 2.5,
            lowLTheanine: 1.5,
            processingMethods: ["pan-fired", "full-oxidation", "oxidised"],
            flavors: ["citrus", "mint", "ginger", "spicy", "bergamot"]
        }
    },

    awakening: { // formerly invigorating
        description: "Creates mental alertness with brightness",
        color: {
            start: "#FFE259",
            end: "#FFA751"
        },
        triggers: {
            moderateCaffeine: 2.0,
            moderateLTheanine: 1.5,
            processingMethods: ["pan-fired", "light-oxidation", "bug-bitten"],
            flavors: ["muscatel", "citrus", "fresh", "bergamot"]
        }
    },

    soothing: { // formerly calming
        description: "Promotes mental tranquility",
        color: {
            start: "#4CA1AF",
            end: "#2C3E50"
        },
        triggers: {
            highLTheanine: 2.5,
            lowCaffeine: 1.5,
            processingMethods: ["shade-grown", "steamed", "minimal-processing"],
            flavors: ["chamomile", "lavender", "grass", "marine"]
        }
    },

    peaceful: { // formerly serene
        description: "Creates gentle upliftment with tranquility",
        color: {
            start: "#89f7fe",
            end: "#66a6ff"
        },
        triggers: {
            highLTheanine: 2.0,
            lowCaffeine: 1.0,
            processingMethods: ["withered", "sun-dried", "light-roast"],
            flavors: ["peach", "apple", "honey", "chrysanthemum"]
        }
    },

    clarifying: { // formerly focusing
        description: "Enhances concentration and mental clarity",
        color: {
            start: "#72AFD3",
            end: "#37ECBA"
        },
        triggers: {
            highLTheanine: 2.0,
            moderateCaffeine: 1.5,
            processingMethods: ["steamed", "shade-grown"],
            flavors: ["umami", "marine", "mineral"]
        }
    },

    reflective: { // formerly contemplative
        description: "Promotes thoughtful introspection",
        color: {
            start: "#614385",
            end: "#516395"
        },
        triggers: {
            moderateLTheanine: 2.0,
            lowCaffeine: 1.5,
            processingMethods: ["light-oxidation", "minimal-processing"],
            flavors: ["orchid", "lily", "mineral", "slate"]
        }
    },

    comforting: { // formerly cozy
        description: "Induces warmth and comfort",
        color: {
            start: "#F6D365",
            end: "#FDA085"
        },
        triggers: {
            moderateLTheanine: 1.5,
            lowCaffeine: 1.5,
            processingMethods: ["roasted", "aged", "fermented"],
            flavors: ["roasted nuts", "chocolate", "caramel", "honey"]
        }
    },

    nurturing: { // formerly warming
        description: "Provides inner warmth and centeredness",
        color: {
            start: "#FF512F",
            end: "#DD2476"
        },
        triggers: {
            moderateCaffeine: 1.5,
            moderateLTheanine: 1.0,
            processingMethods: ["medium-roast", "charcoal-roasted", "oxidised"],
            flavors: ["toasted grain", "caramel", "roasted nuts", "coffee"]
        }
    },

    stabilizing: { // formerly grounding
        description: "Connects to earthly stability",
        color: {
            start: "#636363",
            end: "#a2ab58"
        },
        triggers: {
            moderateLTheanine: 1.5,
            moderateCaffeine: 1.0,
            processingMethods: ["aged", "compressed", "fermented"],
            flavors: ["earth", "wood", "leather", "mineral"]
        }
    },

    centering: { // formerly meditative
        description: "Promotes deep mindfulness",
        color: {
            start: "#5B247A",
            end: "#1BCEDF"
        },
        triggers: {
            highLTheanine: 2.0,
            lowCaffeine: 1.5,
            processingMethods: ["aged", "compressed", "heavy-roast"],
            flavors: ["earth", "wood", "mushroom", "mineral"]
        }
    },

    balancing: {
        description: "Promotes overall balance",
        color: {
            start: "#7F7FD5",
            end: "#91EAE4"
        },
        triggers: {
            moderateLTheanine: 1.5,
            moderateCaffeine: 1.2,
            processingMethods: ["gaba-processed", "shade-grown"],
            flavors: ["umami", "mineral", "bamboo"]
        }
    },

    elevating: { // formerly uplifting
        description: "Elevates mood and spirit",
        color: {
            start: "#fad0c4",
            end: "#ffd1ff"
        },
        triggers: {
            moderateCaffeine: 1.5,
            highLTheanine: 1.5,
            processingMethods: ["light-oxidation", "jasmine-scented"],
            flavors: ["floral", "fruity", "honey", "citrus"]
        }
    },

    renewing: { // formerly refreshing
        description: "Creates renewal and vitality",
        color: {
            start: "#96fbc4",
            end: "#f9f586"
        },
        triggers: {
            moderateCaffeine: 1.5,
            highLTheanine: 1.5,
            processingMethods: ["steamed", "minimal-processing"],
            flavors: ["fresh", "cucumber", "mint", "marine"]
        }
    },

    restorative: { // formerly nourishing
        description: "Supports holistic wellbeing",
        color: {
            start: "#48c6ef",
            end: "#6f86d6"
        },
        triggers: {
            highLTheanine: 2.0,
            moderateCaffeine: 1.0,
            processingMethods: ["minimal-processing", "shade-grown"],
            flavors: ["umami", "seaweed", "grass", "mineral"]
        }
    }
};

export default primaryEffects;
