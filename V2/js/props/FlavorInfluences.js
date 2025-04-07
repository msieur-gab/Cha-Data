// FlavorInfluences.js
// Defines the influences of various tea flavors on mental and physical effects

export const flavorInfluences = {
    // Floral flavors generally elevate mood and promote relaxation
    floral: {
        jasmine: {
            effects: { calming: 8, elevating: 7, clarifying: 6 },
            intensity: 8,
            associatedFlavors: ["sweet", "perfumed", "honey"]
        },
        rose: {
            effects: { calming: 7, elevating: 8, nurturing: 6 },
            intensity: 7,
            associatedFlavors: ["sweet", "perfumed", "honey"]
        },
        orchid: {
            effects: { elevating: 7, clarifying: 6, focusing: 5 },
            intensity: 6,
            associatedFlavors: ["sweet", "perfumed", "honey", "creamy"]
        },
        lilac: {
            effects: { elevating: 8, clarifying: 5, focusing: 4 },
            intensity: 6,
            associatedFlavors: ["sweet", "perfumed", "spring-like"]
        },
        osmanthus: {
            effects: { elevating: 7, harmonizing: 6, nurturing: 5 },
            intensity: 6,
            associatedFlavors: ["apricot", "sweet", "honey"]
        },
        elderflower: {
            effects: { elevating: 6, clarifying: 5, focusing: 5 },
            intensity: 5,
            associatedFlavors: ["sweet", "delicate", "honey"]
        }
    },

    // Fruity flavors tend to elevate mood and increase energy
    fruity: {
        apple: {
            effects: { energizing: 5, elevating: 6, harmonizing: 5 },
            intensity: 5,
            associatedFlavors: ["sweet", "crisp", "light"]
        },
        pear: {
            effects: { nurturing: 6, harmonizing: 7, calming: 5 },
            intensity: 5,
            associatedFlavors: ["sweet", "juicy", "delicate"]
        },
        peach: {
            effects: { elevating: 7, nurturing: 6, energizing: 5 },
            intensity: 6,
            associatedFlavors: ["sweet", "juicy", "honey"]
        },
        apricot: {
            effects: { elevating: 7, energizing: 6, harmonizing: 5 },
            intensity: 6,
            associatedFlavors: ["sweet", "tangy", "bright"]
        },
        citrus: {
            effects: { energizing: 8, clarifying: 7, focusing: 6 },
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
        grassy: {
            effects: { clarifying: 7, energizing: 6, focusing: 7 },
            intensity: 7,
            associatedFlavors: ["fresh", "green", "bright"]
        },
        spinach: {
            effects: { grounding: 6, clarifying: 5, focusing: 6 },
            intensity: 6,
            associatedFlavors: ["green", "mineral", "hearty"]
        },
        asparagus: {
            effects: { clarifying: 6, focusing: 7, energizing: 5 },
            intensity: 6,
            associatedFlavors: ["green", "bright", "fresh"]
        },
        artichoke: {
            effects: { grounding: 7, clarifying: 6, focusing: 5 },
            intensity: 5,
            associatedFlavors: ["vegetal", "nutty", "smooth"]
        },
        seaweed: {
            effects: { grounding: 8, clarifying: 6, nurturing: 7 },
            intensity: 7,
            associatedFlavors: ["marine", "umami", "mineral"]
        },
        green_beans: {
            effects: { focusing: 6, clarifying: 5, energizing: 5 },
            intensity: 5,
            associatedFlavors: ["green", "fresh", "sweet"]
        }
    },

    // Nutty and toasty flavors tend to provide grounding and comfort
    nuttyToasty: {
        almond: {
            effects: { grounding: 7, comforting: 6, nurturing: 5 },
            intensity: 6,
            associatedFlavors: ["sweet", "toasty", "smooth"]
        },
        walnut: {
            effects: { grounding: 8, focusing: 5, comforting: 5 },
            intensity: 7,
            associatedFlavors: ["woody", "earthy", "dry"]
        },
        chestnut: {
            effects: { nurturing: 7, grounding: 6, comforting: 6 },
            intensity: 6,
            associatedFlavors: ["sweet", "roasted", "smooth"]
        },
        hazelnut: {
            effects: { comforting: 7, nurturing: 6, harmonizing: 5 },
            intensity: 6,
            associatedFlavors: ["sweet", "creamy", "warm"]
        },
        toast: {
            effects: { grounding: 6, comforting: 7, nurturing: 5 },
            intensity: 6,
            associatedFlavors: ["warm", "cereal", "roasted"]
        },
        grain: {
            effects: { grounding: 7, nurturing: 6, harmonizing: 5 },
            intensity: 5,
            associatedFlavors: ["cereal", "smooth", "light"]
        }
    },

    // Spicy flavors tend to energize and stimulate
    spicy: {
        cinnamon: {
            effects: { energizing: 8, warming: 7, focusing: 6 },
            intensity: 7,
            associatedFlavors: ["sweet", "warm", "woody"]
        },
        ginger: {
            effects: { energizing: 8, clarifying: 7, warming: 8 },
            intensity: 8,
            associatedFlavors: ["spicy", "bright", "fresh"]
        },
        cardamom: {
            effects: { clarifying: 7, focusing: 6, energizing: 5 },
            intensity: 6,
            associatedFlavors: ["aromatic", "cool", "sweet"]
        },
        clove: {
            effects: { warming: 8, grounding: 7, focusing: 5 },
            intensity: 7,
            associatedFlavors: ["intense", "sweet", "woody"]
        },
        pepper: {
            effects: { energizing: 8, warming: 7, clarifying: 6 },
            intensity: 7,
            associatedFlavors: ["spicy", "sharp", "aromatic"]
        },
        anise: {
            effects: { clarifying: 7, focusing: 6, warming: 5 },
            intensity: 6,
            associatedFlavors: ["sweet", "licorice", "cooling"]
        }
    },

    // Sweet flavors tend to provide comfort and nurturing effects
    sweet: {
        honey: {
            effects: { nurturing: 8, comforting: 7, harmonizing: 6 },
            intensity: 7,
            associatedFlavors: ["sweet", "floral", "warm"]
        },
        caramel: {
            effects: { comforting: 8, nurturing: 7, grounding: 6 },
            intensity: 7,
            associatedFlavors: ["sweet", "rich", "toasty"]
        },
        toffee: {
            effects: { comforting: 8, grounding: 7, nurturing: 6 },
            intensity: 8,
            associatedFlavors: ["sweet", "rich", "buttery"]
        },
        chocolate: {
            effects: { comforting: 8, grounding: 7, nurturing: 6 },
            intensity: 7,
            associatedFlavors: ["rich", "dark", "earthy"]
        },
        vanilla: {
            effects: { calming: 7, comforting: 8, nurturing: 6 },
            intensity: 6,
            associatedFlavors: ["sweet", "creamy", "warm"]
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
            effects: { grounding: 9, centering: 7, comforting: 5 },
            intensity: 7,
            associatedFlavors: ["mineral", "damp", "rich"]
        },
        mushroom: {
            effects: { grounding: 8, nurturing: 6, comforting: 5 },
            intensity: 6,
            associatedFlavors: ["umami", "savory", "rich"]
        },
        moss: {
            effects: { grounding: 7, clarifying: 5, calming: 6 },
            intensity: 5,
            associatedFlavors: ["green", "damp", "fresh"]
        },
        forest_floor: {
            effects: { grounding: 8, centering: 7, calming: 6 },
            intensity: 7,
            associatedFlavors: ["complex", "deep", "rich"]
        },
        petrichor: {
            effects: { calming: 7, clarifying: 6, grounding: 5 },
            intensity: 6,
            associatedFlavors: ["mineral", "fresh", "damp"]
        },
        peat: {
            effects: { grounding: 8, centering: 7, comforting: 5 },
            intensity: 7,
            associatedFlavors: ["smoky", "damp", "rich"]
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
        }
    },

    // Roasted flavors tend to provide comfort and grounding
    roasted: {
        char: {
            effects: { grounding: 8, focusing: 6, energizing: 5 },
            intensity: 7,
            associatedFlavors: ["smoky", "dark", "bitter"]
        },
        coffee: {
            effects: { energizing: 8, focusing: 7, clarifying: 6 },
            intensity: 8,
            associatedFlavors: ["bitter", "dark", "rich"]
        },
        burnt_sugar: {
            effects: { comforting: 7, grounding: 6, nurturing: 5 },
            intensity: 7,
            associatedFlavors: ["sweet", "dark", "rich"]
        },
        charcoal: {
            effects: { grounding: 8, centering: 6, focusing: 5 },
            intensity: 7,
            associatedFlavors: ["smoky", "mineral", "dry"]
        },
        toasted_rice: {
            effects: { comforting: 7, nurturing: 6, calming: 5 },
            intensity: 5,
            associatedFlavors: ["grainy", "warm", "sweet"]
        }
    },

    // Aged flavors tend to provide depth and complexity
    aged: {
        leather: {
            effects: { grounding: 7, centering: 6, focusing: 5 },
            intensity: 6,
            associatedFlavors: ["earthy", "tannic", "rich"]
        },
        wood_varnish: {
            effects: { grounding: 6, focusing: 5, centering: 5 },
            intensity: 5,
            associatedFlavors: ["woody", "sharp", "complex"]
        },
        autumn_leaves: {
            effects: { centering: 7, calming: 6, grounding: 5 },
            intensity: 6,
            associatedFlavors: ["earthy", "woody", "sweet"]
        },
        old_books: {
            effects: { centering: 7, focusing: 6, calming: 5 },
            intensity: 5,
            associatedFlavors: ["paper", "dusty", "sweet"]
        },
        cellar: {
            effects: { grounding: 7, centering: 6, comforting: 5 },
            intensity: 6,
            associatedFlavors: ["earthy", "damp", "mineral"]
        }
    },

    // Umami flavors tend to provide satisfaction and nourishment
    umami: {
        brothy: {
            effects: { nurturing: 8, grounding: 7, comforting: 6 },
            intensity: 7,
            associatedFlavors: ["savory", "rich", "smooth"]
        },
        meaty: {
            effects: { grounding: 8, energizing: 6, centering: 5 },
            intensity: 7,
            associatedFlavors: ["savory", "rich", "satisfying"]
        },
        savory: {
            effects: { nurturing: 7, grounding: 6, comforting: 5 },
            intensity: 6,
            associatedFlavors: ["rich", "complex", "satisfying"]
        },
        miso: {
            effects: { nurturing: 8, grounding: 7, harmonizing: 6 },
            intensity: 7,
            associatedFlavors: ["salty", "fermented", "rich"]
        }
    },

    // Chemical or medicinal flavors - more challenging
    chemical: {
        menthol: {
            effects: { clarifying: 8, energizing: 7, focusing: 6 },
            intensity: 7,
            associatedFlavors: ["cooling", "sharp", "fresh"]
        },
        camphor: {
            effects: { clarifying: 8, energizing: 6, focusing: 7 },
            intensity: 7,
            associatedFlavors: ["medicinal", "cooling", "sharp"]
        },
        pharmaceutical: {
            effects: { focusing: 6, clarifying: 5, centering: 4 },
            intensity: 5,
            associatedFlavors: ["bitter", "sharp", "clean"]
        },
        petroleum: {
            effects: { grounding: 5, centering: 4, focusing: 4 },
            intensity: 5,
            associatedFlavors: ["mineral", "sharp", "industrial"]
        }
    },

    // Sour flavors tend to be energizing and stimulating
    sour: {
        tart: {
            effects: { energizing: 7, clarifying: 6, focusing: 5 },
            intensity: 6,
            associatedFlavors: ["bright", "fruity", "sharp"]
        },
        vinegar: {
            effects: { clarifying: 7, focusing: 6, energizing: 5 },
            intensity: 6,
            associatedFlavors: ["sharp", "sour", "pungent"]
        },
        fermented: {
            effects: { grounding: 6, clarifying: 5, energizing: 5 },
            intensity: 5,
            associatedFlavors: ["complex", "tart", "funky"]
        }
    }
};

// Map flavor categories to their primary effects
export const flavorCategoryToPrimaryEffects = {
    floral: ["elevating", "calming"],
    fruity: ["elevating", "energizing"],
    vegetal: ["clarifying", "focusing"],
    nuttyToasty: ["grounding", "comforting"],
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