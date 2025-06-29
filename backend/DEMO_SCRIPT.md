# 🎬 Universal Links Local Demo

## Quick Demo Commands

### 1. Test Configuration Files ✅
curl http://localhost:5000/.well-known/apple-app-site-association
curl http://localhost:5000/.well-known/assetlinks.json

### 2. Test Web Pages ✅  
# Open in browser:
# http://localhost:5000/profile/1
# http://localhost:5000/profile/2
# http://localhost:5000/

### 3. Test Mobile Deep Links ✅
cd ../mobile-app
npx uri-scheme open "exp://192.168.88.91:8081/--/profile/1" --android

## Browser Demo URLs:
echo "Open these in your browser:"
echo "• http://localhost:5000/profile/1"
echo "• http://localhost:5000/profile/2" 
echo "• http://localhost:5000/"
