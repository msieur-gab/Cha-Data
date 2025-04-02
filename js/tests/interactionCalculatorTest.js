// interactionCalculatorTest.js
// Simple test utility for the InteractionCalculator

import { EffectSystemConfig } from '../config/EffectSystemConfig.js';
import { InteractionCalculator } from '../calculators/InteractionCalculator.js';
import { effectCombinations } from '../props/EffectCombinations.js';
import { mapEffectCombinations } from '../utils/EffectInteractionMapper.js';
import { teaDatabase } from '../TeaDatabase.js';

// Create a test function to verify interaction calculator functionality
export function testInteractionCalculator() {
  console.log("Testing InteractionCalculator functionality");
  
  // Initialize configuration
  const config = new EffectSystemConfig();
  
  // Map effect combinations to add modifiers
  const mappedCombinations = mapEffectCombinations(effectCombinations);
  
  // Initialize the interaction calculator
  const calculator = new InteractionCalculator(config, mappedCombinations);
  
  // Test case 1: Simple effect interactions with artificial data
  const testScores1 = {
    "revitalizing": 8.5,
    "clarifying": 7.2,
    "peaceful": 2.1,
    "soothing": 1.8
  };
  
  console.log("Test Case 1: Original Scores", testScores1);
  const modifiedScores1 = calculator.applyEffectInteractions(testScores1);
  console.log("Test Case 1: Modified Scores", modifiedScores1);
  
  // Test case 2: Using real tea data - Gyokuro
  // Generate sample effect scores based on tea attributes
  const gyokuro = teaDatabase.find(tea => tea.name === "Gyokuro");
  const gyokuroScores = generateTeaEffectScores(gyokuro);
  
  console.log("Test Case 2: Gyokuro Original Scores", gyokuroScores);
  const modifiedGyokuroScores = calculator.applyEffectInteractions(gyokuroScores);
  console.log("Test Case 2: Gyokuro Modified Scores", modifiedGyokuroScores);
  
  // Test case 3: Using real tea data - Assam (high caffeine)
  const assam = teaDatabase.find(tea => tea.name === "Assam");
  const assamScores = generateTeaEffectScores(assam);
  
  console.log("Test Case 3: Assam Original Scores", assamScores);
  const modifiedAssamScores = calculator.applyEffectInteractions(assamScores);
  console.log("Test Case 3: Assam Modified Scores", modifiedAssamScores);
  
  // Test case 4: Identifying significant interactions
  console.log("Test Case 4: Identifying significant interactions for Gyokuro");
  const gyokuroInteractions = calculator.identifySignificantInteractions(gyokuroScores);
  console.log("Gyokuro Significant Interactions:", gyokuroInteractions);
  
  // Return results for further analysis
  return {
    testScores1,
    modifiedScores1,
    gyokuroScores,
    modifiedGyokuroScores,
    assamScores,
    modifiedAssamScores,
    gyokuroInteractions
  };
}

/**
 * Generate sample effect scores based on tea properties
 * This is a simplified scoring system just for testing
 * @param {Object} tea - Tea object from database
 * @returns {Object} - Effect scores for this tea
 */
function generateTeaEffectScores(tea) {
  if (!tea) return {};
  
  const scores = {};
  const ratio = tea.lTheanineLevel / tea.caffeineLevel;
  
  // Add expected effects with high scores
  if (tea.expectedEffects?.dominant) {
    scores[tea.expectedEffects.dominant] = 8.5;
  }
  
  if (tea.expectedEffects?.supporting) {
    scores[tea.expectedEffects.supporting] = 6.5;
  }
  
  // Add additional effects based on tea properties
  
  // L-Theanine dominant effects
  if (ratio > 1.5) {
    scores["peaceful"] = scores["peaceful"] || 0;
    scores["peaceful"] += Math.min(10, tea.lTheanineLevel * 0.8);
    
    scores["soothing"] = scores["soothing"] || 0;
    scores["soothing"] += Math.min(10, tea.lTheanineLevel * 0.7);
  }
  
  // Caffeine dominant effects
  if (ratio < 1.0) {
    scores["revitalizing"] = scores["revitalizing"] || 0;
    scores["revitalizing"] += Math.min(10, tea.caffeineLevel * 0.9);
    
    scores["awakening"] = scores["awakening"] || 0; 
    scores["awakening"] += Math.min(10, tea.caffeineLevel * 0.7);
  }
  
  // Processing method influences
  if (tea.processingMethods.includes("shade-grown")) {
    scores["clarifying"] = (scores["clarifying"] || 0) + 3;
  }
  
  if (tea.processingMethods.includes("heavy-roast")) {
    scores["nurturing"] = (scores["nurturing"] || 0) + 3;
    scores["centering"] = (scores["centering"] || 0) + 2;
  }
  
  if (tea.processingMethods.includes("minimal-processing") || tea.processingMethods.includes("minimal-roast")) {
    scores["elevating"] = (scores["elevating"] || 0) + 2;
  }
  
  if (tea.processingMethods.includes("aged")) {
    scores["stabilizing"] = (scores["stabilizing"] || 0) + 3;
  }
  
  // Normalize all scores to be between 0-10
  Object.keys(scores).forEach(key => {
    scores[key] = Math.min(10, Math.max(0, scores[key]));
  });
  
  return scores;
}

// If running directly in browser, run the test
if (typeof window !== 'undefined') {
  window.runInteractionTest = testInteractionCalculator;
  console.log("InteractionCalculator test loaded. Run window.runInteractionTest() in console to execute.");
}

export default testInteractionCalculator; 