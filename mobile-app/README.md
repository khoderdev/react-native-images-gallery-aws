# Images Gallery Mobile App

A React Native Expo app for uploading and managing images with AWS S3 integration.

## Features

- 📸 Take photos with camera
- 🖼️ Select images from photo library
- ☁️ Upload images to backend/AWS S3
- 🎨 Beautiful gallery grid layout
- 🗑️ Delete images with long press
- 📱 Cross-platform (iOS/Android)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update the API URL in `src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://your-backend-url:5000/api';
```

3. Start the development server:
```bash
npx expo start
```

4. Scan the QR code with Expo Go app on your phone or run on simulator

## Permissions

The app requires the following permissions:
- Camera access (for taking photos)
- Photo library access (for selecting images)

These permissions are automatically requested when needed.

## Usage

1. **Add Images**: Tap the "Add Image" button and choose between Camera or Photo Library
2. **View Gallery**: Images are displayed in a grid layout
3. **Delete Images**: Long press on any image to delete it

## Build for Production

### Android
```bash
npx expo build:android
```

### iOS
```bash
npx expo build:ios
```

## Dependencies

- Expo SDK 50
- React Native 0.73
- Expo Image Picker
- Expo Camera
- Axios for API calls
- React Native Safe Area Context 