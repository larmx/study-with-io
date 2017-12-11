const express = require('express');
const { exercises } = require('../controllers');

const exercisesRoutes = express.Router();

exercisesRoutes.group('/:userId', (exerciseRoutes) => {
  exerciseRoutes.get('/exercises', exercises.getExercises);
});

module.exports = exercisesRoutes;
