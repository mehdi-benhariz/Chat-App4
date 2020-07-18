const express = require('express');
const socketio = require('socket.io');
const http  = require('http')

const app = express()
const port = process.env.PORT || 5000

const router = require('./router');

const {log} = console;
const server  = http.createServer(app);
const io = socketio(server);
//socket routing
io.on('connection',(socket)=>{
    log(`we have new connection`);


    socket.on('disconnect',()=>{
      log(`User had left`)
    })
})


io.on('connection',(socket)=>{
    console.log(`we have new connection`)
})

//midilware
app.use(router)

// app.get('/', (req, res) => res.send('Hello World!'))
server.listen(port, () => console.log(`Example app listening on port http://localhost:${port} !`))