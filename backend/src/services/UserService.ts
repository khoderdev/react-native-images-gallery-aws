import pool from '../database/config';
import { S3Service } from './S3Service';

const s3Service = new S3Service();

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: string;
  images?: UserImage[];
}

export interface UserImage {
  id: number;
  filename: string;
  s3_key: string;
  url: string;
  signed_url?: string;
  content_type: string;
  size: number;
  created_at: string;
}

export class UserService {
  async getUserById(userId: number): Promise<User | null> {
    try {
      const result = await pool.query(
        'SELECT id, email, first_name, last_name, is_active, created_at FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async getUserWithImages(userId: number): Promise<User | null> {
    try {
      // Get user data
      const user = await this.getUserById(userId);
      if (!user) {
        return null;
      }

      // Get user's images
      const imagesResult = await pool.query(
        'SELECT id, filename, s3_key, url, content_type, size, created_at FROM images WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );

      // Generate signed URLs for images
      const images: UserImage[] = await Promise.all(
        imagesResult.rows.map(async (image) => {
          const signedUrl = await s3Service.getFileUrl(image.s3_key);
          return {
            ...image,
            signed_url: signedUrl || image.url
          };
        })
      );

      return {
        ...user,
        images
      };
    } catch (error) {
      console.error('Error fetching user with images:', error);
      throw error;
    }
  }

  async getUserImages(userId: number): Promise<UserImage[]> {
    try {
      const result = await pool.query(
        'SELECT id, filename, s3_key, url, content_type, size, created_at FROM images WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );

      // Generate signed URLs for each image
      const images: UserImage[] = await Promise.all(
        result.rows.map(async (image) => {
          const signedUrl = await s3Service.getFileUrl(image.s3_key);
          return {
            ...image,
            signed_url: signedUrl || image.url
          };
        })
      );

      return images;
    } catch (error) {
      console.error('Error fetching user images:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const result = await pool.query(
        'SELECT id, email, first_name, last_name, is_active, created_at FROM users ORDER BY created_at DESC'
      );

      return result.rows;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async updateUser(userId: number, updateData: Partial<{ first_name: string; last_name: string; email: string }>): Promise<User | null> {
    try {
      const fields = Object.keys(updateData);
      const values = Object.values(updateData);
      
      if (fields.length === 0) {
        return this.getUserById(userId);
      }

      const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
      const query = `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${fields.length + 1} RETURNING id, email, first_name, last_name, is_active, created_at`;
      
      const result = await pool.query(query, [...values, userId]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deactivateUser(userId: number): Promise<boolean> {
    try {
      const result = await pool.query(
        'UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [userId]
      );

      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }
} 