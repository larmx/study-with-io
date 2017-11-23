var express = require('express');
var router = express.Router();
module.exports = router;

module.exports = function(app, passport){
 /* GET login page. */
  app.get('/', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('login.ejs', { message: req.flash('message') });
  });

  /* Handle Login POST */
    app.post('/login',
      passport.authenticate('login', {failureRedirect : '/'}),
      function(req, res) {
        if (req.user.statut == "Student"){
          return res.redirect('/student');
          }
        if (req.user.statut == "Teacher"){
          return res.redirect('/teacher');
          }
        else {
          return res.redirect('/');
        }
      });

    app.get('/logout', function(req, res){
      req.logout();
      res.redirect('/');
    });
}
