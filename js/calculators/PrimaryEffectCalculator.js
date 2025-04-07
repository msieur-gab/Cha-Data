// PrimaryEffectCalculator.js
// Derives baseline dominant/supporting Primary Effects based on TCM properties,
// which are calculated using reliable tea data (Compounds, Geography, Processing).

import TeaGlobalMapping from '../props/TeaGlobalMapping.js';
import { validateObject } from '../utils/helpers.js';

// Define tea type specific effects using the 8 consolidated effects
const teaTypeEffects = {
  'white': { 'calming': 1.8, 'restorative': 1.5 },
  'green': { 'calming': 1.5, 'focusing': 1.3 },
  'oolong': { 'elevating': 1.5, 'harmonizing': 1.2 },
  'black': { 'energizing': 1.8, 'focusing': 1.5 },
  'puerh': { 'grounding': 1.8, 'comforting': 1.5 }
};

// Define common effect pairings for better supporting effect prediction using the 8 consolidated effects
const effectPairings = {
  'calming': ['focusing', 'restorative', 'harmonizing'],
  'energizing': ['focusing', 'elevating', 'harmonizing'],
  'elevating': ['energizing', 'harmonizing', 'focusing'],
  'comforting': ['grounding', 'restorative', 'harmonizing'],
  'focusing': ['energizing', 'calming', 'elevating'],
  'grounding': ['comforting', 'harmonizing', 'calming'],
  'harmonizing': ['calming', 'grounding', 'focusing'],
  'restorative': ['calming', 'comforting', 'harmonizing']
};

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
        const mandatoryFields = ['lTheanineLevel', 'caffeineLevel', 'processingMethods'];
        const mandatoryGeo = ['latitude', 'longitude', 'altitude'];

        if (!tea || typeof tea !== 'object') isValid = false;
        else {
            mandatoryFields.forEach(field => {
                if (tea[field] === undefined || tea[field] === null) isValid = false;
            });
            
            // Check geography fields if geography object exists
            if (tea.geography && typeof tea.geography === 'object') {
                mandatoryGeo.forEach(geoField => {
                    if (tea.geography[geoField] === undefined || tea.geography[geoField] === null) {
                        isValid = false;
                    }
                });
            } else {
                // Geography object is missing entirely
                isValid = false;
            }
        }

        if (!isValid) {
            console.warn(`PrimaryEffectCalculator: Missing mandatory data for tea: ${tea?.name || 'Unknown'}. Returning default effects.`);
            return { dominant: 'harmonizing', supporting: null }; // Default if mandatory data missing
        }

        // Create a safe copy for calculations
        const safeTea = {
            ...tea,
            geography: { ...(tea.geography || {}) }, // Ensure geography is an object
            processingMethods: [...(tea.processingMethods || [])], // Ensure processing is an array
            flavorProfile: [...(tea.flavorProfile || [])] // Ensure flavor is an array
        };

        // 2. Calculate TCM Profile using the mapping functions
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

        // Apply tea type specific boost
        if (safeTea.type && teaTypeEffects[safeTea.type.toLowerCase()]) {
            Object.entries(teaTypeEffects[safeTea.type.toLowerCase()]).forEach(([effect, boost]) => {
                effectScores[effect] = (effectScores[effect] || 0) + boost;
            });
        }

        // 4. Select Dominant and Supporting Effects
        const sortedEffects = Object.entries(effectScores).sort((a, b) => b[1] - a[1]);

        if (sortedEffects.length === 0 || sortedEffects[0][1] <= 0) {
            // If no effects scored positively, default to harmonizing
            return { dominant: 'harmonizing', supporting: null };
        }

        const dominant = sortedEffects[0][0];
        let supporting = null;

        // Apply secondary effect bias based on common pairings
        if (dominant && effectPairings[dominant]) {
            effectPairings[dominant].forEach((effect, index) => {
                // Boost likely secondary effects, with strongest boost to first option
                const boost = 0.8 - (index * 0.2);
                if (boost > 0) {
                    effectScores[effect] = (effectScores[effect] || 0) + boost;
                }
            });
            
            // Re-sort after applying the bias
            const updatedSortedEffects = Object.entries(effectScores).sort((a, b) => b[1] - a[1]);
            
            // Skip the dominant effect (which should still be first) when looking for supporting
            for (let i = 1; i < updatedSortedEffects.length; i++) {
                if (updatedSortedEffects[i][0] !== dominant && updatedSortedEffects[i][1] > 0) {
                    // Only count as supporting if score is reasonably high
                    if (updatedSortedEffects[i][1] > updatedSortedEffects[0][1] * 0.4) { // Lowered threshold to capture biased effects
                        supporting = updatedSortedEffects[i][0];
                        break;
                    }
                }
            }
        } else {
            // Original supporting effect selection if no bias applied
            for (let i = 1; i < sortedEffects.length; i++) {
                if (sortedEffects[i][0] !== dominant && sortedEffects[i][1] > 0) {
                    // Only count as supporting if score is reasonably high (at least 50% of dominant score)
                    if (sortedEffects[i][1] > sortedEffects[0][1] * 0.5) {
                        supporting = sortedEffects[i][0];
                        break;
                    }
                }
            }
        }

        // Optional: Tie-breaking logic for dominant effect
        if (sortedEffects.length > 1 && sortedEffects[0][1] === sortedEffects[1][1]) {
            const effect1 = sortedEffects[0][0];
            const effect2 = sortedEffects[1][0];
            // Alphabetical tie-break if scores are identical
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
     * Helper method for UI/debug to show the TCM profile
     * @param {object} tea - Tea object
     * @returns {object} - TCM profile with Yin/Yang, Element, and Qi Movement
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
            _details: { 
                yinYangScore: yinYangScore.toFixed(2), 
                elementScores, 
                qiScores 
            }
        };
    }
    
    /**
     * Calculate effect scores directly from the TCM profile
     * @param {object} tea - Tea object
     * @returns {object} - Mapping of effect IDs to scores
     */
    calculateTcmBasedEffectScores(tea) {
        const safeTea = { ...tea, geography: { ...(tea.geography || {}) }};
        
        // Calculate TCM properties
        const yinYangScore = this.mapCompoundRatioAndProcessingToYinYangScore(safeTea);
        const yinYangNature = this.getYinYangCategory(yinYangScore);
        
        const elementScores = this.mapGeographyAndProcessingToElementScores(safeTea);
        const primaryElement = Object.keys(elementScores).length > 0
            ? Object.entries(elementScores).sort((a, b) => b[1] - a[1])[0][0] : 'earth';
        
        const qiScores = this.mapCompoundsAndProcessingToQiMovementScores(safeTea);
        const primaryQiMovement = Object.keys(qiScores).length > 0
            ? Object.entries(qiScores).sort((a, b) => b[1] - a[1])[0][0] : 'balanced';
        
        // Aggregate scores from the TCM -> PrimaryEffect map
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
        
        return effectScores;
    }
}

export default PrimaryEffectCalculator;
