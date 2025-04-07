// enhanced-effects-report.js
// A more detailed tea effects comparison report generator

import { teaDatabase } from '../../js/TeaDatabase.js';
import { TeaEffectCalculator } from '../../js/calculators/TeaEffectCalculator.js';
import { EffectSystemConfig } from '../../js/config/EffectSystemConfig.js';
import { primaryEffects } from '../../js/props/PrimaryEffects.js';
import { processingInfluences } from '../../js/props/ProcessingInfluences.js';
import { flavorInfluences } from '../../js/props/FlavorInfluences.js';
import { effectCombinations } from '../../js/props/EffectCombinations.js';
import { mapEffectCombinations } from '../../js/utils/EffectInteractionMapper.js';
import { formatScoreWithBar, createMarkdownTable, objectToMarkdown, createExpandableSection } from './markdownUtils.js';

/**
 * Generates an enhanced effects report with detailed component contribution analysis
 * @param {Function} progressCallback - Optional callback to report progress (receives report text)
 * @returns {Object} The complete report data
 */
export async function generateEnhancedEffectsReport(progressCallback) {
    // Initialize configuration with recommended values
    const config = new EffectSystemConfig({
        componentWeights: {
            teaType: 0.2,         // Reduced from 0.45
            compounds: 0.2,    // Unchanged
            processing: 0.2,   // Increased from 0.18
            geography: 0.2,    // Increased from 0.12
            flavors: 0.2       // Increased from 0.10
        },
        interactionStrengthFactor: 0.8  // Increased from 0.6
    });
    
    const teaEffectCalculator = new TeaEffectCalculator(config);
    teaEffectCalculator.loadData(
        primaryEffects,
        flavorInfluences,
        processingInfluences,
        mapEffectCombinations(effectCombinations),
        {}  // Empty geography influences - calculated internally
    );

    let report = '# TEA EFFECTS DETAILED ANALYSIS REPORT\n\n';
    report += `_Generated on ${new Date().toLocaleString()}_\n\n`;
    report += '## Configuration\n\n';
    report += '### Component Weights\n\n';
    const components = [
        { Component: 'Tea Type', Weight: config.get('componentWeights.teaType') },
        { Component: 'Compounds', Weight: config.get('componentWeights.compounds') },
        { Component: 'Processing', Weight: config.get('componentWeights.processing') },
        { Component: 'Geography', Weight: config.get('componentWeights.geography') },
        { Component: 'Flavors', Weight: config.get('componentWeights.flavors') }
    ];
    report += createMarkdownTable(components);
    
    report += '\n## Tea Analysis\n\n';
    
    // Detailed report data
    const teaReports = [];
    
    // Calculate accuracy metrics
    let totalTeas = 0;
    let dominantMatches = 0;
    let supportingMatches = 0;
    let bothMatches = 0;
    
    // Process each tea
    for (const tea of teaDatabase) {
        if (!tea || !tea.name) continue;
        
        // Skip teas without expected effects
        if (!tea.expectedEffects?.dominant) continue;
        
        totalTeas++;
        
        // Get expected effects
        const expectedDominant = tea.expectedEffects.dominant;
        const expectedSupporting = tea.expectedEffects.supporting || 'none';
        
        // Calculate effects with all components
        const result = teaEffectCalculator.infer(tea);
        
        // Extract essential data for the report
        const {
            dominantEffect,
            supportingEffects,
            additionalEffects,
            interactions,
            componentScores,
            scoreProgression
        } = result;
        
        // Format tea name and details
        report += `### ${tea.name} (${tea.type})\n\n`;
        report += `**Origin:** ${tea.origin}  \n`;
        report += `**Caffeine:** ${tea.caffeineLevel}/10  \n`;
        report += `**L-Theanine:** ${tea.lTheanineLevel}/10  \n`;
        report += `**Ratio:** ${(tea.lTheanineLevel/tea.caffeineLevel).toFixed(2)}:1  \n`;
        report += `**Processing:** ${tea.processingMethods.join(', ')}  \n`;
        report += `**Flavors:** ${tea.flavorProfile.join(', ')}  \n\n`;
        
        // Compare expected vs calculated effects
        report += '#### Expected vs Calculated Effects\n\n';
        report += '| | Expected | Calculated | Score | Match |\n';
        report += '|---|---|---|---|---|\n';
        
        // Get calculated effects
        const dominantCalculated = dominantEffect?.id || 'none';
        const supportingCalculated = supportingEffects[0]?.id || 'none';
        
        // Check for matches
        const dominantMatch = dominantCalculated === expectedDominant;
        const supportingMatch = supportingCalculated === expectedSupporting;
        
        // Add to accuracy counters
        if (dominantMatch) dominantMatches++;
        if (supportingMatch) supportingMatches++;
        if (dominantMatch && supportingMatch) bothMatches++;
        
        // Format match indicators
        const formatMatch = (isMatch) => isMatch ? '✅' : '❌';
        
        // Add rows to the table
        report += `| Dominant | ${expectedDominant} | ${dominantCalculated} | ${dominantEffect?.level.toFixed(1) || 0}/10 | ${formatMatch(dominantMatch)} |\n`;
        report += `| Supporting | ${expectedSupporting} | ${supportingCalculated} | ${supportingEffects[0]?.level.toFixed(1) || 0}/10 | ${formatMatch(supportingMatch)} |\n\n`;
        
        // Component Contribution Analysis
        report += '#### Component Contribution Analysis\n\n';
        
        // Get the top effects to analyze (expected + calculated)
        const topEffects = new Set([
            expectedDominant,
            expectedSupporting,
            dominantCalculated,
            supportingCalculated
        ].filter(e => e && e !== 'none'));
        
        // Create component contribution table
        report += '| Effect | Tea Type | +Processing | +Geography | +Flavor | +Compounds | Final |\n';
        report += '|--------|----------|------------|------------|---------|------------|-------|\n';
        
        // Add rows for each top effect
        for (const effectId of topEffects) {
            const teaTypeScore = (scoreProgression.withTeaTypeScores || {})[effectId]?.toFixed(1) || "0.0";
            const compoundScore = (scoreProgression.withCompoundScores || {})[effectId]?.toFixed(1) || "0.0";
            const processingScore = (scoreProgression.withProcessingScores || {})[effectId]?.toFixed(1) || "0.0";
            const geographyScore = (scoreProgression.withGeographyScores || {})[effectId]?.toFixed(1) || "0.0";
            const flavorScore = (scoreProgression.withFlavorScores || {})[effectId]?.toFixed(1) || "0.0";
            const final = dominantEffect?.id === effectId ? dominantEffect.level.toFixed(1) : 
                        supportingEffects.find(e => e.id === effectId)?.level.toFixed(1) || "0.0";
            
            // Highlight expected and calculated effects
            let effectName = effectId;
            
            if (effectId === expectedDominant) {
                effectName = `**${effectId}** (E-Dom)`;
            } else if (effectId === expectedSupporting) {
                effectName = `**${effectId}** (E-Sup)`;
            } else if (effectId === dominantCalculated) {
                effectName = `**${effectId}** (C-Dom)`;
            } else if (effectId === supportingCalculated) {
                effectName = `**${effectId}** (C-Sup)`;
            }
            
            report += `| ${effectName} | ${teaTypeScore} | ${processingScore} | ${geographyScore} | ${flavorScore} | ${compoundScore} | ${final} |\n`;
        }
        report += '\n';
        
        // Add raw component scores in a collapsible section
        const componentScoreContent = '#### Raw Component Scores\n\n';
        
        // Tea Type scores table
        const teaTypeScoresContent = '**Tea Type Scores**\n\n' +
            Object.entries(scoreProgression.withTeaTypeScores || {})
                .map(([effect, score]) => `- ${effect}: ${score.toFixed(1)}/10`)
                .join('\n');
        
        // Compound scores table
        const compoundScoresContent = '**Compound Scores**\n\n' +
            Object.entries(componentScores.compounds || {})
                .sort(([, a], [, b]) => b - a)
                .map(([effect, score]) => `${effect}: ${score.toFixed(1)}`)
                .join('\n');
        
        report += createExpandableSection('Raw Component Scores', 
            teaTypeScoresContent + '\n\n' + 
            compoundScoresContent
        );
        
        report += '\n\n';

        // If this is a mismatch, add analysis of what's missing
        if (!dominantMatch) {
            report += '#### Mismatch Analysis\n\n';
            
            // Find position of expected dominant in calculated ranking
            const sortedEffects = Object.entries(scoreProgression.withCompoundScores || {})
                .sort(([, a], [, b]) => b - a);
            
            const expectedIndex = sortedEffects.findIndex(([effect]) => effect === expectedDominant);
            
            if (expectedIndex > 0) {
                const calculatedScore = sortedEffects[0][1];
                const expectedScore = sortedEffects[expectedIndex][1];
                const gap = calculatedScore - expectedScore;
                
                report += `Expected dominant effect '${expectedDominant}' is ranked #${expectedIndex + 1} with score ${expectedScore.toFixed(2)}\n`;
                report += `Gap from dominant '${sortedEffects[0][0]}': ${gap.toFixed(2)} points\n\n`;
                
                // Suggestions
                report += '**Suggestions to fix:**\n\n';
                report += `- Increase '${expectedDominant}' contribution by approximately ${(gap + 0.5).toFixed(1)} points\n`;
                report += `- Check processing and flavor contributions for '${expectedDominant}'\n`;
                
                // Specific advice based on expected effect
                if (expectedDominant === "focusing") {
                    report += "- Increase focusing contribution from shade-grown processing and umami/marine flavors\n";
                } else if (expectedDominant === "comforting") {
                    report += "- Increase comforting contribution from heavy-roast processing and woody flavors\n";
                } else if (expectedDominant === "grounding") {
                    report += "- Increase grounding contribution from aged/fermented processing methods\n";
                } else if (expectedDominant === "elevating") {
                    report += "- Increase elevating contribution from floral/fruity flavors and light processing\n";
                }
            } else {
                report += `Expected dominant effect '${expectedDominant}' is not in the top calculated effects at all.\n`;
                report += "This indicates a significant calculation issue.\n";
            }
            
            report += '\n';
        }
        
        // Add divider between teas
        report += '---\n\n';
        
        // Store detailed tea report data
        teaReports.push({
            name: tea.name,
            expected: {
                dominant: expectedDominant,
                supporting: expectedSupporting
            },
            calculated: {
                dominant: dominantCalculated,
                dominantScore: dominantEffect?.level || 0,
                supporting: supportingCalculated,
                supportingScore: supportingEffects[0]?.level || 0
            },
            matches: {
                dominant: dominantMatch,
                supporting: supportingMatch,
                both: dominantMatch && supportingMatch
            },
            scores: scoreProgression.withCompoundScores || {},
            buildUp: scoreProgression
        });
        
        // Report progress periodically
        if (teaDatabase.indexOf(tea) % 5 === 0 && progressCallback) {
            progressCallback(report);
            // Let the UI update
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }
    
    // Add accuracy summary
    report += '## ACCURACY SUMMARY\n\n';
    report += `Total teas analyzed: **${totalTeas}**\n\n`;
    report += '| Accuracy Type | Count | Percentage |\n';
    report += '|---------------|-------|------------|\n';
    report += `| Dominant Effect Match | ${dominantMatches}/${totalTeas} | ${(dominantMatches/totalTeas*100).toFixed(1)}% |\n`;
    report += `| Supporting Effect Match | ${supportingMatches}/${totalTeas} | ${(supportingMatches/totalTeas*100).toFixed(1)}% |\n`;
    report += `| Both Effects Match | ${bothMatches}/${totalTeas} | ${(bothMatches/totalTeas*100).toFixed(1)}% |\n\n`;
    
    // Add analysis of problematic cases
    const problemTeas = teaReports.filter(tea => !tea.matches.dominant);
    
    if (problemTeas.length > 0) {
        report += '## PROBLEM CASES ANALYSIS\n\n';
        report += `${problemTeas.length} teas have incorrect dominant effect calculations:\n\n`;
        
        problemTeas.forEach(tea => {
            report += `- **${tea.name}**: Expected ${tea.expected.dominant}, got ${tea.calculated.dominant}\n`;
        });
        
        report += '\n### Common Patterns in Problem Cases\n\n';
        
        // Analyze common patterns
        const overrepresentedEffects = {};
        const underrepresentedEffects = {};
        
        problemTeas.forEach(tea => {
            if (!overrepresentedEffects[tea.calculated.dominant]) {
                overrepresentedEffects[tea.calculated.dominant] = 0;
            }
            overrepresentedEffects[tea.calculated.dominant]++;
            
            if (!underrepresentedEffects[tea.expected.dominant]) {
                underrepresentedEffects[tea.expected.dominant] = 0;
            }
            underrepresentedEffects[tea.expected.dominant]++;
        });
        
        // Display overrepresented effects
        report += '**Overrepresented Effects** (calculated as dominant more than expected):\n\n';
        Object.entries(overrepresentedEffects)
            .sort(([, a], [, b]) => b - a)
            .forEach(([effect, count]) => {
                report += `- ${effect}: ${count} times\n`;
            });
        
        // Display underrepresented effects
        report += '\n**Underrepresented Effects** (expected as dominant but not calculated):\n\n';
        Object.entries(underrepresentedEffects)
            .sort(([, a], [, b]) => b - a)
            .forEach(([effect, count]) => {
                report += `- ${effect}: ${count} times\n`;
            });
    }
    
    // Final improvement recommendations
    report += '\n## RECOMMENDATIONS\n\n';
    report += '### Component Weight Adjustments\n\n';
    report += '```javascript\n';
    report += 'componentWeights: {\n';
    report += '  teaType: 0.35,         // REDUCED from 0.45\n';
    report += '  compounds: 0.15,    // Unchanged\n';
    report += '  processing: 0.25,   // INCREASED from 0.18\n';
    report += '  geography: 0.15,    // INCREASED from 0.12\n';
    report += '  flavors: 0.15       // INCREASED from 0.10\n';
    report += '}\n';
    report += '```\n\n';
    
    report += '### L-Theanine/Caffeine Ratio Effect Adjustments\n\n';
    report += '```javascript\n';
    report += '// For ratio > 1.5 (high L-Theanine):\n';
    report += 'baseScores["calming"] = Math.min(10, tea.lTheanineLevel * 0.6);  // REDUCED from 0.8\n';
    report += 'baseScores["restorative"] = Math.min(10, tea.lTheanineLevel * 0.5);  // REDUCED from 0.7\n\n';
    report += '// For ratio < 1.0 (high Caffeine):\n';
    report += 'baseScores["energizing"] = Math.min(10, tea.caffeineLevel * 0.7);  // REDUCED from 0.9\n';
    report += 'baseScores["focusing"] = Math.min(10, tea.caffeineLevel * 0.5);    // REDUCED from 0.7\n';
    report += '```\n\n';
    
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
            dominantMatches,
            supportingMatches,
            bothMatches,
            dominantMatchRate: (dominantMatches/totalTeas*100).toFixed(1),
            supportingMatchRate: (supportingMatches/totalTeas*100).toFixed(1),
            bothMatchRate: (bothMatches/totalTeas*100).toFixed(1)
        }
    };
} 