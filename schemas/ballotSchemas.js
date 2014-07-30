// All JSON schemas related to ballot objects

exports.candidates = {
    "title": "Ballot Candidates Schema",
    "type": "array",
    "minItems": 5,
    "items": {
        "type": "object",
        "properties": {
            "id": {
                "type": "string",
                "required":true
            },
            "thumbnail": {
                "type": "string",
                "pattern": "^http:\/\/cf\.geekdo-images\.com\/images\/[a-z0-9]*_t\.(?:jpg|png)$",
                "required":true
            },
            "name": {
                "type": "string",
                "required":true
            }
        },
        "additionalProperties": false
    }
};