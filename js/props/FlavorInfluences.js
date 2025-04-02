// flavorCorrelations.js
// Renamed from flavorMoodCorrelations.js with updated terminology

export const flavorInfluences = {
    floral: {
        white_floral: {
            effects: ['peaceful', 'balancing', 'soothing', 'restorative', 'renewing'],
            intensity: 2.5,
            flavors: ['jasmine', 'lilac', 'gardenia']
        },
        herbal_floral: {
            effects: ['peaceful', 'soothing', 'centering', 'balancing', 'restorative'],
            intensity: 2,
            flavors: ['chamomile', 'chrysanthemum', 'lavender', 'rose']
        },
        exotic_floral: {
            effects: ['elevating', 'awakening', 'clarifying', 'balancing', 'peaceful'],
            intensity: 1.9,
            flavors: ['orchid', 'ylang-ylang', 'lotus', 'magnolia']
        }
    },
    fruity: {
        stone_fruit: {
            effects: ['awakening', 'peaceful', 'balancing', 'elevating', 'renewing'],
            intensity: 1.8,
            flavors: ['peach', 'apricot', 'nectarine', 'plum']
        },
        citrus: {
            effects: ['revitalizing', 'awakening', 'elevating', 'clarifying', 'renewing'],
            intensity: 2,
            flavors: ['lemon', 'lime', 'orange', 'grapefruit', 'bergamot']
        },
        tropical: {
            effects: ['awakening', 'peaceful', 'elevating', 'renewing', 'restorative'],
            intensity: 1.7,
            flavors: ['pineapple', 'mango', 'passion fruit', 'lychee', 'coconut']
        },
        berry: {
            effects: ['peaceful', 'balancing', 'restorative', 'soothing', 'renewing'],
            intensity: 1.5,
            flavors: ['strawberry', 'raspberry', 'blackberry', 'blueberry']
        },
        tree_fruit: {
            effects: ['reflective', 'peaceful', 'stabilizing', 'centering', 'balancing'],
            intensity: 1.3,
            flavors: ['apple', 'pear', 'quince']
        },
        dried_fruit: {
            effects: ['comforting', 'nurturing', 'stabilizing', 'centering', 'reflective'],
            intensity: 1,
            flavors: ['raisin', 'fig', 'date']
        }
    },
    vegetal: {
        leafy: {
            effects: ['soothing', 'balancing', 'clarifying', 'restorative', 'peaceful'],
            intensity: 1.7,
            flavors: ['spinach', 'kale', 'lettuce', 'grass']
        },
        cruciferous: {
            effects: ['reflective', 'balancing', 'stabilizing', 'centering', 'clarifying'],
            intensity: 1.3,
            flavors: ['broccoli', 'cabbage', 'cauliflower']
        },
        herbaceous: {
            effects: ['soothing', 'awakening', 'clarifying', 'renewing', 'elevating'],
            intensity: 1.6,
            flavors: ['parsley', 'thyme', 'mint', 'sage', 'basil']
        }
    },
    nutty_and_toasty: {
        nuts: {
            effects: ['nurturing', 'comforting', 'centering', 'stabilizing', 'reflective'],
            intensity: 1.5,
            flavors: ['almond', 'hazelnut', 'walnut', 'chestnut', 'peanut']
        },
        toasted: {
            effects: ['nurturing', 'reflective', 'stabilizing', 'centering', 'comforting'],
            intensity: 1.3,
            flavors: ['bread', 'grain', 'barley', 'rice']
        }
    },
    spicy: {
        pungent: {
            effects: ['revitalizing', 'awakening', 'clarifying', 'elevating', 'renewing'],
            intensity: 1.6,
            flavors: ['pepper', 'ginger', 'cinnamon', 'clove', 'anise', 'licorice']
        },
        cooling: {
            effects: ['soothing', 'peaceful', 'renewing', 'balancing', 'restorative'],
            intensity: 1.4,
            flavors: ['menthol', 'camphor']
        }
    },
    sweet: {
        caramelized: {
            effects: ['comforting', 'nurturing', 'balancing', 'restorative', 'centering'],
            intensity: 1.7,
            flavors: ['honey', 'caramel', 'brown sugar', 'molasses']
        },
        vanilla: {
            effects: ['peaceful', 'soothing', 'restorative', 'balancing', 'renewing'],
            intensity: 1.5,
            flavors: ['vanilla']
        },
        chocolate: {
            effects: ['comforting', 'centering', 'stabilizing', 'reflective', 'nurturing'],
            intensity: 1.6,
            flavors: ['cocoa', 'dark chocolate']
        }
    },
    earthy: {
        soil: {
            effects: ['centering', 'stabilizing', 'reflective', 'balancing', 'restorative'],
            intensity: 1.8,
            flavors: ['petrichor', 'loam', 'forest floor']
        },
        minerals: {
            effects: ['reflective', 'clarifying', 'stabilizing'],
            intensity: 2.2,
            flavors: ['wet stone', 'flint', 'slate']
        },
        fungal: {
            effects: ['centering', 'reflective', 'stabilizing', 'restorative', 'balancing'],
            intensity: 1.4,
            flavors: ['truffle']
        },
        aged: {
            effects: ['centering', 'stabilizing', 'reflective', 'balancing'],
            intensity: 2.0,
            flavors: ['aged', 'forest floor', 'leather', 'autumn leaves']
        }
    },
    woody: {
        resinous: {
            effects: ['centering', 'stabilizing', 'reflective', 'clarifying', 'balancing'],
            intensity: 1.7,
            flavors: ['pine', 'cedar', 'sandalwood']
        },
        fresh: {
            effects: ['reflective', 'peaceful', 'renewing', 'clarifying', 'restorative'],
            intensity: 1.5,
            flavors: ['bamboo', 'oak', 'eucalyptus']
        }
    },
    roasted: {
        smoky: {
            effects: ['nurturing', 'centering', 'stabilizing', 'reflective', 'comforting'],
            intensity: 1.2,
            flavors: ['bonfire', 'tobacco', 'burnt']
        },
        nutty: {
            effects: ['nurturing', 'comforting', 'stabilizing', 'centering', 'balancing'],
            intensity: 1,
            flavors: ['roasted nuts', 'coffee']
        }
    },
    aged: {
        fermented: {
            effects: ['centering', 'reflective', 'stabilizing', 'restorative', 'balancing'],
            intensity: 1.5,
            flavors: ['leather', 'compost', 'autumn leaves']
        },
        oxidized: {
            effects: ['reflective', 'stabilizing', 'centering', 'clarifying', 'balancing'],
            intensity: 1.3,
            flavors: ['dried leaves', 'prune']
        }
    },
    umami: {
        marine: {
            effects: ['clarifying', 'soothing', 'restorative', 'balancing', 'peaceful'],
            intensity: 2.4,
            flavors: ['seaweed', 'kombu', 'dashi']
        },
        savory: {
            effects: ['soothing', 'reflective', 'restorative', 'balancing', 'stabilizing'],
            intensity: 1.8,
            flavors: ['broth', 'meat', 'mushroom']
        }
    },
    chemical: {
        off_flavors: {
            effects: [],
            intensity: 0,
            flavors: ['metallic', 'sulfurous', 'medicinal']
        }
    },
    sour: {
        acidic: {
            effects: ['awakening', 'clarifying', 'renewing', 'elevating'],
            intensity: 0.5,
            flavors: ['sour', 'tart', 'acidic']
        }
    }
};

export default flavorInfluences;
