module.exports = function (app) {

  app.get('/api/add-geo/:id', function (req, res) {
    var id = req.param('id');
    res.json({hi: 'hi', id: id});
  });

};