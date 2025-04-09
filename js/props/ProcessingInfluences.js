// processingInfluences.js
// Renamed from processingMethodMoodAlignment.js with updated terminology

export const processingInfluences = {
    // Heat Treatment Methods
    'steamed': {
        effects: {
            focusing: 3.0,   // Was clarifying
            calming: 2.5     // Was peaceful
        },
        intensity: 1.9,
        category: 'heat',
        description: 'Gentle heat preservation that maintains delicate compounds and promotes mental clarity',
        seasonalExplanations: {
            spring: "Steaming preserves the fresh, vegetal notes that align with spring preferences.",
            summer: "Steamed processing preserves cooling properties beneficial in summer.",
            fall: "Steamed processing creates lighter profiles less aligned with fall preferences.",
            winter: "Steamed teas typically lack the warming characteristics desired in winter."
        }
    },
    'pan-fired': {
        effects: {
            energizing: 2.6,   // Was revitalizing, slightly reduced
            focusing: 2.2      // Was awakening, changed to focusing
        },
        intensity: 1.2,
        category: 'heat',
        description: 'Light toasting method that adds complexity, stimulation, and mental alertness'
    },
    'light-roast': {
        effects: {
            calming: 2.5,       // Was peaceful
            elevating: 2.5,     // Added elevating effect
            grounding: 2.0      // Was reflective
        },
        intensity: 1.0,
        category: 'heat',
        description: 'Subtle roasting that enhances flavor subtleties and promotes gentle mental exploration'
    },
    'medium-roast': {
        effects: {
            comforting: 2.8,     // Was nurturing  
            harmonizing: 2.2,    // Was balancing
            grounding: 2.0       // Added grounding effect
        },
        intensity: 1.5,
        category: 'heat',
        description: 'Balanced roasting that develops rich, complex notes and provides centered energy',
        seasonalExplanations: {
            spring: "Medium roasting adds depth that can compete with spring's preference for lighter notes.",
            summer: "Medium roasted teas may be less refreshing during summer heat.",
            fall: "Medium roasting creates warm notes that align well with fall's deeper flavor preferences.",
            winter: "Medium roasted teas provide good warmth appropriate for winter enjoyment."
        }
    },
    'heavy-roast': {
        effects: {
            comforting: 3.5,     // Was nurturing, boosted  
            grounding: 3.0,      // Was centering, boosted
            harmonizing: 1.5     // Added harmonizing
        },
        intensity: 1.8,
        category: 'heat',
        description: 'Intense roasting creating deep, transformative flavors and profound introspection',
        seasonalExplanations: {
            spring: "Heavy roasting creates flavors too intense for spring's lighter preferences.",
            summer: "Heavy roasted teas tend to be warming, counteracting summer's need for refreshment.",
            fall: "Heavy roasting creates nutty, toasty notes that perfectly complement fall.",
            winter: "Heavy roasted teas provide deeply warming comfort ideal for winter."
        }
    },
    'charcoal-roasted': {
        effects: {
            comforting: 3.5,     // Was nurturing, boosted
            grounding: 3.0,      // Was reflective, boosted and changed
            harmonizing: 2.0     // Added harmonizing
        },
        intensity: 2.2,
        category: 'heat',
        description: 'Traditional roasting method with profound depth, promoting deep connection and inner stability'
    },
    // Sun Processing Methods
    'sun-dried': {
        effects: {
            calming: 2.5,        // Was peaceful
            restorative: 2.5,    // Was renewing, increased
            elevating: 2.0       // Added elevating
        },
        intensity: 1.6,
        category: 'drying',
        description: 'Natural drying process that preserves delicate characteristics while adding subtle complexity and brightness',
        seasonalExplanations: {
            spring: "Sun-drying preserves natural freshness that aligns with spring's character.",
            summer: "Sun-dried teas retain a brightness that's appealing during summer.",
            fall: "Sun-dried teas may lack the depth preferred during fall transitions.",
            winter: "Sun-dried teas often lack the warming intensity sought in winter."
        }
    },

    // Oxidation Methods
    'withered': {
        effects: {
            calming: 2.5,        // Was peaceful
            harmonizing: 2.2,    // Was balancing
            elevating: 1.5       // Added elevating
        },
        intensity: 1.2,
        category: 'oxidation',
        description: 'Initial processing that preserves natural essence and promotes gentle mental clarity',
        seasonalExplanations: {
            spring: "Withering preserves delicate qualities that harmonize with spring's freshness.",
            summer: "Withered teas maintain a gentleness suitable for summer enjoyment.",
            fall: "Withering creates subtle complexity that can complement fall's transitional nature.",
            winter: "Withered teas provide moderate warmth appropriate for winter."
        }
    },
    'oxidised': {
        effects: {
            energizing: 3.0,     // Was revitalizing
            focusing: 2.5,       // Was awakening, changed to focusing
            elevating: 2.0       // Added elevating
        },
        intensity: 1.5,
        category: 'oxidation',
        description: 'Increases complexity, develops bold characteristics, and stimulates mental energy'
    },
    'partial-oxidation': {
        effects: {
            harmonizing: 3.0,    // Was balancing
            grounding: 2.2,      // Was reflective, changed to grounding
            elevating: 2.0       // Added elevating
        },
        intensity: 1.3,
        category: 'oxidation',
        description: 'Balanced approach maintaining nuanced flavors and promoting mental equilibrium',
        seasonalExplanations: {
            spring: "Partial oxidation creates a balance that can work well with spring's character.",
            summer: "Partially oxidized teas offer moderate refreshment suitable for summer.",
            fall: "Partial oxidation provides nuanced depth that complements fall's transitional nature.",
            winter: "Partially oxidized teas offer moderate warmth appropriate for winter."
        }
    },
    'full-oxidation': {
        effects: {
            energizing: 3.0,     // Was revitalizing, decreased a bit
            comforting: 2.5,     // Was nurturing
            grounding: 2.0       // Added grounding
        },
        intensity: 1.7,
        category: 'oxidation',
        description: 'Complete transformation of leaf characteristics, creating robust and centering experiences',
        seasonalExplanations: {
            spring: "Full oxidation creates stronger flavors that can overwhelm spring's lighter preferences.",
            summer: "Fully oxidized teas tend to have warming properties less ideal for summer refreshment.",
            fall: "Full oxidation creates rich, robust flavors that harmonize with fall's deeper taste preferences.",
            winter: "Fully oxidized teas provide warming comfort ideal for winter consumption."
        }
    },
    'kill-green': {
        effects: {
            focusing: 2.8,       // Was clarifying
            calming: 2.2         // Was soothing
        },
        intensity: 1.4,
        category: 'oxidation',
        description: 'Halts enzymatic processes, preserving delicate compounds and promoting mental clarity'
    },

    // Growing and Processing Methods
    'shade-grown': {
        effects: {
            focusing: 3.5,       // Was clarifying
            calming: 3.0,        // Was soothing, increased
            elevating: 2.5       // Added elevating
        },
        intensity: 2.5,
        category: 'growing',
        description: 'Increases amino acids and L-theanine content, promoting deep mental stillness',
        seasonalExplanations: {
            spring: "Shade-grown processing enhances umami and L-theanine content, perfect for spring.",
            summer: "Shade-grown tea's higher L-theanine content provides a cooling focus beneficial in summer.",
            fall: "Shade-grown characteristics are less relevant to fall's flavor preferences.",
            winter: "Shade-grown teas often lack the warming qualities desired in winter."
        }
    },
    'minimal-processing': {
        effects: {
            elevating: 3.0,     // Increased from 2.8
            calming: 2.2,       // Was peaceful
            focusing: 2.0       // Added focusing
        },
        intensity: 2.0,
        category: 'processing',
        description: 'Preserves the most natural tea characteristics with holistic, gentle approach',
        seasonalExplanations: {
            spring: "Minimal processing preserves the fresh character that aligns with spring.",
            summer: "Minimally processed teas retain cooling properties beneficial in summer heat.",
            fall: "Minimal processing creates lighter profiles that may lack fall's deeper flavor preferences.",
            winter: "Minimally processed teas often lack the warming characteristics sought in winter."
        }
    },
    'gaba-processed': {
        effects: {
            calming: 3.5,       // Was soothing
            grounding: 3.0       // Was centering
        },
        intensity: 2.5,
        category: 'special',
        description: 'Specifically designed to enhance relaxation and holistic well-being compounds'
    },

    // Scenting and Special Methods
    'jasmine-scented': {
        effects: {
            calming: 3.0, 
            soothing: 2.5
        },
        intensity: 1.6,
        category: 'scenting',
        description: 'Delicate floral notes enhance relaxation and promote gentle emotional balance'
    },
    'rose-scented': {
        effects: {
            calming: 3.0, 
            soothing: 2.5
        },
        intensity: 1.5,
        category: 'scenting',
        description: 'Soft, romantic aromatics promote tranquility and inner peace'
    },
    'osmanthus-scented': {
        effects: {
            calming: 2.8, 
            harmonizing: 2.2
        },
        intensity: 1.4,
        category: 'scenting',
        description: 'Sweet, subtle floral notes create balance and gentle emotional lift'
    },

    // Aging and Fermentation
    'aged': {
        effects: {
            stabilizing: 3.5, 
            grounding: 2.5
        },
        intensity: 1.7,
        category: 'aging',
        description: 'Develops complex, refined characteristics through patient transformation',
        seasonalExplanations: {
            spring: "Aged characteristics contrast with spring's preference for fresh flavors.",
            summer: "Aged teas have mixed suitability for summer depending on other factors.",
            fall: "Aging develops complex flavors that harmonize beautifully with fall's deeper preferences.",
            winter: "Aged teas develop depth and warmth perfect for winter consumption."
        }
    },
    'fermented': {
        effects: {
            grounding: 2.8, 
            stabilizing: 2.5,
            comforting: 2.0
        },
        intensity: 1.5,
        category: 'fermentation',
        description: 'Transforms tea through controlled microbial processes, creating depth and complexity'
    },

    // Special Processing Methods
    'bug-bitten': {
        effects: {
            elevating: 2.8, 
            restorative: 2.2
        },
        intensity: 1.5,
        category: 'special',
        description: 'Insect interaction triggers natural defensive compounds enhancing flavor complexity'
    },
    'pile-fermented': {
        effects: {
            stabilizing: 3.0,
            grounding: 2.5,
            harmonizing: 3.0
        },
        intensity: 1.8,
        category: 'fermentation',
        description: 'Advanced fermentation that develops earthy, complex notes with grounding effects'
    },
    'rolled': {
        effects: {
            grounding: 2.0,
            harmonizing: 1.8
        },
        intensity: 1.0,
        category: 'shaping',
        description: 'Physical shaping method that concentrates flavors and aromas'
    },
    'compressed': {
        effects: {
            stabilizing: 2.5,
            grounding: 2.0
        },
        intensity: 1.3,
        category: 'shaping',
        description: 'Physical compression for aging and storage that concentrates characteristics'
    },

    // Advanced Processing Methods
    'quantum-processed': {
        effects: {
            focusing: 3.5, 
            grounding: 2.8
        },
        intensity: 2.3,
        category: 'advanced',
        description: 'Cutting-edge processing technique promoting mental clarity, balance, and holistic well-being'
    }
};

// Define significant processing methods for each season for easier lookup
export const significantSeasonalProcessing = {
    spring: ["shade-grown", "steamed", "minimal-processing", "sun-dried"],
    summer: ["shade-grown", "minimal-processing", "steamed"],
    fall: ["full-oxidation", "medium-roast", "heavy-roast", "aged"],
    winter: ["full-oxidation", "heavy-roast", "aged"]
};

export default processingInfluences;
