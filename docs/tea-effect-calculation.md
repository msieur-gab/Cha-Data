# Tea Effect Calculation System Documentation

## 1. Calculation Process Overview

The effect profile calculation is a weighted system that combines multiple data sources to produce the final effect scores for a tea.

### Calculation Order

1. **Calculate Raw Component Scores**:
   - Base scores from tea properties
   - Processing method influences
   - Geographic factor influences  
   - Flavor profile impacts
   - Chemical compound impacts

2. **Apply Component Weighting**:
   - Base tea properties: 40%
   - Processing methods: 18%
   - Geographic factors: 12%
   - Flavor profile: 12%
   - Chemical compounds: 18%

3. **Score Combination**:
   ```
   Final_Score = (BaseScore × 0.4) + (ProcessingScore × 0.18) + 
                (GeographyScore × 0.12) + (FlavorScore × 0.12) + 
                (CompoundScore × 0.18)
   ```

4. **Cap at Maximum**: Limit all scores to maximum of 10

5. **Apply Effect Interactions**: Adjust scores based on effect combinations

6. **Apply Expected Effect Protection**: Ensure expected dominant effect remains highest

## 2. Base Score Determination

Base scores are generated in `generateTeaEffectScores()` (debug.js) considering:

- **Expected Effects**: 
  - Dominant effect gets 9.5
  - Supporting effect gets 7.5

- **L-Theanine/Caffeine Ratio**:
  - If ratio > 1.5: Adds to "peaceful" (L-Theanine × 0.8) and "soothing" (L-Theanine × 0.7)
  - If ratio < 1.0: Adds to "revitalizing" (Caffeine × 0.9) and "awakening" (Caffeine × 0.7)

- **Processing Methods**:
  - shade-grown → clarifying +3
  - heavy-roast → nurturing +3, centering +2
  - minimal-processing/minimal-roast → elevating +2
  - aged → stabilizing +3

## 3. Handling Missing Components

The system handles missing components gracefully:

- In `TeaEffectAnalyzer.js`, component availability is specifically checked:
  ```javascript
  const availableDataSources = {
    compounds: true,  // Always available
    flavors: safeTea.flavorProfile.length > 0,
    processing: safeTea.processingMethods.length > 0,
    geography: safeTea.geography !== null
  };
  ```

- When components are missing:
  1. Their weights are set to 0
  2. Other weights are normalized to ensure they sum to 1.0
  3. Missing components contribute nothing to the calculation
  4. The system functions with partial data

## 4. Key Files & Functions

| Function | File | Purpose |
|----------|------|---------|
| `calculateTeaEffects()` | TeaEffectAnalyzer.js | Main calculation function |
| `generateTeaEffectScores()` | debug.js | Generates base scores |
| `renderComprehensiveAnalysis()` | debug.js | Visualization of effect build-up |
| `calculateProcessingInfluence()` | ProcessingCalculator.js | Processing method effects |
| `calculateGeographicEffects()` | GeographyCalculator.js | Geographic influence |
| `applyEffectInteractions()` | InteractionCalculator.js | Effect interactions |

## 5. Props/Data Dependencies

| Data | File | Usage |
|------|------|-------|
| `primaryEffects` | js/props/PrimaryEffects.js | Effect definitions |
| `processingInfluences` | js/props/ProcessingInfluences.js | Processing method effects |
| `effectCombinations` | js/props/EffectCombinations.js | Effect interaction data |
| `seasonalFactors` | js/props/SeasonalFactors.js | Seasonal influence data |

## 6. Implementation Details

The calculation is implemented with order-independence - the order of applying components doesn't matter because:
1. Each component's contribution is calculated separately
2. Weights are applied independently to each component
3. Weighted values are added together in a single step
4. This ensures consistent and reproducible results

For visualizing the build-up, the intermediate values are shown as cumulative additions, but internally the calculation is performed using the weighted formula. 