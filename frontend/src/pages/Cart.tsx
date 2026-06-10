import { Container, Typography, Box, Paper, Button, IconButton, Grid, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import api from '../api/axios';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    // 1. Достаем токен и проверяем авторизацию перед отправкой
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Пожалуйста, войдите в аккаунт для оформления заказа!');
      navigate('/login');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // 2. Отправляем массив товаров и итоговую сумму на бэкенд С ТОКЕНОМ
      await api.post('/orders', {
        items: cartItems,
        total: cartTotal
      }, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });

      alert('Заказ успешно оформлен!');
      clearCart(); // Очищаем локальную корзину
      navigate('/profile'); // Перенаправляем в историю заказов
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Ошибка при оформлении заказа. Войдите в аккаунт.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h4" color="white" fontWeight="bold" gutterBottom>Ваша корзина пуста :(</Typography>
        <Button component={RouterLink} to="/catalog" variant="contained" startIcon={<ArrowBackIcon />} sx={{ bgcolor: '#00f2fe', color: 'black', fontWeight: 'bold', '&:hover': { bgcolor: '#4facfe' } }}>В каталог</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 10 }}>
      <Typography variant="h3" color="white" fontWeight="900" sx={{ mb: 4 }}>Моя корзина</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {cartItems.map((item) => (
              <Paper key={item.id} sx={{ bgcolor: '#141419', p: 2, borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 80, height: 80, bgcolor: 'white', borderRadius: 2, p: 1, flexShrink: 0 }}>
                  <img src={item.imageUrl ? `http://localhost:5000${item.imageUrl}` : 'https://via.placeholder.com/80'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography color="white" fontWeight="bold" variant="body1">{item.name}</Typography>
                  <Typography color="#00f2fe" fontWeight="bold">{item.price} ₽</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <IconButton disabled={item.quantity <= 1} onClick={() => updateQuantity(item.id, item.quantity - 1)} sx={{ color: 'white' }}><RemoveIcon /></IconButton>
                  <Typography color="white" fontWeight="bold" sx={{ px: 1 }}>{item.quantity}</Typography>
                  <IconButton disabled={item.quantity >= item.stock} onClick={() => updateQuantity(item.id, item.quantity + 1)} sx={{ color: 'white' }}><AddIcon /></IconButton>
                </Box>
                <IconButton onClick={() => removeFromCart(item.id)} sx={{ color: '#f44336' }}><DeleteIcon /></IconButton>
              </Paper>
            ))}
          </Box>
          <Button onClick={clearCart} color="error" sx={{ mt: 2, fontWeight: 'bold' }}>Очистить корзину</Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ bgcolor: '#141419', p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="h6" color="white" fontWeight="bold" sx={{ mb: 2 }}>Итого</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography color="#a1a1aa">Товары</Typography>
              <Typography color="white" fontWeight="bold">{cartTotal} ₽</Typography>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />
            <Button variant="contained" fullWidth disabled={isSubmitting} onClick={handleCheckout} sx={{ bgcolor: '#00f2fe', color: 'black', fontWeight: 'bold', py: 2, borderRadius: 2, '&:hover': { bgcolor: '#4facfe' } }}>
              {isSubmitting ? 'ОФОРМЛЕНИЕ...' : 'ОФОРМИТЬ ЗАКАЗ'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}