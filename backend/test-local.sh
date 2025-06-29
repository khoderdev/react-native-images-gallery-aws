#!/bin/bash

echo "🧪 Local Universal Links Testing Script"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend is running
echo -e "${BLUE}Checking if backend is running...${NC}"
if curl -s http://localhost:5000/health > /dev/null; then
    echo -e "${GREEN}✅ Backend is running on port 5000${NC}"
else
    echo -e "${RED}❌ Backend is not running. Please start it with: npm run dev${NC}"
    exit 1
fi

echo ""

# Test 1: Configuration Files
echo -e "${BLUE}🔧 Testing Universal Links Configuration Files${NC}"
echo "==============================================="

echo "Testing iOS configuration..."
if curl -s http://localhost:5000/.well-known/apple-app-site-association | jq . > /dev/null 2>&1; then
    echo -e "${GREEN}✅ iOS config file working${NC}"
    echo "URL: http://localhost:5000/.well-known/apple-app-site-association"
else
    echo -e "${RED}❌ iOS config file failed${NC}"
fi

echo "Testing Android configuration..."
if curl -s http://localhost:5000/.well-known/assetlinks.json | jq . > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Android config file working${NC}"
    echo "URL: http://localhost:5000/.well-known/assetlinks.json"
else
    echo -e "${RED}❌ Android config file failed${NC}"
fi

echo ""

# Test 2: Web Fallback Pages
echo -e "${BLUE}🌐 Testing Web Fallback Pages${NC}"
echo "============================="

echo "Testing profile page (User ID: 1)..."
if curl -s http://localhost:5000/profile/1 | grep -q "Images Gallery"; then
    echo -e "${GREEN}✅ Profile page working${NC}"
    echo "URL: http://localhost:5000/profile/1"
else
    echo -e "${RED}❌ Profile page failed${NC}"
fi

echo "Testing homepage..."
if curl -s http://localhost:5000/ | grep -q "Images Gallery"; then
    echo -e "${GREEN}✅ Homepage working${NC}"
    echo "URL: http://localhost:5000/"
else
    echo -e "${RED}❌ Homepage failed${NC}"
fi

echo "Testing invalid profile..."
if curl -s http://localhost:5000/profile/999 | grep -q "Invalid Profile"; then
    echo -e "${GREEN}✅ Error handling working${NC}"
    echo "URL: http://localhost:5000/profile/999"
else
    echo -e "${RED}❌ Error handling failed${NC}"
fi

echo ""

# Test 3: Mobile Deep Linking
echo -e "${BLUE}📱 Mobile Deep Linking Test Commands${NC}"
echo "===================================="
echo -e "${YELLOW}To test deep linking, run these commands from the mobile-app directory:${NC}"
echo ""
echo "cd ../mobile-app"
echo "npx uri-scheme open \"exp://192.168.88.91:8081/--/profile/1\" --android"
echo "npx uri-scheme open \"exp://192.168.88.91:8081/--/profile/2\" --android"
echo ""

# Test 4: Show URLs for browser testing
echo -e "${BLUE}🖥️  Browser Testing URLs${NC}"
echo "======================"
echo "Open these URLs in your browser to see the fallback pages:"
echo ""
echo "• Profile Page: http://localhost:5000/profile/1"
echo "• Another Profile: http://localhost:5000/profile/2"  
echo "• Invalid Profile: http://localhost:5000/profile/999"
echo "• Homepage: http://localhost:5000/"
echo ""

# Test 5: Configuration file contents
echo -e "${BLUE}📋 Configuration File Contents${NC}"
echo "=============================="
echo ""
echo -e "${YELLOW}iOS Configuration:${NC}"
curl -s http://localhost:5000/.well-known/apple-app-site-association | jq . 2>/dev/null || echo "Failed to fetch iOS config"
echo ""
echo -e "${YELLOW}Android Configuration:${NC}"
curl -s http://localhost:5000/.well-known/assetlinks.json | jq . 2>/dev/null || echo "Failed to fetch Android config"
echo ""

echo -e "${GREEN}🎉 Local testing complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Open the browser URLs above to see the web fallback pages"
echo "2. Run the mobile deep linking commands to test app navigation"
echo "3. Test the share functionality in your mobile app"
echo "4. Deploy to production when ready!" 