@echo off
REM Build and Package Script for TopParameters PCF Control and Solution
REM This script builds the PCF control and packages it into the Power Platform solution

echo ======================================
echo TopParameters - Build and Package
echo ======================================
echo.

setlocal enabledelayedexpansion

REM Step 1: Build PCF Control
echo Step 1: Building PCF Control...
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
cd ..
echo.

REM Step 2: Package Solution
echo Step 2: Packaging Power Platform Solution...
cd TopParamsSolution

where dotnet >nul 2>&1
if %errorlevel% equ 0 (
    echo Building solution with dotnet...
    dotnet build TopParamsSolution.cdsproj --configuration Release
    
    if errorlevel 1 (
        echo [ERROR] Solution packaging failed
        goto :error
    )
    
    echo [SUCCESS] Solution packaged successfully
    
    REM Show output files
    echo.
    echo Output files:
    dir /b bin\Release\*.zip 2>nul || dir /b bin\Debug\*.zip 2>nul || echo No zip files found
) else (
    echo [ERROR] dotnet CLI not found. Please install .NET SDK
    goto :error
)

cd ..
echo.

REM Summary
echo ======================================
echo Build Complete!
echo ======================================
echo.
echo Solution package location:
echo   TopParamsSolution\bin\Release\TopParamsSolution.zip
echo   (or bin\Debug\ if Release build not available)
echo.
echo This solution includes:
echo   - TopParamsControlV2.TopParamsReader PCF control
echo   - Ready to import into Power Apps environment
echo.

goto :end

:error
echo.
echo [ERROR] Build failed!
cd /d %~dp0
exit /b 1

:end
cd /d %~dp0
endlocal
