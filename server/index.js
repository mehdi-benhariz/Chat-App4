const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const cookieParser = require('cookie-parser');

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./user/controllers");

const path = require("path");
require("dotenv").config({
  path: path.join(process.cwd(), "/config/.env"),
});

const app = express();
const server = http.createServer(app);
const io = socketio(server);
// parse application/json
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// Connect to a data base
app.use(cors());
//get the cookies
app.use(cookieParser());

//router
const userRouter = require("./user/router");
app.use("/api/v1", userRouter);


require("./db");

io.on("connect", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to room ${user.room} <3 .`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined :D !` });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    console.log(socket.id)
    
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left :( .`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(process.env.PORT || 5000, () =>
  console.log(`Server has started.`)
);
