const { Model } = require('objection');

class User extends Model {
    static tableName = 'user'
}

module.exports = User