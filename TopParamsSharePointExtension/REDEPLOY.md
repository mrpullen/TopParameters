# Quick Redeploy Instructions

The updated package is ready at:
**sharepoint\solution\top-params-sharepoint-extension.sppkg**

## Using SharePoint UI (Recommended)

1. Go to: https://043.sharepoint.com/sites/test/_layouts/15/tenantAppCatalog.aspx?app=SiteApps
2. Upload the new **top-params-sharepoint-extension.sppkg** file (it will ask to replace)
3. Click "Replace" when prompted
4. Refresh your SharePoint page

## Using M365 CLI

```powershell
cd "c:\Users\mipullen\Desktop\TopParameters\TopParamsSharePointExtension"

# Upload (replace existing)
m365 spo app add --filePath ".\sharepoint\solution\top-params-sharepoint-extension.sppkg" --appCatalogScope sitecollection --appCatalogUrl "https://043.sharepoint.com/sites/test" --overwrite

# Deploy
m365 spo app deploy --name "top-params-sharepoint-extension-client-side-solution" --appCatalogScope sitecollection --appCatalogUrl "https://043.sharepoint.com/sites/test"
```

## Verification

1. Navigate to: https://043.sharepoint.com/sites/test
2. Open browser console (F12)
3. Look for this LARGE GREEN message:
   ```
   [TopParams SPFx] Extension is ACTIVE!
   ```
4. Check for detailed logs:
   ```
   [TopParams SPFx] EXTENSION LOADING...
   [TopParams SPfx] Page URL: ...
   [TopParams SPFx] ✓ PostMessage listener installed
   ```

## Troubleshooting

If you don't see the green message:
- Hard refresh: Ctrl+Shift+R
- Clear browser cache
- Check if app is deployed in Site Contents
- Verify extension is activated: Site Settings → Manage site features

The extension now logs IMMEDIATELY when it loads, so you'll know right away if it's working!
