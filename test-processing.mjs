// test-processing.mjs
// Import using ES module syntax
import ProcessingCalculator from './js/calculators/ProcessingCalculator.js';

// Create a simple tea object
const tea = {
  processingMethods: ['steamed', 'shade-grown'],
  caffeineLevel: 3,
  lTheanineLevel: 5
};

// Create calculator with empty config
const calculator = new ProcessingCalculator({});

try {
  // Test the calculateProcessingInfluence method
  const result = calculator.calculateProcessingInfluence(tea);
  
  // Display the result
  console.log('Test Result: Success');
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  // Display any errors
  console.error('Test Result: Error');
  console.error(error);
} 