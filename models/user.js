var Mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/users");
var Schema = Mongoose.Schema;

var UserSchema = new Schema({
    username: { type: String },
    password: { type: String, set: function(newValue) {
        return Hash.isHashed(newValue) ? newValue : Hash.generate(newValue);
    } },
    status: { type: String },
    grade: { type: Number },
    goal: { type: Number },
    total_point : { type: Number }
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
