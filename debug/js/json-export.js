/**
 * Tea JSON Export Tool Script
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
import { FlavorCalculator } from '../../js/calculators/FlavorCalculator.js';
import { flavorInfluences } from '../../js/props/FlavorInfluences.js';
import { TeaEffectCalculator } from '../../js/calculators/TeaEffectCalculator.js';

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
    toggleButton.addEventListener('click', () => {
        panel.classList.toggle('active');
        toggleButton.textContent = panel.classList.contains('active') 
            ? 'Hide JSON' 
            : 'Show JSON';
    });

    // Copy JSON to clipboard
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

    // Download JSON file
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
            id: 'ltheanine-caffeine',
            title: 'L-Theanine to Caffeine Ratio',
            render: () => renderLTheanineCaffeineRatio(tea),
            output: getLTheanineCaffeineRatioOutput(tea),
            dataFlow: `
                Input: tea.lTheanineLevel, tea.caffeineLevel
                → Calculate ratio (L-Theanine / Caffeine)
                → Generate visual representation
                → Output: Ratio analysis and recommendations
            `
        },
        {
            id: 'interaction',
            title: 'Interaction Calculator Analysis',
            render: () => renderInteractionCalculator(tea, config),
            output: getInteractionCalculatorOutput(tea, config),
            dataFlow: `
                Input: tea.primaryEffects, config.effectInteractions
                → Map effect combinations
                → Calculate interaction scores
                → Generate interaction matrix
                → Output: Effect interaction analysis
            `
        },
        {
            id: 'processing',
            title: 'Processing Calculator Analysis',
            render: () => renderProcessingCalculator(tea, config),
            output: getProcessingCalculatorOutput(tea, config),
            dataFlow: `
                Input: tea.processing, processingInfluences
                → Analyze processing methods
                → Calculate influence scores
                → Map to effect modifications
                → Output: Processing impact analysis
            `
        },
        {
            id: 'geography',
            title: 'Geography Calculator Analysis',
            calculator: 'GeographyCalculator',
            render: (() => {
                let geographyCalculator = null;
                return () => {
                    if (!geographyCalculator) {
                        geographyCalculator = new GeographyCalculator(config);
                    }
                    const inference = geographyCalculator.infer(tea);
                    return geographyCalculator.formatInference(inference);
                };
            })(),
            output: (() => {
                let geographyCalculator = null;
                return () => {
                    if (!geographyCalculator) {
                        geographyCalculator = new GeographyCalculator(config);
                    }
                    const inference = geographyCalculator.infer(tea);
                    const serialized = geographyCalculator.serialize(inference);
                    return JSON.stringify(serialized, null, 2);
                };
            })(),
            dataFlow: `
                Input: tea.origin, tea.elevation, geographyData
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
                Input: tea.primaryEffects, config.timeFactors
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
                Input: tea.primaryEffects, seasonalFactors
                → Calculate seasonal scores
                → Generate season recommendations
                → Map to effect modifications
                → Output: Seasonal impact analysis
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
            id: 'comprehensive',
            title: 'Comprehensive Effect Analysis',
            render: () => renderComprehensiveAnalysis(tea, config),
            output: getComprehensiveAnalysisOutput(tea, config),
            dataFlow: `
                Input: All calculator results
                → Aggregate effect scores
                → Generate comprehensive analysis
                → Create effect profile
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
    const timingCalculator = new TimingCalculator();
    const seasonCalculator = new SeasonCalculator();
    const flavorCalculator = new FlavorCalculator(config, flavorInfluences);
    const geographyCalculator = new GeographyCalculator();
    const teaEffectCalculator = new TeaEffectCalculator();
    
    // Calculate results
    const timingResult = timingCalculator.calculate(tea);
    const seasonResult = seasonCalculator.calculate(tea);
    const flavorResult = flavorCalculator.calculate(tea);
    const geographyResult = geographyCalculator.calculate(tea);
    
    // Load data into TeaEffectCalculator
    teaEffectCalculator.loadData(
        primaryEffects,
        flavorInfluences,
        processingInfluences,
        effectCombinations,
        geographyResult.data // Use the geography data instead of geographicalInfluences
    );
    
    // Calculate effects
    const { inference: effectsInference, data: effectsData } = teaEffectCalculator.calculate(tea);
    
    // Generate the JSON structure
    currentJsonData = {
        name: tea.name,
        type: tea.type,
        description: tea.description,
        caffeineLevel: tea.caffeineLevel,
        lTheanineLevel: tea.lTheanineLevel,
        processing: tea.processing,
        origin: tea.origin,
        elevation: tea.elevation,
        primaryEffects: tea.primaryEffects,
        timing: {
            recommendations: timingResult.data.recommended,
            cautionaryTimes: timingResult.data.notRecommended,
            chartData: timingResult.data.chartData,
            _sectionRef: 'timing'
        },
        geography: {
            longitude: tea.geography?.longitude || null,
            latitude: tea.geography?.latitude || null,
            region: geographyResult.data.region || null,
            elevation: geographyResult.data.elevation?.value || tea.geography?.altitude || null,
            features: geographyResult.data.features || [],
            soilType: geographyResult.data.soilType || null,
            climate: geographyResult.data.climate || null,
            description: geographyResult.data.description || 'No geographic data available',
            _sectionRef: 'geography'
        },
        season: {
            scores: seasonResult.data.scores,
            bestSeasons: seasonResult.data.bestSeasons,
            explanations: seasonResult.data.explanations,
            scientificBasis: seasonResult.data.scientificBasis,
            _sectionRef: 'season'
        },
        flavor: flavorResult.data.flavor,
        effects: effectsData,
        _sectionRef: {
            timing: 'timing',
            season: 'season',
            geography: 'geography',
            flavor: 'flavor',
            effects: 'effects'
        }
    };
    
    // Display the JSON with references
    displayJsonWithReferences(currentJsonData);
}

/**
 * Convert timing results to recommendations format
 * @param {Object} timingResults - Results from timing calculator
 * @returns {Object} Formatted timing recommendations
 */
function getTimingRecommendations(timingResults) {
    const recommendations = [];
    const cautionaryTimes = [];
    
    // Process best times as recommendations
    if (timingResults && timingResults.bestTimes) {
        timingResults.bestTimes.forEach(timeRange => {
            recommendations.push({
                timeOfDay: timeRange.timeRange, // Use timeRange which contains the formatted time range
                score: timeRange.avgScore, // Use avgScore which is the property returned by TimingCalculator
                reason: 'Optimal time based on tea properties'
            });
        });
    }
    
    // Find times with low scores (below threshold) for cautionary times
    if (timingResults && timingResults.timeScores) {
        const threshold = 3.0; // Threshold for cautionary times
        
        // Group consecutive hours below threshold
        let inCautionaryPeriod = false;
        let cautionaryStart = null;
        let cautionaryEnd = null;
        
        for (let hour = 0; hour < 24; hour++) {
            const score = timingResults.timeScores[hour];
            
            if (score < threshold) {
                if (!inCautionaryPeriod) {
                    inCautionaryPeriod = true;
                    cautionaryStart = hour;
                }
                cautionaryEnd = hour;
            } else {
                if (inCautionaryPeriod) {
                    // End of a cautionary period
                    const startFormatted = formatTimeOfDay(cautionaryStart);
                    const endFormatted = formatTimeOfDay(cautionaryEnd + 1); // +1 for inclusive end
                    
                    cautionaryTimes.push({
                        timeCode: `${startFormatted}-${endFormatted}`,
                        reason: hour >= 20 || hour <= 6 ? 
                            'May disrupt sleep patterns' : 
                            'Not optimal for this tea\'s properties'
                    });
                    
                    inCautionaryPeriod = false;
                }
            }
        }
        
        // Check if we ended the day in a cautionary period
        if (inCautionaryPeriod) {
            const startFormatted = formatTimeOfDay(cautionaryStart);
            const endFormatted = formatTimeOfDay(cautionaryEnd + 1);
            
            cautionaryTimes.push({
                timeCode: `${startFormatted}-${endFormatted}`,
                reason: 'May disrupt sleep patterns'
            });
        }
    }
    
    return {
        recommendations,
        cautionaryTimes
    };
}

/**
 * Format hour to time of day (12-hour format)
 * @param {number} hour - Hour in 24-hour format
 * @returns {string} Formatted time
 */
function formatTimeOfDay(hour) {
    const h = hour % 24; // Handle 24 -> 0
    const period = h < 12 ? 'AM' : 'PM';
    const hourFormatted = h % 12 === 0 ? 12 : h % 12;
    return `${hourFormatted}${period}`;
}

/**
 * Get processing effects from processing calculator
 * @param {Object} tea - The tea object
 * @param {ProcessingCalculator} processingCalculator - The processing calculator
 * @returns {Array} Array of processing effects
 */
function getProcessingEffects(tea, processingCalculator) {
    const processingDetails = processingCalculator.getProcessingDetails(tea.processingMethods || [tea.processing]);
    
    return processingDetails.map(detail => ({
        name: detail.method,
        influence: detail.intensity,
        description: detail.description
    }));
}

/**
 * Apply processing effects to effect scores
 * @param {Object} scores - Effect scores
 * @param {Object} processingScores - Processing influence scores
 * @returns {Object} Modified scores
 */
function applyProcessingEffects(scores, processingScores) {
    const modifiedScores = { ...scores };
    
    // Apply processing effects to scores
    Object.entries(processingScores).forEach(([effect, score]) => {
        if (modifiedScores[effect]) {
            modifiedScores[effect] += score;
        } else {
            modifiedScores[effect] = score;
        }
        
        // Cap at 10
        modifiedScores[effect] = Math.min(10, Math.max(0, modifiedScores[effect]));
    });
    
    return modifiedScores;
}

/**
 * Get geography effects from geography calculator
 * @param {Object} tea - The tea object
 * @param {GeographyCalculator} geographyCalculator - The geography calculator
 * @returns {Array} Array of geography effects
 */
function getGeographyEffects(tea, geographyCalculator) {
    // Get the geographic analysis for the origin
    const geoAnalysis = geographyCalculator.getGeographicAnalysis ? 
        geographyCalculator.getGeographicAnalysis(tea.origin || '') : 
        { elevation: null, climate: null, terrain: [], soil: null };
    
    // Create an array of geography effects
    const effects = [];
    
    // Add elevation effect
    if (geoAnalysis.elevation) {
        const elevationValue = geoAnalysis.elevation.value || tea.altitude || 'Unknown';
        const elevationDesc = geoAnalysis.elevation.description || 
            (tea.altitude ? `Tea grown at ${tea.altitude}m elevation` : 'Elevation details not available');
        
        effects.push({
            name: 'Elevation',
            influence: geoAnalysis.elevation.influence || 0,
            description: `Grown at ${elevationValue} meters: ${elevationDesc}`
        });
    } else if (tea.altitude) {
        // Fallback to tea.altitude if elevation data isn't available
        effects.push({
            name: 'Elevation',
            influence: 0,
            description: `Grown at ${tea.altitude} meters elevation`
        });
    }
    
    // Add climate effect
    if (geoAnalysis.climate) {
        effects.push({
            name: 'Climate',
            influence: geoAnalysis.climate.influence || 0,
            description: geoAnalysis.climate.description || 'Climate information not available'
        });
    }
    
    // Add terrain effects
    if (geoAnalysis.terrain && geoAnalysis.terrain.length > 0) {
        geoAnalysis.terrain.forEach(terrain => {
            if (terrain && terrain.name) {
                effects.push({
                    name: terrain.name,
                    influence: terrain.influence || 0,
                    description: terrain.description || `${terrain.name} terrain`
                });
            }
        });
    }
    
    // Add soil effect if available
    if (geoAnalysis.soil && geoAnalysis.soil.description) {
        effects.push({
            name: 'Soil',
            influence: geoAnalysis.soil.influence || 0,
            description: geoAnalysis.soil.description
        });
    }
    
    // If no effects were added (possibly due to missing method), add a default entry
    if (effects.length === 0) {
        effects.push({
            name: 'Origin',
            influence: 0,
            description: tea.origin ? `Tea from ${tea.origin}` : 'Origin information unavailable'
        });
    }
    
    return effects;
}

/**
 * Apply geography effects to effect scores
 * @param {Object} scores - Effect scores
 * @param {Object} geographyScores - Geography influence scores
 * @returns {Object} Modified scores
 */
function applyGeographyEffects(scores, geographyScores) {
    const modifiedScores = { ...scores };
    
    // Apply geography effects to scores
    Object.entries(geographyScores).forEach(([effect, score]) => {
        if (modifiedScores[effect]) {
            modifiedScores[effect] += score;
        } else {
            modifiedScores[effect] = score;
        }
        
        // Cap at 10
        modifiedScores[effect] = Math.min(10, Math.max(0, modifiedScores[effect]));
    });
    
    return modifiedScores;
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
 * Get the corresponding section reference for a JSON path
 * @param {string} path - The path in the JSON
 * @returns {string|null} Section ID or null if no reference
 */
function getSectionReferenceForPath(path) {
    // Map paths to section IDs - only for main categories
    const pathMap = {
        'composition': 'ltheanine-caffeine',
        'effects': 'comprehensive',
        'processing': 'processing',
        'geography': 'geography',
        'timings': 'timing',
        'seasons': 'season'
    };
    
    // Only return references for exact matches (main categories only)
    return pathMap[path] || null;
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
                } else if (value && typeof value === 'object' && value._sectionRef) {
                    sectionRef = value._sectionRef;
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
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Include the necessary rendering functions from debug.js
// [The rest of the file would include the same rendering functions from debug.js]

// For brevity, include essential functions here, but in the real implementation, 
// these would be imported or copied from debug.js

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

// Placeholder functions for other render methods
// In the actual implementation, these would be identical to those in debug.js
function getLTheanineCaffeineRatioOutput(tea) {
    const ratio = tea.lTheanineLevel / tea.caffeineLevel;
    return `## L-Theanine to Caffeine Analysis\n\n* **L-Theanine Level**: ${tea.lTheanineLevel.toFixed(1)}\n* **Caffeine Level**: ${tea.caffeineLevel.toFixed(1)}\n* **Ratio**: ${ratio.toFixed(2)}\n\n### Significance\n${getRatioSignificance(ratio)}`;
}

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

// Placeholder functions that would be implemented fully in the actual file
function renderInteractionCalculator(tea, config) { return '<div>Interaction Calculator placeholder</div>'; }
function getInteractionCalculatorOutput(tea, config) { return '## Interaction Calculator Analysis\n\nPlaceholder'; }
function renderProcessingCalculator(tea, config) { return '<div>Processing Calculator placeholder</div>'; }
function getProcessingCalculatorOutput(tea, config) { return '## Processing Calculator Analysis\n\nPlaceholder'; }
function renderGeographyCalculator(tea, config) { return '<div>Geography Calculator placeholder</div>'; }
function getGeographyCalculatorOutput(tea, config) { return '## Geography Calculator Analysis\n\nPlaceholder'; }
function renderTimingCalculator(tea, config) {
    const timingCalculator = new TimingCalculator(config, primaryEffects);
    const result = timingCalculator.calculate(tea);
    
    return `
        <div class="test-section-content">
            <div class="markdown-content">
                ${result.inference}
            </div>
            <div class="timing-chart">
                <!-- Chart will be rendered here -->
            </div>
        </div>
    `;
}

/**
 * Get the Timing Calculator output in markdown format
 * @param {Object} tea - The tea to analyze
 * @param {Object} config - The effect system configuration
 * @returns {string} - The markdown output
 */
function getTimingCalculatorOutput(tea, config) {
    const timingCalculator = new TimingCalculator(config, primaryEffects);
    const result = timingCalculator.calculate(tea);
    return result.inference;
}

function renderSeasonCalculator(tea, config) { return '<div>Season Calculator placeholder</div>'; }
function getSeasonCalculatorOutput(tea, config) { return '## Season Calculator Analysis\n\nPlaceholder'; }
function renderComprehensiveAnalysis(tea, config) {
    const teaEffectCalculator = new TeaEffectCalculator(config);
    const geographyCalculator = new GeographyCalculator(config);
    
    // Get geography data first
    const geographyResult = geographyCalculator.calculate(tea);
    
    teaEffectCalculator.loadData(
        primaryEffects,
        flavorInfluences,
        processingInfluences,
        effectCombinations,
        geographyResult.data
    );
    
    const result = teaEffectCalculator.calculate(tea);
    
    return `
        <div class="test-section-content">
            <div class="markdown-content">
                ${result.formatted}
            </div>
        </div>
    `;
}

function getComprehensiveAnalysisOutput(tea, config) {
    const teaEffectCalculator = new TeaEffectCalculator(config);
    const geographyCalculator = new GeographyCalculator(config);
    
    // Get geography data first
    const geographyResult = geographyCalculator.calculate(tea);
    
    teaEffectCalculator.loadData(
        primaryEffects,
        flavorInfluences,
        processingInfluences,
        effectCombinations,
        geographyResult.data
    );
    
    const result = teaEffectCalculator.calculate(tea);
    return result.formatted;
}

function generateTeaEffectScores(tea) { return {}; }

/**
 * Convert seasonal suitability results to recommendations format
 * @param {Object} seasonalResults - Results from season calculator
 * @returns {Object} Formatted seasonal recommendations
 */
function getSeasonalRecommendations(seasonalResults) {
    const recommendations = [];
    const cautionarySeasons = [];
    
    // Process best seasons as recommendations
    if (seasonalResults && seasonalResults.bestSeasons) {
        // Convert the top seasons to recommendations
        seasonalResults.bestSeasons.forEach(seasonData => {
            if (seasonData.score >= 5.0) { // Only recommend seasons with decent scores
                recommendations.push({
                    season: seasonData.season,
                    score: seasonData.score,
                    reason: seasonalResults.explanations[seasonData.season] || 
                            `Suitable for ${seasonData.season} based on tea properties`
                });
            } else {
                cautionarySeasons.push({
                    season: seasonData.season,
                    reason: seasonalResults.explanations[seasonData.season] || 
                            `Less ideal for ${seasonData.season}`
                });
            }
        });
    }
    
    return {
        recommendations,
        cautionarySeasons
    };
}

/**
 * Update the JSON preview in the UI
 */
function updateJsonPreview() {
    const jsonPreview = document.getElementById('jsonPreview');
    if (jsonPreview) {
        jsonPreview.textContent = JSON.stringify(currentJsonData, null, 2);
    }
} 