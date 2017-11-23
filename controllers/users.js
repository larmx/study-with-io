const User = require('../models/user');

module.exports = {
    requireStudent (req, res, next) {
       if (!req.user){
            return new ResponseFormat(res).forbidden().send();
       }
       if (req.user.status === "Student"){
            return new ResponseFormat(res).success().send();
        }else{
            return new ResponseFormat(res).forbidden().send();
        }
    };

    async index(req, res) {
      const search = req.param("search");
      if (search == null){
        User.find({}, function(err, users){
            if(err){
                return new ResponseFormat(res).error(err).send();
            }
            return new ResponseFormat(res).success(users).send();
      });
      } else {
        User.find({username : search}, function(err, users){
            if(err){
                return new ResponseFormat(res).error(err).send();
            }
            return new ResponseFormat(res).success(users).send();
      });
      }
    }

    async create(req, res){
        let error = {
            type : []
            fail : false
        }
        const username = req.param("username");
        const password = req.param("password");
        const conf = req.param("confirmation");
        const status = req.param("status");
        const grade = req.param("grade");
        const goal = req.param("goal")


        testUsername(name, error);
        testPassword(password, error);
        testConf(password, conf, error);

        if (error == true){
            return new ResponseFormat(res).error(error.type).send();
        } else {
            User.create({username: username, password: password, status: status, grade: grade, goal: goal}, function(err, user) {
                if(err){
                    return new ResponseFormat(res).error(err).send();
                }
                return new ResponseFormat(res).success().send();
          });
        }
    }

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

    async delete(req, res){
        const id = req.param("id");
        User.findByIdAndRemove(id, function(err, user){
            if(err){
                return new ResponseFormat(res).error(err).send();
            }
            return new ResponseFormat(res).success().send();
        });
    }
}
