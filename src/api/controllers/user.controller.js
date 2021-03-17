const httpStatus = require('http-status');
const User = require('../models/user.model');

/**
 * Create app user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const pwddata = await User.generatepassword();
    const userslug = (`${req.body.firstname}${req.body.lastname || ''}`).replace(/\s+/g, '').toLowerCase().substring(0, 15);
    const cnt = await User.count({ userslug });
    const cleanSlug = userslug.replace(/[^\w.-]+/g, '');
    const username = cnt ? `${cleanSlug}-${cnt}` : cleanSlug;

    const userdata = {
      ...req.body,
      password: pwddata.passwordhash,
      langpref: 'en',
      userslug,
      username,
    };
    console.log(userdata);
    const user = await User.create(userdata);
    return res.json({ code: httpStatus.OK, message: 'User created successfully', user: user._id });
  } catch (error) {
    return next(error);
  }
};
