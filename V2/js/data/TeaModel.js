// TeaModel.js
// Defines the data structure for tea information

export class TeaModel {
    constructor(data = {}) {
        // Basic properties
        this.name = data.name || '';
        this.originalName = data.originalName || '';
        this.type = data.type || '';
        this.subType = data.subType || '';
        this.origin = data.origin || '';
        
        // Chemical composition
        this.caffeineLevel = data.caffeineLevel || 0;
        this.lTheanineLevel = data.lTheanineLevel || 0;
        this.catechinLevel = data.catechinLevel || 0;
        this.totalPolyphenols = data.totalPolyphenols || 0;
        this.aminoAcids = data.aminoAcids || 0;
        
        // Processing information
        this.processing = {
            methods: data.processing?.methods || [],
            oxidationLevel: data.processing?.oxidationLevel || 0,
            rollingStyle: data.processing?.rollingStyle || '',
            withering: data.processing?.withering || '',
            firing: data.processing?.firing || ''
        };
        
        // Geographical information
        this.geography = {
            altitude: data.geography?.altitude || 0,
            humidity: data.geography?.humidity || 0,
            latitude: data.geography?.latitude || 0,
            longitude: data.geography?.longitude || 0,
            harvestMonth: data.geography?.harvestMonth || 0
        };
        
        // Flavor profile
        this.flavor = {
            primary: data.flavor?.primary || [],
            secondary: data.flavor?.secondary || [],
            notes: data.flavor?.notes || ''
        };
        
        // Expected effects if known
        this.expectedEffects = data.expectedEffects || {};
    }
    
    // Validate the tea data
    validate() {
        const errors = [];
        
        // Basic validation
        if (!this.name) {
            errors.push('Tea name is required');
        }
        
        if (!this.type) {
            errors.push('Tea type is required');
        } else if (!this.isValidTeaType(this.type)) {
            errors.push(`Invalid tea type: ${this.type}`);
        }
        
        // Validate ranges
        if (this.caffeineLevel < 0 || this.caffeineLevel > 10) {
            errors.push('Caffeine level must be between 0 and 10');
        }
        
        if (this.lTheanineLevel < 0 || this.lTheanineLevel > 10) {
            errors.push('L-Theanine level must be between 0 and 10');
        }
        
        if (this.processing && this.processing.oxidationLevel !== undefined) {
            if (this.processing.oxidationLevel < 0 || this.processing.oxidationLevel > 100) {
                errors.push('Oxidation level must be between 0 and 100');
            }
        }
        
        // Geography validation
        if (this.geography) {
            if (this.geography.harvestMonth && (this.geography.harvestMonth < 1 || this.geography.harvestMonth > 12)) {
                errors.push('Harvest month must be between 1 and 12');
            }
            
            if (this.geography.latitude && (this.geography.latitude < -90 || this.geography.latitude > 90)) {
                errors.push('Latitude must be between -90 and 90');
            }
            
            if (this.geography.longitude && (this.geography.longitude < -180 || this.geography.longitude > 180)) {
                errors.push('Longitude must be between -180 and 180');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    // Check if tea type is valid
    isValidTeaType(type) {
        const validTypes = [
            'green', 'white', 'black', 'oolong', 'puerh', 'yellow',
            'dark', 'herbal', 'tisane', 'sheng puerh', 'shou puerh'
        ];
        
        return validTypes.includes(type.toLowerCase());
    }
    
    // Create a deep copy of the tea model
    clone() {
        return new TeaModel(this.toJSON());
    }
    
    // Convert to plain object
    toJSON() {
        return {
            name: this.name,
            originalName: this.originalName,
            type: this.type,
            subType: this.subType,
            origin: this.origin,
            caffeineLevel: this.caffeineLevel,
            lTheanineLevel: this.lTheanineLevel,
            catechinLevel: this.catechinLevel,
            totalPolyphenols: this.totalPolyphenols,
            aminoAcids: this.aminoAcids,
            processing: { ...this.processing },
            geography: { ...this.geography },
            flavor: {
                primary: [...this.flavor.primary],
                secondary: [...this.flavor.secondary],
                notes: this.flavor.notes
            },
            expectedEffects: { ...this.expectedEffects }
        };
    }
    
    // Create a tea model from raw data
    static fromData(data) {
        return new TeaModel(data);
    }
    
    // Create an empty tea model
    static createEmpty() {
        return new TeaModel();
    }
    
    // Get schema definition (for documentation or validation)
    static getSchema() {
        return {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'The name of the tea' },
                originalName: { type: 'string', description: 'Original name in native language' },
                type: { type: 'string', description: 'Primary tea type (green, black, oolong, etc.)' },
                subType: { type: 'string', description: 'Specific sub-category of tea' },
                origin: { type: 'string', description: 'Country or region of origin' },
                
                caffeineLevel: { type: 'number', description: 'Caffeine level (0-10 scale)' },
                lTheanineLevel: { type: 'number', description: 'L-Theanine level (0-10 scale)' },
                catechinLevel: { type: 'number', description: 'Catechin level (0-10 scale)' },
                totalPolyphenols: { type: 'number', description: 'Total polyphenols (0-10 scale)' },
                aminoAcids: { type: 'number', description: 'Amino acid content (0-10 scale)' },
                
                processing: {
                    type: 'object',
                    properties: {
                        methods: { type: 'array', items: { type: 'string' }, description: 'List of processing methods' },
                        oxidationLevel: { type: 'number', description: 'Oxidation percentage (0-100)' },
                        rollingStyle: { type: 'string', description: 'Style of leaf rolling' },
                        withering: { type: 'string', description: 'Withering process description' },
                        firing: { type: 'string', description: 'Firing process description' }
                    }
                },
                
                geography: {
                    type: 'object',
                    properties: {
                        altitude: { type: 'number', description: 'Growing altitude in meters' },
                        humidity: { type: 'number', description: 'Growing region humidity percentage' },
                        latitude: { type: 'number', description: 'Latitude coordinates' },
                        longitude: { type: 'number', description: 'Longitude coordinates' },
                        harvestMonth: { type: 'number', description: 'Month of harvest (1-12)' }
                    }
                },
                
                flavor: {
                    type: 'object',
                    properties: {
                        primary: { type: 'array', items: { type: 'string' }, description: 'Primary flavor notes' },
                        secondary: { type: 'array', items: { type: 'string' }, description: 'Secondary flavor notes' },
                        notes: { type: 'string', description: 'Additional flavor notes or description' }
                    }
                },
                
                expectedEffects: {
                    type: 'object',
                    additionalProperties: { type: 'number' },
                    description: 'Expected effects with scores (0-10)'
                }
            },
            required: ['name', 'type']
        };
    }
} 