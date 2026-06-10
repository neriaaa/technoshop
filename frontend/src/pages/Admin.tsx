import { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Tabs, Tab, Paper, Button, 
  CircularProgress, Rating, Avatar, MenuItem, Select, FormControl, Grid 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import AddProductForm from '../components/admin/AddProductForm';
import EditProductsList from '../components/admin/EditProductsList'; 
import api from '../api/axios';

interface AdminReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  product: { id: string; name: string; imageUrl: string };
  user: { id: string; firstName: string; lastName: string; email: string };
}

interface AdminOrder {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string };
  items: { id: string; quantity: number; price: number; product: { name: string } }[];
}

export default function Admin() {
  const [tab, setTab] = useState(0);
  
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  useEffect(() => {
    if (tab === 2) fetchReviews();
    if (tab === 3) fetchOrders(); 
  }, [tab]);

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await api.get('/products/admin/reviews');
      setReviews(response.data);
    } catch (error) { console.error(error); } finally { setLoadingReviews(false); }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await api.get('/orders/admin');
      setOrders(response.data);
    } catch (error) { console.error(error); } finally { setLoadingOrders(false); }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/orders/admin/${orderId}`, { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      alert('Статус заказа успешно обновлен!');
    } catch (error) {
      console.error(error);
      alert('Не удалось изменить статус заказа.');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Удалить отзыв?')) return;
    try {
      await api.delete(`/products/admin/reviews/${reviewId}`);
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (error) { console.error(error); }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Typography variant="h3" fontWeight="900" sx={{ mb: 4, color: 'white' }}>Панель управления</Typography>

      <Paper sx={{ bgcolor: '#18181b', borderRadius: 4, overflow: 'hidden' }}>
        <Tabs value={tab} onChange={handleChange} variant="fullWidth" sx={{ borderBottom: 1, borderColor: 'divider' }} TabIndicatorProps={{ style: { backgroundColor: '#00f2fe', height: 3 } }}>
          <Tab label="Добавить товар" sx={{ color: 'white', '&.Mui-selected': { color: '#00f2fe' } }} />
          <Tab label="Редактировать товары" sx={{ color: 'white', '&.Mui-selected': { color: '#00f2fe' } }} />
          <Tab label="Отзывы" sx={{ color: 'white', '&.Mui-selected': { color: '#00f2fe' } }} />
          <Tab label="Заказы клиентов" sx={{ color: 'white', '&.Mui-selected': { color: '#00f2fe' } }} />
        </Tabs>

        <Box sx={{ p: 4, minHeight: '300px' }}>
          {tab === 0 && <AddProductForm />}
          {tab === 1 && <EditProductsList />}
          
          {tab === 2 && (
            <Box>
              {loadingReviews ? <CircularProgress sx={{ color: '#00f2fe', display: 'block', mx: 'auto' }} /> : reviews.length === 0 ? <Typography color="#a1a1aa" textAlign="center">Отзывов нет</Typography> : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {reviews.map((review) => (
                    <Paper key={review.id} sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 3, display: 'flex', gap: 3, alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <Avatar src={review.product?.imageUrl ? `http://localhost:5000${review.product.imageUrl}` : ''} variant="rounded" sx={{ width: 60, height: 60, bgcolor: 'white' }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography color="white" fontWeight="bold">{review.user?.firstName} {review.user?.lastName} <span style={{color: '#a1a1aa', fontSize: '12px'}}>({review.user?.email})</span></Typography>
                        <Rating value={review.rating} readOnly size="small" sx={{ color: '#00f2fe', my: 0.5 }} />
                        <Typography color="#e4e4e7">{review.comment}</Typography>
                      </Box>
                      <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteReview(review.id)}>Удалить</Button>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {tab === 3 && (
            <Box>
              {loadingOrders ? <CircularProgress sx={{ color: '#00f2fe', display: 'block', mx: 'auto' }} /> : orders.length === 0 ? <Typography color="#a1a1aa" textAlign="center">Заказов пока нет</Typography> : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {orders.map((order) => (
                    <Paper key={order.id} sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 3, borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                          <Typography color="white" fontWeight="bold">
                            Заказ № {order.id ? order.id.slice(0, 8) : 'N/A'}
                          </Typography>
                          <Typography color="#a1a1aa" variant="body2">Клиент: {order.user?.firstName || 'Неизвестно'} {order.user?.lastName || ''}</Typography>
                          <Typography color="#a1a1aa" variant="caption">{order.user?.email || 'Нет email'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          {(order.items || []).map(i => (
                            <Typography key={i.id} color="#e4e4e7" variant="caption" display="block">
                              • {i.product?.name || 'Удаленный товар'} ({i.quantity} шт)
                            </Typography>
                          ))}
                          <Typography color="#00f2fe" fontWeight="bold" sx={{ mt: 1 }}>Сумма: {order.total} ₽</Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                          <Typography color="#a1a1aa" variant="caption" display="block" sx={{ mb: 1 }}>Статус заказа:</Typography>
                          <FormControl fullWidth size="small">
                            <Select
                              value={order.status || 'В обработке'}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00f2fe' } }}
                            >
                              <MenuItem value="В обработке">В обработке</MenuItem>
                              <MenuItem value="В пути">В пути</MenuItem>
                              <MenuItem value="Доставлен">Доставлен</MenuItem>
                              <MenuItem value="Отменен">Отменен</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}