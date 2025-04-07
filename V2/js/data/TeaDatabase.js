// TeaDatabase.js
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
            energizing: 6,
            focusing: 7,
            harmonizing: 8,
            elevating: 9
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
            energizing: 9,
            focusing: 7,
            harmonizing: 6
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
            comforting: 9,
            grounding: 8,
            energizing: 5
        }
    },

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
            elevating: 9,
            calming: 7,
            harmonizing: 6
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
            energizing: 9,
            focusing: 8,
            grounding: 4
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
            calming: 9,
            restorative: 8,
            harmonizing: 6
        }
    },
    
    // BALANCED RATIO (1.0) WITH COMPLEX PROCESSING
    {
        name: "Aged Ripe Puerh",
        originalName: "熟普洱 (Shú Pǔ'ěr)",
        type: "puerh-shou",
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
            grounding: 9,
            comforting: 7,
            harmonizing: 6
        }
    },
    
    // FLORAL OOLONG
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
            longitude: 113.23,
            harvestMonth: 4
        },
        expectedEffects: {
            elevating: 8,
            energizing: 7,
            focusing: 6
        }
    },
    
    // MATCHA
    {
        name: "Ceremonial Matcha",
        originalName: "抹茶 (Matcha)",
        type: "green",
        origin: "Uji, Kyoto Prefecture, Japan",
        caffeineLevel: 5.5,
        lTheanineLevel: 8.5,
        flavorProfile: ["umami", "sweet", "grassy", "creamy", "vegetal"],
        processingMethods: ["shade-grown", "steamed", "stone-ground", "dried"],
        geography: {
            altitude: 250,
            humidity: 70,
            latitude: 34.88,
            longitude: 135.80,
            harvestMonth: 5
        },
        expectedEffects: {
            focusing: 9,
            energizing: 8,
            harmonizing: 7,
            calming: 6
        }
    },
    
    // RAW PUERH
    {
        name: "Young Sheng Puerh",
        originalName: "生普洱 (Shēng Pǔ'ěr)",
        type: "puerh-sheng",
        origin: "Xishuangbanna, Yunnan, China",
        caffeineLevel: 5.5,
        lTheanineLevel: 4.0,
        flavorProfile: ["bitter", "floral", "fruity", "vegetal", "mineral"],
        processingMethods: ["withered", "pan-fired", "sun-dried", "compressed"],
        geography: {
            altitude: 1700,
            humidity: 73,
            latitude: 22.01,
            longitude: 100.79,
            harvestMonth: 3
        },
        expectedEffects: {
            energizing: 9,
            focusing: 8,
            grounding: 4
        }
    }
];

// Helper functions for accessing the database
export const TeaDatabase = {
    /**
     * Get all teas in the database
     * @returns {Array} All tea objects
     */
    getAllTeas() {
        return [...teaDatabase];
    },
    
    /**
     * Find a tea by name
     * @param {string} name - The name to search for
     * @returns {Object|null} The tea object or null if not found
     */
    findByName(name) {
        if (!name) return null;
        
        const normalizedName = name.toLowerCase().trim();
        return teaDatabase.find(tea => 
            tea.name.toLowerCase().includes(normalizedName) ||
            (tea.originalName && tea.originalName.toLowerCase().includes(normalizedName))
        ) || null;
    },
    
    /**
     * Get teas by type
     * @param {string} type - The tea type to filter by
     * @returns {Array} Tea objects of the specified type
     */
    getByType(type) {
        if (!type) return [];
        
        const normalizedType = type.toLowerCase().trim();
        return teaDatabase.filter(tea => tea.type.toLowerCase() === normalizedType);
    },
    
    /**
     * Get teas by origin country or region
     * @param {string} origin - The origin to search for
     * @returns {Array} Matching tea objects
     */
    getByOrigin(origin) {
        if (!origin) return [];
        
        const normalizedOrigin = origin.toLowerCase().trim();
        return teaDatabase.filter(tea => 
            tea.origin.toLowerCase().includes(normalizedOrigin)
        );
    }
};

export default TeaDatabase; 