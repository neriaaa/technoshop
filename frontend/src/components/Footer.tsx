import { Box, Container, Grid, Typography, Link as MuiLink, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import TelegramIcon from '@mui/icons-material/Telegram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: '#09090b', py: 6, borderTop: '1px solid rgba(255,255,255,0.05)', mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Логотип и описание */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ fontWeight: 900, color: 'white', mb: 2, textDecoration: 'none' }}>
              TECH<span style={{ color: '#00f2fe' }}>SHOP</span>
            </Typography>
            <Typography variant="body2" color="#a1a1aa" sx={{ mb: 2, lineHeight: 1.6 }}>
              Эксклюзивная геймерская периферия для тех, кто не согласен на компромиссы. Играй и побеждай с лучшими девайсами со всего мира.
            </Typography>
          </Grid>

          {/* Быстрые ссылки */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" color="white" fontWeight="bold" sx={{ mb: 2 }}>Навигация</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <MuiLink component={RouterLink} to="/" color="#a1a1aa" underline="none" sx={{ '&:hover': { color: '#00f2fe' } }}>Главная</MuiLink>
              <MuiLink component={RouterLink} to="/catalog" color="#a1a1aa" underline="none" sx={{ '&:hover': { color: '#00f2fe' } }}>Каталог товаров</MuiLink>
              <MuiLink component={RouterLink} to="/cart" color="#a1a1aa" underline="none" sx={{ '&:hover': { color: '#00f2fe' } }}>Корзина</MuiLink>
              <MuiLink component={RouterLink} to="/profile" color="#a1a1aa" underline="none" sx={{ '&:hover': { color: '#00f2fe' } }}>Личный кабинет</MuiLink>
            </Box>
          </Grid>

          {/* Контакты и соцсети */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" color="white" fontWeight="bold" sx={{ mb: 2 }}>Контакты</Typography>
            <Typography variant="body2" color="#a1a1aa" sx={{ mb: 1 }}>Email: support@techshop.ru</Typography>
            <Typography variant="body2" color="#a1a1aa" sx={{ mb: 2 }}>Телефон: 8 (800) 555-35-35</Typography>
            
            <Box sx={{ display: 'flex', gap: 1, ml: -1 }}>
              <IconButton sx={{ color: '#a1a1aa', '&:hover': { color: '#00f2fe', bgcolor: 'rgba(0, 242, 254, 0.1)' } }}>
                <TelegramIcon />
              </IconButton>
              <IconButton sx={{ color: '#a1a1aa', '&:hover': { color: '#ff0000', bgcolor: 'rgba(255, 0, 0, 0.1)' } }}>
                <YouTubeIcon />
              </IconButton>
              <IconButton sx={{ color: '#a1a1aa', '&:hover': { color: '#ffffff', bgcolor: 'rgba(255, 255, 255, 0.1)' } }}>
                <GitHubIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Копирайт */}
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.05)', mt: 6, pt: 3, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" color="#a1a1aa">
            © {new Date().getFullYear()} TECHSHOP. Все права защищены.
          </Typography>
          <Typography variant="body2" color="#a1a1aa">
            Разработано с ❤️
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}