const express = require('express');
const users = require('../controllers/users');

const usersRoutes = express.Router();
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

usersRoutes.put('/register', users.register);
usersRoutes.post('/login', passport.authenticate('login'), users.login);
usersRoutes.group('/:userId(\\d+)', (userRoutes) => {
  userRoutes.post('/', ensureLoggedIn, users.update);
  userRoutes.delete('/', ensureLoggedIn, users.deleteUser);
  userRoutes.get('/logout', ensureLoggedIn, users.logout);
});

module.exports = usersRoutes;
