const mongoose = require('mongoose')
const uuid = require('uuid')

const expenseSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true,
        default: function getID() { return uuid.v4() }
    },
    name: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    expenseType: {
        type: String,
        required: true,
        enum: ["regular", "recurring"]
    },
    expenseDate: {
        type: Date,
        required: true,
        default: new Date()
    },
    user: {
        type: String,
        ref: 'User'
    }
})

module.exports = mongoose.model('Expense', expenseSchema)