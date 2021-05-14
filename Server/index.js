'use strict'

var fs = require('fs');
var app = require('express')();
var https = require('https');
var server = https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/hubandrock.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/hubandrock.com/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/hubandrock.com/chain.pem'),
    requestCert: false,
    rejectUnauthorized: false
},app);

server.listen(3000, () => {
    console.log("Socket.io server is listening on port 3000")
})
// const serverHttp = require('http').Server(app)
// const io = require('socket.io')(serverHttp, {
//     cors: {
//         origin: "https://hubandrock.com",    // https://hubandrock.com !
//         methods: ["GET", "POST"],
//         allowedHeaders: ["my-custom-header"],
//         credentials: true
//     }
// });

var io = require('socket.io').listen(server);

var users = [];
var commonRoomName;

io.on('connection', function (socket) {
    console.log("A user connected!");
    
    socket.on('common_room', function(commonRoomName) {
        socket.join(commonRoomName);
        this.commonRoomName = commonRoomName;
        console.log("New person joined on " + this.commonRoomName)
    })

    //Append new user to userList
    socket.on('user_connected', function(roomId) {
        if(!users.includes(roomId)){
            users.push(roomId);
        }
        
        socket.join(roomId);

        console.log("ACTIVE SOCKETS:");
        console.log(socket.rooms);
        
        io.emit("user_connected", users);
    })

    socket.on('send_message', function(data) {
        io.sockets.in(data.roomId).emit('new_message', data);
        io.sockets.in(this.commonRoomName).emit('new_message_commonRoom', data)
        // socket.broadcast.to(sendTo).emit('new_message', data);
    });

    socket.on('user_disconnected', function(roomId) {
        
        console.log("ROOM QUE VOLEM ELIMINAR: " + roomId)
        function arrayRemove(arr, value) {
            return arr.filter(function(ele){
                return ele != value;
            });
        }
        users = arrayRemove(users, roomId);
        socket.leave(roomId);
        
        io.emit("user_disconnected", users);
        console.log("USER LIST:", users);
    })
    
});

