module.exports = function (app) {

  app.get('/password/lost', function (req, res) {
    res.render('password/lost.jade');
  });

}