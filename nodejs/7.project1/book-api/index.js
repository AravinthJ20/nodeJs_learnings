const express = require('express');
require('./db');
const bookRoutes = require('./routes/bookRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/books', bookRoutes);
app.use(errorHandler);

app.listen(3000, () => console.log('📘 Book API running on http://localhost:3000'));
