const Joi = require('joi')

const schema = Joi.object().keys({
    name: Joi.string().min(4).required(),
    amount: Joi.number().required(),
    expenseType: Joi.required().equal("regular", "recurring")
})

module.exports = schema