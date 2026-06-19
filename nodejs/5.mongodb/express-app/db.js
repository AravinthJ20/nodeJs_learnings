const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/userdb')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ DB Connection Error:', err));
