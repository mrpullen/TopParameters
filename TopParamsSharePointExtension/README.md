# Top Params SharePoint Extension

## Summary

This SPFx Application Customizer enables URL parameter communication between SharePoint pages and embedded Canvas Apps containing the TopParamsReader PCF control.

### Features

- Automatically listens for postMessage requests from embedded Canvas Apps
- Broadcasts URL parameters to all iframes on the page
- Detects newly added iframes and sends parameters automatically
- Comprehensive console logging with `[TopParams SPFx]` prefix
- Works with the TopParamsReader PCF control

## Installation

### Prerequisites

- Node.js (LTS version recommended)
- SharePoint Online tenant
- Admin access to deploy SPFx solutions

### Setup

```bash
# Install dependencies
npm install

# Build the solution
npm run build

# Bundle the solution
gulp bundle --ship

# Package the solution
gulp package-solution --ship
```

### Deploy

1. Upload the `.sppkg` file from `sharepoint/solution` folder to your App Catalog
2. Deploy the solution tenant-wide or to specific sites
3. The extension will automatically activate on SharePoint pages

## Usage

### In SharePoint

The extension runs automatically on all SharePoint pages. It will:
1. Listen for `requestUrlParams` postMessage events
2. Send URL parameters to requesting iframes
3. Broadcast parameters when new iframes are detected

### With Canvas Apps

1. Embed your Canvas App in a SharePoint page
2. Add the TopParamsReader PCF control to your Canvas App
3. The control will automatically request and receive URL parameters from the SharePoint page

### Console Logging

All activity is logged to the browser console with the `[TopParams SPFx]` prefix:
- Message reception and sending
- URL parameter extraction
- Iframe detection
- Error handling

### Disable Logging

To disable console logging, modify the extension properties in SharePoint:

```json
{
  "enableLogging": false
}
```

## Development

```bash
# Serve locally
gulp serve

# Clean build outputs
gulp clean
```

## Architecture

- **Application Customizer**: Runs on every SharePoint page
- **PostMessage API**: Secure cross-origin communication
- **MutationObserver**: Detects dynamically added iframes
- **Event Listeners**: Handles page visibility changes

## Compatibility

- SharePoint Online
- SharePoint Framework 1.19.0
- Modern SharePoint pages

## License

MIT

## Support

For issues or questions, check the console logs for detailed debugging information.
