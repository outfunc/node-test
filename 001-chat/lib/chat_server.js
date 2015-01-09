var socketio = require("socket.io");
var io,
    guestNumber = 1,
    nickNames = {},
    namesUsed = [],
    currentRoom = {};

exports.listen = function(server) {
    io = socketio.listen(server);


   	console.log("test")

    io.sockets.on('connection', function(socket) {
        console.log( socket );

        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);

        joinRoom(socket, "Lobby");

        handleMessageBroadcasting(socket, nickNames);
        handleNameChangeAttempts(socket, nickNames, namesUsed);

        handleRoomJoining(socket);

        socket.on("room", function() {
            socket.emit('rooms', io.sockets.manager.rooms);
        });

        handleClientDisconnection(socket, nickNames, namesUsed);

    })
}



function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    var name = "Guest" + guestNumber;
    nickNames[socket.io] = name;

    socket.emit('nameResult', {
        success: true,
        name: name
    });

    namesUsed.push(name);
    return guestNumber + 1;
}


function joinRoom(socket, room) {
    socket.join(room);

    currentRoom[socket.id] = room;

    socket.emit("joinResult", {
        room: room
    });

    socket.broadcast.to(room).emit('message', {
        text: nickNames[socket.id] + ' has joined ' + room + '.'
    });

    var usersInRoom = io.sockets.clients(room);
    if (usersInRoom.length > 1) {
        var usersInRoomSummary = 'Users currently in ' + room + ': ';
        for (var index in usersInRoom) {
            var userSocketId = usersInRoom[index].id;
            if (userSocketId != socket.id) {
                if (index > 0) {
                    usersInRoomSummary += ', ';
                }
                usersInRoomSummary += nickNames[userSocketId];
            }
        }
        usersInRoomSummary += '.';
        socket.emit('message', {
            text: usersInRoomSummary
        });
    }
}
function handleMessageBroadcasting(){

}

function handleNameChangeAttempts( socket, nickNames, namesUsed ){
    socket.on('nameAttempt', function(name){
        if( name.indexOf("Guest") == 0 ){
            socket.emit('nameResult', {
                success : false,
                message : 'Names cannot begin with "Guests"'
            });
        }else{
            if( namesUsed.indexOf(name) == -1 ){
                var previousName = nickNames[socket.id];
                var previousNameIndex = namesUsed.indexOf(previousName);
                namesUsed.push( name );
                nickNames[socket.id] = name;
                delete namesUsed[previousNameIndex];

                socket.emit('nameResult', {
                    success : true,
                    name : name
                });

                socket.broadcast.to(currentRoom[socket.id]).emit(
                    'message',{
                        text : previousName + " is now known as " + name + '.'
                });
            }else{
                socket.emit('nameResult', {
                    success : false,
                    message : "That name is already in use."
                });
            }
        }
    })
}

function handleRoomJoining(){

}

function handleClientDisconnection(){

}
