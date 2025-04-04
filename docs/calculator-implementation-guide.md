# Calculator Implementation Guide

## Overview
This guide outlines the standard implementation process for adding new calculators to the tea effect system. Each calculator should follow this consistent pattern to ensure compatibility with the JSON export and TestSection display components.

## Implementation Checklist

### 1. Core Calculator Methods

#### calculate(tea)
```javascript
calculate(tea) {
    const inference = this.infer(tea);
    return {
        inference: this.formatInference(inference),
        data: {
            // Calculator-specific data fields
            field1: value1,
            field2: value2,
            // ...
        }
    };
}
```
**REMINDER**: Always return both `inference` and `data` objects. The `inference` is for display, `data` is for JSON export.

#### infer(tea)
```javascript
infer(tea) {
    // Calculator-specific inference logic
    return {
        // Inference data structure
    };
}
```
**REMINDER**: This method should contain the core calculation logic. Keep it separate from formatting concerns.

#### formatInference(inference)
```javascript
formatInference(inference) {
    let md = '';
    // Format inference as markdown
    return md;
}
```
**REMINDER**: 
- Always start with a main header (##)
- Use consistent markdown formatting
- Include visual elements for scores/ratings
- Keep sections clearly separated with newlines
- Use bullet points for lists
- Consider using tables for structured data

#### serialize(inference)
```javascript
serialize(inference) {
    return {
        // Serialized data structure matching JSON output
    };
}
```
**REMINDER**: The structure here should exactly match what you want in the final JSON output.

### 2. JSON Export Integration

#### Calculator Instantiation
```javascript
// In json-export.js
const nameCalculator = new NameCalculator(config);
```
**REMINDER**: Don't forget to pass the config object to the constructor.

#### Data Calculation
```javascript
const nameResult = nameCalculator.calculate(tea);
```
**REMINDER**: Store the result in a variable to avoid multiple calculations.

#### JSON Structure
```javascript
currentJsonData = {
    // ... other fields ...
    name: {
        ...nameResult.data,
        _sectionRef: 'name'
    }
};
```
**REMINDER**: 
- Always include the `_sectionRef`
- Spread the data from the calculator result
- Keep the structure consistent with other calculators

### 3. TestSection Integration

The `formatInference()` method should produce markdown that is compatible with the TestSection component. Follow these formatting guidelines:

- Use markdown headers (##, ###) for sections
- Use bullet points for lists
- Use tables for structured data
- Include visual indicators (bars, symbols) for scores/ratings

**REMINDER**: 
- Test the markdown output in the TestSection component
- Ensure all sections are properly formatted
- Verify that visual elements render correctly

## Implementation Steps

1. Create new calculator class
2. Implement core methods
3. Test calculator independently
4. Integrate with JSON export
5. Verify TestSection display
6. Document the calculator

**REMINDER**: Follow these steps in order. Don't skip testing steps.

## Example Implementation

```javascript
class ExampleCalculator {
    constructor(config) {
        this.config = config;
    }

    calculate(tea) {
        const inference = this.infer(tea);
        return {
            inference: this.formatInference(inference),
            data: {
                field1: inference.field1,
                field2: inference.field2
            }
        };
    }

    infer(tea) {
        // Implementation logic
        return {
            field1: value1,
            field2: value2
        };
    }

    formatInference(inference) {
        let md = '## Example Analysis\n\n';
        md += `- Field 1: ${inference.field1}\n`;
        md += `- Field 2: ${inference.field2}\n`;
        return md;
    }

    serialize(inference) {
        return {
            field1: inference.field1,
            field2: inference.field2
        };
    }
}
```

## Best Practices

1. **Error Handling**
   - Add try/catch blocks where appropriate
   - Handle edge cases gracefully
   - Provide meaningful error messages

2. **Documentation**
   - Add JSDoc comments for all methods
   - Document expected input/output formats
   - Include usage examples

3. **Testing**
   - Test each method independently
   - Test integration with other components
   - Verify markdown formatting

4. **Consistency**
   - Follow naming conventions
   - Maintain consistent return structures
   - Keep markdown formatting style uniform

5. **Performance**
   - Optimize calculations where possible
   - Cache results when appropriate
   - Consider memory usage

## Common Pitfalls to Avoid

1. Inconsistent data structures between `calculate()` and `serialize()`
2. Missing error handling
3. Inconsistent markdown formatting
4. Forgetting to add `_sectionRef` in JSON output
5. Not testing all edge cases

## Specific Reminders for AI Assistant

1. **Before Making Changes**
   - Review existing calculator implementations
   - Check the TestSection component for display requirements
   - Verify JSON export structure

2. **During Implementation**
   - Keep the data flow clear: tea → infer → format → display
   - Ensure markdown formatting is consistent
   - Test each method as you implement it

3. **After Implementation**
   - Verify the calculator works with TestSection
   - Check JSON export structure
   - Ensure all edge cases are handled

4. **When Debugging**
   - Check the data flow at each step
   - Verify markdown formatting
   - Test with different tea inputs 