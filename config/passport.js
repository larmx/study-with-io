const User = mongoose.model(UserSchema);

const passport = require('passport');
const PassportLocalStrategy = require('passport-local');

const authStrategy = new PassportLocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
}, ((username, password, done) => {
    User.authenticate(username, password, (error, user) => {
      // You can write any kind of message you'd like.
      // The message will be displayed on the next page the user visits.
      // We're currently not displaying any success message for logging in.
      done(error, user, error ? { message: error.message } : null);
    });
  }));

const authSerializer = function (user, done) {
  done(null, user.id);
};

const authDeserializer = function (id, done) {
  User.findById(id, (error, user) => {
    done(error, user);
  });
};

passport.use(authStrategy);
passport.serializeUser(authSerializer);
passport.deserializeUser(authDeserializer);

// ... continue with Express.js app initialization ...
app.use(require('connect-flash')());
// see the next section
app.use(passport.initialize());

module.exports = passport;