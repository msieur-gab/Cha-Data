// FlavorInfluences.js
// Defines the influences of various tea flavors on mental and physical effects

export const flavorInfluences = {
    // Floral flavors generally elevate mood and promote relaxation
    floral: {
        jasmine: {
            effects: { calming: 8, elevating: 9, clarifying: 6 },
            intensity: 8,
            associatedFlavors: ["sweet", "perfumed", "honey"]
        },
        rose: {
            effects: { calming: 7, elevating: 9, nurturing: 6 },
            intensity: 7,
            associatedFlavors: ["sweet", "perfumed", "honey"]
        },
        orchid: {
            effects: { elevating: 8, clarifying: 6, focusing: 5 },
            intensity: 7,
            associatedFlavors: ["sweet", "perfumed", "honey", "creamy"]
        },
        lilac: {
            effects: { elevating: 9, clarifying: 5, focusing: 4 },
            intensity: 7,
            associatedFlavors: ["sweet", "perfumed", "spring-like"]
        },
        osmanthus: {
            effects: { elevating: 8, harmonizing: 6, nurturing: 5 },
            intensity: 7,
            associatedFlavors: ["apricot", "sweet", "honey"]
        },
        elderflower: {
            effects: { elevating: 7, clarifying: 5, focusing: 5 },
            intensity: 6,
            associatedFlavors: ["sweet", "delicate", "honey"]
        },
        honeysuckle: {
            effects: { elevating: 8, calming: 2.0, focusing: 4 },
            intensity: 7,
            associatedFlavors: ["sweet", "nectar", "floral"]
        }
    },

    // Fruity flavors tend to elevate mood and increase energy
    fruity: {
        apple: {
            effects: { energizing: 5, elevating: 7, harmonizing: 5 },
            intensity: 5,
            associatedFlavors: ["sweet", "crisp", "light"]
        },
        pear: {
            effects: { nurturing: 6, harmonizing: 7, elevating: 6 },
            intensity: 5,
            associatedFlavors: ["sweet", "juicy", "delicate"]
        },
        peach: {
            effects: { elevating: 8, nurturing: 6, energizing: 5 },
            intensity: 7,
            associatedFlavors: ["sweet", "juicy", "honey"]
        },
        apricot: {
            effects: { elevating: 8, energizing: 6, harmonizing: 5 },
            intensity: 7,
            associatedFlavors: ["sweet", "tangy", "bright"]
        },
        citrus: {
            effects: { energizing: 8, elevating: 7, focusing: 6 },
            intensity: 7,
            associatedFlavors: ["bright", "tangy", "zesty"]
        },
        berry: {
            effects: { energizing: 7, elevating: 6, grounding: 4 },
            intensity: 6,
            associatedFlavors: ["sweet", "tangy", "bright"]
        },
        tropical: {
            effects: { energizing: 8, elevating: 7, focusing: 5 },
            intensity: 7,
            associatedFlavors: ["sweet", "exotic", "bright"]
        },
        stone_fruit: {
            effects: { elevating: 7, harmonizing: 6, nurturing: 5 },
            intensity: 6,
            associatedFlavors: ["sweet", "juicy", "smooth"]
        }
    },

    // Vegetal flavors tend to promote focus and clarity
    vegetal: {
        leafy: {
            effects: {
                calming: 2.0,            // Was 'soothing'
                harmonizing: 2.0,        // Was 'balancing'
                focusing: 2.0,           // Was 'clarifying'
                restorative: 2.0,
                elevating: 1.0           // Added elevating effect
            },
            intensity: 1.7,
            flavors: ['spinach', 'kale', 'lettuce', 'grass']
        },
        cruciferous: {
            effects: {
                grounding: 2.0,          // Was 'reflective'
                harmonizing: 2.0,        // Was 'balancing'
                grounding: 2.0,          // Was 'stabilizing'
                focusing: 1.5            // Was 'clarifying'
            },
            intensity: 1.3,
            flavors: ['broccoli', 'cabbage', 'cauliflower']
        },
        herbaceous: {
            effects: {
                calming: 2.0,            // Was 'soothing'
                energizing: 1.5,         // Was 'awakening'
                focusing: 2.0,           // Was 'clarifying'
                restorative: 1.5,        // Was 'renewing'
                elevating: 2.0           // Boosted from previous
            },
            intensity: 1.6,
            flavors: ['parsley', 'thyme', 'mint', 'sage', 'basil']
        }
    },

    // Nutty and toasty flavors tend to provide grounding and comfort
    nutty_and_toasty: {
        nuts: {
            effects: {
                comforting: 3.0,         // Was 'nurturing', boosted
                grounding: 2.5,          // Was 'centering'/'stabilizing', boosted
                harmonizing: 1.5         // Was part of 'reflective'
            },
            intensity: 1.5,
            flavors: ['almond', 'hazelnut', 'walnut', 'chestnut', 'peanut']
        },
        toasted: {
            effects: {
                comforting: 3.0,         // Was 'nurturing', boosted
                grounding: 2.5,          // Was 'reflective'/'stabilizing', boosted
                harmonizing: 1.5,        // Was part of 'centering'
                restorative: 1.0         // Added restorative
            },
            intensity: 1.3,
            flavors: ['bread', 'grain', 'barley', 'rice']
        }
    },

    // Spicy flavors tend to energize and stimulate
    spicy: {
        pungent: {
            effects: {
                energizing: 2.0,         // Was 'revitalizing', decreased
                focusing: 1.5,           // Was 'clarifying'
                elevating: 2.5,          // Was 'elevating', boosted
                restorative: 1.5         // Was 'renewing'
            },
            intensity: 1.6,
            flavors: ['pepper', 'ginger', 'cinnamon', 'clove', 'anise', 'licorice']
        },
        cooling: {
            effects: {
                calming: 2.5,            // Was 'soothing'/'peaceful'
                restorative: 2.0,        // Was 'renewing'
                harmonizing: 1.5,        // Was 'balancing'
                elevating: 1.0           // Added elevating
            },
            intensity: 1.4,
            flavors: ['menthol', 'camphor']
        }
    },

    // Sweet flavors tend to provide comfort and nurturing effects
    sweet: {
        caramelized: {
            effects: {
                comforting: 3.0,         // Was 'comforting', boosted
                harmonizing: 2.0,        // Was 'balancing'
                restorative: 2.0,
                grounding: 2.0           // Was 'centering'
            },
            intensity: 1.7,
            flavors: ['honey', 'caramel', 'brown sugar', 'molasses']
        },
        vanilla: {
            effects: {
                calming: 2.5,            // Was 'peaceful'
                restorative: 2.0,
                harmonizing: 1.5,        // Was 'balancing'
                comforting: 2.0          // Added comforting
            },
            intensity: 1.5,
            flavors: ['vanilla']
        },
        chocolate: {
            effects: {
                comforting: 3.0,         // Boosted
                grounding: 2.5,          // Was 'centering'/'stabilizing'
                harmonizing: 1.5         // Was 'reflective'
            },
            intensity: 1.6,
            flavors: ['cocoa', 'dark chocolate']
        },
        malt: {
            effects: { nurturing: 7, grounding: 6, comforting: 5 },
            intensity: 6,
            associatedFlavors: ["sweet", "cereal", "warm"]
        }
    },

    // Earthy flavors tend to provide grounding and centering effects
    earthy: {
        soil: {
            effects: {
                grounding: 3.0,          // Was 'centering', boosted
                harmonizing: 2.0,        // Was 'balancing'
                restorative: 2.0
            },
            intensity: 1.8,
            flavors: ['petrichor', 'loam', 'forest floor']
        },
        minerals: {
            effects: {
                grounding: 2.5,          // Was 'reflective', boosted
                focusing: 2.0,           // Was 'clarifying'
                harmonizing: 1.5         // Was 'stabilizing'
            },
            intensity: 2.2,
            flavors: ['wet stone', 'flint', 'slate']
        },
        fungal: {
            effects: {
                grounding: 2.8,          // Was 'centering', boosted
                restorative: 2.0,
                harmonizing: 1.5         // Was 'balancing'
            },
            intensity: 1.4,
            flavors: ['truffle']
        },
        aged: {
            effects: {
                grounding: 3.0,          // Was 'centering', boosted
                harmonizing: 2.0,        // Was 'balancing'
                comforting: 2.0          // Added comforting
            },
            intensity: 2.0,
            flavors: ['aged', 'forest floor', 'leather', 'autumn leaves']
        }
    },

    // Woody flavors tend to center and ground
    woody: {
        oak: {
            effects: { grounding: 7, centering: 6, comforting: 5 },
            intensity: 6,
            associatedFlavors: ["tannic", "dry", "smooth"]
        },
        pine: {
            effects: { clarifying: 8, energizing: 7, focusing: 6 },
            intensity: 7,
            associatedFlavors: ["fresh", "resinous", "green"]
        },
        cedar: {
            effects: { centering: 7, clarifying: 6, grounding: 5 },
            intensity: 6,
            associatedFlavors: ["aromatic", "clean", "dry"]
        },
        bamboo: {
            effects: { clarifying: 6, focusing: 5, harmonizing: 5 },
            intensity: 5,
            associatedFlavors: ["green", "fresh", "clean"]
        },
        sandalwood: {
            effects: { calming: 7, centering: 6, grounding: 5 },
            intensity: 6,
            associatedFlavors: ["aromatic", "sweet", "warm"]
        },
        resinous: {
            effects: {
                grounding: 3.0,          // Was 'centering'/'stabilizing', boosted
                focusing: 2.0,           // Was 'clarifying'
                harmonizing: 1.5         // Was 'balancing'
            },
            intensity: 1.7,
            flavors: ['pine', 'cedar', 'sandalwood']
        },
        fresh: {
            effects: {
                grounding: 2.0,          // Was 'reflective'
                calming: 2.0,            // Was 'peaceful'
                restorative: 2.0,        // Was 'renewing'
                focusing: 1.5            // Was 'clarifying'
            },
            intensity: 1.5,
            flavors: ['bamboo', 'oak', 'eucalyptus']
        }
    },

    // Roasted flavors tend to provide comfort and grounding
    roasted: {
        smoky: {
            effects: {
                comforting: 3.0,         // Was 'nurturing', boosted
                grounding: 2.5,          // Was 'centering'/'stabilizing', boosted
                harmonizing: 1.0         // Was 'reflective'
            },
            intensity: 1.2,
            flavors: ['bonfire', 'tobacco', 'burnt']
        },
        nutty: {
            effects: {
                comforting: 3.0,         // Was 'nurturing', boosted
                grounding: 2.5,          // Was 'centering'/'stabilizing', boosted
                harmonizing: 1.5         // Was 'balancing'
            },
            intensity: 1,
            flavors: ['roasted nuts', 'coffee']
        },
        toasted_rice: {
            effects: { comforting: 7, nurturing: 6, calming: 5 },
            intensity: 5,
            associatedFlavors: ["grainy", "warm", "sweet"]
        }
    },

    // Aged flavors tend to provide depth and complexity
    aged: {
        fermented: {
            effects: {
                grounding: 3.0,          // Was 'centering', boosted
                harmonizing: 2.0,        // Was 'balancing'
                restorative: 2.0,
                comforting: 2.0          // Added comforting
            },
            intensity: 1.5,
            flavors: ['leather', 'compost', 'autumn leaves']
        },
        oxidized: {
            effects: {
                grounding: 2.5,          // Was 'centering'/'stabilizing', boosted
                focusing: 1.5,           // Was 'clarifying'
                harmonizing: 1.5         // Was 'balancing'
            },
            intensity: 1.3,
            flavors: ['dried leaves', 'prune']
        }
    },

    // Umami flavors tend to provide satisfaction and nourishment
    umami: {
        marine: {
            effects: {
                focusing: 2.5,           // Was 'clarifying', boosted
                calming: 2.0,            // Was 'soothing'
                restorative: 2.0,
                harmonizing: 1.5         // Was 'balancing'
            },
            intensity: 2.4,
            flavors: ['seaweed', 'kombu', 'dashi']
        },
        savory: {
            effects: {
                calming: 2.0,            // Was 'soothing'
                grounding: 2.0,          // Was 'reflective'
                restorative: 2.0,
                harmonizing: 1.5         // Was 'balancing'
            },
            intensity: 1.8,
            flavors: ['broth', 'meat', 'mushroom']
        }
    },

    // Chemical or medicinal flavors - more challenging
    chemical: {
        off_flavors: {
            effects: {},
            intensity: 0,
            flavors: ['metallic', 'sulfurous', 'medicinal']
        }
    },

    // Sour flavors tend to be energizing and stimulating
    sour: {
        acidic: {
            effects: {
                energizing: 2.0,         // Was 'awakening'
                focusing: 1.5,           // Was 'clarifying'
                restorative: 1.0,        // Was 'renewing'
                elevating: 1.5           // Was 'elevating'
            },
            intensity: 0.5,
            flavors: ['sour', 'tart', 'acidic']
        }
    }
};

// Map flavor categories to their primary effects
export const flavorCategoryToPrimaryEffects = {
    floral: ["elevating", "calming"],
    fruity: ["elevating", "energizing"],
    vegetal: ["clarifying", "focusing"],
    nutty_and_toasty: ["grounding", "comforting"],
    spicy: ["energizing", "warming"],
    sweet: ["comforting", "nurturing"],
    earthy: ["grounding", "centering"],
    woody: ["grounding", "centering"],
    roasted: ["grounding", "energizing"],
    aged: ["centering", "grounding"],
    umami: ["nurturing", "grounding"],
    chemical: ["clarifying", "focusing"],
    sour: ["energizing", "clarifying"]
};

// Map individual flavor notes to their primary effects
export const flavorToPrimaryEffects = {};

// Populate the flavorToPrimaryEffects mapping
Object.entries(flavorInfluences).forEach(([category, flavors]) => {
    Object.entries(flavors).forEach(([flavor, data]) => {
        // Get top 2 effects by intensity
        const sortedEffects = Object.entries(data.effects)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2)
            .map(([effect]) => effect);
        
        flavorToPrimaryEffects[flavor] = sortedEffects;
    });
});

export default {
    flavorInfluences,
    flavorCategoryToPrimaryEffects,
    flavorToPrimaryEffects
}; 