# Deploy SPFx Extension Script

Write-Host "TopParams SPFx Extension Deployment" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Step 1: Build the solution
Write-Host "`n[1/5] Building SPFx solution..." -ForegroundColor Yellow
Set-Location "c:\Users\mipullen\Desktop\TopParameters\TopParamsSharePointExtension"

Write-Host "Running npm install (if needed)..." -ForegroundColor Gray
npm install

Write-Host "Bundling for production..." -ForegroundColor Gray
npx gulp bundle --ship

Write-Host "Packaging solution..." -ForegroundColor Gray
npx gulp package-solution --ship

# Step 2: Login to M365
Write-Host "`n[2/5] Logging into Microsoft 365..." -ForegroundColor Yellow
m365 login --authType browser

# Step 3: Enable site collection app catalog
Write-Host "`n[3/5] Enabling site collection app catalog..." -ForegroundColor Yellow
m365 spo site appcatalog add --url "https://043.sharepoint.com/sites/test"

# Step 4: Upload the app
Write-Host "`n[4/5] Uploading SPFx package..." -ForegroundColor Yellow
$packagePath = ".\sharepoint\solution\top-params-sharepoint-extension.sppkg"
m365 spo app add --filePath $packagePath --appCatalogScope sitecollection --appCatalogUrl "https://043.sharepoint.com/sites/test" --overwrite

# Step 5: Deploy the app
Write-Host "`n[5/5] Deploying the app..." -ForegroundColor Yellow
m365 spo app deploy --name "top-params-sharepoint-extension-client-side-solution" --appCatalogScope sitecollection --appCatalogUrl "https://043.sharepoint.com/sites/test"

Write-Host "`nDeployment complete!" -ForegroundColor Green
Write-Host "The extension is now active on: https://043.sharepoint.com/sites/test" -ForegroundColor Cyan
Write-Host "Open browser console and look for TopParams SPFx messages" -ForegroundColor Gray
