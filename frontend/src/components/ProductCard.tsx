import { Card, CardContent, CardMedia, Button, Box, Typography, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate(); 

  const imageUrl = product.imageUrl?.startsWith('http') 
    ? product.imageUrl 
    : `http://localhost:5000${product.imageUrl}`;

  return (
    <Card 
      onClick={() => navigate(`/product/${product.id}`)} 
      sx={{ 
        width: '100%',             
        height: '100%',
        display: 'flex', 
        flexDirection: 'column',   
        bgcolor: 'rgba(20, 20, 25, 0.5)',
        borderRadius: 2,
        cursor: 'pointer', 
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0, 242, 254, 0.2)'
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="240"
          image={imageUrl}
          alt={product.name}
          sx={{ objectFit: 'cover', width: '100%' }}
        />
        <Chip 
          label={`${Number(product.price).toLocaleString()} ₽`} 
          sx={{ 
            position: 'absolute', bottom: 16, right: 16, fontWeight: 'bold', fontSize: '1.1rem',
            background: 'rgba(0,0,0,0.8)', color: '#00f2fe', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(0, 242, 254, 0.3)', px: 1, py: 2.5, borderRadius: 2,
          }} 
        />
      </Box>
      
      <CardContent sx={{ flexGrow: 1, pt: 4, display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom variant="h6" component="h2" sx={{ color: '#ffffff', fontWeight: 700, lineHeight: 1.2 }}>
          {product.name}
        </Typography>
      </CardContent>

      <Box sx={{ p: 3, pt: 0, mt: 'auto' }}>
        <Button 
          variant="contained" 
          fullWidth 
          sx={{ bgcolor: '#00f2fe', color: 'black', fontWeight: 'bold', '&:hover': { bgcolor: '#4facfe' } }}
          onClick={(e) => {
            e.stopPropagation(); 
            alert('Товар добавлен в корзину!');
          }}
        >
          В корзину
        </Button>
      </Box>
    </Card>
  );
}