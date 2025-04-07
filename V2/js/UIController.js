// UIController.js
// Handles UI interactions for the Tea Effect Analysis System

export class UIController {
    constructor(teaAnalysisSystem) {
        this.system = teaAnalysisSystem;
        this.initElements();
        this.bindEvents();
        this.loadTeas();
    }
    
    // Initialize DOM elements
    initElements() {
        // Tea selection
        this.teaSelect = document.getElementById('tea-select');
        
        // Tabs
        this.tabButtons = document.querySelectorAll('.tab-button');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // Content containers
        this.teaInfoContainer = document.getElementById('tea-info-content');
        this.effectsContainer = document.getElementById('effects-content');
        this.componentsContainer = document.getElementById('components-content');
        
        // Analysis button
        this.analyzeButton = document.getElementById('analyze-button');
    }
    
    // Bind event listeners
    bindEvents() {
        // Tab switching
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => this.switchTab(button.dataset.tab));
        });
        
        // Tea selection
        if (this.teaSelect) {
            this.teaSelect.addEventListener('change', () => this.onTeaSelected());
        }
        
        // Analyze button
        if (this.analyzeButton) {
            this.analyzeButton.addEventListener('click', () => this.analyzeTea());
        }
    }
    
    // Load available teas
    loadTeas() {
        if (!this.teaSelect) return;
        
        const teas = this.system.getAvailableTeas();
        
        // Clear existing options
        this.teaSelect.innerHTML = '';
        
        // Add placeholder
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = 'Select a tea to analyze...';
        placeholder.disabled = true;
        placeholder.selected = true;
        this.teaSelect.appendChild(placeholder);
        
        // Add tea options
        teas.forEach(tea => {
            const option = document.createElement('option');
            option.value = tea.name;
            option.textContent = tea.name;
            this.teaSelect.appendChild(option);
        });
    }
    
    // Handle tea selection
    onTeaSelected() {
        const selectedTeaName = this.teaSelect.value;
        
        if (!selectedTeaName) return;
        
        // Display basic tea information
        const tea = this.system.findTeaByName(selectedTeaName);
        if (tea) {
            this.displayTeaInfo(tea);
        }
    }
    
    // Analyze the selected tea
    analyzeTea() {
        const selectedTeaName = this.teaSelect.value;
        
        if (!selectedTeaName) {
            this.showMessage('Please select a tea to analyze', 'error');
            return;
        }
        
        const tea = this.system.findTeaByName(selectedTeaName);
        if (!tea) {
            this.showMessage(`Tea "${selectedTeaName}" not found`, 'error');
            return;
        }
        
        // Perform analysis
        try {
            const results = this.system.analyzeTea(tea);
            this.displayResults(results);
            this.showMessage('Analysis complete', 'success');
        } catch (error) {
            console.error('Analysis error:', error);
            this.showMessage(`Analysis error: ${error.message}`, 'error');
        }
    }
    
    // Display tea information
    displayTeaInfo(tea) {
        if (!this.teaInfoContainer) return;
        
        // Create tea info elements
        let html = `
            <div class="tea-info">
                <div class="info-card">
                    <h4>Basic Information</h4>
                    <p><strong>Name:</strong> ${tea.name}</p>
                    <p><strong>Type:</strong> ${tea.type || 'Not specified'}</p>
                    <p><strong>Origin:</strong> ${tea.origin || 'Not specified'}</p>
                    ${tea.subType ? `<p><strong>Sub-Type:</strong> ${tea.subType}</p>` : ''}
                </div>
                
                <div class="info-card">
                    <h4>Composition</h4>
                    <p><strong>Caffeine Level:</strong> ${tea.caffeineLevel || 'Not specified'}</p>
                    <p><strong>L-Theanine Level:</strong> ${tea.lTheanineLevel || 'Not specified'}</p>
                    <p><strong>Catechin Level:</strong> ${tea.catechinLevel || 'Not specified'}</p>
                </div>`;
                
        // Add processing info if available
        if (tea.processing) {
            html += `
                <div class="info-card">
                    <h4>Processing</h4>
                    ${tea.processing.methods ? `<p><strong>Methods:</strong> ${tea.processing.methods.join(', ')}</p>` : ''}
                    ${tea.processing.oxidationLevel ? `<p><strong>Oxidation:</strong> ${tea.processing.oxidationLevel}%</p>` : ''}
                </div>`;
        }
        
        // Add geography info if available
        if (tea.geography) {
            html += `
                <div class="info-card">
                    <h4>Geography</h4>
                    ${tea.geography.altitude ? `<p><strong>Altitude:</strong> ${tea.geography.altitude}m</p>` : ''}
                    ${tea.geography.humidity ? `<p><strong>Humidity:</strong> ${tea.geography.humidity}%</p>` : ''}
                    ${tea.geography.harvestMonth ? `<p><strong>Harvest Month:</strong> ${tea.geography.harvestMonth}</p>` : ''}
                </div>`;
        }
        
        // Add flavor info if available
        if (tea.flavor) {
            html += `
                <div class="info-card">
                    <h4>Flavor Profile</h4>
                    ${tea.flavor.primary ? `<p><strong>Primary:</strong> ${tea.flavor.primary.join(', ')}</p>` : ''}
                    ${tea.flavor.secondary ? `<p><strong>Secondary:</strong> ${tea.flavor.secondary.join(', ')}</p>` : ''}
                    ${tea.flavor.notes ? `<p><strong>Notes:</strong> ${tea.flavor.notes}</p>` : ''}
                </div>`;
        }
        
        html += `</div>`;
        
        // Update container
        this.teaInfoContainer.innerHTML = html;
    }
    
    // Display analysis results
    displayResults(results) {
        if (!results) return;
        
        // Display effects
        this.displayEffects(results);
        
        // Display component scores
        this.displayComponentScores(results);
        
        // Switch to the effects tab
        this.switchTab('effects');
    }
    
    // Display effects chart
    displayEffects(results) {
        if (!this.effectsContainer || !results.enhancedScores) return;
        
        const scores = results.enhancedScores;
        const dominantEffect = results.dominantEffect;
        
        let html = `
            <div class="effect-summary">
                <h3>Tea Effect Analysis</h3>
                ${dominantEffect ? `<p>Dominant Effect: <strong>${this.capitalizeFirstLetter(dominantEffect.effect)}</strong> (${dominantEffect.score.toFixed(1)}/10)</p>` : ''}
            </div>
            
            <div class="effect-chart">`;
        
        // Sort effects by score (descending)
        const sortedEffects = Object.entries(scores)
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
        
        // Generate bars for each effect
        sortedEffects.forEach(([effect, score]) => {
            const percent = Math.min(100, Math.max(0, score * 10));
            const isDominant = dominantEffect && dominantEffect.effect === effect;
            
            html += `
                <div class="effect-bar">
                    <div class="effect-label">${this.capitalizeFirstLetter(effect)}</div>
                    <div class="effect-fill ${isDominant ? 'dominant' : ''} effect-${effect}" style="width: ${percent}%"></div>
                    <div class="effect-value">${score.toFixed(1)}</div>
                </div>`;
        });
        
        html += `</div>`;
        
        // Get formatted output
        const formattedOutput = this.system.generateFormattedOutput();
        
        // Add detailed markdown content
        html += `<div class="markdown-content">`;
        
        Object.values(formattedOutput).forEach(content => {
            html += `<div class="markdown-section">${this.markdownToHtml(content)}</div>`;
        });
        
        html += `</div>`;
        
        // Update container
        this.effectsContainer.innerHTML = html;
    }
    
    // Display component scores
    displayComponentScores(results) {
        if (!this.componentsContainer) return;
        
        let html = `<h3>Component Contributions</h3>`;
        html += `<div class="component-scores">`;
        
        // Get all score objects
        const scoreObjects = Object.entries(results)
            .filter(([key, value]) => key.endsWith('Scores') && key !== 'enhancedScores' && key !== 'normalizedScores' && key !== 'compositeScores')
            .map(([key, value]) => ({
                name: key.replace('Scores', ''),
                scores: value
            }));
        
        // Create a card for each component
        scoreObjects.forEach(component => {
            html += `
                <div class="score-card">
                    <h4>${this.capitalizeFirstLetter(component.name)} Component</h4>
                    <div class="score-list">`;
            
            // Sort effects by score (descending)
            const sortedEffects = Object.entries(component.scores)
                .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
            
            // Add top 5 effects
            sortedEffects.slice(0, 5).forEach(([effect, score]) => {
                const percent = Math.min(100, Math.max(0, score * 10));
                
                html += `
                    <div class="effect-bar small">
                        <div class="effect-label small">${this.capitalizeFirstLetter(effect)}</div>
                        <div class="effect-fill small effect-${effect}" style="width: ${percent}%"></div>
                        <div class="effect-value small">${score.toFixed(1)}</div>
                    </div>`;
            });
            
            html += `
                    </div>
                </div>`;
        });
        
        html += `</div>`;
        
        // Update container
        this.componentsContainer.innerHTML = html;
    }
    
    // Switch between tabs
    switchTab(tabId) {
        // Update active tab button
        this.tabButtons.forEach(button => {
            if (button.dataset.tab === tabId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Update visible tab content
        this.tabContents.forEach(content => {
            if (content.id === `${tabId}-content`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }
    
    // Show a message to the user
    showMessage(message, type = 'info') {
        // Check if message container exists, create if not
        let messageContainer = document.getElementById('message-container');
        
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.id = 'message-container';
            document.body.appendChild(messageContainer);
        }
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        
        // Add to container
        messageContainer.appendChild(messageElement);
        
        // Auto-remove after delay
        setTimeout(() => {
            messageElement.classList.add('fade-out');
            setTimeout(() => {
                if (messageContainer.contains(messageElement)) {
                    messageContainer.removeChild(messageElement);
                }
            }, 500);
        }, 3000);
    }
    
    // Convert markdown to HTML (simple version)
    markdownToHtml(markdown) {
        if (!markdown) return '';
        
        let html = markdown;
        
        // Headers
        html = html.replace(/## (.*?)\n/g, '<h2>$1</h2>');
        html = html.replace(/### (.*?)\n/g, '<h3>$1</h3>');
        html = html.replace(/#### (.*?)\n/g, '<h4>$1</h4>');
        
        // Lists
        html = html.replace(/- (.*?)(\n|$)/g, '<li>$1</li>');
        html = html.replace(/<li>(.*?)<\/li>(\n<li>)/g, '<li>$1</li><li>');
        html = html.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
        
        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Paragraphs
        html = html.replace(/\n\n/g, '</p><p>');
        html = html.replace(/^(.+)(?!\n)/, '<p>$1</p>');
        
        return html;
    }
    
    // Helper function to capitalize first letter
    capitalizeFirstLetter(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

// Initialize the UI controller when document is ready
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        if (window.teaAnalysisSystem) {
            window.uiController = new UIController(window.teaAnalysisSystem);
            console.log('UI Controller initialized');
        } else {
            console.error('Tea Analysis System not initialized');
        }
    });
} 