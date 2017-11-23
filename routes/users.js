const express = require('express');
const { users } = require('../controllers/users');
// const { userAuthenticate } = require('../middlewares/authentication');
const upload = require('../middlewares/uploader');

const usersRoutes = express.Router();

module.exports = function(usersRoutes, passport){
    const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
    usersRoutes.put('/register', users.register);
    usersRoutes.post('/login', passport.authenticate('login'), users.login);
}

usersRoutes.group('/:userId(\\d+)', (userRoutes) => {
  userRoutes.get('/', ensureLoggedIn, users.get);
  userRoutes.post('/', ensureLoggedIn, users.update);
  userRoutes.delete('/', ensureLoggedIn, users.delete);
  userRoutes.get('/logout', ensureLoggedIn, users.logout);
});

module.exports = usersRoutes;
