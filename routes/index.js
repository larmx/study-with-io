const apiRoutes = require('express').Router();

const ResponseFormat = require('../utils/responseFormat');

const usersRoutes = require('./users');

apiRoutes.use('/users', usersRoutes);

apiRoutes.all('*', (req, res) => new ResponseFormat(res).notFound().send());

module.exports = apiRoutes;
