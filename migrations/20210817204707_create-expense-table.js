
exports.up = function(knex) {
    return knex.schema.createTable("expense", expense => {
        expense.increments()
        expense.string('type')
        expense.float('amount')
        expense.string('date')
        expense.string('description')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("expense")
};
