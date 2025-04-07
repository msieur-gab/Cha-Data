# Tea Effect Analysis System V2

A comprehensive system for analyzing the effects of different teas based on their composition, processing, origin, and other factors. This system uses multiple specialized calculators to infer effects from tea data and provide detailed analysis.

## Project Structure

The project is organized into the following structure:

```
V2/
|-- js/
|   |-- calculators/              # Specialized calculator classes
|   |   |-- BaseCalculator.js     # Abstract base class for all calculators
|   |   |-- TeaEffectCalculator.js # Main calculator for tea effects
|   |   |-- FlavorCalculator.js   # Flavor influence calculator
|   |   |-- GeographyCalculator.js # Geographical influence calculator
|   |   |-- SeasonCalculator.js   # Seasonal influence calculator
|   |   |-- ProcessingCalculator.js # Processing methods calculator
|   |   |-- CompoundCalculator.js # Chemical compound calculator
|   |   |-- TeaTypeCalculator.js  # Tea type influence calculator
|   |   |-- InteractionCalculator.js # Compound interaction calculator
|   |   |-- TimingCalculator.js   # Effect timing calculator
|   |   |-- QiTeaAnalyzer.js      # Traditional energy effects calculator
|   |
|   |-- config/                   # Configuration files
|   |   |-- defaultConfig.js      # Default system configuration
|   |   |-- EffectSystemConfig.js # Effect system specific configuration
|   |
|   |-- data/                     # Data files
|   |   |-- TeaDatabase.js        # Reference tea database
|   |   |-- TeaModel.js           # Tea data structure definition
|   |
|   |-- utils/                    # Utility functions
|   |   |-- normalization.js      # Score normalization utilities
|   |
|   |-- TeaAnalysisSystem.js      # Main application class
|   |-- UIController.js           # UI interaction controller
|
|-- css/
|   |-- styles.css                # Main stylesheet
|
|-- index.html                    # Main entry point
|-- README.md                     # Project documentation
```

## Key Features

- **Modular Calculator System**: Each aspect of tea analysis is handled by a specialized calculator
- **Standardized Interface**: All calculators implement a common interface via the BaseCalculator class
- **Comprehensive Analysis**: Considers tea type, processing, geography, season, compounds, and more
- **Normalized Scoring**: Scores are normalized and combined to produce consistent, meaningful results
- **Interactive UI**: Clean, responsive interface for exploring tea analysis results
- **Traditional TCM Analysis**: Includes traditional Chinese medicine perspective on tea energy

## Calculator Classes

1. **BaseCalculator**: Abstract base class that defines the interface for all calculators
2. **TeaEffectCalculator**: Main calculator that determines overall tea effects
3. **FlavorCalculator**: Analyzes how flavor profile influences effects
4. **GeographyCalculator**: Considers altitude, humidity, and location
5. **SeasonCalculator**: Analyzes seasonal influences based on harvest time
6. **ProcessingCalculator**: Evaluates how processing methods affect properties
7. **CompoundCalculator**: Calculates effects based on chemical composition
8. **TeaTypeCalculator**: Determines inherent effects based on tea type
9. **InteractionCalculator**: Analyzes compound interactions
10. **TimingCalculator**: Examines how effects develop over time
11. **QiTeaAnalyzer**: Analyzes traditional energy effects from TCM perspective

## Data Model

The system uses a standardized tea data model that includes:

- Basic information (name, type, origin)
- Chemical composition (caffeine, L-theanine, catechins)
- Processing details (methods, oxidation level)
- Geographical data (altitude, humidity, coordinates)
- Flavor profile (primary and secondary notes)
- Expected effects (if known)

## Usage

To analyze a tea:

1. Select a tea from the dropdown menu
2. View basic tea information in the Info tab
3. Click "Analyze" to process the tea through all calculators
4. View the calculated effects in the Effects tab
5. Explore component contributions in the Components tab

## Development

### Adding a New Calculator

1. Create a new calculator class that extends `BaseCalculator`
2. Implement the required methods: `infer()`, `formatInference()`, and `serialize()`
3. Register the calculator in `TeaAnalysisSystem.js`

### Adding New Teas

Add new tea entries to `TeaDatabase.js` following the structure defined in `TeaModel.js`.

## Browser Compatibility

The system is designed for modern browsers that support ES6 features including:
- Classes
- Arrow functions
- Template literals
- Destructuring
- Optional chaining
- Spread operator

## License

This project is available for educational and research purposes.

## Credits

Developed as part of an effort to understand and document the complex effects of different tea varieties on human health and wellbeing. 