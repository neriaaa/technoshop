import { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Пароли не совпадают!');
    }

    setIsLoading(true);
    try {
      // Отправляем данные на бэкенд (убедись, что путь к роуту регистрации верный)
      await api.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      
      // После успешной регистрации отправляем пользователя на страницу входа
      alert('Регистрация прошла успешно! Теперь вы можете войти.');
      navigate('/login');
    } catch (err: any) {
      console.error('Ошибка регистрации:', err);
      setError(err.response?.data?.message || 'Ошибка при регистрации. Проверьте данные.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Box sx={{ bgcolor: 'rgba(20, 20, 25, 0.8)', p: 5, borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <Typography variant="h4" fontWeight="900" sx={{ color: 'white', mb: 1, textAlign: 'center' }}>
          СОЗДАТЬ АККАУНТ
        </Typography>
        <Typography variant="body1" sx={{ color: '#a1a1aa', mb: 4, textAlign: 'center' }}>
          Присоединяйтесь к TECHSHOP
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField 
              fullWidth label="Имя" name="firstName" required
              value={formData.firstName} onChange={handleChange}
              sx={{ input: { color: 'white' }, label: { color: '#a1a1aa' }, fieldset: { borderColor: 'rgba(255,255,255,0.2)' } }}
            />
            <TextField 
              fullWidth label="Фамилия" name="lastName" required
              value={formData.lastName} onChange={handleChange}
              sx={{ input: { color: 'white' }, label: { color: '#a1a1aa' }, fieldset: { borderColor: 'rgba(255,255,255,0.2)' } }}
            />
          </Box>

          <TextField 
            fullWidth label="Email" name="email" type="email" required
            value={formData.email} onChange={handleChange}
            sx={{ mb: 3, input: { color: 'white' }, label: { color: '#a1a1aa' }, fieldset: { borderColor: 'rgba(255,255,255,0.2)' } }}
          />

          <TextField 
            fullWidth label="Пароль" name="password" type="password" required
            value={formData.password} onChange={handleChange}
            sx={{ mb: 3, input: { color: 'white' }, label: { color: '#a1a1aa' }, fieldset: { borderColor: 'rgba(255,255,255,0.2)' } }}
          />

          <TextField 
            fullWidth label="Подтвердите пароль" name="confirmPassword" type="password" required
            value={formData.confirmPassword} onChange={handleChange}
            sx={{ mb: 4, input: { color: 'white' }, label: { color: '#a1a1aa' }, fieldset: { borderColor: 'rgba(255,255,255,0.2)' } }}
          />

          <Button 
            type="submit" fullWidth variant="contained" size="large" disabled={isLoading}
            sx={{ py: 1.5, mb: 3, bgcolor: '#00f2fe', color: 'black', fontWeight: 'bold', '&:hover': { bgcolor: '#4facfe' } }}
          >
            {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
          </Button>
        </form>

        <Typography textAlign="center" sx={{ color: '#a1a1aa' }}>
          Уже есть аккаунт?{' '}
          <Box component={RouterLink} to="/login" sx={{ color: '#00f2fe', textDecoration: 'none', fontWeight: 'bold', '&:hover': { textDecoration: 'underline' } }}>
            Войти
          </Box>
        </Typography>
      </Box>
    </Container>
  );
}