const User = require('../models/User');
const ResponseFormat = require('../utils/responseFormat');
const bcrypt = require('bcrypt');

module.exports = {
  async update(req, res) {
    const { username, password } = req.body;
    const { idUser, goal, grade } = req.params;

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
}