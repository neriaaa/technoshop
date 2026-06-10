import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. Создание нового заказа (с вычитанием со склада и логами)
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  console.log("\n=== СТАРТ ОФОРМЛЕНИЯ ЗАКАЗА ===");
  try {
    const { items, total } = req.body;
    const user = (req as any).user;

    console.log("1. Данные пользователя из токена:", user);
    console.log("2. Товаров в корзине:", items?.length || 0);

    // Умный поиск ID (в зависимости от того, как он был зашифрован при логине)
    const userId = user?.id || user?.userId || user?.sub;

    if (!userId) {
      console.log("❌ ОШИБКА: ID пользователя не найден в токене!");
      res.status(400).json({ message: 'Не удалось определить пользователя. Перезайдите в аккаунт.' });
      return;
    }

    if (!items || items.length === 0) {
      console.log("❌ ОШИБКА: Корзина пуста!");
      res.status(400).json({ message: 'Корзина пуста' });
      return;
    }

    console.log(`3. Проверяем остатки на складе...`);
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.id } });
      if (!product || product.stock < item.quantity) {
        console.log(`❌ ОШИБКА: Товара ${item.name} нет на складе!`);
        res.status(400).json({ message: `Товара "${item.name}" недостаточно на складе!` });
        return;
      }
    }

    console.log("4. Создаем заказ в базе данных...");
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: userId, // Используем найденный ID
          total: Number(total),
          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              quantity: Number(item.quantity),
              price: Number(item.price)
            }))
          }
        },
        include: { items: true }
      });

      // Обновляем количество на складе для каждого товара
      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } }
        });
      }

      return order;
    });

    console.log("✅ УСПЕХ: Заказ создан! ID:", newOrder.id);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("❌ ВНУТРЕННЯЯ ОШИБКА СЕРВЕРА ПРИ СОЗДАНИИ ЗАКАЗА:");
    console.error(error); // Теперь ошибка 100% напечатается в терминале
    res.status(500).json({ message: 'Ошибка при создании заказа' });
  }
};

// 2. Получение истории заказов текущего пользователя (для Профиля)
export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const userId = user?.id || user?.userId || user?.sub;

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: { select: { name: true, imageUrl: true } } }
        }
      }
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении заказов' });
  }
};

// 3. Получение ВСЕХ заказов всех пользователей для АДМИНКИ
export const getAllOrdersAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        items: {
          include: { product: { select: { name: true, imageUrl: true } } }
        }
      }
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка админки при получении заказов' });
  }
};

// 4. Изменение статуса заказа администратором вручную
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при обновлении статуса заказа' });
  }
};