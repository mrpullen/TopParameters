# Activate SPFx Extension on Site

Write-Host "Activating TopParams SPFx Extension" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Extension details
$siteUrl = "https://043.sharepoint.com/sites/test"
$extensionId = "e3b4c5d6-7e8f-9a0b-1c2d-3e4f5a6b7c8d"
$extensionTitle = "TopParams Listener"

Write-Host "`nConnecting to site..." -ForegroundColor Yellow
Connect-PnPOnline -Url $siteUrl -ClientId  8c867a4f-0e56-48e3-9ff5-dc4845265aa9 -Interactive

Write-Host "`nChecking if extension is already registered..." -ForegroundColor Yellow
$existingActions = Get-PnPCustomAction -Scope Site | Where-Object { $_.ClientSideComponentId -eq $extensionId }

if ($existingActions) {
    Write-Host "Extension already registered. Removing old registration..." -ForegroundColor Yellow
    foreach ($action in $existingActions) {
        Remove-PnPCustomAction -Identity $action.Id -Scope Site -Force
    }
}

Write-Host "`nRegistering Application Customizer..." -ForegroundColor Yellow
Add-PnPCustomAction -Name $extensionTitle `
    -Title $extensionTitle `
    -Location "ClientSideExtension.ApplicationCustomizer" `
    -ClientSideComponentId $extensionId `
    -ClientSideComponentProperties '{"enableLogging":true}' `
    -Scope Site

Write-Host "`n✓ Extension activated!" -ForegroundColor Green
Write-Host "`nVerifying activation..." -ForegroundColor Yellow

$customActions = Get-PnPCustomAction -Scope Site
$ourAction = $customActions | Where-Object { $_.ClientSideComponentId -eq $extensionId }

if ($ourAction) {
    Write-Host "✓ Extension is registered:" -ForegroundColor Green
    Write-Host "  Name: $($ourAction.Name)" -ForegroundColor Gray
    Write-Host "  Title: $($ourAction.Title)" -ForegroundColor Gray
    Write-Host "  Component ID: $($ourAction.ClientSideComponentId)" -ForegroundColor Gray
    Write-Host "  Location: $($ourAction.Location)" -ForegroundColor Gray
    Write-Host "`n✓ Extension will now load on every page!" -ForegroundColor Green
    Write-Host "`nRefresh your SharePoint page and check the console (F12)" -ForegroundColor Cyan
    Write-Host "You should see: [TopParams SPFx] EXTENSION LOADING..." -ForegroundColor Gray
} else {
    Write-Host "✗ Extension registration failed" -ForegroundColor Red
}
