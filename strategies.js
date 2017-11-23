var LocalStrategy = require('passport-local').Strategy;
var Hash = require('password-hash');
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
    User.findOne({ username: username }, function(error, user) {
        if (user &amp;&amp; Hash.verify(password, user.password)) {
            callback(null, user);
        } else if (user || !error) {
            // Username or password was invalid (no MongoDB error)
            error = new Error("Your username or password is invalid. Please try again.");
            callback(error, null);
        } else {
            // Something bad happened with MongoDB. You shouldn't run into this often.
            callback(error, null);
        }
    });
};

module.exports = ex;
