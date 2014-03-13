// Indifference engine library

// Gets results from a clean list of votes
// Results return in format {tally:{'a':1,'b':3}, majority:['b']}
function currentResults(votes) {
    var i, j, tallyKeys,results = {
        tally: {},
        majority: []
    };
    for(i = 0; i < votes.length; i++) {
        vote = votes[i][0];
        for(j = 0; j < vote.length; j++) {
            if(typeof results.tally[vote[j]] === 'number') {
                results.tally[vote[j]]++;
            } else {
                results.tally[vote[j]] = 1;
            }
        }
    }
    Object.keys(results.tally).forEach(function(key) {
        if(results.tally[key] > votes.length / 2) {
            results.majority.push(key);
        }
    });
    return results;
}

// Requires clean votes
function noVotes(vote, results) {
    var i, j, elim = {};
    results = results || currentResults(votes);
    // Go through first vote to find all results with no votes
    for(i = 1; i < vote.length; i++) {
        for(j = 0; j < vote[i].length; j++) {
            if(!results.tally[vote[i][j]]) {
                elim[vote[i][j]] = true;
            }
        }
    }
    return elim;
}

// Takes total items, number of items higher ranked,
// and number of items tied to find the borda value of all those tied items
function bordaValue(total, higher, numTied) {
    return total - higher - (1 + numTied)/2;
}

// Requires clean votes with votes cleaned of all items with no votes
function fewestVotes(votes, results) {
    var i, j, k, vote, elim = {}, higher, minVotes = Number.MAX_VALUE, numItems, bordaElim;
    results = results || currentResults(votes);
    
    // Go through tallies to find everything with the fewest votes
    Object.keys(results.tally).forEach(function(key) {
        if(results.tally[key] < minVotes) {
            minVotes = results.tally[key];
            elim = {};
            elim[key] = true;
        } else if(results.tally[key] === minVotes) {
            elim[key] = true;
        }
    });

    // if there is a tie for fewest votes, modified borda count to choose which ones to eliminate
    if(Object.keys(elim).length > 1) {
        console.log('borda');
        numItems = Object.keys(results.tally).length;
        for(i = 0; i < votes.length; i++) {
            vote = votes[i];
            higher = 0;
            for(j = 0; j < vote.length; j++) {
                for(k = 0; k < vote[j].length; k++) {
                    if(elim[vote[j][k]] === true) {
                        elim[vote[j][k]] = bordaValue(numItems, higher, vote[j].length);
                    } else if(typeof elim[vote[j][k]] === 'number') {
                        elim[vote[j][k]] = elim[vote[j][k]] + bordaValue(numItems, higher, vote[j].length);
                    }
                }
                higher = higher + vote[j].length;
            }
        }
        console.log(elim);
        bordaElim = {};
        minVotes = Number.MAX_VALUE;
        Object.keys(elim).forEach(function(key) {
            if(elim[key] < minVotes) {
                minVotes = elim[key];
                bordaElim = {};
                bordaElim[key] = true;
            } else if(elim[key] === minVotes) {
                bordaElim[key] = true;
            }
        });
        elim = bordaElim;
    }
    return elim;
}

function eliminate(votes, elim) {
    var i, j, k, vote;
    for(i = 0; i < votes.length; i++) {
        vote = votes[i];
        for(j = 0; j < vote.length; j++) {
            for(k = 0; k < vote[j].length; k++) {
                if(elim[vote[j][k]]) {
                    vote[j].splice(k,1);
                    k--;
                }
            }
            if(vote[j].length === 0) {
                vote.splice(j,1);
                j--;
            }
        }
        votes[i] = vote;
    }
    return votes;
}

exports.instantRunoff = function (votes) {
    var elim, results = currentResults(votes), previousResults = [];
    elim = noVotes(votes[0], results);
    votes = eliminate(votes, elim);
    while(results.majority.length === 0) {
        elim = fewestVotes(votes, results);
        if(Object.keys(elim).length > 0 && Object.keys(elim).length < Object.keys(results.tally).length) {
            votes = eliminate(votes, elim);
        } else {
            results.previousResults = previousResults;
            return results;
        }
        previousResults.push(results);
        results = currentResults(votes);
    }
    results.previousResults = previousResults;
    return results;
}