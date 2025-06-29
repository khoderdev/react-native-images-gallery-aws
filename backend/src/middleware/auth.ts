import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import settings from '../config/settings';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, settings.JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
};

export const generateToken = (user: { id: number; email: string; first_name: string; last_name: string }) => {
  const payload = {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
  };
  
  return jwt.sign(payload, settings.JWT_SECRET, { expiresIn: '7d' });
}; 