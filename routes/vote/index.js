//
// Vote database interactions
//
exports.create = function(req, res, next){
  var body = req.body, i;
  console.log(body);
  console.log(req);
  for(i = 0; typeof body[i] !== 'undefined'; i++) {
    console.log(body[i]);
  }
  res.message('Thanks for your vote!');
  res.redirect('/');
};