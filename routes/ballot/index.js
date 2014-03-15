//
// Ballot database interactions
//
var ObjectID = require('mongodb').ObjectID,
    indiff = require('../../lib/indiff');

exports.before = function(req, res, next, id){
    console.log('before ballot with id ' + id);
    req.db.collection('ballot', function(er, collection) {
        collection.findOne({_id: new ObjectID.createFromHexString(id)}, function(err, ballot) {
            if (!ballot) return next(new Error('Ballot not found'));
            req.ballot = ballot;
            next();
        });
    });
};

function cleanBallot(ballotBody) {
    var i = 0, games = [];
    while(ballotBody['game_' + i + '_name'] && ballotBody['game_' + i + '_name'] !== '') {
        games.push({
            name: ballotBody['game_' + i + '_name'],
            id: ballotBody['game_' + i + '_id']
        });
        i++;
    }
    return games;
}

exports.create = function(req, res){
    var body = req.body, i, id = new ObjectID();

    req.db.collection('ballot', function(er, collection) {
        collection.insert({_id: id,'games': cleanBallot(body)}, {w: 1}, function(er,rs) {
            res.redirect('/');
        });
    });
};

/*
 * GET ballot main index.
 */
exports.index = function(req, res){
    res.render('ballot', {action: 'ballot'});
};

/*
 * GET ballot page.
 */
exports.show = function(req, res){
    console.log(req.ballot);
    req.db.collection('vote', function(er, collection) {
        collection.find({ballot: req.ballot._id}).toArray(function(er,votes) {
            var results, cleanVotes = [], games = [];
            console.log("Votes:");
            console.log(votes);
            votes.forEach(function(voteObj) {
                cleanVotes.push(voteObj.vote);
            });
            results = indiff.instantRunoff(cleanVotes);
            console.log(results);

            req.ballot.games.forEach(function(game){
                var i, gameResults = {name: game.name, votes:[]};
                for(i = results.previousResults.length-1; i >= 0; i--) {
                    if(results.previousResults[i].tally[game.id]) {
                        gameResults.votes.push(results.previousResults[i].tally[game.id]);
                    } else {
                        break;
                    }
                }
                if(results.tally[game.id]) {
                    gameResults.votes.push(results.tally[game.id]);
                }
                games.push(gameResults);
            });
            res.render('tally', {games: games, winners: results.majority});
        });
    });
};