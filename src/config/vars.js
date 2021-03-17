const path = require('path');
const { name, version } = require('../../package.json');

// import .env variables
require('dotenv-safe').config({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  pkgConfig: {
    name,
    version,
  },
  jwtConfig: {
    algo: 'HS256',
    secret: process.env.JWT_SECRET,
    expiry: process.env.JWT_EXPIRATION_MINUTES,
    issuer: 'example.com',
    audience: 'example.com',
  },
  mongo: {
    uri: process.env.MONGO_URI,
  },
};
