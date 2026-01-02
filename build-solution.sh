#!/bin/bash

# Build and Package Script for TopParameters PCF Control and Solution
# This script builds the PCF control and packages it into the Power Platform solution

set -e  # Exit on error

echo "======================================"
echo "TopParameters - Build and Package"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Build PCF Control
echo -e "${YELLOW}Step 1: Building PCF Control...${NC}"
cd TopParamsComplete

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Building PCF..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ PCF Control built successfully${NC}"
else
    echo -e "${RED}✗ PCF build failed${NC}"
    exit 1
fi

cd ..
echo ""

# Step 2: Package Solution
echo -e "${YELLOW}Step 2: Packaging Power Platform Solution...${NC}"
cd TopParamsSolution

if command -v dotnet &> /dev/null; then
    echo "Building solution with dotnet..."
    dotnet build TopParamsSolution.cdsproj --configuration Release
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Solution packaged successfully${NC}"
        
        # Show output files
        echo ""
        echo "Output files:"
        ls -lh bin/Release/*.zip 2>/dev/null || ls -lh bin/Debug/*.zip 2>/dev/null || echo "No zip files found"
    else
        echo -e "${RED}✗ Solution packaging failed${NC}"
        exit 1
    fi
else
    echo -e "${RED}✗ dotnet CLI not found. Please install .NET SDK${NC}"
    exit 1
fi

cd ..
echo ""

# Summary
echo "======================================"
echo -e "${GREEN}Build Complete!${NC}"
echo "======================================"
echo ""
echo "Solution package location:"
echo "  TopParamsSolution/bin/Release/TopParamsSolution.zip"
echo "  (or bin/Debug/ if Release build not available)"
echo ""
echo "This solution includes:"
echo "  - TopParamsControlV2.TopParamsReader PCF control"
echo "  - Ready to import into Power Apps environment"
echo ""
