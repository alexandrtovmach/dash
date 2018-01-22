const patient = require('./patient')

module.exports = {
  init: (app) => {
    app.use('/api/patient', patient)
  }
}
