const express = require('express')
const router = express.Router()
const { addExpense, getExpenses, getExpense, deleteExpense, exportToExcel, cancelRecurrance } = require('../controllers/ExpenseManager')
const isAuthenticated = require('../middlewares/AuthMiddleware')

// GET Routes
router.get('/', isAuthenticated, getExpenses)
router.get('/:eID', isAuthenticated, getExpense)
router.get('/download/excel', isAuthenticated, exportToExcel)

// POST Routes
router.post('/', isAuthenticated, addExpense)

// PUT Routes
router.put('/cancelRecurrance', cancelRecurrance)

// DELETE Routes
router.delete('/:eID', isAuthenticated, deleteExpense)

module.exports = router