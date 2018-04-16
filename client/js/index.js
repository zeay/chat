var socket = io();
var userData={
    name: "",
    message: "",
}

socket.on("connect", ()=>{
    console.log("connected to the Server");
});

socket.on("disconnect", ()=>{
    console.log("Server Disconnected");
});

/*socket.emit("createMessage", {
    name: "Client",
    message: "Hello Server",
}, (ack)=>{
    console.log("Got it", ack);
});*/

socket.on("newMessage", (data)=>{
    console.log("New Message is ", data);
    var li  = $('<li></li>');
    li.text(`${data.from} : ${data.text}`);
    $("#messages").append(li);
});

$('#message-form').on('submit', (e)=>{
    e.preventDefault();
    
    socket.emit('createMessage', userData= {
        name: "User",
        message: $("[name = message]").val(),
    }, (ack)=>{
        console.log("Got it", ack);
        var selfli  = $('<li></li>');
        console.log(userData)
        selfli.text(`${userData.name} : ${userData.message}`);
        $("#messages").append(selfli);
    });
});


/*socket.on("greedNewUser", (data)=>{
    console.log(data);
});
socket.on("byAdmin", (data)=>{
    console.log(data);
});*/