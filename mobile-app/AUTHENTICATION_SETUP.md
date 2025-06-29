# Mobile App Authentication Setup

## Overview
The mobile app now includes a complete user authentication system that integrates with the backend JWT authentication. Users can register, login, and manage their personal image galleries.

## Features Implemented

### 1. User Registration & Login
- **Registration Screen**: Users can create accounts with email, password, first name, and last name
- **Login Screen**: Existing users can login with email and password
- **Form Validation**: Client-side validation for email format, password length, and required fields
- **Error Handling**: Clear error messages for authentication failures

### 2. Secure Token Management
- **JWT Tokens**: Automatic token handling using Expo SecureStore
- **Auto-login**: Users stay logged in between app sessions
- **Token Refresh**: Automatic logout on token expiration

### 3. Authenticated Image Gallery
- **Personal Gallery**: Users see only their own uploaded images
- **Upload Images**: Authenticated users can upload images to their personal gallery
- **Delete Images**: Users can only delete their own images
- **User Profile**: Display user's name in the app header
- **Logout**: Secure logout functionality

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   cd mobile-app
   npm install
   ```

2. **Update Backend URL**:
   In `src/services/api.ts`, update the `API_BASE_URL` to match your backend server:
   ```typescript
   const API_BASE_URL = 'http://YOUR_BACKEND_IP:5000/api';
   ```

3. **Start the App**:
   ```bash
   expo start
   ```

## Testing the Authentication

1. **Register a New Account**:
   - Open the app
   - Tap "Sign Up" 
   - Fill in all required fields
   - Tap "Create Account"

2. **Login with Existing Account**:
   - Open the app
   - Enter email and password
   - Tap "Sign In"

3. **Upload Images**:
   - After login, tap "Add Image"
   - Choose camera or photo library
   - Image will be uploaded to your personal gallery

4. **Logout**:
   - Tap the logout icon in the header
   - Confirm logout in the alert
