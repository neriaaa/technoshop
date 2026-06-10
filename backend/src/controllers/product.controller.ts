import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. Получение всех товаров (с оценками для каталога)
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        reviews: { select: { rating: true } }
      }
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении товаров' });
  }
};

// 2. Получение ОДНОГО товара по ID (с полными отзывами)
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: id },
      include: {
        reviews: {
          include: { user: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!product) {
      res.status(404).json({ message: 'Товар не найден' });
      return;
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении товара' });
  }
};

// 3. Создание нового товара
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, slug, description, price, stock, imageUrl, category } = req.body;
    const existingProduct = await prisma.product.findUnique({ where: { slug } });
    if (existingProduct) {
      res.status(400).json({ message: 'Товар с таким URL-слагом уже существует' });
      return;
    }

    const newProduct = await prisma.product.create({
      data: { name, slug, description, price: Number(price), stock: Number(stock), imageUrl, category }
    });
    res.status(201).json({ message: 'Товар успешно добавлен', product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при создании товара' });
  }
};

// 4. Редактирование товара
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, slug, description, price, stock, imageUrl, category } = req.body;
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: { name, slug, description, price: price ? Number(price) : undefined, stock: stock ? Number(stock) : undefined, imageUrl, category }
    });
    res.json({ message: 'Товар успешно обновлен', product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при обновлении товара' });
  }
};

// 5. Удаление товара
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: id } });
    res.json({ message: 'Товар успешно удален' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при удалении товара' });
  }
};

// 6. Добавление отзыва
export const addReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = (req as any).user.id; 

    const newReview = await prisma.review.create({
      data: { rating: Number(rating), comment, productId: id, userId: userId },
      include: { user: { select: { firstName: true, lastName: true } } }
    });
    res.status(201).json(newReview);
  } catch (error) {
    console.error('Ошибка добавления отзыва:', error);
    res.status(500).json({ message: 'Ошибка при добавлении отзыва' });
  }
};

// 7. Получение всех отзывов для АДМИНКИ
export const getAllReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { id: true, name: true, imageUrl: true } },
        user: { select: { id: true, firstName: true, lastName: true, email: true } }
      }
    });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении отзывов' });
  }
};

// 8. Удаление отзыва для АДМИНКИ
export const deleteReviewAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reviewId } = req.params;
    await prisma.review.delete({
      where: { id: reviewId }
    });
    res.json({ message: 'Отзыв успешно удален' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при удалении отзыва' });
  }
};