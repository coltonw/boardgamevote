// Indifference engine library

var seed = require('seed-random');

// Gets results from a clean list of votes
// Results return in format {tally:{'a':1,'b':3}, majority:['b']}
function currentResults(votes) {
    var i, j, tallyKeys,results = {
        tally: {},
        majority: []
    };
    for(i = 0; i < votes.length; i++) {
        vote = votes[i].vote[0];
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
    // Go through all the games in the first vote to find all games with no votes
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
        numItems = Object.keys(results.tally).length;
        for(i = 0; i < votes.length; i++) {
            vote = votes[i].vote;
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

function eliminate(votes, elim, keepInstead) {
    var i, j, k, vote;
    keepInstead = keepInstead || false;
    for(i = 0; i < votes.length; i++) {
        vote = votes[i].vote;
        for(j = 0; j < vote.length; j++) {
            for(k = 0; k < vote[j].length; k++) {
                // Use !== which is equivalent to XOR,
                // ! converts both to booleans and does not affect result
                if(!elim[vote[j][k]] !== !keepInstead) {
                    vote[j].splice(k,1);
                    k--;
                }
            }
            if(vote[j].length === 0) {
                vote.splice(j,1);
                j--;
            }
        }
        votes[i].vote = vote;
    }
    return votes;
}

function irvTieBreaker(votes, results) {
    var i, n, k, tmp, keepers, vote, newResults = results,
        rand = seed(votes[0]._id);
    // Shuffle votes using Fisher–Yates shuffle because they will now have a priority order
    for(n = votes.length - 1; n > 0; n--) {
        k = Math.floor(rand() * (n + 1));
        tmp = votes[k];
        votes[k] = votes[n];
        votes[n] = tmp;
    }
    
    // In order, use each vote as a tiebreaker
    for(i = 0; i < votes.length; i++) {
        vote = votes[i].vote;
        var keepers = {};
        
        vote[0].forEach(function(game){
            keepers[game] = true;
        })
        // Only eliminate if you are eliminating something but not everything
        if(Object.keys(keepers).length > 0 && Object.keys(keepers).length < Object.keys(newResults.tally).length) {
            votes = eliminate(votes, keepers, true);
            newResults = currentResults(votes);
        }
        if(newResults.majority.length === 1) {
            results.winner = newResults.majority[0];
            return results;
        }
    }

    if(newResults.majority.length > 1) {
        results.winner = newResults.majority[Math.floor(rand() * newResults.majority.length)];
    } else {
        results.winner = Object.keys(newResults.tally)[Math.floor(rand() * Object.keys(newResults.tally).length)];
    }

    return results;
}

// Assumes data will be a list of vote objects from the database each with an _id and a vote array containing the actual vote
exports.instantRunoff = function (votes) {
    var elim, results = currentResults(votes), previousResults = [];
    elim = noVotes(votes[0].vote, results);
    votes = eliminate(votes, elim);
    while(results.majority.length !== 1) {
        elim = fewestVotes(votes, results);
        if(Object.keys(elim).length > 0 && Object.keys(elim).length < Object.keys(results.tally).length) {
            votes = eliminate(votes, elim);
        } else {
            results.previousResults = previousResults;
            return irvTieBreaker(votes, results);
        }
        previousResults.push(results);
        results = currentResults(votes);
    }
    results.previousResults = previousResults;
    results.winner = results.majority[0];
    return results;
}

function tieBreaker(votes, tied) {
    var i, n, k, tmp, keepers, vote, tmpName,
        rand = seed(votes[0]._id), result = {tieBreakers: []};
    // Shuffle votes using Fisher–Yates shuffle because they will now have a priority order
    for(n = votes.length - 1; n > 0; n--) {
        k = Math.floor(rand() * (n + 1));
        tmp = votes[k];
        votes[k] = votes[n];
        votes[n] = tmp;
    }
    
    // In order, use each vote as a tiebreaker
    for(i = 0; i < votes.length; i++) {
        tmpName = votes[i].nickname || "Anonymous";
        result.tieBreakers.push(tmpName);
        vote = votes[i].vote;
        var keepers = vote[0].filter(function(n) {
            return tied.indexOf(n) != -1;
        });

        if(keepers.length === 1) {
            result.winner = keepers[0];
            return result;
        } else if(keepers.length === tied.length) {
            continue;
        } else if(keepers.length > 0) {
            tied = keepers;
        }
    }
    result.tieBreakers.push('Random');
    result.winner = tied[Math.floor(rand() * tied.length)];
    return result;
}

// Assumes data will be a list of vote objects from the database each with an _id and a vote array containing the actual vote
exports.minimaxPairwiseOpposition = function (votes) {
    // Current minimax x object is {X_ID:{max: NUMBER, nextMax: NUMBER, y:{Y_ID: NUMBER}}
    var x = {},
        min = Number.MAX_VALUE,
        result = {}, current, i, xj, xk, yj, yk, vote, tieBreakResults;

    for(i = 0; i < votes.length; i++) {
        vote = votes[i].vote;
        for(xj = vote.length-1; xj >= 0; xj--) {
            for(xk = 0; xk < vote[xj].length; xk++) {
                if(!x[vote[xj][xk]]) {
                    x[vote[xj][xk]] = {max: 0, nextMax: 0, y:{}};
                }
                for(yj = 0; yj < xj; yj++) {
                    for(yk = 0; yk < vote[yj].length; yk++) {
                        if(!x[vote[xj][xk]].y[vote[yj][yk]]) {
                            x[vote[xj][xk]].y[vote[yj][yk]] = 1;
                        } else {
                            x[vote[xj][xk]].y[vote[yj][yk]]++;
                        }
                        // Currently next max is not used until I further investigate
                        if(x[vote[xj][xk]].y[vote[yj][yk]] <= x[vote[xj][xk]].max && x[vote[xj][xk]].y[vote[yj][yk]] > x[vote[xj][xk]].nextMax) {
                            x[vote[xj][xk]].nextMax = Math.max(x[vote[xj][xk]].nextMax, x[vote[xj][xk]].y[vote[yj][yk]]);
                        }
                        x[vote[xj][xk]].max = Math.max(x[vote[xj][xk]].max, x[vote[xj][xk]].y[vote[yj][yk]]);
                    }
                }
            }
        }
    }
    Object.keys(x).forEach(function(candididateId) {
        if(x[candididateId].max < min) {
            min = x[candididateId].max;
            current = [candididateId];
        } else if(x[candididateId].max == min) {
            current.push(candididateId);
        }
    });
    if(current.length === 1) {
        result.winner = current[0];
        return result;
    }
    result.tied = current.slice(0);
    tieBreakResults = tieBreaker(votes, current);
    result.winner = tieBreakResults.winner;
    result.tieBreakers = tieBreakResults.tieBreakers;
    return result;
}