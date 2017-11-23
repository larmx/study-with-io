const express = require('express');
const users = require('../controllers/users');

module.exports = function(app, passport){
    const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

    app.all('/student/*', users.requireStudent);
    app.get('/admin/users', users.index);
    app.post('/student', users.create);
    app.post('/student/delete', user.delete);
}
