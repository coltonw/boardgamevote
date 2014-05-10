//
// Specific ballot database interactions
//
var ObjectID = require('mongodb').ObjectID,
    indiff = require('../../../lib/indiff'),
    janitor = require('../../../lib/janitor'),
    extend = require('node.extend');
//
// PARAM of ballot_id
//
exports.ballot_id = function(req, res, next, id){
    req.db.collection('ballot', function(er, collection) {
        collection.findOne({_id: new ObjectID.createFromHexString(id)}, function(err, ballot) {
            if (!ballot) return next(new Error('Ballot not found'));
            req.ballot = ballot;
            next();
        });
    });
};

//
// DELETE of a ballot
//
exports['delete'] =  function(req, res) {
    req.db.collection('vote', function(er, collection) {
        collection.remove({ballot: req.ballot._id}, {w: 0});
    });
    req.db.collection('ballot', function(er, collection) {
        collection.remove({_id: req.ballot._id}, {w: 1}, function(err, item){
            if(!err) {
                res.send(200);
            } else {
                res.send(404);
            }
        });
    });
};

function getTally(ballot, votes, callback, db) {
    if (ballot.tally && votes.length === ballot.tally.votes.length) {
        callback(ballot.tally);
    } else {
        ballot.tally = {
            votes: votes,
            irvResults: indiff.instantRunoff(extend(true, [], votes)),
            mmpoResults: indiff.minimaxPairwiseOpposition(votes)
        };
        db.collection('ballot', function(er, collection) {
            collection.save(ballot, {w: 1}, function(er,rs) {
                callback(ballot.tally);
            });
        });
    }
}

//
// GET tally page for this ballot.
//
exports.tally = function(req, res){
    req.db.collection('vote', function(er, collection) {
        collection.find({ballot: req.ballot._id}).toArray(function(er,votes) {
            if(votes.length <= 0) {
                res.render('tally', {mmpoResults: {winnerName: 'NO VOTES YET'}, votes: votes});
                return;
            }
            getTally(req.ballot, votes, function(tally) {
                var ballotIndex = {}, i;
                req.ballot.games.forEach(function(game){
                    if(game.id === tally.irvResults.winner) {
                        tally.irvResults.winnerName = game.name;
                    }
                    if(game.id === tally.mmpoResults.winner) {
                        tally.mmpoResults.winnerName = game.name;
                    }
                    ballotIndex[game.id] = game;
                });
                if(tally.mmpoResults.tied){
                    for(i = 0; i < tally.mmpoResults.tied.length; i++) {
                        tally.mmpoResults.tied[i] = ballotIndex[tally.mmpoResults.tied[i]] || {name:'Unknown game index'};
                    }
                }
                votes.forEach(function(vote, k) {
                    vote.vote.forEach(function(tier, i){
                        tier.forEach(function(gameId, j){
                            votes[k].vote[i][j] = ballotIndex[gameId] || {name:'Unknown game index'};
                        });
                    });
                });
                tally.votes = votes;
                tally.ballot = req.ballot._id.toHexString();
                janitor.render(res, 'tally', tally);
            }, req.db);
        });
    });
};

// The home page for this ballot is currently an alias for its tally.
exports.index = exports.tally;

/*
 * GET voting booth for this ballot.
 */
exports.vote = function(req, res) {
    janitor.render(res, 'votingBooth', {action: '/api/vote', games: req.ballot.games, ballot: req.ballot._id.toHexString() });
};