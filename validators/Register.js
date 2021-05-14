const Joi = require('joi')

const schema = Joi.object().keys({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    income: Joi.number().default(0.0),
    username: Joi.string().alphanum().lowercase().min(4).required(),
    password: Joi.string().required()
})

module.exports = schema