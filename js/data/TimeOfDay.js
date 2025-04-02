// data/TimeOfDay.js
// Time of Day Tea Drinking Recommendations

export const timeOfDayRecommendations = {
  morning: {
    description: "Early to mid-morning (6am-10am)",
    suited: ["rising", "stimulating", "lifting", "clearing", "expanding"],
    avoided: ["sinking", "anchoring", "heavy grounding"],
    ideal: "Teas with upward, awakening, and clear energy patterns"
  },
  
  midday: {
    description: "Late morning to early afternoon (10am-2pm)",
    suited: ["balanced", "harmonizing", "circulating", "dynamic"],
    avoided: ["extremely stimulating", "heavily sinking"],
    ideal: "Teas with balanced, steady energy patterns that support activity"
  },
  
  afternoon: {
    description: "Mid to late afternoon (2pm-6pm)",
    suited: ["gentle rising", "harmonizing", "balanced", "gently sinking"],
    avoided: ["strongly stimulating", "heavy"],
    ideal: "Teas with moderate, transitional energy patterns"
  },
  
  evening: {
    description: "Early to mid-evening (6pm-9pm)",
    suited: ["sinking", "grounding", "gentle", "anchoring"],
    avoided: ["strongly rising", "stimulating", "intense clearing"],
    ideal: "Teas with calming, settling energy patterns"
  }
};

// Added structured recommendations for use by QiTeaAnalyzer
export const timeRecommendations = {
  yinYang: {
    yang: ["Morning", "Early Afternoon"],
    yin: ["Late Afternoon", "Evening"],
    balanced: ["Morning", "Afternoon", "Evening"]
  },
  qiMovement: {
    rising: ["Morning", "Early Afternoon"],
    descending: ["Evening"],
    expanding: ["Morning", "Afternoon"],
    contracting: ["Evening"],
    balanced: ["Morning", "Afternoon", "Evening"]
  }
};

// Helper function to recommend tea based on time
export const recommendTeaByTime = (hour) => {
  if (hour >= 6 && hour < 10) {
    return {
      timeOfDay: 'morning',
      recommendations: timeOfDayRecommendations.morning
    };
  } else if (hour >= 10 && hour < 14) {
    return {
      timeOfDay: 'midday',
      recommendations: timeOfDayRecommendations.midday
    };
  } else if (hour >= 14 && hour < 18) {
    return {
      timeOfDay: 'afternoon',
      recommendations: timeOfDayRecommendations.afternoon
    };
  } else if (hour >= 18 && hour < 21) {
    return {
      timeOfDay: 'evening',
      recommendations: timeOfDayRecommendations.evening
    };
  } else {
    return {
      timeOfDay: 'late evening',
      recommendations: {
        description: "Late evening (after 9pm)",
        suited: ["minimal caffeine", "gentle", "cooling"],
        avoided: ["any stimulating qualities", "energizing", "warming"],
        ideal: "Herbal infusions or very light teas if any"
      }
    };
  }
};

export default timeOfDayRecommendations; 