// JWT autentifikatsiya middleware
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_me';

// Token tekshiruvi
const authenticate = async (req, res, next) => {
  try {
    // Headerdan tokenni olish
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        xato: 'Avtorizatsiya tokeni topilmadi' 
      });
    }

    const token = authHeader.split(' ')[1];

    // Tokenni tekshirish
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });

    // Foydalanuvchini bazadan tekshirish
    const result = await query(
      'SELECT id, username, email, full_name, role FROM users WHERE id = $1 AND is_active = true',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        xato: 'Foydalanuvchi topilmadi yoki bloklangan' 
      });
    }

    // Foydalanuvchi ma'lumotlarini request ga qo'shish
    req.user = result.rows[0];
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        xato: 'Token muddati tugagan. Qayta kiring.' 
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        xato: "Noto'g'ri token" 
      });
    }
    console.error('Auth xatosi:', error);
    res.status(500).json({ xato: 'Server xatosi' });
  }
};

// Rol tekshiruvi
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        xato: "Ruxsat yo'q. Faqat " + roles.join(', ') + " lar uchun." 
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
