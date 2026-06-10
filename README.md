# TechShop — E-commerce Platform

Современная full-stack платформа интернет-магазина девайсов и периферии, разработанная с акцентом на чистый UI/UX, стеклянный морфизм (glassmorphism) и высокую производительность.

## 🚀 Особенности (Features)

* **Каталог товаров:** Удобная сетка товаров с мгновенным поиском и фильтрацией по категориям.
* **Корзина:** Управление состоянием корзины и оформление заказов.
* **Личный кабинет (Profile):** Просмотр истории заказов, статусов и деталей покупок.
* **Адаптивный дизайн:** Полная поддержка мобильных устройств и десктопов (Material UI + кастомная стилизация).
* **Плавные анимации:** Интеграция Framer Motion для приятного пользовательского опыта.
* **Ролевая система:** Разделение прав (Покупатель / Администратор).

## 🛠 Стек технологий (Tech Stack)

**Frontend:**
* React (Vite)
* TypeScript
* Material UI (MUI)
* Framer Motion
* Zustand (State Management)
* React Router v6
* Axios / JWT-decode

**Backend:**
* Node.js & Express
* TypeScript
* Prisma ORM
* PostgreSQL
* JSON Web Tokens (JWT) для авторизации
* Multer (загрузка изображений)

## ⚙️ Установка и запуск (Local Setup)

Для локального запуска проекта на вашем компьютере должны быть установлены [Node.js](https://nodejs.org/) и [PostgreSQL](https://www.postgresql.org/).

### 1. Клонирование репозитория
```bash
git clone [https://github.com/neriaaa/technoshop.git](https://github.com/neriaaa/technoshop.git)
cd technoshop
2. Настройка Backend
cd backend
npm install
Создайте файл .env в корне папки backend и добавьте туда переменные окружения. Обратите внимание на настройку подключения к локальной базе данных:
PORT=5000
# Замените 'postgres' и 'вашпароль' на логин и пароль от вашей локальной установки PostgreSQL
DATABASE_URL="postgresql://postgres:вашпароль@localhost:5432/techshop?schema=public"
JWT_SECRET="your_secret_key"
Примените миграции базы данных и запустите сервер:
npx prisma migrate dev
npm run dev
3. Настройка Frontend
cd frontend
npm install
npm run dev
Фронтенд запустится на http://localhost:5173
4. Тестовые данные (Test Credentials)
Для проверки функционала панели администратора (добавление товаров, просмотр всех заказов) используйте следующие данные для входа:
Email: admin@gmail.com
Пароль: admin
├── backend/               # Серверная часть
│   ├── prisma/            # Схемы базы данных и миграции
│   ├── src/
│   │   ├── controllers/   # Логика обработки запросов
│   │   ├── middlewares/   # Проверки токенов, ролей и загрузки файлов
│   │   ├── routes/        # API маршруты (auth, products, orders)
│   │   └── server.ts      # Точка входа сервера
│   └── uploads/           # Статические файлы (изображения товаров)
│
└── frontend/              # Клиентская часть
    ├── src/
    │   ├── api/           # Настройки Axios
    │   ├── components/    # Переиспользуемые UI компоненты
    │   ├── context/       # Глобальные состояния (CartContext)
    │   └── pages/         # Страницы (Catalog, Profile, Product)
    └── index.html         # Главный HTML файл