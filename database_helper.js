const mongo = require('mongodb')
const MongoClient = mongo.MongoClient

// Get mongodb host, username, etc
var config = null
try {
    config = require("./database_config")
} catch (e) {
    console.log("Error: You need to create a file called database_config.js.")
    console.log("The README.md has more information.")
    process.exit()
}

// Database and Collection Names
const dbName = 'my_database'
const userCollection = 'users'
var users = null

// Connect to mongodb server
module.exports.connect_to_mongo = function(callback) {
    MongoClient.connect(config.mongodb_host, config.mongodb, (err, client) => {
	console.log("Connected successfully to mongo server at " + config.mongodb_host)
	users = client.db(dbName).collection(userCollection)
	callback()
    })
}

// Retrieve user
module.exports.get_user = function(username, callback) {
    users.findOne({
	_id: username
    }, (err, doc) => {
	callback(err, doc)
    })
}

// Get values from all users
module.exports.get_all_values = function(key, callback) {
    users.find({}).project({[key]:1, '_id':0}).toArray((err, docs) => {
	callback(docs)
    })
}

// Save User
module.exports.save_user = function(doc, callback) {
    users.findOneAndDelete({
	_id: doc._id
    }, (err, result) => {
	users.insert(doc, (err, result) => {
	    //console.log("Inserted " + doc._id)
	    callback(err, result)
	})
    })
}

// Get statistics
module.exports.get_stats = function(callback) {
    users.stats((err, stats) => {
	delete stats.wiredTiger
	delete stats.ns
	delete stats.indexDetails
	delete stats.indexSizes
	delete stats.capped
        callback(stats)
    })
}
