import { Router, Request, Response } from 'express';
import path from 'path';

const router = Router();

// Serve the universal link configuration files
router.get('/.well-known/apple-app-site-association', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(path.join(__dirname, '../../public/.well-known/apple-app-site-association'));
});

router.get('/.well-known/assetlinks.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(path.join(__dirname, '../../public/.well-known/assetlinks.json'));
});

// Handle profile URLs - serve a web page as fallback
router.get('/profile/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    
    // Basic validation
    if (!userId || isNaN(parseInt(userId))) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invalid Profile - Images Gallery</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 50px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              margin: 0;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .container { 
              max-width: 400px; 
              background: rgba(255,255,255,0.1);
              padding: 40px;
              border-radius: 20px;
              backdrop-filter: blur(10px);
            }
            .error { color: #ff6b6b; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="error">Invalid Profile</h1>
            <p>The profile link you're looking for is not valid.</p>
            <a href="/" style="color: white;">Go to Images Gallery</a>
          </div>
        </body>
        </html>
      `);
    }

    // Serve a web page that can redirect to app store if app not installed
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Images Gallery Profile</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta property="og:title" content="Check out this profile on Images Gallery">
        <meta property="og:description" content="View photos and connect on Images Gallery">
        <meta property="og:type" content="profile">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container { 
            max-width: 400px; 
            background: rgba(255,255,255,0.1);
            padding: 40px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
          }
          .avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            font-weight: bold;
          }
          .name { font-size: 28px; margin: 20px 0; }
          .description { margin: 20px 0; opacity: 0.9; }
          .app-button {
            background: #fff;
            color: #667eea;
            padding: 15px 30px;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: bold;
            text-decoration: none;
            display: inline-block;
            margin: 20px 10px;
            transition: transform 0.2s;
          }
          .app-button:hover { transform: translateY(-2px); }
          .fallback { margin-top: 30px; opacity: 0.7; font-size: 14px; }
          .loading { margin: 20px 0; opacity: 0.8; }
        </style>
        <script>
          // Try to open the app after a short delay
          setTimeout(() => {
            // Try the custom scheme first
            const appUrl = 'imagesgallery://profile/${userId}';
            
            // Create a hidden iframe to attempt app launch
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = appUrl;
            document.body.appendChild(iframe);
            
            // Remove iframe after attempt
            setTimeout(() => {
              document.body.removeChild(iframe);
            }, 1000);
            
          }, 500);
        </script>
      </head>
      <body>
        <div class="container">
          <div class="avatar">
            👤
          </div>
          <h1 class="name">Images Gallery Profile</h1>
          <p class="description">Check out this user's photos on Images Gallery!</p>
          
          <div class="loading">
            🚀 Trying to open the app...
          </div>
          
          <a href="https://apps.apple.com/app/imagesgallery" class="app-button">
            📱 Download for iOS
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.imagesgallery.app" class="app-button">
            🤖 Download for Android
          </a>
          
          <p class="fallback">
            If you have the app installed, it should open automatically.<br>
            Otherwise, download the app to view this profile!
          </p>
        </div>
      </body>
      </html>
    `);
    
  } catch (error) {
    console.error('Web profile error:', error);
    res.status(500).send('Internal server error');
  }
});

// Handle root domain
router.get('/', (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Images Gallery</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta property="og:title" content="Images Gallery">
      <meta property="og:description" content="Share your photos with the world!">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          text-align: center; 
          padding: 50px; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          margin: 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container { 
          max-width: 500px; 
          background: rgba(255,255,255,0.1);
          padding: 40px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }
        .logo { font-size: 48px; margin-bottom: 20px; }
        .title { font-size: 32px; margin: 20px 0; }
        .description { margin: 20px 0; opacity: 0.9; font-size: 18px; }
        .app-button {
          background: #fff;
          color: #667eea;
          padding: 15px 30px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: bold;
          text-decoration: none;
          display: inline-block;
          margin: 20px 10px;
          transition: transform 0.2s;
        }
        .app-button:hover { transform: translateY(-2px); }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">📸</div>
        <h1 class="title">Images Gallery</h1>
        <p class="description">Share your photos with the world!</p>
        
        <a href="https://apps.apple.com/app/imagesgallery" class="app-button">
          📱 Download for iOS
        </a>
        <a href="https://play.google.com/store/apps/details?id=com.imagesgallery.app" class="app-button">
          🤖 Download for Android
        </a>
      </div>
    </body>
    </html>
  `);
});

export default router; 