import passport from '../config/passport';

const express = require('express');
const app = require('../app');
const router = express.Router();


/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});


app.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true,
}));


module.exports = router;

