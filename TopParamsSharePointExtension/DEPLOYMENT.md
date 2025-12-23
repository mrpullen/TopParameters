# Deployment Instructions for TopParams SPFx Extension

## Step 1: Enable Site Collection App Catalog
```powershell
# Using PnP PowerShell
Connect-PnPOnline -Url "https://043.sharepoint.com/sites/test" -Interactive
Add-PnPSiteCollectionAppCatalog -Site "https://043.sharepoint.com/sites/test"
```

## Step 2: Build and Package the Solution
```powershell
cd "c:\Users\mipullen\Desktop\TopParameters\TopParamsSharePointExtension"
gulp bundle --ship
gulp package-solution --ship
```

## Step 3: Deploy to Site Collection
```powershell
# The .sppkg file will be at:
# sharepoint/solution/top-params-sharepoint-extension.sppkg

# Using PnP PowerShell
Add-PnPApp -Path ".\sharepoint\solution\top-params-sharepoint-extension.sppkg" -Scope Site -Overwrite
Install-PnPApp -Identity "top-params-sharepoint-extension-client-side-solution" -Scope Site
```

## Step 4: Activate the Extension on the Site
The extension will activate automatically on all pages in the site collection.

## Verification
1. Navigate to https://043.sharepoint.com/sites/test
2. Open browser console (F12)
3. Look for `[TopParams SPFx]` log messages
4. Add URL parameters like `?param1=value1&param2=value2`
5. Embed a Canvas App with TopParamsReader control
6. Watch the console for parameter exchange

## Alternative: Use SharePoint UI
1. Go to Site Contents → Site Collection App Catalog
2. Upload the .sppkg file
3. Deploy the solution
4. The extension will be active

## Troubleshooting
- Check console for `[TopParams SPFx]` messages
- Verify the app is deployed: Site Settings → Manage site features
- Check Site Contents for the app
