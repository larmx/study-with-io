var Mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/users");
var Schema = Mongoose.Schema;

var ExerciseSchema =  new Schema({
    title: { type: String },
    time: { type: Number },
    points: { type: Number }
});

var Exercise = mongoose.model('Exercice', ExerciseSchema);

module.exports = Exercise;
