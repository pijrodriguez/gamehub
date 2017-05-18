//node node_modules\webpack\bin\webpack.js --> FOR CMD PURPOSES
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const port = process.env.PORT || 10000;

//require session
const session = require("express-session");

var pFolder = path.resolve(__dirname, "public");
var app = express();
app.use("/css", express.static("css"));
app.use("/images", express.static("images"));

//variables
var topics = [];
var users = [];
var messages = [];
var unknownUser = {user:"Unknown", avatar:"/images/noavatar.jpg", gender:"#FFF"
                  };

//create a new server for socket, but combine it with express functions
const server = require("http").createServer(app);

//create a socket server with the new server
var io = require("socket.io")(server);

app.use("/scripts", express.static("build"));

//use sessions
app.use(session({
    secret:"whatever stuff", //for cookie handling, type whatever you want
    resave:true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/topic/:roomindex", function(req, resp){
    console.log(req.params.roomindex);
    var index = req.params.roomindex;
    
    //store the room id to the sessions
    req.session.roomID = index;
    
    //resp.end("You are in Room "+index+". Room name "+allRooms[index]);
    resp.sendFile(pFolder+"/room.html");
})

app.post("/user", function(req, resp){
    if(req.session.account == undefined){
        req.session.account = unknownUser;
    }
    if(req.body.type == "create"){
    users.push(req.body.obj);
    req.session.account = req.body.obj;
        
    resp.send({
        status:"success",
        account:req.body.obj
        });
    }
    else if(req.body.type == "read"){
        resp.send(req.session.account)
        }
});

app.post("/topic/roomID", function(req, resp){
    //get it from the session variable
    if(req.body.type == "create"){
        var obj = {
            roomID: req.session.roomID,
            roomName: topics[req.session.roomID].topic
        }
        resp.send(obj);
        }
    else if(req.body.type == "read"){
        resp.send({
            status:"success",
            roomID: req.session.roomID,
            arr:messages
        })
    }
});

app.post("/roomCRUD", function(req, resp){
    console.log(req.body);
    //if create
    if(req.body.type == "create"){
        //when we have a database put this new room data in there
        topics.push(req.body.obj); //push the name of the room intothe array
        messages.push([]);
        //send data back for good practice so there's an indication that it works
        resp.send({
            status:"success",
            name:req.body.obj,
            index:topics.length-1
        });
    } else if(req.body.type == "read"){
        resp.send({
            status:"success",
            arr:topics
        });
    }
});


app.get("/", function(req, resp){
    resp.sendFile(pFolder+"/main.html");
})

app.get("/topics", function(req,resp){
    resp.sendFile(pFolder+"/topics.html");
})

app.get("/profile", function(req,resp){
    resp.sendFile(pFolder+"/profile.html");
})


io.on("connection", function(socket){
    //when a user goes to my html they will be in "connection" with my server via the port
    
    //what to dowhen a user sends "join room"
    socket.on("join room", function(roomID){
        socket.roomID = "room"+roomID;  
        socket.join(socket.roomID);
        socket.id = roomID;
        
    });
    
    //what to do when a user sends the message "send message" over
    socket.on("send message", function(obj){
        //function(obj) the obj argument is the obj that was sent over
        
        //push the the user info and chat to the messages array
        messages[socket.id].push(obj);
        
        //tell the server to send a message "create message" to everybody
        io.to(socket.roomID).emit("create message", obj);
    });
    
    socket.on("disconnect", function(){
        //when the user leaves my html, they "disconnect" by closing the connection
    });
});

server.listen(port, function(err){
    if(err){
        console.log("Error: "+err);
        return false;
    }
    
    console.log(port+" is running");
})