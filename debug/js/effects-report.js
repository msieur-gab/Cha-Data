/**
 * Tea Effects Comparison Report Module
 * Analyzes the expected vs. calculated effects for all teas in the database
 */

import { teaDatabase } from '../../js/TeaDatabase.js';
import { TeaEffectCalculator } from '../../js/calculators/TeaEffectCalculator.js';
import { EffectSystemConfig } from '../../js/config/EffectSystemConfig.js';
import { primaryEffects } from '../../js/props/PrimaryEffects.js';
import { processingInfluences } from '../../js/props/ProcessingInfluences.js';
import { flavorInfluences } from '../../js/props/FlavorInfluences.js';
import { effectCombinations } from '../../js/props/EffectCombinations.js';
import { mapEffectCombinations } from '../../js/utils/EffectInteractionMapper.js';

/**
 * Generates a report comparing expected effects against calculated effects for all teas
 * @param {Function} progressCallback - Optional callback to report progress (receives report text)
 * @returns {Object} The complete report data
 */
export async function generateEffectsReport(progressCallback) {
    // Initialize configuration and calculators
    const config = new EffectSystemConfig();
    const teaEffectCalculator = new TeaEffectCalculator(config, {
        primaryEffects,
        processingInfluences,
        flavorInfluences,
        effectCombinations: mapEffectCombinations(effectCombinations)
    });

    // Function to get top effects from a scores object
    function getTopEffects(scores) {
        return Object.entries(scores)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 2)
            .map(([id, score]) => ({ id, score }));
    }

    let report = '=====================================================\n';
    report += 'TEA EFFECTS COMPARISON REPORT\n';
    report += '=====================================================\n';
    report += 'Format: [Tea Name]\n';
    report += '  Expected: [Dominant] / [Supporting]\n';
    report += '  Final: [Dominant (score)] / [Supporting (score)]\n';
    report += '=====================================================\n\n';

    // Calculate accuracy metrics
    let totalTeas = 0;
    let finalDominantMatches = 0;
    let finalSupportingMatches = 0;
    let finalBothMatches = 0;
    
    // Detailed report data
    const teaReports = [];

    // Process each tea
    for (const tea of teaDatabase) {
        if (!tea || !tea.name) continue;
        
        // Get expected effects
        const expectedDominant = tea.expectedEffects?.dominant || 'none';
        const expectedSupporting = tea.expectedEffects?.supporting || 'none';
        
        // Calculate final effects with all influences
        const result = teaEffectCalculator.infer(tea);
        const finalEffects = result.finalScores;
        const topFinalEffects = getTopEffects(finalEffects);
        
        // Create detailed tea report object
        const teaReport = {
            name: tea.name,
            expected: {
                dominant: expectedDominant,
                supporting: expectedSupporting
            },
            final: {
                dominant: topFinalEffects[0] || { id: 'none', score: 0 },
                supporting: topFinalEffects[1] || { id: 'none', score: 0 },
                allScores: { ...finalEffects }
            }
        };
        
        // Add to detailed reports
        teaReports.push(teaReport);
        
        // Format output text
        report += `${tea.name}\n`;
        report += `  Expected: ${expectedDominant} / ${expectedSupporting}\n`;
        
        const finalDominant = teaReport.final.dominant;
        const finalSupporting = teaReport.final.supporting;
        report += `  Final: ${finalDominant.id} (${finalDominant.score.toFixed(1)}) / ${finalSupporting.id} (${finalSupporting.score.toFixed(1)})\n`;
        
        report += '-----------------------------------------------------\n';
        
        // Count matches for accuracy metrics
        if (tea.expectedEffects?.dominant) {
            totalTeas++;
            
            const expDominant = tea.expectedEffects.dominant;
            const expSupporting = tea.expectedEffects.supporting || 'none';
            
            if (finalDominant.id === expDominant) finalDominantMatches++;
            if (finalSupporting.id === expSupporting) finalSupportingMatches++;
            if (finalDominant.id === expDominant && finalSupporting.id === expSupporting) finalBothMatches++;
        }
        
        // Report progress periodically
        if (teaDatabase.indexOf(tea) % 5 === 0 && progressCallback) {
            progressCallback(report);
            // Let the UI update
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }
    
    // Add accuracy summary
    report += '\n=====================================================\n';
    report += 'ACCURACY SUMMARY\n';
    report += '=====================================================\n';
    report += `Total teas with expected effects: ${totalTeas}\n`;
    
    report += '\nFinal Effects Accuracy:\n';
    report += `  Dominant effect match: ${finalDominantMatches}/${totalTeas} (${(finalDominantMatches/totalTeas*100).toFixed(1)}%)\n`;
    report += `  Supporting effect match: ${finalSupportingMatches}/${totalTeas} (${(finalSupportingMatches/totalTeas*100).toFixed(1)}%)\n`;
    report += `  Both effects match: ${finalBothMatches}/${totalTeas} (${(finalBothMatches/totalTeas*100).toFixed(1)}%)\n`;
    
    // If there's a progress callback, call one final time with the complete report
    if (progressCallback) {
        progressCallback(report);
    }
    
    // Return the complete report data
    return {
        reportText: report,
        teaReports,
        summary: {
            totalTeas,
            finalEffects: {
                dominantMatches: finalDominantMatches,
                supportingMatches: finalSupportingMatches,
                bothMatches: finalBothMatches,
                dominantMatchRate: (finalDominantMatches/totalTeas*100).toFixed(1),
                supportingMatchRate: (finalSupportingMatches/totalTeas*100).toFixed(1),
                bothMatchRate: (finalBothMatches/totalTeas*100).toFixed(1)
            }
        }
    };
} 