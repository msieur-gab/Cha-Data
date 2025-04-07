// primaryEffects.js
// Renamed from atomicMoods.js with updated terminology

export const primaryEffects = {
    energizing: {
        description: "Provides mental and physical energy, alertness, and vitality",
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

    calming: {
        description: "Induces relaxation and reduces stress",
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

    focusing: {
        description: "Enhances mental clarity and concentration",
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

    harmonizing: {
        description: "Creates equilibrium between opposing forces",
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

    grounding: {
        description: "Provides stability and connection to the present",
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

    elevating: {
        description: "Elevates mood and spirit, creates transcendent experiences",
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

    comforting: {
        description: "Provides warmth, security, and emotional support",
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

    restorative: {
        description: "Aids in recovery and renewal",
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