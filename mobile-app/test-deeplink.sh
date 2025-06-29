#!/bin/bash

# Deep Link Testing Script for Images Gallery App
# This script helps test the user profile sharing deep link functionality

echo "🔗 Images Gallery Deep Link Testing Script"
echo "=========================================="
echo ""

# Check if uri-scheme is available
if ! command -v npx &> /dev/null; then
    echo "❌ npx is not available. Please install Node.js and npm."
    exit 1
fi

echo "📱 This script will test deep linking to user profiles"
echo ""

# Default test user ID
DEFAULT_USER_ID="1"

# Ask for user ID
echo "Enter the User ID to test (default: $DEFAULT_USER_ID):"
read -r USER_ID
USER_ID=${USER_ID:-$DEFAULT_USER_ID}

echo ""
echo "🧪 Testing deep link for User ID: $USER_ID"
echo ""

# Ask for platform
echo "Select platform to test:"
echo "1. iOS"
echo "2. Android"
echo "3. Both"
echo ""
echo "Enter your choice (1-3):"
read -r PLATFORM_CHOICE

case $PLATFORM_CHOICE in
    1)
        echo "🍎 Testing on iOS..."
        npx uri-scheme open "imagesgallery://profile/$USER_ID" --ios
        ;;
    2)
        echo "🤖 Testing on Android..."
        npx uri-scheme open "imagesgallery://profile/$USER_ID" --android
        ;;
    3)
        echo "🍎 Testing on iOS..."
        npx uri-scheme open "imagesgallery://profile/$USER_ID" --ios
        sleep 2
        echo "🤖 Testing on Android..."
        npx uri-scheme open "imagesgallery://profile/$USER_ID" --android
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "✅ Deep link test completed!"
echo ""
echo "📋 Test Details:"
echo "   - URL Scheme: imagesgallery://"
echo "   - Target URL: imagesgallery://profile/$USER_ID"
echo "   - Expected Behavior: App should open and display user profile"
echo ""
echo "📝 If the app doesn't open:"
echo "   1. Make sure the app is installed on your device/simulator"
echo "   2. Ensure you've built the app with the custom scheme"
echo "   3. Check that the device/simulator is running"
echo ""
echo "🔧 Development Testing Notes:"
echo "   • Custom schemes (imagesgallery://) only work with installed apps"
echo "   • For Expo Go development, the URLs won't be clickable in messages"
echo "   • Use this script or terminal commands to test deep links"
echo "   • Production builds will have clickable HTTPS URLs"
echo ""
echo "💡 Quick Test Commands:"
echo "   iOS: npx uri-scheme open \"imagesgallery://profile/$USER_ID\" --ios"
echo "   Android: npx uri-scheme open \"imagesgallery://profile/$USER_ID\" --android"
echo "" 