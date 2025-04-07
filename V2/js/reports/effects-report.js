// effects-report.js - Generate reports on tea effects analysis
import TeaDatabase from '../data/TeaDatabase.js';
import { TeaEffectCalculator } from '../calculators/TeaEffectCalculator.js';
import { EffectSystemConfig } from '../config/EffectSystemConfig.js';
import { defaultConfig } from '../config/defaultConfig.js';
import { primaryEffects } from '../props/PrimaryEffects.js';
import { flavorInfluences } from '../props/FlavorInfluences.js';
import { processingInfluences } from '../props/ProcessingInfluences.js';
import { effectCombinations } from '../props/EffectCombinations.js';
import geographicalDescriptors from '../props/GeographicalDescriptors.js';

/**
 * Generate a report on the effects analysis of teas in the database
 * @param {Function} progressCallback - Callback function to report progress
 * @returns {Object} The report data and text
 */
export async function generateEffectsReport(progressCallback = () => {}) {
    progressCallback('Initializing effect calculator...');
    
    // Initialize calculator with default config
    const config = new EffectSystemConfig(defaultConfig);
    const calculator = new TeaEffectCalculator(config);
    
    // Load all reference data
    calculator.loadData(
        primaryEffects, 
        flavorInfluences, 
        processingInfluences,
        effectCombinations,
        geographicalDescriptors.geographicFeatureToEffectMapping
    );
    
    // Also load interaction data separately
    calculator.interactionCalculator.setEffectCombinations(effectCombinations);
    
    // Get all teas
    const teas = TeaDatabase.getAllTeas();
    
    progressCallback(`Found ${teas.length} teas to analyze...`);
    
    // Calculate effects for each tea
    const teaReports = [];
    let dominantMatches = 0;
    let supportingMatches = 0;
    
    for (let i = 0; i < teas.length; i++) {
        const tea = teas[i];
        progressCallback(`Analyzing tea ${i + 1}/${teas.length}: ${tea.name}...`);
        
        // Get expected effects (dominant and supporting)
        const expectedDominant = getExpectedDominant(tea);
        const expectedSupporting = getExpectedSupporting(tea);
        
        // Calculate effects
        const result = calculator.calculate(tea);
        
        // Check if dominant effect matches
        const calculatedDominant = result.data.dominantEffect.name.toLowerCase();
        const dominantMatch = expectedDominant.toLowerCase() === calculatedDominant;
        
        if (dominantMatch) {
            dominantMatches++;
        }
        
        // Check if supporting effects match
        const calculatedSupporting = result.data.supportingEffects.map(e => e.name.toLowerCase());
        const expectedSupportingArray = expectedSupporting.toLowerCase().split(/,\s*/);
        
        const supportingMatch = expectedSupportingArray.every(expected => 
            calculatedSupporting.includes(expected)
        );
        
        if (supportingMatch) {
            supportingMatches++;
        }
        
        // Add to reports
        teaReports.push({
            tea: tea.name,
            expectedDominant,
            calculatedDominant,
            dominantMatch,
            expectedSupporting,
            calculatedSupporting,
            supportingMatch,
            allScores: result.data.allScores,
            componentScores: result.data.componentScores
        });
        
        // Simulate some processing time
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    progressCallback('Generating report...');
    
    // Generate summary
    const summary = {
        totalTeas: teas.length,
        dominantMatches,
        dominantMatchRate: Math.round((dominantMatches / teas.length) * 100),
        supportingMatches,
        supportingMatchRate: Math.round((supportingMatches / teas.length) * 100)
    };
    
    // Format report text
    const reportText = formatReportText(teaReports, summary);
    
    progressCallback('Report generation complete.');
    
    return {
        teaReports,
        summary,
        reportText
    };
}

/**
 * Generate an enhanced report with more detailed tea effect analysis
 * @param {Function} progressCallback - Callback function to report progress
 * @returns {Object} The report data and text
 */
export async function generateEnhancedEffectsReport(progressCallback = () => {}) {
    progressCallback('Initializing effect calculator for enhanced report...');
    
    // Initialize calculator with default config
    const config = new EffectSystemConfig(defaultConfig);
    const calculator = new TeaEffectCalculator(config);
    
    // Load all reference data
    calculator.loadData(
        primaryEffects, 
        flavorInfluences, 
        processingInfluences,
        effectCombinations,
        geographicalDescriptors.geographicFeatureToEffectMapping
    );
    
    // Also load interaction data separately
    calculator.interactionCalculator.setEffectCombinations(effectCombinations);
    
    // Get all teas
    const teas = TeaDatabase.getAllTeas();
    
    progressCallback(`Found ${teas.length} teas to analyze for enhanced report...`);
    
    // Calculate effects for each tea
    const teaReports = [];
    let dominantMatches = 0;
    let supportingMatches = 0;
    
    for (let i = 0; i < teas.length; i++) {
        const tea = teas[i];
        progressCallback(`Analyzing tea ${i + 1}/${teas.length}: ${tea.name}...`);
        
        // Get expected effects (dominant and supporting)
        const expectedDominant = getExpectedDominant(tea);
        const expectedSupporting = getExpectedSupporting(tea);
        
        // Calculate effects
        const result = calculator.calculate(tea);
        
        // Check if dominant effect matches
        const calculatedDominant = result.data.dominantEffect.name.toLowerCase();
        const dominantMatch = expectedDominant.toLowerCase() === calculatedDominant;
        
        if (dominantMatch) {
            dominantMatches++;
        }
        
        // Check if supporting effects match
        const calculatedSupporting = result.data.supportingEffects.map(e => e.name.toLowerCase());
        const expectedSupportingArray = expectedSupporting.toLowerCase().split(/,\s*/);
        
        const supportingMatch = expectedSupportingArray.every(expected => 
            calculatedSupporting.includes(expected)
        );
        
        if (supportingMatch) {
            supportingMatches++;
        }
        
        // Get component contributions
        const componentContributions = getComponentContributions(result.data.dominantEffect.name, result.data.componentScores);
        
        // Add to reports
        teaReports.push({
            tea: tea.name,
            teaDetails: tea,
            expectedDominant,
            calculatedDominant,
            dominantMatch,
            expectedSupporting,
            calculatedSupporting,
            supportingMatch,
            allScores: result.data.allScores,
            componentScores: result.data.componentScores,
            componentContributions,
            resultData: result.data
        });
        
        // Simulate some processing time
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    progressCallback('Generating enhanced report...');
    
    // Generate summary
    const summary = {
        totalTeas: teas.length,
        dominantMatches,
        dominantMatchRate: Math.round((dominantMatches / teas.length) * 100),
        supportingMatches,
        supportingMatchRate: Math.round((supportingMatches / teas.length) * 100)
    };
    
    // Format enhanced report text
    const reportText = formatEnhancedReportText(teaReports, summary);
    
    progressCallback('Enhanced report generation complete.');
    
    return {
        teaReports,
        summary,
        reportText
    };
}

/**
 * Get the expected dominant effect from tea data
 * @param {Object} tea - The tea data
 * @returns {string} The expected dominant effect
 */
function getExpectedDominant(tea) {
    if (!tea.expectedEffects) return 'N/A';
    
    // If tea has a specific dominant effect property, use that
    if (tea.expectedEffects.dominant) {
        return tea.expectedEffects.dominant;
    }
    
    // Otherwise, find the effect with the highest score
    const effects = Object.entries(tea.expectedEffects);
    if (effects.length === 0) return 'N/A';
    
    effects.sort((a, b) => b[1] - a[1]);
    return effects[0][0];
}

/**
 * Get the expected supporting effects from tea data
 * @param {Object} tea - The tea data
 * @returns {string} The expected supporting effects
 */
function getExpectedSupporting(tea) {
    if (!tea.expectedEffects) return 'N/A';
    
    // If tea has a specific supporting effects property, use that
    if (tea.expectedEffects.supporting) {
        return tea.expectedEffects.supporting;
    }
    
    // Otherwise, find the second and third highest effects
    const effects = Object.entries(tea.expectedEffects);
    if (effects.length <= 1) return 'N/A';
    
    effects.sort((a, b) => b[1] - a[1]);
    return effects.slice(1, 3).map(e => e[0]).join(', ');
}

/**
 * Get component contributions to a specific effect
 * @param {string} effectName - The effect name to analyze
 * @param {Object} componentScores - The component scores
 * @returns {Object} Component contributions
 */
function getComponentContributions(effectName, componentScores) {
    const effectNameLower = effectName.toLowerCase();
    const contributions = {};
    let total = 0;
    
    // Calculate total contribution from each component
    Object.entries(componentScores).forEach(([component, scores]) => {
        const effectScore = scores[effectNameLower] || 0;
        if (effectScore > 0) {
            contributions[component] = effectScore;
            total += effectScore;
        }
    });
    
    // Calculate percentages
    const percentages = {};
    Object.entries(contributions).forEach(([component, score]) => {
        percentages[component] = Math.round((score / total) * 100);
    });
    
    return {
        scores: contributions,
        percentages,
        total
    };
}

/**
 * Format the report text
 * @param {Array} teaReports - The tea reports
 * @param {Object} summary - The summary data
 * @returns {string} The formatted report text
 */
function formatReportText(teaReports, summary) {
    let text = '# Tea Effects Analysis Report\n\n';
    
    // Add summary
    text += '## Summary\n\n';
    text += `- **Total teas analyzed**: ${summary.totalTeas}\n`;
    text += `- **Dominant effect match rate**: ${summary.dominantMatchRate}% (${summary.dominantMatches}/${summary.totalTeas})\n`;
    text += `- **Supporting effects match rate**: ${summary.supportingMatchRate}% (${summary.supportingMatches}/${summary.totalTeas})\n\n`;
    
    // Add tea reports
    text += '## Individual Tea Reports\n\n';
    
    teaReports.forEach(report => {
        text += `### ${report.tea}\n\n`;
        text += `- **Expected dominant effect**: ${report.expectedDominant}\n`;
        text += `- **Calculated dominant effect**: ${report.calculatedDominant}\n`;
        text += `- **Match**: ${report.dominantMatch ? '✅' : '❌'}\n\n`;
        
        text += `- **Expected supporting effects**: ${report.expectedSupporting}\n`;
        text += `- **Calculated supporting effects**: ${report.calculatedSupporting.join(', ')}\n`;
        text += `- **Match**: ${report.supportingMatch ? '✅' : '❌'}\n\n`;
        
        text += '#### All Effect Scores\n\n';
        const sortedEffects = Object.entries(report.allScores)
            .sort((a, b) => b[1] - a[1]);
        
        sortedEffects.forEach(([effect, score]) => {
            text += `- **${effect}**: ${score.toFixed(1)}\n`;
        });
        
        text += '\n';
    });
    
    text += '## End of Report\n';
    text += `Generated on ${new Date().toLocaleString()}\n`;
    
    return text;
}

/**
 * Format the enhanced report text
 * @param {Array} teaReports - The enhanced tea reports
 * @param {Object} summary - The summary data
 * @returns {string} The formatted enhanced report text
 */
function formatEnhancedReportText(teaReports, summary) {
    let text = '# Enhanced Tea Effects Analysis Report\n\n';
    
    // Add summary
    text += '## Summary\n\n';
    text += `- **Total teas analyzed**: ${summary.totalTeas}\n`;
    text += `- **Dominant effect match rate**: ${summary.dominantMatchRate}% (${summary.dominantMatches}/${summary.totalTeas})\n`;
    text += `- **Supporting effects match rate**: ${summary.supportingMatchRate}% (${summary.supportingMatches}/${summary.totalTeas})\n\n`;
    
    // Add detailed tea reports
    text += '## Detailed Tea Reports\n\n';
    
    teaReports.forEach(report => {
        const tea = report.teaDetails;
        
        text += `### ${report.tea}\n\n`;
        
        // Tea metadata
        text += `**Type**: ${tea.type}\n`;
        text += `**Origin**: ${tea.origin}\n`;
        if (tea.originalName) text += `**Original name**: ${tea.originalName}\n`;
        text += `**L-Theanine**: ${tea.lTheanineLevel} / **Caffeine**: ${tea.caffeineLevel}\n`;
        text += `**Ratio**: ${(tea.lTheanineLevel / tea.caffeineLevel).toFixed(2)}\n\n`;
        
        // Effects comparison
        text += '#### Effects Comparison\n\n';
        text += `- **Expected dominant effect**: ${report.expectedDominant}\n`;
        text += `- **Calculated dominant effect**: ${report.calculatedDominant}\n`;
        text += `- **Match**: ${report.dominantMatch ? '✅' : '❌'}\n\n`;
        
        text += `- **Expected supporting effects**: ${report.expectedSupporting}\n`;
        text += `- **Calculated supporting effects**: ${report.calculatedSupporting.join(', ')}\n`;
        text += `- **Match**: ${report.supportingMatch ? '✅' : '❌'}\n\n`;
        
        // Dominant effect breakdown
        text += '#### Dominant Effect Component Breakdown\n\n';
        const contributions = report.componentContributions;
        
        text += `The "${report.calculatedDominant}" effect score (${report.resultData.dominantEffect.level.toFixed(1)}) is composed of:\n\n`;
        
        const sortedComponents = Object.entries(contributions.percentages)
            .sort((a, b) => b[1] - a[1]);
        
        sortedComponents.forEach(([component, percentage]) => {
            const score = contributions.scores[component].toFixed(1);
            text += `- **${formatComponentName(component)}**: ${score} points (${percentage}%)\n`;
        });
        
        text += '\n';
        
        // All effect scores
        text += '#### All Effect Scores\n\n';
        const sortedEffects = Object.entries(report.allScores)
            .sort((a, b) => b[1] - a[1]);
        
        sortedEffects.forEach(([effect, score]) => {
            const description = primaryEffects[effect] ? primaryEffects[effect].shortDescription : '';
            text += `- **${effect}**: ${score.toFixed(1)}${description ? ` - ${description}` : ''}\n`;
        });
        
        text += '\n';
    });
    
    text += '## End of Enhanced Report\n';
    text += `Generated on ${new Date().toLocaleString()}\n`;
    
    return text;
}

/**
 * Format component name for display
 * @param {string} component - The component name
 * @returns {string} The formatted component name
 */
function formatComponentName(component) {
    switch(component) {
        case 'base': return 'Tea Type Base';
        case 'compounds': return 'Chemical Compounds';
        case 'flavors': return 'Flavor Profile';
        case 'processing': return 'Processing Methods';
        case 'geography': return 'Geographic Factors';
        case 'seasonal': return 'Seasonal Context';
        default: return component.charAt(0).toUpperCase() + component.slice(1);
    }
} 