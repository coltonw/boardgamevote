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
// GET tally page for this ballot.
//
exports.tally = function(req, res){
    req.db.collection('vote', function(er, collection) {
        collection.find({ballot: req.ballot._id}).toArray(function(er,votes) {
            if(votes.length <= 0) {
                res.render('tally', {mmpoResults: {winnerName: 'NO VOTES YET'}, votes: votes});
                return;
            }
            var irvResults, mmpoResults, ballotIndex = {}, i;
            mmpoResults = indiff.minimaxPairwiseOpposition(votes);
            irvResults = indiff.instantRunoff(extend(true, [], votes));
            console.log(mmpoResults);

            req.ballot.games.forEach(function(game){
                if(game.id === irvResults.winner) {
                    irvResults.winnerName = game.name;
                }
                if(game.id === mmpoResults.winner) {
                    mmpoResults.winnerName = game.name;
                }
                ballotIndex[game.id] = game;
            });
            if(mmpoResults.tied){
                for(i = 0; i < mmpoResults.tied.length; i++) {
                    mmpoResults.tied[i] = ballotIndex[mmpoResults.tied[i]] || {name:'Unknown game index'};
                }
            }
            votes.forEach(function(vote, k) {
                vote.vote.forEach(function(tier, i){
                    tier.forEach(function(gameId, j){
                        votes[k].vote[i][j] = ballotIndex[gameId] || {name:'Unknown game index'};
                    });
                });
            });
            janitor.render(res, 'tally', {irvResults: irvResults, mmpoResults: mmpoResults, votes: votes, ballot: req.ballot._id.toHexString() });
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