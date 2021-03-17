const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const moment = require('moment');
const { jwtConfig } = require('./vars');
const User = require('../api/models/user.model');

const jwtOptions = {
  secretOrKey: jwtConfig.secret,
  issuer: jwtConfig.issuer,
  audience: jwtConfig.audience,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
};

const jwt = async (payload, done) => {
  try {
    // check if token is expired or not
    if (moment().unix() < payload.exp) {
      const user = await User.findById(payload.id);
      if (user && !user.archived) return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

exports.jwt = new JwtStrategy(jwtOptions, jwt);
