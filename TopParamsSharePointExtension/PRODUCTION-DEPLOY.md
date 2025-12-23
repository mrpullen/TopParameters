# Production Deployment Guide

## Overview
This SPFx extension now includes an embedded Custom Action that will **automatically register** when deployed. No PowerShell scripts needed!

## What Changed
- Added `elements.xml` to define the Custom Action
- Set `skipFeatureDeployment: false` to enable feature activation
- Bumped version to 1.0.0.1
- Custom Action is now part of the solution package

## Deployment Steps

### 1. Upload to App Catalog
1. Navigate to your SharePoint App Catalog site
2. Go to **Apps for SharePoint** library
3. Upload `sharepoint/solution/top-params-sharepoint-extension.sppkg`
4. When prompted, check **"Make this solution available to all sites in the organization"**
5. Click **Deploy**

### 2. Add to Site Collection
1. Go to your target site collection (e.g., https://043.sharepoint.com/sites/test)
2. Navigate to **Site Contents**
3. Click **New** → **App**
4. Find **top-params-sharepoint-extension-client-side-solution**
5. Click **Add**

### 3. Activate the Feature
After adding the app to your site, the Custom Action will be **automatically registered** when you activate the feature:

1. Go to **Site Settings** → **Site Features**
2. Find **Top Params Listener Application Customizer**
3. Click **Activate**

**That's it!** The extension will now run on every page in the site.

### 4. Verify Installation
1. Refresh any page in the site collection
2. Open browser console (F12)
3. Look for the green banner:
   ```
   [TopParams SPFx] Extension is ACTIVE!
   ```

## Testing the Full Flow
1. Add URL parameters to a SharePoint page:
   ```
   https://043.sharepoint.com/sites/test/SitePage/Home.aspx?param1=test&param2=value
   ```

2. Embed a Canvas App with the TopParamsReader PCF control on that page

3. Check the console logs:
   - `[TopParams SPFx]` messages showing parameter broadcasting
   - `[TopParamsReader]` messages showing parameter receipt

## Deactivation (if needed)
To deactivate the extension:
1. **Site Settings** → **Site Features**
2. Find **Top Params Listener Application Customizer**
3. Click **Deactivate**

OR remove the app entirely:
1. **Site Contents**
2. Find **top-params-sharepoint-extension-client-side-solution**
3. Click **Remove**

## Production Considerations
- The Custom Action is scoped to **Site** level (applies to the entire site collection)
- `enableLogging` is set to `true` - consider setting to `false` for production
- Extension loads on every page automatically after feature activation
- No PowerShell execution required - pure SharePoint UI deployment

## Troubleshooting
If the extension doesn't load:
1. Verify the app was added to **Site Contents**
2. Check that the feature is **Activated** under Site Features
3. Clear browser cache and hard refresh (Ctrl+Shift+R)
4. Check browser console for any error messages
