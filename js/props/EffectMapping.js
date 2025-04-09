/**
 * Effect Mapping Documentation
 * 
 * This file documents the core effects system and provides mappings
 * from old effect names to new consolidated effects.
 */

export const effectMapping = {
    // New Core Effects (8)
    "energizing": {
        replaces: ["awakening", "revitalizing"],
        description: "Provides mental and physical energy, alertness, and vitality",
        intensity: {
            min: 1,
            max: 10
        }
    },
    "calming": {
        replaces: ["peaceful", "soothing"],
        description: "Induces relaxation and reduces stress",
        intensity: {
            min: 1,
            max: 10
        }
    },
    "focusing": {
        replaces: ["clarifying"],
        description: "Enhances mental clarity and concentration",
        intensity: {
            min: 1,
            max: 10
        }
    },
    "harmonizing": {
        replaces: ["balancing"],
        description: "Creates equilibrium between opposing forces",
        intensity: {
            min: 1,
            max: 10
        }
    },
    "grounding": {
        replaces: ["centering", "stabilizing"],
        description: "Provides stability and connection to the present",
        intensity: {
            min: 1,
            max: 10
        }
    },
    "elevating": {
        replaces: ["uplifting"],
        description: "Elevates mood and spirit, creates transcendent experiences",
        intensity: {
            min: 1,
            max: 10
        }
    },
    "comforting": {
        replaces: ["nurturing"],
        description: "Provides warmth, security, and emotional support",
        intensity: {
            min: 1,
            max: 10
        }
    },
    "restorative": {
        replaces: ["restorative"],
        description: "Aids in recovery and renewal",
        intensity: {
            min: 1,
            max: 10
        }
    }
};

// Tea Type Effects
export const teaTypeEffects = {
    green: {
        description: "Green teas are known for their fresh, vegetal character and balanced effects.",
        effects: {
            energizing: 6,
            focusing: 6,
            harmonizing: 5,
            calming: 4,
            elevating: 3
        }
    },
    white: {
        description: "White teas are delicate and subtle, offering gentle effects.",
        effects: {
            calming: 7,
            harmonizing: 6,
            restorative: 5,
            focusing: 4,
            elevating: 3
        }
    },
    yellow: {
        description: "Yellow teas combine the freshness of green tea with the mellowness of oxidation.",
        effects: {
            harmonizing: 7,
            focusing: 6,
            elevating: 5,
            calming: 4
        }
    },
    oolong: {
        description: "Oolong teas offer a wide range of effects depending on oxidation level.",
        effects: {
            harmonizing: 7,
            focusing: 6,
            elevating: 5,
            comforting: 4
        }
    },
    black: {
        description: "Black teas are fully oxidized, offering robust and invigorating effects.",
        effects: {
            energizing: 7,
            focusing: 6,
            harmonizing: 5,
            grounding: 5
        }
    },
    'puerh-sheng': {
        description: "Raw puerh teas are known for their complex, evolving character.",
        effects: {
            energizing: 6,
            focusing: 6,
            harmonizing: 5,
            grounding: 5
        }
    },
    'puerh-shou': {
        description: "Ripened puerh teas offer deep, earthy flavors and grounding effects.",
        effects: {
            grounding: 8,
            harmonizing: 6,
            comforting: 6,
            restorative: 4
        }
    },
    dark: {
        description: "Dark teas are known for their rich, earthy character and grounding effects.",
        effects: {
            grounding: 8,
            harmonizing: 6,
            comforting: 6,
            restorative: 4
        }
    }
};

// Effect Interaction Rules
export const effectInteractionRules = {
    // Complementary effects
    complementary: {
        "energizing": ["focusing", "elevating"],
        "calming": ["grounding", "harmonizing", "restorative"],
        "focusing": ["energizing", "elevating", "grounding"],
        "harmonizing": ["calming", "grounding", "elevating"],
        "grounding": ["calming", "comforting", "focusing"],
        "elevating": ["energizing", "focusing", "harmonizing"],
        "comforting": ["grounding", "harmonizing", "restorative"],
        "restorative": ["calming", "comforting", "harmonizing"]
    },
    // Opposing effects
    opposing: {
        "energizing": ["calming", "comforting", "restorative"],
        "calming": ["energizing", "elevating"],
        "focusing": ["comforting"],
        "harmonizing": ["energizing"],
        "grounding": ["elevating"],
        "elevating": ["grounding", "calming"],
        "comforting": ["energizing", "focusing"],
        "restorative": ["energizing"]
    }
};

// Effect Name Substitution Methods
export const effectNameSubstitution = {
    /**
     * Convert old effect names to new core effects
     * @param {string|string[]} effects - Single effect name or array of effect names
     * @returns {string|string[]} - Converted effect name(s)
     */
    toNewEffects: (effects) => {
        if (Array.isArray(effects)) {
            return effects.map(effect => {
                for (const [newEffect, data] of Object.entries(effectMapping)) {
                    if (data.replaces.includes(effect)) {
                        return newEffect;
                    }
                }
                return effect; // Return original if no mapping found
            });
        }
        
        // Handle single effect
        for (const [newEffect, data] of Object.entries(effectMapping)) {
            if (data.replaces.includes(effects)) {
                return newEffect;
            }
        }
        return effects; // Return original if no mapping found
    },

    /**
     * Check if an effect name is an old effect that needs conversion
     * @param {string} effect - Effect name to check
     * @returns {boolean} - True if effect needs conversion
     */
    needsConversion: (effect) => {
        for (const data of Object.values(effectMapping)) {
            if (data.replaces.includes(effect)) {
                return true;
            }
        }
        return false;
    }
};

export default {
    effectMapping,
    teaTypeEffects,
    effectInteractionRules,
    effectNameSubstitution
}; 