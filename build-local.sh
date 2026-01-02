#!/bin/bash

# Local Build Script for TopParameters
# This script builds both components locally for testing before creating a release

set -e  # Exit on error

echo "======================================"
echo "TopParameters Local Build Script"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create release directory
RELEASE_DIR="local-release"
rm -rf "$RELEASE_DIR"
mkdir -p "$RELEASE_DIR"

# Build PCF Control
echo -e "${YELLOW}Building PCF Control...${NC}"
cd TopParamsComplete

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Building PCF..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ PCF Control built successfully${NC}"
    
    # Copy artifacts
    if [ -d "out/controls" ]; then
        cp -r out/controls "../$RELEASE_DIR/pcf-control"
        echo "  Artifacts copied to $RELEASE_DIR/pcf-control"
    else
        echo -e "${RED}✗ PCF output directory not found${NC}"
        exit 1
    fi
else
    echo -e "${RED}✗ PCF build failed${NC}"
    exit 1
fi

cd ..
echo ""

# Build SPFx Extension
echo -e "${YELLOW}Building SPFx Extension...${NC}"
cd TopParamsSharePointExtension

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Building and packaging SPFx..."
npm run ship

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ SPFx Extension built successfully${NC}"
    
    # Copy artifacts
    if [ -d "sharepoint/solution" ]; then
        mkdir -p "../$RELEASE_DIR/spfx-extension"
        cp sharepoint/solution/*.sppkg "../$RELEASE_DIR/spfx-extension/" 2>/dev/null || true
        echo "  Package copied to $RELEASE_DIR/spfx-extension"
    else
        echo -e "${RED}✗ SPFx output directory not found${NC}"
        exit 1
    fi
else
    echo -e "${RED}✗ SPFx build failed${NC}"
    exit 1
fi

cd ..
echo ""

# Create zip files
echo -e "${YELLOW}Creating release packages...${NC}"
cd "$RELEASE_DIR"

if command -v zip &> /dev/null; then
    zip -r TopParamsComplete-PCF.zip pcf-control/
    zip -r TopParamsSharePointExtension-SPFx.zip spfx-extension/
    
    # Create combined package
    mkdir -p TopParameters-Complete
    cp -r pcf-control TopParameters-Complete/
    cp -r spfx-extension TopParameters-Complete/
    cp ../PCF-DEPLOYMENT-GUIDE.md TopParameters-Complete/ 2>/dev/null || true
    cp ../TopParamsSharePointExtension/DEPLOYMENT.md TopParameters-Complete/SPFx-DEPLOYMENT.md 2>/dev/null || true
    zip -r TopParameters-Complete.zip TopParameters-Complete/
    
    echo -e "${GREEN}✓ Packages created:${NC}"
    echo "  - TopParamsComplete-PCF.zip"
    echo "  - TopParamsSharePointExtension-SPFx.zip"
    echo "  - TopParameters-Complete.zip"
else
    echo -e "${YELLOW}⚠ zip command not found, skipping package creation${NC}"
fi

cd ..

# Summary
echo ""
echo "======================================"
echo -e "${GREEN}Build Complete!${NC}"
echo "======================================"
echo ""
echo "Build artifacts are in: $RELEASE_DIR/"
echo ""
echo "Next steps:"
echo "1. Test the PCF control in your Power Apps environment"
echo "2. Test the SPFx extension in SharePoint"
echo "3. If everything works, create a release:"
echo "   git tag v1.0.0 && git push origin v1.0.0"
echo ""
