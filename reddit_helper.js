const snoowrap = require('snoowrap')
const nlp = require('compromise')
const mostCommon = require('array-most-common')

function sum(array) {
    var num = 0
    for (var i = 0, l = array.length; i < l; i++) {
	num += array[i]
    }
    return num
}

function mean(array) {
    return sum(array) / array.length
}

function median(array) {
    array.sort(function(a,b) {return a - b})
    var half = Math.floor(array.length/2)
    if(array.length % 2) {
	return array[half]
    } else {
	return (array[half-1] + array[half]) / 2.0
    }
}

function variance(array) {
    var ave = mean(array)
    return mean(array.map(function(num) {
	return Math.pow(num - ave, 2);
    }))
}

function stddev(array) {
    return Math.sqrt(variance(array))
}

function roundTo(n, digits) {
    var negative = false;
    if (digits === undefined) {
	digits = 0;
    }
    if( n < 0) {
	negative = true;
	n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(2);
    if( negative ) {
	n = (n * -1).toFixed(2);
    }
    return n;
}


const r = new snoowrap({
    userAgent: 'Linux:XXXXXXXXXX:1.0 (by /u/XXXXX)',
    clientId: 'XXXXXXXXXX',
    clientSecret: 'XXXXX'
})


module.exports.get_user_info = (username, callback) => {
    r.getUser(username).fetch().then(userInfo => {
        //console.log(userInfo)
        userInfo.getComments({
            "limit": 200
        }).then(comments => {
            //console.log("Retreived " + comments.length + " comments for " + username)

            // Most common subs
            var subs = []
            comments.forEach(c => {
                subs.push(c.subreddit.display_name)
            })
	    var unique_subs = new Set(subs)

            // Most common words
	    var comment_lengths = []
            var text = ""
            comments.forEach(c => {
                text += c.body
		comment_lengths.push(c.body.length)
            })
            var tmp = nlp(text).nouns().out('frequency').slice(0, 5)
            var nouns = []
            tmp.forEach(x => {
                nouns.push(x.normal)
            })

            var result = {
                "_id": username,
                "created": userInfo.created_utc,
		"comments_analyzed": comments.length,
		"comments_written_per_day": +(comments.length/((comments[0].created-comments[comments.length-1].created)/86400)).toFixed(1),
		"subreddits_commented_in": unique_subs.size,
                "subreddit_most_commented_in": mostCommon(subs),
                "nouns_most_used": nouns.join(" "),
		"comment_character_length_ave": +mean(comment_lengths).toFixed(1),
		"comment_character_length_median": median(comment_lengths),
		"comment_character_length_stddev": +stddev(comment_lengths).toFixed(1),
		"most_recent_comment": comments[0].body,
                "timestamp": Math.floor(Date.now() / 1000)
            }
            callback(result)
        })
    })
}
