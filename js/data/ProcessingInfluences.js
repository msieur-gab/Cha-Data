// processingInfluences.js
// Renamed from processingMethodMoodAlignment.js with updated terminology

export const processingInfluences = {
    // Heat Treatment Methods
    'steamed': {
        effects: [
            'soothing', 
            'balancing', 
            'peaceful', 
            'clarifying', 
            'restorative', 
            'renewing'
        ],
        intensity: 1.9,
        category: 'heat',
        description: 'Gentle heat preservation that maintains delicate compounds and promotes mental clarity'
    },
    'pan-fired': {
        effects: [
            'awakening', 
            'revitalizing', 
            'reflective', 
            'clarifying', 
            'elevating', 
            'renewing'
        ],
        intensity: 1.2,
        category: 'heat',
        description: 'Light toasting method that adds complexity, stimulation, and mental alertness'
    },
    'light-roast': {
        effects: [
            'peaceful', 
            'reflective', 
            'nurturing', 
            'balancing', 
            'restorative'
        ],
        intensity: 1.0,
        category: 'heat',
        description: 'Subtle roasting that enhances flavor subtleties and promotes gentle mental exploration'
    },
    'medium-roast': {
        effects: [
            'nurturing', 
            'comforting', 
            'revitalizing', 
            'stabilizing', 
            'balancing'
        ],
        intensity: 1.5,
        category: 'heat',
        description: 'Balanced roasting that develops rich, complex notes and provides centered energy'
    },
    'heavy-roast': {
        effects: [
            'centering', 
            'nurturing', 
            'stabilizing', 
            'reflective', 
            'comforting'
        ],
        intensity: 1.8,
        category: 'heat',
        description: 'Intense roasting creating deep, transformative flavors and profound introspection'
    },
    'charcoal-roasted': {
        effects: [
            'stabilizing', 
            'nurturing', 
            'centering', 
            'reflective', 
            'balancing'
        ],
        intensity: 2.2,
        category: 'heat',
        description: 'Traditional roasting method with profound depth, promoting deep connection and inner stability'
    },
    // Sun Processing Methods
    'sun-dried': {
        effects: [
            'peaceful',
            'renewing',
            'balancing',
            'reflective',
            'restorative'
        ],
        intensity: 1.6,
        category: 'drying',
        description: 'Natural drying process that preserves delicate characteristics while adding subtle complexity and brightness'
    },

    // Oxidation Methods
    'withered': {
        effects: [
            'peaceful', 
            'balancing', 
            'reflective', 
            'restorative', 
            'renewing'
        ],
        intensity: 1.2,
        category: 'oxidation',
        description: 'Initial processing that preserves natural essence and promotes gentle mental clarity'
    },
    'oxidised': {
        effects: [
            'revitalizing', 
            'nurturing', 
            'awakening', 
            'clarifying', 
            'elevating'
        ],
        intensity: 1.5,
        category: 'oxidation',
        description: 'Increases complexity, develops bold characteristics, and stimulates mental energy'
    },
    'partial-oxidation': {
        effects: [
            'balancing', 
            'reflective', 
            'peaceful', 
            'restorative', 
            'renewing'
        ],
        intensity: 1.3,
        category: 'oxidation',
        description: 'Balanced approach maintaining nuanced flavors and promoting mental equilibrium'
    },
    'full-oxidation': {
        effects: [
            'revitalizing', 
            'nurturing', 
            'comforting', 
            'stabilizing', 
            'balancing'
        ],
        intensity: 1.7,
        category: 'oxidation',
        description: 'Complete transformation of leaf characteristics, creating robust and centering experiences'
    },
    'kill-green': {
        effects: [
            'soothing', 
            'balancing', 
            'clarifying', 
            'restorative', 
            'peaceful'
        ],
        intensity: 1.4,
        category: 'oxidation',
        description: 'Halts enzymatic processes, preserving delicate compounds and promoting mental clarity'
    },

    // Growing and Processing Methods
    'shade-grown': {
        effects: [
            'soothing', 
            'centering', 
            'balancing', 
            'restorative', 
            'clarifying'
        ],
        intensity: 2.5,
        category: 'growing',
        description: 'Increases amino acids and L-theanine content, promoting deep mental stillness'
    },
    'minimal-processing': {
        effects: [
            'peaceful', 
            'balancing', 
            'reflective', 
            'restorative', 
            'renewing'
        ],
        intensity: 2.0,
        category: 'processing',
        description: 'Preserves the most natural tea characteristics with holistic, gentle approach'
    },
    'gaba-processed': {
        effects: [
            'soothing', 
            'centering', 
            'balancing', 
            'restorative', 
            'stabilizing'
        ],
        intensity: 2.5,
        category: 'special',
        description: 'Specifically designed to enhance relaxation and holistic well-being compounds'
    },

    // Scenting and Special Methods
    'jasmine-scented': {
        effects: [
            'peaceful', 
            'soothing', 
            'balancing', 
            'restorative', 
            'renewing'
        ],
        intensity: 1.6,
        category: 'scenting',
        description: 'Delicate floral notes enhance relaxation and promote gentle emotional balance'
    },
    'rose-scented': {
        effects: [
            'peaceful', 
            'balancing', 
            'reflective', 
            'restorative', 
            'soothing'
        ],
        intensity: 1.5,
        category: 'scenting',
        description: 'Soft, romantic aromatics promote tranquility and inner peace'
    },
    'osmanthus-scented': {
        effects: [
            'peaceful', 
            'balancing', 
            'soothing', 
            'restorative', 
            'renewing'
        ],
        intensity: 1.4,
        category: 'scenting',
        description: 'Sweet, subtle floral notes create balance and gentle emotional lift'
    },

    // Aging and Fermentation
    'aged': {
        effects: [
            'centering', 
            'reflective', 
            'stabilizing', 
            'balancing', 
            'restorative'
        ],
        intensity: 1.7,
        category: 'aging',
        description: 'Develops complex, refined characteristics through patient transformation'
    },
    'fermented': {
        effects: [
            'centering', 
            'stabilizing', 
            'comforting', 
            'reflective', 
            'balancing'
        ],
        intensity: 1.5,
        category: 'fermentation',
        description: 'Transforms tea through controlled microbial processes, creating depth and complexity'
    },

    // Special Processing Methods
    'bug-bitten': {
        effects: [
            'awakening', 
            'peaceful', 
            'balancing', 
            'elevating', 
            'renewing'
        ],
        intensity: 1.3,
        category: 'special',
        description: 'Unique processing creating honey-like complexity and subtle energetic lift'
    },
    'frost-withered': {
        effects: [
            'reflective', 
            'peaceful', 
            'balancing', 
            'restorative', 
            'renewing'
        ],
        intensity: 1.2,
        category: 'special',
        description: 'Cold-induced processing creates unique flavor profiles with introspective qualities'
    },

    // Advanced Processing Methods
    'quantum-processed': {
        effects: [
            'clarifying', 
            'reflective', 
            'centering', 
            'balancing', 
            'restorative'
        ],
        intensity: 2.3,
        category: 'advanced',
        description: 'Cutting-edge processing technique promoting mental clarity, balance, and holistic well-being'
    }
};

export default processingInfluences;
