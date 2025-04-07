/**
 * Utility functions for formatting markdown output in debug views
 */

/**
 * Converts an object to a formatted markdown representation
 * @param {Object} obj - The object to convert
 * @param {number} indentLevel - The current indent level (default: 0)
 * @returns {string} Formatted markdown string
 */
export function objectToMarkdown(obj, indentLevel = 0) {
    if (obj === null || obj === undefined) return 'null';
    
    const indent = '  '.repeat(indentLevel);
    let markdown = '';
    
    // Handle different types
    if (Array.isArray(obj)) {
        if (obj.length === 0) return '[]';
        
        markdown += '\n';
        obj.forEach((item, index) => {
            markdown += `${indent}- ${formatValue(item, indentLevel + 1)}\n`;
        });
        return markdown;
    } else if (typeof obj === 'object') {
        if (Object.keys(obj).length === 0) return '{}';
        
        markdown += '\n';
        for (const [key, value] of Object.entries(obj)) {
            markdown += `${indent}- **${key}**: ${formatValue(value, indentLevel + 1)}\n`;
        }
        return markdown;
    } else {
        return String(obj);
    }
}

/**
 * Format a value for markdown display, handling nested objects and arrays
 * @param {*} value - The value to format
 * @param {number} indentLevel - The current indent level
 * @returns {string} Formatted value
 */
function formatValue(value, indentLevel) {
    if (value === null || value === undefined) {
        return 'null';
    } else if (typeof value === 'object') {
        return objectToMarkdown(value, indentLevel);
    } else if (typeof value === 'number') {
        return value.toString();
    } else if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
    } else {
        return `${value}`;
    }
}

/**
 * Creates a markdown table from an array of objects
 * @param {Array<Object>} data - Array of objects with the same structure
 * @returns {string} Markdown table
 */
export function createMarkdownTable(data) {
    if (!Array.isArray(data) || data.length === 0) {
        return '*No data available*';
    }
    
    // Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // Build header row
    let table = '| ' + headers.join(' | ') + ' |\n';
    table += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
    
    // Build data rows
    data.forEach(item => {
        const row = headers.map(header => {
            const value = item[header];
            if (value === null || value === undefined) {
                return '';
            } else if (typeof value === 'object') {
                return JSON.stringify(value);
            } else {
                return String(value);
            }
        });
        table += '| ' + row.join(' | ') + ' |\n';
    });
    
    return table;
}

/**
 * Formats a score (0-10) with a visual bar
 * @param {number} score - Score value (0-10)
 * @param {number} maxScore - Maximum score value (default: 10)
 * @returns {string} Markdown representation of the score with a bar
 */
export function formatScoreWithBar(score, maxScore = 10) {
    if (typeof score !== 'number') return 'N/A';
    
    const normalizedScore = Math.min(Math.max(0, score), maxScore);
    const percentage = (normalizedScore / maxScore) * 100;
    const barLength = Math.round(percentage / 10);
    
    const filledBar = '█'.repeat(barLength);
    const emptyBar = '░'.repeat(10 - barLength);
    
    return `${score.toFixed(1)} ${filledBar}${emptyBar}`;
}

/**
 * Creates an expandable section in markdown
 * @param {string} title - The section title
 * @param {string} content - The content to include in the details
 * @returns {string} Markdown for expandable section
 */
export function createExpandableSection(title, content) {
    return `<details>
<summary>${title}</summary>

${content}
</details>`;
}

/**
 * Escapes markdown special characters in a string
 * @param {string} text - The text to escape
 * @returns {string} Escaped text
 */
export function escapeMarkdown(text) {
    if (typeof text !== 'string') return String(text);
    
    return text
        .replace(/\*/g, '\\*')
        .replace(/_/g, '\\_')
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/\#/g, '\\#')
        .replace(/\>/g, '\\>')
        .replace(/\|/g, '\\|');
} 