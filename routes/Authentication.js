const express = require('express')
const router = express.Router()
const { login, register, changePassword, changeIncome, deleteAccount, profile, verify } = require('../controllers/Auth')
const isAuthenticated = require('../middlewares/AuthMiddleware')

// GET Routes
router.get('/', isAuthenticated, profile)
router.get('/verify/:token', verify)

// POST Routes
router.post('/login', login)
router.post('/register', register)

// PUT Routes
router.put('/changePassword', isAuthenticated, changePassword)
router.put('/changeIncome', isAuthenticated, changeIncome)

// DELETE Routes
router.delete('/deleteAccount', isAuthenticated, deleteAccount)

module.exports = router