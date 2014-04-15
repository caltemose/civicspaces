//var mailer   = require("mailer")

//var mandrillUser = "chad@chadilla.com", mandrillKey = "bt46HUzUpK24w1_7tIm3dA"; //test key, will be expired
var mandrill = require('mandrill-api/mandrill');
var mandrillClient = new mandrill.Mandrill('bt46HUzUpK24w1_7tIm3dA');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function (app, CONFIG) {

  app.get('/password/lost', function (req, res) {
    res.render('password/lost.jade');
  });

  app.post('/password/lost', function(req, res) {
    var email = req.param('email');
    if (!email) return res.render('password/lost.jade', {noEmail:true});
    User.findById(email, function (err, user) {
      if (err) return next(err);
      if (!user) return res.render('password/lost.jade', {noUser:true});
      else {
        var link = CONFIG.host +':'+ CONFIG.port + '/password/reset?e='+user.id + '&p='+user.hash;
        
        var emailBodyHTML = '<html><body>';
        emailBodyHTML += "Hi, " + user.name + "<br><br>";
        emailBodyHTML += "You recently clicked the <b>forgot password?</b> link on the CivicSpaces site.<br>";
        emailBodyHTML += "If this was not you, ignore this email.<br><br>";
        emailBodyHTML += "To reset your password, please open this link in your browser:<br>";
        emailBodyHTML += "<a href='" + link + "'>Click here to reset your password</a><br><br>";
        emailBodyHTML += "You can then change your password.<br><br>";
        emailBodyHTML += "Thanks,<br>CivicSpaces Mgmt";
        emailBodyHTML += "</body></html>";

        var emailBodyTxt = '';
        emailBodyTxt += "Hi, " + user.name + "\n\n";
        emailBodyTxt += "You recently clicked the forgot password? link on the CivicSpaces site.\n\n";
        emailBodyTxt += "If this was not you, ignore this email.\n\n";
        emailBodyTxt += "To reset your password, please open this link in your browser:\n\n";
        emailBodyTxt += "<a href='" + link + "'>Click here to reset your password</a>\n\n";
        emailBodyTxt += "You can then change your password.\n\n";
        emailBodyTxt += "Thanks,\nCivicSpaces Mgmt";

        var message = {
          "html": emailBodyHTML,
          "text": emailBodyTxt,
          "subject": "A Message from CivicSpaces",
          "from_email": "caltemose@gmail.com",
          "from_name": "CivicSpaces Mgmt",
          "to": [{
                  "email": email,
                  "name": user.name
              }],
          "headers": {
              "Reply-To": "caltemose@gmail.com"
          },
          "track_opens": false,
          "track_clicks": false,
          "view_content_link": false
        };

        mandrillClient.messages.send({"message": message, "async": false}, function(result) {
            console.log(result[0]);
            if (result[0].status == 'sent')
              User.findByIdAndUpdate(email, {resetSent: new Date()}, null, function(err, user) {
                if (err) return res.render('password/lost-results.jade', {err:err});
                return res.render('password/lost-results.jade', {success:true});
              });
            else
              return res.render('password/lost-results.jade');
        }, function(e) {
            return res.render('password/lost-results.jade', {err: e});
        });

      }
    })
  })

  app.get('/password/reset', function (req, res) {
    var e = req.param('e'),
        p = req.param('p');
    if (!e || !p) return res.redirect('/')
    User.findById(e, function(err, user) {
      var data = {email: e, pass: p};
      if (err) data.err = err;
      if (!user) return res.redirect('/');
      if (user.resetSent) {
        var now = new Date();
        var hour = 3600000;
        //console.log(now.getTime(), user.resetSent.getTime()+hour);
        if (now.getTime() < user.resetSent.getTime() + hour)
          data.resetActive = true;
      }
      res.render('password/reset.jade', data);
    })
  });

  app.post('/password/reset', function(req, res) {
    var email = req.session.user;
    var newPass = req.param('password');
    
    // var data = {};
    // data.email = req.session.reset.email;
    // var newPass = req.param('password');
    // req.session.destroy();
    // User.findById(data.email, function(err, user) {
    //   if (err) {
    //     data.err = err;
    //     res.render('password/reset.jade', data);
    //   } else {
    //     user.pass = newPass;
    //     user.save(function(err) {
    //       if(err) data.err = err;
    //       else 

    //     })
    //   }
    // })

  })


}