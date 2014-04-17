//
// Specific ballot database interactions
//
var ObjectID = require('mongodb').ObjectID,
    indiff = require('../../../lib/indiff'),
    extend = require('node.extend');
/*
 * PARAM of ballot_id
 */
exports.ballot_id = function(req, res, next, id){
    req.db.collection('ballot', function(er, collection) {
        collection.findOne({_id: new ObjectID.createFromHexString(id)}, function(err, ballot) {
            if (!ballot) return next(new Error('Ballot not found'));
            req.ballot = ballot;
            next();
        });
    });
};

/*
 * GET ballot page.
 */
exports.index = function(req, res){
    req.db.collection('vote', function(er, collection) {
        collection.find({ballot: req.ballot._id}).toArray(function(er,votes) {
            if(votes.length <= 0) {
                res.render('tally', {games: games, winner: 'NO VOTES YET', votes: votes});
                return;
            }
            var results, games = [], winner = '', ballotIndex = {};
            results = indiff.instantRunoff(extend(true, [], votes));

            req.ballot.games.forEach(function(game){
                var i, gameResults = {name: game.name, votes:[]};
                for(i = 0; i < results.previousResults.length; i++) {
                    if(results.previousResults[i].tally[game.id]) {
                        gameResults.votes.push(results.previousResults[i].tally[game.id]);
                    } else {
                        gameResults.votes.push('Eliminated');
                        break;
                    }
                }
                if(results.tally[game.id]) {
                    gameResults.votes.push(results.tally[game.id]);
                } else if (gameResults.votes[gameResults.votes.length-1] !== 'Eliminated') {
                    gameResults.votes.push('Eliminated');
                }
                if(game.id === results.winner) {
                    winner = game.name;
                }
                ballotIndex[game.id] = game;
                games.push(gameResults);
            });
            votes.forEach(function(vote, k) {
                vote.vote.forEach(function(tier, i){
                    tier.forEach(function(gameId, j){
                        votes[k].vote[i][j] = ballotIndex[gameId] || {name:'Unknown game index'};
                    });
                });
            });
            res.render('tally', {games: games, winner: winner, votes: votes});
        });
    });
};
