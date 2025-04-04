# Calculator Pattern: Inferer and Serializer

## Overview
The calculator pattern consists of two main components:
1. **Inferer**: Produces raw insights and reasoning
2. **Serializer**: Transforms insights into structured output formats

## Core Requirements
1. **Data Validation**: All input must be validated before processing
2. **Score Normalization**: All scores must be normalized (0-10 scale)
3. **Output Consistency**: All calculators must maintain consistent output structure
4. **Error Handling**: Graceful handling of edge cases and invalid inputs

## Implementation Pattern

```javascript
class Calculator {
    constructor(config) {
        this.config = config;
        this.validateConfig();
    }

    // Main API method
    calculate(input) {
        // 1. Validate input
        input = this.validateInput(input);
        
        // 2. Create safe version of input with defaults
        const safeInput = this.createSafeInput(input);
        
        // 3. Generate inference
        const inference = this.infer(safeInput);
        
        // 4. Validate inference structure
        this.validateInference(inference);
        
        return {
            inference: this.formatInference(inference),
            data: this.serialize(inference)
        };
    }

    // Input validation
    validateInput(input) {
        if (!input) throw new Error('Input is required');
        // Add specific validation rules
        return input;
    }

    // Create safe input with defaults
    createSafeInput(input) {
        return {
            ...this.getDefaultInput(),
            ...input
        };
    }

    // Get default values for input
    getDefaultInput() {
        return {
            // Default values
        };
    }

    // Validate inference structure
    validateInference(inference) {
        if (!inference) throw new Error('Inference is required');
        // Add specific validation rules
    }

    // Inferencer: Produces raw insights and reasoning
    infer(input) {
        // Calculate raw data and insights
        return {
            // Raw data and insights
        };
    }

    // Format inference as markdown
    formatInference(inference) {
        // Format raw insights into markdown
        return markdownString;
    }

    // Serializer: Transforms insights into structured JSON
    serialize(inference) {
        // Transform raw insights into structured data
        return {
            // Structured data
        };
    }
}
```

## Output Structure Requirements

### Inference Format
```javascript
{
    // Raw data and calculations
    rawData: {},
    // Processed insights
    insights: [],
    // Recommendations
    recommendations: [],
    // Warnings or cautions
    cautions: []
}
```

### Serialized Data Format
```javascript
{
    // Primary data
    data: {},
    // Visualization data
    chartData: {},
    // Metadata
    metadata: {}
}
```

## Integration with UI

### HTML Structure
```html
<div class="calculator-section">
    <div class="markdown-content" id="calculator-inference"></div>
    <div class="json-content" id="calculator-data"></div>
    <div class="visualization" id="calculator-chart"></div>
</div>
```

### JavaScript Integration
```javascript
// 1. Create calculator instance with validation
const calculator = new Calculator(config);

// 2. Calculate results with error handling
try {
    const result = calculator.calculate(input);
    
    // 3. Update UI components
    // Markdown display
    const inferenceElement = document.getElementById('calculator-inference');
    if (inferenceElement) {
        inferenceElement.innerHTML = result.inference;
    }
    
    // JSON data
    const dataElement = document.getElementById('calculator-data');
    if (dataElement) {
        dataElement.textContent = JSON.stringify(result.data, null, 2);
    }
    
    // Charts/visualizations
    if (result.data.chartData) {
        this.renderChart(result.data.chartData);
    }
} catch (error) {
    console.error('Calculator error:', error);
    // Display error message to user
}
```

## Best Practices

### Data Validation
1. Validate all input parameters
2. Provide default values for optional parameters
3. Normalize all scores to consistent scales
4. Handle edge cases gracefully

### Output Consistency
1. Maintain consistent data structures
2. Use standardized score ranges
3. Include metadata with all outputs
4. Document all output formats

### Error Handling
1. Catch and handle all potential errors
2. Provide meaningful error messages
3. Log errors for debugging
4. Gracefully degrade when possible

### Testing Requirements
1. Unit tests for all calculations
2. Validation tests for all inputs
3. Output format tests
4. Edge case tests

## Example: Timing Calculator Implementation

```javascript
class TimingCalculator extends Calculator {
    constructor(config) {
        super(config);
        this.validateConfig();
    }

    validateConfig() {
        if (!this.config.timeIntervals) {
            throw new Error('Time intervals configuration required');
        }
    }

    getDefaultInput() {
        return {
            caffeineLevel: 5,
            lTheanineLevel: 5,
            primaryEffects: []
        };
    }

    validateInference(inference) {
        if (!inference.timeScores) {
            throw new Error('Time scores required in inference');
        }
        if (!inference.recommendations) {
            throw new Error('Recommendations required in inference');
        }
    }

    infer(input) {
        // Implementation details...
    }

    formatInference(inference) {
        // Implementation details...
    }

    serialize(inference) {
        // Implementation details...
    }
}
``` 