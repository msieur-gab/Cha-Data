# Tea Info Analysis System

## Overview

The Tea Info Analysis System is a web application designed to analyze tea properties and their potential effects based on known tea characteristics. 

The system analyzes teas based on four key dimensions:
- **Chemical Composition**: Primarily focusing on L-theanine and caffeine ratios
- **Flavor Profiles**: How different flavor notes influence physiological effects
- **Processing Methods**: How oxidation, drying, and other techniques alter tea properties
- **Geographical Influences**: How growing region may influence tea characteristics

By combining these factors, the system generates a holistic profile of each tea's potential effects, from cognitive benefits to emotional impacts.

The platform also includes advanced data analytics capabilities, generating personalized recommendations based on time of day, season, weather conditions, and user-specific needs. The system could help identifies optimal tea consumption patterns for individual health benefits.

## Scientific Foundation

The analysis engine is built on a pragmatic scientific approach that incorporates:

- **Circadian Rhythm Integration**: Recommendations aligned with natural human biological cycles, accounting for cortisol fluctuations and sleep-wake patterns
- **Compound Synergy Analysis**: Examination of how multiple compounds (beyond just L-theanine and caffeine) interact to create complex physiological effects
- **Bioavailability Modeling**: Calculations of how brewing methods affect the extraction and bioavailability of key compounds
- **Metabolic Pathway Tracking**: Mapping of how tea compounds are processed through different metabolic pathways
- **Neurotransmitter Impact Projections**: Predictions of how specific compounds influence neurotransmitter activity
- **Adaptogenic Response Curves**: Analysis of how regular consumption affects adaptogenic responses over time

This scientific foundation enables the system to provide evidence-based recommendations that account for the complex interplay between tea chemistry and human physiology.

## Key Features

- Analysis of L-theanine/caffeine compound ratios and their potential effects
- Interactive visualizations showing compound relationships
- Integration of traditional Eastern medicine concepts (Qi, Five Elements, Yin/Yang)
- User interface with visual feedback for intuitive understanding
- Seasonal consumption tracking
- Time-of-day tea recommendations
- Personal consumption tracking and visualization

## Project Structure

```
├── config/                   # Configuration related files
│   ├── EffectSystemConfig.js # Configuration management
│   └── defaultConfig.js      # Default configuration values
├── calculators/              # Specialized calculation modules
│   ├── CompoundCalculator.js # L-theanine/caffeine analysis
│   ├── FlavorCalculator.js   # Flavor profile influence
│   ├── ProcessingCalculator.js # Processing method influence
│   ├── GeographyCalculator.js # Geographical influence
│   └── InteractionCalculator.js # Effect interaction handling
├── utils/                    # Utility functions
│   ├── normalization.js      # Score normalization utilities
│   └── helpers.js            # General helper functions
├── data/                     # Tea data and reference data
│   ├── PrimaryEffects.js     # Core tea effects data
│   ├── FlavorInfluences.js   # Flavor to effect mappings
│   ├── ProcessingInfluences.js # Processing to effect mappings
│   ├── EffectCombinations.js # Effect interaction mappings
│   ├── GeographicalInfluences.js # Geography to effect mappings
│   ├── TeaDatabase.js        # Sample tea database
│   └── qi-tea-analysis-data-structure.js # Traditional analysis data
├── js/                       # Frontend JavaScript
│   └── app.js                # Main application logic
├── css/                      # Styling
│   └── styles.css            # Application styles
├── TeaEffectAnalyzer.js      # Main analyzer class integrating calculators
└── index.html                # Application entry point
```

## Core Analysis Modules

### CompoundCalculator

The `CompoundCalculator` analyzes the effects of L-theanine and caffeine levels in tea:

- Calculates compound level categories (high, moderate, low) for both L-theanine and caffeine
- Determines if the ratio is balanced, extreme, or very low
- Applies penalties for disharmonious ratios to certain effects
- Generates natural language descriptions of compound balance
- Provides visual representation of compound ratios

Key metrics:
- L-theanine to caffeine ratio (optimal range: 1.2-1.8)
- Balanced categories: high, moderate, low for both compounds
- Compound-specific boosts for relevant effects

### Other Calculators

- **FlavorCalculator**: Analyzes flavor profiles and their influence on effects
- **ProcessingCalculator**: Evaluates how processing methods impact tea effects
- **GeographyCalculator**: Analyzes geographical factors like altitude and latitude
- **InteractionCalculator**: Handles interactions between different effects

## Scientific Modules

### CircadianCalculator

The `CircadianCalculator` integrates chronobiology with tea recommendations:

- Maps cortisol and melatonin natural cycles throughout the day
- Adjusts caffeine recommendations based on cortisol levels
- Identifies optimal windows for different tea varieties
- Personalizes recommendations based on chronotype (morning/evening person)
- Accounts for sleep-wake cycle disruptions when providing recommendations
- Provides detailed timing windows for maximum benefit from specific compounds

### CompoundSynergyCalculator

The `CompoundSynergyCalculator` analyzes complex interactions between tea compounds:

- Evaluates synergistic effects between L-theanine, caffeine, EGCG, and other catechins
- Identifies potential antagonistic interactions between compounds
- Calculates bioavailability adjustments based on brewing methods
- Maps compound metabolism and their pathways through the body
- Projects neurotransmitter impacts of specific compound combinations
- Provides detailed reports on how compounds work together to create effects

## Advanced Analytics Components

### SeasonalityAnalyzer

The `SeasonalityAnalyzer` processes tea consumption data to identify seasonal patterns:

- Generates visualizations showing optimal tea types by season
- Analyzes correlation between weather conditions and tea preferences
- Creates seasonal recommendation charts based on historical consumption data
- Identifies trending seasonal flavor profiles
- Provides export-ready data for external analysis

### TimeBasedRecommender

The `TimeBasedRecommender` provides customized tea recommendations based on time of day:

- Morning recommendations focus on balanced stimulation for productivity
- Afternoon selections emphasize sustained focus with moderate caffeine
- Evening suggestions prioritize relaxation with minimal caffeine
- Analyzes user feedback to refine time-based preferences
- Integrates with calendar systems to adapt to schedule variations



## How It Works

The system uses a component-based architecture where:

1. Tea data is passed to the main `TeaEffectAnalyzer`
2. The analyzer delegates specific calculations to specialized calculators
3. Component scores are weighted and combined
4. Interactions between effects are applied
5. Results are normalized to create the final effect profile
6. Circadian factors are integrated to provide time-specific suggestions
7. Compound interactions are mapped to identify synergies and conflicts
8. The UI displays results with visual feedback
9. Analytics modules process consumption data to generate insights
10. Recommendation engines provide personalized suggestions
11. Visualization tools create interactive charts and graphs

## Compound Analysis Logic

The compound calculator applies several rules:

1. Categorizes L-theanine and caffeine levels:
   - High L-theanine: ≥ 7/10
   - Moderate L-theanine: 4-6.9/10
   - Low L-theanine: < 4/10
   - High caffeine: ≥ 5/10
   - Moderate caffeine: 3-4.9/10
   - Low caffeine: < 3/10

2. Analyzes the L-theanine to caffeine ratio:
   - Balanced: 1.2-1.8
   - Extremely high: > 3.0
   - Very low: < 0.5
   - Low: < 0.8

3. Applies boosts based on compound levels:
   - Calming effects (soothing, peaceful, clarifying) get boosted by high L-theanine
   - Stimulating effects (revitalizing, awakening, nurturing) get boosted by high caffeine
   - Balancing effects get boosted by balanced L-theanine and caffeine levels

4. Applies penalties for disharmonious ratios:
   - Balancing effects are penalized for extreme teas
   - Calming effects are penalized for very low L-theanine
   - Stimulating effects are penalized for extremely high L-theanine

## Compound Relationships

The primary relationship analyzed is between L-theanine and caffeine, but the system also considers other relationships:

| Compound Pair | Potential Relationship | Typical Ratio |
|----------|---------------|--------|
| L-theanine / Caffeine | Reduced jitters, improved focus | 1.2-1.8:1 |
| EGCG / Caffeine | Extended stimulation | 2:1 |
| Theobromine / Caffeine | Smoother stimulation curve | 1:2 |

## How It Works

The system uses a component-based architecture where:

1. Tea data is passed to the main `TeaEffectAnalyzer`
2. The analyzer delegates specific calculations to specialized calculators
3. Component scores are weighted and combined
4. Interactions between effects are applied
5. Results are normalized to create the final effect profile
6. The UI displays results with visual feedback

## Usage

To use the system:

1. Start the web server: `python -m http.server 8005`
2. Open your browser to `http://localhost:8005`
3. Select a tea from the dropdown to view its analysis
4. Explore the visual representation of compound effects and other analysis components
5. Create a user profile to access personalized recommendations
6. Log your tea consumption to generate trend visualizations
7. Use the seasonality charts to plan your tea purchases
8. Access time-based recommendations for optimal daily consumption
9. Explore the circadian alignment tool to optimize timing
10. View the compound interaction matrix for advanced insights

## Applications

This system can be useful for:
- Tea enthusiasts looking to understand the effects of different teas
- Tea shops wanting to provide detailed information to customers
- Researchers studying the relationship between tea compounds and effects
- Wellness practitioners interested in tea's therapeutic properties
- Traditional medicine practitioners integrating modern analysis with ancient wisdom
- Tea distributors analyzing seasonal consumption patterns
- Health coaches creating personalized tea regimens for clients
- Tea farmers tracking consumption trends to inform cultivation decisions
- Chronobiologists studying beverage effects on circadian rhythms
- Neurochemists researching compound synergies and interactions
- Sleep specialists developing tea-based sleep improvement protocols

## Data Collection and Privacy

The system collects anonymous usage data to improve recommendations and generate insights:
- All personal data is opt-in and can be deleted at any time
- Aggregated consumption data is used for trend analysis
- Weather data is collected via API but not linked to individual users
- Research data exports are anonymized and require explicit consent
- Local storage options are available for privacy-conscious users

## Development Notes

This is a tea analysis system with visualization capabilities. The modular structure allows for easy extension and modification of individual components. The analytics framework can be expanded to include additional data sources and visualization methods as needed. 