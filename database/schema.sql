-- ============================================================
-- SONLI USULLAR PLATFORMASI - MA'LUMOTLAR BAZASI
-- PostgreSQL 15+
-- ============================================================

-- Foydalanuvchilar jadvali
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'student', -- admin, student, teacher
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hisoblashlar tarixi (har bir foydalanuvchi o'z hisoblashlarini saqlaydi)
CREATE TABLE calculations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    method_name VARCHAR(50) NOT NULL, -- gorner, taylor, newton, iteration, transport, investment
    input_data JSONB NOT NULL,        -- kirish ma'lumotlari
    result_data JSONB NOT NULL,       -- natija
    steps JSONB,                      -- bosqichlar (qadamlar)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loyihalar (investitsiya masalasi uchun)
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    budget INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loyiha daromadlari (dinamik dasturlash jadvali)
CREATE TABLE project_revenues (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    investment_amount INTEGER NOT NULL, -- sarmoya miqdori
    revenue INTEGER NOT NULL            -- kutilayotgan foyda
);

-- Transport masalalari
CREATE TABLE transport_problems (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100),
    supply INTEGER[] NOT NULL,        -- ta'minot
    demand INTEGER[] NOT NULL,        -- ehtiyoj
    costs INTEGER[][] NOT NULL,       -- xarajatlar matritsasi
    method VARCHAR(20) NOT NULL,      -- northwest, leastcost, vogel
    solution JSONB,                   -- yechim
    total_cost INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indekslar
CREATE INDEX idx_calculations_user ON calculations(user_id);
CREATE INDEX idx_calculations_method ON calculations(method_name);
CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_transport_user ON transport_problems(user_id);

-- Test ma'lumotlar
INSERT INTO users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@sonli.uz', '$2b$10$...', 'Administrator', 'admin'),
('student1', 'student1@mail.uz', '$2b$10$...', 'Ali Valiyev', 'student');
