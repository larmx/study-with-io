const express = require('express');
const { users } = require('../controllers/users');
// const { userAuthenticate } = require('../middlewares/authentication');
const upload = require('../middlewares/uploader');

const usersRoutes = express.Router();

usersRoutes.use('/photo', express.static('images'));

usersRoutes.post('/register', users.register);
usersRoutes.post('/login', users.login);

usersRoutes.group('/:userId(\\d+)', (userRoutes) => {

  userRoutes.get('/', userAuthenticate, users.get);
  userRoutes.put('/', users.update);
  userRoutes.delete('/', userAuthenticate, users.delete);

  userRoutes.get('/contacts', userAuthenticate, users.getContacts);
  userRoutes.delete('/contacts', userAuthenticate, users.deleteContacts);

  userRoutes.post('/refreshToken', users.refreshToken);
  userRoutes.get('/logout', userAuthenticate, users.logout);

  userRoutes.get('/profiles', userAuthenticate, users.getProfiles);
  userRoutes.post('/profiles', [userAuthenticate, upload.single('photo')], profiles.create);

  userRoutes.group('/profiles/:profileId(\\d+)', (userProfilesRoutes) => {
    userProfilesRoutes.get('/', userAuthenticate, profiles.get);
    userProfilesRoutes.put('/', [userAuthenticate, upload.single('photo')], profiles.update);
    userProfilesRoutes.delete('/', userAuthenticate, profiles.delete);
  });

  userRoutes.post('/exchange/NFC', userAuthenticate, profiles.exchangeNFCCard);

});

usersRoutes.post('/exchange', profiles.exchange);

module.exports = usersRoutes;

