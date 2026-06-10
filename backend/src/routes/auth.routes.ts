import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';

const router = Router();

// Маршрут для входа
router.post('/login', login);

// Маршрут для регистрации (Именно его не может найти сервер!)
router.post('/register', register); 

export default router;