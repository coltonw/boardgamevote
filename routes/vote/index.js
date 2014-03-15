//
// Vote database interactions
//
var ObjectID = require('mongodb').ObjectID;

exports.before = function(req, res, next, id){
    console.log('before vote with id ' + id);
    req.db.collection('vote', function(er, collection) {
        collection.findOne({_id: new ObjectID.createFromHexString(id)}, function(err, vote) {
            if (!vote) return next(new Error('Vote not found'));
            req.vote = vote;
            next();
        });
    });
};

// For now this function assumes every game is listed and that their are no extra games.
function convertToCleanVote(voteBody) {
    var keys = Object.keys(voteBody),
        clean = 0,
        nextVal = 0,
        curMin = parseInt(voteBody[keys[0]], 10),
        cleanVote = [];
    
    // Get the current minimum value in the vote
    // and convert all the int strings to numbers
    keys.forEach(function(key){
        voteBody[key] = parseInt(voteBody[key], 10);
        curMin = Math.min(voteBody[key], curMin);
    });
    
    // Go through the vote adding each value to the clean vote
    while(clean < keys.length) {
        // Reset the next minimum
        nextMin = Number.MAX_VALUE;
        cleanVote.push([]);
        keys.forEach(function(key){
            if(voteBody[key] === curMin) {
                // Set all the minimum values to be the current value we want set
                cleanVote[nextVal].push(key);
                clean++;
            } else if(voteBody[key] > curMin){
                // Find what the next minimum will be
                nextMin = Math.min(voteBody[key], nextMin);
            }
        });
        curMin = nextMin;
        nextVal++;
    }
    console.log(cleanVote);
    return cleanVote;
}

exports.create = function(req, res, next){
    var body = req.body, i,
        id = new ObjectID(),
        ballot = body.ballot;
    delete body.ballot;

    req.db.collection('vote', function(er, collection) {
        collection.insert({
            _id: id,
            vote: convertToCleanVote(body),
            ballot: new ObjectID.createFromHexString(ballot)}, {w: 1}, function(er,rs) {
        });
    });
    res.redirect('/vote/' + id.toHexString());
};

/*
 * GET vote page.
 */
exports.show = function(req, res){
    console.log(req.vote);
    req.db.collection('ballot', function(er, collection) {
        collection.findOne({_id: req.vote.ballot}, function(err, ballot) {
            var ballotIndex = {};
            if (!ballot) return next(new Error('Ballot not found'));
            ballot.games.forEach(function(game){
                ballotIndex[game.id] = game.name;
            });
            req.vote.vote.forEach(function(tier, i){
                tier.forEach(function(gameId, j){
                    req.vote.vote[i][j] = ballotIndex[gameId] || 'Unknown game index';
                });
            });
            res.render('vote', {'vote': req.vote.vote});
        });
    });
};