// optimizedTeaDatabase.js
// A focused set of reference teas for calibrating the tea effect system

export const teaDatabase = [
    // HIGH L-THEANINE TO CAFFEINE RATIO (2.0)
    {
        name: "Gyokuro",
        originalName: "玉露 (Gyokuro)",
        type: "green",
        origin: "Uji, Kyoto Prefecture, Japan",
        caffeineLevel: 4.5,
        lTheanineLevel: 9,
        flavorProfile: ["umami", "marine", "sweet", "grass", "seaweed"],
        processingMethods: ["shade-grown", "steamed", "rolled", "dried"],
        geography: {
            altitude: 200,    // Uji region average
            humidity: 75,     // High humidity region
            latitude: 34.88,  // Uji coordinates
            longitude: 135.80,
            harvestMonth: 4   // April harvest
        },
        expectedEffects: {
            dominant: "elevating",
            supporting: "harmonizing"
        }
    },
    
    // MODERATE L-THEANINE TO CAFFEINE RATIO (1.5)
    {
        name: "Sencha",
        originalName: "煎茶 (Sencha)",
        type: "green",
        origin: "Shizuoka Prefecture, Japan",
        caffeineLevel: 4,
        lTheanineLevel: 6,
        flavorProfile: ["grassy", "marine", "vegetal", "fresh", "slightly sweet"],
        processingMethods: ["steamed", "rolled", "dried"],
        geography: {
            altitude: 400,    // Shizuoka mountain regions
            humidity: 72,     // Moderate-high humidity
            latitude: 34.97,  // Shizuoka coordinates
            longitude: 138.38,
            harvestMonth: 5   // May harvest (spring)
        },
        expectedEffects: {
            dominant: "energizing",
            supporting: "harmonizing"
        }
    },
    
    // BALANCED RATIO (1.0) WITH HEAVY ROAST
    {
        name: "Da Hong Pao",
        originalName: "大红袍 (Dà Hóng Páo)",
        type: "oolong",
        origin: "Wuyi Mountains, Fujian, China",
        caffeineLevel: 4.5,
        lTheanineLevel: 4.5,
        flavorProfile: ["roasted", "mineral", "dark fruits", "woody", "caramel"],
        processingMethods: ["withered", "partial-oxidation", "rolled", "heavy-roast"],
        geography: {
            altitude: 600,    // Wuyi Mountain average
            humidity: 80,     // High humidity
            latitude: 27.72,  // Wuyi coordinates
            longitude: 117.67,
            harvestMonth: 5   // Late spring harvest
        },
        expectedEffects: {
            dominant: "comforting",
            supporting: "grounding"
        }
    },

    {
        "name": "Porto Oolong",
        "originalName": "Oolong do Porto",
        "type": "oolong",
        "origin": "Porto, Portugal",
        "caffeineLevel": 4,
        "lTheanineLevel": 5,
        "flavorProfile": ["mineral", "floral", "honey", "grape"],
        "processingMethods": ["withered", "partial-oxidation", "rolled"],
        "geography": {
        "altitude": 100,
        "humidity": 78,
        "latitude": 41.15,
        "longitude": -8.61,
        "harvestMonth": 6
        },
        "expectedEffects": {
        "dominant": "harmonizing",
        "supporting": "calming"
        }
        },
    
    // HIGHER RATIO (1.86) WITH MINIMAL ROAST
    {
        name: "Ali Shan Oolong",
        originalName: "阿里山烏龍 (Ālǐshān Wūlóng)",
        type: "oolong",
        origin: "Ali Mountain, Taiwan",
        caffeineLevel: 3.5,
        lTheanineLevel: 6.5,
        flavorProfile: ["floral", "buttery", "sweet", "creamy", "honeysuckle"],
        processingMethods: ["withered", "partial-oxidation", "rolled", "minimal-roast"],
        geography: {
            altitude: 1500,   // Ali Mountain high elevation
            humidity: 80,     // High humidity
            latitude: 23.47,  // Ali Mountain coordinates
            longitude: 120.80,
            harvestMonth: 4   // Spring harvest
        },
        expectedEffects: {
            dominant: "elevating",
            supporting: "calming"
        }
    },
    
    // LOW RATIO (0.54) WITH FULL OXIDATION
    {
        name: "Assam",
        originalName: "Assam Orthodox",
        type: "black",
        origin: "Assam Valley, India",
        caffeineLevel: 6.5,
        lTheanineLevel: 3.5,
        flavorProfile: ["malty", "brisk", "robust", "caramel", "honey"],
        processingMethods: ["withered", "rolled", "full-oxidation", "dried"],
        geography: {
            altitude: 100,    // Assam Valley lowlands
            humidity: 85,     // Very humid
            latitude: 26.74,  // Assam coordinates
            longitude: 94.21,
            harvestMonth: 6   // Summer harvest (second flush)
        },
        expectedEffects: {
            dominant: "energizing",
            supporting: "focusing"
        }
    },
    
    // VERY HIGH RATIO (2.8) WITH MINIMAL PROCESSING
    {
        name: "Silver Needle",
        originalName: "白毫银针 (Bái Háo Yín Zhēn)",
        type: "white",
        origin: "Fuding, Fujian Province, China",
        caffeineLevel: 2.5,
        lTheanineLevel: 7,
        flavorProfile: ["honey", "melon", "hay", "delicate", "cucumber"],
        processingMethods: ["withered", "sun-dried", "minimal-processing"],
        geography: {
            altitude: 800,    // Fuding average
            humidity: 78,     // Subtropical climate
            latitude: 27.33,  // Fuding coordinates
            longitude: 120.20,
            harvestMonth: 3   // Early spring harvest
        },
        expectedEffects: {
            dominant: "calming",
            supporting: "restorative"
        }
    },
    
    // BALANCED RATIO (1.0) WITH COMPLEX PROCESSING
    {
        name: "Aged Ripe Puerh",
        originalName: "熟普洱 (Shú Pǔ'ěr)",
        type: "puerh",
        origin: "Menghai, Yunnan, China",
        caffeineLevel: 4.5,
        lTheanineLevel: 4.5,
        flavorProfile: ["earthy", "woody", "sweet", "leather", "compost"],
        processingMethods: ["withered", "pile-fermented", "compressed", "aged"],
        geography: {
            altitude: 1300,   // Menghai average
            humidity: 75,     // Tropical climate
            latitude: 21.98,  // Menghai coordinates
            longitude: 100.45,
            harvestMonth: 4   // Spring harvest
        },
        expectedEffects: {
            dominant: "grounding",
            supporting: "harmonizing"
        }
    },
    // 1. Mi Lan Xiang Dan Cong Oolong (Honey Orchid Fragrance)
{
    name: "Mi Lan Xiang Dan Cong",
    originalName: "蜜兰香单枞 (Mì Lán Xiāng Dān Cōng)",
    type: "oolong",
    origin: "Phoenix Mountain, Guangdong, China",
    caffeineLevel: 5.0,
    lTheanineLevel: 4.2,
    flavorProfile: ["honey", "orchid", "fruity", "floral", "roasted", "tropical"],
    processingMethods: ["withered", "partial-oxidation", "medium-roast", "hand-rolled"],
    geography: {
        altitude: 1200,
        humidity: 78,
        latitude: 23.73,
        longitude: 113.75,
        harvestMonth: 4
    },
    expectedEffects: {
        dominant: "elevating",
        supporting: "energizing"
    }
},

// 2. Moonlight Beauty White Tea
{
    name: "Moonlight Beauty",
    originalName: "月光美人 (Yuè Guāng Měi Rén)",
    type: "white",
    origin: "Jinggu, Yunnan, China",
    caffeineLevel: 3.5,
    lTheanineLevel: 7.2,
    flavorProfile: ["honey", "apricot", "sweet", "hay", "orchid", "herbaceous"],
    processingMethods: ["withered", "sun-dried", "minimal-processing"],
    geography: {
        altitude: 1600,
        humidity: 72,
        latitude: 23.5,
        longitude: 100.7,
        harvestMonth: 3
    },
    expectedEffects: {
        dominant: "calming",
        supporting: "restorative"
    }
},

// 3. First Flush Darjeeling
{
    name: "First Flush Darjeeling",
    originalName: "First Flush Darjeeling",
    type: "black",
    origin: "Darjeeling, West Bengal, India",
    caffeineLevel: 4.8,
    lTheanineLevel: 3.5,
    flavorProfile: ["muscatel", "floral", "citrus", "fresh", "vegetal", "woody"],
    processingMethods: ["withered", "rolled", "light-oxidation", "dried"],
    geography: {
        altitude: 2000,
        humidity: 70,
        latitude: 27.05,
        longitude: 88.26,
        harvestMonth: 3
    },
    expectedEffects: {
        dominant: "focusing",
        supporting: "elevating"
    }
},

// 4. Matcha Ceremonial Grade
{
    name: "Ceremonial Matcha",
    originalName: "抹茶 (Matcha)",
    type: "green",
    origin: "Uji, Kyoto, Japan",
    caffeineLevel: 6.0,
    lTheanineLevel: 9.5,
    flavorProfile: ["umami", "sweet", "grass", "marine", "vegetal", "creamy"],
    processingMethods: ["shade-grown", "steamed", "stone-ground", "minimal-processing"],
    geography: {
        altitude: 200,
        humidity: 75,
        latitude: 34.88,
        longitude: 135.80,
        harvestMonth: 5
    },
    expectedEffects: {
        dominant: "focusing",
        supporting: "harmonizing"
    }
},

// 5. Lapsang Souchong
{
    name: "Lapsang Souchong",
    originalName: "正山小种 (Zhèng Shān Xiǎo Zhǒng)",
    type: "black",
    origin: "Wuyi Mountains, Fujian, China",
    caffeineLevel: 5.5,
    lTheanineLevel: 3.2,
    flavorProfile: ["smoky", "pine", "tarry", "woody", "roasted", "dried fruit"],
    processingMethods: ["withered", "smoked", "full-oxidation", "pine-fired"],
    geography: {
        altitude: 800,
        humidity: 80,
        latitude: 27.72,
        longitude: 117.67,
        harvestMonth: 5
    },
    expectedEffects: {
        dominant: "comforting",
        supporting: "grounding"
    }
},

// 6. Sheng Puerh (Raw, Young)
{
    name: "Young Sheng Puerh",
    originalName: "生普洱 (Shēng Pǔ'ěr)",
    type: "puerh",
    origin: "Xishuangbanna, Yunnan, China",
    caffeineLevel: 4.5,
    lTheanineLevel: 3.8,
    flavorProfile: ["bitter", "astringent", "floral", "grassy", "fruity", "mineral"],
    processingMethods: ["withered", "pan-fired", "sun-dried", "compressed"],
    geography: {
        altitude: 1500,
        humidity: 80,
        latitude: 22.0,
        longitude: 100.8,
        harvestMonth: 4
    },
    expectedEffects: {
        dominant: "energizing",
        supporting: "focusing"
    }
},

// 7. Tie Guan Yin (Traditional Style)
{
    name: "Traditional Tie Guan Yin",
    originalName: "铁观音 (Tiě Guān Yīn)",
    type: "oolong",
    origin: "Anxi, Fujian, China",
    caffeineLevel: 4.5,
    lTheanineLevel: 5.2,
    flavorProfile: ["roasted", "nutty", "woody", "minerally", "caramel", "orchid"],
    processingMethods: ["withered", "bruised", "partial-oxidation", "medium-roast"],
    geography: {
        altitude: 700,
        humidity: 75,
        latitude: 25.06,
        longitude: 117.67,
        harvestMonth: 5
    },
    expectedEffects: {
        dominant: "harmonizing",
        supporting: "grounding"
    }
},

// 8. Genmaicha
{
    name: "Genmaicha",
    originalName: "玄米茶 (Genmaicha)",
    type: "green",
    origin: "Shizuoka, Japan",
    caffeineLevel: 3.0,
    lTheanineLevel: 4.5,
    flavorProfile: ["toasted", "nutty", "grass", "cereal", "sweet", "vegetal"],
    processingMethods: ["steamed", "dried", "mixed-with-rice"],
    geography: {
        altitude: 400,
        humidity: 72,
        latitude: 34.97,
        longitude: 138.38,
        harvestMonth: 5
    },
    expectedEffects: {
        dominant: "comforting",
        supporting: "grounding"
    }
},



// 10. Oriental Beauty (Dong Fang Mei Ren)
{
    name: "Oriental Beauty",
    originalName: "东方美人 (Dōng Fāng Měi Rén)",
    type: "oolong",
    origin: "Hsinchu, Taiwan",
    caffeineLevel: 3.5,
    lTheanineLevel: 4.8,
    flavorProfile: ["honey", "peach", "muscat", "wood", "spice", "orchid"],
    processingMethods: ["withered", "bug-bitten", "oxidized", "light-roast"],
    geography: {
        altitude: 800,
        humidity: 80,
        latitude: 24.83,
        longitude: 121.02,
        harvestMonth: 6
    },
    expectedEffects: {
        dominant: "elevating",
        supporting: "harmonizing"
    }
}
];

export default teaDatabase;