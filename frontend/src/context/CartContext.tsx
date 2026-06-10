import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Описываем, как выглядит товар в корзине
export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stock: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Загружаем корзину из памяти браузера при первом запуске
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Автоматически сохраняем корзину при любых изменениях
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (newItem: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === newItem.id);
      if (existing) {
        // Если товар уже есть, просто увеличиваем количество (но не больше, чем есть на складе)
        return prev.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: Math.min(item.quantity + newItem.quantity, item.stock) }
            : item
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCartItems([]);

  // Считаем общую сумму и количество товаров
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

// Удобный хук для использования корзины в любом файле
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart должен использоваться внутри CartProvider');
  return context;
};