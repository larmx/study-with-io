const { User } = require('../models');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json').users;
const ResponseFormat = require('../utils/responseFormat');

async function login(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const existingUser = await User.findOne({
      username
    });

    if (!existingUser) {
      return new ResponseFormat(res).forbidden('Ce pseudo ne correspond à aucun compte existant').send();
    }

    const rightPassword = await bcrypt.compare(password, existingUser.password);

    if (!rightPassword) {
      return new ResponseFormat(res).forbidden('Mot de passe incorrect').send();
    }

    existingUser.refreshToken = uuidv4();
    const accessToken = await jwt.sign({
      userId: existingUser.id
    }, authConfig.jwt.privateKey, { expiresIn: authConfig.jwt.expiration });

    await existingUser.save();

    return new ResponseFormat(res).success({
      token: accessToken,
      refreshToken: existingUser.refreshToken,
      userId: existingUser.id,
      status: existingUser.status
    }).send();
  } catch (err) {
    return new ResponseFormat(res).error(err).send();
  }
}

function logout(req, res) {
  req.logout();
  return new ResponseFormat(res).success().send();
}

async function register(req, res) {
  const {
    username, password, status, goal, grade
  } = req.body;

  if (password.length < 6) {
    return new ResponseFormat(res).error('Le mot de passe doit au moins contenir 6 caractères').send();
  }

  const encryptedPassword = await bcrypt.hash(password, authConfig.bcrypt.saltRounds);
  await User.create({
    username, password: encryptedPassword, status, grade, goal
  }, (err) => {
    if (err) {
      return new ResponseFormat(res).error(err).send();
    }
    return new ResponseFormat(res).created().send();
  });

  return null;
}

async function update(req, res) {
  const {
    username, password, goal, grade
  } = req.body;
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
}

function deleteUser(req, res) {
  const id = req.param('id');
  User.findByIdAndRemove(id, (err) => {
    if (err) {
      return new ResponseFormat(res).error(err).send();
    }
    return new ResponseFormat(res).success().send();
  });
}

module.exports = {
  login, logout, register, update, deleteUser
};
