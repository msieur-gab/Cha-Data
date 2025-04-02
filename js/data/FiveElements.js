// data/FiveElements.js
// Traditional Five Elements Characteristics in Chinese Medicine

export const fiveElementsCharacteristics = {
  wood: {
    chineseName: "木 (Mù)",
    season: "spring",
    direction: "east",
    taste: "sour",
    color: "green",
    energy: "rising",
    organ: "liver/gallbladder",
    associated: ["growth", "flexibility", "expansion", "vitality"],
    description: "Wood energy rises upward like plants growing toward sunlight, representing expansion, growth, and vitality. It brings flexibility and movement while promoting clarity of purpose and vision.",
    benefits: ["Supports liver function", "Enhances mental clarity", "Promotes flexibility", "Releases stagnation"],
    excessCautions: ["May increase irritability if liver is congested", "Could be overstimulating for those prone to anger or frustration"],
    deficiencyCautions: ["May not provide enough assertive energy for those with stagnation"],
    idealTimes: ["Spring", "Morning (5-7am)", "When feeling stuck or stagnant"]
  },
  
  fire: {
    chineseName: "火 (Huǒ)",
    season: "summer",
    direction: "south",
    taste: "bitter",
    color: "red",
    energy: "ascending",
    organ: "heart/small intestine",
    associated: ["warmth", "transformation", "activity", "joy"],
    description: "Fire energy rises and spreads outward like flames, representing transformation, warmth, and activity. It brings joy, passion, and animation to both body and mind.",
    benefits: ["Supports heart function", "Enhances circulation", "Provides warming energy", "Promotes joy and animation"],
    excessCautions: ["May overstimulate those prone to anxiety", "Could disrupt sleep if consumed late in the day", "May aggravate heat conditions"],
    deficiencyCautions: ["May not provide enough warming energy for cold constitutions"],
    idealTimes: ["Summer", "Midday (11am-1pm)", "When feeling cold or low in energy", "For celebrations"]
  },
  
  earth: {
    chineseName: "土 (Tǔ)",
    season: "late summer",
    direction: "center",
    taste: "sweet",
    color: "yellow",
    energy: "centralizing",
    organ: "spleen/stomach",
    associated: ["stability", "nourishment", "grounding", "balance"],
    description: "Earth energy is centering and stabilizing, representing nourishment, groundedness, and balance. It brings harmony, stability, and a sense of being supported.",
    benefits: ["Supports digestive function", "Enhances nutrient absorption", "Promotes centeredness", "Provides stability"],
    excessCautions: ["May promote lethargy if consumed in excess", "Could increase dampness in prone individuals"],
    deficiencyCautions: ["May not provide enough stimulation for very active individuals"],
    idealTimes: ["Late summer", "Between seasons", "Meal times", "When seeking stability or grounding"]
  },
  
  metal: {
    chineseName: "金 (Jīn)",
    season: "autumn",
    direction: "west",
    taste: "pungent/spicy",
    color: "white",
    energy: "contracting",
    organ: "lungs/large intestine",
    associated: ["refinement", "clarity", "precision", "letting go"],
    description: "Metal energy moves inward and downward, representing contraction, refinement, and precision. It brings clarity, discernment, and the ability to let go of what is no longer needed.",
    benefits: ["Supports lung function", "Enhances mental clarity", "Promotes letting go", "Refines awareness"],
    excessCautions: ["May promote excessive dryness", "Could increase melancholy in prone individuals"],
    deficiencyCautions: ["May not provide enough moisture for dry constitutions"],
    idealTimes: ["Autumn", "Early morning (3-5am)", "When needing mental clarity", "During decluttering or simplifying"]
  },
  
  water: {
    chineseName: "水 (Shuǐ)",
    season: "winter",
    direction: "north",
    taste: "salty",
    color: "black/blue",
    energy: "descending",
    organ: "kidneys/bladder",
    associated: ["depth", "stillness", "wisdom", "potential"],
    description: "Water energy flows downward and inward, representing depth, stillness, and latent potential. It brings calm, introspection, and access to deep wisdom.",
    benefits: ["Supports kidney function", "Deepens self-awareness", "Promotes stillness", "Activates inner resources"],
    excessCautions: ["May increase feelings of fearfulness in some", "Could deplete yang energy in very cold individuals"],
    deficiencyCautions: ["May not provide enough stimulation or warmth for those with kidney yang deficiency"],
    idealTimes: ["Winter", "Late afternoon (3-5pm)", "During contemplation or meditation", "When seeking depth or insight"]
  }
};

// Added structure for element associations used by QiTeaAnalyzer
export const fiveElementAssociations = {
  flavors: {
    // Wood element associations
    "sour": { wood: 3, fire: 0, earth: 0, metal: 0, water: 1 },
    "grassy": { wood: 2, fire: 0, earth: 1, metal: 0, water: 0 },
    "vegetal": { wood: 2, fire: 0, earth: 1, metal: 0, water: 0 },
    "herbaceous": { wood: 2, fire: 1, earth: 0, metal: 0, water: 0 },
    
    // Fire element associations
    "bitter": { wood: 0, fire: 3, earth: 0, metal: 0, water: 0 },
    "spicy": { wood: 0, fire: 2, earth: 0, metal: 1, water: 0 },
    "roasted": { wood: 0, fire: 2, earth: 1, metal: 0, water: 0 },
    
    // Earth element associations
    "sweet": { wood: 0, fire: 0, earth: 3, metal: 0, water: 0 },
    "malty": { wood: 0, fire: 1, earth: 2, metal: 0, water: 0 },
    "honey": { wood: 0, fire: 1, earth: 2, metal: 0, water: 0 },
    "caramel": { wood: 0, fire: 1, earth: 2, metal: 0, water: 0 },
    
    // Metal element associations
    "floral": { wood: 1, fire: 0, earth: 0, metal: 2, water: 0 },
    "mineral": { wood: 0, fire: 0, earth: 0, metal: 3, water: 1 },
    "crisp": { wood: 0, fire: 0, earth: 0, metal: 2, water: 1 },
    
    // Water element associations
    "marine": { wood: 0, fire: 0, earth: 0, metal: 0, water: 3 },
    "earthy": { wood: 1, fire: 0, earth: 1, metal: 0, water: 2 },
    "woody": { wood: 2, fire: 0, earth: 0, metal: 0, water: 2 }
  },
  processing: {
    // Processing methods and their element associations
    "steamed": { wood: 1, fire: 0, earth: 0, metal: 0, water: 2 },
    "pan-fired": { wood: 0, fire: 2, earth: 0, metal: 1, water: 0 },
    "sun-dried": { wood: 0, fire: 2, earth: 0, metal: 1, water: 0 },
    "shade-grown": { wood: 1, fire: 0, earth: 0, metal: 0, water: 2 },
    "withered": { wood: 0, fire: 0, earth: 0, metal: 2, water: 1 },
    "rolled": { wood: 1, fire: 0, earth: 1, metal: 1, water: 0 },
    "oxidized": { wood: 0, fire: 1, earth: 1, metal: 1, water: 0 },
    "roasted": { wood: 0, fire: 3, earth: 1, metal: 0, water: 0 },
    "fermented": { wood: 0, fire: 0, earth: 1, metal: 0, water: 2 },
    "aged": { wood: 0, fire: 0, earth: 0, metal: 1, water: 3 }
  },
  teaTypes: {
    // Tea types and their element associations
    "white": { wood: 0, fire: 0, earth: 0, metal: 2, water: 1 },
    "green": { wood: 3, fire: 0, earth: 0, metal: 0, water: 1 },
    "yellow": { wood: 1, fire: 1, earth: 2, metal: 0, water: 0 },
    "oolong": { wood: 0, fire: 1, earth: 1, metal: 1, water: 0 },
    "black": { wood: 0, fire: 2, earth: 1, metal: 0, water: 0 },
    "puerh": { wood: 0, fire: 0, earth: 1, metal: 0, water: 3 }
  }
};

// Helper function to find teas that support specific elements
export const findTeasForElement = (element) => {
  const elementTeaMap = {
    wood: ['green tea', 'young sheng puerh', 'first flush darjeeling', 'Chinese green tea'],
    fire: ['black tea', 'semi-oxidized oolong', 'red tea', 'Ceylon black tea'],
    earth: ['yellow tea', 'medium-roasted oolong', 'honey-processed black tea', 'GABA oolong'],
    metal: ['white tea', 'bai mu dan', 'silver needle', 'aged white tea', 'lightly oxidized oolong'],
    water: ['aged puerh', 'shou puerh', 'aged oolong', 'heavily roasted oolong']
  };
  
  return elementTeaMap[element.toLowerCase()] || [];
};

export default fiveElementsCharacteristics; 