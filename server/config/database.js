// Ma'lumotlar bazasi ulanishi
const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL sozlamalari
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Ulanishni tekshirish
pool.on('connect', () => {
  console.log('✅ PostgreSQL ga ulanish muvaffaqiyatli');
});

pool.on('error', (err) => {
  console.error('❌ Baza xatosi:', err.message);
});

// So'rov yordamchi funksiyasi
const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };
