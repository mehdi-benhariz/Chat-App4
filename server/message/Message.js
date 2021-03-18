const { Schema, model } = require("mongoose");

// Create Schema
const MessageSchema = new Schema({
  body: {
    type: String,
    require: true,
  },
  send_Date: {
    type: Date,
    default: Date.now(),
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  status: {
    type: String,
    default: "send",
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: "room",
    require: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

const Message = model("message", MessageSchema);

module.exports = Message;