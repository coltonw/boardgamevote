/*
 * GET home page.
 */
exports.index = function(req, res){
    req.db.collection('ballot', function(er, collection) {
        collection.findOne(function(err, ballot) {
            if (!ballot) return next(new Error('Ballot not found'));
            res.render('index', {action: 'vote', games: ballot.games, ballot: ballot._id.toHexString() });
        });
    });
};