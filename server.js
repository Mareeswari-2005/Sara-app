const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in .env file.');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

const mechanicsRouter = require('./routes/mechanics');
const authRouter = require('./routes/auth');

app.use('/api/mechanics', mechanicsRouter);
app.use('/api/auth', authRouter);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public','login.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname,'public', 'index.html'));
});

app.get('/mechanics.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mechanics.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public','register.html'));
});

app.get('/emergency.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public',  'emergency.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,'public', 'login.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});