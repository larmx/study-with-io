const express = require('express');
const { users } = require('../controllers');
const { userAuthenticate } = require('../middlewares/authentication');

const usersRoutes = express.Router();

usersRoutes.post('/register', users.register);
usersRoutes.post('/login', users.login);
usersRoutes.group('/:userId', (userRoutes) => {
  userRoutes.post('/', userAuthenticate, users.update);
  userRoutes.delete('/', userAuthenticate, users.deleteUser);
  userRoutes.get('/logout', userAuthenticate, users.logout);
	userRoutes.get('/requests', users.getRequests);
});
usersRoutes.get('/teachers', users.getTeachers);
usersRoutes.post('/sendRequest', users.sendRequest);
usersRoutes.post('/acceptRequest', users.acceptRequest);
usersRoutes.post('/refuseRequest', users.refuseRequest);

module.exports = usersRoutes;
