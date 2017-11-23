const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/users');
const { Schema } = mongoose;

const ExerciseSchema = new Schema({
  title: { type: String },
  time: { type: Number },
  points: { type: Number },
});

const Exercise = mongoose.model('Exercice', ExerciseSchema);

module.exports = Exercise;
