// GeographyCalculator.js
// Handles calculations related to geographical influence on tea effects

import { BaseCalculator } from './BaseCalculator.js';

export class GeographyCalculator extends BaseCalculator {
    constructor(config) {
        super(config);
        this.geographyFactors = {};
    }
    
    // Set geography factors data
    setGeographyFactors(geographyFactors) {
        this.geographyFactors = geographyFactors || {};
    }

    // Override infer method from BaseCalculator
    infer(tea) {
        if (!tea || !tea.geography) {
            return {
                description: 'No geographical data available',
                geographyFactors: {},
                effects: {}
            };
        }

        // Extract tea geography data
        const { altitude, humidity, latitude, longitude, harvestMonth } = tea.geography;
        
        // Calculate geographical influences
        const altitudeEffects = this.calculateAltitudeEffects(altitude);
        const humidityEffects = this.calculateHumidityEffects(humidity);
        const latitudeEffects = this.calculateLatitudeEffects(latitude);
        const seasonalEffects = this.calculateSeasonalEffects(harvestMonth, latitude);
        
        // Combine all geographical effects
        const geographyScores = this.combineGeographicalEffects(
            altitudeEffects,
            humidityEffects,
            latitudeEffects,
            seasonalEffects
        );
        
        // Create regions description
        const regions = this.identifyRegions(latitude, longitude);
        
        return {
            description: this.generateDescription(tea.geography, regions),
            altitude: {
                value: altitude,
                category: this.getAltitudeCategory(altitude),
                effects: altitudeEffects
            },
            humidity: {
                value: humidity,
                category: this.getHumidityCategory(humidity),
                effects: humidityEffects
            },
            location: {
                latitude,
                longitude,
                regions,
                effects: latitudeEffects
            },
            season: {
                harvestMonth,
                name: this.getSeasonName(harvestMonth, latitude),
                effects: seasonalEffects
            },
            geographyScores
        };
    }

    // Override formatInference from BaseCalculator
    formatInference(inference) {
        if (!inference) {
            return '## Geographical Analysis\n\nNo geographical data available.';
        }

        let md = '## Geographical Analysis\n\n';
        
        // Add description
        md += `${inference.description}\n\n`;
        
        // Add altitude section
        md += `### Altitude: ${inference.altitude.value}m\n`;
        md += `Category: ${inference.altitude.category}\n\n`;
        md += `Effects influenced by altitude:\n`;
        Object.entries(inference.altitude.effects).forEach(([effect, score]) => {
            md += `- ${effect}: ${score.toFixed(1)}\n`;
        });
        md += '\n';
        
        // Add humidity section
        md += `### Humidity: ${inference.humidity.value}%\n`;
        md += `Category: ${inference.humidity.category}\n\n`;
        md += `Effects influenced by humidity:\n`;
        Object.entries(inference.humidity.effects).forEach(([effect, score]) => {
            md += `- ${effect}: ${score.toFixed(1)}\n`;
        });
        md += '\n';
        
        // Add location section
        md += `### Location\n`;
        md += `Coordinates: ${inference.location.latitude.toFixed(2)}° ${inference.location.latitude >= 0 ? 'N' : 'S'}, `;
        md += `${inference.location.longitude.toFixed(2)}° ${inference.location.longitude >= 0 ? 'E' : 'W'}\n\n`;
        md += `Regions: ${inference.location.regions.join(', ')}\n\n`;
        md += `Effects influenced by location:\n`;
        Object.entries(inference.location.effects).forEach(([effect, score]) => {
            md += `- ${effect}: ${score.toFixed(1)}\n`;
        });
        md += '\n';
        
        // Add seasonal section
        md += `### Harvest Season\n`;
        md += `Month: ${inference.season.harvestMonth} (${inference.season.name})\n\n`;
        md += `Effects influenced by season:\n`;
        Object.entries(inference.season.effects).forEach(([effect, score]) => {
            md += `- ${effect}: ${score.toFixed(1)}\n`;
        });
        
        return md;
    }

    // Override serialize from BaseCalculator
    serialize(inference) {
        if (!inference) {
            return {
                geographyScores: {},
                geography: {
                    description: 'No geographical data available',
                    altitude: { value: 0, category: 'Unknown', effects: {} },
                    humidity: { value: 0, category: 'Unknown', effects: {} },
                    location: { regions: [], effects: {} },
                    season: { harvestMonth: 0, name: 'Unknown', effects: {} },
                    _sectionRef: "geography"
                }
            };
        }

        return {
            geographyScores: inference.geographyScores,
            geography: {
                description: inference.description,
                altitude: inference.altitude,
                humidity: inference.humidity,
                location: inference.location,
                season: inference.season,
                _sectionRef: "geography"
            }
        };
    }
    
    // Calculate effects based on altitude
    calculateAltitudeEffects(altitude) {
        if (!altitude || typeof altitude !== 'number') {
            return {};
        }
        
        const effects = {};
        
        // High altitude (>1000m) - typically leads to slower growth, concentrated flavors
        if (altitude > 1500) {
            effects.focusing = 8;
            effects.elevating = 7;
            effects.harmonizing = 6;
        }
        // Medium-high altitude (800-1500m)
        else if (altitude > 800) {
            effects.focusing = 7;
            effects.elevating = 6;
            effects.harmonizing = 5;
        }
        // Medium altitude (400-800m)
        else if (altitude > 400) {
            effects.harmonizing = 7;
            effects.focusing = 6;
            effects.energizing = 5;
        }
        // Low altitude (<400m)
        else {
            effects.energizing = 7;
            effects.grounding = 6;
            effects.harmonizing = 5;
        }
        
        return effects;
    }
    
    // Calculate effects based on humidity
    calculateHumidityEffects(humidity) {
        if (!humidity || typeof humidity !== 'number') {
            return {};
        }
        
        const effects = {};
        
        // Very high humidity (>85%)
        if (humidity > 85) {
            effects.calming = 7;
            effects.restorative = 6;
            effects.grounding = 5;
        }
        // High humidity (70-85%)
        else if (humidity > 70) {
            effects.restorative = 7;
            effects.calming = 6;
            effects.comforting = 5;
        }
        // Medium humidity (55-70%)
        else if (humidity > 55) {
            effects.harmonizing = 7;
            effects.comforting = 5;
            effects.focusing = 4;
        }
        // Low humidity (<55%)
        else {
            effects.focusing = 7;
            effects.energizing = 6;
            effects.grounding = 5;
        }
        
        return effects;
    }
    
    // Calculate effects based on latitude
    calculateLatitudeEffects(latitude) {
        if (latitude === undefined || latitude === null) {
            return {};
        }
        
        const absLatitude = Math.abs(latitude);
        const effects = {};
        
        // Tropical (0-23.5°)
        if (absLatitude <= 23.5) {
            effects.energizing = 7;
            effects.elevating = 6;
            effects.focusing = 5;
        }
        // Subtropical (23.5-35°)
        else if (absLatitude <= 35) {
            effects.harmonizing = 7;
            effects.focusing = 6;
            effects.elevating = 5;
        }
        // Temperate (35-50°)
        else if (absLatitude <= 50) {
            effects.focusing = 7;
            effects.grounding = 6;
            effects.comforting = 5;
        }
        // Cold/Subarctic (>50°)
        else {
            effects.grounding = 7;
            effects.comforting = 6;
            effects.restorative = 5;
        }
        
        return effects;
    }
    
    // Calculate effects based on harvest season and latitude
    calculateSeasonalEffects(harvestMonth, latitude) {
        if (!harvestMonth || typeof harvestMonth !== 'number') {
            return {};
        }
        
        const season = this.getSeasonName(harvestMonth, latitude);
        const effects = {};
        
        // Early spring harvest (strongest, most prized)
        if (season === 'Early Spring') {
            effects.energizing = 8;
            effects.focusing = 7;
            effects.elevating = 6;
        }
        // Spring harvest
        else if (season === 'Spring') {
            effects.harmonizing = 7;
            effects.focusing = 6;
            effects.elevating = 5;
        }
        // Summer harvest
        else if (season === 'Summer') {
            effects.energizing = 7;
            effects.grounding = 6;
            effects.focusing = 5;
        }
        // Autumn harvest
        else if (season === 'Autumn') {
            effects.comforting = 7;
            effects.grounding = 6;
            effects.harmonizing = 5;
        }
        // Winter harvest (rare, but happens in some tropical areas)
        else if (season === 'Winter') {
            effects.calming = 7;
            effects.restorative = 6;
            effects.comforting = 5;
        }
        
        return effects;
    }
    
    // Combine all geographical effects with appropriate weighting
    combineGeographicalEffects(...effectSets) {
        const combined = {};
        const weights = {
            altitude: 0.3,
            humidity: 0.2,
            latitude: 0.2,
            season: 0.3
        };
        
        // Apply weights to each set of effects
        effectSets.forEach((effects, index) => {
            const weight = Object.values(weights)[index];
            
            Object.entries(effects).forEach(([effect, score]) => {
                if (!combined[effect]) {
                    combined[effect] = 0;
                }
                combined[effect] += score * weight;
            });
        });
        
        // Normalize scores
        const maxScore = Math.max(...Object.values(combined), 1);
        Object.keys(combined).forEach(effect => {
            combined[effect] = (combined[effect] / maxScore) * 10;
        });
        
        return combined;
    }
    
    // Generate a descriptive text about the geography
    generateDescription(geography, regions) {
        if (!geography) {
            return 'No geographical information available.';
        }
        
        const { altitude, humidity, harvestMonth } = geography;
        const altitudeCategory = this.getAltitudeCategory(altitude);
        const humidityCategory = this.getHumidityCategory(humidity);
        const season = this.getSeasonName(harvestMonth, geography.latitude);
        
        let description = `This tea was grown in ${regions.join(' and ')} at a ${altitudeCategory} altitude of ${altitude}m `;
        description += `in a ${humidityCategory} humidity environment (${humidity}%). `;
        description += `It was harvested during ${season} (month ${harvestMonth}).`;
        
        // Add specific effects based on altitude
        if (altitude > 1000) {
            description += ` The high altitude contributes to its focusing and elevating qualities.`;
        } else if (altitude < 400) {
            description += ` The low altitude contributes to its energizing and grounding qualities.`;
        }
        
        return description;
    }
    
    // Get altitude category
    getAltitudeCategory(altitude) {
        if (!altitude || typeof altitude !== 'number') {
            return 'Unknown';
        }
        
        if (altitude > 1500) return 'Very High';
        if (altitude > 1000) return 'High';
        if (altitude > 500) return 'Medium';
        if (altitude > 200) return 'Low';
        return 'Very Low';
    }
    
    // Get humidity category
    getHumidityCategory(humidity) {
        if (!humidity || typeof humidity !== 'number') {
            return 'Unknown';
        }
        
        if (humidity > 85) return 'Very High';
        if (humidity > 70) return 'High';
        if (humidity > 55) return 'Medium';
        if (humidity > 40) return 'Low';
        return 'Very Low';
    }
    
    // Get season name based on harvest month and latitude
    getSeasonName(month, latitude) {
        if (!month || typeof month !== 'number' || month < 1 || month > 12) {
            return 'Unknown';
        }
        
        // Southern hemisphere has reversed seasons
        const isSouthernHemisphere = latitude < 0;
        let adjustedMonth = isSouthernHemisphere ? (month + 6) % 12 : month;
        if (adjustedMonth === 0) adjustedMonth = 12;
        
        // Early spring (generally the prime harvest time)
        if (adjustedMonth === 3 || adjustedMonth === 4) {
            return 'Early Spring';
        }
        // Spring
        else if (adjustedMonth === 5) {
            return 'Spring';
        }
        // Summer
        else if (adjustedMonth >= 6 && adjustedMonth <= 8) {
            return 'Summer';
        }
        // Autumn
        else if (adjustedMonth >= 9 && adjustedMonth <= 11) {
            return 'Autumn';
        }
        // Winter
        else {
            return 'Winter';
        }
    }
    
    // Identify regions based on latitude/longitude
    identifyRegions(latitude, longitude) {
        if (latitude === undefined || latitude === null || 
            longitude === undefined || longitude === null) {
            return ['Unknown Region'];
        }
        
        const regions = [];
        
        // East Asia
        if (latitude >= 15 && latitude <= 45 && longitude >= 100 && longitude <= 145) {
            if (latitude >= 30 && latitude <= 45 && longitude >= 125 && longitude <= 145) {
                regions.push('Japan');
            }
            else if (latitude >= 15 && latitude <= 45 && longitude >= 100 && longitude <= 125) {
                regions.push('China');
            }
        }
        // Taiwan
        else if (latitude >= 22 && latitude <= 25 && longitude >= 120 && longitude <= 122) {
            regions.push('Taiwan');
        }
        // India
        else if (latitude >= 8 && latitude <= 35 && longitude >= 70 && longitude <= 95) {
            if (latitude >= 26 && latitude <= 28 && longitude >= 88 && longitude <= 93) {
                regions.push('Darjeeling');
            }
            else if (latitude >= 26 && latitude <= 27 && longitude >= 93 && longitude <= 95) {
                regions.push('Assam');
            }
            else {
                regions.push('India');
            }
        }
        // South America
        else if (latitude >= -55 && latitude <= 15 && longitude >= -80 && longitude <= -35) {
            regions.push('South America');
        }
        // Africa
        else if (latitude >= -35 && latitude <= 35 && longitude >= -15 && longitude <= 50) {
            regions.push('Africa');
        }
        // Default
        else {
            regions.push('Other Region');
        }
        
        return regions;
    }
} 