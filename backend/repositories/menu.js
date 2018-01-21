const dbRef = require('../db/firebase').database
const generalRepository = require('./general')

class MenuRepository extends generalRepository {
  constructor () {
    super(dbRef)
    this.dbRef = dbRef
  }
}

module.exports = new MenuRepository()
