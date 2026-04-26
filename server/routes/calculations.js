// Hisoblash marshrutlari
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  saveCalculation,
  getHistory,
  deleteCalculation,
  calculateGorner,
  calculateTaylor,
  calculateNewton,
  calculateIteration,
  calculateTransport,
  calculateInvestment
} = require('../controllers/calculationController');

// Hisoblashlarni saqlash va tarix (CRUD)
router.post('/', authenticate, saveCalculation);
router.get('/', authenticate, getHistory);
router.delete('/:id', authenticate, deleteCalculation);

// Matematik usullar endpointlari
router.post('/gorner', authenticate, calculateGorner);
router.post('/taylor', authenticate, calculateTaylor);
router.post('/newton', authenticate, calculateNewton);
router.post('/iteration', authenticate, calculateIteration);
router.post('/transport', authenticate, calculateTransport);
router.post('/investment', authenticate, calculateInvestment);

module.exports = router;
