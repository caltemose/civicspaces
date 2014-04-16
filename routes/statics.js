module.exports = function (app) {

  app.get('/resources', function (req, res) {
    res.render('statics/resources.jade');
  });

  app.get('/terms', function (req, res) {
    res.render('statics/terms.jade');
  });

  app.get('/privacy', function (req, res) {
    res.render('statics/privacy.jade');
  });

  app.get('/contact', function (req, res) {
    res.render('statics/contact.jade');
  });

}