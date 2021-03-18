const User = require("../user/User")
const Device = require("../user/Device")
const jwt = require("jsonwebtoken")

exports.auth = async (req, res, next) => {
    const { token } = req.cookies;
    try {
      if (token) {
        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        req.body = {
          ...req.body,
          user_id: decode._id,
        };
        next();
      } else {
        return res.status(403).json({ message: "access denied" });
      }
    } catch (error) {
      console.log("error");
      console.log("err:", error);
    }
  };
  
  exports.admin = async (req, res, next) => {
    const { token } = req.cookies;
    try {
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      const user =  User.findById(decode.userId);
      if(user.isAdmin)
        next();
      else
       return res.status(403).json({ message: "access denied" });
  
    } catch (error) {
      console.log("error");
      console.log("err:", error);
    }
  
  };
// sokcet auth
exports.socketAuth = async (io_id, _id) => {
  try {
    let user = await User.findById(_id);
    let connectionExist = await Device.findOne({ io_id });
    if (!connectionExist) {
      const newConnection = new Device({
        user: user._id,
        io_id: io_id,
      });
      const savedConnection = await newConnection.save();
      console.log(
        `${user.name} is online with socket id : ${savedConnection.io_id}`
      );
    }
    user.login = true;
    await user.save();
  } catch (error) {
    console.log(error);
  }
};

exports.disconnectUser = async (id) => {
  try {
    console.log(`Disconnecting user with socket id : ${id}`);
    const deletedConnection = await Device.findOneAndDelete({ io_id: id });
    const existingConnections = await Device.find({
      user: deletedConnection.user,
    });
    if (existingConnections.length === 0) {
      let user = await User.findById(deletedConnection.user);
      if (user) {
        user.login = false;
        await user.save();
        console.log(`${user.name} is offline`);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
