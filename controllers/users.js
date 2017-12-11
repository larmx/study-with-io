const { User } = require('../models');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json').users;
const ResponseFormat = require('../utils/responseFormat');
const _ = require('lodash');

function isrStatus(value) {
  return value.relationship.rStatus == this;
}
 
async function login(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const existingUser = await User.findOne({
      email
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
      role: existingUser.role
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
    email, firstname, lastname, password, status, goal, grade
  } = req.body;

  if (password.length < 6) {
    return new ResponseFormat(res).error('Le mot de passe doit au moins contenir 6 caractères').send();
  }

  const encryptedPassword = await bcrypt.hash(password, authConfig.bcrypt.saltRounds);
  await User.create({
    email, password: encryptedPassword, firstname, lastname, role, grade, goal
  }, (err) => {
    if (err) {
      return new ResponseFormat(res).error(err).send();
    }
    /* Pour connecter l'user quand il se register, mais ne fonctionne pas
    const createdUser = await User.findOne({
      email
    });
    createdUser.refreshToken = uuidv4();
    const accessToken = await jwt.sign({
      userId: createdUser.id
    }, authConfig.jwt.privateKey, { expiresIn: authConfig.jwt.expiration });

    await createdUser.save();

    return new ResponseFormat(res).success({
      token: accessToken,
      refreshToken: createdUser.refreshToken,
      userId: createdUser.id,
      role: createdUser.role
    }).send(); */
    return new ResponseFormat(res).success().send();
  });

  return null;
}

async function update(req, res) {
  const {
    email, password, goal, grade
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

    user.email = email || user.email;
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
  const { idUser } = req.params;
  User.findByIdAndRemove(idUser, (err) => {
    if (err) {
      return new ResponseFormat(res).error(err).send();
    }
    return new ResponseFormat(res).success().send();
  });
}

function getPhone(req, res) {
  const { idUser } = req.params;
  User.findById(idUser,
    (err, user) => {
      if (err) {
        return new ResponseFormat(res).error(err).send();
      }
      return new ResponseFormat(res).success(phone).send();
    });
}

function getExercises(req, res) {
  const { idUser } = req.params;
  User.findById(idUser, (err) => {
    if (err) {
      return new ResponseFormat(res).error(err).send();
    }
    const exercises = res.exercises;
    const recommendedExercises = res.recommendedExercises;
    const result = {
      exercises,
      recommendedExercises,
    }
    return new ResponseFormat(res).success(result).send();
  })
}

function addExercise(req, res) {
  const ids = req.body.idStudent;
  const ide = req.body.idExercise;
  User.findByIdAndUpdate(
    ids,
    {
      $push: {
        'exercises': ide,
      }
    },
    (err) => {
      if (err) {
        return new ResponseFormat(res).error(err).send();
      }
      return new ResponseFormat(res).success().send();
    });
}

function addRecommendedExercise(req, res) {
  const ids = req.body.idStudent;
  const ide = req.body.idExercise;
  User.findByIdAndUpdate(
    ids,
    {
      $push: {
        'recommendedExercises': ide,
      }
    },
    (err) => {
      if (err) {
        return new ResponseFormat(res).error(err).send();
      }
      return new ResponseFormat(res).success().send();
    });
}

function addPoints(req, res) {
  const id = req.body.id;
  const pts = req.body.points;
  User.findByIdAndUpdate(
    id,
    {
      $inc: {
        currentPoints: pts,
        totalPoints: pts
      }
    },
    (err) => {
      if (err) {
        return new ResponseFormat(res).error(err).send();
      }
      return new ResponseFormat(res).success().send();
    });
}

function removePoints(req, res) {
  const id = req.body.id;
  const pts = req.body.points;
  User.findByIdAndUpdate(
    id,
    {
      $inc: {
        currentPoints: -pts
      }
    },
    (err) => {
      if (err) {
        return new ResponseFormat(res).error(err).send();
      }
      return new ResponseFormat(res).success().send();
    });
}

function getTeachers(req, res) {
  const query = User.find({
    role: 'teacher'
  });
  query.select('email firstname lastname');
  query.exec((err, teachers) => {
    if (err) {
      return new ResponseFormat(res).error(err).send();
    }
    return new ResponseFormat(res).success(teachers).send();
  });
}

function getStudents(req, res) {
  const query = User.find({
    role: 'student'
  });
  query.select('email firstname lastname');
  query.exec((err, students) => {
    if (err) {
      return new ResponseFormat(res).error(err).send();
    }
    return new ResponseFormat(res).success(students).send();
  });
}

function getRequests(req, res) {
  const id = req.params.userId;
  User.findById(
    id,
    (err, user) => {
      if (err) {
        return new ResponseFormat(res).error(err).send();
      }
      const relationships = _.map(user.relationships, (key, value) =>
        ({ relationship: key, _id: key._id }));
      const result = relationships.filter(isrStatus, 'pending');
      return new ResponseFormat(res).success(result).send();
    });
}

function getRelations(req, res) {
  const id = req.params.id;
  User.findById(
    id,
    (err, user) => {
      if (err) {
        return new ResponseFormat(res).error(err).send();
      }
      const relationships = _.map(user.relationships, (key, value) =>
        ({ relationship: key, _id: key._id }));
      const result = relationships: relationships.filter(isrStatus, 'accepted');
      return new ResponseFormat(res).success(result).send();
    });
}

function sendRequest(req, res) {
  const idrq = req.body.idRequester;
  const idrc = req.body.idRecipient;
  console.log(idrq);
  console.log(idrc);
  User.findByIdAndUpdate(
    idrq,
    {
      $push: {
        'relationships': {
          recipient: idrc,
          rStatus: 'pending',
        }
      }
    },
    (err) => {
      if (err) {
        console.log(err);
        return new ResponseFormat(res).error(err).send();
      }
      User.findByIdAndUpdate(
        idrc,
        {
          $push: {
            'relationships': {
              recipient: idrq,
              rStatus: 'pending',
            }
          }
        },
        (err2) => {
          if (err2) {
            return new ResponseFormat(res).error(err).send();
          }
          return new ResponseFormat(res).success().send();
        });
    });
}

function acceptRequest(req, res) {
  const idrq = req.body.idRequester;
  const idrc = req.body.idRecipient;
  User.findById(idrq, (err, user) => {
    if (err) {
      return new ResponseFormat(res).error(err).send();
    } else {
      const recipient = user.relationships.id(idrc);
      recipient.rStatus = 'accepted';
      user.save();
      User.findById(idrc, (err, user) => {
        if (err) {
          return new ResponseFormat(res).error(err).send();
        } else {
          const requester = user.relationships.id(idrq);
          requester.rStatus = 'accepted';
          user.save();
          return new ResponseFormat(res).success().send();
        }
      });
    }
  });
}

function refuseRequest(req, res) {
  const idrq = req.body.idRequester;
  const idrc = req.body.idRecipient;
  User.findByIdAndUpdate(
    idrq,
    {
      $pullAll: {
        relationships: {
          recipient: [idrc],
        }
      }
    },
    (err) => {
      if (err) {
        return new ResponseFormat(res).error(err).send();
      }
      User.findByIdAndUpdate(
        idrc,
        {
          $pullAll: {
            relationships: {
              recipient: [idrq],
            }
          }
        },
        (err2) => {
          if (err2) {
            return new ResponseFormat(res).error(err).send();
          }
          return new ResponseFormat(res).success().send();
        });
    });
}

module.exports = {
  login,
  logout,
  register,
  update,
  deleteUser,
  getTeachers,
  getStudents,
  getRelations,
  getRequests,
  getRelations,
  sendRequest,
  acceptRequest,
  refuseRequest,
  addPoints,
  removePoints,
  getExercises,
  addExercise,
  addRecommendedExercise,
};
