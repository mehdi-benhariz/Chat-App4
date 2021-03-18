const jwt = require("jsonwebtoken");
const User = require("../user/User")
exports.createJWT = (email, userId, duration) => {
  const payload = {
    email,
    userId,
    duration,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: duration,
  });
};

exports.getUserByToken = async (token) => {
  const decode = await jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decode.userId);
  return user;
};
