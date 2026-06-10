import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Box, Typography, Button, Card, CardMedia, CardContent,
  CircularProgress, Rating 
} from '@mui/material';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  reviews?: { rating: number }[];
}

export default function Catalog() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['Все', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === 'Все' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress sx={{ color: '#00f2fe' }} /></Box>;

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 8 }, mb: { xs: 6, md: 10 } }}>
      <Typography 
        variant="h3" 
        fontWeight="900" 
        color="white" 
        sx={{ mb: { xs: 3, md: 4 }, fontSize: { xs: '2rem', md: '3rem' } }}
      >
        КАТАЛОГ
      </Typography>
      
      {/* АДАПТИВНАЯ ПАНЕЛЬ ПОИСКА И ФИЛЬТРОВ */}
      <Box sx={{ 
        bgcolor: '#141419', 
        p: { xs: 2, sm: 3 }, 
        borderRadius: 4, 
        border: '1px solid rgba(255,255,255,0.08)', 
        mb: { xs: 4, md: 6 }, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        alignItems: 'center'
      }}>
        <Box 
          component="input"
          placeholder="Поиск девайса..." 
          value={searchQuery}
          onChange={(e: any) => setSearchQuery(e.target.value)}
          sx={{
            flexGrow: 1,
            width: '100%',
            bgcolor: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            p: '16px 20px',
            color: 'white',
            fontSize: '1rem',
            outline: 'none',
            transition: '0.3s',
            '&:focus': { borderColor: '#00f2fe' }
          }}
        />
        <Box 
          component="select"
          value={selectedCategory} 
          onChange={(e: any) => setSelectedCategory(e.target.value)}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            minWidth: { sm: '200px' },
            bgcolor: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            p: '16px 20px',
            color: 'white',
            fontSize: '1rem',
            cursor: 'pointer',
            outline: 'none',
            transition: '0.3s',
            '&:focus': { borderColor: '#00f2fe' }
          }}
        >
          {categories.map((c) => (
            <option key={c} value={c} style={{ background: '#141419' }}>
              {c === 'Все' ? 'Все категории' : c}
            </option>
          ))}
        </Box>
      </Box>

      {/* СПИСОК ТОВАРОВ */}
      {filteredProducts.length === 0 ? (
        <Typography variant="h5" color="#a1a1aa" textAlign="center" sx={{ mt: 5 }}>Ничего не найдено.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
          {filteredProducts.map((product) => {
            const safeReviews = product.reviews || [];
            const avgRating = safeReviews.length > 0 ? safeReviews.reduce((sum, r) => sum + r.rating, 0) / safeReviews.length : 0;

            return (
              <Card 
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)} 
                sx={{ 
                  cursor: 'pointer', 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' }, 
                  bgcolor: '#141419', 
                  borderRadius: 4, 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  transition: '0.3s', 
                  overflow: 'hidden', // ВАЖНО: скрывает углы фото на мобилках
                  '&:hover': { borderColor: '#00f2fe', boxShadow: '0 5px 20px rgba(0,0,0,0.5)' } 
                }}
              >
                {/* КОНТЕЙНЕР ФОТО */}
                <Box sx={{ 
                  width: { xs: '100%', sm: 220 }, 
                  height: { xs: 200, sm: 220 }, 
                  bgcolor: '#ffffff', 
                  p: 2, 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0 
                }}>
                  <CardMedia 
                    component="img" 
                    image={product.imageUrl ? `http://localhost:5000${product.imageUrl}` : 'https://via.placeholder.com/200'} 
                    alt={product.name} 
                    sx={{ maxHeight: '100%', width: 'auto', objectFit: 'contain' }} 
                  />
                </Box>

                {/* ИНФОРМАЦИЯ */}
                <CardContent sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  px: { xs: 2, sm: 4 },
                  py: { xs: 2, sm: 3 }
                }}>
                  <Typography variant="h6" color="white" fontWeight="bold" sx={{ mb: 1, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="#a1a1aa" sx={{ mb: 1 }}>
                    Категория: {product.category}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={avgRating} precision={0.5} readOnly size="small" sx={{ color: '#00f2fe' }} />
                    <Typography variant="body2" color="#a1a1aa" fontWeight="bold">{avgRating.toFixed(1)}</Typography>
                  </Box>
                </CardContent>

                {/* БЛОК ЦЕНЫ И КНОПКИ */}
                <Box sx={{ 
                  width: { xs: '100%', sm: 250 }, 
                  display: 'flex', 
                  flexDirection: { xs: 'row', sm: 'column' }, 
                  justifyContent: { xs: 'space-between', sm: 'center' }, 
                  alignItems: { xs: 'center', sm: 'flex-end' }, 
                  p: { xs: 2, sm: 3 },
                  borderTop: { xs: '1px solid rgba(255,255,255,0.05)', sm: 'none' },
                  borderLeft: { xs: 'none', sm: '1px solid rgba(255,255,255,0.05)' }
                }}>
                  <Typography 
                    variant="h5" 
                    color="white" 
                    fontWeight="900" 
                    sx={{ mb: { xs: 0, sm: 2 } }}
                  >
                    {product.price} ₽
                  </Typography>
                  <Button 
                    variant="contained" 
                    disabled={product.stock === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({ ...product, quantity: 1 });
                    }}
                    sx={{ 
                      bgcolor: '#00f2fe', 
                      color: 'black', 
                      fontWeight: 'bold', 
                      py: { xs: 1, sm: 1.5 }, 
                      px: { xs: 3, sm: 0 },
                      borderRadius: 2, 
                      width: { xs: 'auto', sm: '100%' }, 
                      '&:hover': { bgcolor: '#4facfe' } 
                    }}
                  >
                    {product.stock > 0 ? 'КУПИТЬ' : 'НЕТ В НАЛИЧИИ'}
                  </Button>
                </Box>
              </Card>
            );
          })}
        </Box>
      )}
    </Container>
  );
}