//
// Votes database interactions
//

// For now this function assumes every game is listed and that their are no extra games.
function convertToCleanVote(voteBody) {
    var keys = Object.keys(voteBody),
        clean = 0,
        nextVal = 0,
        curMin = parseInt(voteBody[keys[0]], 10),
        cleanVote = [];
    
    // Get the current minimum value in the vote
    // and convert all the int strings to numbers
    keys.forEach(function(key){
        voteBody[key] = parseInt(voteBody[key], 10);
        curMin = Math.min(voteBody[key], curMin);
    });
    
    // Go through the vote adding each value to the clean vote
    while(clean < keys.length) {
        // Reset the next minimum
        nextMin = Number.MAX_VALUE;
        cleanVote.push([]);
        keys.forEach(function(key){
            if(voteBody[key] === curMin) {
                // Set all the minimum values to be the current value we want set
                cleanVote[nextVal].push(key);
                clean++;
            } else if(voteBody[key] > curMin){
                // Find what the next minimum will be
                nextMin = Math.min(voteBody[key], nextMin);
            }
        });
        curMin = nextMin;
        nextVal++;
    }
    console.log(cleanVote);
    return cleanVote;
}

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

        req.db.collection('vote', function(er, collection) {
            collection.insert({
                _id: id,
                vote: vote,
                nickname: nickname,
                ballot: new ObjectID.createFromHexString(ballot)}, {w: 1}, function(er,rs) {
            });
        });
        res.json({redirect:'/vote/' + id.toHexString()});
    }
};