var config = require('../config'),
    should = require('should'),
    blanket = require('blanket')(config.blanket),
    indiff = require('../lib/indiff');

describe('indifference engine minimaxPairwiseOpposition', function(){
    it('should always return a single winner with valid votes', function(){
        var mmpo = indiff.minimaxPairwiseOpposition(mockVotes());
        mmpo.should.have.property('winner').of.type('string');
    });
});



function mockVotes() {
    return [{
        "_id": {
            "$oid": "5360020b9af96c0200cbde69"
        },
        "vote": [
            [
                "127023",
                "28143"
            ],
            [
                "118",
                "120"
            ],
            [
                "2651",
                "555"
            ],
            [
                "124361",
                "110327"
            ],
            [
                "68448"
            ]
        ],
        "nickname": "Andrew <br /> \"Egypt, Space, or bust\" <br /> Pitman",
        "ballot": {
            "$oid": "535ffe209af96c0200cbde64"
        }
    },{
        "_id": {
            "$oid": "536001a89af96c0200cbde68"
        },
        "vote": [
            [
                "127023",
                "124361"
            ],
            [
                "2651",
                "555"
            ],
            [
                "110327",
                "28143"
            ],
            [
                "120",
                "118"
            ],
            [
                "68448"
            ]
        ],
        "nickname": "Jarvier",
        "ballot": {
            "$oid": "535ffe209af96c0200cbde64"
        }
    },{
        "_id": {
            "$oid": "5360006f9af96c0200cbde67"
        },
        "vote": [
            [
                "68448",
                "2651"
            ],
            [
                "120",
                "555",
                "28143",
                "124361",
                "118",
                "127023"
            ],
            [
                "110327"
            ]
        ],
        "nickname": "Ricky Bobby",
        "ballot": {
            "$oid": "535ffe209af96c0200cbde64"
        }
    },{
        "_id": {
            "$oid": "536000339af96c0200cbde66"
        },
        "vote": [
            [
                "124361"
            ],
            [
                "28143",
                "110327"
            ],
            [
                "68448",
                "120"
            ],
            [
                "127023",
                "118",
                "555",
                "2651"
            ]
        ],
        "nickname": "Lexi tired Colton",
        "ballot": {
            "$oid": "535ffe209af96c0200cbde64"
        }
    },{
        "_id": {
            "$oid": "535ffee29af96c0200cbde65"
        },
        "vote": [
            [
                "555"
            ],
            [
                "124361"
            ],
            [
                "127023"
            ],
            [
                "118"
            ],
            [
                "120",
                "28143"
            ],
            [
                "2651",
                "68448"
            ],
            [
                "110327"
            ]
        ],
        "nickname": "Will \"I should just resign myself to the fact that Princes of Florence is never going to win\" Colton",
        "ballot": {
            "$oid": "535ffe209af96c0200cbde64"
        }
    }];
}