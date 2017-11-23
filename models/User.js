const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/users");
var Schema = Mongoose.Schema;

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

var User = mongoose.model('User', UserSchema);

module.exports = User;
