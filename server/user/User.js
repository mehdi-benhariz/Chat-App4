const {Schema,model} = require("mongoose");

const UserSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    register_date: {
      type: Date,
      default: Date.now,
    },
    login: {
      type: Boolean,
      default: false,
    },
  });
  
  const User = model("user", UserSchema);
  
  module.exports = User;