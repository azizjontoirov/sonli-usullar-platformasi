// Hisoblashlar kontrolleri
const { query } = require('../config/database');
const {
  gornerHisoblash,
  taylorHisoblash,
  nyutonHisoblash,
  iteratsiyaHisoblash,
  transportHisoblash,
  investitsiyaHisoblash
} = require('../utils/math');

// Hisoblashni saqlash
const saveCalculation = async (req, res) => {
  try {
    const { methodName, inputData, resultData, steps } = req.body;
    const userId = req.user.id;

    if (!methodName || !inputData || !resultData) {
      return res.status(400).json({ xato: 'methodName, inputData va resultData majburiy' });
    }

    const result = await query(
      `INSERT INTO calculations (user_id, method_name, input_data, result_data, steps) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, methodName, JSON.stringify(inputData), JSON.stringify(resultData), JSON.stringify(steps || [])]
    );

    res.status(201).json({
      xabar: 'Hisoblash saqlandi',
      calculation: result.rows[0]
    });
  } catch (error) {
    console.error('Save calculation xatosi:', error);
    res.status(500).json({ xato: 'Saqlashda xatolik' });
  }
};

// Foydalanuvchi tarixini olish
const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { method, limit = 50, offset = 0 } = req.query;

    let sql = 'SELECT * FROM calculations WHERE user_id = $1';
    const params = [userId];

    if (method) {
      sql += ' AND method_name = $2';
      params.push(method);
    }

    sql += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await query(sql, params);

    // JSONB ma'lumotlarni parse qilish
    const calculations = result.rows.map(row => ({
      ...row,
      input_data: typeof row.input_data === 'string' ? JSON.parse(row.input_data) : row.input_data,
      result_data: typeof row.result_data === 'string' ? JSON.parse(row.result_data) : row.result_data,
      steps: row.steps ? (typeof row.steps === 'string' ? JSON.parse(row.steps) : row.steps) : []
    }));

    res.json({ calculations, count: calculations.length });
  } catch (error) {
    console.error('Get history xatosi:', error);
    res.status(500).json({ xato: 'Tarixni olishda xatolik' });
  }
};

// Hisoblashni o'chirish
const deleteCalculation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await query(
      'DELETE FROM calculations WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ xato: 'Hisoblash topilmadi yoki sizga tegishli emas' });
    }

    res.json({ xabar: "Hisoblash o'chirildi" });
  } catch (error) {
    console.error('Delete calculation xatosi:', error);
    res.status(500).json({ xato: "O'chirishda xatolik" });
  }
};

// Gorner usuli endpoint
const calculateGorner = async (req, res) => {
  try {
    const { coefficients, x } = req.body;

    if (!Array.isArray(coefficients) || typeof x !== 'number') {
      return res.status(400).json({ xato: "coefficients massiv va x son bo'lishi kerak" });
    }

    const natija = gornerHisoblash(coefficients, x);
    res.json(natija);
  } catch (error) {
    console.error('Gorner xatosi:', error);
    res.status(500).json({ xato: "Hisoblashda xatolik" });
  }
};

// Teylor usuli endpoint
const calculateTaylor = async (req, res) => {
  try {
    const { x, n, type } = req.body;

    if (typeof x !== 'number' || typeof n !== 'number' || !['sin', 'cos'].includes(type)) {
      return res.status(400).json({ xato: "x (son), n (butun), type (sin yoki cos) kerak" });
    }

    const natija = taylorHisoblash(x, n, type);
    res.json(natija);
  } catch (error) {
    console.error('Taylor xatosi:', error);
    res.status(500).json({ xato: "Hisoblashda xatolik" });
  }
};

// Nyuton usuli endpoint
const calculateNewton = async (req, res) => {
  try {
    const { S, x0, tolerance } = req.body;

    if (typeof S !== 'number' || typeof x0 !== 'number' || typeof tolerance !== 'number') {
      return res.status(400).json({ xato: "S, x0 va tolerance son bo'lishi kerak" });
    }

    const natija = nyutonHisoblash(S, x0, tolerance);
    res.json(natija);
  } catch (error) {
    console.error('Newton xatosi:', error);
    res.status(500).json({ xato: "Hisoblashda xatolik" });
  }
};

// Iteratsiya usuli endpoint
const calculateIteration = async (req, res) => {
  try {
    const { x0, tolerance, formula } = req.body;

    if (typeof x0 !== 'number' || typeof tolerance !== 'number' || !formula) {
      return res.status(400).json({ xato: "x0, tolerance va formula kerak" });
    }

    const natija = iteratsiyaHisoblash(x0, tolerance, formula);
    res.json(natija);
  } catch (error) {
    console.error('Iteration xatosi:', error);
    res.status(500).json({ xato: "Hisoblashda xatolik" });
  }
};

// Transport masalasi endpoint
const calculateTransport = async (req, res) => {
  try {
    const { supply, demand, costs, method } = req.body;

    if (!Array.isArray(supply) || !Array.isArray(demand) || !Array.isArray(costs) || !method) {
      return res.status(400).json({ xato: "supply, demand, costs va method kerak" });
    }

    const natija = transportHisoblash(supply, demand, costs, method);
    res.json(natija);
  } catch (error) {
    console.error('Transport xatosi:', error);
    res.status(500).json({ xato: "Hisoblashda xatolik" });
  }
};

// Investitsiya endpoint
const calculateInvestment = async (req, res) => {
  try {
    const { budget, projects } = req.body;

    if (typeof budget !== 'number' || !Array.isArray(projects)) {
      return res.status(400).json({ xato: "budget (son) va projects (massiv) kerak" });
    }

    const natija = investitsiyaHisoblash(budget, projects);
    res.json(natija);
  } catch (error) {
    console.error('Investment xatosi:', error);
    res.status(500).json({ xato: "Hisoblashda xatolik" });
  }
};

module.exports = {
  saveCalculation,
  getHistory,
  deleteCalculation,
  calculateGorner,
  calculateTaylor,
  calculateNewton,
  calculateIteration,
  calculateTransport,
  calculateInvestment
};
