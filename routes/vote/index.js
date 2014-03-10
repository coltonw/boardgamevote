//
// Vote database interactions
//
var mongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';

exports.before = function(req, res, next, id){
    console.log('before vote with id ' + id);
    mongoClient.connect(mongoUri, function (err, db) {
        db.collection('bgv', function(er, collection) {
            collection.findOne({_id: new ObjectID.createFromHexString(id)}, function(err, vote) {
                if (!vote) return next(new Error('Vote not found'));
                req.vote = vote;
                next();
            });
        });
    });
};

exports.create = function(req, res, next){
    var body = req.body, i, id = new ObjectID();

    mongoClient.connect(mongoUri, function (err, db) {
      db.collection('bgv', function(er, collection) {
        collection.insert({_id: id,'vote': body}, {w: 1}, function(er,rs) {
        });
      });
    });
    res.redirect('/vote/' + id.toHexString());
};

/*
 * GET vote page.
 */
exports.show = function(req, res){
    console.log(req.vote);
    res.render('vote', {games: [{name: '7 Wonders'},{name: 'Small World'},{name: 'Ticket To Ride'},{name: 'Lords of Waterdeep'}], 'vote': req.vote.vote});
};