const mongoose = require('mongoose');
const db = require('../config/db.json');
mongoose.Promise = global.Promise;
mongoose.connect(`${db.uri}users`);
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String },
    password: { type: String },
    status: { type: String },
    grade: { type: Number },
    goal: { type: Number },
    totalPoint : { type: Number },
    professorId: { type: Array }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
