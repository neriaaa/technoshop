import { useState } from 'react';
import { TextField, Button, Box, RadioGroup, FormControlLabel, Radio, Typography, Autocomplete } from '@mui/material';
import api from '../../api/axios';

export default function AddProductForm() {
  const [useFile, setUseFile] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const [product, setProduct] = useState({ 
    name: '', 
    slug: '',
    description: '',
    price: '', 
    stock: '',
    category: 'Мыши',
    imageUrl: '' 
  });

  // Базовый список категорий для подсказок
  const defaultCategories = ['Мыши', 'Клавиатуры', 'Мониторы', 'Наушники', 'Коврики', 'Комплектующие'];

  // Умная функция транслитерации для слага
  const generateSlug = (name: string) => {
    const converter: Record<string, string> = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
      'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
      'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
      'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ь': '', 'ы': 'y', 'ъ': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
      'А': 'a', 'Б': 'b', 'В': 'v', 'Г': 'g', 'Д': 'd', 'Е': 'e', 'Ё': 'e', 'Ж': 'zh',
      'З': 'z', 'И': 'i', 'Й': 'y', 'К': 'k', 'Л': 'l', 'М': 'm', 'Н': 'n', 'О': 'o',
      'П': 'p', 'Р': 'r', 'С': 's', 'Т': 't', 'У': 'u', 'Ф': 'f', 'Х': 'h', 'Ц': 'ts',
      'Ч': 'ch', 'Ш': 'sh', 'Щ': 'sch', 'Ь': '', 'Ы': 'y', 'Ъ': '', 'Э': 'e', 'Ю': 'yu', 'Я': 'ya'
    };

    const transliteratedName = name.split('').map(char => converter[char] || char).join('');

    return transliteratedName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') 
      .replace(/[^\w\-]+/g, '') 
      .replace(/\-\-+/g, '-'); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    let finalImageUrl = product.imageUrl;

    try {
      if (useFile && file) {
        const formData = new FormData();
        formData.append('image', file);
        const res = await api.post('/products/upload', formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}` 
          }
        });
        finalImageUrl = res.data.imageUrl;
      }

      const productData = {
        ...product,
        imageUrl: finalImageUrl,
        price: parseFloat(product.price),
        stock: parseInt(product.stock),
      };

      await api.post('/products', productData, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Товар успешно добавлен!');
      
      setProduct({ name: '', slug: '', description: '', price: '', stock: '', category: 'Мыши', imageUrl: '' });
      setFile(null);
    } catch (error: any) {
      console.error(error);
      alert('Ошибка при сохранении: ' + (error.response?.data?.message || 'Проверьте данные'));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" sx={{ color: 'white' }}>Основные данные</Typography>
      
      <TextField 
        label="Название" 
        fullWidth 
        value={product.name} 
        onChange={(e) => {
          const newName = e.target.value;
          setProduct({ ...product, name: newName, slug: generateSlug(newName) });
        }} 
      />
      
      <TextField 
        label="URL-слаг" 
        fullWidth 
        value={product.slug} 
        onChange={(e) => setProduct({...product, slug: e.target.value})} 
      />
      
      <TextField 
        label="Описание" 
        fullWidth 
        multiline 
        rows={3} 
        value={product.description} 
        onChange={(e) => setProduct({...product, description: e.target.value})} 
      />
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField 
          label="Цена (₽)" 
          type="number" 
          fullWidth 
          value={product.price} 
          onChange={(e) => setProduct({...product, price: e.target.value})} 
        />
        <TextField 
          label="На складе (шт)" 
          type="number" 
          fullWidth 
          value={product.stock} 
          onChange={(e) => setProduct({...product, stock: e.target.value})} 
        />
      </Box>

      {/* НОВЫЙ БЛОК: Умный выбор или ввод категории */}
      <Autocomplete
        freeSolo
        options={defaultCategories}
        value={product.category}
        onChange={(_, newValue) => {
          setProduct({ ...product, category: newValue || '' });
        }}
        onInputChange={(_, newInputValue) => {
          setProduct({ ...product, category: newInputValue });
        }}
        renderInput={(params) => (
          <TextField 
            {...params} 
            label="Категория (выберите из списка или напишите новую)" 
            fullWidth 
            required 
          />
        )}
      />

      <Typography variant="h6" sx={{ color: 'white', mt: 2 }}>Изображение</Typography>
      <RadioGroup row value={useFile.toString()} onChange={(e) => setUseFile(e.target.value === 'true')}>
        <FormControlLabel value="false" control={<Radio />} label="Ссылка" sx={{ color: 'white' }} />
        <FormControlLabel value="true" control={<Radio />} label="Файл с ПК" sx={{ color: 'white' }} />
      </RadioGroup>

      {useFile ? (
        <Button variant="outlined" component="label" sx={{ py: 2 }}>
          {file ? file.name : "Выбрать файл"}
          <input type="file" hidden onChange={(e) => e.target.files && setFile(e.target.files[0])} />
        </Button>
      ) : (
        <TextField label="Ссылка на картинку" fullWidth value={product.imageUrl} onChange={(e) => setProduct({...product, imageUrl: e.target.value})} />
      )}
      
      <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>
        Сохранить товар
      </Button>
    </Box>
  );
}