var Mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/users");
var Hash = require('password-hash');
var Schema = Mongoose.Schema;

var UserSchema = new Schema({
    username: { type: String },
    password: { type: String, set: function(newValue) {
        return Hash.isHashed(newValue) ? newValue : Hash.generate(newValue);
    } },
    status: { type: String },
    level: { type: Number },
    goal: { type: Number },
    total_point : { type: Number }
});

UserSchema.statics.authenticate = function(username, password, callback) {
    this.findOne({ username: username }, function(error, user) {
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

var User = mongoose.model('User', UserSchema);

module.exports = User;
