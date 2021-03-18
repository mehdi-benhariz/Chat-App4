const {Schema,model} = require("mongoose");

const UserSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    room:{
        type:String,
        default:""      
    },
    email: {
      type: String,
      required: true,
      unique: true,
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