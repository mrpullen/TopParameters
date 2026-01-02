@echo off
REM Local Build Script for TopParameters (Windows)
REM This script builds both components locally for testing before creating a release

echo ======================================
echo TopParameters Local Build Script
echo ======================================
echo.

setlocal enabledelayedexpansion

REM Create release directory
set RELEASE_DIR=local-release
if exist "%RELEASE_DIR%" rmdir /s /q "%RELEASE_DIR%"
mkdir "%RELEASE_DIR%"

REM Build PCF Control
echo Building PCF Control...
cd TopParamsComplete

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 goto :error
)

echo Building PCF...
call npm run build
if errorlevel 1 (
    echo [ERROR] PCF build failed
    goto :error
)

echo [SUCCESS] PCF Control built successfully

REM Copy artifacts
if exist "out\controls" (
    xcopy /E /I /Y "out\controls" "..\%RELEASE_DIR%\pcf-control"
    echo   Artifacts copied to %RELEASE_DIR%\pcf-control
) else (
    echo [ERROR] PCF output directory not found
    goto :error
)

cd ..
echo.

REM Build SPFx Extension
echo Building SPFx Extension...
cd TopParamsSharePointExtension

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 goto :error
)

echo Building and packaging SPFx...
call npm run ship
if errorlevel 1 (
    echo [ERROR] SPFx build failed
    goto :error
)

echo [SUCCESS] SPFx Extension built successfully

REM Copy artifacts
if exist "sharepoint\solution" (
    mkdir "..\%RELEASE_DIR%\spfx-extension" 2>nul
    copy "sharepoint\solution\*.sppkg" "..\%RELEASE_DIR%\spfx-extension\" >nul 2>&1
    echo   Package copied to %RELEASE_DIR%\spfx-extension
) else (
    echo [ERROR] SPFx output directory not found
    goto :error
)

cd ..
echo.

REM Create zip files (if PowerShell is available)
echo Creating release packages...
where powershell >nul 2>&1
if %errorlevel% equ 0 (
    powershell -Command "Compress-Archive -Path '%RELEASE_DIR%\pcf-control\*' -DestinationPath '%RELEASE_DIR%\TopParamsComplete-PCF.zip' -Force"
    powershell -Command "Compress-Archive -Path '%RELEASE_DIR%\spfx-extension\*' -DestinationPath '%RELEASE_DIR%\TopParamsSharePointExtension-SPFx.zip' -Force"
    
    REM Create combined package
    mkdir "%RELEASE_DIR%\TopParameters-Complete" 2>nul
    xcopy /E /I /Y "%RELEASE_DIR%\pcf-control" "%RELEASE_DIR%\TopParameters-Complete\pcf-control" >nul
    xcopy /E /I /Y "%RELEASE_DIR%\spfx-extension" "%RELEASE_DIR%\TopParameters-Complete\spfx-extension" >nul
    copy "PCF-DEPLOYMENT-GUIDE.md" "%RELEASE_DIR%\TopParameters-Complete\" >nul 2>&1
    copy "TopParamsSharePointExtension\DEPLOYMENT.md" "%RELEASE_DIR%\TopParameters-Complete\SPFx-DEPLOYMENT.md" >nul 2>&1
    powershell -Command "Compress-Archive -Path '%RELEASE_DIR%\TopParameters-Complete\*' -DestinationPath '%RELEASE_DIR%\TopParameters-Complete.zip' -Force"
    
    echo [SUCCESS] Packages created:
    echo   - TopParamsComplete-PCF.zip
    echo   - TopParamsSharePointExtension-SPFx.zip
    echo   - TopParameters-Complete.zip
) else (
    echo [WARNING] PowerShell not found, skipping package creation
)

REM Summary
echo.
echo ======================================
echo Build Complete!
echo ======================================
echo.
echo Build artifacts are in: %RELEASE_DIR%\
echo.
echo Next steps:
echo 1. Test the PCF control in your Power Apps environment
echo 2. Test the SPFx extension in SharePoint
echo 3. If everything works, create a release:
echo    git tag v1.0.0 ^&^& git push origin v1.0.0
echo.

goto :end

:error
echo.
echo [ERROR] Build failed!
exit /b 1

:end
endlocal
