const User = require('../models/user');
const bcrypt = require('bcrypt');
const authConfig = require('../config/auth');
const {testUsername, testPassword, testConf} = require('../utils/testInput');

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
    },

    login(req, res) {
      if (req.user.statut == "Student"){
        return res.redirect('/student');
        }
      if (req.user.statut == "Teacher"){
        return res.redirect('/teacher');
        }
      else {
        return res.redirect('/');
      }
  },

    logout(req, res) {
        req.logout();
        return new ResponseFormat(res).success().send();
    },

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
    },

    async register(req, res){
        console.log("COUCOUUUUUUUUUU");
        let error = {
            type : [],
            fail : false
        }
        const { username, password, conf, status, goal, grade} = req.body;

        testUsername(username, error);
        testPassword(password, error);
        testConf(password, conf, error);

        if (error == true){
            return new ResponseFormat(res).error(error.type).send();
        } else {
            encryptedPassword = await bcrypt.hash(password, authConfig.bcrypt.saltRounds);
            User.create({username: username, password: encryptedPassword, status: status, grade: grade, goal: goal}, function(err, user) {
                if(err){
                    return new ResponseFormat(res).error(err).send();
                }
                return new ResponseFormat(res).success().send();
          });
        }
    },

    async update(req, res) {
        const { username, password, goal, grade} = req.body;
        const { idUser } = req.params;

        if (!idUser) {
          return new ResponseFormat(res).forbidden('ID utilisateur manquant.').send();
        }

        try {
          const user = await User.findById(idUser);

          if (!user) {
            return new ResponseFormat(res).notFound('Utilisateur introuvable.').send();
          }

          user.username = username || user.username;
          user.password = password || user.password;
          user.goal = goal || user.goal;
          user.grade = grade || user.grade;

          await user.validate();

          if (password) {
            user.password = await bcrypt.hash(password, authConfig.bcrypt.saltRounds);
          }

          await user.save();

          return new ResponseFormat(res).success(user).send();

        } catch (e) {
          return new ResponseFormat(res).error(e).send();
        }
      },

    async delete(req, res){
        const id = req.param("id");
        User.findByIdAndRemove(id, function(err, user){
            if(err){
                return new ResponseFormat(res).error(err).send();
            }
            return new ResponseFormat(res).success().send();
        });
    },
}
