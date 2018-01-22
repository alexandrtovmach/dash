const mongoose = require('mongoose'),
	{ db } = require("../config");

function mongoConnectionHandler() {
	this.init = () => {
		mongoose.connect(db.MONGO_uri, db.MONGO_opts)
			.catch(err => {
				console.error(err)
			});
	
		mongoose.set('debug', true);
		this.connection = mongoose.connection;
	
		mongoose.connection.on('connected', function() {
			console.log('\n============================\n=== MongoDB connected ===\n============================\n')
			this.state = 'connected';
		});
	
		mongoose.connection.on('error', function(err) {
			this.state = 'disconnected';
		});
	
		mongoose.connection.on('disconnected', function() {
			this.state = 'disconnected';
		});
	
		process.on('SIGINT', function() {
			mongoose.connection.close(function() {
				this.state = 'disconnected';
				process.exit(0);
			});
		});
	}
}

module.exports = new mongoConnectionHandler;