// Import tea-related data and utilities
import { teaDatabase } from '../data/TeaDatabase.js';
import { createAnalyzer } from '../data/TeaEffectSystem.js';

// Initialize the tea analyzer
const analyzer = createAnalyzer();

// DOM elements
const teaSelect = document.getElementById('tea-select');
const teaInfoContainer = document.getElementById('tea-info');

// Populate tea selector
function populateTeaSelector() {
    teaDatabase.forEach(tea => {
        const option = document.createElement('option');
        option.value = tea.name;
        option.textContent = `${tea.name} (${tea.type})`;
        teaSelect.appendChild(option);
    });
}

// Simple Markdown to HTML converter
function markdownToHtml(markdown) {
    if (!markdown) return '';
    
    return markdown
        // Handle headings
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        // Handle bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Handle italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Handle lists
        .replace(/^- (.*$)/gm, '<li>$1</li>')
        // Wrap lists
        .replace(/<li>.*?<\/li>(\n<li>.*?<\/li>)*/gs, match => `<ul>${match}</ul>`)
        // Handle line breaks
        .replace(/\n/g, '<br>');
}

// Generate HTML for tea analysis
function displayTeaAnalysis(tea, analysis) {
    const { standard, traditional, components } = analysis;
    
    // Get the componentAnalysis data
    const compound = components?.compound || {};
    const flavor = components?.flavor || {};
    const processing = components?.processing || {};
    const geography = components?.geography || {};
    
    // Debug - log to console to help find why supporting effects might not be showing
    console.log('Standard Effects:', standard);
    console.log('Supporting Effects:', standard.supportingEffects);
    
    // Create the HTML structure
    let html = `
        <h2>${tea.name} (${tea.originalName})</h2>
        <p><strong>Type:</strong> ${tea.type} | <strong>Origin:</strong> ${tea.origin}</p>
        
        <div class="analysis-section">
            <h3>Compound Analysis</h3>
            <div class="analysis-grid">
                <div class="analysis-card">
                    <h4>L-Theanine & Caffeine Ratio</h4>
                    <p>${compound.description || 'No compound analysis available.'}</p>
                    <div class="compound-ratio-label">
                        <span>L-Theanine: ${tea.lTheanineLevel}/10</span>
                        <span>Caffeine: ${tea.caffeineLevel}/10</span>
                    </div>
                    <div class="compound-ratio">
                        <div class="l-theanine-bar" style="width: ${(tea.lTheanineLevel / 10) * 100}%"></div>
                        <div class="caffeine-bar" style="width: ${(tea.caffeineLevel / 10) * 100}%"></div>
                    </div>
                    <p><strong>Ratio:</strong> ${(tea.lTheanineLevel / tea.caffeineLevel).toFixed(2)}:1</p>
                    <p><strong>Primary Influence:</strong> ${compound.primaryInfluence || 'Balanced'}</p>
                </div>
                
                <div class="analysis-card">
                    <h4>Flavor Profile</h4>
                    <p>${flavor.description || 'No flavor analysis available.'}</p>
                    <ul>
                        ${tea.flavorProfile.map(flavor => `<li>${flavor}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="analysis-card">
                    <h4>Processing Methods</h4>
                    <p>${processing.description || 'No processing analysis available.'}</p>
                    <ul>
                        ${tea.processingMethods.map(method => `<li>${method}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="analysis-card">
                    <h4>Geographic Influence</h4>
                    <p>${geography.description || 'No geographical analysis available.'}</p>
                    <p><strong>Altitude:</strong> ${tea.geography.altitude}m</p>
                    <p><strong>Humidity:</strong> ${tea.geography.humidity}%</p>
                    <p><strong>Harvest:</strong> ${new Date(2023, tea.geography.harvestMonth - 1).toLocaleString('default', { month: 'long' })}</p>
                </div>
            </div>
        </div>
        
        <div class="analysis-section">
            <h3>Effect Analysis</h3>
            
            <div class="analysis-card">
                <h4>Primary Effects</h4>
                <p><strong>Dominant Effect:</strong> ${standard.dominantEffect?.name || 'Balanced'}</p>
                <div class="effect-bar">
                    <div class="effect-bar-fill" style="width: ${standard.dominantEffect?.level * 10 || 50}%"></div>
                </div>
                
                <p><strong>Supporting Effects:</strong></p>
                ${standard.supportingEffects && standard.supportingEffects.length > 0 
                    ? standard.supportingEffects.map(effect => `
                        <div class="effect-label">
                            <span class="effect-name">${effect.name}</span>
                            <span class="effect-value">${effect.level.toFixed(1)}/10</span>
                        </div>
                        <div class="effect-bar">
                            <div class="effect-bar-fill" style="width: ${effect.level * 10}%"></div>
                        </div>
                    `).join('')
                    : `<p>No significant supporting effects detected above threshold.</p>
                       <p>Secondary effects:</p>
                       ${standard.allEffects && standard.allEffects.length > 1 
                         ? standard.allEffects.slice(1, 3).map(effect => `
                            <div class="effect-label">
                                <span class="effect-name">${effect.name}</span>
                                <span class="effect-value">${effect.level.toFixed(1)}/10</span>
                            </div>
                            <div class="effect-bar">
                                <div class="effect-bar-fill" style="width: ${effect.level * 10}%"></div>
                            </div>
                         `).join('')
                         : '<p>No secondary effects data available.</p>'
                       }
                    `
                }
                
                ${standard.additionalEffects && standard.additionalEffects.length > 0 ? `
                <p><strong>Additional Effects:</strong></p>
                ${standard.additionalEffects.map(effect => `
                    <div class="effect-label">
                        <span class="effect-name">${effect.name}</span>
                        <span class="effect-value">${effect.level.toFixed(1)}/10</span>
                    </div>
                    <div class="effect-bar">
                        <div class="effect-bar-fill" style="width: ${effect.level * 10}%"></div>
                    </div>
                `).join('')}
                ` : ''}
            </div>
            
            ${standard.interactions && standard.interactions.length > 0 ? `
            <div class="analysis-card">
                <h4>Effect Interactions</h4>
                <ul>
                    ${standard.interactions.map(interaction => `
                    <li><strong>${interaction.effects[0]} + ${interaction.effects[1]}:</strong> ${interaction.description}</li>
                    `).join('')}
                </ul>
            </div>
            ` : ''}
        </div>
        
        <div class="analysis-section">
            <h3>Traditional Analysis</h3>
            <div class="analysis-grid">
                <div class="analysis-card">
                    <h4>Energy Profile</h4>
                    <p><strong>Yin/Yang Balance:</strong> ${traditional.yinYangBalance}</p>
                    <p><strong>Primary Element:</strong> ${traditional.primaryElement}</p>
                    <p><strong>Qi Movement:</strong> ${traditional.qiMovement}</p>
                </div>
                
                <div class="analysis-card">
                    <h4>Recommendations</h4>
                    <p><strong>Best Time:</strong> ${traditional.personalizedRecommendations.timeOfDay.bestTimes.join(', ')}</p>
                    <p><strong>Health Benefits:</strong></p>
                    <ul>
                        ${traditional.personalizedRecommendations.healthConsiderations.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                    </ul>
                    <p><strong>Cautions:</strong></p>
                    <ul>
                        ${traditional.personalizedRecommendations.cautions.length ? 
                            traditional.personalizedRecommendations.cautions.map(caution => `<li>${caution}</li>`).join('') : 
                            '<li>None</li>'}
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    return html;
}

// Handle tea selection change
function handleTeaSelection(e) {
    const selectedTeaName = e.target.value;
    
    if (!selectedTeaName) {
        teaInfoContainer.innerHTML = '<p>Select a tea to view detailed information.</p>';
        return;
    }
    
    const selectedTea = teaDatabase.find(tea => tea.name === selectedTeaName);
    
    try {
        // Analyze the tea
        const analysis = analyzer.analyzeTeaComplete(selectedTea);
        
        // Display the analysis in the console for debugging
        console.log('Tea Analysis:', analysis);
        
        // Display the analysis
        teaInfoContainer.innerHTML = displayTeaAnalysis(selectedTea, analysis);
    } catch (error) {
        console.error('Error analyzing tea:', error);
        teaInfoContainer.innerHTML = `<p>Error analyzing tea: ${error.message}</p>`;
    }
}

// Initialize the application
function init() {
    populateTeaSelector();
    teaSelect.addEventListener('change', handleTeaSelection);
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 