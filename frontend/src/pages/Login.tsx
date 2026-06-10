import { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Paper } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы при отправке формы
    try {
      // Отправляем запрос на наш бэкенд
      const res = await api.post('/auth/login', { email, password });
      
      // ПРЯЧЕМ ТОКЕН В СЕЙФ БРАУЗЕРА
      localStorage.setItem('token', res.data.token);
      
      alert('Успешный вход!');
      navigate('/'); // Перекидываем пользователя обратно на главную (витрину)
    } catch (error: any) {
      // Выводим реальное сообщение с бэкенда!
      const errorMessage = error.response?.data?.message || 'Ошибка соединения с сервером';
      alert(`Ошибка при входе: ${errorMessage}`);
      console.error(error);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
          Вход в аккаунт
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Пароль"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, mb: 2, borderRadius: 2 }}
          >
            Войти
          </Button>

          <Typography textAlign="center" sx={{ color: '#a1a1aa', mt: 3 }}>
            Нет аккаунта?{' '}
            <Box 
              component={RouterLink} 
              to="/register" 
              sx={{ color: '#00f2fe', textDecoration: 'none', fontWeight: 'bold', '&:hover': { textDecoration: 'underline' } }}
            >
              Зарегистрироваться
            </Box>
          </Typography>

        </Box>
      </Paper>
    </Container>
  );
}