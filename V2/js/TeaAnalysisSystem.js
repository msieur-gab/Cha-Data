// TeaAnalysisSystem.js
// Main application class for the Tea Effect Analysis System

import { BaseCalculator } from './calculators/BaseCalculator.js';
import { TeaEffectCalculator } from './calculators/TeaEffectCalculator.js';
import { FlavorCalculator } from './calculators/FlavorCalculator.js';
import { GeographyCalculator } from './calculators/GeographyCalculator.js';
import { SeasonCalculator } from './calculators/SeasonCalculator.js';
import { ProcessingCalculator } from './calculators/ProcessingCalculator.js';
import { CompoundCalculator } from './calculators/CompoundCalculator.js';
import { TeaTypeCalculator } from './calculators/TeaTypeCalculator.js';
import { InteractionCalculator } from './calculators/InteractionCalculator.js';
import { TimingCalculator } from './calculators/TimingCalculator.js';
import { QiTeaAnalyzer } from './calculators/QiTeaAnalyzer.js';
import { defaultConfig } from './config/defaultConfig.js';
import { effectSystemConfig } from './config/EffectSystemConfig.js';
import { getAllTeas, findByName } from './data/TeaDatabase.js';
import * as Normalization from './utils/normalization.js';

export class TeaAnalysisSystem {
    constructor(config = {}) {
        // Merge default configuration with provided config
        this.config = { ...defaultConfig, ...effectSystemConfig, ...config };
        
        // Initialize calculators
        this.initializeCalculators();
        
        // Initialize state
        this.currentTea = null;
        this.currentResults = null;
    }
    
    // Initialize all calculator classes
    initializeCalculators() {
        this.calculators = {
            teaEffect: new TeaEffectCalculator(this.config),
            flavor: new FlavorCalculator(this.config),
            geography: new GeographyCalculator(this.config),
            season: new SeasonCalculator(this.config),
            processing: new ProcessingCalculator(this.config),
            compound: new CompoundCalculator(this.config),
            teaType: new TeaTypeCalculator(this.config),
            interaction: new InteractionCalculator(this.config),
            timing: new TimingCalculator(this.config),
            qi: new QiTeaAnalyzer(this.config)
        };
    }
    
    // Analyze a tea using all available calculators
    analyzeTea(tea) {
        if (!tea) {
            console.error('No tea data provided for analysis');
            return null;
        }
        
        this.currentTea = tea;
        const results = {};
        
        // Call each calculator's infer method
        Object.entries(this.calculators).forEach(([key, calculator]) => {
            try {
                const inference = calculator.infer(tea);
                const serialized = calculator.serialize(inference);
                
                // Merge serialized results
                Object.assign(results, serialized);
            } catch (error) {
                console.error(`Error in ${key} calculator:`, error);
                results[key + 'Error'] = error.message;
            }
        });
        
        // Process results through normalization if needed
        if (this.config.normalizeResults) {
            this.normalizeResults(results);
        }
        
        this.currentResults = results;
        return results;
    }
    
    // Generate formatted output for each analyzer
    generateFormattedOutput() {
        if (!this.currentTea || !this.currentResults) {
            return { error: 'No analysis has been performed yet' };
        }
        
        const formattedOutput = {};
        
        // Call each calculator's formatInference method
        Object.entries(this.calculators).forEach(([key, calculator]) => {
            try {
                // Find the relevant inference data for this calculator
                const inferenceKey = key + 'Inference';
                const inference = this.currentResults[inferenceKey] || 
                                 this.currentResults[key] || 
                                 null;
                
                if (inference) {
                    const formatted = calculator.formatInference(inference);
                    formattedOutput[key] = formatted;
                }
            } catch (error) {
                console.error(`Error formatting output for ${key}:`, error);
                formattedOutput[key] = `Error: ${error.message}`;
            }
        });
        
        return formattedOutput;
    }
    
    // Normalize all result scores
    normalizeResults(results) {
        // Collect all effect scores from different calculators
        const allScores = {};
        
        // Gather scores from each calculator's results
        Object.keys(this.calculators).forEach(key => {
            const scoreKey = key + 'Scores';
            if (results[scoreKey] && typeof results[scoreKey] === 'object') {
                Object.entries(results[scoreKey]).forEach(([effect, score]) => {
                    if (!allScores[effect]) {
                        allScores[effect] = [];
                    }
                    allScores[effect].push(score);
                });
            }
        });
        
        // Calculate composite scores by averaging
        const compositeScores = {};
        Object.entries(allScores).forEach(([effect, scores]) => {
            if (scores.length > 0) {
                // Calculate weighted average based on configuration
                compositeScores[effect] = this.calculateWeightedAverage(effect, scores);
            }
        });
        
        // Normalize the composite scores
        const normalizedScores = Normalization.normalizeScores(compositeScores);
        
        // Add normalized and enhanced scores to results
        results.compositeScores = compositeScores;
        results.normalizedScores = normalizedScores;
        
        // Determine dominant effect
        const dominantEffect = this.findDominantEffect(normalizedScores);
        if (dominantEffect) {
            results.dominantEffect = dominantEffect;
            
            // Enhance the dominant effect
            results.enhancedScores = Normalization.enhanceDominantEffect(
                normalizedScores,
                dominantEffect.effect
            );
        }
        
        return results;
    }
    
    // Calculate weighted average for a specific effect
    calculateWeightedAverage(effect, scores) {
        // Get weights from configuration
        const weights = this.config.componentWeights || {};
        const defaultWeight = 1;
        
        // If no weights are defined, use simple average
        if (Object.keys(weights).length === 0) {
            const sum = scores.reduce((acc, score) => acc + score, 0);
            return sum / scores.length;
        }
        
        // Calculate weighted sum
        let weightedSum = 0;
        let totalWeight = 0;
        
        scores.forEach((score, index) => {
            const componentKey = Object.keys(this.calculators)[index];
            const weight = (weights[componentKey] || defaultWeight);
            weightedSum += score * weight;
            totalWeight += weight;
        });
        
        return totalWeight > 0 ? weightedSum / totalWeight : 0;
    }
    
    // Find the dominant effect in normalized scores
    findDominantEffect(scores) {
        if (!scores || Object.keys(scores).length === 0) {
            return null;
        }
        
        let dominantEffect = null;
        let highestScore = -1;
        
        Object.entries(scores).forEach(([effect, score]) => {
            if (score > highestScore) {
                highestScore = score;
                dominantEffect = { effect, score };
            }
        });
        
        return dominantEffect;
    }
    
    // Get all available teas for analysis
    getAvailableTeas() {
        return getAllTeas();
    }
    
    // Find a specific tea by name
    findTeaByName(name) {
        return findByName(name);
    }
    
    // Get the current tea being analyzed
    getCurrentTea() {
        return this.currentTea;
    }
    
    // Get the current analysis results
    getCurrentResults() {
        return this.currentResults;
    }
    
    // Reset the analysis state
    reset() {
        this.currentTea = null;
        this.currentResults = null;
    }
}

// Initialize the system on page load if in browser environment
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        window.teaAnalysisSystem = new TeaAnalysisSystem();
        console.log('Tea Analysis System initialized');
    });
} 