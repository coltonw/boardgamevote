var config = require('../config.js');

/*
 * GET home page.
 */
exports.index = function(req, res){
    req.db.collection('ballot', function(er, collection) {
        collection.findOne({},{sort: {$natural:-1}},function(err, ballot) {
            if (!ballot) return next(new Error('Ballot not found'));
            res.render('index', {staticUrl: config.staticUrl, action: 'vote', games: ballot.games, ballot: ballot._id.toHexString() });
        });
    });
};