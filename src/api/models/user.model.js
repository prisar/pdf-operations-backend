const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const generator = require('generate-password');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { map } = require('lodash');
const { jwtConfig } = require('../../config/vars');
const APIError = require('../utils/APIError');

/**
* User Roles
*/
const WEB_ACCESS = ['admin', 'appuser'];

/**
 * User Schema
 * @private
 */
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30,
  },
  lastname: {
    type: String,
    required: false,
    maxlength: 30,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    maxlength: 20,
  },
  userslug: {
    type: String,
    minLength: 1,
    maxLength: 15,
  },
  password: {
    type: String,
    required: false,
  },
  langpref: {
    type: String,
    required: true,
    maxLength: 5,
    defaultsTo: 'en',
  },
  roles: {
    type: mongoose.Schema.Types.Mixed,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 10,
  },
  phones: {
    type: [String],
    required: false,
  },
  phonevertoken: {
    type: String,
    maxlength: 8,
  },
  appvertoken: {
    type: String,
    maxlength: 8,
  },
  archived: {
    type: Boolean,
    required: true,
    default: false,
  },
  picid: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 36,
    default: 'default',
    get: key => (key ? `https://s3.amazonaws.com/sksksk.img/${key}-big.jpg` : undefined),
  },
  cityid: {
    type: Number,
  },
}, {
  collection: 'user',
  strict: false
});

userSchema.set('toObject', { getters: true });
userSchema.set('toJSON', { getters: true });

userSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'firstname', 'lastname', 'roles', 'picid', 'cityid', 'phone'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

  async verifyPassword(password) {
    const passComparison = await bcrypt.compare(password, this.password);
    return passComparison;
  },

  token() {
    const token = jwt.sign({
      id: this._id,
      createdAt: this.createdAt,
    },
    jwtConfig.secret, {
      algorithm: jwtConfig.algo,
      expiresIn: jwtConfig.expiry * 60,
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    });

    return token;
  },
});

/**
 * Statics
 */
userSchema.statics = {

  WEB_ACCESS,

  async appLogin({ username, password }) {
    const err = {
      status: httpStatus.FORBIDDEN,
      message: 'Access denied',
      isPublic: true,
    };
    const user = await this.findOne({
      $or: [
        { username },
        { email:  username},
        { phone: username },
        { phones: { $in: username } },
      ],
      // 'roles.name': { $in: WEB_ACCESS }, // role based access
      archived: false,
    });

    if (user) {
      const flag = await user.verifyPassword(password);
      if (flag) {
        user.roles = map(user.roles, role => role.name);
        return user;
      }
      err.status = httpStatus.UNAUTHORIZED;
      err.message = 'Incorrect credentials';
    }
    throw new APIError(err);
  },

  async generatepassword() {
    const password = generator.generate();
    // console.log('password: ', password);
    // Salt rounds is kept same as core
    const passwordhash = await bcrypt.hash(password, 10);
    return { password, passwordhash };
  },

  async resetPassword({ username }) {
    const err = {
      status: httpStatus.NOT_FOUND,
      message: 'User not found',
      isPublic: true,
    };
    const user = await this.findOne({
      $or: [
        { username },
        { phone: username },
        { phones: { $in: username } },
      ],
      // 'roles.name': { $in: WEB_ACCESS }, // limit the access to specific roles
      archived: false,
    });

    if (user) {
      const passworddata = await this.generatepassword();
      console.log('password: ' + passworddata.password);
      user.password = passworddata.passwordhash;
      await user.save();

      return { user, password: passworddata.password };
    }
    throw new APIError(err);
  },
};

module.exports = mongoose.model('User', userSchema);
