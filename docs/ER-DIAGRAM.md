# ER Diagramma (Entity-Relationship)
## Sonli Usullar Platformasi

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
| role | VARCHAR(20) | admin/student/teacher |
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

### projects (Loyihalar - investitsiya)
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
| investment_amount | INTEGER | Sarmoya |
| revenue | INTEGER | Foyda |

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

## 2. Aloqalar (Relationships)

```
users ||--o{ calculations : "1 -> ko'p"
users ||--o{ projects : "1 -> ko'p"
users ||--o{ transport_problems : "1 -> ko'p"
projects ||--o{ project_revenues : "1 -> ko'p"
```

### Tavsif:
- **Bitta foydalanuvchi** -> **Ko'p hisoblashlar** (1:N)
- **Bitta foydalanuvchi** -> **Ko'p loyihalar** (1:N)
- **Bitta foydalanuvchi** -> **Ko'p transport masalalari** (1:N)
- **Bitta loyiha** -> **Ko'p daromad qatorlari** (1:N)

---

## 3. ER Diagramma (tekstual ko'rinish)

```
+----------------+         +-------------------+
|     users      |         |   calculations    |
+----------------+         +-------------------+
| PK id          |<------->| PK id             |
| username       |    1:N  | FK user_id        |
| email          |         | method_name       |
| password_hash  |         | input_data (JSON) |
| full_name      |         | result_data (JSON)|
| role           |         | steps (JSON)      |
| is_active      |         | created_at        |
| created_at     |         +-------------------+
+----------------+
         | 1:N
         |
         v
+----------------+         +-------------------+
|    projects    |         | project_revenues  |
+----------------+         +-------------------+
| PK id          |<------->| PK id             |
| FK user_id     |    1:N  | FK project_id     |
| name           |         | investment_amount |
| budget         |         | revenue           |
| created_at     |         +-------------------+
+----------------+
         | 1:N
         v
+-------------------+
| transport_problems|
+-------------------+
| PK id             |
| FK user_id        |
| name              |
| supply (array)    |
| demand (array)    |
| costs (matrix)    |
| method            |
| solution (JSON)   |
| total_cost        |
| created_at        |
+-------------------+
```

---

## 4. Cheklovlar (Constraints)

1. **CASCADE DELETE**: Foydalanuvchi o'chirilganda uning barcha hisoblashlari, loyihalari va transport masalalari avtomatik o'chiriladi.
2. **UNIQUE**: username va email takrorlanmas.
3. **CHECK**: budget >= 0, investment_amount >= 0.
4. **NOT NULL**: Asosiy maydonlar (username, email, password_hash) bo'sh bo'lishi mumkin emas.
