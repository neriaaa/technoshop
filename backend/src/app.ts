import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';

const app = express();

// Middleware
app.use(cors()); // Чтобы фронтенд мог обращаться к бэкенду
app.use(express.json()); // Чтобы сервер понимал JSON в запросах

// Раздача статических файлов (картинок)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Подключение маршрутов
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Тестовый маршрут для проверки работы сервера
app.get('/', (req, res) => {
  res.send('API TechShop работает!');
});

export default app;