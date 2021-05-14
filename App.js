require('dotenv').config()

const express = require('express')
const node_scheduler = require('node-schedule')
const recurExpense = require('./jobs/RecurExpense')
const app = express()

app.use(express.json())

// Routes

const authRoutes = require('./routes/Authentication')
const expMgrRoutes = require('./routes/ExpenseMgr')

app.use('/api/auth', authRoutes)
app.use('/api/expenses', expMgrRoutes)

// Jobs

node_scheduler.scheduleJob({hour: 0, minute: 0}, recurExpense)

module.exports = app