import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import settings from './config/settings';
import imageRoutes from './routes/images';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import webRoutes from './routes/web';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files (for .well-known directory)
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);

// Web Routes (for universal links and fallback pages)
app.use('/', webRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API info endpoint (moved to /api to avoid conflict with web routes)
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Images Gallery Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      images: '/api/images'
    }
  });
});

// Start server
const PORT = settings.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoints:`);
  console.log(`  - Auth: http://localhost:${PORT}/api/auth`);
  console.log(`  - Users: http://localhost:${PORT}/api/users`);
  console.log(`  - Images: http://localhost:${PORT}/api/images`);
}); 