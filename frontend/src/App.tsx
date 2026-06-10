import { Routes, Route, Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container, Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { jwtDecode } from 'jwt-decode';

// Страницы
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Product from './pages/Product';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Footer from './components/Footer'; 
import { CartProvider, useCart } from './context/CartContext';

function AppContent() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { cartCount } = useCart();
  
  let isAdmin = false;
  try {
    if (token) {
      const decoded: { role: string } = jwtDecode(token);
      isAdmin = decoded.role === 'ADMIN';
    }
  } catch (e) {
    console.error("Ошибка при чтении токена");
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (

    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#09090b', color: 'white' }}>
      
      <AppBar position="sticky" sx={{ background: 'rgba(9, 9, 11, 0.7)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)', zIndex: 10 }}>
        <Container>
          <Toolbar disableGutters>
        
            <Typography variant="h5" component={RouterLink} to="/" sx={{ flexGrow: 1, fontWeight: 900, color: 'white', textDecoration: 'none' }}>
              TECH<span style={{ color: '#00f2fe' }}>SHOP</span>
            </Typography>
            

            <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
              <Button color="inherit" component={RouterLink} to="/catalog" sx={{ fontWeight: 'bold', '&:hover': { color: '#00f2fe' } }}>
                Каталог
              </Button>
              <Button color="inherit" component={RouterLink} to="/profile" sx={{ fontWeight: 'bold', '&:hover': { color: '#00f2fe' } }}>
                Профиль
              </Button>
            </Box>

       
            <IconButton component={RouterLink} to="/cart" sx={{ mx: 1, color: '#a1a1aa', '&:hover': { color: '#00f2fe' } }}>
              <Badge badgeContent={cartCount} color="info" sx={{ '& .MuiBadge-badge': { bgcolor: '#00f2fe', color: 'black', fontWeight: 'bold' } }}>
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

        
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
              {isAdmin && (
                <Button color="secondary" variant="outlined" component={RouterLink} to="/admin">
                  Админка
                </Button>
              )}
              
              {token ? (
                <Button variant="outlined" color="primary" onClick={handleLogout} sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { borderColor: '#f44336', color: '#f44336' } }}>
                  Выйти
                </Button>
              ) : (
                <Button variant="contained" component={RouterLink} to="/login" sx={{ bgcolor: '#00f2fe', color: 'black', fontWeight: 'bold', '&:hover': { bgcolor: '#4facfe' } }}>
                  Войти
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

    
      <Box sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />

          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><Admin /></ProtectedRoute>} />
        </Routes>
      </Box>

      <Footer />

    </Box>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}