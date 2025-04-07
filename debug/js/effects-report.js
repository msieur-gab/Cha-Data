/**
 * Tea Effects Comparison Report Module
 * Analyzes the expected vs. calculated effects for all teas in the database
 */

import { teaDatabase } from '../../js/TeaDatabase.js';
import { TeaEffectCalculator } from '../../js/calculators/TeaEffectCalculator.js';
import { EffectSystemConfig } from '../../js/config/EffectSystemConfig.js';
import { effectMapping } from '../../js/props/EffectMapping.js';

/**
 * Generates a report comparing expected effects against calculated effects for all teas
 * @param {Function} progressCallback - Optional callback to report progress (receives report text)
 * @returns {Object} The complete report data
 */
export async function generateEffectsReport(progressCallback) {
    // Initialize configuration and calculator
    const config = new EffectSystemConfig();
    const teaEffectCalculator = new TeaEffectCalculator(config);

    // Function to get top effects from a scores object
    function getTopEffects(scores) {
        if (!scores || typeof scores !== 'object') {
            return [
                { id: 'none', score: 0 },
                { id: 'none', score: 0 }
            ];
        }
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
    report += '  Base: [Dominant (score)] / [Supporting (score)]\n';
    report += '=====================================================\n\n';

    // Initialize accuracy metrics
    let totalTeas = 0;
    let finalDominantMatches = 0;
    let finalSupportingMatches = 0;
    let finalBothMatches = 0;
    let baseDominantMatches = 0;
    let baseSupportingMatches = 0;
    let baseBothMatches = 0;
    
    // Default effects object with placeholder values
    let effects = {
        dominant: { id: 'none', score: 0 },
        supporting: { id: 'none', score: 0 },
        allScores: {}
    };
    
    // Detailed report data
    const teaReports = [];

    // Process each tea
    for (const tea of teaDatabase) {
        if (!tea || !tea.name) continue;
        
        // Get expected effects
        const expectedDominant = tea.expectedEffects?.dominant || 'none';
        const expectedSupporting = tea.expectedEffects?.supporting || 'none';
        
        try {
            // Calculate effects
            const result = teaEffectCalculator.infer(tea);
            const finalEffects = result.finalScores || {};
            const baseEffects = result.componentScores?.base || {};
            
            const topFinalEffects = getTopEffects(finalEffects);
            const topBaseEffects = getTopEffects(baseEffects);
            
            const teaTypeEffects = result.componentScores?.teaType || {};
            const topTeaTypeEffects = getTopEffects(teaTypeEffects);
            
            effects = {
                dominant: topTeaTypeEffects[0] || { id: 'none', score: 0 },
                supporting: topTeaTypeEffects[1] || { id: 'none', score: 0 },
                allScores: { ...teaTypeEffects }
            };
            
            // Create detailed tea report object
            const teaReport = {
                name: tea.name,
                expected: {
                    dominant: expectedDominant,
                    supporting: expectedSupporting
                },
                base: {
                    dominant: topBaseEffects[0] || { id: 'none', score: 0 },
                    supporting: topBaseEffects[1] || { id: 'none', score: 0 },
                    allScores: { ...baseEffects }
                },
                final: {
                    dominant: topFinalEffects[0] || { id: 'none', score: 0 },
                    supporting: topFinalEffects[1] || { id: 'none', score: 0 },
                    allScores: { ...finalEffects }
                },
                teaType: {
                    dominant: effects.dominant,
                    supporting: effects.supporting,
                    allScores: effects.allScores
                }
            };
            
            // Add to detailed reports
            teaReports.push(teaReport);
            
            // Format output text
            report += `${tea.name}\n`;
            report += `  Expected: ${expectedDominant} / ${expectedSupporting}\n`;
            
            const baseDominant = teaReport.base.dominant;
            const baseSupporting = teaReport.base.supporting;
            report += `  Base: ${baseDominant.id} (${baseDominant.score.toFixed(1)}) / ${baseSupporting.id} (${baseSupporting.score.toFixed(1)})\n`;
            
            const finalDominant = teaReport.final.dominant;
            const finalSupporting = teaReport.final.supporting;
            report += `  Final: ${finalDominant.id} (${finalDominant.score.toFixed(1)}) / ${finalSupporting.id} (${finalSupporting.score.toFixed(1)})\n`;
            
            report += '-----------------------------------------------------\n';
            
            // Count matches for accuracy metrics
            if (tea.expectedEffects?.dominant) {
                totalTeas++;
                
                const expDominant = tea.expectedEffects.dominant;
                const expSupporting = tea.expectedEffects.supporting || 'none';
                
                // Count base matches
                if (baseDominant.id === expDominant) baseDominantMatches++;
                if (baseSupporting.id === expSupporting) baseSupportingMatches++;
                if (baseDominant.id === expDominant && baseSupporting.id === expSupporting) baseBothMatches++;
                
                // Count final matches
                if (finalDominant.id === expDominant) finalDominantMatches++;
                if (finalSupporting.id === expSupporting) finalSupportingMatches++;
                if (finalDominant.id === expDominant && finalSupporting.id === expSupporting) finalBothMatches++;
            }
        } catch (error) {
            console.error(`Error processing tea ${tea.name}:`, error);
            report += `${tea.name}\n`;
            report += `  Error: ${error.message}\n`;
            report += '-----------------------------------------------------\n';
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
    
    if (totalTeas > 0) {
        report += '\nBase Effects Accuracy:\n';
        report += `  Dominant effect match: ${baseDominantMatches}/${totalTeas} (${(baseDominantMatches/totalTeas*100).toFixed(1)}%)\n`;
        report += `  Supporting effect match: ${baseSupportingMatches}/${totalTeas} (${(baseSupportingMatches/totalTeas*100).toFixed(1)}%)\n`;
        report += `  Both effects match: ${baseBothMatches}/${totalTeas} (${(baseBothMatches/totalTeas*100).toFixed(1)}%)\n`;
        
        report += '\nFinal Effects Accuracy:\n';
        report += `  Dominant effect match: ${finalDominantMatches}/${totalTeas} (${(finalDominantMatches/totalTeas*100).toFixed(1)}%)\n`;
        report += `  Supporting effect match: ${finalSupportingMatches}/${totalTeas} (${(finalSupportingMatches/totalTeas*100).toFixed(1)}%)\n`;
        report += `  Both effects match: ${finalBothMatches}/${totalTeas} (${(finalBothMatches/totalTeas*100).toFixed(1)}%)\n`;
        
        report += '\nTea Type Effects Accuracy:\n';
        report += `- Dominant Effect: ${effects.dominant.id} (${effects.dominant.score.toFixed(1)}/10)\n`;
        report += `- Supporting Effect: ${effects.supporting.id} (${effects.supporting.score.toFixed(1)}/10)\n`;
    } else {
        report += '\nNo teas with expected effects found.\n';
    }
    
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
            baseEffects: {
                dominantMatches: baseDominantMatches,
                supportingMatches: baseSupportingMatches,
                bothMatches: baseBothMatches,
                dominantMatchRate: totalTeas > 0 ? (baseDominantMatches/totalTeas*100).toFixed(1) : '0.0',
                supportingMatchRate: totalTeas > 0 ? (baseSupportingMatches/totalTeas*100).toFixed(1) : '0.0',
                bothMatchRate: totalTeas > 0 ? (baseBothMatches/totalTeas*100).toFixed(1) : '0.0'
            },
            finalEffects: {
                dominantMatches: finalDominantMatches,
                supportingMatches: finalSupportingMatches,
                bothMatches: finalBothMatches,
                dominantMatchRate: totalTeas > 0 ? (finalDominantMatches/totalTeas*100).toFixed(1) : '0.0',
                supportingMatchRate: totalTeas > 0 ? (finalSupportingMatches/totalTeas*100).toFixed(1) : '0.0',
                bothMatchRate: totalTeas > 0 ? (finalBothMatches/totalTeas*100).toFixed(1) : '0.0'
            },
            teaTypeEffects: {
                dominant: effects.dominant,
                supporting: effects.supporting,
                allScores: effects.allScores
            }
        }
    };
} 