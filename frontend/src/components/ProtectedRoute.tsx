import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface Props {
  children: JSX.Element;
  requireAdmin?: boolean; // Добавляем переключатель "Только для админов"
}

export default function ProtectedRoute({ children, requireAdmin = false }: Props) {
  const token = localStorage.getItem('token');

  // Если вообще не вошел в аккаунт — отправляем на логин
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Если маршрут требует прав администратора
  if (requireAdmin) {
    try {
      const decoded: { role: string } = jwtDecode(token);
      if (decoded.role !== 'ADMIN') {
        return <Navigate to="/" replace />; // Обычного юзера кидаем на главную
      }
    } catch (error) {
      return <Navigate to="/login" replace />;
    }
  }
  return children;
}