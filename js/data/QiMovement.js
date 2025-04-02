// data/QiMovement.js
// Qi Movement Patterns and their effects

export const qiMovementPatterns = {
  rising: {
    description: "Qi rises upward with a light, elevating quality",
    physical: "Creates a sensation of lightness and upward expansion",
    mental: "Promotes alertness, clarity, and uplifted mood",
    body: "Head, eyes, upper chest",
    ideal: "Morning, mental tasks, meditation, when feeling heavy or dull",
    // Added for QiTeaAnalyzer
    teaTypes: {
      "green": 2,
      "white": 1,
      "yellow": 1
    },
    flavors: {
      "floral": 2,
      "citrus": 2,
      "grassy": 1,
      "vegetal": 1
    },
    processing: {
      "steamed": 2,
      "shade-grown": 1
    }
  },
  
  descending: {
    description: "Qi moves downward with substantial, settling quality",
    physical: "Creates deepening, descending sensations",
    mental: "Promotes calm, introspection, and deep relaxation",
    body: "Abdomen, intestines, lower body",
    ideal: "Evening, relaxation, digestion, when feeling agitated or scattered",
    // Added for QiTeaAnalyzer
    teaTypes: {
      "puerh": 2,
      "black": 1
    },
    flavors: {
      "earthy": 2,
      "woody": 2,
      "malty": 1
    },
    processing: {
      "heavy-roast": 2,
      "fermented": 2,
      "aged": 1
    }
  },
  
  expanding: {
    description: "Qi spreads outward from the center in all directions",
    physical: "Creates a feeling of opening, widening, and spreading",
    mental: "Promotes openness, joy, and expansive awareness",
    body: "Chest, lungs, upper back",
    ideal: "Creative work, social situations, when feeling constricted or closed",
    // Added for QiTeaAnalyzer
    teaTypes: {
      "oolong": 2,
      "black": 1
    },
    flavors: {
      "floral": 2,
      "fruity": 2,
      "spicy": 1
    },
    processing: {
      "withered": 1,
      "oxidized": 2,
      "rolled": 1
    }
  },
  
  contracting: {
    description: "Qi creates focused, consolidating energy",
    physical: "Creates concentrated, centered sensations",
    mental: "Supports focus, discipline, and inner strength",
    body: "Core, center of body, spine",
    ideal: "Focused work, meditation, when needing discipline",
    // Added for QiTeaAnalyzer
    teaTypes: {
      "puerh": 1,
      "black": 1
    },
    flavors: {
      "bitter": 2,
      "astringent": 2,
      "mineral": 1
    },
    processing: {
      "roasted": 2,
      "sun-dried": 1,
      "compressed": 2
    }
  },
  
  balanced: {
    description: "Qi harmonizes and regulates energy throughout the body",
    physical: "Creates even, balanced sensation across different body regions",
    mental: "Supports emotional balance, integrated awareness, and centeredness",
    body: "Entire body with focus on the middle",
    ideal: "Transitional times, balancing activities, when feeling uneven or scattered",
    // Added for QiTeaAnalyzer
    teaTypes: {
      "oolong": 2,
      "yellow": 2,
      "white": 1
    },
    flavors: {
      "sweet": 1,
      "balanced": 2,
      "honey": 1
    },
    processing: {
      "light-roast": 1,
      "partial-oxidation": 2
    }
  },
  
  lifting: {
    description: "Qi rises upward with a light, elevating quality",
    physical: "Creates a sensation of lightness and upward expansion",
    mental: "Promotes alertness, clarity, and uplifted mood",
    body: "Head, eyes, upper chest",
    ideal: "Morning, mental tasks, meditation, when feeling heavy or dull"
  },
  
  clearing: {
    description: "Qi disperses cloudiness and obstructions in the upper body",
    physical: "Creates a sensation of spaciousness and clarity in the head",
    mental: "Supports mental clarity, sharp focus, and clear perception",
    body: "Head, sinuses, eyes, brain",
    ideal: "Mental work, study, when experiencing mental fog or congestion"
  },
  
  harmonizing: {
    description: "Qi balances and regulates energy throughout the body",
    physical: "Creates even, balanced sensation across different body regions",
    mental: "Supports emotional balance, integrated awareness, and centeredness",
    body: "Entire body with focus on the middle",
    ideal: "Transitional times, balancing activities, when feeling uneven or scattered"
  },
  
  warming: {
    description: "Qi generates heat and comfortable warming sensations",
    physical: "Creates warmth that spreads through specific regions",
    mental: "Promotes comfort, security, and nurturing feelings",
    body: "Stomach, chest, hands",
    ideal: "Cold weather, digestion, comfort, when feeling cold or depleted"
  },
  
  stimulating: {
    description: "Qi activates and energizes bodily systems",
    physical: "Creates sensations of activation, movement, and energy flow",
    mental: "Supports alertness, motivation, and engaged attention",
    body: "Entire body, especially circulation paths",
    ideal: "Morning, physical activity, when energy is needed"
  },
  
  anchoring: {
    description: "Qi settles and stabilizes energy in the lower body",
    physical: "Creates weighted, stable sensations in the lower regions",
    mental: "Promotes groundedness, stability, and pragmatic thinking",
    body: "Lower abdomen, legs, feet",
    ideal: "Anxiety, overthinking, when feeling ungrounded or scattered"
  },
  
  grounding: {
    description: "Qi creates deep connection to the body's center and to earth",
    physical: "Creates heavy, rooted sensations in the core and lower body",
    mental: "Supports deep stabilization, presence, and embodied awareness",
    body: "Lower abdomen, sacrum, feet",
    ideal: "Meditation, stress reduction, when feeling disconnected or anxious"
  },
  
  sinking: {
    description: "Qi moves downward with substantial, settling quality",
    physical: "Creates deepening, descending sensations",
    mental: "Promotes calm, introspection, and deep relaxation",
    body: "Abdomen, intestines, lower body",
    ideal: "Evening, relaxation, digestion, when feeling agitated or scattered"
  },
  
  penetrating: {
    description: "Qi moves deeply into tissues and energy pathways",
    physical: "Creates deep-reaching sensations that access inner layers",
    mental: "Promotes profound awareness, insight, and transformative experiences",
    body: "Deep tissues, bones, core energetic centers",
    ideal: "Deep meditation, healing work, when seeking depth or transformation"
  }
};

// Helper function to categorize qi movement based on direction
export const categorizeQiMovement = (direction) => {
  const upwardPatterns = ['lifting', 'clearing', 'rising'];
  const outwardPatterns = ['expanding', 'spreading', 'stimulating'];
  const centeringPatterns = ['harmonizing', 'balancing', 'centering'];
  const downwardPatterns = ['sinking', 'grounding', 'anchoring'];
  const deepPatterns = ['penetrating', 'deep'];
  
  if (upwardPatterns.some(pattern => direction.toLowerCase().includes(pattern))) {
    return 'upward';
  } else if (outwardPatterns.some(pattern => direction.toLowerCase().includes(pattern))) {
    return 'outward';
  } else if (centeringPatterns.some(pattern => direction.toLowerCase().includes(pattern))) {
    return 'centering';
  } else if (downwardPatterns.some(pattern => direction.toLowerCase().includes(pattern))) {
    return 'downward';
  } else if (deepPatterns.some(pattern => direction.toLowerCase().includes(pattern))) {
    return 'deep';
  }
  return 'mixed';
};

export default qiMovementPatterns; 