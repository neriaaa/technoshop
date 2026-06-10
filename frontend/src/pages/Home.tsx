import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

// Настройки для анимаций (появление снизу вверх)
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function Home() {
  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* 1. ГЛАВНЫЙ ЭКРАН (HERO SECTION) */}
      <Box 
        sx={{ 
          minHeight: '80vh', 
          display: 'flex', 
          alignItems: 'center', 
          position: 'relative',
          background: 'radial-gradient(circle at center, rgba(0, 242, 254, 0.1) 0%, transparent 60%)'
        }}
      >
        <Container maxWidth="lg">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <Typography variant="h1" fontWeight="900" sx={{ color: 'white', fontSize: { xs: '3rem', md: '5rem' }, mb: 2, lineHeight: 1.1 }}>
              ТВОЙ СЕТАП. <br/>
              <span style={{ color: '#00f2fe' }}>ТВОИ ПРАВИЛА.</span>
            </Typography>
            <Typography variant="h6" sx={{ color: '#a1a1aa', mb: 4, maxWidth: '600px', fontWeight: 'normal', lineHeight: 1.6 }}>
              TECHSHOP — это магазин эксклюзивной геймерской периферии. Мы собираем лучшие девайсы со всего мира, чтобы ты доминировал в каждой катке.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                component={RouterLink} 
                to="/catalog" 
                variant="contained" 
                size="large" 
                sx={{ bgcolor: '#00f2fe', color: 'black', fontWeight: 'bold', px: 5, py: 1.5, borderRadius: 2, '&:hover': { bgcolor: '#4facfe', transform: 'scale(1.05)' }, transition: 'all 0.2s' }}
              >
                В КАТАЛОГ
              </Button>
              <Button 
                component={RouterLink} 
                to="/profile" 
                variant="outlined" 
                size="large" 
                sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white', px: 5, py: 1.5, borderRadius: 2, '&:hover': { borderColor: '#00f2fe', color: '#00f2fe' } }}
              >
                ПРОФИЛЬ
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* 2. ИНФОРМАЦИЯ О МАГАЗИНЕ */}
      <Box sx={{ py: 10, bgcolor: '#09090b' }}>
        <Container maxWidth="lg">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h3" fontWeight="900" color="white" sx={{ mb: 3 }}>
                  БОЛЬШЕ, ЧЕМ <br /> ПРОСТО <span style={{ color: '#00f2fe' }}>МАГАЗИН</span>
                </Typography>
                <Typography variant="body1" color="#a1a1aa" sx={{ mb: 2, fontSize: '1.1rem', lineHeight: 1.7 }}>
                  Мы основали TECHSHOP в 2024 году, потому что устали от скучного ассортимента обычных сетевых магазинов. Наша цель — дать геймерам и профессионалам доступ к редким, качественным и кастомным девайсам.
                </Typography>
                <Typography variant="body1" color="#a1a1aa" sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                  Каждая мышь, клавиатура или коврик, которые попадают в наш каталог, проходят строгий отбор. Мы продаем только то, чем пользуемся сами.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ position: 'relative', height: '400px', borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=2000&auto=format&fit=crop" 
                    alt="Киберспорт" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} 
                  />
                  <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #09090b, transparent)' }} />
                </Box>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* 3. НАШИ ПРЕИМУЩЕСТВА (ГРИД С ИКОНКАМИ) */}
      <Box sx={{ py: 10, bgcolor: '#141419', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Container maxWidth="lg">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}>
            <Typography variant="h3" fontWeight="900" color="white" textAlign="center" sx={{ mb: 8 }}>
              ПОЧЕМУ ВЫБИРАЮТ НАС
            </Typography>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}>
            <Grid container spacing={4}>
              {/* Карточка 1 */}
              <Grid item xs={12} sm={6} md={3}>
                <motion.div variants={fadeUp}>
                  <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', height: '100%', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-10px)', borderColor: '#00f2fe' } }}>
                    <SportsEsportsIcon sx={{ fontSize: 50, color: '#00f2fe', mb: 2 }} />
                    <Typography variant="h6" color="white" fontWeight="bold" sx={{ mb: 1 }}>Для про-игроков</Typography>
                    <Typography color="#a1a1aa" variant="body2">Девайсы с минимальной задержкой и идеальными сенсорами.</Typography>
                  </Paper>
                </motion.div>
              </Grid>

              {/* Карточка 2 */}
              <Grid item xs={12} sm={6} md={3}>
                <motion.div variants={fadeUp}>
                  <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', height: '100%', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-10px)', borderColor: '#00f2fe' } }}>
                    <SecurityIcon sx={{ fontSize: 50, color: '#00f2fe', mb: 2 }} />
                    <Typography variant="h6" color="white" fontWeight="bold" sx={{ mb: 1 }}>Оригинал 100%</Typography>
                    <Typography color="#a1a1aa" variant="body2">Работаем только с официальными поставщиками. Никаких подделок.</Typography>
                  </Paper>
                </motion.div>
              </Grid>

              {/* Карточка 3 */}
              <Grid item xs={12} sm={6} md={3}>
                <motion.div variants={fadeUp}>
                  <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', height: '100%', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-10px)', borderColor: '#00f2fe' } }}>
                    <LocalShippingIcon sx={{ fontSize: 50, color: '#00f2fe', mb: 2 }} />
                    <Typography variant="h6" color="white" fontWeight="bold" sx={{ mb: 1 }}>Быстрая доставка</Typography>
                    <Typography color="#a1a1aa" variant="body2">Отправляем заказы в день оформления в любую точку страны.</Typography>
                  </Paper>
                </motion.div>
              </Grid>

              {/* Карточка 4 */}
              <Grid item xs={12} sm={6} md={3}>
                <motion.div variants={fadeUp}>
                  <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', height: '100%', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-10px)', borderColor: '#00f2fe' } }}>
                    <SupportAgentIcon sx={{ fontSize: 50, color: '#00f2fe', mb: 2 }} />
                    <Typography variant="h6" color="white" fontWeight="bold" sx={{ mb: 1 }}>Поддержка 24/7</Typography>
                    <Typography color="#a1a1aa" variant="body2">Поможем настроить софт, подобрать коврик под мышь и ответим на вопросы.</Typography>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}