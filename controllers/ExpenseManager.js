const excel = require('exceljs')
const logger = require('../logging/Logger')

// Models
const expenseModel = require('../models/Expense')
const userModel = require('../models/User')

// Validators
const addExpenseValidator = require('../validators/AddExpense')

const addExpense = async (req, res) => {
    var data = req.body

    const { error } = addExpenseValidator.validate(req.body)
    if (error) return res.status(400).send({ error: error.details[0].message })

    var user = await userModel.findOne({ _id: req.user }).exec()
    if (!user) return res.status(404).send({ error: "User not Found" })

    if (data.amount > user.curBal) {
        return res.status(400).send({ error: "Your Expense for this month is exceeding your current remaining balance" })
    }
    user = await userModel.updateOne({ _id: req.user }, { curBal: user.curBal - data.amount }).exec()

    data = { ...data, user: req.user }
    const expense = new expenseModel(data)

    try {
        const savedExpense = await expense.save()
        return res.status(201).send(savedExpense)
    } catch (error) {
        logger.error(error)
        return res.status(400).send({ error: new String(error) })
    }
}

const getExpenses = async (req, res) => {
    const expenses = await expenseModel.find({ user: req.user }).exec()
    if (expenses.length === 0) return res.status(404).send({ message: "No Expenses are there currently, please add one" })

    return res.status(200).send(expenses)
}

const getExpense = async (req, res) => {
    const eId = req.params.eID

    const expense = await expenseModel.findOne({ _id: eId }).exec()
    if (!expense) return res.status(404).send({ error: "Expense Not Found" })

    return res.status(200).send(expense.toJSON())
}

const deleteExpense = async (req, res) => {
    const eId = req.params.eID

    const expense = await expenseModel.findOneAndDelete({ _id: eId }).exec()
    if (!expense) return res.status(404).send({ error: "Expense Not Found" })

    return res.status(200).send({ message: "Expense Deleted Successfully" })
}

const cancelRecurrance = async (req, res) => {
    const eId = req.params.eID

    const expense = await expenseModel.findOneAndUpdate({ _id: eId }, { expenseType: "regular" }).exec()
    if (!expense) return res.status(404).send({ error: "Expense Not Found" })

    return res.status(200).send({ message: "Recurrance Cancelled" })
}

const exportToExcel = async (req, res) => {
    const expenses = await expenseModel.find({ user: req.user }).exec()
    if (expenses.length === 0) return res.status(404).send({ message: "No Expenses are there currently, please add one" })

    // Write array to excel
    let workbook = new excel.Workbook()
    let worksheet = workbook.addWorksheet('Expenses')

    worksheet.columns = [
        { header: 'ID', key: '_id', width: 80 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Amount', key: 'amount', width: 10 },
        { header: 'Type', key: 'expenseType', width: 20 },
        { header: 'Date', key: 'expenseDate', width: 20 }
    ]

    const data_write = worksheet.addRows(expenses)

    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, size: 18 },
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
    })
    
    data_write.forEach((cell) => {
        cell.font = { size: 16 }
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
    })

    workbook.xlsx.writeFile(`/files/${req.user._id}_Report.xlsx`)
        .then(() => {
            return res.status(200).sendFile(`/files/${req.user._id}_Report.xlsx`)
        })
        .catch((error) => {
            logger.error(error)
            return res.status(400).send({error: new String(error)})
        })
}

module.exports = {
    addExpense: addExpense,
    getExpenses: getExpenses,
    getExpense: getExpense,
    deleteExpense: deleteExpense,
    cancelRecurrance: cancelRecurrance,
    exportToExcel: exportToExcel
}