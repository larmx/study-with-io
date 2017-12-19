const apiRoutes = require('express').Router();

const ResponseFormat = require('../utils/responseFormat');

const usersRoutes = require('./users');
const exercisesRoutes = require('./exercises');

apiRoutes.use('/users', usersRoutes);
apiRoutes.use('/exercises', exercisesRoutes);

apiRoutes.all('*', (req, res) => new ResponseFormat(res).notFound().send());

module.exports = apiRoutes;
