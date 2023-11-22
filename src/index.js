const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;

// Hello World!
app.get('/', (req, res) => {
  res.send('Hello World 🌏!');
});

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT} 🔥`);
});
