import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Расширяем стандартный Request из Express, чтобы сохранять в него данные пользователя
export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    // Ищем заголовок Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Нет токена авторизации. Войдите в систему.' });
      return;
    }

    // Достаем сам токен (отрезаем слово "Bearer ")
    const token = authHeader.split(' ')[1];
    
    // Расшифровываем токен (секретный ключ должен совпадать с тем, что при логине)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key_123');
    
    // Записываем данные юзера в запрос и пропускаем дальше
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Неверный или просроченный токен' });
  }
};