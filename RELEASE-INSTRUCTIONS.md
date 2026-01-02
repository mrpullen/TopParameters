# How to Trigger a Release Build

## Step-by-Step Release Process

### 1. Commit Your Changes (if any)

```bash
cd /home/pullen/repos/TopParameters

# Check what's changed
git status

# Add all changes
git add .

# Commit with a message
git commit -m "Prepare for release v1.0.0"

# Push to main
git push origin main
```

### 2. Create and Push a Release Tag

```bash
# Create a tag (use semantic versioning: vMAJOR.MINOR.PATCH)
git tag v1.0.0

# Push the tag to GitHub
git push origin v1.0.0
```

**That's it!** GitHub Actions will automatically:
1. Build the PCF control
2. Build the SPFx extension
3. Build the Power Platform solution
4. Create a GitHub Release with all packages

### 3. Monitor the Build

1. Go to: https://github.com/mrpullen/TopParameters/actions
2. You should see a "Build and Release" workflow running
3. Click on it to see progress
4. Wait for all jobs to complete (typically 5-10 minutes)

### 4. Download the Release

Once the build completes:
1. Go to: https://github.com/mrpullen/TopParameters/releases
2. You'll see your new release (v1.0.0)
3. Download the files you need:
   - **TopParamsSolution.zip** - Power Platform solution (includes PCF control)
   - **top-params-sharepoint-extension.sppkg** - SharePoint package
   - **TopParameters-Complete.zip** - Everything bundled together

## What Gets Built

### Every Push (CI Build)
- PCF Control
- SPFx Extension
- **Power Platform Solution** ✨
- Artifacts available for 7 days

### Tagged Releases (v1.0.0, v2.0.0, etc.)
- Everything from CI build
- **Plus:** GitHub Release with permanent downloads
- **Plus:** Release notes
- **Plus:** Combined packages

## Testing Before Release

### Test Locally First
```bash
# Build everything locally
./build-solution.sh

# Check output
ls -lh TopParamsSolution/bin/Release/
# Should see: TopParamsSolution.zip
```

### Test with CI (No Release)
```bash
# Just push to main without a tag
git push origin main

# Check Actions tab to see if build succeeds
# Download artifacts from workflow run
```

### Create a Test Release
```bash
# Use a pre-release tag
git tag v1.0.0-beta
git push origin v1.0.0-beta

# Creates a release you can test
# Delete later if needed
```

## Version Numbering

Use [Semantic Versioning](https://semver.org/):
- **v1.0.0** - First production release
- **v1.0.1** - Bug fix
- **v1.1.0** - New feature (backward compatible)
- **v2.0.0** - Breaking change

### Pre-release Versions
- **v1.0.0-alpha** - Alpha version
- **v1.0.0-beta** - Beta version
- **v1.0.0-rc1** - Release candidate

## Troubleshooting

### Build Fails

**Check the logs:**
1. Go to Actions tab
2. Click on the failed workflow
3. Expand the failed job
4. Read error messages

**Common issues:**
- PCF build fails → Check TypeScript errors
- Solution build fails → Check .NET SDK version
- SPFx build fails → Check Node.js version

### Tag Already Exists

```bash
# Delete local tag
git tag -d v1.0.0

# Delete remote tag
git push origin :refs/tags/v1.0.0

# Create new tag
git tag v1.0.0
git push origin v1.0.0
```

### Cancel a Running Build

1. Go to Actions tab
2. Click on the running workflow
3. Click "Cancel workflow" button

## Quick Commands Reference

```bash
# Status check
git status

# Commit all changes
git add . && git commit -m "Release v1.0.0"

# Push changes
git push origin main

# Create and push tag
git tag v1.0.0 && git push origin v1.0.0

# View recent tags
git tag -l

# View releases
# Visit: https://github.com/mrpullen/TopParameters/releases
```

## What You Need Now

Since everything is already committed, you just need to:

```bash
cd /home/pullen/repos/TopParameters

# Create a release tag
git tag v1.0.0

# Push it
git push origin v1.0.0
```

Then watch the magic happen at:
https://github.com/mrpullen/TopParameters/actions

🎉 Your first release will be created automatically!
