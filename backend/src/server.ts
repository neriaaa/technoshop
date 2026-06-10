import app from './app'; // Импортируем настроенный Express

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});