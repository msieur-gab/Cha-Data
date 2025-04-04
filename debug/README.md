# Tea Analysis Debug Environment

This directory contains a dedicated debugging environment for the Tea Analysis system. It provides an interactive, Jupyter notebook-like interface for testing and visualizing various aspects of the tea analysis calculations.

## Structure

```
debug/
├── components/     # Reusable web components for the debug UI
│   ├── TeaSidebar.js      # Sidebar component for tea selection
│   └── TestSection.js     # Component for individual test sections
├── css/           # Styles for the debug environment
│   └── debug-styles.css   # Main styles
├── js/            # JavaScript for the debug environment
│   ├── debug.js           # Main debug script
│   └── markdownUtils.js   # Utilities for markdown formatting
└── debug.html     # Main entry point
```

## Features

- **Tea Selection**: A sidebar allows selecting any tea from the database for analysis
- **Modular Test Sections**: Each calculation is shown in its own isolated section
- **Collapsible Raw Output**: Each section includes a collapsible raw output panel showing detailed results in markdown format
- **Visual Representation**: Results are displayed visually with charts and progress bars
- **Responsive Layout**: Works on both desktop and mobile devices

## Usage

1. Open `debug/debug.html` in a web browser
2. Select a tea from the dropdown in the sidebar
3. View the different analysis sections
4. Toggle the "Show Raw Output" button to see detailed results in markdown format

## Adding New Test Sections

To add a new test section:

1. Add a new section definition in `debug.js` inside the `generateTestSections` function:

```javascript
{
    title: 'Your New Test Section',
    render: () => renderYourNewSection(tea, config),
    output: getYourNewSectionOutput(tea, config)
}
```

2. Implement the render and output functions in `debug.js`

## Web Components

### `<test-section>`

A reusable component for displaying test results with a collapsible raw output panel.

```html
<test-section 
    title="Section Title" 
    content="<div>Your HTML content</div>" 
    raw-output="Your markdown output here">
</test-section>
```

### `<tea-sidebar>`

A component that displays a tea selection dropdown and tea details.

```html
<tea-sidebar></tea-sidebar>
```

## Markdown Utilities

The `markdownUtils.js` file provides helper functions for formatting the raw output panels:

- `objectToMarkdown`: Converts a JavaScript object to a formatted markdown representation
- `createMarkdownTable`: Creates a markdown table from an array of objects
- `formatScoreWithBar`: Formats a numeric score with a visual bar
- `createExpandableSection`: Creates an expandable details/summary section 