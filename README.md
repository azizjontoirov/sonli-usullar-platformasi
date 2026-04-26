# Sonli Usullar va Chiziqli Dasturlash Platformasi

Raqamli usullar fanidan kurs ishi sifatida yaratilgan talabalar platformasi.

---

## Loyiha haqida

Bu loyihani o'qish jarayonida matematik usullarni yaxshiroq tushunish uchun yaratdim.
Har bir usul uchun kirish ma'lumotlari kiritiladi, natija va qadamlar ko'rsatiladi.
Hisoblash natijalari avtomatik saqlanadi va tarixdan ko'rish mumkin.

Quyidagi usullar mavjud:
- Gorner usuli — Ko'phadni hisoblash
- Teylor qatori — sin(x) va cos(x) taqribiy hisoblash  
- Nyuton usuli — Kvadrat ildiz hisoblash
- Oddiy iteratsiya — Tenglamalarni echish
- Transport masalasi — 3 ta usul bilan
- Investitsiya taqsimlash — Dinamik dasturlash

---

## Texnologiyalar

- Frontend: React, TailwindCSS, Recharts
- Backend: Node.js, Express
- Baza: PostgreSQL
- Auth: JWT token

---

## O'rnatish

### Talablar
- Node.js 18+
- PostgreSQL 14+

### 1. Baza yaratish
```bash
psql -U postgres -f database/schema.sql
```

### 2. Backend
```bash
cd server
npm install
node server.js
```

### 3. Frontend
```bash
cd client
npm install
npm run dev
```

### Muhit o'zgaruvchilari (server/.env)

DATABASE_URL=postgresql://postgres:parol@localhost:5432/sonli_db
JWT_SECRET=maxfiy_kalit
PORT=5000

---

## Papka strukturasi
sonli-usullar/
├── client/          # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── context/
├── server/          # Express backend
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── utils/
├── database/
│   └── schema.sql
└── README.md

---

## Muammolar va yechimlar

- PostgreSQL installer yo'q edi, binary versiyadan foydalandim
- Windows PATH ga qo'shish kerak bo'ldi
- O'zbek matni ichidagi apostroflar JS sintaksisini buzdi — qo'shtirnoqqa o'tkazildi

---

## Mualliflar

- Talaba: Toirov Azizjon
- O'qituvchi: To'xtayeva M