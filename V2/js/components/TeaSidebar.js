class TeaSidebar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // Default state
        this._teas = [];
        this._selectedTea = null;
    }
    
    connectedCallback() {
        this.render();
    }
    
    set teas(value) {
        this._teas = Array.isArray(value) ? value : [];
        this.render();
    }
    
    get teas() {
        return this._teas;
    }
    
    get selectedTea() {
        return this._selectedTea;
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    height: 100%;
                    background-color: #f8f9fa;
                    border-right: 1px solid #e0e0e0;
                    box-shadow: 2px 0 5px rgba(0,0,0,0.03);
                    overflow-y: auto;
                }
                
                .sidebar-container {
                    padding: 1.5rem;
                }
                
                .sidebar-title {
                    margin-top: 0;
                    margin-bottom: 1.5rem;
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #2c3e50;
                }
                
                .tea-select {
                    width: 100%;
                    padding: 0.75rem;
                    font-size: 1rem;
                    border: 1px solid #ced4da;
                    border-radius: 4px;
                    margin-bottom: 1.5rem;
                    background-color: white;
                }
                
                .tea-info {
                    background-color: white;
                    border: 1px solid #e0e0e0;
                    border-radius: 6px;
                    padding: 1rem;
                    margin-bottom: 1rem;
                }
                
                .tea-info-title {
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin-top: 0;
                    margin-bottom: 1rem;
                    color: #2c3e50;
                    border-bottom: 1px solid #f0f0f0;
                    padding-bottom: 0.5rem;
                }
                
                .tea-property {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.75rem;
                }
                
                .property-label {
                    font-weight: 500;
                    color: #555;
                }
                
                .property-value {
                    text-align: right;
                    color: #333;
                }
                
                .empty-state {
                    text-align: center;
                    color: #6c757d;
                    padding: 2rem 0;
                }
                
                .ratio-container {
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                }
                
                .ratio-title {
                    font-weight: 500;
                    margin-bottom: 0.5rem;
                    color: #555;
                    font-size: 0.9rem;
                }
                
                .ratio-bars {
                    position: relative;
                    height: 24px;
                    background-color: #f1f3f4;
                    border-radius: 4px;
                    overflow: hidden;
                }
                
                .l-theanine-bar {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 12px;
                    background-color: #27ae60;
                    border-radius: 4px 0 0 0;
                }
                
                .caffeine-bar {
                    position: absolute;
                    top: 12px;
                    left: 0;
                    height: 12px;
                    background-color: #e74c3c;
                    border-radius: 0 0 0 4px;
                }
                
                .flavor-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-top: 1rem;
                }
                
                .flavor-tag {
                    background-color: #f1f3f4;
                    border-radius: 12px;
                    padding: 0.25rem 0.75rem;
                    font-size: 0.8rem;
                    color: #555;
                }
            </style>
            
            <div class="sidebar-container">
                <h2 class="sidebar-title">Tea Selection</h2>
                
                <select class="tea-select">
                    <option value="">Select a tea...</option>
                    ${this._teas.map(tea => `<option value="${tea.name}">${tea.name}</option>`).join('')}
                </select>
                
                ${this._selectedTea ? this.renderTeaInfo() : '<div class="empty-state">Select a tea to view details</div>'}
            </div>
        `;
        
        this.attachEventListeners();
    }
    
    renderTeaInfo() {
        const tea = this._selectedTea;
        if (!tea) return '';
        
        const lTheanineWidth = (tea.lTheanineLevel / 10) * 100;
        const caffeineWidth = (tea.caffeineLevel / 10) * 100;
        
        return `
            <div class="tea-info">
                <h3 class="tea-info-title">${tea.name}</h3>
                
                <div class="tea-property">
                    <span class="property-label">Type:</span>
                    <span class="property-value">${tea.type}</span>
                </div>
                
                <div class="tea-property">
                    <span class="property-label">Origin:</span>
                    <span class="property-value">${tea.origin}</span>
                </div>
                
                <div class="tea-property">
                    <span class="property-label">L-Theanine:</span>
                    <span class="property-value">${tea.lTheanineLevel.toFixed(1)}</span>
                </div>
                
                <div class="tea-property">
                    <span class="property-label">Caffeine:</span>
                    <span class="property-value">${tea.caffeineLevel.toFixed(1)}</span>
                </div>
                
                <div class="tea-property">
                    <span class="property-label">Ratio:</span>
                    <span class="property-value">${(tea.lTheanineLevel/tea.caffeineLevel).toFixed(2)}</span>
                </div>
                
                <div class="ratio-container">
                    <div class="ratio-title">L-Theanine to Caffeine Ratio:</div>
                    <div class="ratio-bars">
                        <div class="l-theanine-bar" style="width: ${lTheanineWidth}%;"></div>
                        <div class="caffeine-bar" style="width: ${caffeineWidth}%;"></div>
                    </div>
                </div>
                
                <div class="flavor-tags">
                    ${tea.flavorProfile.map(flavor => `<span class="flavor-tag">${flavor}</span>`).join('')}
                </div>
            </div>
            
            <div class="tea-info">
                <h3 class="tea-info-title">Expected Effects</h3>
                
                ${tea.expectedEffects ? `
                <div class="tea-property">
                    <span class="property-label">Dominant:</span>
                    <span class="property-value">${this.getDominantEffect(tea.expectedEffects)}</span>
                </div>
                
                <div class="tea-property">
                    <span class="property-label">Supporting:</span>
                    <span class="property-value">${this.getSupportingEffects(tea.expectedEffects)}</span>
                </div>
                ` : '<p>No expected effects data available</p>'}
            </div>
        `;
    }

    getDominantEffect(expectedEffects) {
        if (!expectedEffects) return 'N/A';
        if (expectedEffects.dominant) return expectedEffects.dominant;
        
        // Find the effect with highest value
        const effects = Object.entries(expectedEffects);
        if (effects.length === 0) return 'N/A';
        
        effects.sort((a, b) => b[1] - a[1]);
        return effects[0][0];
    }
    
    getSupportingEffects(expectedEffects) {
        if (!expectedEffects) return 'N/A';
        if (expectedEffects.supporting) return expectedEffects.supporting;
        
        // Find the second and third highest effects
        const effects = Object.entries(expectedEffects);
        if (effects.length <= 1) return 'N/A';
        
        effects.sort((a, b) => b[1] - a[1]);
        const supporting = effects.slice(1, 3).map(e => e[0]).join(', ');
        return supporting || 'N/A';
    }
    
    attachEventListeners() {
        const selectElement = this.shadowRoot.querySelector('.tea-select');
        if (selectElement) {
            selectElement.addEventListener('change', (e) => {
                const selectedTeaName = e.target.value;
                this._selectedTea = this._teas.find(tea => tea.name === selectedTeaName) || null;
                this.render();
                
                // Dispatch custom event when tea is selected
                this.dispatchEvent(new CustomEvent('tea-selected', {
                    detail: { tea: this._selectedTea },
                    bubbles: true,
                    composed: true
                }));
            });
        }
    }
}

// Register the custom element
customElements.define('tea-sidebar', TeaSidebar);

export default TeaSidebar; 