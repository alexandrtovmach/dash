const Model = require('objection').Model

class Menu extends Model {
  static get tableName () {
    return 'menus'
  }
}

module.exports = Menu
