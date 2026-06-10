import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Box, Typography, Button, CircularProgress, Rating, Divider, Paper, TextField } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../api/axios';
import { useCart } from '../context/CartContext'; // Импортируем корзину

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: { firstName: string; lastName: string }; 
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  reviews?: Review[]; 
}

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Подключаем функцию добавления
  
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [newRating, setNewRating] = useState<number | null>(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthenticated = !!localStorage.getItem('token');

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Ошибка загрузки товара:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleReviewSubmit = async () => {
    if (!newComment.trim()) {
      alert('Ошибка: Пожалуйста, напишите текст отзыва перед отправкой!');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await api.post(`/products/${id}/reviews`, { rating: newRating, comment: newComment });
      alert('Успех: Отзыв успешно добавлен!');
      setNewComment('');
      setNewRating(5);
      fetchProduct(); 
    } catch (error: any) {
      alert(`Ошибка при отправке отзыва: ${error.response?.data?.message || 'Неизвестная ошибка'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress sx={{ color: '#00f2fe' }} /></Box>;
  if (!product) return <Typography variant="h5" color="white" textAlign="center" sx={{ mt: 10 }}>Товар не найден :(</Typography>;

  const safeReviews = product.reviews || [];
  const avgRating = safeReviews.length > 0 ? safeReviews.reduce((sum, r) => sum + r.rating, 0) / safeReviews.length : 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ color: '#a1a1aa', mb: 3, '&:hover': { color: '#00f2fe' } }}>Назад в каталог</Button>

      <Paper sx={{ bgcolor: '#141419', p: 4, borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)', mb: 5 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={5}>
            <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 3, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={product.imageUrl ? `http://localhost:5000${product.imageUrl}` : 'https://via.placeholder.com/400'} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </Box>
          </Grid>

          <Grid item xs={12} md={7} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" color="white" fontWeight="900" gutterBottom sx={{ lineHeight: 1.2 }}>{product.name}</Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Rating value={avgRating} precision={0.5} readOnly sx={{ color: '#00f2fe' }} />
              <Typography variant="h6" color="white" fontWeight="bold">{avgRating > 0 ? avgRating.toFixed(1) : '0'}</Typography>
              <Typography variant="body2" color="#a1a1aa">({safeReviews.length} отзывов)</Typography>
              <Typography variant="body2" color="#a1a1aa" sx={{ ml: 'auto' }}>Категория: {product.category}</Typography>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

            <Typography variant="h3" color="#00f2fe" fontWeight="bold" sx={{ mb: 1 }}>{product.price} ₽</Typography>
            <Typography variant="body2" color={product.stock > 0 ? '#4caf50' : '#f44336'} sx={{ mb: 4 }}>
              {product.stock > 0 ? `В наличии: ${product.stock} шт.` : 'Нет в наличии'}
            </Typography>

            <Typography variant="body1" color="#a1a1aa" sx={{ mb: 4, flexGrow: 1, whiteSpace: 'pre-line' }}>{product.description || 'Описание отсутствует.'}</Typography>

            <Button 
              variant="contained" 
              size="large" 
              disabled={product.stock === 0} 
              onClick={() => {
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  imageUrl: product.imageUrl,
                  quantity: 1,
                  stock: product.stock
                });
                alert('Товар добавлен в корзину!');
              }}
              sx={{ bgcolor: '#00f2fe', color: 'black', fontWeight: 'bold', py: 2, borderRadius: 2, '&:hover': { bgcolor: '#4facfe' } }}
            >
              ДОБАВИТЬ В КОРЗИНУ
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" color="white" fontWeight="bold" sx={{ mb: 3 }}>Отзывы покупателей</Typography>
        
        {isAuthenticated ? (
          <Paper sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 3, mb: 4, borderRadius: 3, border: '1px solid rgba(0,242,254,0.3)' }}>
            <Typography color="white" fontWeight="bold" sx={{ mb: 2 }}>Оставить отзыв</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography color="#a1a1aa">Ваша оценка:</Typography>
              <Rating value={newRating} onChange={(_, v) => setNewRating(v)} sx={{ color: '#00f2fe' }} />
            </Box>
            <TextField fullWidth multiline rows={3} placeholder="Расскажите о впечатлениях от товара..." value={newComment} onChange={(e) => setNewComment(e.target.value)} sx={{ mb: 2, textarea: { color: 'white' }, fieldset: { borderColor: 'rgba(255,255,255,0.2)' }, '& .MuiOutlinedInput-root:hover fieldset': { borderColor: '#00f2fe' } }} />
            <Button type="button" variant="contained" onClick={handleReviewSubmit} disabled={isSubmitting} sx={{ bgcolor: '#00f2fe', color: 'black', fontWeight: 'bold', px: 4, py: 1.2, borderRadius: 2, '&:hover': { bgcolor: '#4facfe' } }}>
              {isSubmitting ? 'Отправка...' : 'Отправить'}
            </Button>
          </Paper>
        ) : (
          <Typography color="#a1a1aa" sx={{ mb: 4 }}>Войдите в аккаунт, чтобы оставить отзыв.</Typography>
        )}

        <Paper sx={{ bgcolor: '#141419', p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
          {safeReviews.length === 0 ? (
            <Typography color="#a1a1aa" textAlign="center" sx={{ py: 2 }}>Пока отзывов нет. Будьте первыми!</Typography>
          ) : (
            safeReviews.map((r, index) => (
              <Box key={r.id} sx={{ mb: index !== safeReviews.length - 1 ? 3 : 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="white" fontWeight="bold">{r.user?.firstName || 'Аноним'} {r.user?.lastName || ''}</Typography>
                  <Typography color="#a1a1aa" variant="body2">{new Date(r.createdAt).toLocaleDateString('ru-RU')}</Typography>
                </Box>
                <Rating value={r.rating} readOnly size="small" sx={{ color: '#00f2fe', mb: 1 }} />
                <Typography color="#e4e4e7" sx={{ whiteSpace: 'pre-line' }}>{r.comment}</Typography>
                {index !== safeReviews.length - 1 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mt: 3 }} />}
              </Box>
            ))
          )}
        </Paper>
      </Box>
    </Container>
  );
}