/* eslint-disable max-len */
const httpStatus = require('http-status');
const mustache = require('mustache');
const User = require('../models/user.model');
const templates = require('../../config/templates');

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const user = await User.appLogin(req.body);
    const userTransformed = user.transform();

    return res.json({
      code: httpStatus.OK,
      message: 'Login successful',
      user: userTransformed,
      token: user.token(),
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Resets Password
 * @public
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { user, password } = await User.resetPassword(req.body);
    const msg = mustache.render(templates.resetpassword, {
      name: user.lastname ? `${user.firstname} ${user.lastname}` : user.firstname,
      password,
      helpline: '92929999229',
    });

    return res.json({ code: httpStatus.OK, message: 'Password changed successfully' });
  } catch (error) {
    return next(error);
  }
};
