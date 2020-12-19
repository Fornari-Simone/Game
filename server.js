let nConnection = 0;
let express = require("express");
let socket = require("socket.io");
let dotenv = require("dotenv").config();
let app = express();
let server = app.listen(process.env.PORT || 3000);
console.log(process.env.PORT)

let ids = [];
app.use(express.static('public'));
let lastID = "";
let io = socket(server);
io.sockets.on('connection', socket => {
    if(nConnection < 2) {
        io.sockets.emit("access", nConnection, socket.id);
        ids.push(socket.id)
        nConnection++;
    }
    else socket.emit('GoAway', "");
    
    socket.on('disconnect', reason => {
        if(ids.indexOf(socket.id) != -1){
            nConnection--;
            io.sockets.emit("disconn", nConnection)
        }
    })

    socket.on('change', (id, data) => {
        if(id === ids[0]) socket.broadcast.to(ids[1]).emit('change', data);
        else if(id === ids[1]) socket.broadcast.to(ids[0]).emit('change', data);
    })
})