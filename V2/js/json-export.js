/**
 * Tea JSON Export Tool Script
 * Standardized implementation for exporting tea analysis data as JSON
 */

// Import necessary components and utilities
import './components/TestSection.js';
import './components/TeaSidebar.js';
import TeaDatabase from './data/TeaDatabase.js';
import { EffectSystemConfig } from './config/EffectSystemConfig.js';
import { TeaEffectCalculator } from './calculators/TeaEffectCalculator.js';
import { defaultConfig } from './config/defaultConfig.js';
import { effectCombinations } from './props/EffectCombinations.js';
import { primaryEffects } from './props/PrimaryEffects.js';
import { flavorInfluences } from './props/FlavorInfluences.js';
import { processingInfluences } from './props/ProcessingInfluences.js';
import geographicalDescriptors from './props/GeographicalDescriptors.js';
import { objectToMarkdown, createMarkdownTable, formatScoreWithBar, createExpandableSection } from './utils/markdownUtils.js';

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
        sidebar.teas = TeaDatabase.getAllTeas();
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
    let success = false;
    
    try {
        textarea.select();
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
    const config = new EffectSystemConfig(defaultConfig);
    
    // Initialize calculator with all data
    const calculator = new TeaEffectCalculator(config);
    calculator.loadData(
        primaryEffects,
        flavorInfluences,
        processingInfluences,
        effectCombinations,
        geographicalDescriptors.geographicFeatureToEffectMapping
    );
    
    // Explicitly set the flavor influences on the flavor calculator
    calculator.flavorCalculator.flavorInfluences = flavorInfluences;
    
    // Also load interaction data separately
    calculator.interactionCalculator.setEffectCombinations(effectCombinations);
    
    // Calculate full tea analysis
    const result = calculator.calculate(tea);
    
    // Define test sections
    const testSectionDefinitions = [
        {
            id: 'tea-info',
            title: 'Tea Information',
            calculator: 'TeaDatabase',
            inference: createTeaInfoMarkdown(tea),
            rawOutput: JSON.stringify(tea, null, 2),
            dataFlow: `TeaDatabase → ${tea.name} → Basic Information`
        },
        {
            id: 'effect-analysis',
            title: 'Tea Effect Analysis',
            calculator: 'TeaEffectCalculator',
            inference: createEffectAnalysisMarkdown(tea, result),
            rawOutput: JSON.stringify(result.data, null, 2),
            dataFlow: `TeaEffectCalculator → ${tea.name} → Effect Analysis`
        },
        {
            id: 'component-analysis',
            title: 'Component Analysis',
            calculator: 'ComponentAnalyzer',
            inference: createComponentAnalysisMarkdown(result),
            rawOutput: JSON.stringify(result.data.componentScores || {}, null, 2),
            dataFlow: `All Calculators → ${tea.name} → Component Breakdown`
        }
    ];
    
    // Create and append test sections
    testSectionDefinitions.forEach(sectionDef => {
        const testSection = document.createElement('test-section');
        testSection.title = sectionDef.title;
        testSection.dataFlow = sectionDef.dataFlow;
        testSection.inference = sectionDef.inference;
        testSection.calculator = sectionDef.calculator;
        testSection.rawOutput = sectionDef.rawOutput;
        testSection.id = `section-${sectionDef.id}`;
        testSectionsContainer.appendChild(testSection);
        
        // Store reference to the section element
        sectionRefs[sectionDef.id] = testSection;
    });
}

/**
 * Create markdown for tea information section
 * @param {Object} tea - The tea object
 * @returns {string} Markdown text
 */
function createTeaInfoMarkdown(tea) {
    let markdown = `# ${tea.name}\n`;
    
    if (tea.originalName) {
        markdown += `*${tea.originalName}*\n\n`;
    }
    
    markdown += `**Type:** ${tea.type}\n`;
    markdown += `**Origin:** ${tea.origin}\n\n`;
    
    // Chemical composition
    markdown += `## Chemical Composition\n`;
    markdown += `**L-Theanine Level:** ${tea.lTheanineLevel}/10\n`;
    markdown += `**Caffeine Level:** ${tea.caffeineLevel}/10\n`;
    
    const ratio = tea.lTheanineLevel / tea.caffeineLevel;
    markdown += `**Ratio:** ${ratio.toFixed(2)}\n\n`;
    
    // Flavor profile
    markdown += `## Flavor Profile\n`;
    if (tea.flavorProfile && tea.flavorProfile.length > 0) {
        tea.flavorProfile.forEach(flavor => {
            markdown += `- ${flavor}\n`;
        });
    } else {
        markdown += '*No flavor profile available*\n';
    }
    markdown += '\n';
    
    // Processing methods
    markdown += `## Processing Methods\n`;
    if (tea.processingMethods && tea.processingMethods.length > 0) {
        tea.processingMethods.forEach(method => {
            markdown += `- ${formatString(method)}\n`;
        });
    } else {
        markdown += '*No processing methods available*\n';
    }
    markdown += '\n';
    
    // Geography information
    if (tea.geography) {
        markdown += `## Geography\n`;
        markdown += `**Altitude:** ${tea.geography.altitude}m\n`;
        markdown += `**Humidity:** ${tea.geography.humidity}%\n`;
        markdown += `**Harvest Month:** ${getMonthName(tea.geography.harvestMonth)}\n\n`;
    }
    
    return markdown;
}

/**
 * Create markdown for effect analysis section
 * @param {Object} tea - The tea object
 * @param {Object} result - The calculation result
 * @returns {string} Markdown text
 */
function createEffectAnalysisMarkdown(tea, result) {
    const { dominantEffect, supportingEffects, allScores } = result.data;
    
    let markdown = `# Effect Analysis Results\n\n`;
    
    // Dominant effect
    markdown += `## Dominant Effect: ${dominantEffect.name}\n`;
    markdown += `${dominantEffect.description}\n\n`;
    markdown += `**Level:** ${formatScoreWithBar(dominantEffect.level)}\n\n`;
    
    // Expected effects
    const expectedDominant = getExpectedDominant(tea);
    if (expectedDominant !== 'N/A') {
        const dominantMatch = expectedDominant.toLowerCase() === dominantEffect.name.toLowerCase();
        markdown += `**Expected:** ${expectedDominant}\n`;
        markdown += `**Match:** ${dominantMatch ? '✓' : '✗'}\n\n`;
    }
    
    // Supporting effects
    markdown += `## Supporting Effects\n\n`;
    if (supportingEffects && supportingEffects.length > 0) {
        supportingEffects.forEach(effect => {
            markdown += `### ${effect.name}\n`;
            markdown += `${effect.description}\n\n`;
            markdown += `**Level:** ${formatScoreWithBar(effect.level)}\n\n`;
        });
    } else {
        markdown += '*No supporting effects*\n\n';
    }
    
    // Expected supporting
    const expectedSupporting = getExpectedSupporting(tea);
    if (expectedSupporting !== 'N/A') {
        markdown += `**Expected Supporting:** ${expectedSupporting}\n\n`;
    }
    
    // All effects
    markdown += `## All Effects\n\n`;
    if (allScores) {
        const sortedEffects = Object.entries(allScores)
            .sort((a, b) => b[1] - a[1]);
            
        sortedEffects.forEach(([effect, score]) => {
            markdown += `**${effect}:** ${formatScoreWithBar(score)}\n`;
        });
    } else {
        markdown += '*No effect scores available*\n';
    }
    
    return markdown;
}

/**
 * Create markdown for component analysis section
 * @param {Object} result - The calculation result
 * @returns {string} Markdown text
 */
function createComponentAnalysisMarkdown(result) {
    const { componentScores, dominantEffect, supportingEffects, finalScores, scoreProgression } = result.data;
    
    let markdown = `# Component Contribution Analysis\n\n`;
    
    // Add dominant and supporting effects summary
    if (dominantEffect) {
        markdown += `## Effect Summary\n\n`;
        markdown += `**Dominant Effect:** ${dominantEffect.name} (${dominantEffect.level.toFixed(1)}/10)\n\n`;
        
        if (supportingEffects && supportingEffects.length > 0) {
            markdown += `**Supporting Effects:** `;
            markdown += supportingEffects.map(effect => `${effect.name} (${effect.level.toFixed(1)}/10)`).join(', ');
            markdown += `\n\n`;
        }
    }
    
    // Base scores
    markdown += `## Base Scores\n\n`;
    markdown += formatComponentScoresMarkdown(componentScores.base);
    
    // Flavor influences
    markdown += `\n## Flavor Influences\n\n`;
    markdown += formatComponentScoresMarkdown(componentScores.flavors);
    
    // Processing influences
    markdown += `\n## Processing Influences\n\n`;
    if (!componentScores.processing || Object.keys(componentScores.processing).length === 0) {
        markdown += '*No processing scores available. Processing methods might not be recognized or defined for this tea.*\n';
    } else {
        markdown += formatComponentScoresMarkdown(componentScores.processing);
    }
    
    // Geography influences
    markdown += `\n## Geography Influences\n\n`;
    markdown += formatComponentScoresMarkdown(componentScores.geography);
    
    // Compound influences
    markdown += `\n## Compound Influences\n\n`;
    markdown += formatComponentScoresMarkdown(componentScores.compounds);
    
    // Add comprehensive contribution breakdown table for top effects
    if (scoreProgression && finalScores) {
        const topEffectIDs = Object.entries(finalScores)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([id]) => id);
            
        if (topEffectIDs.length > 0) {
            markdown += `\n## Component Contribution Breakdown\n\n`;
            markdown += `| Effect | Base | +Processing | +Geography | +Flavor | +Compounds | Final |\n`;
            markdown += `|--------|------|------------|------------|---------|------------|-------|\n`;
            
            topEffectIDs.forEach(effectId => {
                // Get the effect name
                let effectName = effectId;
                if (dominantEffect && dominantEffect.id === effectId) {
                    effectName = `${dominantEffect.name} ★`;
                } else if (supportingEffects) {
                    const supportingEffect = supportingEffects.find(e => e.id === effectId);
                    if (supportingEffect) {
                        effectName = `${supportingEffect.name} ☆`;
                    }
                }
                
                const baseScore = (scoreProgression.withBaseScores || {})[effectId]?.toFixed(1) || "0.0";
                const withProcessing = (scoreProgression.withProcessingScores || {})[effectId]?.toFixed(1) || "0.0";
                const withGeo = (scoreProgression.withGeographyScores || {})[effectId]?.toFixed(1) || "0.0";
                const withFlavor = (scoreProgression.withFlavorScores || {})[effectId]?.toFixed(1) || "0.0";
                const withCompound = (scoreProgression.withCompoundScores || {})[effectId]?.toFixed(1) || "0.0";
                const final = finalScores[effectId]?.toFixed(1) || "0.0";
                
                markdown += `| **${effectName}** | ${baseScore} | ${withProcessing} | ${withGeo} | ${withFlavor} | ${withCompound} | ${final} |\n`;
            });
            
            markdown += `\n**Legend:**\n`;
            markdown += `- ★ Dominant Effect\n`;
            markdown += `- ☆ Supporting Effect\n`;
        }
    }
    
    return markdown;
}

/**
 * Format component scores as markdown
 * @param {Object} scores - Component scores object
 * @returns {string} Markdown text
 */
function formatComponentScoresMarkdown(scores) {
    if (!scores || Object.keys(scores).length === 0) {
        return '*No scores available*\n';
    }
    
    let markdown = '';
    const sortedScores = Object.entries(scores)
        .sort((a, b) => b[1] - a[1]);
        
    sortedScores.forEach(([effect, score]) => {
        markdown += `**${formatString(effect)}:** ${formatScoreWithBar(score)}\n`;
    });
    
    return markdown;
}

/**
 * Generate JSON data for a given tea
 * @param {Object} tea - The tea to analyze
 */
function generateJsonData(tea) {
    // Create calculator
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
    
    // Calculate effects
    const result = calculator.calculate(tea);
    
    // Generate the JSON structure
    currentJsonData = {
        tea: {
            name: tea.name || 'Unknown',
            originalName: tea.originalName || '',
            type: tea.type || 'unknown',
            origin: tea.origin || 'Unknown',
            compounds: {
                lTheanine: tea.lTheanineLevel || 0,
                caffeine: tea.caffeineLevel || 0,
                ratio: tea.lTheanineLevel / tea.caffeineLevel
            },
            flavorProfile: tea.flavorProfile || [],
            processingMethods: tea.processingMethods || [],
            geography: tea.geography || {}
        },
        analysis: result.data,
        calculatedAt: new Date().toISOString(),
        _sectionRef: {
            tea: 'tea-info',
            analysis: 'effect-analysis',
            components: 'component-analysis'
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
 * Helper: Format string (capitalize and replace hyphens)
 */
function formatString(str) {
    if (!str) return '';
    return str.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Helper: Get month name from month number
 */
function getMonthName(monthNumber) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1] || 'Unknown';
}

/**
 * Helper: Get expected dominant effect
 */
function getExpectedDominant(tea) {
    if (!tea.expectedEffects) return 'N/A';
    
    if (tea.expectedEffects.dominant) {
        return tea.expectedEffects.dominant;
    }
    
    const effects = Object.entries(tea.expectedEffects);
    if (effects.length === 0) return 'N/A';
    
    effects.sort((a, b) => b[1] - a[1]);
    return effects[0][0];
}

/**
 * Helper: Get expected supporting effects
 */
function getExpectedSupporting(tea) {
    if (!tea.expectedEffects) return 'N/A';
    
    if (tea.expectedEffects.supporting) {
        return tea.expectedEffects.supporting;
    }
    
    const effects = Object.entries(tea.expectedEffects);
    if (effects.length <= 1) return 'N/A';
    
    effects.sort((a, b) => b[1] - a[1]);
    return effects.slice(1, 3).map(e => e[0]).join(', ');
}

/**
 * Helper: Normalize string for filenames
 */
function normalizeString(str) {
    if (!str) return 'unknown';
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
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