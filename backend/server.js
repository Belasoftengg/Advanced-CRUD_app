const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { validationResult } = require('express-validator');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// simple validation error middleware for express-validator
app.use((req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty() && req.method !== 'GET') {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
});

app.get('/', (req, res) => res.send('API OK'));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
