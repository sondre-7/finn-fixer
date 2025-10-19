# Finn.no Grid Layout Fixer

A Firefox extension that improves the grid layout on finn.no by:
1. Making the filters section collapsible (hidden by default, click to expand)
2. Adjusting column spans for better layout
3. Changing result list from 3 columns to 2 columns on medium screens

## Installation

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on"
4. Navigate to this directory and select `manifest.json`

## Usage

Once installed, navigate to any finn.no page. The extension will automatically:
- Hide the filters section (click the "Filter" heading to expand/collapse)
- Adjust the grid layout for better viewing
- Display results in a 2-column grid instead of 3

## Files

- `manifest.json` - Extension configuration
- `content.js` - DOM modification script
- `styles.css` - Custom styling
- `icons/` - Extension icons

