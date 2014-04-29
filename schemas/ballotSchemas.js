// All JSON schemas related to ballot objects

exports.candidates = {
    "title": "Ballot Candidates Schema",
    "type": "array",
    "minItems": 5,
    "items": {
        "type": "object",
        "properties": {
            "id": {
                "type": "string"
            },
            "thumbnail": {
                "type": "string",
                "pattern": "^http:\/\/cf\.geekdo-images\.com\/images\/[a-z0-9]*_t\.jpg$"
            },
            "name": {
                "type": "string"
            }
        },
        "additionalProperties": false
        //TODO: Get this required clause to work
        //"required": [ "id", "thumbnail", "name" ]
    }
};