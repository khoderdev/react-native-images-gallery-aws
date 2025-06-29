import { Router, Response } from 'express';
import { S3Service } from '../services/S3Service';
import pool from '../database/config';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const s3Service = new S3Service();

// Upload image endpoint (requires authentication)
router.post('/upload', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { imageData, folder = 'gallery' } = req.body;
    
    if (!imageData) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // Upload to S3
    const s3Key = await s3Service.uploadFile(imageData, folder);
    const imageUrl = s3Service.getUrl(s3Key);
    
    // Get content type and estimated size from base64 data
    const matches = imageData.match(/^data:([A-Za-z0-9-+\/]+);base64,(.+)$/);
    const contentType = matches ? matches[1] : null;
    const base64Data = matches ? matches[2] : '';
    const estimatedSize = Math.round((base64Data.length * 3) / 4);

    // Save to database with user_id
    const result = await pool.query(
      'INSERT INTO images (filename, s3_key, url, content_type, size, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [s3Key, s3Key, imageUrl, contentType, estimatedSize, req.user.id]
    );

    res.status(201).json({
      success: true,
      image: result.rows[0]
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Get user's images (requires authentication)
router.get('/my-images', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const result = await pool.query(
      'SELECT * FROM images WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    
    // Generate signed URLs for each image
    const imagesWithSignedUrls = await Promise.all(
      result.rows.map(async (image) => {
        const signedUrl = await s3Service.getFileUrl(image.s3_key);
        return {
          ...image,
          signed_url: signedUrl || image.url
        };
      })
    );

    res.json({
      success: true,
      images: imagesWithSignedUrls,
      count: imagesWithSignedUrls.length
    });
  } catch (error) {
    console.error('Get user images error:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Get all images (public endpoint for gallery view)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.*, u.first_name, u.last_name 
      FROM images i 
      JOIN users u ON i.user_id = u.id 
      WHERE u.is_active = true 
      ORDER BY i.created_at DESC
    `);
    
    // Generate signed URLs for each image
    const imagesWithSignedUrls = await Promise.all(
      result.rows.map(async (image) => {
        const signedUrl = await s3Service.getFileUrl(image.s3_key);
        return {
          id: image.id,
          filename: image.filename,
          s3_key: image.s3_key,
          url: image.url,
          signed_url: signedUrl || image.url,
          content_type: image.content_type,
          size: image.size,
          created_at: image.created_at,
          user: {
            first_name: image.first_name,
            last_name: image.last_name
          }
        };
      })
    );

    res.json({
      success: true,
      images: imagesWithSignedUrls
    });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Get single image
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT i.*, u.first_name, u.last_name 
      FROM images i 
      JOIN users u ON i.user_id = u.id 
      WHERE i.id = $1 AND u.is_active = true
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const image = result.rows[0];
    const signedUrl = await s3Service.getFileUrl(image.s3_key);

    res.json({
      success: true,
      image: {
        id: image.id,
        filename: image.filename,
        s3_key: image.s3_key,
        url: image.url,
        signed_url: signedUrl || image.url,
        content_type: image.content_type,
        size: image.size,
        created_at: image.created_at,
        user: {
          first_name: image.first_name,
          last_name: image.last_name
        }
      }
    });
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

// Delete image (requires authentication and ownership)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;
    
    // Get image info from database and verify ownership
    const result = await pool.query(
      'SELECT * FROM images WHERE id = $1 AND user_id = $2', 
      [id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found or access denied' });
    }

    const image = result.rows[0];
    
    // Delete from S3
    const s3DeleteResult = await s3Service.removeFile(image.s3_key);
    
    if (s3DeleteResult) {
      // Delete from database
      await pool.query('DELETE FROM images WHERE id = $1', [id]);
      
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(500).json({ error: 'Failed to delete image from storage' });
    }
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router; 