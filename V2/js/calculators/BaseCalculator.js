/**
 * BaseCalculator - Abstract base class for all tea effect calculators
 * Provides a standard interface and contract for all calculator implementations
 */
export class BaseCalculator {
  constructor(config = {}) {
    this.config = config;
  }
  
  /**
   * Main public API that all calculators should implement
   * @param {Object} tea - The tea object to calculate effects for
   * @returns {Object} - Results containing inference and serialized data
   */
  calculate(tea) {
    const inference = this.infer(tea);
    return {
      inference: this.formatInference(inference),
      data: this.serialize(inference)
    };
  }
  
  /**
   * Perform the main calculation logic
   * @param {Object} tea - The tea object to analyze
   * @returns {Object} - Raw inference results
   */
  infer(tea) {
    throw new Error("infer() method must be implemented by child class");
  }
  
  /**
   * Format the inference results into human-readable format
   * @param {Object} inference - Raw inference data
   * @returns {Object|Array|String} - Formatted inference results
   */
  formatInference(inference) {
    throw new Error("formatInference() method must be implemented by child class");
  }
  
  /**
   * Convert inference results to serializable format
   * @param {Object} inference - Raw inference data
   * @returns {Object} - Serialized data suitable for storage
   */
  serialize(inference) {
    throw new Error("serialize() method must be implemented by child class");
  }
} 