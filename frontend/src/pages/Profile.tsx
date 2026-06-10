import { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid, Avatar, Chip, Divider, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import PersonIcon from '@mui/icons-material/Person';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import api from '../api/axios';

// Настройки анимации
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function Profile() {
  const token = localStorage.getItem('token');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  let user: any = { firstName: 'Покупатель', lastName: '', email: 'Не указан', role: 'USER' };
  if (token) {
    try { user = jwtDecode(token); } catch (e) { console.error(e); }
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchOrders();
  }, [token]);

  const getStatusChip = (status: string) => {
    const colors: any = { 'Доставлен': 'success', 'Отменен': 'error', 'В пути': 'info' };
    return <Chip label={status} color={colors[status] || 'warning'} size="small" sx={{ fontWeight: 'bold', borderRadius: '8px' }} />;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 10 }}>
      <Grid container spacing={4}>
        {/* Карточка пользователя */}
        <Grid item xs={12} md={4}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible">
            <Paper sx={{ bgcolor: '#141419', p: 4, borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
              <Avatar sx={{ width: 90, height: 90, mx: 'auto', mb: 2, bgcolor: '#00f2fe', color: 'black' }}><PersonIcon sx={{ fontSize: 45 }} /></Avatar>
              <Typography variant="h5" color="white" fontWeight="900">{user.firstName} {user.lastName}</Typography>
              <Typography color="#a1a1aa" sx={{ mb: 3 }}>{user.email}</Typography>
              <Chip label={user.role === 'ADMIN' ? 'Администратор' : 'Покупатель'} sx={{ bgcolor: 'rgba(0, 242, 254, 0.1)', color: '#00f2fe', fontWeight: 'bold', border: '1px solid #00f2fe' }} />
            </Paper>
          </motion.div>
        </Grid>

        {/* Список заказов */}
        <Grid item xs={12} md={8}>
          <Typography variant="h4" color="white" fontWeight="900" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Inventory2Icon sx={{ color: '#00f2fe' }} /> Мои заказы
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress sx={{ color: '#00f2fe' }} /></Box>
          ) : orders.length === 0 ? (
            <Paper sx={{ bgcolor: '#141419', p: 4, textAlign: 'center', borderRadius: 4, border: '1px dashed rgba(255,255,255,0.1)' }}>
              <Typography color="#a1a1aa">История заказов пуста.</Typography>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {orders.map((order) => (
                <motion.div key={order.id} variants={cardVariants} initial="hidden" animate="visible">
                  <Paper sx={{ 
                    bgcolor: '#141419', p: 3, borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)',
                    transition: '0.3s', '&:hover': { borderColor: '#00f2fe', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' } 
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography color="white" fontWeight="bold">Заказ № {order.id.slice(0, 8).toUpperCase()}</Typography>
                        <Typography color="#a1a1aa" variant="caption">Дата: {new Date(order.createdAt).toLocaleDateString()}</Typography>
                      </Box>
                      {getStatusChip(order.status)}
                    </Box>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 2 }} />
                    {order.items.map((item: any) => (
                      <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Avatar variant="rounded" src={`http://localhost:5000${item.product?.imageUrl}`} sx={{ width: 40, height: 40 }} />
                        <Typography color="#e4e4e7" variant="body2" sx={{ flexGrow: 1 }}>{item.product?.name}</Typography>
                        <Typography color="white" fontWeight="bold">{item.price} ₽</Typography>
                      </Box>
                    ))}
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'right' }}>
                      <Typography color="white">Итого: <span style={{ color: '#00f2fe', fontWeight: 'bold' }}>{order.total} ₽</span></Typography>
                    </Box>
                  </Paper>
                </motion.div>
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}