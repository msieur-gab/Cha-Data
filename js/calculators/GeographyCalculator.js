// GeographyCalculator.js
// Provides calculations for how geographical factors influence tea effects

import {
    elevationLevels,
    latitudeZones,
    geographicFeatureDescriptions,
    soilTypeDescriptions,
    climateDescriptions,
    regionCharacteristics,
    regionalSeasonality
} from '../props/GeographicalDescriptors.js';

import { validateObject, normalizeString, getTopItems, sortByProperty, categorizeByKeywords } from '../utils/helpers.js';
// Add TCM mapping imports
import * as TeaGlobalMapping from '../props/TeaGlobalMapping.js';
import { effectMapping } from '../props/EffectMapping.js';

export class GeographyCalculator {
    constructor(config) {
        this.config = config;
        
        // Reference the imported descriptors
        this.elevationLevels = elevationLevels;
        this.latitudeZones = latitudeZones;
        
        // Regional characteristics database
        this.regionData = {
            // China regions
            'yunnan': { 
                avgElevation: 1800, 
                latitude: 25, 
                geographicFeatures: ['mountain', 'forest'],
                soilType: 'mineral-rich',
                climate: 'subtropical-highland'
            },
            'fujian': { 
                avgElevation: 800, 
                latitude: 26, 
                geographicFeatures: ['coastal', 'mountain'],
                soilType: 'rocky',
                climate: 'subtropical' 
            },
            'anhui': { 
                avgElevation: 500, 
                latitude: 31, 
                geographicFeatures: ['mountain', 'forest'],
                soilType: 'loamy',
                climate: 'humid-subtropical' 
            },
            'zhejiang': { 
                avgElevation: 700, 
                latitude: 29, 
                geographicFeatures: ['mountain', 'valley'],
                soilType: 'sandy-loam',
                climate: 'subtropical' 
            },
            'guangdong': { 
                avgElevation: 300, 
                latitude: 23, 
                geographicFeatures: ['coastal', 'river-delta'],
                soilType: 'alluvial',
                climate: 'tropical' 
            },
            
            // Japan regions
            'kyoto': { 
                avgElevation: 200, 
                latitude: 35, 
                geographicFeatures: ['valley', 'forest'],
                soilType: 'volcanic',
                climate: 'temperate' 
            },
            'uji': { 
                avgElevation: 100, 
                latitude: 34.9, 
                geographicFeatures: ['valley', 'river'],
                soilType: 'volcanic-alluvial',
                climate: 'temperate' 
            },
            'kagoshima': { 
                avgElevation: 200, 
                latitude: 31.6, 
                geographicFeatures: ['coastal', 'volcanic'],
                soilType: 'volcanic',
                climate: 'subtropical' 
            },
            'shizuoka': { 
                avgElevation: 300, 
                latitude: 34.9, 
                geographicFeatures: ['coastal', 'mountain'],
                soilType: 'volcanic',
                climate: 'temperate' 
            },
            
            // India regions
            'darjeeling': { 
                avgElevation: 2000, 
                latitude: 27, 
                geographicFeatures: ['high-mountain', 'forest'],
                soilType: 'loamy',
                climate: 'subtropical-highland' 
            },
            'assam': { 
                avgElevation: 100, 
                latitude: 26, 
                geographicFeatures: ['river-delta', 'lowland'],
                soilType: 'alluvial',
                climate: 'subtropical' 
            },
            'nilgiri': { 
                avgElevation: 1800, 
                latitude: 11, 
                geographicFeatures: ['mountain', 'plateau'],
                soilType: 'laterite',
                climate: 'tropical-highland' 
            },
            
            // Taiwan
            'taiwan': { 
                avgElevation: 1500, 
                latitude: 23.7, 
                geographicFeatures: ['high-mountain', 'forest'],
                soilType: 'volcanic-loam',
                climate: 'subtropical' 
            },
            'alishan': { 
                avgElevation: 2200, 
                latitude: 23.5, 
                geographicFeatures: ['high-mountain', 'forest'],
                soilType: 'volcanic-loam',
                climate: 'subtropical-highland' 
            },
            
            // Sri Lanka
            'ceylon': { 
                avgElevation: 1200, 
                latitude: 7, 
                geographicFeatures: ['mountain', 'tropical'],
                soilType: 'laterite',
                climate: 'tropical' 
            },
            'nuwara eliya': { 
                avgElevation: 1800, 
                latitude: 6.9, 
                geographicFeatures: ['high-mountain', 'plateau'],
                soilType: 'laterite',
                climate: 'tropical-highland' 
            }
        };

        // Define elevation impact scaling
        this.elevationImpactScaling = {
            'high-mountain': { // > 1800m
                'focusing': 1.5,
                'elevating': 1.3,
                'calming': 1.2,
                'harmonizing': 1.1
            },
            'mountain': { // 1000-1800m
                'energizing': 1.2,
                'harmonizing': 1.1,
                'focusing': 1.1,
                'elevating': 1.1
            },
            'mid-altitude': { // 500-1000m
                'harmonizing': 1.2,
                'comforting': 1.1,
                'energizing': 1.0
            },
            'lowland': { // < 500m
                'grounding': 1.3,
                'comforting': 1.2,
                'restorative': 1.1
            }
        };
        
        // Define climate impact scaling
        this.climateImpactScaling = {
            'tropical': {
                'energizing': 1.3,
                'elevating': 1.2,
                'comforting': 1.1
            },
            'subtropical': {
                'elevating': 1.2,
                'comforting': 1.1,
                'energizing': 1.1
            },
            'temperate': {
                'harmonizing': 1.2,
                'restorative': 1.1,
                'calming': 1.0
            },
            'highland': {
                'focusing': 1.3,
                'calming': 1.2,
                'harmonizing': 1.1
            },
            'humid': {
                'comforting': 1.2,
                'grounding': 1.1,
                'restorative': 1.0
            },
            'dry': {
                'focusing': 1.2,
                'grounding': 1.1,
                'harmonizing': 1.0
            }
        };
        
        // Define geographic features impact
        this.featureImpactScaling = {
            'mountain': {
                'elevating': 1.2,
                'calming': 1.1,
                'focusing': 1.1
            },
            'valley': {
                'comforting': 1.2,
                'grounding': 1.1,
                'harmonizing': 1.0
            },
            'forest': {
                'calming': 1.3,
                'restorative': 1.2,
                'grounding': 1.1
            },
            'river': {
                'harmonizing': 1.2,
                'restorative': 1.1,
                'calming': 1.0
            },
            'coastal': {
                'energizing': 1.3,
                'elevating': 1.1,
                'focusing': 1.0
            },
            'island': {
                'calming': 1.2,
                'harmonizing': 1.1,
                'energizing': 1.0
            }
        };

        this.effectMapping = effectMapping;
    }
    
    // Main API method following standardized calculator pattern
    calculate(tea) {
        const inference = this.infer(tea);
        return {
            inference: this.formatInference(inference),
            data: this.serialize(inference)
        };
    }
    
    // Core inferencer - processes geographic data and produces insights
    infer(tea) {
        if (!tea) {
            return {
                geographicData: null,
                effects: {},
                region: null,
                elevation: null,
                latitude: null,
                features: [],
                soilType: null, 
                climate: null
            };
        }
        
        // Extract origin from tea object
        const origin = tea.origin || (tea.geography && tea.geography.origin) || '';
        
        // Get base analysis from origin
        const analysis = this.getGeographicAnalysis(origin);
        
        // Enhance with tea.geography data if available
        if (tea.geography) {
            analysis.elevation = tea.geography.altitude || analysis.elevation;
            analysis.latitude = tea.geography.latitude || analysis.latitude;
            
            // Update elevation category based on actual altitude
            if (tea.geography.altitude) {
                if (tea.geography.altitude >= this.elevationLevels.veryHigh.min) {
                    analysis.elevationCategory = 'very high';
                } else if (tea.geography.altitude >= this.elevationLevels.high.min) {
                    analysis.elevationCategory = 'high';
                } else if (tea.geography.altitude >= this.elevationLevels.medium.min) {
                    analysis.elevationCategory = 'medium';
                } else {
                    analysis.elevationCategory = 'low';
                }
            }
            
            // Update latitude zone based on actual latitude
            if (tea.geography.latitude) {
                const absLatitude = Math.abs(tea.geography.latitude);
                if (absLatitude <= this.latitudeZones.tropical.max) {
                    analysis.latitudeZone = 'tropical';
                } else if (absLatitude <= this.latitudeZones.subtropical.max) {
                    analysis.latitudeZone = 'subtropical';
                } else if (absLatitude <= this.latitudeZones.temperate.max) {
                    analysis.latitudeZone = 'temperate';
                } else {
                    analysis.latitudeZone = 'subpolar';
                }
            }
            
            // Update description with actual values
            analysis.description = `Tea from ${origin} grows at ${analysis.elevationCategory} elevation (${analysis.elevation}m)`;
            if (analysis.latitude) {
                analysis.description += ` in a ${analysis.latitudeZone} climate zone (${analysis.latitude}° latitude)`;
            }
            if (analysis.features.length > 0) {
                analysis.description += `, with ${analysis.features.join(' and ')} terrain`;
            }
            if (analysis.soilType) {
                analysis.description += `, in ${analysis.soilType} soil`;
            }
            if (analysis.climate) {
                analysis.description += `, experiencing a ${analysis.climate} climate`;
            }
        }
        
        return {
            geographicData: analysis,
            effects: analysis.effects || {},
            region: analysis.region,
            elevation: analysis.elevation,
            latitude: analysis.latitude,
            features: analysis.features,
            soilType: analysis.soilType,
            climate: analysis.climate
        };
    }
    
    // Format inference as human-readable markdown
    formatInference(inference) {
        if (!inference || !inference.geographicData) {
            return "## Geographic Analysis\n\nNo geographic data available.";
        }
        
        const { geographicData } = inference;
        
        let md = `# Geographic Analysis\n\n`;
        
        // Add description
        md += `${geographicData.description}\n\n`;
        
        // Region Information
        md += `## Region Details\n`;
        md += `- **Region**: ${geographicData.region || 'Unknown'}\n`;
        if (geographicData.regionSignature) {
            md += `- **Regional Signature**: ${geographicData.regionSignature}\n`;
        }
        if (geographicData.famousStyles && geographicData.famousStyles.length > 0) {
            md += `- **Famous Styles**: ${geographicData.famousStyles.join(', ')}\n`;
        }
        md += '\n';
        
        // Geographic Characteristics
        md += `## Geographic Characteristics\n`;
        md += `- **Elevation**: ${geographicData.elevation}m (${geographicData.elevationCategory})\n`;
        md += `- **Latitude**: ${geographicData.latitude}° (${geographicData.latitudeZone})\n`;
        md += `- **Features**: ${geographicData.features.join(', ')}\n`;
        md += `- **Soil Type**: ${geographicData.soilType}\n`;
        md += `- **Climate**: ${geographicData.climate}\n\n`;
        
        // Effects
        if (geographicData.effects && Object.keys(geographicData.effects).length > 0) {
            md += `## Geographic Effects\n`;
            Object.entries(geographicData.effects)
                .sort((a, b) => b[1] - a[1])
                .forEach(([effect, score]) => {
                    const bar = '█'.repeat(Math.round(score)) + '░'.repeat(10 - Math.round(score));
                    md += `${effect.padEnd(15)} ${bar} ${score.toFixed(1)}\n`;
                });
            md += '\n';
        }
        
        // Seasonality
        if (geographicData.seasonality) {
            md += `## Seasonality\n`;
            Object.entries(geographicData.seasonality).forEach(([season, desc]) => {
                md += `- **${season.charAt(0).toUpperCase() + season.slice(1)}**: ${desc}\n`;
            });
            md += '\n';
        }
        
        return md;
    }
    
    // Serialize inference to structured JSON
    serialize(inference) {
        if (!inference) {
            return {
                geographyScores: {},
                geography: {
                    description: 'No geography data available',
                    origin: null,
                    region: null,
                    elevation: null,
                    climate: null,
                    influence: {}
                }
            };
        }

        // Calculate geography scores
        const geographyScores = this.calculateGeographyScores(inference);

        return {
            geographyScores,
            geography: {
                description: inference.description || 'No description available',
                origin: inference.origin || null,
                region: inference.region || null,
                elevation: inference.elevation || null,
                climate: inference.climate || null,
                influence: inference.geographyInfluence || {}
            }
        };
    }
    
    /**
     * Calculate the geographical influence on tea effects based on origin
     * @param {string} origin - The tea's origin location
     * @return {Object} - The effect scores based on geography
     */
    calculateGeographicEffects(origin) {
        // Return empty object if no origin
        if (!origin || (typeof origin !== 'string' && typeof origin !== 'object')) {
            return {};
        }
        
        // Initialize scores object
        const scores = {};
        
        // Extract geographic data
        const geoData = this.extractGeographicData(origin);
        
        // Calculate Element scores based on geography and processing
        if (geoData.tea) {
            const elementScores = TeaGlobalMapping.mapGeographyAndProcessingToElementScores(geoData.tea);
            const primaryElement = Object.keys(elementScores).length > 0
                ? Object.entries(elementScores).sort((a, b) => b[1] - a[1])[0][0]
                : 'earth'; // Default element

            // Apply TCM effect mapping based on primary element
            if (TeaGlobalMapping.tcmToPrimaryEffectMap && TeaGlobalMapping.tcmToPrimaryEffectMap[primaryElement]) {
                TeaGlobalMapping.tcmToPrimaryEffectMap[primaryElement].forEach(([effect, strength]) => {
                    scores[effect] = (scores[effect] || 0) + strength;
                });
            }
        }
        
        // Apply elevation effects
        this.applyElevationEffects(geoData, scores);
        
        // Apply latitude effects
        this.applyLatitudeEffects(geoData, scores);
        
        // Apply terrain effects
        this.applyTerrainEffects(geoData, scores);
        
        // Apply soil effects
        this.applySoilEffects(geoData, scores);
        
        // Apply climate effects
        this.applyClimateEffects(geoData, scores);
        
        // Apply region-specific adjustments
        this.applyRegionSpecificAdjustments(geoData, scores);
        
        return scores;
    }
    
    /**
     * Extract geographic data from an origin string
     * @param {string} origin - The tea's origin location
     * @return {Object} - Geographic data including elevation, latitude, etc.
     */
    extractGeographicData(origin) {
        // Initialize result object with default values
        const result = {
            region: null,
            country: null,
            elevation: null,
            latitude: null,
            longitude: null,
            climate: null,
            terrainType: null,
            geographicFeatures: [],
            soilType: null,
            tea: null // Store tea object reference for Five Element calculation
        };
        
        // If origin is a full tea object
        if (origin && typeof origin === 'object' && 'geography' in origin) {
            // Store the full tea object for Five Element calculation
            result.tea = origin;
            
            // Extract geography data
            if (origin.geography) {
                const geo = origin.geography;
                result.elevation = geo.altitude || geo.elevation;
                result.latitude = geo.latitude;
                result.longitude = geo.longitude;
                result.climate = geo.climate;
                result.geographicFeatures = Array.isArray(geo.features) ? geo.features : [];
                result.soilType = geo.soilType;
                
                // Extract region if available
                if (geo.origin) {
                    if (typeof geo.origin === 'string') {
                        result.region = normalizeString(geo.origin);
                    } else if (typeof geo.origin === 'object') {
                        result.region = geo.origin.region ? normalizeString(geo.origin.region) : null;
                        result.country = geo.origin.country ? normalizeString(geo.origin.country) : null;
                    }
                }
            }
            return result;
        }

        // If origin is a geography object
        if (origin && typeof origin === 'object' && !('processingMethods' in origin)) {
            result.elevation = origin.altitude || origin.elevation;
            result.latitude = origin.latitude;
            result.longitude = origin.longitude;
            result.climate = origin.climate;
            result.geographicFeatures = Array.isArray(origin.features) ? origin.features : [];
            result.soilType = origin.soilType;
            
            // Extract region if available
            if (origin.region) {
                result.region = normalizeString(origin.region);
            }
            if (origin.country) {
                result.country = normalizeString(origin.country);
            }
            
            // Create a minimal tea object for element calculation
            result.tea = {
                geography: {
                    latitude: result.latitude,
                    longitude: result.longitude,
                    altitude: result.elevation,
                    climate: result.climate,
                    features: result.geographicFeatures,
                    soilType: result.soilType
                },
                processingMethods: []  // Empty array as we don't have processing methods
            };
            
            return result;
        }
        
        // If no specific elevation or region match was found, infer from keywords
        if (!result.elevation) {
            if (origin.includes('high altitude') || origin.includes('high-grown')) {
                result.elevation = 1800;  // Typical high altitude
            } else if (origin.includes('mountain')) {
                result.elevation = 1200;  // Typical mountain
            } else if (origin.includes('hill')) {
                result.elevation = 800;   // Typical hill
            } else if (origin.includes('lowland') || origin.includes('valley')) {
                result.elevation = 300;   // Typical lowland
            } else {
                result.elevation = 500;   // Default moderate elevation
            }
        }
        
        // Infer features if not specified by a known region
        if (result.geographicFeatures.length === 0) {
            if (origin.includes('mountain')) result.geographicFeatures.push('mountain');
            if (origin.includes('forest')) result.geographicFeatures.push('forest');
            if (origin.includes('coast')) result.geographicFeatures.push('coastal');
            if (origin.includes('river') || origin.includes('delta')) result.geographicFeatures.push('river-delta');
            if (origin.includes('valley')) result.geographicFeatures.push('valley');
            if (origin.includes('plateau')) result.geographicFeatures.push('plateau');
            if (origin.includes('volcanic')) result.geographicFeatures.push('volcanic');
            
            // Default feature if none are found
            if (result.geographicFeatures.length === 0) {
                result.geographicFeatures.push('standard');
            }
        }
        
        return result;
    }
    
    /**
     * Get the elevation category based on elevation in meters
     * @param {number} elevation - Elevation in meters
     * @returns {string} - Elevation category
     */
    getElevationCategory(elevation) {
        if (elevation >= 1800) {
            return 'very high';
        } else if (elevation >= 1200) {
            return 'high';
        } else if (elevation >= 600) {
            return 'medium';
        } else {
            return 'low';
        }
    }
    
    /**
     * Apply elevation-based effects to the scores
     * @param {Object} geoData - Geographic data
     * @param {Object} scores - Effect scores to modify
     */
    applyElevationEffects(geoData, scores) {
        if (!geoData || !geoData.elevation) return;
        
        // Apply elevation category scaling
        const elevationCategory = this.getElevationCategory(geoData.elevation);
        
        switch(elevationCategory) {
            case 'very high': // Above 1800m
                scores['focusing'] = (scores['focusing'] || 0) + 3.5; // INCREASED from basic level
                scores['elevating'] = (scores['elevating'] || 0) + 3.0; // INCREASED from basic level
                break;
            case 'high': // 1200-1800m
                scores['focusing'] = (scores['focusing'] || 0) + 3.0;
                scores['elevating'] = (scores['elevating'] || 0) + 2.5;
                break;
            case 'medium': // 600-1200m
                scores['refreshing'] = (scores['refreshing'] || 0) + 2.0;
                scores['harmonizing'] = (scores['harmonizing'] || 0) + 1.5;
                break;
            case 'low': // Below 600m
                scores['grounding'] = (scores['grounding'] || 0) + 2.0;
                scores['grounding'] = (scores['grounding'] || 0) + 1.5;
                break;
        }
    }
    
    /**
     * Apply latitude-based effects to the scores
     * @param {Object} geoData - Geographic data
     * @param {Object} scores - Effect scores to modify
     */
    applyLatitudeEffects(geoData, scores) {
        const latitude = geoData.latitude;
        
        if (!latitude) return; // Skip if latitude is unknown
        
        const absLatitude = Math.abs(latitude);
        
        if (absLatitude <= this.latitudeZones.tropical.max) {
            // Tropical (0-23.5°)
            scores.energizing = (scores.energizing || 0) + 1.8;
            scores.centering = (scores.centering || 0) + 1.2;
        } else if (absLatitude <= this.latitudeZones.subtropical.max) {
            // Subtropical (23.5-35°)
            scores.harmonizing = (scores.harmonizing || 0) + 1.5;
            scores.energizing = (scores.energizing || 0) + 1.2;
        } else if (absLatitude <= this.latitudeZones.temperate.max) {
            // Temperate (35-55°)
            scores.restorative = (scores.restorative || 0) + 1.5;
            scores.calming = (scores.calming || 0) + 1.2;
        } else {
            // Subpolar (55-90°)
            scores.grounding = (scores.grounding || 0) + 1.8;
            scores.grounding = (scores.grounding || 0) + 1.5;
        }
    }
    
    /**
     * Apply terrain/feature-based effects to the scores
     * @param {Object} geoData - Geographic data
     * @param {Object} scores - Effect scores to modify
     */
    applyTerrainEffects(geoData, scores) {
        geoData.geographicFeatures.forEach(feature => {
            switch (feature) {
                case 'mountain':
                    scores.elevating = (scores.elevating || 0) + 1.5;
                    break;
                case 'high-mountain':
                    scores.elevating = (scores.elevating || 0) + 2.2;
                    scores.focusing = (scores.focusing || 0) + 1.8;
                    break;
                case 'forest':
                    scores.reflective = (scores.reflective || 0) + 1.8;
                    scores.grounding = (scores.grounding || 0) + 1.5;
                    break;
                case 'coastal':
                    scores.restorative = (scores.restorative || 0) + 2.0;
                    scores.energizing = (scores.energizing || 0) + 1.5;
                    break;
                case 'river-delta':
                    scores.comforting = (scores.comforting || 0) + 2.0;
                    scores.calming = (scores.calming || 0) + 1.5;
                    break;
                case 'valley':
                    scores.calming = (scores.calming || 0) + 2.0;
                    scores.comforting = (scores.comforting || 0) + 1.5;
                    break;
                case 'plateau':
                    scores.centering = (scores.centering || 0) + 1.8;
                    scores.harmonizing = (scores.harmonizing || 0) + 1.5;
                    break;
                case 'volcanic':
                    scores.focusing = (scores.focusing || 0) + 1.8;
                    scores.energizing = (scores.energizing || 0) + 1.5;
                    break;
            }
        });
    }
    
    /**
     * Apply soil type effects to the scores
     * @param {Object} geoData - Geographic data
     * @param {Object} scores - Effect scores to modify
     */
    applySoilEffects(geoData, scores) {
        const soil = geoData.soilType;
        
        if (!soil) return; // Skip if soil type is unknown
        
        switch (soil) {
            case 'volcanic':
                scores.restorative = (scores.restorative || 0) + 1.5;
                scores.focusing = (scores.focusing || 0) + 1.2;
                break;
            case 'mineral-rich':
                scores.restorative = (scores.restorative || 0) + 1.8;
                scores.comforting = (scores.comforting || 0) + 1.2;
                break;
            case 'loamy':
                scores.harmonizing = (scores.harmonizing || 0) + 1.5;
                scores.grounding = (scores.grounding || 0) + 1.2;
                break;
            case 'sandy-loam':
                scores.harmonizing = (scores.harmonizing || 0) + 1.2;
                scores.calming = (scores.calming || 0) + 1.0;
                break;
            case 'alluvial':
                scores.comforting = (scores.comforting || 0) + 1.8;
                scores.restorative = (scores.restorative || 0) + 1.5;
                break;
            case 'laterite':
                scores.grounding = (scores.grounding || 0) + 1.5;
                scores.grounding = (scores.grounding || 0) + 1.2;
                break;
            case 'rocky':
                scores.focusing = (scores.focusing || 0) + 1.5;
                scores.focusing = (scores.focusing || 0) + 1.2;
                break;
            case 'volcanic-loam':
                scores.restorative = (scores.restorative || 0) + 1.5;
                scores.harmonizing = (scores.harmonizing || 0) + 1.2;
                break;
            case 'volcanic-alluvial':
                scores.restorative = (scores.restorative || 0) + 1.5;
                scores.comforting = (scores.comforting || 0) + 1.2;
                break;
        }
    }
    
    /**
     * Apply climate effects to the scores
     * @param {Object} geoData - Geographic data
     * @param {Object} scores - Effect scores to modify
     */
    applyClimateEffects(geoData, scores) {
        const climate = geoData.climate;
        
        if (!climate) return; // Skip if climate is unknown
        
        switch (climate) {
            case 'tropical':
                scores.energizing = (scores.energizing || 0) + 1.5;
                scores.energizing = (scores.energizing || 0) + 1.2;
                break;
            case 'tropical-highland':
                scores.elevating = (scores.elevating || 0) + 1.5;
                scores.focusing = (scores.focusing || 0) + 1.2;
                break;
            case 'subtropical':
                scores.energizing = (scores.energizing || 0) + 1.5;
                scores.harmonizing = (scores.harmonizing || 0) + 1.2;
                break;
            case 'subtropical-highland':
                scores.focusing = (scores.focusing || 0) + 1.8;
                scores.focusing = (scores.focusing || 0) + 1.5;
                break;
            case 'temperate':
                scores.restorative = (scores.restorative || 0) + 1.5;
                scores.calming = (scores.calming || 0) + 1.2;
                break;
            case 'humid-subtropical':
                scores.comforting = (scores.comforting || 0) + 1.5;
                scores.restorative = (scores.restorative || 0) + 1.2;
                break;
        }
    }
    
    /**
     * Apply specific adjustments for well-known tea regions
     * @param {Object} geoData - Geographic data
     * @param {Object} scores - Effect scores to modify
     */
    applyRegionSpecificAdjustments(geoData, scores) {
        if (!geoData || !geoData.region) return;
        
        const region = geoData.region.toLowerCase();
        
        // Special adjustments based on region
        switch(region) {
            case 'darjeeling':
                scores['focusing'] = (scores['focusing'] || 0) + 3.5; // INCREASED from previous value
                scores['elevating'] = (scores['elevating'] || 0) + 3.0; // INCREASED from previous value
                break;
            case 'yunnan':
                scores['grounding'] = (scores['grounding'] || 0) + 2.0;
                scores['comforting'] = (scores['comforting'] || 0) + 1.5;
                break;
            case 'fujian':
                scores['harmonizing'] = (scores['harmonizing'] || 0) + 2.0;
                scores['calming'] = (scores['calming'] || 0) + 1.5;
                break;
            case 'assam':
                scores['energizing'] = (scores['energizing'] || 0) + 2.0;
                scores['restorative'] = (scores['restorative'] || 0) + 1.5;
                break;
            case 'uji':
            case 'kyoto':
                scores['focusing'] = (scores['focusing'] || 0) + 2.0;
                scores['reflective'] = (scores['reflective'] || 0) + 1.5;
                break;
        }
        
        // Additional check for high-altitude origin that might not be captured by elevation data
        if ((geoData.region && geoData.region.toLowerCase().includes('darjeeling')) || 
            (geoData.elevation && geoData.elevation > 1500)) {
            scores["focusing"] = (scores["focusing"] || 0) + 3.5;  // INCREASED from 2.5
            scores["elevating"] = (scores["elevating"] || 0) + 3.0;   // INCREASED from 2.0
        }
    }
    
    /**
     * Get detailed information about the geographic influences
     * @param {string} origin - The tea's origin
     * @return {Object} - Detailed geographic analysis
     */
    getGeographicAnalysis(origin) {
        const geoData = this.extractGeographicData(origin);
        const scores = this.calculateGeographicEffects(origin);
        
        // Determine the elevation category
        let elevationCategory = 'low';
        if (geoData.elevation >= this.elevationLevels.veryHigh.min) {
            elevationCategory = 'very high';
        } else if (geoData.elevation >= this.elevationLevels.high.min) {
            elevationCategory = 'high';
        } else if (geoData.elevation >= this.elevationLevels.medium.min) {
            elevationCategory = 'medium';
        }
        
        // Determine latitude zone if available
        let latitudeZone = 'unknown';
        if (geoData.latitude) {
            const absLatitude = Math.abs(geoData.latitude);
            if (absLatitude <= this.latitudeZones.tropical.max) {
                latitudeZone = 'tropical';
            } else if (absLatitude <= this.latitudeZones.subtropical.max) {
                latitudeZone = 'subtropical';
            } else if (absLatitude <= this.latitudeZones.temperate.max) {
                latitudeZone = 'temperate';
            } else {
                latitudeZone = 'subpolar';
            }
        }
        
        // Create a detailed description using the descriptors
        let description = `Tea from ${origin} grows at ${elevationCategory} elevation (${geoData.elevation}m)`;
        
        if (geoData.latitude) {
            description += ` in a ${latitudeZone} climate zone (${geoData.latitude}° latitude)`;
        }
        
        if (geoData.geographicFeatures.length > 0) {
            description += `, with ${geoData.geographicFeatures.join(' and ')} terrain`;
        }
        
        if (geoData.soilType) {
            description += `, in ${geoData.soilType} soil`;
        }
        
        if (geoData.climate) {
            description += `, experiencing a ${geoData.climate} climate`;
        }
        
        description += '. ';
        
        // Add elevation description if available
        if (elevationLevels[elevationCategory.replace(' ', '')]) {
            description += elevationLevels[elevationCategory.replace(' ', '')].description + ' ';
        }
        
        // Add region-specific description if available
        if (regionCharacteristics[geoData.region]) {
            description += regionCharacteristics[geoData.region].description + ' ';
        }
        
        // Add effect summary
        const topEffects = Object.entries(scores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);
            
        if (topEffects.length > 0) {
            description += `These geographic conditions particularly enhance ${topEffects.map(([effect, _]) => effect).join(', ')} qualities.`;
        }
        
        return {
            origin,
            elevation: geoData.elevation,
            elevationCategory,
            latitude: geoData.latitude,
            latitudeZone,
            features: geoData.geographicFeatures,
            soilType: geoData.soilType,
            climate: geoData.climate,
            region: geoData.region,
            effects: scores,
            description,
            // Additional information from descriptors
            regionSignature: geoData.region && regionCharacteristics[geoData.region] ? 
                regionCharacteristics[geoData.region].signature : null,
            famousStyles: geoData.region && regionCharacteristics[geoData.region] ? 
                regionCharacteristics[geoData.region].famous_styles : null,
            seasonality: geoData.region && regionalSeasonality[geoData.region] ?
                regionalSeasonality[geoData.region] : null
        };
    }

    calculateGeographyScores(tea) {
        if (!tea || !tea.origin) {
            return {};
        }
        
        // Initialize with the 8 consolidated effects
        const scores = {
            energizing: 0,
            calming: 0,
            focusing: 0,
            harmonizing: 0,
            grounding: 0,
            elevating: 0,
            comforting: 0,
            restorative: 0
        };
        
        // Helper function to add scores
        const addGeographyScore = (effect, score) => {
            // Only add if it's one of our 8 consolidated effects
            if (scores.hasOwnProperty(effect)) {
                scores[effect] += score;
            }
            // Ignore any old effect names
        };
        
        // Extract geographic data
        const geoData = this.extractGeographicData(tea.origin);
        
        // Apply effects from different geographic factors
        if (geoData.elevation) {
            this.applyElevationEffects(geoData, scores);
        }
        
        if (geoData.latitude) {
            this.applyLatitudeEffects(geoData, scores);
        }
        
        if (geoData.geographicFeatures && geoData.geographicFeatures.length > 0) {
            this.applyTerrainEffects(geoData, scores);
        }
        
        if (geoData.soilType) {
            this.applySoilEffects(geoData, scores);
        }
        
        if (geoData.climate) {
            this.applyClimateEffects(geoData, scores);
        }
        
        // Apply region-specific adjustments
        this.applyRegionSpecificAdjustments(geoData, scores);
        
        return scores;
    }
}

export default GeographyCalculator;