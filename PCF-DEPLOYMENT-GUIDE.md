# PCF Control - Solution Package Deployment Guide

## Overview
The TopParamsReader PCF control has been packaged as a managed solution ready for production deployment.

## Solution Details
- **Solution Name:** TopParamsSolution
- **Control Name:** TopParamsReader
- **Namespace:** TopParamsControlV2
- **Version:** 0.0.5
- **Package Location:** `TopParamsSolution\bin\Release\TopParamsSolution.zip`

## What's Included
The solution package includes:
- TopParamsReader PCF control (version 0.0.5)
- Input properties: parameterName, showDetails
- Output properties: parameterValue, allParameters, isInIframe, errorMessage
- PostMessage API support for cross-origin communication
- Sends requests to both window.parent and window.top for nested iframe support

## Deployment Steps

### Option 1: Deploy via Power Platform Admin Center (Recommended for Production)

1. **Navigate to Power Platform Admin Center**
   - Go to https://admin.powerplatform.microsoft.com/
   - Select **Environments**
   - Choose your target environment

2. **Import Solution**
   - Click **Solutions** in the left navigation
   - Click **Import**
   - Click **Browse** and select `TopParamsSolution\bin\Release\TopParamsSolution.zip`
   - Click **Next**
   - Review the solution details
   - Click **Import**

3. **Wait for Import**
   - The import process will show progress
   - Wait for "Successfully imported solution" message

4. **Publish Customizations** (if needed)
   - After import, click **Publish All Customizations**

### Option 2: Deploy via Power Apps Maker Portal

1. **Navigate to Power Apps**
   - Go to https://make.powerapps.com
   - Select your target environment

2. **Import Solution**
   - Click **Solutions** in the left navigation
   - Click **Import solution**
   - Click **Browse** and select `TopParamsSolution\bin\Release\TopParamsSolution.zip`
   - Click **Next**
   - Click **Import**

3. **Verify Import**
   - Once imported, click on the solution name
   - Verify **TopParamsReader** control is listed under Components

### Option 3: Deploy via PAC CLI (For Automation/CI/CD)

```powershell
# Authenticate to the environment
pac auth create --url https://your-environment.crm.dynamics.com

# Import the solution
pac solution import --path "TopParamsSolution\bin\Release\TopParamsSolution.zip" --async

# Publish customizations
pac solution publish
```

## Using the Control

### In Canvas Apps
1. Open your Canvas App in edit mode
2. Click **Insert** → **Get more components**
3. Select **Code** tab
4. Find **TopParamsReader** (dev publisher)
5. Click **Import**
6. Add the control to your screen

### In Model-Driven Apps
1. Open a form in the form designer
2. Add a field to bind the control to (or use an existing text field)
3. Click **Component Library** → **Get more components**
4. Find **TopParamsReader**
5. Add to the form
6. Configure the control properties in the properties pane

## Configuration Properties

**Input Properties:**
- **parameterName** (optional): Specific URL parameter to retrieve
- **showDetails** (optional): Show detailed view (true) or compact view (false)

**Output Properties:**
- **parameterValue**: Value of the specified parameter
- **allParameters**: JSON string containing all URL parameters
- **isInIframe**: Boolean indicating if control is in an iframe
- **errorMessage**: Any error messages from the control

## Integration with SharePoint Extension

For the complete SharePoint → Canvas App parameter flow:

1. **Deploy this PCF control** to your Power Platform environment
2. **Deploy the SPFx extension** to your SharePoint site (see TopParamsSharePointExtension/PRODUCTION-DEPLOY.md)
3. **Add Canvas App** to SharePoint page with the TopParamsReader control
4. **Add URL parameters** to SharePoint page URL

The flow will be:
```
SharePoint URL (?param1=value1)
    ↓
SPFx Extension (broadcasts via postMessage)
    ↓
Nested Iframes (SharePoint → iframe → iframe)
    ↓
Canvas App receives parameters
    ↓
TopParamsReader PCF Control displays parameters
```

## Troubleshooting

**Control not appearing in component library:**
- Ensure solution import completed successfully
- Publish all customizations
- Refresh the Canvas App/Model-Driven App editor

**Control not receiving parameters:**
- Ensure SPFx extension is deployed and activated in SharePoint
- Check browser console for [TopParams SPFx] and [TopParamsReader] log messages
- Verify URL has parameters (e.g., ?param1=test)
- Clear browser cache and hard refresh (Ctrl+Shift+R)

**"Using postMessage API" message:**
- This is expected when embedded in SharePoint due to cross-origin restrictions
- Verify SPFx extension is broadcasting messages (check console logs)

## Updating the Control

To deploy a new version:

1. Update version in `TopParamsComplete\TopParamsReader\ControlManifest.Input.xml`
2. Rebuild: `cd TopParamsComplete; npm run build`
3. Rebuild solution: `cd ..\TopParamsSolution; dotnet build --configuration Release`
4. Import the new solution package following the deployment steps above

## Version History

- **0.0.5** - Added all input/output properties to manifest
- **0.0.4** - Enhanced postMessage to send to both window.parent and window.top
- **0.0.3** - Added bidirectional postMessage support
- **0.0.2** - Added retry logic and enhanced logging
- **0.0.1** - Initial release
