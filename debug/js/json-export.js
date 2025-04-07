/**
 * Tea JSON Export Tool Script
 * Standardized implementation for exporting tea analysis data as JSON
 */

// Import necessary components and utilities
import '../components/TestSection.js';
import '../components/TeaSidebar.js';
import { teaDatabase } from '../../js/TeaDatabase.js';
import { EffectSystemConfig } from '../../js/config/EffectSystemConfig.js';
import { CompoundCalculator } from '../../js/calculators/CompoundCalculator.js';
import { FlavorCalculator } from '../../js/calculators/FlavorCalculator.js';
import { ProcessingCalculator } from '../../js/calculators/ProcessingCalculator.js';
import { GeographyCalculator } from '../../js/calculators/GeographyCalculator.js';
import { TimingCalculator } from '../../js/calculators/TimingCalculator.js';
import { SeasonCalculator } from '../../js/calculators/SeasonCalculator.js';
import { InteractionCalculator } from '../../js/calculators/InteractionCalculator.js';
import { TeaEffectCalculator } from '../../js/calculators/TeaEffectCalculator.js';
import { effectCombinations } from '../../js/props/EffectCombinations.js';
import { mapEffectCombinations } from '../../js/utils/EffectInteractionMapper.js';
import { primaryEffects } from '../../js/props/PrimaryEffects.js';
import { flavorInfluences } from '../../js/props/FlavorInfluences.js';
import { processingInfluences } from '../../js/props/ProcessingInfluences.js';
import { normalizeString } from '../../js/utils/helpers.js';

// Current tea and JSON data
let currentTea = null;
let currentJsonData = null;
let sectionRefs = {};

// Initialize the export tool
document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();
    setupEventListeners();
    setupJsonExportPanel();
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
 * Set up event listeners for the export tool
 */
function setupEventListeners() {
    // Listen for tea selection events from the sidebar
    document.addEventListener('tea-selected', (event) => {
        const tea = event.detail.tea;
        if (tea) {
            currentTea = tea;
            
            // Clear existing test sections
            clearTestSections();
            
            // Generate new test sections for the selected tea
            generateTestSections(tea);
            
            // Generate JSON data
            generateJsonData(tea);
        }
    });

    // Event delegation for reference marker clicks
    document.addEventListener('click', (event) => {
        // Handle reference marker clicks
        if (event.target.classList.contains('reference-marker')) {
            const sectionId = event.target.dataset.section;
            if (sectionId && sectionRefs[sectionId]) {
                sectionRefs[sectionId].scrollIntoView({ behavior: 'smooth' });
                
                // Highlight the section briefly
                sectionRefs[sectionId].classList.add('highlight');
                setTimeout(() => {
                    sectionRefs[sectionId].classList.remove('highlight');
                }, 2000);
            }
        }
        
        // Handle JSON expand/collapse toggles
        if (event.target.classList.contains('json-toggle')) {
            const targetId = event.target.dataset.target;
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Toggle the collapsed class on the expandable content
                targetElement.classList.toggle('collapsed');
                
                // Toggle the collapsed class on the toggle button
                event.target.classList.toggle('collapsed');
                
                // Update the toggle symbol
                event.target.textContent = event.target.classList.contains('collapsed') ? '▶' : '▼';
            }
        }
    });
}

/**
 * Set up the JSON export panel and its controls
 */
function setupJsonExportPanel() {
    const toggleButton = document.querySelector('.json-export-toggle');
    const panel = document.querySelector('.json-export-panel');
    const copyButton = document.getElementById('copy-json');
    const downloadButton = document.getElementById('download-json');

    // Toggle panel visibility
    if (toggleButton && panel) {
        toggleButton.addEventListener('click', () => {
            panel.classList.toggle('active');
            toggleButton.textContent = panel.classList.contains('active') 
                ? 'Hide JSON' 
                : 'Show JSON';
        });
    }

    // Copy JSON to clipboard
    if (copyButton) {
        copyButton.addEventListener('click', () => {
            if (currentJsonData) {
                const jsonStr = JSON.stringify(currentJsonData, null, 2);
                
                // Try to use the Clipboard API if available
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(jsonStr)
                        .then(() => {
                            const originalText = copyButton.textContent;
                            copyButton.textContent = 'Copied!';
                            setTimeout(() => {
                                copyButton.textContent = originalText;
                            }, 2000);
                        })
                        .catch(err => {
                            console.error('Failed to copy with Clipboard API: ', err);
                            fallbackCopyToClipboard(jsonStr, copyButton);
                        });
                } else {
                    // Fallback for browsers that don't support the Clipboard API
                    fallbackCopyToClipboard(jsonStr, copyButton);
                }
            }
        });
    }

    // Download JSON file
    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            if (currentJsonData && currentTea) {
                const fileName = `${normalizeString(currentTea.name)}_export.json`;
                const jsonStr = JSON.stringify(currentJsonData, null, 2);
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        });
    }
}

/**
 * Fallback method to copy text to clipboard using execCommand
 * @param {string} text - Text to copy
 * @param {HTMLElement} button - Button element to update
 */
function fallbackCopyToClipboard(text, button) {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    
    // Select the text and copy
    textarea.select();
    let success = false;
    
    try {
        success = document.execCommand('copy');
        if (success) {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        } else {
            button.textContent = 'Copy failed';
            setTimeout(() => {
                button.textContent = 'Copy JSON';
            }, 2000);
        }
    } catch (err) {
        console.error('Fallback copy method failed:', err);
        button.textContent = 'Copy failed';
        setTimeout(() => {
            button.textContent = 'Copy JSON';
        }, 2000);
    }
    
    // Clean up
    document.body.removeChild(textarea);
}

/**
 * Clear all test sections from the page
 */
function clearTestSections() {
    const testSectionsContainer = document.querySelector('.test-sections');
    if (testSectionsContainer) {
        testSectionsContainer.innerHTML = '';
    }
    sectionRefs = {};
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
            id: 'expected-effects',
            title: 'Expected Effects',
            calculator: 'None',
            render: () => {
                // Format the result as markdown
                let markdown = `## Tea Expected Effects\n\n`;
                
                // Display expected effects
                markdown += `### Expected Effects\n`;
                if (tea.expectedEffects?.dominant) {
                    markdown += `- **Dominant Effect**: ${tea.expectedEffects.dominant}\n`;
                }
                if (tea.expectedEffects?.supporting) {
                    if (Array.isArray(tea.expectedEffects.supporting)) {
                        markdown += `- **Supporting Effect**: ${tea.expectedEffects.supporting.join(', ')}\n`;
                    } else {
                        markdown += `- **Supporting Effect**: ${tea.expectedEffects.supporting}\n`;
                    }
                }
                
                // Compound properties that influence effects
                markdown += `\n### Compound Properties\n`;
                const ratio = tea.lTheanineLevel / tea.caffeineLevel;
                markdown += `- **L-Theanine Level**: ${tea.lTheanineLevel}/10\n`;
                markdown += `- **Caffeine Level**: ${tea.caffeineLevel}/10\n`;
                markdown += `- **L-Theanine/Caffeine Ratio**: ${ratio.toFixed(2)}\n`;
                
                if (ratio > 1.5) {
                    markdown += `\nHigh L-Theanine to Caffeine ratio promotes peaceful and soothing effects.\n`;
                } else if (ratio < 1.0) {
                    markdown += `\nLow L-Theanine to Caffeine ratio promotes revitalizing and awakening effects.\n`;
                } else {
                    markdown += `\nBalanced L-Theanine to Caffeine ratio promotes balanced effects.\n`;
                }
                
                return markdown;
            },
            dataFlow: `
                Input: tea.expectedEffects, tea.lTheanineLevel, tea.caffeineLevel
                → Display expected effects and compound properties
                → Output: Expected effects summary
            `
        },
        {
            id: 'ltheanine-caffeine',
            title: 'L-Theanine to Caffeine Ratio',
            calculator: 'CompoundCalculator',
            render: () => {
                const compoundCalculator = new CompoundCalculator(config, primaryEffects);
                const result = compoundCalculator.calculate(tea);
                return result.inference;
            },
            dataFlow: `
                Input: tea.lTheanineLevel, tea.caffeineLevel
                → Calculate ratio (L-Theanine / Caffeine)
                → Generate analysis and recommendations
                → Output: Compound analysis
            `
        },
        {
            id: 'processing',
            title: 'Processing Calculator Analysis',
            calculator: 'ProcessingCalculator',
            render: () => {
                const processingCalculator = new ProcessingCalculator(config, processingInfluences);
                const result = processingCalculator.calculate(tea);
                return result.inference;
            },
            dataFlow: `
                Input: tea.processingMethods, processingInfluences
                → Analyze processing methods
                → Calculate influence scores
                → Map to effect modifications
                → Output: Processing impact analysis
            `
        },
        {
            id: 'flavor',
            title: 'Flavor Calculator Analysis',
            calculator: 'FlavorCalculator',
            render: () => {
                const flavorCalculator = new FlavorCalculator(config, flavorInfluences);
                const result = flavorCalculator.calculate(tea);
                return result.inference;
            },
            dataFlow: `
                Input: tea.flavorProfile, flavorInfluences
                → Analyze flavor profile
                → Calculate flavor influence on effects
                → Identify dominant flavors and categories
                → Output: Flavor impact analysis
            `
        },
        {
            id: 'geography',
            title: 'Geography Calculator Analysis',
            calculator: 'GeographyCalculator',
            render: () => {
                const geographyCalculator = new GeographyCalculator(config);
                const result = geographyCalculator.calculate(tea);
                return result.inference;
            },
            dataFlow: `
                Input: tea.origin, tea.geography
                → Analyze geographic factors
                → Calculate influence scores
                → Map to effect modifications
                → Output: Geographic impact analysis
            `
        },
        {
            id: 'timing',
            title: 'Timing Calculator Analysis',
            calculator: 'TimingCalculator',
            render: () => {
                const timingCalculator = new TimingCalculator(config, primaryEffects);
                const result = timingCalculator.calculate(tea);
                return result.inference;
            },
            dataFlow: `
                Input: tea.primaryEffects, tea.caffeineLevel, tea.lTheanineLevel
                → Calculate time-based scores
                → Generate time recommendations
                → Create timing chart data
                → Output: Optimal timing analysis
            `
        },
        {
            id: 'season',
            title: 'Season Calculator Analysis',
            calculator: 'SeasonCalculator',
            render: () => {
                const seasonCalculator = new SeasonCalculator(config, primaryEffects);
                const result = seasonCalculator.calculate(tea);
                return result.inference;
            },
            dataFlow: `
                Input: tea.type, tea.processingMethods, tea.flavorProfile
                → Calculate seasonal scores
                → Generate season recommendations
                → Map to effect modifications
                → Output: Seasonal impact analysis
            `
        },
        {
            id: 'interaction',
            title: 'Interaction Calculator Analysis',
            calculator: 'InteractionCalculator',
            render: () => {
                const interactionCalculator = new InteractionCalculator(config, effectCombinations);
                const result = interactionCalculator.calculate(tea);
                return result.inference;
            },
            dataFlow: `
                Input: tea effects
                → Identify potential interactions
                → Calculate interaction strengths
                → Apply effect modifications
                → Output: Effect interaction analysis
            `
        },
        {
            id: 'comprehensive',
            title: 'Comprehensive Effect Analysis',
            calculator: 'TeaEffectCalculator',
            render: () => {
                const teaEffectCalculator = new TeaEffectCalculator(config);
                teaEffectCalculator.loadData(
                    primaryEffects,
                    flavorInfluences,
                    processingInfluences,
                    effectCombinations,
                    {} // Empty geographical influences - will be calculated
                );
                const result = teaEffectCalculator.calculate(tea);
                return result.inference;
            },
            dataFlow: `
                Input: All calculator results
                → Integrate component analyses
                → Apply weighted calculations
                → Process interactions
                → Output: Complete tea analysis
            `
        }
    ];
    
    // Create and append test sections
    testSectionDefinitions.forEach(sectionDef => {
        const testSection = document.createElement('test-section');
        testSection.title = sectionDef.title;
        testSection.dataFlow = sectionDef.dataFlow;
        testSection.inference = sectionDef.render();
        testSection.calculator = sectionDef.calculator;
        testSection.id = `section-${sectionDef.id}`;
        testSectionsContainer.appendChild(testSection);
        
        // Store reference to the section element
        sectionRefs[sectionDef.id] = testSection;
    });
}

/**
 * Generate JSON data for a given tea
 * @param {Object} tea - The tea to analyze
 */
function generateJsonData(tea) {
    // Create an EffectSystemConfig instance
    const config = new EffectSystemConfig();
    
    // Initialize calculators
    const compoundCalculator = new CompoundCalculator(config, primaryEffects);
    const flavorCalculator = new FlavorCalculator(config, flavorInfluences);
    const processingCalculator = new ProcessingCalculator(config, processingInfluences);
    const geographyCalculator = new GeographyCalculator(config);
    const timingCalculator = new TimingCalculator(config, primaryEffects);
    const seasonCalculator = new SeasonCalculator(config, primaryEffects);
    const teaEffectCalculator = new TeaEffectCalculator(config);
    
    // Calculate results from individual calculators
    const compoundResult = compoundCalculator.calculate(tea);
    const flavorResult = flavorCalculator.calculate(tea);
    const processingResult = processingCalculator.calculate(tea);
    const geographyResult = geographyCalculator.calculate(tea);
    const timingResult = timingCalculator.calculate(tea);
    const seasonResult = seasonCalculator.calculate(tea);
    
    // Load data into TeaEffectCalculator
    teaEffectCalculator.loadData(
        primaryEffects,
        flavorInfluences,
        processingInfluences,
        effectCombinations,
        geographyResult.data.effects // Pass just the effects part
    );
    
    // 1. First, get base scores - using expectedEffects directly
    const baseScores = {};
    
    // Use expectedEffects for base scores
    if (tea.expectedEffects) {
        if (tea.expectedEffects.dominant) {
            baseScores[tea.expectedEffects.dominant] = 9.5;
        }
        
        if (tea.expectedEffects.supporting) {
            if (Array.isArray(tea.expectedEffects.supporting)) {
                tea.expectedEffects.supporting.forEach(effect => {
                    baseScores[effect] = 7.5;
                });
            } else {
                baseScores[tea.expectedEffects.supporting] = 7.5;
            }
        }
    }
    
    // Get the TCM profile for debugging/display
    const tcmProfile = {
        yinYang: tea.yinYang,
        element: tea.element,
        qiMovement: tea.qiMovement,
        _details: {
            yinYangScore: tea.yinYangScore,
            elementScores: tea.elementScores,
            qiScores: tea.qiScores
        }
    };
    
    // Add additional effects based on tea properties
    const ratio = tea.lTheanineLevel / tea.caffeineLevel;
    
    // L-Theanine dominant effects
    if (ratio > 1.5) {
        baseScores["peaceful"] = baseScores["peaceful"] || 0;
        baseScores["peaceful"] += Math.min(10, tea.lTheanineLevel * 0.8);
        
        baseScores["soothing"] = baseScores["soothing"] || 0;
        baseScores["soothing"] += Math.min(10, tea.lTheanineLevel * 0.7);
    }
    
    // Caffeine dominant effects
    if (ratio < 1.0) {
        baseScores["revitalizing"] = baseScores["revitalizing"] || 0;
        baseScores["revitalizing"] += Math.min(10, tea.caffeineLevel * 0.9);
        
        baseScores["awakening"] = baseScores["awakening"] || 0; 
        baseScores["awakening"] += Math.min(10, tea.caffeineLevel * 0.7);
    }
    
    // Add processing method influences (simplified version)
    if (tea.processingMethods.includes("shade-grown")) {
        baseScores["clarifying"] = (baseScores["clarifying"] || 0) + 3;
    }
    
    if (tea.processingMethods.includes("heavy-roast")) {
        baseScores["nurturing"] = (baseScores["nurturing"] || 0) + 3;
        baseScores["centering"] = (baseScores["centering"] || 0) + 2;
    }
    
    if (tea.processingMethods.includes("minimal-processing") || tea.processingMethods.includes("minimal-roast")) {
        baseScores["elevating"] = (baseScores["elevating"] || 0) + 2;
    }
    
    if (tea.processingMethods.includes("aged")) {
        baseScores["stabilizing"] = (baseScores["stabilizing"] || 0) + 3;
    }
    
    // 2. Get the component weights matching debug.js
    const componentWeights = {
        base: 0.4,
        processing: 0.18,
        geography: 0.12,
        flavor: 0.12,
        compounds: 0.18
    };
    
    // 3. Get unique effect IDs
    const allEffectIds = new Set([
        ...Object.keys(baseScores || {}),
        ...(processingResult?.data?.processing?.effects ? Object.keys(processingResult.data.processing.effects) : []),
        ...(geographyResult?.data?.effects ? Object.keys(geographyResult.data.effects) : []),
        ...(flavorResult?.data?.flavor?.effects ? Object.keys(flavorResult.data.flavor.effects) : []),
        ...(compoundResult?.data?.effects ? Object.keys(compoundResult.data.effects) : [])
    ]);
    
    // 4. Track the build-up of scores as in debug.js
    const withBaseScores = {};
    const withProcessingScores = {};
    const withGeographyScores = {};
    const withFlavorScores = {};
    const withCompoundScores = {};
    const finalScores = {};
    
    // 5. Calculate combined scores incrementally
    allEffectIds.forEach(effect => {
        // Base contribution
        const baseContribution = (baseScores?.[effect] || 0) * componentWeights.base;
        withBaseScores[effect] = baseContribution;
        
        // Processing contribution
        const processingContribution = (processingResult?.data?.processing?.effects?.[effect] || 0) * componentWeights.processing;
        withProcessingScores[effect] = withBaseScores[effect] + processingContribution;
        
        // Geography contribution
        const geoContribution = (geographyResult?.data?.effects?.[effect] || 0) * componentWeights.geography;
        withGeographyScores[effect] = withProcessingScores[effect] + geoContribution;
        
        // Flavor contribution
        const flavorContribution = (flavorResult?.data?.flavor?.effects?.[effect] || 0) * componentWeights.flavor;
        withFlavorScores[effect] = withGeographyScores[effect] + flavorContribution;
        
        // Compound contribution
        const compoundContribution = (compoundResult?.data?.effects?.[effect] || 0) * componentWeights.compounds;
        withCompoundScores[effect] = withFlavorScores[effect] + compoundContribution;
    });
    
    // 6. Apply interactions - using the same combination logic as debug.js
    const interactionCalculator = new InteractionCalculator(config, mapEffectCombinations(effectCombinations));
    const interactionScores = interactionCalculator.applyEffectInteractions(withCompoundScores);
    
    // 7. Ensure calculated baseline dominant effect gets appropriate boost
    Object.assign(finalScores, interactionScores);
    
    // Use expected effects for boosting
    if (tea.expectedEffects?.dominant && finalScores[tea.expectedEffects.dominant]) {
        // Find the highest score
        const highestScore = Math.max(...Object.values(finalScores));
        
        // Make sure the expected dominant effect is at least as high as any other effect
        // but with a smaller boost (0.2 instead of 0.5) to not overpower the natural calculation
        if (finalScores[tea.expectedEffects.dominant] < highestScore) {
            finalScores[tea.expectedEffects.dominant] = highestScore + 0.2;
        }
    }
    
    // Add small boost to supporting expected effect too (new)
    if (tea.expectedEffects?.supporting && finalScores[tea.expectedEffects.supporting]) {
        // Find the second highest score
        const sortedScores = Object.values(finalScores).sort((a, b) => b - a);
        const secondHighestScore = sortedScores.length > 1 ? sortedScores[1] : 0;
        
        // Apply a small boost to ensure it's competitive but not artificially dominant
        if (finalScores[tea.expectedEffects.supporting] < secondHighestScore) {
            finalScores[tea.expectedEffects.supporting] = Math.min(
                finalScores[tea.expectedEffects.dominant] - 0.5, // Keep below dominant
                secondHighestScore + 0.1 // Small boost
            );
        }
    }
    
    // 8. Sort effects by final score
    const sortedEffects = Object.entries(finalScores)
        .map(([id, score]) => {
            // Convert primaryEffects to array if it's not already one
            const primaryEffectsArray = Array.isArray(primaryEffects) ? primaryEffects : 
                (typeof primaryEffects === 'object' ? Object.values(primaryEffects) : []);
                
            const effect = primaryEffectsArray.find(e => e && e.id === id);
            return {
                id,
                name: effect ? effect.name : id.charAt(0).toUpperCase() + id.slice(1),
                description: effect ? effect.description : '',
                level: score
            };
        })
        .sort((a, b) => b.level - a.level);
    
    // 9. Create the final effect structure
    const dominantEffect = sortedEffects[0] || { id: 'balanced', name: 'Balanced', level: 5 };
    const supportingEffects = sortedEffects.slice(1, 3)
        .filter(effect => effect.level >= config.get('supportingEffectThreshold', 3.5));
    const additionalEffects = sortedEffects.slice(3)
        .filter(effect => effect.level >= 4.0);
    
    // 10. Identify significant interactions
    const interactionsIdentified = interactionCalculator.identifySignificantInteractions(finalScores);
    
    // Create the effects result with the added TCM profile
    const effectsResult = {
        inference: teaEffectCalculator.formatInference({
            dominantEffect,
            supportingEffects,
            additionalEffects,
            interactions: interactionsIdentified,
            componentScores: {
                base: baseScores || {},
                processing: processingResult?.data?.processing?.effects || {},
                geography: geographyResult?.data?.effects || {},
                flavors: flavorResult?.data?.flavor?.effects || {},
                compounds: compoundResult?.data?.effects || {}
            },
            buildUpScores: {
                withBaseScores,
                withProcessingScores,
                withGeographyScores, 
                withFlavorScores,
                withCompoundScores,
                finalScores
            },
            baselineEffects: tea.expectedEffects,  // Add expected effects for comparison
            tcmProfile,       // Add TCM profile for reference
            originalExpectedEffects: tea.expectedEffects, // Add original expected effects for comparison
            finalScores
        }),
        data: {
            dominantEffect,
            supportingEffects,
            additionalEffects,
            interactions: interactionsIdentified,
            baselineEffects: tea.expectedEffects,  // Add expected effects for comparison
            tcmProfile,       // Add TCM profile for reference
            buildUpScores: {
                withBaseScores,
                withProcessingScores,
                withGeographyScores,
                withFlavorScores,
                withCompoundScores,
                finalScores
            },
            componentScores: {
                base: baseScores || {},
                processing: processingResult?.data?.processing?.effects || {},
                geography: geographyResult?.data?.effects || {},
                flavors: flavorResult?.data?.flavor?.effects || {},
                compounds: compoundResult?.data?.effects || {}
            }
        }
    };
    
    // Generate the JSON structure
    currentJsonData = {
        tea: {
            name: tea.name || 'Unknown',
            originalName: tea.originalName || '',
            type: tea.type || 'unknown',
            origin: tea.origin || 'Unknown',
            caffeineLevel: tea.caffeineLevel || 0,
            lTheanineLevel: tea.lTheanineLevel || 0,
            flavorProfile: tea.flavorProfile || [],
            processingMethods: tea.processingMethods || []
        },
        composition: compoundResult?.data || {},
        flavor: flavorResult?.data?.flavor || {},
        processing: processingResult?.data?.processing || {},
        geography: geographyResult?.data || {},
        timing: timingResult?.data || {},
        season: seasonResult?.data || {},
        effects: effectsResult?.data || {},
        _sectionRef: {
            composition: 'ltheanine-caffeine',
            flavor: 'flavor',
            processing: 'processing',
            geography: 'geography',
            timing: 'timing',
            season: 'season',
            effects: 'comprehensive'
        }
    };
    
    // Display the JSON with references
    displayJsonWithReferences(currentJsonData);
}

/**
 * Display formatted JSON with clickable references
 * @param {Object} jsonData - The JSON data to display
 */
function displayJsonWithReferences(jsonData) {
    const jsonContentElement = document.querySelector('.json-content');
    if (!jsonContentElement) return;
    
    // Create a formatted JSON string with syntax highlighting and references
    const formattedJson = formatJsonWithReferences(jsonData);
    jsonContentElement.innerHTML = formattedJson;
    
    // Add controls for expanding/collapsing all
    const controlsHtml = `
        <div class="json-expand-controls mb-2">
            <button id="expand-all" class="mr-2">Expand All</button>
            <button id="collapse-all" class="mr-2">Collapse All</button>
            <button id="reset-view">Reset View</button>
        </div>
    `;
    jsonContentElement.insertAdjacentHTML('afterbegin', controlsHtml);
    
    // Add event listeners for expand/collapse all buttons
    document.getElementById('expand-all').addEventListener('click', () => {
        document.querySelectorAll('.json-expandable.collapsed').forEach(el => {
            el.classList.remove('collapsed');
            
            // Update the toggle button
            const toggleBtn = document.querySelector(`.json-toggle[data-target="${el.id}"]`);
            if (toggleBtn) {
                toggleBtn.classList.remove('collapsed');
                toggleBtn.textContent = '▼';
            }
        });
    });
    
    document.getElementById('collapse-all').addEventListener('click', () => {
        document.querySelectorAll('.json-expandable').forEach(el => {
            // Don't collapse the root level
            if (el.id !== 'json-root') {
                el.classList.add('collapsed');
                
                // Update the toggle button
                const toggleBtn = document.querySelector(`.json-toggle[data-target="${el.id}"]`);
                if (toggleBtn) {
                    toggleBtn.classList.add('collapsed');
                    toggleBtn.textContent = '▶';
                }
            }
        });
    });
    
    // Add event listener for reset view (default state with level 0-2 expanded, 3+ collapsed)
    document.getElementById('reset-view').addEventListener('click', () => {
        resetExpandCollapseState();
    });
    
    // Set initial state correctly after DOM is loaded
    setTimeout(() => {
        resetExpandCollapseState();
    }, 100);
}

/**
 * Reset the expand/collapse state to the default view
 * - Level 1 (main sections): expanded
 * - Level 2 (direct children): collapsed
 * - Level 3+ (sub-children): always expanded
 */
function resetExpandCollapseState() {
    // Determine the nesting level of each json-expandable element
    const elements = document.querySelectorAll('.json-expandable');
    
    elements.forEach(el => {
        const path = el.id.replace('json-', '').replace(/-/g, '.').replace(/_/g, '[').replace(/_/g, ']');
        const nestLevel = path === 'root' ? 0 : (path.match(/\./g) || []).length + 1;
        
        // Get the corresponding toggle button
        const toggleBtn = document.querySelector(`.json-toggle[data-target="${el.id}"]`);
        
        if (nestLevel === 2) {
            // Collapse level 2 (direct children)
            el.classList.add('collapsed');
            if (toggleBtn) {
                toggleBtn.classList.add('collapsed');
                toggleBtn.textContent = '▶';
            }
        } else {
            // Expand everything else (root, main sections, and sub-children)
            el.classList.remove('collapsed');
            if (toggleBtn) {
                toggleBtn.classList.remove('collapsed');
                toggleBtn.textContent = '▼';
            }
        }
    });
}

/**
 * Format a JSON object into a HTML string with syntax highlighting and references
 * @param {object} obj - The JSON object to format
 * @param {number} indent - The current indentation level
 * @param {string} path - The current path in the JSON object
 * @param {number} nestLevel - The current nesting level
 * @returns {string} - The formatted HTML string
 */
function formatJsonWithReferences(obj, indent = 0, path = '', nestLevel = 0) {
    let html = '';
    const indentStr = '\t'.repeat(indent);
    const padding = indent * 8;
    
    // Create a unique ID for references
    const pathId = path ? path.replace(/\./g, '-').replace(/\[/g, '_').replace(/\]/g, '_') : 'root';
    
    if (Array.isArray(obj)) {
        // Display an array
        if (obj.length === 0) {
            html += `<span class="json-syntax">[</span><span class="json-syntax">]</span>`;
        } else {
            // Determine if this node should be collapsible
            const isCollapsible = nestLevel <= 2;
            
            // Determine if this node should be collapsed by default
            const isCollapsed = nestLevel === 2;
            
            // Add appropriate classes based on collapsibility and collapse state
            if (isCollapsible) {
                html += `<span class="json-toggle ${isCollapsed ? 'collapsed' : ''}" data-target="json-${pathId}">${isCollapsed ? '▶' : '▼'}</span>`;
            }
            
            html += `<span class="json-syntax">[</span>`;
            
            if (isCollapsible) {
                html += `<div id="json-${pathId}" class="json-expandable ${isCollapsed ? 'collapsed' : ''}">`;
            }
            
            // Process each item in the array
            obj.forEach((item, index) => {
                html += `<div style="padding-left: ${padding + 8}px;">`;
                html += formatJsonWithReferences(item, indent + 1, `${path}[${index}]`, nestLevel + 1);
                if (index < obj.length - 1) {
                    html += '<span class="json-syntax">,</span>';
                }
                html += '</div>';
            });
            
            if (isCollapsible) {
                html += `</div>`;
            }
            
            html += `<div style="padding-left: ${padding}px;"><span class="json-syntax">]</span></div>`;
        }
    } else if (obj !== null && typeof obj === 'object') {
        // Display an object
        const keys = Object.keys(obj);
        if (keys.length === 0) {
            html += `<span class="json-syntax">{</span><span class="json-syntax">}</span>`;
        } else {
            // Determine if this node should be collapsible
            const isCollapsible = nestLevel <= 2;
            
            // Determine if this node should be collapsed by default
            const isCollapsed = nestLevel === 2;
            
            // Add appropriate classes based on collapsibility and collapse state
            if (isCollapsible) {
                html += `<span class="json-toggle ${isCollapsed ? 'collapsed' : ''}" data-target="json-${pathId}">${isCollapsed ? '▶' : '▼'}</span>`;
            }
            
            html += `<span class="json-syntax">{</span>`;
            
            if (isCollapsible) {
                html += `<div id="json-${pathId}" class="json-expandable ${isCollapsed ? 'collapsed' : ''}">`;
            }
            
            // Process each key-value pair in the object
            keys.forEach((key, index) => {
                const value = obj[key];
                const newPath = path ? `${path}.${key}` : key;
                
                // Add reference markers for specific sections
                let sectionRef = null;
                if (key === '_sectionRef') {
                    sectionRef = value;
                } else if (path === '' && typeof value === 'object' && value !== null && key !== 'tea') {
                    sectionRef = value._sectionRef || obj._sectionRef?.[key];
                }
                
                html += `<div style="padding-left: ${padding + 8}px;">`;
                
                // Add anchor icon before the key if this is a main section
                if (sectionRef) {
                    html += `<span class="reference-marker" data-section="${sectionRef}" title="View in analysis">⚓</span> `;
                }
                
                html += `<span class="key">"${key}"</span><span class="json-syntax">: </span>`;
                html += formatJsonWithReferences(value, indent + 1, newPath, nestLevel + 1);
                if (index < keys.length - 1) {
                    html += '<span class="json-syntax">,</span>';
                }
                html += '</div>';
            });
            
            if (isCollapsible) {
                html += `</div>`;
            }
            
            html += `<div style="padding-left: ${padding}px;"><span class="json-syntax">}</span></div>`;
        }
    } else if (typeof obj === 'string') {
        // Display a string
        html += `<span class="string">"${escapeHtml(obj)}"</span>`;
    } else if (typeof obj === 'number') {
        // Display a number
        html += `<span class="number">${obj}</span>`;
    } else if (typeof obj === 'boolean') {
        // Display a boolean
        html += `<span class="boolean">${obj}</span>`;
    } else if (obj === null) {
        // Display null
        html += `<span class="null">null</span>`;
    }
    
    return html;
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export default {
    initializeSidebar,
    generateJsonData,
    displayJsonWithReferences,
};
