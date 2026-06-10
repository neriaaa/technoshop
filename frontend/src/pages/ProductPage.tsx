import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Grid, Typography, Box, Button, Chip, Avatar, TextField } from '@mui/material';
import api from '../api/axios';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  stock: number;
}

export default function ProductPage() {
  const { id } = useParams(); // Берем ID товара из адресной строки
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <Typography sx={{ color: 'white', textAlign: 'center', mt: 10 }}>Загрузка...</Typography>;

  const imageUrl = product.imageUrl?.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`;

  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      <Grid container spacing={6}>
        {/* Левая колонка: Фотография */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={imageUrl}
            alt={product.name}
            sx={{ width: '100%', borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
          />
        </Grid>

        {/* Правая колонка: Информация о товаре */}
        <Grid item xs={12} md={6}>
          <Chip label={product.category} sx={{ bgcolor: 'rgba(0, 242, 254, 0.2)', color: '#00f2fe', mb: 2 }} />
          <Typography variant="h3" fontWeight="900" sx={{ color: 'white', mb: 2 }}>{product.name}</Typography>
          <Typography variant="h4" sx={{ color: '#00f2fe', fontWeight: 'bold', mb: 4 }}>
            {Number(product.price).toLocaleString()} ₽
          </Typography>
          
          <Typography variant="body1" sx={{ color: '#a1a1aa', mb: 4, lineHeight: 1.8, fontSize: '1.1rem' }}>
            {product.description}
          </Typography>

          <Typography variant="body2" sx={{ color: product.stock > 0 ? '#4caf50' : '#ff4c4c', mb: 4 }}>
            {product.stock > 0 ? `В наличии: ${product.stock} шт.` : 'Нет в наличии'}
          </Typography>

          <Button variant="contained" size="large" sx={{ py: 2, px: 6, fontSize: '1.1rem', bgcolor: '#00f2fe', color: 'black', fontWeight: 'bold', '&:hover': { bgcolor: '#4facfe' } }}>
            Добавить в корзину
          </Button>
        </Grid>
      </Grid>

      {/* Секция отзывов */}
      <Box sx={{ mt: 10, p: 4, bgcolor: 'rgba(20, 20, 25, 0.5)', borderRadius: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: 'white', mb: 4 }}>Отзывы</Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Avatar sx={{ bgcolor: '#00f2fe' }}>Ы</Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <TextField fullWidth multiline rows={3} placeholder="Напишите свой отзыв..." variant="outlined" sx={{ input: { color: 'white' }, textarea: { color: 'white' }, fieldset: { borderColor: 'rgba(255,255,255,0.2)' } }} />
            <Button variant="outlined" sx={{ mt: 2, color: '#00f2fe', borderColor: '#00f2fe' }}>Отправить</Button>
          </Box>
        </Box>

        <Typography sx={{ color: '#a1a1aa', textAlign: 'center' }}>Здесь скоро появятся отзывы покупателей.</Typography>
      </Box>
    </Container>
  );
}