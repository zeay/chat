var socket = io();
var userData={
    name: "",
    message: "",
}
function scrollToBottom(){
    //selectors
    var messages = $("#messages");
    var newMessage = messages.children("li:last-child");
    //heights
    var scrollTop = messages.prop("scrollTop");
    var clientHeight = messages.prop("clientHeight");
    var scrollHeight = messages.prop("scrollHeight");
    var newMessageHeight =newMessage.innerHeight();
    var prevMessages = newMessage.prev().innerHeight();
    
    if(clientHeight + scrollTop + newMessageHeight + prevMessages >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

socket.on("connect", ()=>{
    console.log("connected to the Server");
    var param = $.deparam(window.location.search);
    $("#users").html("");
    socket.emit("join", param, (err)=>{
        if(err){
            alert(err);
            window.location.href = "/";
        }else{
            console.log("No error");
        }
    })
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

socket.on("updateUserList", (users)=>{
    console.log("Users are "+ users)
    var ol = $("<ol></ol>");
    users.forEach((user)=>{
        ol.append($("<li></li>").text(user));
    })
    $("#users").append(ol);
})

socket.on("newMessage", (data)=>{
    var formatedTime = moment(data.createdAt).format("h:mm a");
    var template = $("#message-template").html();
    var html = Mustache.render(template, {
        from: data.from,
        text: data.text,
        createdAt: formatedTime
    });
    $("#messages").append(html);
    scrollToBottom();
/*    console.log("New Message is ", data);
    var li  = $('<li></li>');
    li.text(`${(data.from)} ${formatedTime} : ${(data.text)}`);*/
    
});

socket.on("newLocation", (locationData)=>{
    var formatedTime = moment(locationData.createdAt).format("h:mm a");
    var template = $("#message-locationTemplate").html();
    var html = Mustache.render(template, {
        from: locationData.from,
        url: locationData.url,
        createdAt: formatedTime
    });
    $('#messages').append(html);
    scrollToBottom();
/*    var li = $('<li></li>');
    var a = $('<a target = "_blank">My Location</a>')
    a.attr('href', locationData.url);
    li.text('Admin: ' + formatedTime + " :");
    li.append(a);
    */
})

$('#message-form').on('submit', (e)=>{
    e.preventDefault();
    
    socket.emit('createMessage', userData= {
        message: $("[name = message]").val(),
    }, (ack)=>{
        console.log("Send Message");
/*        console.log("Got it", ack);
        var selfli  = $('<li></li>');
        console.log(userData)
        selfli.text(`${userData.name} : ${userData.message}`);
        $("#messages").append(selfli);
        */
    });
});
// share Location Button and Geo Location ////////////
var shareLocation = $("#location-btn");
shareLocation.on("click", ()=> {
    if(!navigator.geolocation){
        alert("Geo Location is not supported");
    }else{
        shareLocation.attr('disabled', 'disabled').text("Sending Location....");
        navigator.geolocation.getCurrentPosition((position)=>{
            shareLocation.removeAttr('disabled').text("Share Location");
            socket.emit("positionCords", {
                longitude:position.coords.longitude,
                latitude:position.coords.latitude
            });
        }, ()=>{
            shareLocation.removeAttr('disabled').text("Share Location");
            alert("Some problem with your Network or you doesn't allow us ");
        });
    }
});




/*socket.on("greedNewUser", (data)=>{
    console.log(data);
});
socket.on("byAdmin", (data)=>{
    console.log(data);
});*/