var LocalStrategy = require('passport-local').Strategy;

var User = require('./models/user');

var ex = function (passport){

  passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback : true
  },
  function(req, username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      console.log("---- Dans Strategy : avant les test find user");
      if (err) {
        console.log("---- Dans Strategy : if err");
      return done(err); }
      if (!user) {
        req.session["donne"]=username;
        req.session["username"]="Veuillez saisir un mail valide.";
        console.log("---- Dans Strategy : if pas d'user" + req.session);
       return done(null, false);
      }
      if (!user.validPassword(password)) {
        req.session["password"]="Veuillez saisir un mot de passe correct.";
        console.log("---- Dans Strategy : if pass incorecr" + req.session);
        return done(null, false);
      }
      console.log("---- Dans Strategy : Devrait pas y avoir de pb");
      return done(null, user);
    });
  }
));
}

console.log(ex)

module.exports = ex;
