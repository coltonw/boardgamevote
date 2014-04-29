//
// Votes database interactions
//
var ObjectID = require('mongodb').ObjectID,
    validate = require('../../lib/validator');

//
// POST a vote.
//
exports.post = {
    index: function(req, res, next){
        var body = req.body, i,
            id = new ObjectID(),
            ballot = body.ballot,
            vote = body.vote,
            nickname = body.nickname;
        if(validate.vote(vote) && typeof nickname === 'string' &&
                validate.objectIdHexString(ballot)) {
            req.db.collection('vote', function(er, collection) {
                collection.insert({
                    _id: id,
                    vote: vote,
                    nickname: nickname,
                    ballot: new ObjectID.createFromHexString(ballot)}, {w: 1}, function(er,rs) {
                    res.json({redirect:'/vote/' + id.toHexString()});
                });
            });
        } else {
            res.send(400);
        }
    }
};