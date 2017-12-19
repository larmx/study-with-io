const mongoose = require('mongoose');

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstname: String,
  lastname: String,
  phone: String,
  role: String,
  grade: Number,
  goal: {
    type: Number,
    default: 0
  },
  notions: [
    {
      name: String,
      level: {
        type: Number,
        default: 1
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  tests: [
    {
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  lessons: [
    {
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  currentPoints: {
    type: Number,
    default: 0
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  badges: [Number],
  relationships: [
    {
      recipient: Schema.Types.ObjectId,
      rStatus: String
    }
  ],
  exercises: [Schema.Types.ObjectId],
  recommendedExercises: [Schema.Types.ObjectId],
  refreshToken: String
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
