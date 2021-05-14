const mongoose = require('mongoose')
const uuid = require('uuid')

const userSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true,
        default: function getID() { return uuid.v4() }
    },
    name: {
        type: String, 
        required: true
    },
    income: {
        type: Number,
        required: true,
        default: 0.0
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean, 
        required: true,
        default: false
    },
    curBal: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model('User', userSchema)