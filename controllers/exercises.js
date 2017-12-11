const { Exercise } = require('../models');
const { User } = require('../models');
const ResponseFormat = require('../utils/responseFormat');

function getExercise(req, res) {
  const { idUser } = req.params;
  Exercise.findById(
    idUser,
    (err) => {
      if (err) {
        return new ResponseFormat(res).error(err).send();
      }
      return new ResponseFormat(res).success().send();
    }
  );
}

function getExercises(req, res) {
  const { idUser } = req.params;
  User.findById(idUser, (err) => {
    if (err) {
      return new ResponseFormat(res).error(err).send();
    }
    const finishedExercises = res.exercises;
    const recommendedExercises = res.recommendedExercises;
    const result = {
      finishedExercises,
      recommendedExercises,
    }
    const query = Exercise.find(
    {
      _id: {
        $nin: finishedExercises,
        $in: recommendedExercises
      },
    })
    .limit(5);
    query.exec((err, exercises) => {
      if (err) {
        return new ResponseFormat(res).error(err).send();
      }
      if (exercises.length < 5) {
        const n = 5 - exercises.length;
        const query2 = Exercise.find(
        {
          _id: {
            $nin: finishedExercises,
            $nin: recommendedExercises
          },
        })
        .limit(n);
        query2.exec((err, exercises2) => {
          if (err) {
            return new ResponseFormat(res).error(err).send();
          }
          const result = exercises.concat(exercises2);
          return new ResponseFormat(res).success(result).send();
        });
      }
    });
}

module.exports = {
  getExercise,
  getExercises
};
