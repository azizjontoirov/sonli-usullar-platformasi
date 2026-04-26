// ============================================================
// SONLI USULLAR PLATFORMASI - EXPRESS SERVER
// ============================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const calculationRoutes = require('./routes/calculations');

const app = express();
const PORT = process.env.PORT || 5000;

// Xavfsizlik sozlamalari
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting (DDOS dan himoya)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 daqiqa
  max: 100, // 15 daqiqada 100 ta so'rov
  message: { xato: "Juda ko'p so'rov. Iltimos 15 daqiqa kuting." }
});
app.use('/api/', limiter);

// Loglash
app.use(morgan('dev'));

// JSON parse
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ============================================================
// API MARSHRUTLARI
// ============================================================

app.use('/api/auth', authRoutes);
app.use('/api/calculations', calculationRoutes);

// Asosiy sahifa
app.get('/', (req, res) => {
  res.json({
    xabar: 'Sonli Usullar Platformasi API',
    versiya: '1.0.0',
    holat: 'Ishlamoqda',
    vaqt: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ xato: 'Sahifa topilmadi' });
});

// Global xatolik handler
app.use((err, req, res, next) => {
  console.error('Server xatosi:', err);
  res.status(500).json({ 
    xato: 'Ichki server xatosi',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Serverni ishga tushirish
app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     SONLI USULLAR PLATFORMASI - SERVER ISHLAMOQDA     ║');
  console.log('╠════════════════════════════════════════════════════════╣');
  console.log(`║  Port: ${PORT}                                        ║`);
  console.log(`║  Muhit: ${process.env.NODE_ENV || 'development'}                              ║`);
  console.log('║  API: http://localhost:' + PORT + '/api                 ║');
  console.log('╚════════════════════════════════════════════════════════╝');
});

module.exports = app;
