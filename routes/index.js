/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index', {action: 'vote', games: [{name: '7 Wonders'},{name: 'Small World'},{name: 'Ticket To Ride'},{name: 'Lords of Waterdeep'}] });
};