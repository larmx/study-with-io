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
      role: existingUser.role,
      goal: existingUser.goal,
      points: existingUser.currentPoints,
      objective: existingUser.objective,
      progress: existingUser.progress
    }).send();
  } catch (err) {
    return new ResponseFormat(res).error(err).send();
  }
}

async function onOpen(req, res) {
  const id = req.body.userId;
  try {
    const user = await User.findById(id);
    console.log(user);
    user.refreshToken = uuidv4();
    const accessToken = await jwt.sign({
      userId: user.id
    }, authConfig.jwt.privateKey, { expiresIn: authConfig.jwt.expiration });
    return new ResponseFormat(res).success({
      token: accessToken,
      refreshToken: user.refreshToken,
      userId: user.id,
      role: user.role,
      goal: user.goal,
      points: user.currentPoints,
      objective: user.objective,
      progress: user.progress
    }).send();
  } catch (err2) {
    return new ResponseFormat(res).error(err2).send();
  }
}

function logout(req, res) {
  req.logout();
  return new ResponseFormat(res).success().send();
}

async function register(req, res) {
  const {
    email, firstname, lastname, password, role, goal, grade
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
  const idUser = req.body.userId;

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
  const id = req.params.userId;
  User.findByIdAndRemove(id, (err) => {
    if (err) {
      return new ResponseFormat(res).error(err).send();
    }
    return new ResponseFormat(res).success().send();
  });
}

function getContactInfo(req, res) {
  const id = req.params.userId;
  console.log('bite');
  console.log(id);
  User.findById(
    id,
    (err, user) => {
      if (err) {
        return new ResponseFormat(res).error(err).send();
      }
      const info = {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone
      };
      return new ResponseFormat(res).success(info).send();
    }
  );
}

function getExercises(req, res) {
  const id = req.params.userId;
  User.findById(id, (err) => {
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
    {
      new: true
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

function lastLessonNotions(req, res) {
  const id = req.params.userId;
  User.findById(id, (err, user) => {
    if (err) {
      return new ResponseFormat(res).error(err).send();
    }
    if (user.notions.length > 0) {
      const lastLesson = user.notions[user.notions.length - 1].date;
      const result = user.notions.filter(notion =>
        notion.date.getDate() == lastLesson.getDate() &&
        notion.date.getMonth() == lastLesson.getMonth() &&
        notion.date.getFullYear() == lastLesson.getFullYear());
      return new ResponseFormat(res).success(result).send();
    }
    return new ResponseFormat(res).success([]).send();
  });
}

function lastTestNotions(req, res) {
  const id = req.params.userId;
  User.findById(id, (err, user) => {
    if (err) {
      return new ResponseFormat(res).error(err).send();
    }
    if (user.tests.length > 0) {
      if (user.tests[user.tests.length - 1] > Date.now()) {
        if (user.tests.length > 1) {
          const lastTest = user.tests[user.tests.length - 2];
          const result = user.notions.filter(notion =>
            notion.date.getDate() == lastTest.getDate() &&
            notion.date.getMonth() == lastTest.getMonth() &&
            notion.date.getFullYear() == lastTest.getFullYear());
          return new ResponseFormat(res).success(result).send();
        }
        return new ResponseFormat(res).success([]).send();
      }
      const lastTest = user.tests[user.tests.length - 1];
      const result = user.notions.filter(notion =>
        notion.date.getDate() == lastTest.getDate() &&
        notion.date.getMonth() == lastTest.getMonth() &&
        notion.date.getFullYear() == lastTest.getFullYear());
      return new ResponseFormat(res).success(result).send();
    }
    return new ResponseFormat(res).success([]).send();
  });
}

function nextTest(req, res) {
  const id = req.body.userId;
  const testDate = req.body.testDate;
  const notions = req.body.notions;
  User.findByIdAndUpdate(
    id,
    {
      $push: {
        tests: {
          date: testDate,
          notions
        }
      }
    },
    (err) => {
      if (err) {
        return new ResponseFormat(res).error(err).send();
      }
      return new ResponseFormat(res).success().send();
    }
  );
}

function lessonEnd(req, res) {
  const id = req.body.userId;
  const notions = req.body.notions;
  notions.forEach((notion) => {
    User.findOneAndUpdate(
      {
        _id: id,
        'notions.name': notion.name
      },
      {
        $set: {
          'notions.$.date': Date.now,
          'notions.$.level': notion.level
        }
      },
      (err) => {
        if (err) {
          return new ResponseFormat(res).error(err).send();
        }
        User.findByIdAndUpdate(
          id,
          {
            $push: {
              lessons: Date.now
            }
          },
          (err2) => {
            if (err2) {
              return new ResponseFormat(res).error(err).send();
            }
            return new ResponseFormat(res).success().send();
          }
        );
      }
    );
  });
}

function getTeachers(req, res) {
  const query = User.find({
    role: 'teacher'
  });
  query.select('_id email firstname lastname');
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
  const id = req.params.userId;
  User.findById(
    id,
    (err, user) => {
      if (err) {
        return new ResponseFormat(res).error(err).send();
      }
      const relationships = _.map(user.relationships, (key, value) =>
        ({ relationship: key, _id: key._id }));
      const result = { relationships: relationships.filter(isrStatus, 'accepted') };
      return new ResponseFormat(res).success(result).send();
    });
}

function sendRequest(req, res) {
  const id = req.body.idRecipient;
  console.log(id);
  User.findByIdAndUpdate(
    id,
    {
      $push: {
        'relationships': {
          recipient: id,
          rStatus: 'pending'
        }
      }
    },
    (err) => {
      if (err) {
        return new ResponseFormat(res).error(err).send();
      }
      return new ResponseFormat(res).success().send();
    }
  );
}

function acceptRequest(req, res) {
  const idrq = req.body.idRequester;
  const idrc = req.body.idRecipient;
  User.findByIdAndUpdate(
    idrq,
    {
      $push: {
        'relationships': {
          recipient: idrc,
          rStatus: 'accepted'
        }
      }
    }, (err, user) => {
      if (err) {
        return new ResponseFormat(res).error(err).send();
      }
      const recipient = user.relationships.find(relationship =>
        relationship.recipient == idrc);
      recipient.rStatus = 'accepted';
      user.save();
      User.findById(idrc, (err2, user2) => {
        if (err2) {
          return new ResponseFormat(res).error(err2).send();
        }
        const requester = user2.relationships.id(idrq);
        requester.rStatus = 'accepted';
        user.save();
        return new ResponseFormat(res).success().send();
      });
    }
  );
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
  onOpen,
  logout,
  register,
  update,
  deleteUser,
  getTeachers,
  getStudents,
  getRelations,
  getRequests,
  getContactInfo,
  sendRequest,
  acceptRequest,
  refuseRequest,
  addPoints,
  removePoints,
  lastLessonNotions,
  lastTestNotions,
  nextTest,
  lessonEnd,
  getExercises,
  addExercise,
  addRecommendedExercise
};
