# Build Pipelines Documentation

This repository contains GitHub Actions workflows for automated building and releasing of the TopParameters components.

## Workflows

### 1. CI Build (`ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**What it does:**
- Builds both the PCF Control and SPFx Extension
- Uploads artifacts for 7 days
- Provides quick feedback on build status

**Artifacts:**
- `pcf-control-{commit-sha}` - PCF control build output
- `spfx-extension-{commit-sha}` - SPFx package (.sppkg)

### 2. Build and Release (`build-and-release.yml`)

**Triggers:**
- Push to `main` branch
- Git tags starting with `v` (e.g., `v1.0.0`)
- Manual workflow dispatch
- Pull requests to `main`

**What it does:**
- Builds both components
- For tagged releases: Creates a GitHub Release with downloadable packages
- Packages components into convenient zip files

**Release Artifacts:**
- `TopParamsComplete-PCF.zip` - PCF control ready for import
- `TopParamsSharePointExtension-SPFx.zip` - SPFx extension package
- `TopParameters-Complete.zip` - Combined package with documentation
- `*.sppkg` - Individual SharePoint package file

## Creating a Release

To create a new release:

1. **Update version numbers:**
   - PCF: Update version in `TopParamsComplete/TopParamsReader/ControlManifest.Input.xml`
   - SPFx: Update version in `TopParamsSharePointExtension/config/package-solution.json`

2. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Bump version to 1.0.0"
   git push origin main
   ```

3. **Create and push a tag:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

4. **Wait for workflow:**
   - GitHub Actions will automatically build both components
   - A new release will be created with all artifacts
   - Check the "Actions" tab for progress

## Manual Workflow Trigger

You can manually trigger the build and release workflow:

1. Go to the "Actions" tab in GitHub
2. Select "Build and Release" workflow
3. Click "Run workflow"
4. Select the branch and click "Run workflow"

## Artifacts and Downloads

### From Pull Requests / CI Builds
- Artifacts are available for 7 days
- Download from the workflow run page
- Good for testing before release

### From Releases
- Artifacts are permanently available
- Download from the "Releases" page
- Production-ready packages

## Local Build Commands

### PCF Control
```bash
cd TopParamsComplete
npm install
npm run build
# Output: TopParamsComplete/out/controls/
```

### SPFx Extension
```bash
cd TopParamsSharePointExtension
npm install
npm run ship
# Output: TopParamsSharePointExtension/sharepoint/solution/*.sppkg
```

## Deployment

### PCF Control Deployment
1. Download `TopParamsComplete-PCF.zip` from the release
2. Follow instructions in `PCF-DEPLOYMENT-GUIDE.md`
3. Import into Power Apps environment

### SPFx Extension Deployment
1. Download the `.sppkg` file from the release
2. Upload to SharePoint App Catalog
3. Follow instructions in `TopParamsSharePointExtension/DEPLOYMENT.md`

## Troubleshooting

### Build Failures

**PCF Build Issues:**
- Ensure Node.js 18 is being used
- Check TypeScript compilation errors in workflow logs
- Verify `pcf-scripts` is correctly installed

**SPFx Build Issues:**
- Check for Node.js version compatibility (18.x recommended)
- Review gulp build errors in workflow logs
- Ensure all dependencies are properly installed

### Release Creation Issues

**Release not created:**
- Verify the tag starts with `v` (e.g., `v1.0.0`)
- Check that the tag is pushed to the repository
- Ensure both build jobs completed successfully

**Missing artifacts:**
- Check that both build jobs passed
- Review upload-artifact steps in workflow logs
- Verify output paths match expected locations

## Advanced: Power Platform Solution Build

The `build-solution` job in `build-and-release.yml` is a placeholder for building the complete Power Platform solution package. To enable this:

1. Install [Power Platform Build Tools](https://marketplace.visualstudio.com/items?itemName=microsoft-IsvExpTools.PowerPlatform-BuildTools)
2. Configure service principal authentication
3. Update the job to use PAC CLI or MSBuild

Example:
```yaml
- name: Install PAC CLI
  run: |
    dotnet tool install --global Microsoft.PowerApps.CLI.Tool

- name: Build Solution
  run: |
    pac solution pack --zipfile TopParamsSolution.zip --folder TopParamsSolution/src
```

## CI/CD Best Practices

1. **Version Tagging:** Use semantic versioning (vX.Y.Z)
2. **Testing:** Add test steps before building releases
3. **Branch Protection:** Require CI to pass before merging PRs
4. **Release Notes:** Update release body with meaningful changelog
5. **Artifact Cleanup:** Workflows auto-clean old artifacts (7 days for CI, permanent for releases)

## Environment Variables and Secrets

Currently, no secrets are required. If you need to add private npm packages or authentication:

1. Go to repository Settings → Secrets and variables → Actions
2. Add required secrets (e.g., `NPM_TOKEN`, `AZURE_CREDENTIALS`)
3. Reference in workflow: `${{ secrets.SECRET_NAME }}`
