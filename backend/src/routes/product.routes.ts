import { Router, Request, Response } from 'express';


import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  addReview, 
  getAllReviews, 
  deleteReviewAdmin 
} from '../controllers/product.controller';

import { authenticate } from '../middlewares/auth.middleware'; 
import { authorizeAdmin } from '../middlewares/admin.middleware'; 
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// 1. Публичный маршрут (Каталог)
router.get('/', getProducts);

// 2. Загрузка картинки
router.post('/upload', authenticate, authorizeAdmin, upload.single('image'), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ message: 'Файл не был загружен' });
    return;
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});


router.get('/admin/reviews', authenticate, authorizeAdmin, getAllReviews);
router.delete('/admin/reviews/:reviewId', authenticate, authorizeAdmin, deleteReviewAdmin);

// 4. Получение одного товара и добавление отзыва
router.get('/:id', getProductById);
router.post('/:id/reviews', authenticate, addReview);

// 5. Управление товарами (Админка)
router.post('/', authenticate, authorizeAdmin, createProduct);
router.put('/:id', authenticate, authorizeAdmin, updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, deleteProduct);

export default router;