# PCF Control and Solution Build Guide

## Quick Build Commands

### Build Everything (Recommended)
```bash
# Linux/Mac
./build-solution.sh

# Windows
build-solution.bat
```

This builds:
1. PCF Control (TopParamsComplete)
2. Power Platform Solution Package (TopParamsSolution.zip)

**Output:** `TopParamsSolution/bin/Release/TopParamsSolution.zip`

### Build Individual Components

#### PCF Control Only
```bash
cd TopParamsComplete
npm run build
```
**Output:** `TopParamsComplete/out/controls/`

#### Solution Package Only
```bash
cd TopParamsSolution
dotnet build TopParamsSolution.cdsproj --configuration Release
```
**Output:** `TopParamsSolution/bin/Release/TopParamsSolution.zip`

## What Gets Packaged

The **TopParamsSolution.zip** includes:
- ✅ TopParamsControlV2.TopParamsReader PCF control
- ✅ Solution metadata and configuration
- ✅ Ready to import into any Power Apps environment

## Deployment

### Import Solution into Power Apps

1. **Download the solution package**
   - Build locally: `TopParamsSolution/bin/Release/TopParamsSolution.zip`
   - Or download from GitHub Releases

2. **Import to Power Apps**
   - Go to [Power Apps](https://make.powerapps.com)
   - Select your environment
   - Go to **Solutions** → **Import solution**
   - Upload `TopParamsSolution.zip`
   - Follow the import wizard
   - Click **Import**

3. **Use the PCF control**
   - The control will be available as `TopParamsReader`
   - Add it to Canvas Apps or Model-Driven Apps
   - Configure the `showDetails` property to control visibility

## CI/CD Pipeline Integration

The build pipeline automatically:
1. Builds the PCF control
2. Packages it into the Power Platform solution
3. Creates releases with `TopParamsSolution.zip`

### Automatic Builds

- **CI builds:** Every push to main/develop
- **Release builds:** When you push a version tag

### Create a Release

```bash
# Update version in manifests
git add .
git commit -m "Release v1.0.0"
git tag v1.0.0
git push origin main --tags
```

GitHub Actions will automatically:
- Build PCF control
- Package the solution
- Create a release with TopParamsSolution.zip

## Version Management

Update versions before releasing:

1. **PCF Control:** `TopParamsComplete/TopParamsReader/ControlManifest.Input.xml`
   ```xml
   <control ... version="1.0.0" ... >
   ```

2. **Solution:** `TopParamsSolution/src/Other/Solution.xml`
   ```xml
   <Version>1.0.0</Version>
   ```

## Troubleshooting

### Build Fails

**PCF build error:**
```bash
# Clean and rebuild
cd TopParamsComplete
npm run rebuild
```

**Solution package error:**
```bash
# Clean build
cd TopParamsSolution
dotnet clean
dotnet build --configuration Release
```

### Import Fails

- Ensure the target environment supports PCF controls
- Check that you have appropriate permissions
- Try importing as an unmanaged solution first

### Missing PCF Control

If the control isn't in the solution:
1. Ensure PCF was built first: `cd TopParamsComplete && npm run build`
2. Check that `out/controls/` directory exists
3. Rebuild solution: `cd TopParamsSolution && dotnet build`

## Files Created

- `build-solution.sh` - Linux/Mac build script
- `build-solution.bat` - Windows build script
- `.github/workflows/build-and-release.yml` - Updated with solution packaging

## Next Steps

1. ✅ PCF control updated and built
2. ✅ Solution packaged with PCF control
3. ✅ Build scripts created
4. ✅ CI/CD pipeline updated

**Ready to deploy!** Use `./build-solution.sh` to build, then import `TopParamsSolution.zip` into Power Apps.
