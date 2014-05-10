// Janitor - a utility for common view controller info and logic

var config = require('../config.js'),
    extend = require('node.extend');

exports.render = function(res, view, locals, callback, db) {
    var defaults = {
        staticUrl: config.staticUrl
    };
    if(locals.ballot) {
        res.render(view, extend(defaults, locals), callback);
    } else {
        db.collection('ballot', function(er, collection) {
            collection.findOne({},{sort: {$natural:-1}},function(err, ballot) {
                if (ballot) {
                    defaults.ballot = ballot._id.toHexString();
                }
                res.render(view, extend(defaults, locals), callback);
            });
        });
    }
};