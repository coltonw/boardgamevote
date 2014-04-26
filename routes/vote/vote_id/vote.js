//
// Specific vote database interactions
//
var ObjectID = require('mongodb').ObjectID,
    janitor = require('../../../lib/janitor');

//
// PARAM of vote_id
//
exports.vote_id = function(req, res, next, id){
    req.db.collection('vote', function(er, collection) {
        collection.findOne({_id: new ObjectID.createFromHexString(id)}, function(err, vote) {
            if (!vote) return next(new Error('Vote not found'));
            req.vote = vote;
            next();
        });
    });
}

//
// GET vote page.
//
exports.index = function(req, res){
    console.log(req.vote);
    req.db.collection('ballot', function(er, collection) {
        collection.findOne({_id: req.vote.ballot}, function(err, ballot) {
            var ballotIndex = {};
            if (!ballot) return next(new Error('Ballot not found'));
            ballot.games.forEach(function(game){
                ballotIndex[game.id] = game;
            });
            req.vote.vote.forEach(function(tier, i){
                tier.forEach(function(gameId, j){
                    req.vote.vote[i][j] = ballotIndex[gameId] || 'Unknown game index';
                });
            });
            janitor.render(res, 'vote', {vote: req.vote.vote, nickname: req.vote.nickname, ballot: req.vote.ballot});
        });
    });
};