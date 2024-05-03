// express and body-parser: use in API
// Socket.io: signaling server
// import express from 'express';

const express = require('express');
const bodyParser = require('body-parser');
const {Server} = require('socket.io');

const io = new Server({
    cors: true
});
const app = express(); 

app.use(bodyParser.json());

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map()

io.on('connection', (socket) => {
    console.log('New Connection');
    socket.on('join-room', data =>{

        const {roomId, emailId} = data;
        console.log(`User with emailId ${emailId} joined room ${roomId}`);
        emailToSocketMapping.set(emailId, socket.id);
        socketToEmailMapping.set(socket.id, emailId);
        socket.join(roomId);
        socket.emit('joined-room', {roomId})
        socket.broadcast.to(roomId).emit('user-joined', {emailId});
    })

    socket.on('call-user', (data) =>{
        const {emailId, offer} = data
        const fromEmailId = socketToEmailMapping.get(socket.id);
        const socketId = emailToSocketMapping.get(emailId)
        socket.to(socketId).emit('incomming-call', {from: fromEmailId, offer})
    })

    socket.on('call-accepted', (data) =>{
        const {emailId, ans} = data
        const socketId = emailToSocketMapping.get(emailId)
        
        
        socket.to(socketId).emit('call-accepted', {ans})
    })
})

app.listen(3000, () => console.log('Server is running on port 3000'));
io.listen(3001);