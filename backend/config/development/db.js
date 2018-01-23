module.exports = {
  FIREBASE_databaseURL: process.env.firebase_databaseURL,
  FIREBASE_storageBucket: process.env.firebase_storageBucket,
  FIREBASE_uid: process.env.firebase_uid,
	MONGO_uri: process.env.mongo_uri,
	MONGO_opts: {
    user: process.env.mongo_user,
    pass: process.env.mongo_pass,
    socketTimeoutMS: 0,
    keepAlive: true,
    autoIndex: false,
    reconnectTries: 30
	}
}
