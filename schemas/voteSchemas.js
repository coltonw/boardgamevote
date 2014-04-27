// All JSON schemas related to vote objects

exports.vote = {
    "title": "Vote Schema",
    "type": "array",
    "minItems": 1,
    "items": {
        "type": "array",
        "minItems": 1,
        "items": {
            "type": "string"
        }
    }
};