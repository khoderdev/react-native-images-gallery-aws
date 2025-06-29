# Deep Link Testing Guide

## 🚧 Development vs Production Behavior

### Development Mode (Expo Go)
**Issue**: Custom scheme URLs (`imagesgallery://profile/1`) are **NOT clickable** in messaging apps or browsers during development.

**Why**: Custom schemes are only recognized by the OS when the app is properly installed, not when running through Expo Go.

**Current Behavior**:
```
Check out Khoder Jaber's profile on Images Gallery!

imagesgallery://profile/1

🚀 Development Testing:
To test this link, copy and run in terminal:
npx uri-scheme open "imagesgallery://profile/1" --ios
```

### Production Mode (Built App)
**Works perfectly**: HTTPS URLs are clickable everywhere and automatically open the app.

**Production Behavior**:
```
Check out Khoder Jaber's profile on Images Gallery!

https://imagesgallery.app/profile/1
```

## 🧪 Testing Methods in Development

### Method 1: Terminal Commands (Recommended)
```bash
# Test specific user profile
npx uri-scheme open "imagesgallery://profile/1" --ios

# Test with different user ID
npx uri-scheme open "imagesgallery://profile/123" --ios

# Test on Android
npx uri-scheme open "imagesgallery://profile/1" --android
```

### Method 2: Using the Test Script
```bash
./test-deeplink.sh
```
Follow the interactive prompts to test different scenarios.

### Method 3: Copy from Share Dialog
1. Share a profile in the app (development mode)
2. Copy the terminal command from the share message
3. Run it in your terminal

## 📱 Platform-Specific Notes

### iOS Development
- URLs must be tested via terminal commands
- Simulator and physical device both work
- Requires Expo Go or built app to be running

### Android Development  
- Same limitations as iOS
- Use `--android` flag in terminal commands
- Works with emulator and physical device

## 🔄 Environment Switching

The app automatically detects environment and generates appropriate URLs:

### Development Detection
```typescript
if (__DEV__) {
  // Generates: imagesgallery://profile/1
  // Includes testing instructions in share message
}
```

### Production Detection
```typescript
if (!__DEV__) {
  // Generates: https://imagesgallery.app/profile/1
  // Clean, clickable HTTPS URLs
}
```

## ✅ Verification Checklist

### Development Testing
- [ ] App is running in Expo Go or simulator
- [ ] Terminal command opens the app
- [ ] Navigation to correct profile screen works
- [ ] User profile loads correctly

### Production Testing (After Build)
- [ ] HTTPS URLs are clickable in messages
- [ ] URLs work when pasted in browser
- [ ] Universal links open app automatically
- [ ] Deep navigation works correctly

## 🚀 Production Deployment

When you build and publish your app:

1. **URLs become clickable** ✅
2. **Universal links work** ✅  
3. **Cross-platform sharing** ✅
4. **Professional appearance** ✅

## 🔧 Troubleshooting

### "Link doesn't work"
- Ensure app is running (development) or installed (production)
- Check terminal output for errors
- Verify correct User ID in URL

### "App doesn't open"
- Make sure Expo Go is running (development)
- Check that the URL scheme is registered in app.json
- Try restarting the app/simulator

### "Wrong screen opens"
- Verify deep linking configuration in App.tsx
- Check navigation setup
- Test with valid User IDs

## 📚 Additional Resources

- [Expo Deep Linking Documentation](https://docs.expo.dev/guides/deep-linking/)
- [React Navigation Deep Linking](https://reactnavigation.org/docs/deep-linking/)
- [Universal Links (iOS)](https://developer.apple.com/ios/universal-links/)
- [App Links (Android)](https://developer.android.com/training/app-links)

---

**Summary**: Development deep links require terminal testing, but production builds have fully clickable HTTPS URLs that work everywhere! 🎯 