# ER Diagramma
## Sonli Usullar Platformasi
**Talaba:** Toirov Azizjon | **Guruh:** DI 23-14

---

## 1. Jadvallar va atributlar

### users (Foydalanuvchilar)
| Atribut | Turi | Tavsif |
|---------|------|--------|
| id | SERIAL PK | Unikal ID |
| username | VARCHAR(50) UK | Login |
| email | VARCHAR(100) UK | Email |
| password_hash | VARCHAR(255) | Bcrypt hash |
| full_name | VARCHAR(100) | To'liq ism |
| role | VARCHAR(20) | student |
| is_active | BOOLEAN | Faol/Bloklangan |
| created_at | TIMESTAMP | Ro'yxatdan o'tish vaqti |

### calculations (Hisoblashlar)
| Atribut | Turi | Tavsif |
|---------|------|--------|
| id | SERIAL PK | Unikal ID |
| user_id | INTEGER FK | Kim hisoblagan |
| method_name | VARCHAR(50) | Usul nomi |
| input_data | JSONB | Kirish ma'lumotlari |
| result_data | JSONB | Natija |
| steps | JSONB | Bosqichlar |
| created_at | TIMESTAMP | Hisoblash vaqti |

### projects (Loyihalar - investitsiya uchun)
| Atribut | Turi | Tavsif |
|---------|------|--------|
| id | SERIAL PK | Unikal ID |
| user_id | INTEGER FK | Egasi |
| name | VARCHAR(100) | Loyiha nomi |
| budget | INTEGER | Byudjet |
| created_at | TIMESTAMP | Yaratilgan vaqti |

### project_revenues (Loyiha daromadlari)
| Atribut | Turi | Tavsif |
|---------|------|--------|
| id | SERIAL PK | Unikal ID |
| project_id | INTEGER FK | Qaysi loyihaga |
| investment_amount | INTEGER | Sarmoya miqdori |
| revenue | INTEGER | Kutilayotgan foyda |

### transport_problems (Transport masalalari)
| Atribut | Turi | Tavsif |
|---------|------|--------|
| id | SERIAL PK | Unikal ID |
| user_id | INTEGER FK | Kim yaratgan |
| name | VARCHAR(100) | Masala nomi |
| supply | INTEGER[] | Ta'minot massivi |
| demand | INTEGER[] | Ehtiyoj massivi |
| costs | INTEGER[][] | Xarajatlar matritsasi |
| method | VARCHAR(20) | Usul turi |
| solution | JSONB | Yechim |
| total_cost | INTEGER | Umumiy xarajat |
| created_at | TIMESTAMP | Yaratilgan vaqti |

---

## 2. Jadvallar orasidagi aloqalar

- **Bitta foydalanuvchi** ko'p hisoblashlar qilishi mumkin (1:N)
- **Bitta foydalanuvchi** ko'p loyihalar yarata oladi (1:N)
- **Bitta foydalanuvchi** ko'p transport masalalarini saqlaydi (1:N)
- **Bitta loyiha** ko'p daromad qatorlariga ega (1:N)

---

## 3. ER Diagramma
+----------------+         +-------------------+
|     users      |         |   calculations    |
+----------------+         +-------------------+
| PK id          |-------->| PK id             |
| username       |   1:N   | FK user_id        |
| email          |         | method_name       |
| password_hash  |         | input_data (JSON) |
| full_name      |         | result_data (JSON)|
| role           |         | steps (JSON)      |
| is_active      |         | created_at        |
| created_at     |         +-------------------+
+----------------+
|
| 1:N
|
v
+----------------+         +--------------------+
|    projects    |         | project_revenues   |
+----------------+         +--------------------+
| PK id          |-------->| PK id              |
| FK user_id     |   1:N   | FK project_id      |
| name           |         | investment_amount  |
| budget         |         | revenue            |
| created_at     |         +--------------------+
+----------------+
+---------------------+
| transport_problems  |
+---------------------+
| PK id               |
| FK user_id          |
| name                |
| supply (array)      |
| demand (array)      |
| costs (matrix)      |
| method              |
| solution (JSON)     |
| total_cost          |
| created_at          |
+---------------------+

---

## 4. Cheklovlar

1. **CASCADE DELETE**: Foydalanuvchi o'chirilganda uning barcha ma'lumotlari ham o'chadi.
2. **UNIQUE**: username va email takrorlanmas bo'lishi kerak.
3. **NOT NULL**: username, email, password_hash bo'sh bo'lishi mumkin emas.