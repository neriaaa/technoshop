import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'techshop_secret_key_123';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ message: 'Пожалуйста, заполните все поля' });
      return;
    }

    // Проверяем, нет ли уже такого пользователя
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'Пользователь с таким email уже существует' });
      return;
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем пользователя в новой БД
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'USER' 
      }
    });

    // Создаем токен (зашиваем туда ID, чтобы корзина могла его прочитать)
    const token = jwt.sign(
      { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, user: { id: user.id, firstName: user.firstName, role: user.role } });
  } catch (error) {
    console.error("❌ ОШИБКА РЕГИСТРАЦИИ:", error);
    res.status(500).json({ message: 'Ошибка сервера при регистрации' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ message: 'Неверный email или пароль' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(400).json({ message: 'Неверный email или пароль' });
      return;
    }

    // Создаем токен
    const token = jwt.sign(
      { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, firstName: user.firstName, role: user.role } });
  } catch (error) {
    console.error("❌ ОШИБКА ЛОГИНА:", error);
    res.status(500).json({ message: 'Ошибка сервера при входе' });
  }
};