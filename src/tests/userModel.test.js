/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
require('mocha');
const chai = require('chai');
const User = require('../models/user');
const connection = require('../data/patre-eth-db');

const should = chai.should();

const user = {
  username: 'test1',
  password: 'test1',
  email: 'john.fakey.email@gmail.com',
};

describe('User model', function () {
  it('Should be created in the database when given correct information',
    function (done) {
      const createdUser = new User(user);
      createdUser
        .save()
        .then(function (savedUser) {
          return Promise.all([savedUser, User.findById(savedUser._id)]);
        })
        .then(function (data) {
          should.exist(data[0]);
          should.exist(data[1]);
          data[1].should.be.an('object');
          return Promise.all([User.findByIdAndDelete(data[0]._id)]);
        })
        .then(function () {
          done();
        })
        .catch(function (err) {
          console.log(err);
        });
    });
});

after(function (done) {
  console.log('Closing connection');
  connection.close();
  done();
});
