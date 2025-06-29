# Environment Configuration Setup

This project uses environment-based configuration to manage different settings for development and production environments.

## Configuration Files

### 1. `src/config/environment.ts`
Main environment configuration file that automatically detects the environment and provides appropriate settings.

### 2. `.env.example`
Example environment file showing available configuration options.

## Environment Detection

The app automatically detects the environment using:
- `__DEV__` flag for development mode
- Build configuration for production mode

## Features

### Development Mode
- **Profile URLs**: Uses local IP addresses (e.g., `http://192.168.1.100:8081/profile/1`)
- **API Base URL**: Points to local development server
- **Deep Linking**: Works with Expo development tools

### Production Mode
- **Profile URLs**: Uses production domain (e.g., `https://imagesgallery.app/profile/1`)
- **API Base URL**: Points to production API server
- **Deep Linking**: Works with published app

## Configuration Options

### URL Generation
```typescript
import { generateProfileUrl } from '../config/environment';

// Automatically generates appropriate URL based on environment
const profileUrl = generateProfileUrl(userId);
```

### API Base URL
```typescript
import { getApiBaseUrl } from '../config/environment';

// Gets the correct API base URL for current environment
const apiUrl = getApiBaseUrl();
```

## Customization

To customize environment settings:

1. Update `src/config/environment.ts` with your specific URLs
2. Modify the IP addresses and ports for your development setup
3. Update production domains when deploying

## Example Usage

### Share Profile Function
```typescript
const handleShareProfile = async () => {
  const profileUrl = generateProfileUrl(user.id);
  
  await Share.share({
    message: `Check out my profile!\n\n${profileUrl}`,
  });
};
```

This will automatically generate:
- **Development**: `http://192.168.1.100:8081/profile/123`
- **Production**: `https://imagesgallery.app/profile/123`

## Testing

### Development Testing
- URLs work with Expo Go app
- Deep links open in development environment
- Local IP addresses are accessible

### Production Testing
- URLs work with published app
- Universal links work on all platforms
- Production domains resolve correctly

## Notes

- Update IP addresses in `environment.ts` to match your local network
- Ensure production domains are properly configured
- Test deep linking in both environments before deployment 