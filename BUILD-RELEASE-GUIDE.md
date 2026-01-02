# TopParameters - Build & Release Guide

This repository includes automated CI/CD pipelines for building and releasing the PCF Control and SPFx Extension.

## Quick Start

### Create a Release

```bash
# 1. Update version numbers in manifest files
# 2. Commit your changes
git add .
git commit -m "Release v1.0.0"

# 3. Create and push a tag
git tag v1.0.0
git push origin main --tags

# 4. GitHub Actions will automatically:
#    - Build both components
#    - Create a release with downloadable packages
#    - Make artifacts available on the Releases page
```

### Download Latest Release

Visit the [Releases page](../../releases) to download:
- **TopParamsComplete-PCF.zip** - PCF Control
- **TopParamsSharePointExtension-SPFx.zip** - SPFx Extension  
- **top-params-sharepoint-extension.sppkg** - Ready-to-deploy SharePoint package
- **TopParameters-Complete.zip** - Everything bundled together

## Build Workflows

### CI Build (Automatic)
- **Triggers:** Push or PR to `main`/`develop` branches
- **Purpose:** Validate builds on every change
- **Artifacts:** Available for 7 days

### Release Build (Automatic)
- **Triggers:** Tags starting with `v` (e.g., `v1.0.0`)
- **Purpose:** Create production releases
- **Artifacts:** Permanently available on Releases page

## Manual Builds

### PCF Control
```bash
cd TopParamsComplete
npm install
npm run build
```
Output: `TopParamsComplete/out/controls/`

### SPFx Extension
```bash
cd TopParamsSharePointExtension
npm install
npm run ship
```
Output: `TopParamsSharePointExtension/sharepoint/solution/*.sppkg`

## Deployment

See detailed deployment instructions:
- PCF Control: [PCF-DEPLOYMENT-GUIDE.md](PCF-DEPLOYMENT-GUIDE.md)
- SPFx Extension: [TopParamsSharePointExtension/DEPLOYMENT.md](TopParamsSharePointExtension/DEPLOYMENT.md)

## Pipeline Documentation

For detailed information about the CI/CD pipelines, see [.github/workflows/README.md](.github/workflows/README.md)

## Project Structure

```
TopParameters/
├── .github/workflows/          # CI/CD pipelines
│   ├── ci.yml                  # Continuous integration
│   ├── build-and-release.yml   # Release automation
│   └── README.md               # Pipeline documentation
├── TopParamsComplete/          # PCF Control project
├── TopParamsSharePointExtension/ # SPFx Extension project
└── TopParamsSolution/          # Power Platform solution
```

## Version Management

Before creating a release, update version numbers in:

1. **PCF Control:** `TopParamsComplete/TopParamsReader/ControlManifest.Input.xml`
   ```xml
   <control ... version="1.0.0" ... >
   ```

2. **SPFx Extension:** `TopParamsSharePointExtension/config/package-solution.json`
   ```json
   "version": "1.0.0.0"
   ```

## Support

- **Build Issues:** Check the Actions tab for build logs
- **Deployment Issues:** See deployment guides in respective folders
- **Questions:** Create an issue in this repository
