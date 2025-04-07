class TestSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // Default state
        this._outputVisible = false;
        this._title = '';
        this._dataFlow = '';
        this._rawOutput = '';
        this._inference = '';
        this._calculator = '';
    }
    
    connectedCallback() {
        this.render();
    }
    
    static get observedAttributes() {
        return ['title', 'data-flow', 'raw-output', 'inference', 'calculator'];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        
        switch (name) {
            case 'title':
                this._title = newValue;
                break;
            case 'data-flow':
                this._dataFlow = newValue;
                break;
            case 'raw-output':
                this._rawOutput = newValue;
                break;
            case 'inference':
                this._inference = newValue;
                break;
            case 'calculator':
                this._calculator = newValue;
                break;
        }
        
        if (this.shadowRoot) {
            this.render();
        }
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    margin-bottom: 2rem;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    background-color: white;
                }
                
                .section-header {
                    padding: 1rem;
                    background-color: #f8f9fa;
                    border-bottom: 1px solid #e0e0e0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .section-title {
                    margin: 0;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #2c3e50;
                }
                
                .section-content {
                    padding: 1.5rem;
                }

                .calculator-info {
                    font-family: 'Courier New', Courier, monospace;
                    color: #666;
                    font-size: 0.9rem;
                    margin-bottom: 1rem;
                    padding: 0.5rem;
                    background-color: #f8f9fa;
                    border-radius: 4px;
                }

                .data-flow {
                    font-family: 'Courier New', Courier, monospace;
                    color: #2c3e50;
                    font-size: 0.9rem;
                    margin-bottom: 1rem;
                    padding: 0.5rem;
                    background-color: #f8f9fa;
                    border-radius: 4px;
                    border-left: 3px solid #3498db;
                }

                .data-flow-title {
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    color: #3498db;
                }
                
                .toggle-output {
                    background-color: #3498db;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 0.5rem 1rem;
                    cursor: pointer;
                    font-size: 0.875rem;
                    transition: background-color 0.2s;
                }
                
                .toggle-output:hover {
                    background-color: #2980b9;
                }
                
                .raw-output {
                    margin-top: 1rem;
                    padding: 1rem;
                    background-color: #f5f5f5;
                    border-radius: 4px;
                    font-family: 'Courier New', Courier, monospace;
                    white-space: pre-wrap;
                    font-size: 0.9rem;
                    overflow-x: auto;
                    display: ${this._outputVisible ? 'block' : 'none'};
                    border-top: 1px solid #e0e0e0;
                }

                .raw-output h1,
                .raw-output h2,
                .raw-output h3 {
                    color: #2c3e50;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                }

                .raw-output p {
                    margin-bottom: 1rem;
                    line-height: 1.5;
                }

                .raw-output ul,
                .raw-output ol {
                    margin-bottom: 1rem;
                    padding-left: 1.5rem;
                }

                .raw-output li {
                    margin-bottom: 0.5rem;
                }
            </style>
            
            <div class="section-header">
                <h3 class="section-title">${this._title}</h3>
                <button class="toggle-output">
                    ${this._outputVisible ? 'Hide Raw Output' : 'Show Raw Output'}
                </button>
            </div>
            
            <div class="section-content">
                <div class="calculator-info">
                    Calculator: ${this._calculator}
                </div>
                ${this._dataFlow ? `
                    <div class="data-flow">
                        <div class="data-flow-title">Data Flow:</div>
                        ${this._dataFlow}
                    </div>
                ` : ''}
            </div>
            
            <div class="raw-output">
                ${this._inference}
                ${this._rawOutput ? `
                    <div class="raw-data">
                        ${this._rawOutput}
                    </div>
                ` : ''}
            </div>
        `;

        // Set up event listeners after rendering
        const toggleButton = this.shadowRoot.querySelector('.toggle-output');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                this._outputVisible = !this._outputVisible;
                this.render(); // Re-render to update the display
            });
        }
    }
    
    // Getter/setter methods for properties
    get title() {
        return this._title;
    }
    
    set title(value) {
        this.setAttribute('title', value);
    }
    
    get dataFlow() {
        return this._dataFlow;
    }
    
    set dataFlow(value) {
        this.setAttribute('data-flow', value);
    }
    
    get rawOutput() {
        return this._rawOutput;
    }
    
    set rawOutput(value) {
        this.setAttribute('raw-output', value);
    }

    get inference() {
        return this._inference;
    }
    
    set inference(value) {
        this.setAttribute('inference', value);
    }

    get calculator() {
        return this._calculator;
    }
    
    set calculator(value) {
        this.setAttribute('calculator', value);
    }
}

// Register the custom element
customElements.define('test-section', TestSection);

export default TestSection; 