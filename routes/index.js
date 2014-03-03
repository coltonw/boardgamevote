/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index', { working: 'It is working!' });
};