const jwt = require('jsonwebtoken')
const logger = require('../logging/Logger')

const isAuthenticated = (req, res, next) => {
    const authToken = req.header('Authorization')
    if (!authToken) return res.status(401).send({error: "Unauthorized, Please login"})

    try {
        const verify = jwt.verify(authToken, process.env.JWT_SECRET)
        req.user = verify
        next()
    } catch (error) {
        logger.error(error)
        return res.status(400).send({error: "Invalid Token"})
    }
}

module.exports = isAuthenticated