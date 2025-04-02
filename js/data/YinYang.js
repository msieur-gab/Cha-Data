// data/YinYang.js
// Yin-Yang Characteristics and their effects

export const yinYangCharacteristics = {
  'strong_yin': {
    name: 'Strong Yin',
    chineseTerminology: '陰/阴 (Yīn)',
    characteristics: [
      'Cooling', 'Calming', 'Downward energy', 'Relaxing',
      'Moistening', 'Gentle', 'Soft', 'Interior-directed'
    ],
    effects: [
      'Reduces heat', 'Calms the mind', 'Promotes deep relaxation',
      'Eases tension', 'Soothes irritability', 'Clarifies thoughts'
    ],
    bestFor: [
      'Hot weather', 'Afternoon drinking', 'Stress reduction',
      'Meditation', 'Sleep preparation', 'Cooling overheated conditions'
    ],
    cautions: [
      'May be too cooling for cold constitutions',
      'Not ideal for early morning or when energy is needed',
      'Can promote lethargy in those prone to coldness or low energy'
    ]
  },
  
  'yin': {
    name: 'Yin',
    chineseTerminology: '陰/阴 (Yīn)',
    characteristics: [
      'Cooling', 'Calming', 'Refreshing', 'Clarifying',
      'Light', 'Bright', 'Tranquil'
    ],
    effects: [
      'Cools and refreshes', 'Brings mental clarity',
      'Promotes focus with calmness', 'Reduces irritability'
    ],
    bestFor: [
      'Warm weather', 'Afternoon tea', 'Mental work',
      'Meditation', 'Stress reduction'
    ],
    cautions: [
      'May not provide enough warming energy on cold days',
      'Less suitable for early morning'
    ]
  },
  
  'slightly_yin': {
    name: 'Slightly Yin',
    chineseTerminology: '少陰/少阴 (Shǎo Yīn)',
    characteristics: [
      'Mildly cooling', 'Gently refreshing', 'Bright',
      'Clear', 'Light but grounded'
    ],
    effects: [
      'Refreshes without overcooling', 'Promotes mental clarity',
      'Balances focus and calm', 'Gently uplifting'
    ],
    bestFor: [
      'Mid-morning to afternoon', 'Mental tasks',
      'Balanced energy', 'Year-round drinking'
    ],
    cautions: [
      'Generally well-tolerated by most constitutions'
    ]
  },
  
  'balanced': {
    name: 'Balanced',
    chineseTerminology: '和/合 (Hé)',
    characteristics: [
      'Harmonious', 'Centering', 'Adaptable',
      'Even energy', 'Neither too warming nor cooling'
    ],
    effects: [
      'Promotes overall balance', 'Adaptable to different conditions',
      'Supports centered awareness', 'Harmonizes body and mind'
    ],
    bestFor: [
      'Any time of day', 'Transitional seasons',
      'Social tea drinking', 'General wellbeing'
    ],
    cautions: [
      'May not provide specific therapeutic effects needed for particular conditions'
    ]
  },
  
  'slightly_yang': {
    name: 'Slightly Yang',
    chineseTerminology: '少陽/少阳 (Shǎo Yáng)',
    characteristics: [
      'Mildly warming', 'Gently invigorating', 'Active',
      'Bright', 'Substantial but not heavy'
    ],
    effects: [
      'Provides gentle warmth', 'Activates without overexciting',
      'Supports digestion', 'Promotes steady energy'
    ],
    bestFor: [
      'Morning to mid-day', 'Cool weather',
      'Active work', 'Digestion support'
    ],
    cautions: [
      'May be slightly warming for very hot days or heat-prone individuals'
    ]
  },
  
  'yang': {
    name: 'Yang',
    chineseTerminology: '陽/阳 (Yáng)',
    characteristics: [
      'Warming', 'Energizing', 'Invigorating', 'Active',
      'Substantial', 'Strong', 'Rising'
    ],
    effects: [
      'Warms the body', 'Increases energy', 'Stimulates circulation',
      'Promotes alertness', 'Supports metabolism'
    ],
    bestFor: [
      'Morning drinking', 'Cold weather', 'Physical activity',
      'Digestive support', 'Energy boosting'
    ],
    cautions: [
      'May overstimulate sensitive individuals',
      'Less suitable for evening or for those with excess heat'
    ]
  },
  
  'strong_yang': {
    name: 'Strong Yang',
    chineseTerminology: '陽/阳 (Yáng)',
    characteristics: [
      'Strongly warming', 'Stimulating', 'Rising energy',
      'Robust', 'Full-bodied', 'Vigorous', 'Exterior-directed'
    ],
    effects: [
      'Provides significant warmth', 'Strongly energizes',
      'Promotes circulation', 'Stimulates metabolism',
      'Dispels cold', 'Activates the body'
    ],
    bestFor: [
      'Cold weather', 'Morning drinking', 'Physical exertion',
      'Cold constitutions', 'Metabolic support'
    ],
    cautions: [
      'Too stimulating for hot conditions or evenings',
      'May cause restlessness in sensitive individuals',
      'Can aggravate conditions of excessive heat or hyperactivity'
    ]
  }
};

// Export the structure needed by QiTeaAnalyzer
export const yinYangProperties = {
  teaTypes: {
    white: { yin: 8, yang: 3 },
    green: { yin: 7, yang: 4 },
    yellow: { yin: 6, yang: 5 },
    oolong: { yin: 5, yang: 6 },
    black: { yin: 3, yang: 8 },
    puerh: { yin: 2, yang: 7 }
  },
  processing: {
    "shade-grown": { yin: 2, yang: 0 },
    "sun-dried": { yin: 0, yang: 2 },
    "steamed": { yin: 1, yang: 0 },
    "roasted": { yin: 0, yang: 2 },
    "heavy-roast": { yin: 0, yang: 3 },
    "light-roast": { yin: 0, yang: 1 },
    "aged": { yin: 0, yang: 1 }
  }
};

// Helper function to get the nature based on the value on a scale from -3 (strong yin) to +3 (strong yang)
export const getYinYangNature = (value) => {
  if (value <= -2.5) return 'strong_yin';
  if (value <= -1.5) return 'yin';
  if (value <= -0.5) return 'slightly_yin';
  if (value <= 0.5) return 'balanced';
  if (value <= 1.5) return 'slightly_yang';
  if (value <= 2.5) return 'yang';
  return 'strong_yang';
};

export default yinYangCharacteristics; 