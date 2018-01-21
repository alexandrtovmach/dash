const menu = require('./menu')

module.exports = {
  init: (app) => {
    app.use('/api/menu', menu)
  }
}
