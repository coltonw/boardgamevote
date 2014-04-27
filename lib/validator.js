// Simple validator using JSV and JSON schemas
var env = require("JSV").JSV.createEnvironment(),
    voteSchemas = require('../schemas/voteSchemas');

// Validation for vote object
exports.vote = function(obj) {
    var report = env.validate(obj, voteSchemas.vote);
    if(report.errors.length === 0) {
        return true;
    } else {
        console.log(report);
        return true;  // While it is a WIP
    }
}