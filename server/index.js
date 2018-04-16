const express = require("express");
const path  = require("path");
const http = require("http");
const socketIO =  require("socket.io");
const genrateMessage = require("./utils/message");
const staticDirName = path.join(__dirname, "../client");

const port = process.env.PORT || 3000;
const app = express();

var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(staticDirName));

io.on("connection", (socket)=>{
    console.log("New user Connected " +socket.id);
    
    socket.emit("newMessage", genrateMessage("Admin", "Welcome to the chat App"));
    
    socket.broadcast.emit("newMessage", genrateMessage("Admin", "New User Connected "+ socket.id));
    
    socket.on("createMessage", (data, accknowledgement)=>{
        console.log("New Message Created ", data);
        socket.broadcast.emit("newMessage", genrateMessage(data.name, data.message));
        accknowledgement("This is from server");
    });
    
    socket.on("disconnect", ()=>{
        console.log("socket Disconnected ");
    });
});



server.listen(port,(err)=>{
    if(err) throw err;
    console.log(`Server is running on port ${port}`);
});
