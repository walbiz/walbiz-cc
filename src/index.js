import express from 'express';
import dotenv from 'dotenv';
import articleRoutes from './routes/articles.js';
import wishlistsRoutes from './routes/wishlists.js';
import userRoutes from './routes/users.js';
import uploadRoutes from './routes/uploads.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Hello World!
app.get('/', (req, res, next) => {
  res.send('Hello World 🌏!');
});

// CRUD routes
app.use('/users', userRoutes);
app.use('/wishlists', wishlistsRoutes);
app.use('/articles', articleRoutes);
app.use('/uploads', uploadRoutes);

// Error handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT} 🔥`);
});
