var mongoClient = require('mongodb').MongoClient,
    mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';
/*
 * GET home page.
 */
exports.index = function(req, res){
    mongoClient.connect(mongoUri, function (err, db) {
      db.collection('ballot', function(er, collection) {
        collection.findOne(function(err, ballot) {
            if (!ballot) return next(new Error('Ballot not found'));
            res.render('index', {action: 'vote', games: ballot.games, ballot: ballot._id.toHexString() });
        });
      });
    });
};