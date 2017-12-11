const express = require('express');
const mongoose = require('mongoose');
const config = require('config');

// Connexion à la base de données
console.log(config);
const dbConfig = config.get('Mlab.dbConfig');
mongoose.connect(dbConfig.host);

express.Router.group = function group(path, callback) {
  const router = express.Router({ mergeParams: true });
  callback(router);
  this.use(path, router);
  return router;
};
express.application.group = express.Router.group;

const app = express();
app.set('port', process.env.PORT || 3001);

// const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

// Express only serves static assets in production
// TODO: build the admin interface in the ./front folder
// app.use(express.static('front/build'));

if (process.env.NODE_ENV === 'production') {
  app.use(logger('tiny'));
} else if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

// Enabling CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, HEAD, DELETE");
  next();
});

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

const apiRoutes = require('./routes');
const ResponseFormat = require('./utils/responseFormat');

app.use('/api', apiRoutes);

app.all('*', (req, res) => new ResponseFormat(res).notFound().send());

app.listen(app.get('port'), () => {
  console.log(`Admin server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});

module.exports = app;
