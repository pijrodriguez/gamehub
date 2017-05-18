var userAccount;
var  msgInp = document.getElementById("msg");
var topLogo = document.getElementById("topper");
var editProfile = document.getElementById("profile");
var sendBut = document.getElementById("send");

topLogo.addEventListener("click", function(){
    location.href = "/"
});

editProfile.addEventListener("click", function(){
    location.href = "/profile"
})

msgInp.addEventListener("keyup", function(){
   if(msgInp.value == ""){
       sendBut.disabled = true;
   }else{
    sendBut.disabled = false;
    }
});
var roomHeader = document.getElementById("room_header");
$(document).ready(function(){
    $.ajax({
        url:"/topic/roomId",
        type:"post",
        data:{
            type: "read"
        },
        success:function(resp){
            if(resp.status == "success"){
                var msgs = resp.arr;
                var index = resp.roomID;
                for(var i = 0; i<msgs[index].length; i++){
                    var threadContainer = document.createElement("div");
                    var chatBubble = document.createElement("div");
                    var userInfo = document.createElement("div");
                    var userImg = document.createElement("img");
                    var userName = document.createElement("h5");

                    //append to appropriate divs           
                    threadContainer.appendChild(userInfo);
                    threadContainer.appendChild(chatBubble);
                    userInfo.appendChild(userName);
                    userInfo.appendChild(userImg);

                    //css
                    threadContainer.className = "chat_thread";
                    chatBubble.className = "chat_bubble text-center";
                    userImg.className = "user_image";
                    userInfo.className = "user_info";
                    userName.className = "user_name";

                    userName.innerHTML = msgs[index][i].user.user;
                    chatBubble.innerHTML = msgs[index][i].msg;
                    userImg.src = msgs[index][i].user.avatar;
                    userName.style.color = msgs[index][i].user.gender;


                    //append it to the chat box
                    document.getElementById("chat_box").appendChild(threadContainer);

                }
            }
        }
    })
    
    $.ajax({
        url:"/topic/roomId",
        type:"post",
        data:{
            type: "create"
        },
        success:function(resp){
            
            $.ajax({
                url:"/user",
                type:"post",
                data:{
                    type:"read"
                },
                success:function(resp){
                    userAccount = resp;
                }
            })
            //display the room name
            var title = document.createElement("h3");
            title.id = "room_title";
            roomHeader.appendChild(title);
            title.innerHTML = resp.roomName;
            title.className = "text-center"
            
            //start sockets and pass the roomId over
            initSockets(resp.roomID);
        }
    })
    
    
})
function initSockets(roomID){
        //connect to the io opened tunnel in the server
        var socket = io();
    
        //send a message to join a room
        socket.emit("join room", roomID);
        
        sendBut.addEventListener("click", function(){
            //when clicked, use your socket to send a message
            //create an obj to send over
            var obj = {
              msg: msgInp.value,
                user: userAccount
            };
            msgInp.value = "";
            
            //use your socket to send a message over and pass long the object
            //emit function means send a message
            socket.emit("send message", obj);
        });
        
        //what to do if server sents the message "create room" over
        socket.on("create message", function(obj){
            //the function(obj) obj holds information of what was sent over
            console.log(obj);
            
            //create elements for the chat bubble
            var threadContainer = document.createElement("div");
            var chatBubble = document.createElement("div");
            var userInfo = document.createElement("div");
            var userImg = document.createElement("img");
            var userName = document.createElement("h5");
            
            //append to appropriate divs           
            threadContainer.appendChild(userInfo);
            threadContainer.appendChild(chatBubble);
            userInfo.appendChild(userName);
            userInfo.appendChild(userImg);
            
            //css
            threadContainer.className = "chat_thread";
            chatBubble.className = "chat_bubble text-center";
            userImg.className = "user_image";
            userInfo.className = "user_info";
            userName.className = "user_name";
            
            userName.innerHTML = obj.user.user;
            chatBubble.innerHTML = obj.msg;
            userImg.src = obj.user.avatar;
            userName.style.color = obj.user.gender;
            
            
            //append it to the chat box
            document.getElementById("chat_box").appendChild(threadContainer);

        })
}