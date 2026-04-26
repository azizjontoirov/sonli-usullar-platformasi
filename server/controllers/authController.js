// Autentifikatsiya kontrolleri
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_me';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '15m';

// Token yaratish
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES,
    algorithm: 'HS256'
  });
};

// Ro'yxatdan o'tish
const register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Validatsiya
    if (!username || !email || !password) {
      return res.status(400).json({ 
        xato: "Barcha maydonlarni to'ldiring: username, email, parol" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        xato: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" 
      });
    }

    // Email formatini tekshirish
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ xato: "Noto'g'ri email formati" });
    }

    // Foydalanuvchi mavjudligini tekshirish
    const existingUser = await query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ 
        xato: "Bu username yoki email allaqachon band" 
      });
    }

    // Parolni hashlash
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Foydalanuvchini yaratish
    const result = await query(
      `INSERT INTO users (username, email, password_hash, full_name) 
       VALUES ($1, $2, $3, $4) RETURNING id, username, email, full_name, role`,
      [username, email, passwordHash, fullName || username]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    res.status(201).json({
      xabar: "Ro'yxatdan o'tish muvaffaqiyatli",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Register xatosi:', error);
    res.status(500).json({ xato: "Server xatosi. Iltimos keyinroq urinib ko'ring." });
  }
};

// Tizimga kirish
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        xato: "Username va parolni kiriting" 
      });
    }

    // Foydalanuvchini topish
    const result = await query(
      'SELECT id, username, email, password_hash, full_name, role, is_active FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        xato: "Username yoki parol noto'g'ri" 
      });
    }

    const user = result.rows[0];

    // Faolligini tekshirish
    if (!user.is_active) {
      return res.status(403).json({ 
        xato: "Hisobingiz bloklangan. Admin bilan bog'laning." 
      });
    }

    // Parolni tekshirish
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ 
        xato: "Username yoki parol noto'g'ri" 
      });
    }

    const token = generateToken(user.id);

    res.json({
      xabar: "Tizimga kirish muvaffaqiyatli",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login xatosi:', error);
    res.status(500).json({ xato: "Server xatosi" });
  }
};

// Joriy foydalanuvchi ma'lumotlari
const getMe = async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        fullName: req.user.full_name,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('GetMe xatosi:', error);
    res.status(500).json({ xato: "Server xatosi" });
  }
};

module.exports = { register, login, getMe };
