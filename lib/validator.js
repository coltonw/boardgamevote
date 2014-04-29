// Simple validator using JSV and JSON schemas
var env = require("JSV").JSV.createEnvironment(),
    schemasDir = __dirname + '/../schemas/',
    fs = require('fs');

function createValidator(schema) {
    return function(obj) {
    var report = env.validate(obj, schema);
        if(report.errors.length === 0) {
            return true;
        } else {
            console.log(obj);
            console.log(report.errors);
            return false;
        }
    }
}
    
fs.readdirSync(schemasDir).forEach(function(schemaFileName){
    var schemas = require(schemasDir + schemaFileName);
    Object.keys(schemas).forEach(function(schemaKey) {
        // Later may change the validator method to use the filename as well
        // something like exports[schemaFileName + '_' + schemaKey] = ...
        exports[schemaKey] = createValidator(schemas[schemaKey]);
    });
});

exports.objectIdHexString = function(hexString) {
    if(typeof hexString === 'string' && (/^[0-9a-fA-F]{24}$/).test(hexString)) {
        return true;
    } else {
        console.log(hexString + ' is an invalid hex id');
        return false;
    }
}