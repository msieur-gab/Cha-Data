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
            dominant: "soothing",
            supporting: "clarifying"
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
            dominant: "awakening",
            supporting: "balancing"
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
            dominant: "nurturing",
            supporting: "centering"
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
        "dominant": "balancing",
        "supporting": "peaceful"
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
            supporting: "peaceful"
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
            dominant: "revitalizing",
            supporting: "awakening"
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
            dominant: "peaceful",
            supporting: "soothing"
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
            dominant: "centering",
            supporting: "stabilizing"
        }
    }
];

export default teaDatabase;