const { Model } = require('objection');

class Expense extends Model {
    static tableName = 'expense'
}

module.exports = Expense