    // Component Contribution Analysis
    const componentAnalysis = document.createElement('div');
    componentAnalysis.className = 'component-analysis';
    componentAnalysis.innerHTML = `
        <h3>Component Contribution Analysis</h3>
        <div class="component-breakdown">
            <div class="component">
                <h4>Tea Type Effects</h4>
                <div class="component-scores">
                    ${Object.entries(scoreProgression.withTeaTypeScores)
                        .map(([effect, score]) => `
                            <div class="score-item">
                                <span class="effect-name">${effect}</span>
                                <span class="score-value">${score.toFixed(2)}</span>
                            </div>
                        `).join('')}
                </div>
            </div>
            <div class="component">
                <h4>Processing Effects</h4>
                <div class="component-scores">
                    ${Object.entries(scoreProgression.withProcessingScores)
                        .map(([effect, score]) => `
                            <div class="score-item">
                                <span class="effect-name">${effect}</span>
                                <span class="score-value">${(score - (scoreProgression.withTeaTypeScores[effect] || 0)).toFixed(2)}</span>
                            </div>
                        `).join('')}
                </div>
            </div>
            <div class="component">
                <h4>Geography Effects</h4>
                <div class="component-scores">
                    ${Object.entries(scoreProgression.withGeographyScores)
                        .map(([effect, score]) => `
                            <div class="score-item">
                                <span class="effect-name">${effect}</span>
                                <span class="score-value">${(score - (scoreProgression.withProcessingScores[effect] || 0)).toFixed(2)}</span>
                            </div>
                        `).join('')}
                </div>
            </div>
            <div class="component">
                <h4>Seasonal Effects</h4>
                <div class="component-scores">
                    ${Object.entries(scoreProgression.withSeasonalScores)
                        .map(([effect, score]) => `
                            <div class="score-item">
                                <span class="effect-name">${effect}</span>
                                <span class="score-value">${(score - (scoreProgression.withGeographyScores[effect] || 0)).toFixed(2)}</span>
                            </div>
                        `).join('')}
                </div>
            </div>
            <div class="component">
                <h4>Flavor Effects</h4>
                <div class="component-scores">
                    ${Object.entries(scoreProgression.withFlavorScores)
                        .map(([effect, score]) => `
                            <div class="score-item">
                                <span class="effect-name">${effect}</span>
                                <span class="score-value">${(score - (scoreProgression.withSeasonalScores[effect] || 0)).toFixed(2)}</span>
                            </div>
                        `).join('')}
                </div>
            </div>
            <div class="component">
                <h4>Compound Effects</h4>
                <div class="component-scores">
                    ${Object.entries(scoreProgression.withCompoundScores)
                        .map(([effect, score]) => `
                            <div class="score-item">
                                <span class="effect-name">${effect}</span>
                                <span class="score-value">${(score - (scoreProgression.withFlavorScores[effect] || 0)).toFixed(2)}</span>
                            </div>
                        `).join('')}
                </div>
            </div>
        </div>
    `; 