const admin = require("firebase-admin")
const { db, serviceAccountKey } = require("../config")

function dbConnectionHandler() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
    databaseURL: db.databaseURL,
    storageBucket: db.storageBucket,
    databaseAuthVariableOverride: {
      uid: db.uid
    }
  })

  // connecting request
  this.init = () => {
    this.database.once('value')
      .then(() => {
        console.log('\n============================\n=== Firebase connected ===\n============================\n')
      })
      .catch((errorObject) => {
        console.error('\n!!!!Firebase CONNECTION ERROR!!!!\n', errorObject.code)
      })
  }


  this.database = admin.database().ref(db.refName)
  this.storage = admin.storage().bucket()
}

module.exports = new dbConnectionHandler