const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

const ResponseFormat = require('../utils/responseFormat');

function extractToken(header) {
  if (!header) {
    return null;
  }

  const headerParts = header.split(' ');

  if (headerParts.length < 2 || headerParts[0] !== 'Bearer') {
    return null;
  }

  return headerParts[1];
}

exports.userAuthenticate = (req, res, next) => {
  const token = extractToken(req.headers.authorization);
  if (!token) {
    return new ResponseFormat(res).forbidden('No token provided').send();
  }

  return jwt.verify(token, authConfig.users.jwt.privateKey, (err, decoded) => {
    if (err) {
      return new ResponseFormat(res).forbidden('Failed to authenticate token').addPayload({ resetToken: 'access' }).send();
    }
    if (req.body.userId && (req.body.userId !== decoded.userId.toString())) {
      return new ResponseFormat(res).forbidden('Authorization rejected').send();
    }

    req.session = decoded;
    return next();
  });
};
