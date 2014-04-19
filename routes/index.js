var ballotRoute = require('./ballot/ballot_id/ballot.js');

/*
 * GET home page.
 */
exports.index = function(req, res){
    req.db.collection('ballot', function(er, collection) {
        collection.findOne({},{sort: {$natural:-1}},function(err, ballot) {
            if (!ballot) return next(new Error('Ballot not found'));
            req.ballot = ballot;
            ballotRoute.vote(req, res);
        });
    });
};