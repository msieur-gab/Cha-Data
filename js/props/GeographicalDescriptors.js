// GeographicalDescriptors.js
// Descriptors and data for geographic influences on tea characteristics

// Define elevation classifications (in meters)
export const elevationLevels = {
    low: { 
        min: 0, 
        max: 500,
        description: "Low elevation teas (below 500m) typically develop rich, robust flavors with full body. The warmer climate promotes faster leaf growth, resulting in higher levels of tannins and stronger characteristics."
    },
    medium: { 
        min: 500, 
        max: 1200,
        description: "Medium elevation teas (500-1200m) balance complexity and strength. The moderate climate produces balanced growth, with good flavor development and moderate astringency."
    },
    high: { 
        min: 1200, 
        max: 2000,
        description: "High elevation teas (1200-2000m) develop complex, nuanced flavors with bright notes. The cooler temperatures slow leaf growth, allowing more time for flavor compounds to develop while reducing astringency."
    },
    veryHigh: { 
        min: 2000, 
        max: Infinity,
        description: "Very high elevation teas (above 2000m) are prized for their exceptional complexity, delicate aromas, and subtle sweetness. The challenging growing conditions create slower maturation and concentrated flavors."
    }
};

// Define latitude classifications (in degrees)
export const latitudeZones = {
    tropical: { 
        min: 0, 
        max: 23.5,
        description: "Tropical zone teas (0-23.5°) grow in consistent warm temperatures with abundant rainfall, producing vibrant flavors with distinctive regional characteristics and often multiple harvests year-round."
    },
    subtropical: { 
        min: 23.5, 
        max: 35,
        description: "Subtropical zone teas (23.5-35°) benefit from warm growing seasons with some seasonal variation, creating balanced profiles with good complexity and often distinctive regional character."
    },
    temperate: { 
        min: 35, 
        max: 55,
        description: "Temperate zone teas (35-55°) experience distinct seasonal changes that impact growth cycles, often producing more delicate flavors with unique seasonal variations between harvests."
    },
    subpolar: { 
        min: 55, 
        max: 90,
        description: "Subpolar zone teas (55-90°) are rare, growing in challenging conditions with short growing seasons, typically producing distinctive flavors with robust characteristics developed to withstand the harsh environment."
    }
};

// Geographic feature descriptions
export const geographicFeatureDescriptions = {
    'mountain': "Mountain terrain provides good drainage, temperature variation, and often mineral-rich soil, contributing to complex flavors with bright notes and good clarity.",
    'high-mountain': "High mountain environments offer intense sunlight, cool temperatures, significant day-night temperature variations, and often mist coverage, developing exceptional complexity, brightness, and subtle sweetness in teas.",
    'forest': "Forest environments provide natural shade, biodiversity, and rich organic soil composition, producing teas with depth, complexity, and often distinctive aromatic qualities.",
    'coastal': "Coastal regions offer mineral influences from sea breezes, moderate temperatures, and often higher humidity, creating teas with distinctive mineral notes and refreshing qualities.",
    'river-delta': "River deltas provide nutrient-rich alluvial soil, good water access, and typically lower elevations, producing teas with rich body, smooth texture, and often robust flavor profiles.",
    'valley': "Valley settings offer protection from extreme weather, good soil deposition, and often mist coverage, developing teas with balance, smoothness, and often a good harmony of characteristics.",
    'plateau': "Plateau regions provide consistent elevation, good sunlight exposure, and often distinctive soil compositions, producing teas with clarity, brightness, and regional uniqueness.",
    'volcanic': "Volcanic regions have mineral-rich soil with excellent drainage, contributing to teas with distinctive mineral notes, vibrancy, and often good structural characteristics."
};

// Soil type descriptions
export const soilTypeDescriptions = {
    'volcanic': "Volcanic soil is rich in minerals with excellent drainage, producing teas with vibrant character, good mineral notes, and often a distinctive brightness.",
    'mineral-rich': "Mineral-rich soils provide essential trace elements that enhance complexity and often add distinctive notes to teas grown in these conditions.",
    'loamy': "Loamy soil balances drainage and water retention with good nutrient content, supporting healthy tea plants that produce balanced, well-developed flavors.",
    'sandy-loam': "Sandy-loam soil offers good drainage while retaining moderate nutrients, creating teas with clean flavor profiles and often good clarity.",
    'alluvial': "Alluvial soil from river deposits is typically nutrient-rich and moisture-retentive, producing teas with full body, richness, and often stronger flavor characteristics.",
    'laterite': "Laterite soil is typically iron-rich, well-draining, and found in tropical regions, contributing to teas with distinctive regional character and often good structure.",
    'rocky': "Rocky soil provides excellent drainage and mineral content but challenges the plants, often resulting in teas with concentrated flavors, good structure, and mineral notes.",
    'volcanic-loam': "Volcanic-loam combines mineral content with good organic structure, producing teas with complex profiles that balance mineral brightness with depth.",
    'volcanic-alluvial': "Volcanic-alluvial soil merges mineral richness with nutrient density, creating teas with vibrant characteristics, good body, and often enhanced complexity."
};

// Climate type descriptions
export const climateDescriptions = {
    'tropical': "Tropical climates provide consistent warmth with abundant rainfall, producing teas with vibrant character, full development, and often distinctive regional notes.",
    'tropical-highland': "Tropical highland climates combine consistent temperatures with cooling effects of elevation, creating teas with complexity, brightness, and refined character.",
    'subtropical': "Subtropical climates offer warm growing conditions with moderate seasonal variation, producing well-balanced teas with good flavor development.",
    'subtropical-highland': "Subtropical highland climates provide moderated temperatures with elevation effects, ideal for developing complex, aromatic teas with excellent structure.",
    'temperate': "Temperate climates with distinct seasons create seasonal variation in tea growth, often producing more delicate flavors with unique characteristics between harvests.",
    'humid-subtropical': "Humid subtropical climates combine warmth with significant moisture, producing teas with full body, rich flavors, and often smooth mouthfeel."
};

// Region-specific characteristics and descriptions
export const regionCharacteristics = {
    // China regions
    'yunnan': { 
        description: "Yunnan's diverse ecosystem with ancient tea forests, high elevations, and mineral-rich soil produces distinctive teas with notes of honey, malt, and earthy characteristics, famous for puerh and golden-tipped black teas.",
        signature: "honeyed sweetness, earthy depth, peppery notes",
        famous_styles: ["puerh", "dian hong", "yunnan gold"]
    },
    'fujian': { 
        description: "Fujian's mountainous coastal terrain with rocky soil creates complex teas with floral-fruity notes and mineral brightness, home to oolong varieties and white teas with distinctive characteristics.",
        signature: "floral complexity, fruit notes, mineral brightness", 
        famous_styles: ["white peony", "silver needle", "tie guan yin", "da hong pao"]
    },
    'anhui': { 
        description: "Anhui's forested mountains with loamy soil and misty conditions produce teas with delicate complexity, subtle sweetness, and often smoky notes in some varieties.",
        signature: "subtle complexity, gentle sweetness, occasional smokiness",
        famous_styles: ["keemun", "huang shan mao feng"]
    },
    'zhejiang': { 
        description: "Zhejiang's varied landscape from coastal to mountainous regions creates teas with fresh vegetal notes, pleasant sweetness, and distinctive character, famous for Long Jing (Dragonwell).",
        signature: "fresh vegetal notes, nutty warmth, clean finish",
        famous_styles: ["long jing", "anji bai cha"]
    },
    'guangdong': { 
        description: "Guangdong's subtropical climate with rich soil produces teas with honey-orchid notes, smooth texture, and distinctive aromas, known for dancong oolongs with remarkable flavor diversity.",
        signature: "honey-orchid aroma, fruity complexity, smooth texture",
        famous_styles: ["phoenix dancong", "yingde black"]
    },
    
    // Japan regions
    'kyoto': { 
        description: "Kyoto's misty valleys with volcanic soil produce refined teas with umami richness, balanced sweetness, and fresh verdant notes, known for high-quality tencha and gyokuro.",
        signature: "umami depth, balanced sweetness, refined character",
        famous_styles: ["matcha", "gyokuro", "kabusecha"]
    },
    'uji': { 
        description: "Uji's river valley with volcanic-alluvial soil creates teas with exceptional umami depth, smooth texture, and complex sweetness, historically the first tea-growing region in Japan.",
        signature: "intense umami, complex sweetness, lingering finish",
        famous_styles: ["matcha", "gyokuro", "sencha"]
    },
    'kagoshima': { 
        description: "Kagoshima's volcanic influence with coastal exposure produces teas with bright character, clean flavor, and often subtle marine notes, known for larger-scale production with modern techniques.",
        signature: "bright character, clean flavor, subtle sweetness",
        famous_styles: ["sencha", "kabusecha", "bancha"]
    },
    'shizuoka': { 
        description: "Shizuoka's diverse terrain from coastal to mountainous areas creates Japan's most varied tea production, with balanced character, fresh notes, and good structure.",
        signature: "balanced character, fresh aroma, good structure",
        famous_styles: ["sencha", "fukamushi sencha", "kabusecha"]
    },
    
    // India regions
    'darjeeling': { 
        description: "Darjeeling's high Himalayan slopes with loamy soil and cool misty conditions produce the 'champagne of teas' with muscatel notes, floral complexity, and distinctive brightness.",
        signature: "muscatel character, floral complexity, bright finish",
        famous_styles: ["first flush", "second flush", "autumnal"]
    },
    'assam': { 
        description: "Assam's lowland river valley with humid conditions and alluvial soil creates bold, malty teas with robust body, brisk character, and often honey-like sweetness.",
        signature: "malty strength, robust body, brisk character",
        famous_styles: ["breakfast tea", "tippy golden flowery orange pekoe"]
    },
    'nilgiri': { 
        description: "Nilgiri's high plateaus in southern India produce aromatic teas with bright character, clean taste, and subtle fruity notes, often with less astringency than other Indian regions.",
        signature: "bright character, clean taste, subtle fruitiness",
        famous_styles: ["frost tea", "nilgiri oolong"]
    },
    
    // Taiwan
    'taiwan': { 
        description: "Taiwan's varied mountain terrain with mineral-rich soil creates exceptional oolongs with remarkable complexity, floral-fruity notes, and often a distinctive 'high mountain' character.",
        signature: "complex aromatics, silky texture, lingering sweetness",
        famous_styles: ["dong ding", "oriental beauty", "jin xuan"]
    },
    'alishan': { 
        description: "Alishan's high mountain environment with frequent mist coverage produces prized oolongs with delicate sweetness, floral complexity, and remarkable aromatics.",
        signature: "delicate sweetness, floral complexity, creamy mouthfeel",
        famous_styles: ["high mountain oolong", "jin xuan oolong"]
    },
    
    // Sri Lanka
    'ceylon': { 
        description: "Ceylon (Sri Lanka) tea varies by elevation, with distinctive regional differences producing teas ranging from bold and brisk lowland varieties to delicate, nuanced high-grown teas.",
        signature: "bright character, clean taste, brisk finish",
        famous_styles: ["orange pekoe", "ceylon black"]
    },
    'nuwara eliya': { 
        description: "Nuwara Eliya's high elevation with cool climate produces Ceylon's most delicate teas, with floral notes, light body, and bright character often called the 'champagne of Ceylon teas'.",
        signature: "delicate body, floral notes, bright character",
        famous_styles: ["high-grown ceylon", "silver tips"]
    }
};

// Seasonal characteristics by region
export const regionalSeasonality = {
    'darjeeling': {
        spring: "First flush (March-April) teas are delicate with floral notes and astringent brightness",
        summer: "Second flush (May-June) teas develop the famous muscatel character with fuller body",
        fall: "Autumnal flush (October-November) offers deeper, mellower flavors with less brightness",
        winter: "Winter dormancy, no significant production"
    },
    'assam': {
        spring: "First flush (March-April) is lighter with floral notes and mild character",
        summer: "Second flush (May-June) provides the classic malty, full-bodied character",
        fall: "Autumnal teas offer deep flavor with less brightness and more richness",
        winter: "Limited winter production with distinctive character"
    },
    'uji': {
        spring: "Spring harvest (April-May) produces the finest gyokuro and matcha with peak umami",
        summer: "Summer harvest offers more robust flavor with increased astringency",
        fall: "Autumn harvest provides balanced character with moderate umami",
        winter: "Winter dormancy, no significant production"
    },
    'yunnan': {
        spring: "Spring tea offers floral delicacy, sweetness, and the year's most prized harvest",
        summer: "Summer tea develops stronger body with increased earthiness",
        fall: "Autumn tea balances body and aromatic complexity with deeper notes",
        winter: "Limited winter production with distinctive character in certain areas"
    }
};

export default {
    elevationLevels,
    latitudeZones,
    geographicFeatureDescriptions,
    soilTypeDescriptions,
    climateDescriptions,
    regionCharacteristics,
    regionalSeasonality
}; 