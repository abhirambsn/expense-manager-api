const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const binascii = require('binascii')

// Models
const userModel = require('../models/User')

// Validators
const loginValidaor = require('../validators/Login')
const registerValidator = require('../validators/Register')
const changePasswordValidator = require('../validators/ChangePassword')
const changeIncomeValidator = require('../validators/ModifyIncome')
const deleteAccountValidator = require('../validators/DeleteAccount')
const logger = require('../logging/Logger')

const login = async (req, res) => {
    const data = req.body

    const {error} = loginValidaor.validate(data)
    if (error) return res.status(400).send({error: error.details[0].message})

    const user = await userModel.findOne({username: data.username}).exec()
    if (!user) return res.status(404).send({error: "User Not Found"})

    const cmp = await bcrypt.compare(data.password, user.password)
    if (!cmp) return res.status(403).send({error: "Password Mismatch"})

    const token = await jwt.sign({_id: user._id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

    return res.header('Authorization', token).send({status: "Login Successful", token: token})
}

const register = async (req, res) => {
    var data = req.body

    const {error} = registerValidator.validate(data)
    if (error) return res.status(400).send({error: error.details[0].message})

    const existingUserChk = await userModel.findOne({username: data.username}).exec()
    if (existingUserChk) return res.status(400).send({error: "User exists"})

    const salt = await bcrypt.genSalt(10)
    data.password = await bcrypt.hash(data.password, salt)
    data.curBal = data.income

    const user = new userModel(data)
    try {
        const savedUser = await user.save()
        const mailer = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            auth: {
                type: 'OAuth2',
                clientId: process.env.G_CLIENT_ID,
                clientSecret: process.env.G_CLIENT_SECRET,
                refreshToken: process.env.G_REFRESH_TOKEN,
                user: process.env.G_EMAIL
            }
        })
        const vToken = binascii.hexlify(user._id)
        const mail = {
            from: process.env.G_EMAIL,
            to: user.email,
            subject: "Verification of your Expense Manager Account",
            html: `<b>Dear ${user.name}</b>,<br/><h1>Welcome to Expense Manager</h1><br/>We are glad to have you here inorder to continue please click on the verify button below<br/><a href='http://${req.headers.host}/api/auth/verify/${vToken}'>Verify Your Account</a>`
        }
        mailer.sendMail(mail, async (err, info) => {
            if (err) {
                await userModel.findOneAndDelete({_id: user._id}).exec()
                logger.error(err)
                return res.status(500).send({error: "Mailing Error, please try again"})
            } else {
                var log_data = {...info, finalResult: `Email Sent to: ${user.email}`}
                logger.info(log_data)
                return res.status(201).send(savedUser)      
            }
        })
    } catch (err) {
        logger.error(err)
        return res.status(400).send({error: err})
    }
}

const changePassword = async (req, res) => {
    var data = req.body

    const {error} = changePasswordValidator.validate(data)
    if (error) return res.status(400).send({error: error.details[0].message})

    const user = await userModel.findOneAndUpdate({_id: req.user}, {password: data.newPassword1}).exec()
    if (!user) return res.status(404).send({error: "User not found"})

    return res.status(200).send({message: "Password Updated"})
}

const changeIncome = async (req, res) => {
    const data = req.body

    const {error} = changeIncomeValidator.validate(data)
    if (error) return res.status(400).send({error: error.details[0].message})

    const user = await userModel.findByIdAndUpdate({_id: req.user}, {income: data.income}).exec()
    if (!user) return res.status(404).send({error: "User not found"})

    return res.status(200).send({message: "Income Updated Successfully"})
}

const deleteAccount = async (req, res) => {
    const data = {...req.user, ...req.body}

    const {error} = deleteAccountValidator.validate(req.body)
    if (error) return res.status(400).send({error: error.details[0].message})

    const user = await userModel.findByIdAndDelete(data).exec()
    if (!user) return res.status(404).send({error: "User not Found"})

    return res.status(200).send({message: "Account Deletion Successful"})
}

const profile = async (req, res) => {
    const user = await userModel.findOne({_id: req.user}, {password: 0}).exec()
    if (!user) return res.status(404).send({error: "User not Found"})

    return res.status(200).send(user.toJSON())
}

const verify = async (req, res) => {
    const vToken = req.params.token
    const id = binascii.unhexlify(vToken)

    const user = await userModel.findByIdAndUpdate(id, {isVerified: true}).exec()
    if (!user) return res.status(404).send({error: "Verification Failed"})

    return res.status(200).send({message: "Account Verified"})
}

module.exports = {
    login: login,
    register: register,
    changePassword: changePassword,
    changeIncome: changeIncome,
    deleteAccount: deleteAccount,
    profile: profile,
    verify: verify
}