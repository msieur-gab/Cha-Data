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
        if (!inference || !inference.geographicData) {
            return {
                region: null,
                elevation: {
                    value: null,
                    category: null
                },
                latitude: {
                    value: null,
                    zone: null
                },
                features: [],
                soilType: null,
                climate: null,
                effects: {},
                description: "No geographic data available"
            };
        }

        const { geographicData } = inference;
        
        return {
            region: geographicData.region,
            elevation: {
                value: geographicData.elevation,
                category: geographicData.elevationCategory
            },
            latitude: {
                value: geographicData.latitude,
                zone: geographicData.latitudeZone
            },
            features: geographicData.features,
            soilType: geographicData.soilType,
            climate: geographicData.climate,
            effects: geographicData.effects || {},
            description: geographicData.description
        };
    }
    
    /**
     * Calculate the geographical influence on tea effects based on origin
     * @param {string} origin - The tea's origin location
     * @return {Object} - The effect scores based on geography
     */
    calculateGeographicEffects(origin) {
        if (!origin) return {};
        
        // Extract geographic data based on origin
        const geoData = this.extractGeographicData(origin);
        
        // Initialize scores
        const scores = {};
        
        // Apply elevation effects
        this.applyElevationEffects(geoData, scores);
        
        // Apply latitude effects
        this.applyLatitudeEffects(geoData, scores);
        
        // Apply terrain/feature effects
        this.applyTerrainEffects(geoData, scores);
        
        // Apply soil type effects
        this.applySoilEffects(geoData, scores);
        
        // Apply climate effects
        this.applyClimateEffects(geoData, scores);
        
        // Apply any adjustments for well-known specific regions
        this.applyRegionSpecificAdjustments(geoData, scores);
    
        return scores;
    }
    
    /**
     * Extract geographic data from an origin string
     * @param {string} origin - The tea's origin location
     * @return {Object} - Geographic data including elevation, latitude, etc.
     */
    extractGeographicData(origin) {
        const originLower = origin.toLowerCase();
        let geoData = {
            elevation: null,
            latitude: null,
            features: [],
            soilType: null,
            climate: null,
            region: 'unknown'
        };
        
        // Check for explicit elevation mentions
        const elevationMatch = originLower.match(/(\d+)\s*meters|(\d+)\s*m elevation/);
        if (elevationMatch) {
            geoData.elevation = parseInt(elevationMatch[1] || elevationMatch[2]);
        }
        
        // Check for known regions in our database
        for (const region in this.regionData) {
            if (originLower.includes(region)) {
                geoData = {
                    ...geoData,
                    ...this.regionData[region],
                    region,
                    elevation: geoData.elevation || this.regionData[region].avgElevation
                };
                break;
            }
        }
        
        // If no specific elevation or region match was found, infer from keywords
        if (!geoData.elevation) {
            if (originLower.includes('high altitude') || originLower.includes('high-grown')) {
                geoData.elevation = 1800;  // Typical high altitude
            } else if (originLower.includes('mountain')) {
                geoData.elevation = 1200;  // Typical mountain
            } else if (originLower.includes('hill')) {
                geoData.elevation = 800;   // Typical hill
            } else if (originLower.includes('lowland') || originLower.includes('valley')) {
                geoData.elevation = 300;   // Typical lowland
            } else {
                geoData.elevation = 500;   // Default moderate elevation
            }
        }
        
        // Infer features if not specified by a known region
        if (geoData.features.length === 0) {
            if (originLower.includes('mountain')) geoData.features.push('mountain');
            if (originLower.includes('forest')) geoData.features.push('forest');
            if (originLower.includes('coast')) geoData.features.push('coastal');
            if (originLower.includes('river') || originLower.includes('delta')) geoData.features.push('river-delta');
            if (originLower.includes('valley')) geoData.features.push('valley');
            if (originLower.includes('plateau')) geoData.features.push('plateau');
            if (originLower.includes('volcanic')) geoData.features.push('volcanic');
            
            // Default feature if none are found
            if (geoData.features.length === 0) {
                geoData.features.push('standard');
            }
        }
        
        return geoData;
    }
    
    /**
     * Apply elevation-based effects to the scores
     * @param {Object} geoData - Geographic data
     * @param {Object} scores - Effect scores to modify
     */
    applyElevationEffects(geoData, scores) {
        const elevation = geoData.elevation;
        
        if (elevation >= this.elevationLevels.veryHigh.min) {
            // Very high elevation (>2000m)
            scores.clarifying = (scores.clarifying || 0) + 3.0;
            scores.elevating = (scores.elevating || 0) + 2.8;
            scores.reflective = (scores.reflective || 0) + 1.5;
        } else if (elevation >= this.elevationLevels.high.min) {
            // High elevation (1200-2000m)
            scores.clarifying = (scores.clarifying || 0) + 2.4;
            scores.elevating = (scores.elevating || 0) + 2.0;
            scores.reflective = (scores.reflective || 0) + 1.0;
        } else if (elevation >= this.elevationLevels.medium.min) {
            // Medium elevation (500-1200m)
            scores.balancing = (scores.balancing || 0) + 1.5;
            scores.clarifying = (scores.clarifying || 0) + 1.2;
        } else {
            // Low elevation (<500m)
            scores.nurturing = (scores.nurturing || 0) + 1.5;
            scores.grounding = (scores.grounding || 0) + 1.2;
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
            scores.revitalizing = (scores.revitalizing || 0) + 1.8;
            scores.centering = (scores.centering || 0) + 1.2;
        } else if (absLatitude <= this.latitudeZones.subtropical.max) {
            // Subtropical (23.5-35°)
            scores.balancing = (scores.balancing || 0) + 1.5;
            scores.awakening = (scores.awakening || 0) + 1.2;
        } else if (absLatitude <= this.latitudeZones.temperate.max) {
            // Temperate (35-55°)
            scores.soothing = (scores.soothing || 0) + 1.5;
            scores.peaceful = (scores.peaceful || 0) + 1.2;
        } else {
            // Subpolar (55-90°)
            scores.grounding = (scores.grounding || 0) + 1.8;
            scores.stabilizing = (scores.stabilizing || 0) + 1.5;
        }
    }
    
    /**
     * Apply terrain/feature-based effects to the scores
     * @param {Object} geoData - Geographic data
     * @param {Object} scores - Effect scores to modify
     */
    applyTerrainEffects(geoData, scores) {
        geoData.features.forEach(feature => {
            switch (feature) {
                case 'mountain':
                    scores.elevating = (scores.elevating || 0) + 1.5;
                    break;
                case 'high-mountain':
                    scores.elevating = (scores.elevating || 0) + 2.2;
                    scores.clarifying = (scores.clarifying || 0) + 1.8;
                    break;
                case 'forest':
                    scores.reflective = (scores.reflective || 0) + 1.8;
                    scores.stabilizing = (scores.stabilizing || 0) + 1.5;
                    break;
                case 'coastal':
                    scores.restorative = (scores.restorative || 0) + 2.0;
                    scores.awakening = (scores.awakening || 0) + 1.5;
                    break;
                case 'river-delta':
                    scores.nurturing = (scores.nurturing || 0) + 2.0;
                    scores.peaceful = (scores.peaceful || 0) + 1.5;
                    break;
                case 'valley':
                    scores.peaceful = (scores.peaceful || 0) + 2.0;
                    scores.nurturing = (scores.nurturing || 0) + 1.5;
                    break;
                case 'plateau':
                    scores.centering = (scores.centering || 0) + 1.8;
                    scores.balancing = (scores.balancing || 0) + 1.5;
                    break;
                case 'volcanic':
                    scores.clarifying = (scores.clarifying || 0) + 1.8;
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
                scores.clarifying = (scores.clarifying || 0) + 1.2;
                break;
            case 'mineral-rich':
                scores.restorative = (scores.restorative || 0) + 1.8;
                scores.nurturing = (scores.nurturing || 0) + 1.2;
                break;
            case 'loamy':
                scores.balancing = (scores.balancing || 0) + 1.5;
                scores.grounding = (scores.grounding || 0) + 1.2;
                break;
            case 'sandy-loam':
                scores.balancing = (scores.balancing || 0) + 1.2;
                scores.peaceful = (scores.peaceful || 0) + 1.0;
                break;
            case 'alluvial':
                scores.nurturing = (scores.nurturing || 0) + 1.8;
                scores.soothing = (scores.soothing || 0) + 1.5;
                break;
            case 'laterite':
                scores.grounding = (scores.grounding || 0) + 1.5;
                scores.stabilizing = (scores.stabilizing || 0) + 1.2;
                break;
            case 'rocky':
                scores.focusing = (scores.focusing || 0) + 1.5;
                scores.clarifying = (scores.clarifying || 0) + 1.2;
                break;
            case 'volcanic-loam':
                scores.restorative = (scores.restorative || 0) + 1.5;
                scores.balancing = (scores.balancing || 0) + 1.2;
                break;
            case 'volcanic-alluvial':
                scores.restorative = (scores.restorative || 0) + 1.5;
                scores.nurturing = (scores.nurturing || 0) + 1.2;
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
                scores.revitalizing = (scores.revitalizing || 0) + 1.5;
                scores.energizing = (scores.energizing || 0) + 1.2;
                break;
            case 'tropical-highland':
                scores.elevating = (scores.elevating || 0) + 1.5;
                scores.clarifying = (scores.clarifying || 0) + 1.2;
                break;
            case 'subtropical':
                scores.awakening = (scores.awakening || 0) + 1.5;
                scores.balancing = (scores.balancing || 0) + 1.2;
                break;
            case 'subtropical-highland':
                scores.clarifying = (scores.clarifying || 0) + 1.8;
                scores.focusing = (scores.focusing || 0) + 1.5;
                break;
            case 'temperate':
                scores.soothing = (scores.soothing || 0) + 1.5;
                scores.peaceful = (scores.peaceful || 0) + 1.2;
                break;
            case 'humid-subtropical':
                scores.nurturing = (scores.nurturing || 0) + 1.5;
                scores.soothing = (scores.soothing || 0) + 1.2;
                break;
        }
    }
    
    /**
     * Apply specific adjustments for well-known tea regions
     * @param {Object} geoData - Geographic data
     * @param {Object} scores - Effect scores to modify
     */
    applyRegionSpecificAdjustments(geoData, scores) {
        // Specific well-known regions may have unique characteristics
        // that go beyond basic geography factors
        
        const region = geoData.region;
        
        switch (region) {
            case 'darjeeling':
                // Known for its "muscatel" character and brightness
                scores.elevating = (scores.elevating || 0) + 0.8;
                scores.clarifying = (scores.clarifying || 0) + 0.5;
                break;
            case 'assam':
                // Known for maltiness and strength
                scores.energizing = (scores.energizing || 0) + 0.8;
                scores.grounding = (scores.grounding || 0) + 0.5;
                break;
            case 'uji':
                // Famous for high quality matcha and umami
                scores.clarifying = (scores.clarifying || 0) + 0.8;
                scores.focusing = (scores.focusing || 0) + 0.5;
                break;
            case 'yunnan':
                // Known for unique terroir and biodiversity
                scores.grounding = (scores.grounding || 0) + 0.8;
                scores.centering = (scores.centering || 0) + 0.5;
                break;
            case 'alishan':
                // Famous for high mountain oolong with floral notes
                scores.elevating = (scores.elevating || 0) + 0.8;
                scores.soothing = (scores.soothing || 0) + 0.5;
                break;
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
        
        if (geoData.features.length > 0) {
            description += `, with ${geoData.features.join(' and ')} terrain`;
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
            features: geoData.features,
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
}

export default GeographyCalculator;