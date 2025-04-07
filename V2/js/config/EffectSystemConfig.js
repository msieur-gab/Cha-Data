// EffectSystemConfig.js
// Configuration management for tea effect analysis

import { defaultConfig } from './defaultConfig.js';

// Configuration class to manage settings with sensible defaults
export class EffectSystemConfig {
  constructor(overrides = {}) {
    // Start with default configuration and apply any overrides
    this.settings = {
      ...defaultConfig,
      ...overrides
    };
  }
  
  // Get a configuration value
  get(key) {
    // Handle nested keys like 'componentWeights.compounds'
    if (key.includes('.')) {
      const keys = key.split('.');
      let value = this.settings;
      
      for (const k of keys) {
        if (value === undefined || value === null) return undefined;
        value = value[k];
      }
      
      return value;
    }
    
    // Return direct key
    return this.settings[key];
  }
  
  // Set a configuration value
  set(key, value) {
    // Handle nested keys
    if (key.includes('.')) {
      const keys = key.split('.');
      let current = this.settings;
      
      // Navigate to the deepest object
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!current[k] || typeof current[k] !== 'object') {
          current[k] = {};
        }
        current = current[k];
      }
      
      // Set the value at the deepest level
      current[keys[keys.length - 1]] = value;
    } else {
      // Set direct key
      this.settings[key] = value;
    }
  }
  
  // Get entire configuration
  getAll() {
    return { ...this.settings };
  }
}

export default EffectSystemConfig; 