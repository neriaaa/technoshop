import { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, List, ListItem, ListItemText, ListItemAvatar, Avatar, 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, MenuItem 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import api from '../../api/axios';

// Интерфейс товара
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  imageUrl: string;
}

// Категории
const CATEGORIES = [
  'Мыши', 'Клавиатуры', 'Наушники', 'Мониторы', 
  'Микрофоны', 'Ковры', 'Комплектующие', 'Разное'
];

export default function EditProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = () => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Ошибка загрузки товаров:', err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenEdit = (product: Product) => setEditingProduct(product);
  const handleCloseEdit = () => setEditingProduct(null);

  const handleChange = (field: keyof Product, value: any) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [field]: value });
    }
  };

  // ИСПРАВЛЕНО: Теперь явно передаем токен авторизации при загрузке картинки
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token'); // Достаем токен
      const res = await api.post('/products/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Отправляем бэкенду
        }
      });
      handleChange('imageUrl', res.data.imageUrl);
    } catch (error: any) {
      console.error('Ошибка загрузки:', error);
      alert(`Ошибка: ${error.response?.data?.message || 'Нет доступа. Перезайди в админку.'}`);
    }
  };

  // ИСПРАВЛЕНО: Явно передаем токен при сохранении
  const handleSave = async () => {
    if (!editingProduct) return;
    try {
      const token = localStorage.getItem('token'); // Достаем токен
      await api.put(`/products/${editingProduct.id}`, editingProduct, {
        headers: { 'Authorization': `Bearer ${token}` } // Отправляем бэкенду
      });
      fetchProducts();
      handleCloseEdit();
    } catch (error: any) {
      console.error('Ошибка при обновлении:', error);
      alert(`Ошибка сохранения: ${error.response?.data?.message || 'Нет доступа'}`);
    }
  };

  // ИСПРАВЛЕНО: Явно передаем токен при удалении
  const handleDelete = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/products/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchProducts();
      if (editingProduct?.id === id) handleCloseEdit();
    } catch (error: any) {
      console.error('Ошибка при удалении:', error);
      alert(`Ошибка удаления: ${error.response?.data?.message || 'Нет доступа'}`);
    }
  };

  const getImageUrl = (url: string) => url?.startsWith('http') ? url : `http://localhost:5000${url}`;

  return (
    <Box sx={{ p: 2 }}>
      {/* --- СТРОКА ПОИСКА --- */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Поиск товара по названию..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ 
          mb: 4, 
          input: { color: 'white' }, 
          fieldset: { borderColor: 'rgba(0, 242, 254, 0.5)' },
          '&:hover fieldset': { borderColor: '#00f2fe !important' }
        }}
      />

      {/* --- СПИСОК ТОВАРОВ --- */}
      <List sx={{ bgcolor: 'rgba(20, 20, 25, 0.5)', borderRadius: 2 }}>
        {filteredProducts.map((product) => (
          <ListItem 
            key={product.id}
            sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}
            secondaryAction={
              <Box>
                <IconButton edge="end" onClick={() => handleOpenEdit(product)} sx={{ color: '#00f2fe', mr: 1 }}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDelete(product.id)} sx={{ color: '#ff4c4c' }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
          >
            <ListItemAvatar>
              <Avatar variant="rounded" src={getImageUrl(product.imageUrl)} sx={{ width: 56, height: 56, mr: 2 }} />
            </ListItemAvatar>
            <ListItemText 
              primary={<Typography sx={{ color: 'white', fontWeight: 'bold' }}>{product.name}</Typography>}
              secondary={<Typography sx={{ color: '#00f2fe' }}>{Number(product.price).toLocaleString()} ₽ • В наличии: {product.stock || 0}</Typography>}
            />
          </ListItem>
        ))}
        {filteredProducts.length === 0 && (
          <Typography sx={{ color: '#a1a1aa', textAlign: 'center', py: 4 }}>Товары не найдены</Typography>
        )}
      </List>

      {/* --- ВСПЛЫВАЮЩЕЕ ОКНО РЕДАКТИРОВАНИЯ --- */}
      <Dialog 
        open={!!editingProduct} 
        onClose={handleCloseEdit} 
        maxWidth="sm" 
        fullWidth 
        PaperProps={{ sx: { bgcolor: '#1a1a24', color: 'white', borderRadius: 3 } }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)', fontWeight: 'bold' }}>
          Редактирование товара
        </DialogTitle>
        
        <DialogContent sx={{ mt: 1 }}>
          {editingProduct && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
              <TextField 
                label="Название" fullWidth value={editingProduct.name} 
                onChange={(e) => handleChange('name', e.target.value)}
                sx={{ input: { color: 'white' }, label: { color: '#a1a1aa' } }}
              />
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField 
                  label="Цена (₽)" type="number" fullWidth value={editingProduct.price} 
                  onChange={(e) => handleChange('price', e.target.value)}
                  sx={{ input: { color: 'white' }, label: { color: '#a1a1aa' } }}
                />
                <TextField 
                  label="На складе" type="number" fullWidth value={editingProduct.stock || 0} 
                  onChange={(e) => handleChange('stock', e.target.value)}
                  sx={{ input: { color: 'white' }, label: { color: '#a1a1aa' } }}
                />
              </Box>

              <TextField 
                select
                label="Категория" 
                fullWidth 
                value={editingProduct.category || ''} 
                onChange={(e) => handleChange('category', e.target.value)}
                sx={{ 
                  label: { color: '#a1a1aa' },
                  '& .MuiSelect-select': { color: 'white' }
                }}
                SelectProps={{
                  MenuProps: { PaperProps: { sx: { bgcolor: '#1a1a24', color: 'white' } } }
                }}
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 2 }}>
                <Avatar 
                  variant="rounded" 
                  src={getImageUrl(editingProduct.imageUrl)} 
                  sx={{ width: 64, height: 64, bgcolor: 'rgba(0,0,0,0.5)' }} 
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" sx={{ color: '#a1a1aa', mb: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '250px' }}>
                    {editingProduct.imageUrl || 'Картинка не загружена'}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    component="label" 
                    startIcon={<PhotoCameraIcon />}
                    sx={{ color: '#00f2fe', borderColor: '#00f2fe', '&:hover': { borderColor: '#4facfe', color: '#4facfe' } }}
                  >
                    Загрузить фото
                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                  </Button>
                </Box>
              </Box>

              <TextField 
                label="Описание" fullWidth multiline rows={4} value={editingProduct.description} 
                onChange={(e) => handleChange('description', e.target.value)}
                sx={{ textarea: { color: 'white' }, label: { color: '#a1a1aa' } }}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Button onClick={handleCloseEdit} sx={{ color: '#a1a1aa', fontWeight: 'bold' }}>
            Отмена
          </Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#00f2fe', color: 'black', fontWeight: 'bold', '&:hover': { bgcolor: '#4facfe' } }}>
            Сохранить изменения
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}