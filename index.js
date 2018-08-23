#!/usr/bin/env node

const port = 80

const express = require("express")
const app = express()
const ejs = require("ejs")

const redditHelper = require('./reddit_helper')
const dbHelper = require('./database_helper')

app.set('view engine', 'ejs')

app.get("/u/:id", (req, res) => {
    var username = req.params.id
    console.log(req.connection.remoteAddress + " asked for " + username)
    dbHelper.get_user(username, (err, doc) => {
	// If we found doc in database AND it is within one day
	if ((doc) && (Math.floor(Date.now()/1000)-doc.timestamp < 86400)) {
	    res.type('application/json')
	    res.send(JSON.stringify(doc))
	} else {
	    redditHelper.get_user_info(username, (result) => {
		dbHelper.save_user(result, () => {})
                res.type('application/json')
                //res.send(JSON.stringify(data))
		res.send(JSON.stringify(result))
	    })
	}
    })
})

app.get("/values/:key", (req, res) => {
    var key = req.params.key
    dbHelper.get_all_values(key, (docs) => {
	var result = []
	docs.forEach(x => {
	    result.push(x[key])
	})
	res.type('application/json')
	res.send(JSON.stringify(result))
    })
})

app.get("/stats", (req, res) => {
    dbHelper.get_stats((doc) => {
        res.type('application/json')
        res.send(JSON.stringify(doc))
    })
})

// Show 404 for all other pages
app.use((req, res, next) => {
    res.status(404)
    res.type('text/plain')
    res.send('Page not found.')
})

dbHelper.connect_to_mongo(() => {
  app.listen(port, () => {
    console.log("Running on port " + port)
  })
})
