require('cookie-parser');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');

module.exports = (app) => {
  app.post(
    '/user/create',
    body('username').isString(),
    body('password').isString().isStrongPassword(),
    body('email').isEmail(),
    // eslint-disable-next-line consistent-return
    (req, res) => {
      if (req.user !== null) {
        return res.status(401).send({ message: 'Already Logged in' });
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // eslint-disable-next-line no-console
        console.log(errors);
        return res.status(400).send({ message: 'Invalid username or password.' });
      }
      User
        .findOne({ username: req.body.username })
        // eslint-disable-next-line consistent-return
        .then((foundUser) => {
          if (foundUser !== null) {
            return (res.status(400).send({ message: 'Username already taken.' }), null);
          }
          const user = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
          });
          return Promise.all([user.save()]);
        })
        .then((savedUser) => {
          if (savedUser !== null) {
            return res.redirect('/');
          }
          return null;
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).send({ message: 'Something went wrong.' });
        });
    },
  );
  app.put(
    '/user/update',
    // eslint-disable-next-line consistent-return
    (req, res) => {
      if (req.user === null) {
        return res.redirect('/');
      }
      User
        // eslint-disable-next-line no-underscore-dangle
        .findOneAndUpdate({ _id: req.user._id }, {
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
        })
        .then(() => res.render('user'))
        // eslint-disable-next-line no-console
        .catch((err) => console.log(err));
    },
  );
  app.delete(
    '/user/delete',
    (req, res) => {
      User
        // eslint-disable-next-line no-underscore-dangle
        .findByIdAndDelete(req.user._id, (err) => {
          res.clearCookie('nToken');
          // eslint-disable-next-line no-console
          console.log(err);
          return res.redirect('/');
        });
    },
  );
  app.post(
    '/user/login',
    body('username').isString(),
    body('password').isString().isStrongPassword(),
    (req, res) => {
      if (req.user === null) {
        User
          .findOne({ username: req.body.username })
          .then((foundUser) => {
            foundUser.comparePassword(req.body.password, (err, isMatch) => {
              if (!isMatch) {
                // Password does not match
                return res.status(401).send({ message: 'Wrong Username or password' });
              }
              // eslint-disable-next-line no-underscore-dangle
              const token = jwt.sign({ _id: foundUser._id }, process.env.SECRET, { expiresIn: '60 days' });
              res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
              return res.redirect('/');
            });
          });
      }
      return res.status(404).send({ message: 'Something bad happened.' });
    },
  );
};
