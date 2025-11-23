# Finn.no Grid Layout Fixer

A browser extension that improves the product grid layout on finn.no by making filters collapsible and allowing customizable page width and column layouts.

## Features

- **Collapsible Filters**: Filters section is hidden by default with a clickable header to expand/collapse
- **Customizable Max Width**: Set your preferred maximum page container width (default: 1800px)
- **Customizable Column Layout**: Configure the number of columns displayed on medium screens (default: 2 columns)
- **Settings Popup**: Easy-to-use settings interface accessible from the extension toolbar icon

## Installation

### From Browser Stores

- **Firefox**: [Install from addons.mozilla.org](https://addons.mozilla.org) (coming soon)
- **Chrome**: [Install from Chrome Web Store](https://chrome.google.com/webstore) (coming soon)

### Manual Installation (Development)

#### Firefox
1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on..."
4. Select the `manifest.json` file from this directory

#### Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select this directory

## Usage

### Automatic Features

Once installed, the extension automatically applies improvements to finn.no pages:
- Filters section is collapsed by default
- Page container max-width is set to 1800px (customizable)
- Results display in 2 columns on medium screens (customizable)

### Customizing Settings

1. Click the extension icon in your browser toolbar
2. Adjust the settings:
   - **Max Width**: Set the maximum width of the page container (800-3000px)
   - **Medium Screen Columns**: Set the number of columns for screens ≥768px (minimum: 1)
3. Click "Save Settings"
4. Refresh the finn.no page to see your changes

### Using Filters

- Click the "Filters" header to expand/collapse the filters section
- The filters are hidden by default to give more screen space to results

## Browser Compatibility

- **Firefox**: 120.0 or higher
- **Chrome/Chromium**: Latest version (Manifest V3 compatible)
- **Edge**: Latest version (Chromium-based)

## Files

- `manifest.json` - Extension configuration and metadata
- `content.js` - Content script that modifies finn.no pages
- `styles.css` - Custom styling and CSS variable definitions
- `popup.html` - Settings popup interface
- `popup.js` - Settings popup logic and storage handling
- `popup.css` - Settings popup styling
- `icons/` - Extension icons (48x48 and 96x96)

## Privacy

This extension:
- Only runs on finn.no domains
- Stores settings locally in your browser (no data sent to external servers)
- Does not collect or transmit any personal information
- Does not track your browsing behavior

## Development

### Building for Distribution

Create a ZIP file excluding development files:
```bash
zip -r finn-fixer.zip . -x "*.git*" "*.DS_Store" "*.md" "LICENSE"
```

### Testing

1. Load the extension in your browser (see Manual Installation above)
2. Visit a finn.no search results page
3. Test the settings popup by clicking the extension icon
4. Verify settings persist after browser restart
5. Check browser console (F12) for any errors

## Version History

### 1.2
- Added customizable max-width setting
- Added customizable column layout setting
- Added settings popup interface
- Cross-browser compatibility improvements
- Persistent settings storage

### 1.0
- Initial release
- Collapsible filters
- Grid layout improvements

## License

See [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Support

If you encounter any issues or have feature requests, please open an issue on the project repository.
