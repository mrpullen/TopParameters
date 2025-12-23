# Remove/Deactivate SPFx Extension from Site

Write-Host "Deactivating TopParams SPFx Extension" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

$siteUrl = "https://043.sharepoint.com/sites/test"
$extensionId = "e3b4c5d6-7e8f-9a0b-1c2d-3e4f5a6b7c8d"

Write-Host "`nConnecting to site..." -ForegroundColor Yellow
Connect-PnPOnline -Url $siteUrl -ClientId  8c867a4f-0e56-48e3-9ff5-dc4845265aa9 -Interactive

Write-Host "`nRemoving extension registration..." -ForegroundColor Yellow
$customActions = Get-PnPCustomAction -Scope Site | Where-Object { $_.ClientSideComponentId -eq $extensionId }

if ($customActions) {
    foreach ($action in $customActions) {
        Write-Host "Removing: $($action.Name)" -ForegroundColor Gray
        Remove-PnPCustomAction -Identity $action.Id -Scope Site -Force
    }
    Write-Host "✓ Extension deactivated" -ForegroundColor Green
} else {
    Write-Host "Extension was not registered" -ForegroundColor Yellow
}
