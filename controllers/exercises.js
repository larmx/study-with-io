const { Exercise } = require('../models');
const { User } = require('../models');
const ResponseFormat = require('../utils/responseFormat');

function addExercise(req, res) {
  const {
    title, instructions, difficulty, questions, notion
  } = req.body;
  Exercise.create({
    title, instructions, difficulty, questions, notion
  }, (err) => {
    if (err) {
      return new ResponseFormat(res).error(err).send();
    }
    return new ResponseFormat(res).success().send();
  });
}

function getExercises(req, res) {
  const id = req.params.userId;
  User.findById(id, (err, user) => {
    if (err) {
      return new ResponseFormat(res).error(err).send();
    }
    const finishedExercises = user.exercises;
    const recommendedExercises = user.recommendedExercises;
    const query = Exercise.find({
      _id: {
        $nin: finishedExercises,
        $in: recommendedExercises
      }
    })
      .limit(5);
    query.exec((err2, exercises) => {
      if (err2) {
        return new ResponseFormat(res).error(err2).send();
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
  const id = req.params.userId;
  User.findById(id, (err, user) => {
    if (err) {
      return new ResponseFormat(res).error(err).send();
    }
    const exNotions = [];
    const finishedExercises = user.exercises;
    if (user.tests.length > 0) {
      const test = user.tests[user.tests.length - 1];
      const testDate = test.date;
      if (Date.now() > testDate.setDate(testDate.getDate() - 7)) {
        exNotions.concat(test.notions);
      }
      if (user.notions.length > 0) {
        const lastLesson = user.notions[user.notions.length - 1].date;
        const lessonNotions = user.notions.filter(notion =>
          notion.date.getDate() == lastLesson.getDate() &&
          notion.date.getMonth() == lastLesson.getMonth() &&
          notion.date.getFullYear() == lastLesson.getFullYear());
        exNotions.concat(lessonNotions);
        const exPerNotion = Math.floor(10 / exNotions.length);
        const exercises = [];
        exNotions.forEach((exNotion) => {
          const level = user.notions.find(notion => notion.namename == exNotion).level;
          const query = Exercise.find({
            _id: {
              $nin: finishedExercises
            },
            notion: exNotion,
            difficulty: {
              $gt: level
            }
          })
            .limit(exPerNotion);
          query.exec((err2, notionExercises) => {
            if (err2) {
              return new ResponseFormat(res).error(err).send();
            }
            exercises.concat(notionExercises);
          });
        });
        return new ResponseFormat(res).success(exercises).send();
      }
    }
    return new ResponseFormat(res).success([]).send();
  });
}

module.exports = {
  addExercise,
  getExercises,
  getTeacherExercises
};
