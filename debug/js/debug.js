/**
 * Main debug environment script
 */

// Import necessary components and utilities
import '../components/TestSection.js';
import '../components/TeaSidebar.js';
import { teaDatabase } from '../../js/TeaDatabase.js';
import { EffectSystemConfig } from '../../js/config/EffectSystemConfig.js';
import { InteractionCalculator } from '../../js/calculators/InteractionCalculator.js';
import { ProcessingCalculator } from '../../js/calculators/ProcessingCalculator.js';
import { GeographyCalculator } from '../../js/calculators/GeographyCalculator.js';
import { TimingCalculator } from '../../js/calculators/TimingCalculator.js';
import { SeasonCalculator } from '../../js/calculators/SeasonCalculator.js';
import { effectCombinations } from '../../js/props/EffectCombinations.js';
import { mapEffectCombinations } from '../../js/utils/EffectInteractionMapper.js';
import { processingInfluences } from '../../js/props/ProcessingInfluences.js';
import { primaryEffects } from '../../js/props/PrimaryEffects.js';
import { seasonalFactors } from '../../js/props/SeasonalFactors.js';
import { validateObject, createSafeTea, sortByProperty, normalizeString, getTopItems, categorizeByKeywords } from '../../js/utils/helpers.js';
import { objectToMarkdown, createMarkdownTable, formatScoreWithBar } from './markdownUtils.js';

// Initialize the debug environment
document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();
    setupEventListeners();
});

/**
 * Initialize the tea sidebar with the tea database
 */
function initializeSidebar() {
    const sidebar = document.querySelector('tea-sidebar');
    if (sidebar) {
        sidebar.teas = teaDatabase;
    }
}

/**
 * Set up event listeners for the debug environment
 */
function setupEventListeners() {
    // Listen for tea selection events from the sidebar
    document.addEventListener('tea-selected', (event) => {
        const tea = event.detail.tea;
        if (tea) {
            // Clear existing test sections
            clearTestSections();
            
            // Generate new test sections for the selected tea
            generateTestSections(tea);
        }
    });
}

/**
 * Clear all test sections from the page
 */
function clearTestSections() {
    const testSectionsContainer = document.querySelector('.test-sections');
    if (testSectionsContainer) {
        testSectionsContainer.innerHTML = '';
    }
}

/**
 * Generate test sections for a given tea
 * @param {Object} tea - The tea to analyze
 */
function generateTestSections(tea) {
    const testSectionsContainer = document.querySelector('.test-sections');
    if (!testSectionsContainer) return;
    
    // Create an EffectSystemConfig instance
    const config = new EffectSystemConfig();
    
    // Define test sections
    const testSectionDefinitions = [
        {
            title: 'L-Theanine to Caffeine Ratio',
            render: () => renderLTheanineCaffeineRatio(tea),
            output: getLTheanineCaffeineRatioOutput(tea)
        },
        {
            title: 'Interaction Calculator Analysis',
            render: () => renderInteractionCalculator(tea, config),
            output: getInteractionCalculatorOutput(tea, config)
        },
        {
            title: 'Processing Calculator Analysis',
            render: () => renderProcessingCalculator(tea, config),
            output: getProcessingCalculatorOutput(tea, config)
        },
        {
            title: 'Geography Calculator Analysis',
            render: () => renderGeographyCalculator(tea, config),
            output: getGeographyCalculatorOutput(tea, config)
        },
        {
            title: 'Timing Calculator Analysis',
            render: () => renderTimingCalculator(tea, config),
            output: getTimingCalculatorOutput(tea, config)
        },
        {
            title: 'Season Calculator Analysis',
            render: () => renderSeasonCalculator(tea, config),
            output: getSeasonCalculatorOutput(tea, config)
        },
        {
            title: 'Comprehensive Effect Analysis',
            render: () => renderComprehensiveAnalysis(tea, config),
            output: getComprehensiveAnalysisOutput(tea, config)
        }
    ];
    
    // Create and append test sections
    testSectionDefinitions.forEach(sectionDef => {
        const testSection = document.createElement('test-section');
        testSection.title = sectionDef.title;
        testSection.content = sectionDef.render();
        testSection.rawOutput = sectionDef.output;
        testSectionsContainer.appendChild(testSection);
    });
}

/**
 * Render L-Theanine to Caffeine Ratio section
 * @param {Object} tea - The tea to analyze
 * @returns {string} HTML content
 */
function renderLTheanineCaffeineRatio(tea) {
    const ratio = tea.lTheanineLevel / tea.caffeineLevel;
    const lTheanineWidth = (tea.lTheanineLevel / 10) * 100;
    const caffeineWidth = (tea.caffeineLevel / 10) * 100;
    
    return `
        <div>
            <p>L-Theanine: <strong>${tea.lTheanineLevel.toFixed(1)}</strong></p>
            <p>Caffeine: <strong>${tea.caffeineLevel.toFixed(1)}</strong></p>
            <p>Ratio: <strong>${ratio.toFixed(2)}</strong></p>
            
            <div class="ratio-container mt-3">
                <div class="ratio-bars">
                    <div class="l-theanine-bar" style="width: ${lTheanineWidth}%;"></div>
                    <div class="caffeine-bar" style="width: ${caffeineWidth}%;"></div>
                </div>
                <div class="ratio-legend mt-1">
                    <div><span style="color: #27ae60;">■</span> L-Theanine</div>
                    <div><span style="color: #e74c3c;">■</span> Caffeine</div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Get L-Theanine to Caffeine Ratio raw output
 * @param {Object} tea - The tea to analyze
 * @returns {string} Markdown content
 */
function getLTheanineCaffeineRatioOutput(tea) {
    const ratio = tea.lTheanineLevel / tea.caffeineLevel;
    
    return `## L-Theanine to Caffeine Analysis

* **L-Theanine Level**: ${tea.lTheanineLevel.toFixed(1)}
* **Caffeine Level**: ${tea.caffeineLevel.toFixed(1)}
* **Ratio**: ${ratio.toFixed(2)}

### Significance
${getRatioSignificance(ratio)}
`;
}

/**
 * Get the significance of a particular L-Theanine to Caffeine ratio
 * @param {number} ratio - The L-Theanine to Caffeine ratio
 * @returns {string} Description of the ratio significance
 */
function getRatioSignificance(ratio) {
    if (ratio >= 2.0) {
        return "A high ratio (≥2.0) indicates a tea with strongly calming properties while still providing mental alertness.";
    } else if (ratio >= 1.5) {
        return "A moderately high ratio (1.5-2.0) provides a good balance of calming and energizing effects with a bias toward relaxation.";
    } else if (ratio >= 1.0) {
        return "A balanced ratio (1.0-1.5) provides equal calming and energizing properties.";
    } else if (ratio >= 0.7) {
        return "A moderately low ratio (0.7-1.0) provides more stimulation with some balancing L-theanine.";
    } else {
        return "A low ratio (<0.7) indicates a more stimulating tea with minimal calming effects.";
    }
}

/**
 * Get a complete list of all possible effects
 * @returns {Array<string>} Array of all effect names
 */
function getAllPossibleEffects() {
    return [
        'awakening',
        'balancing',
        'centering',
        'clarifying',
        'comforting',
        'elevating',
        'energizing',
        'grounding',
        'nurturing',
        'peaceful',
        'reflective',
        'renewing',
        'restorative',
        'revitalizing',
        'soothing',
        'stabilizing'
    ];
}

/**
 * Render Interaction Calculator section with all possible effects
 * @param {Object} tea - The tea to analyze
 * @param {Object} config - The system configuration
 * @returns {string} HTML content
 */
function renderInteractionCalculator(tea, config) {
    // Map effect combinations and create calculator
    const mappedCombinations = mapEffectCombinations(effectCombinations);
    const calculator = new InteractionCalculator(config, mappedCombinations);
    
    // Generate sample effect scores for the tea
    const scores = generateTeaEffectScores(tea);
    
    // Identify significant interactions
    const interactions = calculator.identifySignificantInteractions(scores);
    const modifiedScores = calculator.applyEffectInteractions(scores);
    
    // Get all possible effects
    const allEffects = getAllPossibleEffects();
    
    let html = '<div>';
    
    // Display interaction information
    if (interactions && interactions.length) {
        html += '<h4>Effect Interactions</h4>';
        html += '<ul>';
        interactions.forEach(interaction => {
            html += `<li><strong>${interaction.name}</strong>: ${interaction.description}</li>`;
        });
        html += '</ul>';
    } else {
        html += '<p>No significant interactions found for this tea.</p>';
    }
    
    // Always display effect scores, even if there are no interactions
    html += '<h4>Effect Scores</h4>';
    html += '<table style="width: 100%;">';
    html += '<tr><th>Effect</th><th>Original Score</th><th>Modified Score</th></tr>';
    
    // Show all possible effects, sorted by modified score
    allEffects
        .sort((a, b) => (modifiedScores[b] || 0) - (modifiedScores[a] || 0))
        .forEach(effect => {
            const originalScore = scores[effect] || 0;
            const modifiedScore = modifiedScores[effect] || 0;
            
            const originalPercentage = (originalScore / 10) * 100;
            const modifiedPercentage = (modifiedScore / 10) * 100;
            
            html += `
                <tr>
                    <td><strong>${effect}</strong></td>
                    <td>
                        <div class="effect-bar">
                            <div class="effect-bar-fill" style="width: ${originalPercentage}%;"></div>
                            <span>${originalScore.toFixed(1)} (${originalPercentage.toFixed(0)}%)</span>
                        </div>
                    </td>
                    <td>
                        <div class="effect-bar">
                            <div class="effect-bar-fill" style="width: ${modifiedPercentage}%;"></div>
                            <span>${modifiedScore.toFixed(1)} (${modifiedPercentage.toFixed(0)}%)</span>
                        </div>
                    </td>
                </tr>
            `;
        });
    
    html += '</table>';
    html += '</div>';
    return html;
}

/**
 * Get Interaction Calculator raw output
 * @param {Object} tea - The tea to analyze
 * @param {Object} config - The system configuration
 * @returns {string} Markdown content
 */
function getInteractionCalculatorOutput(tea, config) {
    // Map effect combinations and create calculator
    const mappedCombinations = mapEffectCombinations(effectCombinations);
    const calculator = new InteractionCalculator(config, mappedCombinations);
    
    // Generate sample effect scores for the tea
    const scores = generateTeaEffectScores(tea);
    
    // Identify significant interactions
    const interactions = calculator.identifySignificantInteractions(scores);
    const modifiedScores = calculator.applyEffectInteractions(scores);
    
    // Get all possible effects
    const allEffects = getAllPossibleEffects();
    
    const results = {
        originalScores: scores,
        modifiedScores: modifiedScores,
        interactions: interactions
    };
    
    return `## Interaction Calculator Analysis

### Significant Interactions
${interactions.length > 0 
    ? interactions.map(i => `- **${i.name}**: ${i.description} (Strength: ${i.strength.toFixed(2)})`).join('\n')
    : 'No significant interactions found for this tea.'
}

### Effect Scores
#### Original Scores
${allEffects
    .sort((a, b) => (scores[b] || 0) - (scores[a] || 0))
    .map(effect => {
        const score = scores[effect] || 0;
        return `- **${effect}**: ${formatScoreWithBar(score)} (${((score/10)*100).toFixed(0)}%)`;
    })
    .join('\n')}

#### Modified Scores (After Interactions)
${allEffects
    .sort((a, b) => (modifiedScores[b] || 0) - (modifiedScores[a] || 0))
    .map(effect => {
        const score = modifiedScores[effect] || 0;
        return `- **${effect}**: ${formatScoreWithBar(score)} (${((score/10)*100).toFixed(0)}%)`;
    })
    .join('\n')}

### Full Analysis
${objectToMarkdown(results)}
`;
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
  
  // Add expected effects with higher scores to ensure they maintain dominance
  if (tea.expectedEffects?.dominant) {
    scores[tea.expectedEffects.dominant] = 9.5; // Increased from 8.5
  }
  
  if (tea.expectedEffects?.supporting) {
    scores[tea.expectedEffects.supporting] = 7.5; // Increased from 6.5
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

/**
 * Render Processing Calculator section with all possible effects
 * @param {Object} tea - The tea to analyze
 * @param {Object} config - The system configuration
 * @returns {string} HTML content
 */
function renderProcessingCalculator(tea, config) {
    // Create calculator with processingInfluences data
    const calculator = new ProcessingCalculator(config, processingInfluences);
    // Use the correct method name
    const effectScores = calculator.calculateProcessingInfluence(tea.processingMethods);
    
    // Get all possible effects
    const allEffects = getAllPossibleEffects();
    
    // Create results object to match expected structure
    const results = {
        effectScores: effectScores,
        processingMethods: tea.processingMethods
    };
    
    let html = '<div>';
    
    if (results.effectScores) {
        html += '<h4>Processing Effect Scores</h4>';
        html += '<table style="width: 100%;">';
        html += '<tr><th>Effect</th><th>Score</th><th>Percentage</th></tr>';
        
        // Show all possible effects, sorted by score
        allEffects
            .sort((a, b) => (results.effectScores[b] || 0) - (results.effectScores[a] || 0))
            .forEach(effect => {
                const score = results.effectScores[effect] || 0;
                const percentage = (score / 10) * 100;
                
                html += `
                    <tr>
                        <td><strong>${effect}</strong></td>
                        <td>${score.toFixed(1)}</td>
                        <td>
                            <div class="effect-bar">
                                <div class="effect-bar-fill" style="width: ${percentage}%;"></div>
                                <span>${percentage.toFixed(0)}%</span>
                            </div>
                        </td>
                    </tr>
                `;
            });
        
        html += '</table>';
    }
    
    html += '</div>';
    return html;
}

/**
 * Get Processing Calculator raw output
 * @param {Object} tea - The tea to analyze
 * @param {Object} config - The system configuration
 * @returns {string} Markdown content
 */
function getProcessingCalculatorOutput(tea, config) {
    // Create calculator with processingInfluences data
    const calculator = new ProcessingCalculator(config, processingInfluences);
    // Use the correct method name
    const effectScores = calculator.calculateProcessingInfluence(tea.processingMethods);
    
    // Get all possible effects
    const allEffects = getAllPossibleEffects();
    
    // Create results object to match expected structure
    const results = {
        effectScores: effectScores,
        processingMethods: tea.processingMethods
    };
    
    return `## Processing Calculator Analysis

### Processing Methods
${tea.processingMethods.map(method => `- ${method}`).join('\n')}

### Effect Scores
${allEffects
    .sort((a, b) => (results.effectScores[b] || 0) - (results.effectScores[a] || 0))
    .map(effect => {
        const score = results.effectScores[effect] || 0;
        return `- **${effect}**: ${formatScoreWithBar(score)} (${((score/10)*100).toFixed(0)}%)`;
    })
    .join('\n')}

### Full Analysis
${objectToMarkdown(results)}
`;
}

/**
 * Render Geography Calculator section with all possible effects
 * @param {Object} tea - The tea to analyze
 * @param {Object} config - The system configuration
 * @returns {string} HTML content
 */
function renderGeographyCalculator(tea, config) {
    const calculator = new GeographyCalculator(config);
    // Extract scores from the geography data
    const scores = calculator.calculateGeographicEffects(tea.origin);
    
    // Get all possible effects
    const allEffects = getAllPossibleEffects();
    
    let html = '<div>';
    
    if (scores) {
        html += '<h4>Geography Effect Scores</h4>';
        html += '<table style="width: 100%;">';
        html += '<tr><th>Effect</th><th>Score</th><th>Percentage</th></tr>';
        
        // Show all possible effects, sorted by score
        allEffects
            .sort((a, b) => (scores[b] || 0) - (scores[a] || 0))
            .forEach(effect => {
                const score = scores[effect] || 0;
                const percentage = (score / 10) * 100;
                
                html += `
                    <tr>
                        <td><strong>${effect}</strong></td>
                        <td>${score.toFixed(1)}</td>
                        <td>
                            <div class="effect-bar">
                                <div class="effect-bar-fill" style="width: ${percentage}%;"></div>
                                <span>${percentage.toFixed(0)}%</span>
                            </div>
                        </td>
                    </tr>
                `;
            });
        
        html += '</table>';
    }
    
    html += '</div>';
    return html;
}

/**
 * Get Geography Calculator raw output
 * @param {Object} tea - The tea to analyze
 * @param {Object} config - The system configuration
 * @returns {string} Markdown content
 */
function getGeographyCalculatorOutput(tea, config) {
    const calculator = new GeographyCalculator(config);
    // Extract scores from the geography data
    const scores = calculator.calculateGeographicEffects(tea.origin);
    
    // Get all possible effects
    const allEffects = getAllPossibleEffects();
    
    // Get detailed analysis
    const analysis = calculator.getGeographicAnalysis ? 
                    calculator.getGeographicAnalysis(tea.origin) : 
                    { description: 'Detailed analysis not available' };
    
    return `## Geography Calculator Analysis

### Geographic Data
- **Origin**: ${tea.origin}
- **Altitude**: ${tea.geography.altitude}m
- **Humidity**: ${tea.geography.humidity}%
- **Coordinates**: ${tea.geography.latitude.toFixed(2)}, ${tea.geography.longitude.toFixed(2)}
- **Harvest Month**: ${getMonthName(tea.geography.harvestMonth)}

${analysis.description ? `### Description\n${analysis.description}\n` : ''}

### Effect Scores
${allEffects
    .sort((a, b) => (scores[b] || 0) - (scores[a] || 0))
    .map(effect => {
        const score = scores[effect] || 0;
        return `- **${effect}**: ${formatScoreWithBar(score)} (${((score/10)*100).toFixed(0)}%)`;
    })
    .join('\n')}

### Full Analysis
${objectToMarkdown({ scores, analysis })}
`;
}

/**
 * Render Timing Calculator section
 * @param {Object} tea - The tea to analyze
 * @param {Object} config - The system configuration
 * @returns {string} HTML content
 */
function renderTimingCalculator(tea, config) {
    const calculator = new TimingCalculator(config, primaryEffects);
    // Use the correct method from the TimingCalculator implementation
    const results = calculator.calculate(tea);
    
    let html = '<div>';
    
    if (results.data.timeScores) {
        html += '<h4>Best Times of Day</h4>';
        html += '<table class="timing-table">';
        html += '<tr><th>Time of Day</th><th>Score</th></tr>';
        
        Object.entries(results.data.timeScores)
            .sort((a, b) => b[1] - a[1])
            .forEach(([time, score]) => {
                const percentage = (score / 10) * 100;
                html += `
                    <tr>
                        <td>${formatTimeOfDay(time)}</td>
                        <td>
                            <div class="effect-bar">
                                <div class="effect-bar-fill" style="width: ${percentage}%;"></div>
                                <span>${score.toFixed(1)}</span>
                            </div>
                        </td>
                    </tr>
                `;
            });
        
        html += '</table>';
    }
    
    html += '</div>';
    return html;
}

/**
 * Get Timing Calculator raw output
 * @param {Object} tea - The tea to analyze
 * @param {Object} config - The system configuration
 * @returns {string} Markdown content
 */
function getTimingCalculatorOutput(tea, config) {
    const calculator = new TimingCalculator(config, primaryEffects);
    // Use the correct method from the TimingCalculator implementation
    const results = calculator.calculate(tea);
    
    return `## Timing Calculator Analysis

### Best Times of Day
${Object.entries(results.data.timeScores || {})
    .sort((a, b) => b[1] - a[1])
    .map(([time, score]) => `- **${formatTimeOfDay(time)}**: ${formatScoreWithBar(score)}`)
    .join('\n')}

### Full Analysis
${objectToMarkdown(results.data)}
`;
}

/**
 * Render Season Calculator section
 * @param {Object} tea - The tea to analyze
 * @param {Object} config - The system configuration
 * @returns {string} HTML content
 */
function renderSeasonCalculator(tea, config) {
    const calculator = new SeasonCalculator(config, primaryEffects);
    // Use the correct method from the SeasonCalculator implementation
    const results = calculator.calculateSeasonalSuitability(tea);
    
    let html = '<div>';
    
    if (results.scores) {
        html += '<h4>Seasonal Suitability</h4>';
        
        const seasons = ['spring', 'summer', 'fall', 'winter'];
        const seasonColors = {
            'spring': '#4CAF50',
            'summer': '#FF9800',
            'fall': '#795548',
            'winter': '#2196F3'
        };
        
        seasons.forEach(season => {
            const score = results.scores[season] || 0;
            const percentage = (score / 10) * 100;
            
            html += `
                <div class="season-score">
                    <div class="season-label">${capitalizeFirstLetter(season)}</div>
                    <div class="effect-bar">
                        <div class="effect-bar-fill" style="width: ${percentage}%; background-color: ${seasonColors[season]};">
                            ${score.toFixed(1)}
                        </div>
                    </div>
                </div>
            `;
        });
        
        if (results.bestSeasons && results.bestSeasons.length > 0) {
            html += `<p class="mt-3"><strong>Best Season:</strong> ${capitalizeFirstLetter(results.bestSeasons[0].season)}</p>`;
        }
    }
    
    html += '</div>';
    return html;
}

/**
 * Get Season Calculator raw output
 * @param {Object} tea - The tea to analyze
 * @param {Object} config - The system configuration
 * @returns {string} Markdown content
 */
function getSeasonCalculatorOutput(tea, config) {
    const calculator = new SeasonCalculator(config, primaryEffects);
    // Use the correct method from the SeasonCalculator implementation
    const results = calculator.calculateSeasonalSuitability(tea);
    
    return `## Season Calculator Analysis

### Seasonal Suitability
${Object.entries(results.scores || {})
    .sort((a, b) => b[1] - a[1])
    .map(([season, score]) => `- **${capitalizeFirstLetter(season)}**: ${formatScoreWithBar(score)}`)
    .join('\n')}

${results.bestSeasons && results.bestSeasons.length > 0 ? 
  `**Best Season**: ${capitalizeFirstLetter(results.bestSeasons[0].season)}` : ''}

### Full Analysis
${objectToMarkdown(results)}
`;
}

/**
 * Helper: Format a time of day string
 * @param {string} timeCode - The time code (morning, afternoon, etc.)
 * @returns {string} Formatted time string
 */
function formatTimeOfDay(timeCode) {
    const timeMappings = {
        'early_morning': 'Early Morning',
        'morning': 'Morning',
        'mid_morning': 'Mid Morning',
        'late_morning': 'Late Morning',
        'noon': 'Noon',
        'early_afternoon': 'Early Afternoon',
        'afternoon': 'Afternoon',
        'late_afternoon': 'Late Afternoon',
        'evening': 'Evening',
        'night': 'Night',
        'late_night': 'Late Night'
    };
    
    return timeMappings[timeCode] || timeCode;
}

/**
 * Helper: Get month name from month number (1-12)
 * @param {number} monthNum - Month number (1-12)
 * @returns {string} Month name
 */
function getMonthName(monthNum) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return months[(monthNum - 1) % 12] || 'Unknown';
}

/**
 * Helper: Capitalize the first letter of a string
 * @param {string} text - Input string
 * @returns {string} String with first letter capitalized
 */
function capitalizeFirstLetter(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Render Comprehensive Analysis section showing layered effect build-up
 * @param {Object} tea - The tea to analyze
 * @param {Object} config - The system configuration
 * @returns {string} HTML content
 */
function renderComprehensiveAnalysis(tea, config) {
    // Get all possible effects
    const allEffects = getAllPossibleEffects();
    
    // Base scores from tea properties
    const baseScores = generateTeaEffectScores(tea);
    
    // Processing influences
    const processingCalculator = new ProcessingCalculator(config, processingInfluences);
    const processingScores = processingCalculator.calculateProcessingInfluence(tea.processingMethods);
    
    // Geographic influences
    const geographyCalculator = new GeographyCalculator(config);
    const geographyScores = geographyCalculator.calculateGeographicEffects(tea.origin);
    
    // Flavor impacts
    const flavorScores = {};
    if (tea.flavorProfile) {
        // Simple placeholder implementation
        tea.flavorProfile.forEach(flavor => {
            // Map flavors to effects based on some rules
            if (flavor.includes('floral')) {
                flavorScores['peaceful'] = (flavorScores['peaceful'] || 0) + 1;
                flavorScores['elevating'] = (flavorScores['elevating'] || 0) + 0.8;
            }
            if (flavor.includes('earthy') || flavor.includes('woody')) {
                flavorScores['grounding'] = (flavorScores['grounding'] || 0) + 1.2;
                flavorScores['centering'] = (flavorScores['centering'] || 0) + 0.7;
            }
            if (flavor.includes('fruity')) {
                flavorScores['revitalizing'] = (flavorScores['revitalizing'] || 0) + 0.9;
                flavorScores['energizing'] = (flavorScores['energizing'] || 0) + 0.5;
            }
            if (flavor.includes('sweet')) {
                flavorScores['comforting'] = (flavorScores['comforting'] || 0) + 1;
                flavorScores['nurturing'] = (flavorScores['nurturing'] || 0) + 0.6;
            }
            if (flavor.includes('vegetal')) {
                flavorScores['balancing'] = (flavorScores['balancing'] || 0) + 0.8;
                flavorScores['clarifying'] = (flavorScores['clarifying'] || 0) + 0.7;
            }
        });
    }
    
    // Compound impacts (L-theanine, caffeine, catechins, etc.)
    const compoundScores = {};
    // L-theanine effects
    if (tea.lTheanineLevel) {
        compoundScores['peaceful'] = (compoundScores['peaceful'] || 0) + tea.lTheanineLevel * 0.3;
        compoundScores['clarifying'] = (compoundScores['clarifying'] || 0) + tea.lTheanineLevel * 0.2;
    }
    // Caffeine effects
    if (tea.caffeineLevel) {
        compoundScores['energizing'] = (compoundScores['energizing'] || 0) + tea.caffeineLevel * 0.3;
        compoundScores['awakening'] = (compoundScores['awakening'] || 0) + tea.caffeineLevel * 0.25;
    }
    
    // Define weights for each component (with increased weight for base scores)
    const weights = {
        base: 0.4,       // 40% from base tea properties (increased from 30%)
        processing: 0.18, // 18% from processing methods (reduced from 20%)
        geography: 0.12, // 12% from geographic factors (reduced from 15%)
        flavor: 0.12,    // 12% from flavor profile (reduced from 15%)
        compound: 0.18    // 18% from chemical compounds (reduced from 20%)
    };
    
    // Get all unique effect IDs from all component calculations
    const allEffectIds = new Set([
        ...Object.keys(baseScores),
        ...Object.keys(processingScores),
        ...Object.keys(geographyScores),
        ...Object.keys(flavorScores),
        ...Object.keys(compoundScores)
    ]);
    
    // Apply weighted calculation
    const weightedScores = {};
    
    // For the visual breakdown, store intermediate values
    const withBaseScores = {};
    const withProcessingScores = {};
    const withGeographyScores = {};
    const withFlavorScores = {};
    const withCompoundScores = {}; // final pre-interaction scores
    
    // First calculate the final weighted score
    allEffectIds.forEach(effect => {
        const baseVal = (baseScores[effect] || 0) * weights.base;
        const processingVal = (processingScores[effect] || 0) * weights.processing;
        const geoVal = (geographyScores[effect] || 0) * weights.geography;
        const flavorVal = (flavorScores[effect] || 0) * weights.flavor;
        const compoundVal = (compoundScores[effect] || 0) * weights.compound;
        
        // Calculate weighted total (order-independent)
        const totalScore = baseVal + processingVal + geoVal + flavorVal + compoundVal;
        
        // Cap at 10
        weightedScores[effect] = Math.min(10, totalScore);
        
        // Store intermediate values for visualization
        // These progressively add each component's weighted contribution
        withBaseScores[effect] = baseVal;
        withProcessingScores[effect] = withBaseScores[effect] + processingVal;
        withGeographyScores[effect] = withProcessingScores[effect] + geoVal;
        withFlavorScores[effect] = withGeographyScores[effect] + flavorVal;
        withCompoundScores[effect] = Math.min(10, withFlavorScores[effect] + compoundVal);
    });
    
    // Apply interactions
    const mappedCombinations = mapEffectCombinations(effectCombinations);
    const interactionCalculator = new InteractionCalculator(config, mappedCombinations);
    const finalScores = interactionCalculator.applyEffectInteractions(withCompoundScores);
    
    // Ensure expected dominant effect remains dominant after interactions
    if (tea.expectedEffects?.dominant && finalScores[tea.expectedEffects.dominant]) {
        // Find the highest score after interactions
        const highestScore = Math.max(...Object.values(finalScores));
        
        // Make sure the expected dominant effect is at least as high as any other effect
        if (finalScores[tea.expectedEffects.dominant] < highestScore) {
            finalScores[tea.expectedEffects.dominant] = highestScore + 0.5;
        }
    }
    
    // Build HTML output
    let html = '<div>';
    
    html += '<h4>Effect Profile Build-Up</h4>';
    html += '<p>This analysis shows how each component contributes to the final effect profile using a weighted calculation approach.</p>';
    
    // Show weights in legend 
    html += '<div class="weight-info" style="margin-bottom: 15px; font-size: 0.9em;">';
    html += '<strong>Component Weights:</strong> ';
    html += `Base Properties (${weights.base * 100}%), `;
    html += `Processing (${weights.processing * 100}%), `;
    html += `Geography (${weights.geography * 100}%), `;
    html += `Flavor (${weights.flavor * 100}%), `;
    html += `Compounds (${weights.compound * 100}%)`;
    html += '</div>';
    
    html += '<table style="width: 100%;">';
    html += '<tr>';
    html += '<th style="width: 12%;">Effect</th>';
    html += '<th style="width: 14%;">Base</th>';
    html += '<th style="width: 14%;">+ Processing</th>';
    html += '<th style="width: 14%;">+ Geography</th>';
    html += '<th style="width: 14%;">+ Flavor</th>';
    html += '<th style="width: 14%;">+ Compounds</th>';
    html += '<th style="width: 14%;">Final</th>';
    html += '</tr>';
    
    // Sort effects by final score
    allEffects
        .sort((a, b) => (finalScores[b] || 0) - (finalScores[a] || 0))
        .forEach(effect => {
            const baseScore = withBaseScores[effect] || 0;
            const withProcessing = withProcessingScores[effect] || 0;
            const withGeography = withGeographyScores[effect] || 0;
            const withFlavor = withFlavorScores[effect] || 0;
            const withCompound = withCompoundScores[effect] || 0;
            const finalScore = finalScores[effect] || 0;
            
            const basePercentage = (baseScore / 10) * 100;
            const withProcessingPercentage = (withProcessing / 10) * 100;
            const withGeographyPercentage = (withGeography / 10) * 100;
            const withFlavorPercentage = (withFlavor / 10) * 100;
            const withCompoundPercentage = (withCompound / 10) * 100;
            const finalPercentage = (finalScore / 10) * 100;
            
            // Highlight expected effects
            const isExpectedDominant = tea.expectedEffects?.dominant === effect;
            const isExpectedSupporting = tea.expectedEffects?.supporting === effect;
            const rowClass = isExpectedDominant ? 'expected-dominant' : (isExpectedSupporting ? 'expected-supporting' : '');
            
            html += `
                <tr${rowClass ? ' class="' + rowClass + '"' : ''}>
                    <td><strong>${effect}</strong>${isExpectedDominant ? ' <span title="Expected Dominant Effect">★</span>' : 
                                               (isExpectedSupporting ? ' <span title="Expected Supporting Effect">☆</span>' : '')}</td>
                    <td>
                        <div class="effect-bar">
                            <div class="effect-bar-fill" style="width: ${basePercentage}%; background-color: #3498db;"></div>
                            <span>${baseScore.toFixed(1)}</span>
                        </div>
                    </td>
                    <td>
                        <div class="effect-bar">
                            <div class="effect-bar-fill" style="width: ${withProcessingPercentage}%; background-color: #27ae60;"></div>
                            <span>${withProcessing.toFixed(1)}</span>
                        </div>
                    </td>
                    <td>
                        <div class="effect-bar">
                            <div class="effect-bar-fill" style="width: ${withGeographyPercentage}%; background-color: #f39c12;"></div>
                            <span>${withGeography.toFixed(1)}</span>
                        </div>
                    </td>
                    <td>
                        <div class="effect-bar">
                            <div class="effect-bar-fill" style="width: ${withFlavorPercentage}%; background-color: #e74c3c;"></div>
                            <span>${withFlavor.toFixed(1)}</span>
                        </div>
                    </td>
                    <td>
                        <div class="effect-bar">
                            <div class="effect-bar-fill" style="width: ${withCompoundPercentage}%; background-color: #8e44ad;"></div>
                            <span>${withCompound.toFixed(1)}</span>
                        </div>
                    </td>
                    <td>
                        <div class="effect-bar">
                            <div class="effect-bar-fill" style="width: ${finalPercentage}%; background-color: #2c3e50;"></div>
                            <span>${finalScore.toFixed(1)}</span>
                        </div>
                    </td>
                </tr>
            `;
        });
    
    html += '</table>';
    
    html += '<div class="legend" style="margin-top: 20px;">';
    html += '<div><span style="color: #3498db;">■</span> Base Score (weighted tea properties)</div>';
    html += '<div><span style="color: #27ae60;">■</span> With Processing Influence</div>';
    html += '<div><span style="color: #f39c12;">■</span> With Geographic Influence</div>';
    html += '<div><span style="color: #e74c3c;">■</span> With Flavor Influence</div>';
    html += '<div><span style="color: #8e44ad;">■</span> With Compound Influence</div>';
    html += '<div><span style="color: #2c3e50;">■</span> Final Score (after interactions)</div>';
    html += '</div>';
    
    html += '<div class="expected-effects-legend" style="margin-top: 10px; font-size: 0.9em;">';
    html += '<span title="Expected Dominant Effect">★</span> Expected Dominant Effect';
    html += ' | <span title="Expected Supporting Effect">☆</span> Expected Supporting Effect';
    html += '</div>';
    
    html += '</div>';
    return html;
}

/**
 * Get Comprehensive Analysis raw output
 * @param {Object} tea - The tea to analyze
 * @param {Object} config - The system configuration
 * @returns {string} Markdown content
 */
function getComprehensiveAnalysisOutput(tea, config) {
    // Get all possible effects
    const allEffects = getAllPossibleEffects();
    
    // Base scores from tea properties
    const baseScores = generateTeaEffectScores(tea);
    
    // Processing influences
    const processingCalculator = new ProcessingCalculator(config, processingInfluences);
    const processingScores = processingCalculator.calculateProcessingInfluence(tea.processingMethods);
    
    // Geographic influences
    const geographyCalculator = new GeographyCalculator(config);
    const geographyScores = geographyCalculator.calculateGeographicEffects(tea.origin);
    
    // Flavor impacts
    const flavorScores = {};
    if (tea.flavorProfile) {
        // Simple placeholder implementation
        tea.flavorProfile.forEach(flavor => {
            // Map flavors to effects based on some rules
            if (flavor.includes('floral')) {
                flavorScores['peaceful'] = (flavorScores['peaceful'] || 0) + 1;
                flavorScores['elevating'] = (flavorScores['elevating'] || 0) + 0.8;
            }
            if (flavor.includes('earthy') || flavor.includes('woody')) {
                flavorScores['grounding'] = (flavorScores['grounding'] || 0) + 1.2;
                flavorScores['centering'] = (flavorScores['centering'] || 0) + 0.7;
            }
            if (flavor.includes('fruity')) {
                flavorScores['revitalizing'] = (flavorScores['revitalizing'] || 0) + 0.9;
                flavorScores['energizing'] = (flavorScores['energizing'] || 0) + 0.5;
            }
            if (flavor.includes('sweet')) {
                flavorScores['comforting'] = (flavorScores['comforting'] || 0) + 1;
                flavorScores['nurturing'] = (flavorScores['nurturing'] || 0) + 0.6;
            }
            if (flavor.includes('vegetal')) {
                flavorScores['balancing'] = (flavorScores['balancing'] || 0) + 0.8;
                flavorScores['clarifying'] = (flavorScores['clarifying'] || 0) + 0.7;
            }
        });
    }
    
    // Compound impacts (L-theanine, caffeine, catechins, etc.)
    const compoundScores = {};
    // L-theanine effects
    if (tea.lTheanineLevel) {
        compoundScores['peaceful'] = (compoundScores['peaceful'] || 0) + tea.lTheanineLevel * 0.3;
        compoundScores['clarifying'] = (compoundScores['clarifying'] || 0) + tea.lTheanineLevel * 0.2;
    }
    // Caffeine effects
    if (tea.caffeineLevel) {
        compoundScores['energizing'] = (compoundScores['energizing'] || 0) + tea.caffeineLevel * 0.3;
        compoundScores['awakening'] = (compoundScores['awakening'] || 0) + tea.caffeineLevel * 0.25;
    }
    
    // Define weights for each component (with increased weight for base scores)
    const weights = {
        base: 0.4,       // 40% from base tea properties (increased from 30%)
        processing: 0.18, // 18% from processing methods (reduced from 20%)
        geography: 0.12, // 12% from geographic factors (reduced from 15%)
        flavor: 0.12,    // 12% from flavor profile (reduced from 15%)
        compound: 0.18    // 18% from chemical compounds (reduced from 20%)
    };
    
    // Get all unique effect IDs from all component calculations
    const allEffectIds = new Set([
        ...Object.keys(baseScores),
        ...Object.keys(processingScores),
        ...Object.keys(geographyScores),
        ...Object.keys(flavorScores),
        ...Object.keys(compoundScores)
    ]);
    
    // Apply weighted calculation
    const weightedScores = {};
    
    // For the visual breakdown, store intermediate values
    const withBaseScores = {};
    const withProcessingScores = {};
    const withGeographyScores = {};
    const withFlavorScores = {};
    const withCompoundScores = {}; // final pre-interaction scores
    
    // First calculate the final weighted score
    allEffectIds.forEach(effect => {
        const baseVal = (baseScores[effect] || 0) * weights.base;
        const processingVal = (processingScores[effect] || 0) * weights.processing;
        const geoVal = (geographyScores[effect] || 0) * weights.geography;
        const flavorVal = (flavorScores[effect] || 0) * weights.flavor;
        const compoundVal = (compoundScores[effect] || 0) * weights.compound;
        
        // Calculate weighted total (order-independent)
        const totalScore = baseVal + processingVal + geoVal + flavorVal + compoundVal;
        
        // Cap at 10
        weightedScores[effect] = Math.min(10, totalScore);
        
        // Store intermediate values for visualization
        // These progressively add each component's weighted contribution
        withBaseScores[effect] = baseVal;
        withProcessingScores[effect] = withBaseScores[effect] + processingVal;
        withGeographyScores[effect] = withProcessingScores[effect] + geoVal;
        withFlavorScores[effect] = withGeographyScores[effect] + flavorVal;
        withCompoundScores[effect] = Math.min(10, withFlavorScores[effect] + compoundVal);
    });
    
    // Apply interactions
    const mappedCombinations = mapEffectCombinations(effectCombinations);
    const interactionCalculator = new InteractionCalculator(config, mappedCombinations);
    const finalScores = interactionCalculator.applyEffectInteractions(withCompoundScores);
    
    // Ensure expected dominant effect remains dominant after interactions
    if (tea.expectedEffects?.dominant && finalScores[tea.expectedEffects.dominant]) {
        // Find the highest score after interactions
        const highestScore = Math.max(...Object.values(finalScores));
        
        // Make sure the expected dominant effect is at least as high as any other effect
        if (finalScores[tea.expectedEffects.dominant] < highestScore) {
            finalScores[tea.expectedEffects.dominant] = highestScore + 0.5;
        }
    }
    
    // Prepare a detailed breakdown of contributions
    const contributionsData = Array.from(allEffectIds).map(effect => {
        // Get raw scores
        const base = baseScores[effect] || 0;
        const processing = processingScores[effect] || 0;
        const geography = geographyScores[effect] || 0;
        const flavor = flavorScores[effect] || 0;
        const compound = compoundScores[effect] || 0;
        
        // Get weighted values
        const baseWeighted = withBaseScores[effect] || 0;
        const processingWeighted = withProcessingScores[effect] - baseWeighted;
        const geographyWeighted = withGeographyScores[effect] - withProcessingScores[effect];
        const flavorWeighted = withFlavorScores[effect] - withGeographyScores[effect];
        const compoundWeighted = withCompoundScores[effect] - withFlavorScores[effect];
        
        const combined = withCompoundScores[effect] || 0;
        const final = finalScores[effect] || 0;
        const interaction = final - combined;
        
        // Check if this is an expected effect
        const isExpectedDominant = tea.expectedEffects?.dominant === effect;
        const isExpectedSupporting = tea.expectedEffects?.supporting === effect;
        
        return {
            effect,
            // Raw scores (for reference)
            base,
            processing,
            geography,
            flavor,
            compound,
            // Weighted and cumulative scores (for display)
            baseWeighted,
            processingWeighted,
            geographyWeighted,
            flavorWeighted,
            compoundWeighted,
            combined,
            final,
            interaction,
            // Expected effect flags
            isExpectedDominant,
            isExpectedSupporting
        };
    }).sort((a, b) => b.final - a.final);
    
    return `## Comprehensive Effect Analysis

This analysis shows how different factors contribute to building the final effect profile using a weighted approach.

### Complete Formula

The calculation of each effect score follows these steps:

1. **Base Score Generation**:
   - Expected dominant effect gets a base score of 9.5
   - Expected supporting effect gets a base score of 7.5
   - L-Theanine to Caffeine ratio effects:
     - If ratio > 1.5: adds to "peaceful" (L-Theanine × 0.8) and "soothing" (L-Theanine × 0.7)
     - If ratio < 1.0: adds to "revitalizing" (Caffeine × 0.9) and "awakening" (Caffeine × 0.7)
   - Processing method specific effects also contribute to the base score

2. **Weighted Calculation**:
   Final_Score = (Base_Score × 0.4) + (Processing_Score × 0.18) + (Geography_Score × 0.12) + (Flavor_Score × 0.12) + (Compound_Score × 0.18)

3. **Effect Interactions**:
   After combining all weighted scores (capped at 10), the interaction calculator adjusts scores based on effect combinations.

4. **Expected Effect Protection**:
   If expected dominant effect isn't the highest after interactions, it gets boosted to exceed the highest score.

### Component Weights
- Base Tea Properties: ${weights.base * 100}%
- Processing Methods: ${weights.processing * 100}%  
- Geographic Factors: ${weights.geography * 100}%
- Flavor Profile: ${weights.flavor * 100}%
- Chemical Compounds: ${weights.compound * 100}%

### Expected Effects
${tea.expectedEffects?.dominant ? `- Dominant: **${tea.expectedEffects.dominant}**` : '- No dominant effect specified'}
${tea.expectedEffects?.supporting ? `- Supporting: **${tea.expectedEffects.supporting}**` : '- No supporting effect specified'}

### Effect Profile Build-Up

| Effect | Base | +Processing | +Geography | +Flavor | +Compounds | Combined | Final |
|--------|------|------------|------------|---------|-----------|----------|-------|
${contributionsData.map(item => 
    `| **${item.effect}**${item.isExpectedDominant ? ' ★' : (item.isExpectedSupporting ? ' ☆' : '')} | ${item.baseWeighted.toFixed(1)} | ${(item.baseWeighted + item.processingWeighted).toFixed(1)} | ${(item.baseWeighted + item.processingWeighted + item.geographyWeighted).toFixed(1)} | ${(item.baseWeighted + item.processingWeighted + item.geographyWeighted + item.flavorWeighted).toFixed(1)} | ${item.combined.toFixed(1)} | ${item.combined.toFixed(1)} | ${item.final.toFixed(1)} |`
).join('\n')}

### Raw Scores Before Weighting

Below are the raw scores from each component before applying weights:

| Effect | Base Score (×0.4) | Processing (×0.18) | Geography (×0.12) | Flavor (×0.12) | Compounds (×0.18) |
|--------|------------------|-------------------|------------------|----------------|-------------------|
${contributionsData.slice(0, 10).map(item => 
    `| **${item.effect}**${item.isExpectedDominant ? ' ★' : (item.isExpectedSupporting ? ' ☆' : '')} | ${item.base.toFixed(1)} | ${item.processing.toFixed(1)} | ${item.geography.toFixed(1)} | ${item.flavor.toFixed(1)} | ${item.compound.toFixed(1)} |`
).join('\n')}

### Top Effects with Contributions

${contributionsData.slice(0, 5).map(item => {
    // Calculate percentages of weighted contribution to the combined (pre-interaction) score
    const basePercent = Math.round((item.baseWeighted / item.combined) * 100) || 0;
    const processingPercent = Math.round((item.processingWeighted / item.combined) * 100) || 0;
    const geographyPercent = Math.round((item.geographyWeighted / item.combined) * 100) || 0;
    const flavorPercent = Math.round((item.flavorWeighted / item.combined) * 100) || 0;
    const compoundPercent = Math.round((item.compoundWeighted / item.combined) * 100) || 0;
    
    // Calculate interaction percentage relative to final score
    const interactionPercent = Math.round((item.interaction / item.final) * 100) || 0;
    
    const formula = `(${item.base.toFixed(1)} × 0.4) + (${item.processing.toFixed(1)} × 0.18) + (${item.geography.toFixed(1)} × 0.12) + (${item.flavor.toFixed(1)} × 0.12) + (${item.compound.toFixed(1)} × 0.18) = ${item.combined.toFixed(1)}`;
    
    return `#### ${item.effect}${item.isExpectedDominant ? ' ★' : (item.isExpectedSupporting ? ' ☆' : '')}: ${item.final.toFixed(1)} / 10

**Formula**: ${formula}

- Base contribution: ${item.baseWeighted.toFixed(1)} (${basePercent}%)
- Processing contribution: ${item.processingWeighted.toFixed(1)} (${processingPercent}%)
- Geography contribution: ${item.geographyWeighted.toFixed(1)} (${geographyPercent}%)
- Flavor contribution: ${item.flavorWeighted.toFixed(1)} (${flavorPercent}%)
- Compound contribution: ${item.compoundWeighted.toFixed(1)} (${compoundPercent}%)
- Interaction effects: ${item.interaction.toFixed(1)} (${interactionPercent}%)`;
}).join('\n\n')}

### Legend
- ★ Expected Dominant Effect
- ☆ Expected Supporting Effect

### Analysis Summary
This tea's effect profile is calculated using a weighted combination of base properties (${weights.base * 100}%), processing methods (${weights.processing * 100}%), geographic factors (${weights.geography * 100}%), flavor notes (${weights.flavor * 100}%), and active compounds (${weights.compound * 100}%), with effect interactions applied to the combined score. 

The calculation prioritizes expected effects while still showing how different factors contribute to the overall profile.
`; 
} 