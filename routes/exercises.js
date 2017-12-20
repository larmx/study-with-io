const express = require('express');
const { exercises } = require('../controllers');
console.log(exercises);

const exercisesRoutes = express.Router();

exercisesRoutes.group('/:userId', (exerciseRoutes) => {
  exerciseRoutes.get('/exercises', exercises.getExercises);
  exerciseRoutes.get('/teacherExercises', exercises.getTeacherExercises);
});
exercisesRoutes.post('/', exercises.addExercise);

module.exports = exercisesRoutes;
