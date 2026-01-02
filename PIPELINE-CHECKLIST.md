# Pipeline Setup Checklist

Use this checklist to verify your CI/CD pipeline is ready to use.

## ✅ Pre-Deployment Checklist

### Repository Setup
- [ ] Repository is hosted on GitHub
- [ ] You have push access to the repository
- [ ] GitHub Actions is enabled (Settings → Actions → Allow all actions)

### Local Environment
- [ ] Node.js 18.x is installed
- [ ] npm is available
- [ ] Git is configured with your credentials

### Project Files
- [ ] `TopParamsComplete/package.json` exists
- [ ] `TopParamsSharePointExtension/package.json` exists
- [ ] Both projects can build locally

## ✅ Pipeline Files Verification

### Workflow Files
- [x] `.github/workflows/ci.yml` - CI workflow
- [x] `.github/workflows/build-and-release.yml` - Release workflow
- [x] `.github/workflows/README.md` - Pipeline documentation

### Build Scripts
- [x] `build-local.sh` - Linux/Mac build script (executable)
- [x] `build-local.bat` - Windows build script

### Documentation
- [x] `BUILD-RELEASE-GUIDE.md` - Quick reference guide
- [x] `PIPELINE-SUMMARY.md` - Complete overview
- [x] `.gitignore` - Root git ignore file

## ✅ Testing the Pipeline

### Step 1: Test Local Build
```bash
# Linux/Mac
./build-local.sh

# Windows
build-local.bat
```
- [ ] PCF build completes successfully
- [ ] SPFx build completes successfully
- [ ] `local-release/` folder is created with artifacts

### Step 2: Test CI Workflow
```bash
# Make a small change and push
git add .
git commit -m "test: verify CI pipeline"
git push origin main
```
- [ ] Go to GitHub Actions tab
- [ ] CI workflow runs automatically
- [ ] Both build jobs (PCF and SPFx) pass
- [ ] Artifacts are uploaded

### Step 3: Test Release Workflow
```bash
# Create a test release
git tag v0.0.1-test
git push origin v0.0.1-test
```
- [ ] Release workflow runs
- [ ] Both builds complete successfully
- [ ] GitHub Release is created
- [ ] All artifacts are attached to release:
  - [ ] TopParamsComplete-PCF.zip
  - [ ] TopParamsSharePointExtension-SPFx.zip
  - [ ] TopParameters-Complete.zip
  - [ ] .sppkg file

### Step 4: Cleanup Test Release
```bash
# Delete test tag
git tag -d v0.0.1-test
git push origin :refs/tags/v0.0.1-test
```
- [ ] Delete the test release from GitHub Releases page

## ✅ Production Release Checklist

Before creating your first production release:

### Version Numbers
- [ ] Update PCF version in `TopParamsComplete/TopParamsReader/ControlManifest.Input.xml`
- [ ] Update SPFx version in `TopParamsSharePointExtension/config/package-solution.json`
- [ ] Update package.json versions if needed
- [ ] Versions follow semantic versioning (e.g., v1.0.0)

### Code Quality
- [ ] All tests pass (if you have tests)
- [ ] Code has been reviewed
- [ ] Documentation is up to date
- [ ] CHANGELOG is updated (if you have one)

### Release Process
```bash
# 1. Final commit
git add .
git commit -m "Release v1.0.0"
git push origin main

# 2. Create and push tag
git tag v1.0.0
git push origin v1.0.0

# 3. Wait for workflow (check Actions tab)

# 4. Verify release on Releases page
```

- [ ] Tag created with correct version
- [ ] Workflow completed successfully
- [ ] Release published on GitHub
- [ ] All artifacts present and downloadable
- [ ] Release notes are accurate

## ✅ Post-Release Verification

### Download & Test
- [ ] Download TopParamsComplete-PCF.zip
- [ ] Verify PCF control imports correctly
- [ ] Download .sppkg file
- [ ] Verify SPFx package uploads to SharePoint

### Communication
- [ ] Notify team of new release
- [ ] Update deployment documentation if needed
- [ ] Share release notes with stakeholders

## ✅ Ongoing Maintenance

### Regular Tasks
- [ ] Monitor workflow runs in Actions tab
- [ ] Review and fix failed builds promptly
- [ ] Keep dependencies updated
- [ ] Archive old releases if needed

### Best Practices
- [ ] Use semantic versioning consistently
- [ ] Write meaningful commit messages
- [ ] Tag releases with descriptive notes
- [ ] Keep documentation in sync with code

## 🚀 Quick Commands Reference

### Create Release
```bash
git tag v1.0.0 && git push origin v1.0.0
```

### Build Locally
```bash
# Linux/Mac
./build-local.sh

# Windows
build-local.bat
```

### Check Workflow Status
```bash
# View in browser
gh run list  # if GitHub CLI is installed

# Or visit: https://github.com/mrpullen/TopParameters/actions
```

### Manual Workflow Trigger
1. Go to Actions tab
2. Select "Build and Release"
3. Click "Run workflow"
4. Select branch and run

## 📋 Troubleshooting

### Build Fails
- [ ] Check Actions tab for error logs
- [ ] Verify Node.js version (should be 18.x)
- [ ] Ensure dependencies are correctly specified
- [ ] Test build locally first

### Release Not Created
- [ ] Verify tag starts with 'v'
- [ ] Check that tag is pushed to repository
- [ ] Ensure both build jobs passed
- [ ] Review workflow permissions

### Missing Artifacts
- [ ] Check build logs for errors
- [ ] Verify output paths in workflow
- [ ] Ensure builds completed successfully
- [ ] Check artifact upload steps

## ✨ Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [PCF Documentation](https://docs.microsoft.com/power-apps/developer/component-framework/overview)
- [SPFx Documentation](https://docs.microsoft.com/sharepoint/dev/spfx/sharepoint-framework-overview)
- [Semantic Versioning](https://semver.org/)

---

**Status:** Pipeline setup complete and ready for use! ✅
