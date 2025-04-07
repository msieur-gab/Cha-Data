// TeaTypeDescriptors.js
// Defines descriptors and explanations for tea types across different seasons

export const teaTypeDescriptors = {
    // Seasonal tea type characteristics
    seasonalCharacteristics: {
        green: {
            spring: "Green tea reaches its full potential in spring with fresh, vibrant flavors and high amino acid content. The sweet, vegetal notes perfectly match the season's awakening energy.",
            summer: "Green tea offers cooling properties in summer that help regulate body temperature. Its light character and refreshing quality make it ideal for warm weather.",
            fall: "Green tea becomes less aligned with the cooler fall weather, though vegetal sweetness can still complement early autumn. Lacks the warming quality ideal for this season.",
            winter: "Green tea is generally too light for winter's cold demands, lacking the warming properties needed. Better suited for warmer seasons."
        },
        white: {
            spring: "White tea's delicate, fresh character perfectly embodies spring's renewal. The minimal processing preserves spring's natural energy and subtle complexity.",
            summer: "White tea offers excellent cooling properties for summer heat. Its light body and gentle sweetness provide refreshment without heaviness.",
            fall: "White tea lacks the warming depth ideal for fall, though its subtle sweetness can still be pleasant. Not the most aligned with the season's energy.",
            winter: "White tea is typically too delicate for winter's need for warming, substantial teas. Its light body doesn't provide the comfort needed in cold weather."
        },
        yellow: {
            spring: "Yellow tea's gentle character and slight oxidation make it excellent for spring. Its sweet, mellow profile harmonizes with the season's awakening energy.",
            summer: "Yellow tea offers good balance in summer, being substantive yet still light enough for warm weather. Provides good refreshment with slight warmth.",
            fall: "Yellow tea transitions reasonably to early fall but lacks the full warming character ideal for the season. Middle-ground option as weather cools.",
            winter: "Yellow tea is generally too light for winter's demands, though more substantial than green tea. Better suited for transitional seasons."
        },
        oolong: {
            spring: "Light oolongs capture spring's vibrant energy with floral notes and bright character. Their balance of oxidation offers complexity while maintaining freshness.",
            summer: "Medium oolongs provide good balance in summer, offering substance without heaviness. Their complex character remains refreshing in warm weather.",
            fall: "Darker, roasted oolongs truly shine in fall, with warming notes of nuts, toast, and caramel that perfectly match the season's transitional energy.",
            winter: "Heavily roasted oolongs offer excellent warming properties for winter with deep, complex flavors that provide comfort and satisfaction in cold weather."
        },
        black: {
            spring: "Black tea can be somewhat heavy for spring's light energy, though first flush black teas offer seasonal brightness that can work well in this season.",
            summer: "Black tea can be warming for summer's heat, though lighter black teas served chilled can provide refreshing strength that stands up to ice.",
            fall: "Black tea truly belongs in fall, with malty, sweet, full-bodied characteristics that perfectly complement the season's cooling temperatures and changing energy.",
            winter: "Black tea offers ideal warming properties for winter with robust flavor, body, and heating energy that provides comfort during the coldest months."
        },
        dark: {
            spring: "Dark tea's heavy, earthy character contrasts with spring's light energy. Generally too substantial for the season's fresh, renewing qualities.",
            summer: "Dark tea's fermented character offers some cooling digestive benefits in summer, making it more suitable than expected for warm weather.",
            fall: "Dark tea's complex, earthy depth aligns beautifully with fall's introspective energy. The fermented richness creates perfect seasonal harmony.",
            winter: "Dark tea reaches its full potential in winter, with deep warming properties and substantial body that offers perfect balance to cold, dark days."
        },
        puerh: {
            spring: "Puerh tea, especially aged types, generally contrasts with spring's fresh character. Some younger sheng puerh can offer more seasonal alignment.",
            summer: "Puerh tea, particularly aged types, offers surprising cooling digestive properties that can be beneficial during summer's heat.",
            fall: "Puerh tea's earthy, complex character harmonizes with fall's transitional energy. Its depth and body provide satisfaction as temperatures cool.",
            winter: "Puerh tea, especially shou puerh, provides ideal warming energy for winter with deep, earthy richness that creates perfect seasonal harmony."
        }
    },

    // Additional information about tea types
    generalDescriptions: {
        green: "Green tea preserves the fresh character of the tea leaf through minimal oxidation. Processing typically involves quick heating to prevent oxidation, producing vibrant, vegetal flavors with cooling energy.",
        white: "White tea undergoes minimal processing with no oxidation, preserving delicate flavors and natural sweetness. Typically withered and dried, producing subtle complexity and gentle energy.",
        yellow: "Yellow tea follows a unique process similar to green tea but with an added yellowing step that reduces grassiness and adds mellowness. Creates a smooth character with balanced energy.",
        oolong: "Oolong tea spans a spectrum of partial oxidation (10-80%), creating remarkable diversity from light and floral to dark and roasted. Processing includes withering, bruising, partial oxidation, and often roasting.",
        black: "Black tea undergoes full oxidation, transforming the leaf's chemistry to develop rich, sweet flavors. Processing includes withering, rolling, oxidation, and firing, producing warming energy.",
        dark: "Dark tea undergoes unique post-fermentation with microorganisms that transform its chemistry. This aging process creates earthy, complex flavors with unique health benefits and balanced energy.",
        puerh: "Puerh tea from Yunnan can be sheng (raw) which ages naturally, or shou (ripe) which undergoes accelerated fermentation. Both develop complex, earthy characters that continue to evolve with time."
    },

    // Mapping for seasonal flavor affinities
    seasonalFlavorAffinities: {
        spring: ["floral", "fresh", "grassy", "vegetal", "bright", "green", "herbaceous", "light", "crisp"],
        summer: ["fruity", "citrus", "floral", "crisp", "mineral", "light", "refreshing", "bright"],
        fall: ["nutty", "toasty", "malty", "honey", "spicy", "woody", "earthy", "warm", "smooth"],
        winter: ["roasted", "chocolate", "spicy", "earthy", "woody", "malty", "full", "sweet", "deep", "rich"]
    },

    // Season opposites for explanation generation
    seasonOpposites: {
        spring: "fall",
        summer: "winter",
        fall: "spring",
        winter: "summer"
    }
};

export default teaTypeDescriptors; 