const Joi = require('joi')

const schema = Joi.object().keys({
    username: Joi.string().alphanum().lowercase().min(4).required(),
    password: Joi.string().required()
})

module.exports = schema