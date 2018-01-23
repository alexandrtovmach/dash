const admin = require("firebase-admin")
const { db, serviceAccountKey } = require("../config")

function firebaseConnectionHandler() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
    databaseURL: db.FIREBASE_databaseURL,
    storageBucket: db.FIREBASE_storageBucket,
    databaseAuthVariableOverride: {
      uid: db.FIREBASE_uid
    }
  })

  // connecting request
  this.init = () => {
    this.storage.get()
      .then(() => {
        console.log('\n============================\n=== Firebase connected ===\n============================\n')
      })
      .catch((errorObject) => {
        console.error('\n!!!!Firebase CONNECTION ERROR!!!!\n', errorObject.code)
      })
  }
  
  this.storage = admin.storage().bucket();
  
}

module.exports = new firebaseConnectionHandler

