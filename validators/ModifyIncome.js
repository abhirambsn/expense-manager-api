const Joi = require('joi')

const schema = Joi.object().keys({
    income: Joi.number().required(),
    password: Joi.string().required()
})

module.exports = schema