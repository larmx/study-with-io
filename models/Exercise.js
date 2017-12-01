const mongoose = require('mongoose');
const db = require('../config/db.json');

mongoose.Promise = global.Promise;
mongoose.createConnection(`${db.uri}exercises`, { useMongoClient: true });
const { Schema } = mongoose;

const ExerciseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  time: {
    type: Number,
    required: true
  },
  points: {
    type: Number,
    required: true
  }
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);

module.exports = Exercise;
