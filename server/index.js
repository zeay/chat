const express = require("express");
const path  = require("path");
const http = require("http");
const socketIO =  require("socket.io");
const staticDirName = path.join(__dirname, "../client");

const port = process.env.PORT || 3000;
const app = express();

var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(staticDirName));

io.on("connection", (socket)=>{
    console.log("New user Connected " +socket.id);
    
    socket.on("createMessage", (data)=>{
        console.log("New Message Created ", data);
        io.emit("newMessage", {
            name: data.name,
            message: data.message,
            timestamp: new Date().getTime(),
        });
    });
    
    socket.on("disconnect", ()=>{
        console.log("socket Disconnected ");
    });
});



server.listen(port,(err)=>{
    if(err) throw err;
    console.log(`Server is running on port ${port}`);
});
