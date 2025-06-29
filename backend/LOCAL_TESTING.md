# Local Testing Guide - Universal Links

## 🧪 How to Test Locally and Demonstrate

### **Prerequisites**
- Backend running on `http://localhost:5000`
- Mobile app running with Expo Go
- Terminal access for deep link testing

## 📋 **Testing Checklist**

### ✅ **1. Test Backend Configuration Files**

```bash
# Test iOS configuration file
curl http://localhost:5000/.well-known/apple-app-site-association

# Test Android configuration file  
curl http://localhost:5000/.well-known/assetlinks.json

# Should return JSON configuration files
```

### ✅ **2. Test Web Fallback Pages**

```bash
# Test profile page
curl http://localhost:5000/profile/1

# Test homepage
curl http://localhost:5000/

# Should return HTML pages
```

### ✅ **3. Test Profile Page in Browser**

Open in your browser:
- `http://localhost:5000/profile/1`
- `http://localhost:5000/profile/2`  
- `http://localhost:5000/profile/999` (should show error)

Should see beautiful profile pages with download buttons.

### ✅ **4. Test Deep Linking (Mobile App)**

```bash
# From mobile-app directory
cd ../mobile-app

# Test deep linking (works with Expo Go)
npx uri-scheme open "exp://192.168.88.91:8081/--/profile/1" --android
npx uri-scheme open "exp://192.168.88.91:8081/--/profile/2" --android
```

### ✅ **5. Test Share Functionality**

1. Open your mobile app
2. Go to gallery screen
3. Tap share profile button
4. Should generate: `https://link.imagesgallery.dev/profile/1`
5. Copy the terminal command and run it to test deep linking

## 🌐 **Advanced Testing with ngrok (Optional)**

For more realistic testing with public URLs:

### Step 1: Install ngrok
```bash
# Install ngrok (if not installed)
npm install -g @ngrok/ngrok
```

### Step 2: Expose your backend
```bash
# From backend directory
ngrok http 5000
```

### Step 3: Update mobile app for testing
```javascript
// In mobile-app/src/config/environment.ts (temporarily)
DEEP_LINK_DOMAIN: environment === 'development'
  ? 'https://abc123.ngrok.io'  // Use your ngrok URL
  : 'https://imagesgallery.app',
```

### Step 4: Test with public URL
```bash
# Test configuration files
curl https://abc123.ngrok.io/.well-known/apple-app-site-association

# Test profile pages
curl https://abc123.ngrok.io/profile/1
```

## 🎬 **Demonstration Script**

### **Demo Part 1: Backend Configuration**
```bash
echo "🔧 Testing backend configuration files..."
curl -s http://localhost:5000/.well-known/apple-app-site-association | jq .
curl -s http://localhost:5000/.well-known/assetlinks.json | jq .
echo "✅ Configuration files are working!"
```

### **Demo Part 2: Web Fallback**
```bash
echo "🌐 Testing web fallback pages..."
echo "Opening profile page in browser..."
# Open http://localhost:5000/profile/1 in browser
echo "✅ Beautiful fallback page displayed!"
```

### **Demo Part 3: Mobile Deep Linking**
```bash
echo "📱 Testing mobile deep linking..."
echo "Generating share URL from mobile app..."
# Show share functionality in mobile app
echo "Testing deep link navigation..."
npx uri-scheme open "exp://192.168.88.91:8081/--/profile/1" --android
echo "✅ App opened and navigated to profile!"
```

### **Demo Part 4: Complete Flow**
```bash
echo "🎯 Complete Universal Links Flow:"
echo "1. ✅ Mobile app generates: https://link.imagesgallery.dev/profile/1"
echo "2. ✅ Backend serves config files for OS recognition"  
echo "3. ✅ Web fallback works when app not installed"
echo "4. ✅ Deep linking works when app is installed"
echo "5. ✅ Ready for production deployment!"
```

## 🐛 **Troubleshooting**

### Backend not starting?
```bash
# Check if port 5000 is available
lsof -i :5000

# Kill any processes on port 5000
kill -9 $(lsof -t -i:5000)

# Restart backend
npm run dev
```

### Configuration files not loading?
```bash
# Check if files exist
ls -la public/.well-known/

# Check file contents
cat public/.well-known/apple-app-site-association
cat public/.well-known/assetlinks.json
```

### Deep linking not working?
```bash
# Make sure Expo is running
cd ../mobile-app
npx expo start

# Check if device is connected
adb devices

# Test with different scheme
npx uri-scheme open "imagesgallery://profile/1" --android
```

## ✅ **Success Criteria**

Your local testing is successful when:

- ✅ **Configuration files** load at `/.well-known/` endpoints
- ✅ **Profile pages** display beautifully in browser
- ✅ **Mobile app** generates proper share URLs
- ✅ **Deep linking** navigates to correct screens
- ✅ **Error handling** works for invalid profiles

## 🚀 **Next Steps**

After successful local testing:
1. **Deploy backend** to production domain
2. **Update configuration** with real Team ID and fingerprints
3. **Test with production URLs**
4. **Submit app** to app stores

Your universal links system is working locally! 🎉 