// app.js - Main application for the Tea Effect Analysis System

import { TeaEffectCalculator } from './calculators/TeaEffectCalculator.js';
import { EffectSystemConfig } from './config/EffectSystemConfig.js';
import { defaultConfig } from './config/defaultConfig.js';
import { primaryEffects } from './props/PrimaryEffects.js';
import TeaDatabase from './data/TeaDatabase.js';
import { flavorInfluences } from './props/FlavorInfluences.js';
import { processingInfluences } from './props/ProcessingInfluences.js';
import { effectCombinations } from './props/EffectCombinations.js';
import geographicalDescriptors from './props/GeographicalDescriptors.js';

// Create instance of calculator with default config
const config = new EffectSystemConfig(defaultConfig);
const teaEffectCalculator = new TeaEffectCalculator(config);

// Initialize the application
function initializeApp() {
    // Load all reference data
    teaEffectCalculator.loadData(
        primaryEffects, 
        flavorInfluences, 
        processingInfluences,
        effectCombinations,
        geographicalDescriptors.geographicFeatureToEffectMapping
    );
    
    // Also load interaction data separately
    teaEffectCalculator.interactionCalculator.setEffectCombinations(effectCombinations);

    // Populate the tea select dropdown
    populateTeaSelect();
    
    // Add event listeners
    document.getElementById('analyze-tea').addEventListener('click', analyzeTea);
    
    // Tab handling
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding content
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

// Function to populate the tea select dropdown
function populateTeaSelect() {
    const teaSelect = document.getElementById('tea-select');
    
    // Clear existing options
    teaSelect.innerHTML = '';
    
    // Add empty option
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = '-- Select a tea --';
    teaSelect.appendChild(emptyOption);
    
    // Get teas from database and add as options
    const teas = TeaDatabase.getAllTeas();
    teas.forEach(tea => {
        const option = document.createElement('option');
        option.value = tea.name;
        option.textContent = tea.name;
        teaSelect.appendChild(option);
    });
}

// Function to analyze a selected tea
function analyzeTea() {
    const teaName = document.getElementById('tea-select').value;
    
    if (!teaName) {
        showMessage('Please select a tea to analyze.');
        return;
    }
    
    // Find the tea data
    const tea = TeaDatabase.findByName(teaName);
    
    if (!tea) {
        showMessage(`Tea "${teaName}" not found in database.`);
        return;
    }
    
    // Analyze the tea
    const result = teaEffectCalculator.calculate(tea);
    
    // Display the results
    displayResults(result, tea);
}

// Function to display tea analysis results
function displayResults(result, tea) {
    const teaInfoDiv = document.getElementById('tea-info');
    const effectAnalysisDiv = document.getElementById('tea-analysis');
    const componentScoresDiv = document.getElementById('component-scores');
    
    // Display tea information
    teaInfoDiv.innerHTML = `
        <h2>${tea.name}</h2>
        ${tea.originalName ? `<p><em>${tea.originalName}</em></p>` : ''}
        <p><strong>Type:</strong> ${tea.type}</p>
        <p><strong>Origin:</strong> ${tea.origin}</p>
        <p><strong>Caffeine Level:</strong> ${tea.caffeineLevel || 'N/A'}/10</p>
        <p><strong>L-Theanine Level:</strong> ${tea.lTheanineLevel || 'N/A'}/10</p>
        
        <h3>Flavor Profile</h3>
        <ul>
            ${Array.isArray(tea.flavorProfile) 
              ? tea.flavorProfile.map(flavor => `<li>${capitalizeFirstLetter(flavor)}</li>`).join('') 
              : '<li>No flavor data available</li>'}
        </ul>
        
        <h3>Processing Methods</h3>
        <ul>
            ${Array.isArray(tea.processingMethods) 
              ? tea.processingMethods.map(method => `<li>${formatProcessingMethod(method)}</li>`).join('')
              : '<li>No processing data available</li>'}
        </ul>
        
        ${tea.geography ? `
        <h3>Geography</h3>
        <p><strong>Altitude:</strong> ${tea.geography.altitude || 'N/A'}m</p>
        <p><strong>Humidity:</strong> ${tea.geography.humidity || 'N/A'}%</p>
        <p><strong>Harvest Month:</strong> ${tea.geography.harvestMonth ? getMonthName(tea.geography.harvestMonth) : 'N/A'}</p>
        ` : ''}
    `;
    
    // Display effect analysis
    const { dominantEffect, supportingEffects } = result.data;
    
    effectAnalysisDiv.innerHTML = `
        <h2>Effect Analysis Results</h2>
        
        <h3>Dominant Effect: ${dominantEffect.name}</h3>
        <div class="effect-label">
            <span>${dominantEffect.name}</span>
            <span>${dominantEffect.level.toFixed(1)}/10</span>
        </div>
        <div class="effect-bar">
            <div class="effect-fill" style="width: ${dominantEffect.level * 10}%"></div>
        </div>
        <p>${dominantEffect.description || 'No description available'}</p>
        
        ${supportingEffects.length > 0 ? '<h3>Supporting Effects</h3>' : ''}
        ${supportingEffects.map(effect => `
            <div class="effect-label">
                <span>${effect.name}</span>
                <span>${effect.level.toFixed(1)}/10</span>
            </div>
            <div class="effect-bar">
                <div class="effect-fill" style="width: ${effect.level * 10}%"></div>
            </div>
            <p>${effect.description || 'No description available'}</p>
        `).join('')}
    `;
    
    // Display component scores
    const { componentScores } = result.data;
    
    // Update each component section
    displayScoreComponents(componentScores);
    
    // Activate the analysis tab
    document.querySelector('[data-tab="analysis"]').click();
}

// Function to display component scores
function displayScoreComponents(componentScores) {
    const baseScoresDiv = document.getElementById('base-scores');
    const flavorScoresDiv = document.getElementById('flavor-scores');
    const processingScoresDiv = document.getElementById('processing-scores');
    const geographyScoresDiv = document.getElementById('geography-scores');
    
    // Display base scores
    displayScoreComponent(baseScoresDiv, componentScores.base);
    
    // Display flavor scores
    displayScoreComponent(flavorScoresDiv, componentScores.flavors);
    
    // Display processing scores
    displayScoreComponent(processingScoresDiv, componentScores.processing);
    
    // Display geography scores
    displayScoreComponent(geographyScoresDiv, componentScores.geography);
}

// Function to display a single component's scores
function displayScoreComponent(element, scores) {
    if (!scores || Object.keys(scores).length === 0) {
        element.innerHTML = '<p>No scores available</p>';
        return;
    }
    
    let html = '';
    
    // Sort scores in descending order
    const sortedScores = Object.entries(scores)
        .sort(([, a], [, b]) => b - a);
        
    sortedScores.forEach(([effect, score]) => {
        html += `
            <div class="effect-label">
                <span>${capitalizeFirstLetter(effect)}</span>
                <span>${score.toFixed(1)}</span>
            </div>
            <div class="effect-bar">
                <div class="effect-fill" style="width: ${(score / 10) * 100}%"></div>
            </div>
        `;
    });
    
    element.innerHTML = html;
}

// Function to show a message
function showMessage(message) {
    // Check if message div exists, if not create it
    let messageDiv = document.getElementById('message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'message';
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '20px';
        messageDiv.style.left = '50%';
        messageDiv.style.transform = 'translateX(-50%)';
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.padding = '10px 20px';
        messageDiv.style.borderRadius = '5px';
        messageDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        messageDiv.style.zIndex = '1000';
        messageDiv.style.display = 'none';
        document.body.appendChild(messageDiv);
    }
    
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Helper functions
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatProcessingMethod(method) {
    if (!method) return '';
    return method.split('-').map(capitalizeFirstLetter).join(' ');
}

function getMonthName(monthNumber) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1] || 'Unknown';
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Export for external access
export {
    teaEffectCalculator,
    analyzeTea
}; 