// enhanced-effects-report.js
// A more detailed tea effects comparison report generator

import { teaDatabase } from './data/TeaDatabase.js';
import { TeaEffectCalculator } from './calculators/TeaEffectCalculator.js';
import { defaultConfig } from './config/defaultConfig.js';
import { EffectSystemConfig } from './config/EffectSystemConfig.js';
import { primaryEffects } from './props/PrimaryEffects.js';
import { processingInfluences } from './props/ProcessingInfluences.js';
import { flavorInfluences } from './props/FlavorInfluences.js';
import { effectCombinations } from './props/EffectCombinations.js';
import geographicalDescriptors from './props/GeographicalDescriptors.js';
import { mapEffectCombinations } from './utils/EffectInteractionMapper.js';
import { formatScoreWithBar, createMarkdownTable, objectToMarkdown, createExpandableSection } from './utils/markdownUtils.js';

/**
 * Generates an enhanced effects report with detailed component contribution analysis
 * @param {Function} progressCallback - Optional callback to report progress (receives report text)
 * @returns {Object} The complete report data
 */
export async function generateEnhancedEffectsReport(progressCallback) {
    // Use the updated component weights from the defaultConfig
    const effectSystemConfig = new EffectSystemConfig(defaultConfig);
    const teaEffectCalculator = new TeaEffectCalculator(effectSystemConfig);
    
    // Debug log the configuration being used
    console.log("Using component weights:", defaultConfig.componentWeights);
    
    // Load required data for effect calculations
    try {
        // Load the raw effect combinations directly
        teaEffectCalculator.loadData(
            primaryEffects,
            flavorInfluences,
            processingInfluences,
            effectCombinations,  // Use raw effectCombinations instead of mapped version
            geographicalDescriptors.geographicFeatureToEffectMapping  // Add proper geography data
        );
        
        // Set interaction data separately
        teaEffectCalculator.interactionCalculator.setEffectCombinations(effectCombinations);
        
        console.log("Successfully loaded all effect calculation data");
    } catch (error) {
        console.error('Error loading data for effect calculator:', error);
        throw new Error('Failed to initialize effect calculator: ' + error.message);
    }

    let report = '# TEA EFFECTS DETAILED ANALYSIS REPORT\n\n';
    report += `_Generated on ${new Date().toLocaleString()}_\n\n`;
    report += '## Configuration\n\n';
    report += '### Component Weights\n\n';
    
    const components = [
        { Component: 'Tea Type', Weight: defaultConfig.componentWeights.teaType },
        { Component: 'Compounds', Weight: defaultConfig.componentWeights.compounds },
        { Component: 'Processing', Weight: defaultConfig.componentWeights.processing },
        { Component: 'Geography', Weight: defaultConfig.componentWeights.geography },
        { Component: 'Flavors', Weight: defaultConfig.componentWeights.flavors }
    ];
    report += createMarkdownTable(components);
    
    report += '\n## Tea Analysis\n\n';
    
    // Detailed report data
    const teaReports = [];
    
    // Initialize accuracy metrics
    let totalTeas = 0;
    let finalDominantMatches = 0;
    let finalSupportingMatches = 0;
    let finalBothMatches = 0;
    let baseDominantMatches = 0;
    let baseSupportingMatches = 0;
    let baseBothMatches = 0;
    
    // Process each tea
    const teas = teaDatabase; // Use the array directly
    for (const tea of teas) {
        try {
            const inference = teaEffectCalculator.calculate(tea);
            if (!inference) {
                console.warn(`No inference generated for tea: ${tea.name}`);
                continue;
            }
            
            const { data } = inference;
            
            // Validate data structure
            if (!data.componentScores || !data.scoreProgression) {
                console.warn(`Tea ${tea.name} is missing expected data structure:`, {
                    hasComponentScores: !!data.componentScores,
                    hasScoreProgression: !!data.scoreProgression
                });
                continue;
            }
            
            // Debug log score progression
            console.log(`Tea ${tea.name} score progression:`, {
                teaType: data.scoreProgression?.withTeaTypeScores,
                processing: data.scoreProgression?.withProcessingScores,
                geography: data.scoreProgression?.withGeographyScores,
                flavor: data.scoreProgression?.withFlavorScores,
                compounds: data.scoreProgression?.withCompoundScores
            });
            
            // Extract essential data for the report
            const {
                dominantEffect,
                supportingEffects,
                additionalEffects,
                interactions,
                componentScores,
                scoreProgression
            } = data || {};
            
            // Format tea name and details
            report += `### ${tea.name} (${tea.type})\n\n`;
            report += `**Origin:** ${tea.origin}  \n`;
            report += `**Caffeine:** ${tea.caffeineLevel}/10  \n`;
            report += `**L-Theanine:** ${tea.lTheanineLevel}/10  \n`;
            report += `**Ratio:** ${(tea.lTheanineLevel/tea.caffeineLevel).toFixed(2)}:1  \n`;
            report += `**Processing:** ${tea.processingMethods?.join(', ') || 'Unknown'}  \n`;
            report += `**Flavors:** ${tea.flavorProfile?.join(', ') || 'Unknown'}  \n\n`;
            
            // Compare expected vs calculated effects
            report += '#### Expected vs Calculated Effects\n\n';
            report += '| | Expected | Calculated | Score | Match |\n';
            report += '|---|---|---|---|---|\n';
            
            // Get calculated effects
            const dominantCalculated = dominantEffect?.id || 'none';
            const supportingCalculated = supportingEffects?.[0]?.id || 'none';
            
            // Extract expected effects with proper validation
            function getExpectedDominant(tea) {
                if (!tea.expectedEffects) return 'none';
                
                // Direct property
                if (tea.expectedEffects.dominant) {
                    return tea.expectedEffects.dominant;
                }
                
                // Highest score in expected effects
                const effects = Object.entries(tea.expectedEffects)
                    .filter(([key]) => key !== 'supporting' && typeof key === 'string');
                
                if (effects.length === 0) return 'none';
                
                return effects.sort(([, a], [, b]) => b - a)[0][0];
            }
            
            function getExpectedSupporting(tea) {
                if (!tea.expectedEffects) return 'none';
                
                // Direct property
                if (tea.expectedEffects.supporting) {
                    return tea.expectedEffects.supporting;
                }
                
                // Second highest score in expected effects
                const effects = Object.entries(tea.expectedEffects)
                    .filter(([key]) => key !== 'supporting' && typeof key === 'string');
                
                if (effects.length < 2) return 'none';
                
                return effects.sort(([, a], [, b]) => b - a)[1][0];
            }
            
            // Get expected effects using the new functions
            const expectedDominant = getExpectedDominant(tea);
            const expectedSupporting = getExpectedSupporting(tea);
            
            // Debug log the expected vs calculated effects
            console.log(`Tea ${tea.name}:`, {
                expected: { dominant: expectedDominant, supporting: expectedSupporting },
                calculated: { dominant: dominantCalculated, supporting: supportingCalculated }
            });
            
            // Only count teas with valid expected effects
            if (expectedDominant !== 'none') {
                totalTeas++;
            }
            
            // Check for matches
            const dominantMatch = dominantCalculated === expectedDominant;
            const supportingMatch = supportingCalculated === expectedSupporting;
            
            // Add to accuracy counters
            if (dominantMatch) finalDominantMatches++;
            if (supportingMatch) finalSupportingMatches++;
            if (dominantMatch && supportingMatch) finalBothMatches++;
            
            // Format match indicators
            const formatMatch = (isMatch) => isMatch ? '✅' : '❌';
            
            // Add rows to the table
            report += `| Dominant | ${expectedDominant} | ${dominantCalculated} | ${dominantEffect?.level?.toFixed(1) || 0}/10 | ${formatMatch(dominantMatch)} |\n`;
            report += `| Supporting | ${expectedSupporting} | ${supportingCalculated} | ${supportingEffects?.[0]?.level?.toFixed(1) || 0}/10 | ${formatMatch(supportingMatch)} |\n\n`;
            
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
                const teaTypeScore = (scoreProgression?.withTeaTypeScores || {})[effectId]?.toFixed(1) || "0.0";
                const compoundScore = (scoreProgression?.withCompoundScores || {})[effectId]?.toFixed(1) || "0.0";
                const processingScore = (scoreProgression?.withProcessingScores || {})[effectId]?.toFixed(1) || "0.0";
                const geographyScore = (scoreProgression?.withGeographyScores || {})[effectId]?.toFixed(1) || "0.0";
                const flavorScore = (scoreProgression?.withFlavorScores || {})[effectId]?.toFixed(1) || "0.0";
                const final = dominantEffect?.id === effectId ? dominantEffect.level?.toFixed(1) : 
                            supportingEffects?.find(e => e.id === effectId)?.level?.toFixed(1) || "0.0";
                
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
                Object.entries(scoreProgression?.withTeaTypeScores || {})
                    .map(([effect, score]) => `- ${effect}: ${score.toFixed(1)}/10`)
                    .join('\n');
            
            // Compound scores table
            const compoundScoresContent = '**Compound Scores**\n\n' +
                Object.entries(componentScores?.compounds || {})
                    .sort(([, a], [, b]) => b - a)
                    .map(([effect, score]) => `${effect}: ${score.toFixed(1)}`)
                    .join('\n');
            
            // Processing scores table
            const processingScoresContent = '**Processing Scores**\n\n' +
                Object.entries(componentScores?.processing || {})
                    .sort(([, a], [, b]) => b - a)
                    .map(([effect, score]) => `${effect}: ${score.toFixed(1)}`)
                    .join('\n');
            
            // Geography scores table
            const geographyScoresContent = '**Geography Scores**\n\n' +
                Object.entries(componentScores?.geography || {})
                    .sort(([, a], [, b]) => b - a)
                    .map(([effect, score]) => `${effect}: ${score.toFixed(1)}`)
                    .join('\n');
            
            // Flavor scores table
            const flavorScoresContent = '**Flavor Scores**\n\n' +
                Object.entries(componentScores?.flavors || {})
                    .sort(([, a], [, b]) => b - a)
                    .map(([effect, score]) => `${effect}: ${score.toFixed(1)}`)
                    .join('\n');
            
            report += createExpandableSection('Raw Component Scores', 
                teaTypeScoresContent + '\n\n' + 
                compoundScoresContent + '\n\n' +
                processingScoresContent + '\n\n' +
                geographyScoresContent + '\n\n' +
                flavorScoresContent
            );
            
            report += '\n\n';

            // If this is a mismatch, add analysis of what's missing
            if (!dominantMatch) {
                report += '#### Mismatch Analysis\n\n';
                
                // Find position of expected dominant in calculated ranking
                const sortedEffects = Object.entries(scoreProgression?.withCompoundScores || {})
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
                    } else if (expectedDominant === "energizing") {
                        report += "- Increase energizing contribution from high-caffeine content and citrus/spicy flavors\n";
                    } else if (expectedDominant === "calming") {
                        report += "- Increase calming contribution from high L-theanine content and minimal-processing methods\n";
                    } else if (expectedDominant === "harmonizing") {
                        report += "- Increase harmonizing contribution from balanced L-theanine and caffeine levels\n";
                    } else if (expectedDominant === "restorative") {
                        report += "- Increase restorative contribution from shade-grown processing and umami/mineral flavors\n";
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
                    supportingScore: supportingEffects?.[0]?.level || 0
                },
                matches: {
                    dominant: dominantMatch,
                    supporting: supportingMatch,
                    both: dominantMatch && supportingMatch
                },
                scores: scoreProgression?.withCompoundScores || {},
                buildUp: scoreProgression
            });
            
            // Report progress periodically
            if (teas.indexOf(tea) % 5 === 0 && progressCallback) {
                progressCallback(report);
                // Let the UI update
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        } catch (error) {
            console.error(`Error processing tea: ${tea.name}`, error);
        }
    }
    
    // Add accuracy summary
    report += '## ACCURACY SUMMARY\n\n';
    report += `Total teas analyzed: **${totalTeas}**\n\n`;
    report += '| Accuracy Type | Count | Percentage |\n';
    report += '|---------------|-------|------------|\n';
    report += `| Dominant Effect Match | ${finalDominantMatches}/${totalTeas} | ${(finalDominantMatches/totalTeas*100).toFixed(1)}% |\n`;
    report += `| Supporting Effect Match | ${finalSupportingMatches}/${totalTeas} | ${(finalSupportingMatches/totalTeas*100).toFixed(1)}% |\n`;
    report += `| Both Effects Match | ${finalBothMatches}/${totalTeas} | ${(finalBothMatches/totalTeas*100).toFixed(1)}% |\n\n`;
    
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
    
    // Final improvement recommendations based on the current configuration
    report += '\n## RECOMMENDATIONS\n\n';
    report += '### Component Weight Adjustments\n\n';
    report += '```javascript\n';
    report += 'componentWeights: {\n';
    report += `  teaType: ${defaultConfig.componentWeights.teaType},\n`;
    report += `  compounds: ${defaultConfig.componentWeights.compounds},\n`;
    report += `  processing: ${defaultConfig.componentWeights.processing},\n`;
    report += `  geography: ${defaultConfig.componentWeights.geography},\n`;
    report += `  flavors: ${defaultConfig.componentWeights.flavors}\n`;
    report += '}\n';
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
            finalDominantMatches,
            finalSupportingMatches,
            finalBothMatches,
            finalDominantMatchRate: (finalDominantMatches/totalTeas*100).toFixed(1),
            finalSupportingMatchRate: (finalSupportingMatches/totalTeas*100).toFixed(1),
            finalBothMatchRate: (finalBothMatches/totalTeas*100).toFixed(1)
        }
    };
} 