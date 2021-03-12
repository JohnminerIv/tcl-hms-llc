// Require Libraries
require('dotenv').config();
const express = require('express');
require('./data/patre-eth-db');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// Middleware
const bodyParser = require('body-parser');
require('express-validator');

// app setup
const app = express();
// Serve the static files from the React app
app.use('/', express.static(path.join(__dirname, '/public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

const checkAuth = (req, _res, next) => {
  // eslint-disable-next-line no-console
  console.log('Checking authentication');
  if (typeof req.cookies.nToken === 'undefined' || req.cookies.nToken === null) {
    req.user = null;
  } else {
    const token = req.cookies.nToken;
    const decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
    console.log(req.user);
  }
  next();
};

app.use(checkAuth);

module.exports = app;
