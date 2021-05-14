const userModel = require('../models/User')
const expenseModel = require('../models/Expense')

const recurExpense = async () => {
    const users = await userModel.find({}, {password: 0, username: 0}).exec()
    for (const user of users) {
        const recExp = await expenseModel.find({user: user._id, expenseType: "recurring"}).exec()
        if (recExp === []) continue
        var totalExp = 0
        for(const expense of recExp) {
            var date = new Date(expense.expenseDate)
            const now = new Date()
            if ((now.getDate() === date.getDate()) && (now.getMonth() === (date.getMonth() + 1) % 12)) {
                totalExp += expense.amount
                await expenseModel.findOneAndUpdate({_id: expense._id}, {expenseDate: now}).exec()
            } else continue
        }
        if (totalExp === 0) continue

        const balance = user.curBal - totalExp
        await userModel.findOneAndUpdate({_id: user._id}, {curBal: balance}).exec()
    }
}

module.exports = recurExpense