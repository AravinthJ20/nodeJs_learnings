const express = require('express');
const mongoose = require('./db');
const app = express();

app.use(express.json());
app.use('/api/users', require('./routes/userRoutes'));

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
