import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({ message: 'Доступ запрещен. Требуются права администратора.' });
    return;
  }
  
  next();
};