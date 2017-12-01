const mongoose = require('mongoose');
const db = require('../config/db.json');

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
mongoose.connect(`${db.uri}users`, { useMongoClient: true });

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  status: String,
  grade: Number,
  goal: Number,
  totalPoint: Number,
  professorId: Array,
  refreshToken: String
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
