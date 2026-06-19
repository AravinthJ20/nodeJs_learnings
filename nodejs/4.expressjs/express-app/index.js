const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Move to next handler
});

app.get('/', (req, res) => {
  res.send('Welcome to Express!');
});

app.get('/about', (req, res) => {
  res.send('About Page');
});

app.get('/api/user', (req, res) => {
  res.json({ name: 'Logesh', age: 25 });
});

app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
