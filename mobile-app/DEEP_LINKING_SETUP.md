# Deep Linking Implementation for User Profile Sharing

This document explains how the deep linking feature is implemented in the Images Gallery mobile app to enable sharing user profiles.

## Features Implemented

1. **Custom URL Scheme**: `imagesgallery://`
2. **Profile Sharing**: Users can share their profiles via deep links
3. **Profile Viewing**: When someone clicks a shared profile link, the app opens and displays the user's profile
4. **Navigation**: Proper React Navigation setup for handling deep links

## Implementation Details

### 1. App Configuration (`app.json`)
```json
{
  "expo": {
    "scheme": "imagesgallery"
  }
}
```

### 2. Deep Linking Configuration (`App.tsx`)
```typescript
const linking = {
  prefixes: [Linking.createURL('/'), 'imagesgallery://'],
  config: {
    screens: {
      Gallery: '',
      Profile: 'profile/:userId',
    },
  },
};
```

### 3. URL Structure
- **Profile Link**: `imagesgallery://profile/{userId}`
- **Example**: `imagesgallery://profile/1`

### 4. Sharing Functionality
Users can share their profiles in two ways:
- Tap the share button in the header
- Open profile options and select "Share My Profile"

## Testing Deep Links

### Method 1: Using `npx uri-scheme` (Recommended)
```bash
# Test opening a user profile (replace {userId} with actual user ID)
npx uri-scheme open "imagesgallery://profile/1" --ios
npx uri-scheme open "imagesgallery://profile/1" --android
```

### Method 2: During Development with Expo Go
```bash
# Get your local development URL first (usually shows when you run npm start)
# Then test with the Expo URL format:
npx uri-scheme open "exp://192.168.x.x:8081/--/profile/1" --ios
```

### Method 3: From Web Browser
Create an HTML file with:
```html
<a href="imagesgallery://profile/1">Open Profile in App</a>
```

### Method 4: Using ADB (Android)
```bash
adb shell am start -W -a android.intent.action.VIEW -d "imagesgallery://profile/1" {your.package.name}
```

### Method 5: Using Simulator Commands (iOS)
```bash
xcrun simctl openurl booted "imagesgallery://profile/1"
```

## Backend API Endpoints

### Get User Profile for Sharing
- **Endpoint**: `GET /api/users/profile/{userId}`
- **Public**: Yes (no authentication required)
- **Response**: User information with their public images

## User Flow

1. **Sharing a Profile**:
   - User taps share button in the app
   - App generates deep link: `imagesgallery://profile/{userId}`
   - User shares link via any sharing method (SMS, email, social media, etc.)

2. **Opening a Shared Profile**:
   - Recipient clicks the shared link
   - If app is installed: App opens directly to the user's profile
   - If app is not installed: Link behavior depends on the platform

3. **Profile Viewing**:
   - App displays user's name, join date, photo count
   - Shows grid of user's public images
   - Provides back navigation and share options

## Authentication Handling

- **Public Profile Access**: No authentication required to view shared profiles
- **Protected Actions**: Authentication required for uploading, deleting images
- **Own Profile**: Users can view their complete profile when authenticated

## Error Handling

- **Invalid User ID**: Shows "User not found" message
- **Network Errors**: Shows retry button with error message
- **No Images**: Shows empty state with appropriate message

## Development Notes

1. **Testing**: Use development build or standalone app for proper deep link testing
2. **Expo Go Limitations**: Deep links work differently in Expo Go vs standalone builds
3. **Platform Differences**: iOS and Android handle deep links slightly differently
4. **Universal Links**: Consider implementing iOS Universal Links and Android App Links for production

## Next Steps

For production deployment, consider:
1. Setting up iOS Universal Links
2. Setting up Android App Links
3. Adding web fallback pages
4. Implementing attribution tracking
5. Adding deep link analytics 