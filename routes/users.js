const express = require('express');
const { users } = require('../controllers');
const { userAuthenticate } = require('../middlewares/authentication');

const usersRoutes = express.Router();

usersRoutes.post('/register', users.register);
usersRoutes.post('/login', users.login);
usersRoutes.group('/:userId(\\d+)', (userRoutes) => {
  userRoutes.post('/', userAuthenticate, users.update);
  userRoutes.delete('/', userAuthenticate, users.deleteUser);
  userRoutes.get('/logout', userAuthenticate, users.logout);
});

module.exports = usersRoutes;
