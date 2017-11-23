const User = require('../models/user');

module.exports = {
    testUsername(username, error){
      if (username.length < 3){
          error.type.push('lenUsername');
          error.fail = true;
        }
      User.find({username : username}, function(err, user){
         if (user != null){
             error.type.push('username');
             error.fail = true;
           };
         })
     }

    testPassword(password, error){
      if (password.length < 3){
            error.type.push('password');
            error.fail = true;
        }
    }

    testConf(password, conf, error){
      if (password != conf){
        error.type.push('conf');
        error.fail = true;
      }
    }
}
