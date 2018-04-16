var socket = io();

socket.on("connect", ()=>{
    console.log("connected to the Server");
});

socket.on("disconnect", ()=>{
    console.log("Server Disconnected");
});

//socket.emit("createMessage", {
//    name: "Client",
//    message: "Hello Server",
//});

socket.on("newMessage", (data)=>{
    console.log("New Message is ", data);
});