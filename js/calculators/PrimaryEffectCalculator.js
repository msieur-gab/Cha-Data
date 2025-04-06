// ./js/calculators/PrimaryEffectCalculator.js
// Derives baseline dominant/supporting Primary Effects based on TCM properties,
// which are calculated using reliable tea data (Compounds, Geography, Processing).

// Import mappings and helpers
import TeaGlobalMapping from '../props/TeaGlobalMapping.js'; // Import the mappings object
import { validateObject } from '../utils/helpers.js'; // Or your path to helpers

// Assume primaryEffects data is loaded or passed if needed for validation
// import { primaryEffects } from '../props/PrimaryEffects.js';

export class PrimaryEffectCalculator {
    constructor(config = {}) {
        this.config = config;
        // Store mappings from the imported object
        this.mapCompoundRatioAndProcessingToYinYangScore = TeaGlobalMapping.mapCompoundRatioAndProcessingToYinYangScore;
        this.mapGeographyAndProcessingToElementScores = TeaGlobalMapping.mapGeographyAndProcessingToElementScores;
        this.mapCompoundsAndProcessingToQiMovementScores = TeaGlobalMapping.mapCompoundsAndProcessingToQiMovementScores;
        this.tcmToPrimaryEffectMap = TeaGlobalMapping.tcmToPrimaryEffectMap;
        this.getYinYangCategory = TeaGlobalMapping.getYinYangCategory;
    }

    /**
     * Main calculation method. Derives baseline effects.
     * @param {object} tea - Tea object containing reliable data.
     * REQUIRES: lTheanineLevel, caffeineLevel, processingMethods,
     * geography: { latitude, longitude, altitude }
     * OPTIONAL: geography: { climate, features, soilType, yearlyAverageSunlight, averageHumidity }, flavorProfile
     * @returns {object} - { dominant: string|null, supporting: string|null }
     */
    deriveBaselineEffects(tea) {
        // 1. Validate Input: Check for mandatory fields
        let isValid = true;
        const mandatoryFields = ['lTheanineLevel', 'caffeineLevel', 'processingMethods', 'geography'];
        const mandatoryGeo = ['latitude', 'longitude', 'altitude'];

        if (!tea || typeof tea !== 'object') isValid = false;
        else {
            mandatoryFields.forEach(field => {
                if (tea[field] === undefined || tea[field] === null) isValid = false;
            });
            if (isValid) { // Only check geo if other fields are present
                if (!tea.geography || typeof tea.geography !== 'object') isValid = false;
                else {
                    mandatoryGeo.forEach(geoField => {
                        if (tea.geography[geoField] === undefined || tea.geography[geoField] === null) isValid = false;
                    });
                }
            }
        }

        if (!isValid) {
            console.warn("PrimaryEffectCalculator: Missing mandatory data for tea:", tea ? tea.name : 'Unknown', ". Returning default effects.");
            return { dominant: 'balancing', supporting: null }; // Default if mandatory data missing
        }

        // Create a safe copy for calculations, ensuring geography exists
         const safeTea = {
            ...tea,
            geography: { ...(tea.geography || {}) }, // Ensure geography is an object
            processingMethods: [...(tea.processingMethods || [])], // Ensure processing is an array
            flavorProfile: [...(tea.flavorProfile || [])] // Ensure flavor is an array
        };


        // 2. Calculate TCM Profile using the imported mapping functions
        const yinYangScore = this.mapCompoundRatioAndProcessingToYinYangScore(safeTea);
        const yinYangNature = this.getYinYangCategory(yinYangScore);

        const elementScores = this.mapGeographyAndProcessingToElementScores(safeTea);
        const primaryElement = Object.keys(elementScores).length > 0
            ? Object.entries(elementScores).sort((a, b) => b[1] - a[1])[0][0]
            : 'earth'; // Default element if scores are zero

        const qiScores = this.mapCompoundsAndProcessingToQiMovementScores(safeTea);
        const primaryQiMovement = Object.keys(qiScores).length > 0
             ? Object.entries(qiScores).sort((a, b) => b[1] - a[1])[0][0]
             : 'balanced'; // Default Qi movement

        // 3. Aggregate scores from the TCM -> PrimaryEffect map
        const effectScores = {};
        const qiMapKey = primaryQiMovement === 'balanced' ? 'balancedQi' : primaryQiMovement;
        const contributingFactors = [yinYangNature, primaryElement, qiMapKey];

        contributingFactors.forEach(factor => {
            if (this.tcmToPrimaryEffectMap[factor]) {
                this.tcmToPrimaryEffectMap[factor].forEach(([effect, strength]) => {
                    effectScores[effect] = (effectScores[effect] || 0) + strength;
                });
            }
        });

        // 4. Select Dominant and Supporting Effects
        const sortedEffects = Object.entries(effectScores).sort((a, b) => b[1] - a[1]);

        if (sortedEffects.length === 0 || sortedEffects[0][1] <= 0) {
             // If no effects scored positively, default to balancing
            return { dominant: 'balancing', supporting: null };
        }

        const dominant = sortedEffects[0][0];
        let supporting = null;

        // Find the next *different* effect with a positive score
        for (let i = 1; i < sortedEffects.length; i++) {
            if (sortedEffects[i][0] !== dominant && sortedEffects[i][1] > 0) {
                 // Add a threshold check? Only count as supporting if score is reasonably high?
                 // Example: Only if score is > 50% of dominant score
                 // if (sortedEffects[i][1] > sortedEffects[0][1] * 0.5) {
                      supporting = sortedEffects[i][0];
                      break;
                 // }
            }
        }

        // Optional: Tie-breaking logic for dominant effect
         if (sortedEffects.length > 1 && sortedEffects[0][1] === sortedEffects[1][1]) {
             const effect1 = sortedEffects[0][0];
             const effect2 = sortedEffects[1][0];
             // Alphabetical tie-break:
             if (effect2 < effect1) {
                 // If effect2 becomes dominant, effect1 becomes supporting (if different)
                 return { dominant: effect2, supporting: effect1 };
             }
             // If effect1 remains dominant, check if effect2 can be supporting
             if (effect2 !== effect1) {
                 supporting = effect2;
             }
         }

        return { dominant, supporting };
    }

     /**
      * Helper method for potential use in UI/debug to show the profile.
      */
     getTcmProfile(tea) {
         const safeTea = { ...tea, geography: { ...(tea.geography || {}) }};
         const yinYangScore = this.mapCompoundRatioAndProcessingToYinYangScore(safeTea);
         const yinYangNature = this.getYinYangCategory(yinYangScore);
         const elementScores = this.mapGeographyAndProcessingToElementScores(safeTea);
         const primaryElement = Object.keys(elementScores).length > 0
             ? Object.entries(elementScores).sort((a, b) => b[1] - a[1])[0][0] : 'earth';
         const qiScores = this.mapCompoundsAndProcessingToQiMovementScores(safeTea);
         const primaryQiMovement = Object.keys(qiScores).length > 0
             ? Object.entries(qiScores).sort((a, b) => b[1] - a[1])[0][0] : 'balanced';

         return {
             yinYang: yinYangNature,
             element: primaryElement,
             qiMovement: primaryQiMovement,
             _details: { yinYangScore: yinYangScore.toFixed(2), elementScores, qiScores }
         };
     }
}

// --- Example Usage (Conceptual) ---
/*
import { PrimaryEffectCalculator } from './calculators/PrimaryEffectCalculator.js';
import { teaDatabase } from '../TeaDatabase.js';

const primaryEffectCalc = new PrimaryEffectCalculator();
const sampleTea = teaDatabase.find(t => t.name === "Gyokuro"); // Make sure Gyokuro has mandatory data

if (sampleTea) {
    const baselineEffects = primaryEffectCalc.deriveBaselineEffects(sampleTea);
    console.log(`Derived Baseline Effects for ${sampleTea.name}:`, baselineEffects);

    // Use these baselineEffects in your main TeaEffectAnalyzer or debug logic
    // Example: baseScores[baselineEffects.dominant] = 9.5;
    // Example: if (baselineEffects.supporting) baseScores[baselineEffects.supporting] = 7.5;
}
*/

export default PrimaryEffectCalculator;