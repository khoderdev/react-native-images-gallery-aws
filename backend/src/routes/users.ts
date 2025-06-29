import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { UserService } from '../services/UserService';

const router = Router();
const userService = new UserService();

// Get current user profile with images
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userWithImages = await userService.getUserWithImages(req.user.id);
    
    if (!userWithImages) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: userWithImages
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Get current user's images only
router.get('/me/images', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const images = await userService.getUserImages(req.user.id);

    res.json({
      success: true,
      images,
      count: images.length
    });
  } catch (error) {
    console.error('Get user images error:', error);
    res.status(500).json({ error: 'Failed to fetch user images' });
  }
});

// Update user profile
router.put('/me', [
  authenticateToken,
  body('first_name').optional().notEmpty().trim().escape(),
  body('last_name').optional().notEmpty().trim().escape(),
  body('email').optional().isEmail().normalizeEmail()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { first_name, last_name, email } = req.body;
    const updateData: any = {};

    if (first_name) updateData.first_name = first_name;
    if (last_name) updateData.last_name = last_name;
    if (email) updateData.email = email;

    const updatedUser = await userService.updateUser(req.user.id, updateData);

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user profile with images for sharing (public endpoint)
router.get('/profile/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const userWithImages = await userService.getUserWithImages(userId);
    
    if (!userWithImages) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return public profile information with images
    res.json({
      success: true,
      profile: {
        id: userWithImages.id,
        first_name: userWithImages.first_name,
        last_name: userWithImages.last_name,
        created_at: userWithImages.created_at,
        images: userWithImages.images || []
      }
    });
  } catch (error) {
    console.error('Get user profile for sharing error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Get user by ID (public endpoint for basic info)
router.get('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await userService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return only public information
    res.json({
      success: true,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Deactivate account
router.delete('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const success = await userService.deactivateUser(req.user.id);

    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({ error: 'Failed to deactivate account' });
  }
});

export default router; 