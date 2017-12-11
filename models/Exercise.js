const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const { Schema } = mongoose;

const ExerciseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  difficulty: {
    type: Number,
    required: true
  },
  questions: [
    {
      question: String,
      answers: [String],
      answerIndex: Number,
      points: Number,
      time: Number,
      hint: String,
    }
  ],
  chapter: {
    type: String,
    required: true,
  }
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);

module.exports = Exercise;
