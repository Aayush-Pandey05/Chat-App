import { Server } from "socket.io";// socket.io helps us to build real time event handling in the backend 
import http from "http"; // this is build in to the node js
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server,{ // we are creating a socket.io server
    cors: {
        origin: ["http://localhost:5173"]
    }
});

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

// used to store online users (basically an object where the keys will be userId and the value to that keys would be socket.id)
const userSocketMap = {}; // initially it is empty

io.on("connection", (socket)=>{ // here we are listening for connections and here socket is the user
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId; // we are taking the input from the useAuthStore.js as userId from the query that has been passed

    if(userId) userSocketMap[userId] =socket.id;

    //io.emit() is used to send events to all connected clients 
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // here getOnlineUsers is the name of the event and we are passing the key of the object userSocketMap along with it
    // this will tell the users who all are oline 
    socket.on("disconnect",()=>{
        console.log("A user disconnected", socket.id);
        // now after the user is disconnected we will remove the id from the object so that we can tell everyon that the user is offline
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

export { io, app, server };