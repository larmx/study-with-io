const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/users");
const Hash = require('password-hash');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String },
    password: { type: String, set: function(newValue) {
        return Hash.isHashed(newValue) ? newValue : Hash.generate(newValue);
    } },
    status: { type: String },
    grade: { type: Number },
    goal: { type: Number },
    totalPoint : { type: Number },
    professorId: { type: Array }
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

const User = mongoose.model('User', UserSchema);

module.exports = User;
