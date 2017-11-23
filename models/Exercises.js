const mongoose = require('mongoose');
const db = require('../config/db.json');
mongoose.Promise = global.Promise;
mongoose.connect(`${db.uri}exercises`);
const { Schema } = mongoose;

const ExerciseSchema = new Schema({
  title: { type: String },
  time: { type: Number },
  points: { type: Number },
});

const Exercise = mongoose.model('Exercice', ExerciseSchema);

module.exports = Exercise;
