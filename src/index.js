const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./utils/database');
const Article = require('./models/article');

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
app.use('/articles', require('./routes/articles'));

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

// Sync database
sequelize
  .sync()
  .then((result) => {
    console.log('Database connected');
  })
  .catch((err) => console.log(err));
