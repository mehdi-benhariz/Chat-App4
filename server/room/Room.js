const {model,Schema} = require("mongoose")

const RoomSchema = new Schema({
    name: {
      type: String,
      require: true,
    },
    users:[
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      }
      
    ]
    
  });
  
  const Room = model("room", RoomSchema);
  
  module.exports = Room;