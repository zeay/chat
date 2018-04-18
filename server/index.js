const express = require("express");
const path  = require("path");
const http = require("http");
const socketIO =  require("socket.io");


const {genrateMessage, genrateLocationMessage} = require("./utils/message");
const {realString} = require("./utils/validate");
const {User} = require('./utils/user');
const staticDirName = path.join(__dirname, "../client");

const port = process.env.PORT || 3000;
const app = express();
const users = new User();

var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(staticDirName));

io.on("connection", (socket)=>{
    console.log("New user Connected " +socket.id);
    
    socket.on('join', (param, callback)=> {
        if(!realString(param.displayName) || !realString(param.roomName)){
            return callback("Name and Room Name must be there and schould be in string");
        } 
        if(users.getUserByName(param.displayName)){
            return callback("User With Same Name already There Please Use Different Name.");
        }
//        console.log(users.getUserByName(param.name));
        users.removeUser(socket.id);
        users.addUser(socket.id, param.displayName, param.roomName);
        socket.join(param.roomName);
        
        io.to(param.roomName).emit("updateUserList", users.getUserList(param.roomName));
        socket.emit("newMessage", genrateMessage("Admin", "Welcome to the chat App"));
        socket.broadcast.to(param.roomName).emit("newMessage", genrateMessage("Admin", "New User Connected "+param.displayName));
        callback();
    })
    
    socket.on("createMessage", (data, accknowledgement)=>{
        var user = users.getUser(socket.id);
        if(user && realString(data.message)){
            io.to(user.room).emit("newMessage", genrateMessage(user.name, data.message));
        }
        accknowledgement();
    });
    socket.on("positionCords", (cords)=>{
        console.log(cords);
        var user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit("newLocation", genrateLocationMessage(user.name,cords.latitude, cords.longitude));
        }
    });
    
    socket.on("disconnect", ()=>{
        console.log("socket Disconnected ");
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', genrateMessage("Admin", `${user.name} is got Disconnected`));
        }
    });
});



server.listen(port,(err)=>{
    if(err) throw err;
    console.log(`Server is running on port ${port}`);
});
