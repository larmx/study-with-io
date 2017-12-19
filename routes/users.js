const express = require('express');
const { users } = require('../controllers');
const { userAuthenticate } = require('../middlewares/authentication');

const usersRoutes = express.Router();

usersRoutes.post('/register', users.register);
usersRoutes.post('/login', users.login);
usersRoutes.group('/:userId', (userRoutes) => {
  userRoutes.post('/update', userAuthenticate, users.update);
  userRoutes.delete('/delete', userAuthenticate, users.deleteUser);
  userRoutes.get('/logout', userAuthenticate, users.logout);
  userRoutes.get('/requests', users.getRequests);
  userRoutes.get('/relations', users.getRelations);
  userRoutes.get('/info', users.getContactInfo);
  userRoutes.get('/lessonNotions', users.lastLessonNotions);
  userRoutes.get('/testNotions', users.lastTestNotions);
});
usersRoutes.get('/teachers', users.getTeachers);
usersRoutes.get('/students', users.getStudents);
usersRoutes.post('/sendRequest', users.sendRequest);
usersRoutes.post('/acceptRequest', users.acceptRequest);
usersRoutes.post('/refuseRequest', users.refuseRequest);
usersRoutes.post('/exercise', users.addExercise);
usersRoutes.post('/recommendExercise', users.addRecommendedExercise);
usersRoutes.post('/addPoints', users.addPoints);
usersRoutes.post('/removePoints', users.removePoints);
usersRoutes.post('/onOpen', userAuthenticate, users.onOpen);
usersRoutes.post('/nextTest', userAuthenticate, users.nextTest);
usersRoutes.post('/lessonEnd', userAuthenticate, users.lessonEnd);

module.exports = usersRoutes;
