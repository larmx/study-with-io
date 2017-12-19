const { Exercise } = require('../models');
const { User } = require('../models');
const ResponseFormat = require('../utils/responseFormat');

function addExercise(req, res) {
  const {
    title, instructions, difficulty, questions, chapter
  } = req.body;
  Exercise.create({
    title, instructions, difficulty, questions, chapter
  }, (err) => {
    if (err) {
      return new ResponseFormat(res).error(err).send();
    }
    return new ResponseFormat(res).success().send();
  });
}

function getExercises(req, res) {
  const { idUser } = req.params;
  User.findById(idUser, (err) => {
    if (err) {
      return new ResponseFormat(res).error(err).send();
    }
    const finishedExercises = res.exercises;
    const recommendedExercises = res.recommendedExercises;
    const query = Exercise.find({
      _id: {
        $nin: finishedExercises,
        $in: recommendedExercises
      }
    })
      .limit(5);
    query.exec((err2, exercises) => {
      if (err2) {
        return new ResponseFormat(res).error(err3).send();
      }
      if (exercises.length < 5) {
        const n = 5 - exercises.length;
        const query2 = Exercise.find({
          _id: {
            $nin: finishedExercises.concat(recommendedExercises)
          }
        })
          .limit(n);
        query2.exec((err3, exercises2) => {
          if (err3) {
            return new ResponseFormat(res).error(err3).send();
          }
          const result = exercises.concat(exercises2);
          return new ResponseFormat(res).success(result).send();
        });
      }
    });
  });
}

function getTeacherExercises(req, res) {

}

module.exports = {
  addExercise,
  getExercises,
  getTeacherExercises
};
